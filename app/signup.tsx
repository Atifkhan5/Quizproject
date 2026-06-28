import React, { useState } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  Image,
  Alert, 
  ActivityIndicator, 
  TextInput, 
  Pressable, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableWithoutFeedback, 
  Keyboard, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { auth, db } from './firebaseconfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
  login: undefined;
  tab: undefined;
};

const { width } = Dimensions.get('window');

const SignupScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email.trim() || !password || !name.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, 'users', uid, 'sub', 'login'), {
        name: name.trim(),
        email: email.trim(),
        createdAt: new Date().toISOString(),
      });

      navigation.navigate('tab');
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <SafeAreaView style={styles.content}>
            <View style={styles.centerWrapper}>
              
              <View style={styles.imageContainer}>
                <Image
                  source={require('../assets/image.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.header}>
                <Text style={styles.headerTitle}>Create Account</Text>
                <Text style={styles.headerSubtitle}>Join Quizly and start learning</Text>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.glassCard}>
                  <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Full Name"
                      placeholderTextColor="#64748B"
                      value={name}
                      onChangeText={setName}
                      editable={!loading}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Email Address"
                      placeholderTextColor="#64748B"
                      value={email}
                      onChangeText={setEmail}
                      editable={!loading}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={[styles.inputContainer, { borderBottomWidth: 0 }]}>
                    <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      placeholderTextColor="#64748B"
                      secureTextEntry
                      value={password}
                      onChangeText={setPassword}
                      editable={!loading}
                    />
                  </View>
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.mainButton,
                    pressed && styles.buttonPressed,
                    loading && { opacity: 0.7 }
                  ]}
                  onPress={handleSignup}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#0F172A" />
                  ) : (
                    <>
                      <Text style={styles.mainButtonText}>Sign Up</Text>
                      <View style={styles.arrowCircle}>
                        <Text style={styles.arrow}>→</Text>
                      </View>
                    </>
                  )}
                </Pressable>

                <View style={styles.footer}>
                  <Text style={styles.noAccountText}>Already have an account? </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('login')}
                    disabled={loading}
                  >
                    <Text style={styles.loginLinkText}>Login</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
    flex: 1,
    paddingHorizontal: 25,
  },
  centerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 10,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 8,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  glassCard: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#334155',
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 65,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '500',
  },
  mainButton: {
    backgroundColor: '#38BDF8',
    height: 64,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonPressed: {
    transform: [{ scale: 0.97 }],
    backgroundColor: '#7DD3FC',
  },
  mainButtonText: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '800',
    marginRight: 10,
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    color: '#0F172A',
    fontWeight: '900',
    fontSize: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  noAccountText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  loginLinkText: {
    color: '#38BDF8',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default SignupScreen;