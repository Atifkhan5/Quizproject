import { GoogleGenerativeAI } from "@google/generative-ai";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as DocumentPicker from 'expo-document-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { addDoc, collection, doc, getFirestore, increment, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth } from './firebaseconfig';

const db = getFirestore();

const genAI = new GoogleGenerativeAI(
  process.env.EXPO_PUBLIC_GOOGLE_AI_KEY
);
const genModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export default function ToggleInput() {

  const [activeTab, setActiveTab] = useState<'prompt' | 'document' | 'Camera'>('prompt');
  const [text, setText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [currentTopic, setCurrentTopic] = useState('');
  const [count, setcount] = useState(0);
  const [solution, setSolution] = useState('');

  const cameraRef = useRef<any>(null);
  const tabBarHeight = useBottomTabBarHeight();

  useEffect(() => {
    if ((activeTab === 'Camera' || activeTab === 'document') && !permission?.granted) {
      requestPermission();
    }
  }, [activeTab]);

  const handleProcessAI = async (base64Image?: string, answer?: string) => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "Please log in first.");
      return;
    }

    setIsLoading(true);

    try {
      let inputText = '';
      const structuredInstructions = `
You are a quiz assistant.

Rules:
- If generating a quiz → start response with: QUIZ:
- If checking an answer → start response with: RESULT:
- If directly answering a question → start with: ANSWER:
- If invalid input → start response with: INVALID:

If generating quiz, ask only ONE question at a time.
If user asks for MCQs, generate MCQs.
If user asks for Quiz or quiz, Generate Questions not mcqs you only have to generate questions without options or mcqs.
If checking answer, give marks and short explanation.
If User asks a questions, answer it directly without generating a quiz in plan text without bold or using anything.
if user asks random inputs like hi , random type etc then generate invalidate the input and respond with INVALID: Please provide a valid question or request for a quiz.
if user enters the image and contents of the image has a question then answer it directly without generating a quiz in plan text without bold or using anything. and if image is not visible then respond with INVALID: Please provide a valid image with a clear question.
if a quiz question is already generated then donot generate the same question again.
`;

      if (base64Image) {
        const userText = text.trim() || "Solve the problem in this image.";
        inputText = userText;
        setConversationHistory(prev => [...prev, `Image Question: ${userText}`]);

        const result = await genModel.generateContent([
          structuredInstructions + `\n${conversationHistory.join("\n")}\nUser Input: ${userText}`,
          { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
        ]);

        const responseText = result.response.text().trim();

        handleQuizMode(responseText);

        if (!responseText.startsWith("QUIZ:")) {
          setAiResponse(responseText);
        }

        return;
      }

      if (answer) {
        inputText = `
Question: ${currentQuestion}
User Answer: ${answer}
Check and grade this answer.
`;
        setConversationHistory(prev => [...prev, inputText]);
      } else if (isQuizMode) {
        inputText = "Generate another quiz question on the same topic.";
        setConversationHistory(prev => [...prev, inputText]);
      } else {
        inputText = text;
        if (!inputText.trim()) {
          Alert.alert("Error", "Enter text first");
          setIsLoading(false);
          return;
        }
        setConversationHistory(prev => [...prev, inputText]);
      }

      let prompt = structuredInstructions + "\n";
      if (conversationHistory.length > 0) {
        prompt += conversationHistory.join("\n") + "\n";
      }
      if (currentTopic) {
        prompt += `Always continue the quiz on the topic: ${currentTopic}\n`;
      }
      prompt += `User Input: ${inputText}`;

      const result = await genModel.generateContent(prompt);

      const responseText = result.response.text().trim();

      handleQuizMode(responseText);

      if (!responseText.startsWith("QUIZ:")) {
        setAiResponse(responseText);
      }

    } catch (err) {
      console.error(err);
      Alert.alert("AI Error", "Failed to get response");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizMode = async (responseText: string) => {
    if (responseText.startsWith("QUIZ:")) {
      setIsQuizMode(true);
      const question = responseText.replace("QUIZ:", "").trim();
      setCurrentQuestion(question);

      if (!currentTopic) {
        const firstLine = question.split("\n")[0];
        setCurrentTopic(firstLine);
      }
    } else if (responseText.startsWith("RESULT:")) {

      setIsQuizMode(false);

      const marksData = responseText.replace("RESULT:", "").trim();
      const scorematch = marksData.match(/(\d+)\s*\/\s*(\d+)/);

      let obtainmarks = 0;
      let totalmarks = 0;

      if (scorematch) {
        obtainmarks = parseInt(scorematch[1]);
        totalmarks = parseInt(scorematch[2]);
      }

      const uid = auth.currentUser?.uid;

      if (!uid) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      try {
        const subDocRef = doc(db, 'users', uid, 'sub', 'quizParent');

        await addDoc(collection(subDocRef, 'Data'), {
          question: currentQuestion,
          userAnswer: userAnswer,
          marks: obtainmarks,
          totalMarks: totalmarks,
          feedback: marksData,
          timestamp: serverTimestamp(),
        });

        const statsRef = doc(db, 'users', uid, 'stats', 'main');

        await setDoc(statsRef, {
          quizes: increment(1),
          recent: `Quiz: ${currentQuestion} - ${obtainmarks}/${totalmarks}`,
        }, { merge: true });

      } catch (error) {
        console.error("Error saving quiz: ", error);
        Alert.alert("Error", "Failed to save quiz result");
      }

      setUserAnswer('');
      setCurrentQuestion('');
    } else {
      setIsQuizMode(false);
    }
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });

        const manipulated = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 800 } }],
          { base64: true, format: ImageManipulator.SaveFormat.JPEG }
        );

        if (manipulated.base64) {
          handleProcessAI(manipulated.base64);
        }

      } catch {
        Alert.alert("Error", "Failed to capture photo");
      }
    }
  };

  const handleNextQuestion = async () => {
    setUserAnswer('');
    setCurrentQuestion('');
    setIsQuizMode(false);
    await handleProcessAI();
  };

  const endQuiz = () => {
    Alert.alert("The end", "You've completed the quiz!");
    setIsQuizMode(false);
    setCurrentQuestion('');
    setUserAnswer('');
    setConversationHistory([]);
    setCurrentTopic('');
  };

  const tabs: Array<'prompt' | 'document' | 'Camera'> = ['prompt', 'document', 'Camera'];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarHeight + 30 }]}
    >
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputCard}>

        {activeTab === 'prompt' && !isQuizMode && (
          <TextInput
            multiline
            style={styles.textInput}
            placeholder="Ask AI..."
            placeholderTextColor="#94A3B8"
            value={text}
            onChangeText={setText}
          />
        )}

        {isQuizMode && (
          <View style={styles.answerContainer}>
            <Text style={{ color: '#38BDF8', marginBottom: 5 }}>Question:</Text>
            <Text style={{ color: '#F8FAFC', marginBottom: 10 }}>{currentQuestion}</Text>
            <TextInput
              placeholder="Enter your answer..."
              placeholderTextColor="#94A3B8"
              value={userAnswer}
              onChangeText={setUserAnswer}
              style={styles.answerInput}
            />
            <Pressable
              style={styles.submitAnswerButton}
              onPress={() => handleProcessAI(undefined, userAnswer)}
            >
              <View>{isLoading
                ? <ActivityIndicator color="#FFF" />
                : <Text style={styles.buttonText}>Submit Answer</Text>}
              </View>
            </Pressable>
          </View>
        )}

        {activeTab === 'document' && (
          <TouchableOpacity
            style={styles.uploadArea}
            onPress={async () => {
              const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
              console.log(result);
            }}
          >
            <Text style={styles.uploadText}>Upload Document</Text>
          </TouchableOpacity>
        )}

        {activeTab === 'Camera' && (
          <View style={styles.cameraContainer}>
            {!permission?.granted ? (
              <Text style={styles.permissionText}>No Camera Access</Text>
            ) : (
              <CameraView style={styles.cameraPreview} ref={cameraRef} facing="back">
                <Pressable style={styles.cameraButton} onPress={takePhoto}>
                  <Text style={styles.cameraButtonText}>Capture & Solve</Text>
                </Pressable>
              </CameraView>
            )}
          </View>
        )}

      </View>

      {!isQuizMode && (
        <Pressable
          style={({ pressed }) => [
            styles.customButton,
            { opacity: (pressed || isLoading) ? 0.7 : 1 }
          ]}
          onPress={() => handleProcessAI()}
          disabled={isLoading || activeTab === 'Camera'}
        >
          {isLoading
            ? <ActivityIndicator color="#FFF" />
            : <Text style={styles.buttonText}>Generate</Text>}
        </Pressable>
      )}

      {aiResponse !== '' && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Solution:</Text>
          <Text style={styles.resultContent}>{aiResponse}</Text>
        </View>
      )}

      {aiResponse.startsWith("RESULT:") && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Pressable
            style={styles.submitAnswerButton}
            onPress={handleNextQuestion}
          >
            <Text style={styles.buttonText}>Next Question</Text>
          </Pressable>

          <Pressable
            style={styles.submitAnswerButton}
            onPress={endQuiz}
          >
            <Text style={styles.buttonText}>Finish</Text>
          </Pressable>
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },

  scrollContent: {
    padding: 20,
  },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 4,
    marginBottom: 15,
    marginTop: 30,
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },

  activeTab: {
    backgroundColor: '#38BDF8',
  },

  tabText: {
    color: '#A0A0A0',
    fontWeight: '600',
  },

  activeTabText: {
    color: '#0F172A',
  },

  inputCard: {
    backgroundColor: '#1E293B',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#38BDF8',
    padding: 15,
    minHeight: 180,
  },

  textInput: {
    fontSize: 16,
    color: '#F8FAFC',
    textAlignVertical: 'top',
  },

  uploadArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#38BDF8',
    borderRadius: 10,
    padding: 20,
  },

  uploadText: {
    color: '#38BDF8',
    fontWeight: 'bold',
  },

  cameraContainer: {
    flex: 1,
    minHeight: 300,
  },

  cameraPreview: {
    flex: 1,
    height: 300,
    borderRadius: 15,
    overflow: 'hidden',
  },

  cameraButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#38BDF8',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },

  cameraButtonText: {
    color: '#0F172A',
    fontWeight: 'bold',
  },

  customButton: {
    backgroundColor: '#38BDF8',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },

  buttonText: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '600',
  },

  resultCard: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#1E293B',
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#38BDF8',
  },

  resultTitle: {
    fontWeight: 'bold',
    color: '#38BDF8',
    marginBottom: 8,
  },

  resultContent: {
    fontSize: 16,
    color: '#F8FAFC',
    lineHeight: 24,
  },

  permissionText: {
    color: '#F8FAFC',
    textAlign: 'center',
    marginTop: 50,
  },

  answerContainer: {
    marginTop: 20,
  },

  answerInput: {
    backgroundColor: '#0F172A',
    color: '#F8FAFC',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#38BDF8',
  },

  submitAnswerButton: {
    backgroundColor: '#38BDF8',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
    flex: 1,
    marginHorizontal: 5,
  },

});