import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { auth, db } from './firebaseconfig';

type RootStackParamList = {
  tab: undefined;
  signup: undefined;
};

const HelloWorldApp = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Email and password are required');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const uid = userCredential.user.uid;
      const docRef = doc(db, 'users', uid, 'sub', 'login');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        navigation.navigate('tab');
      } else {
        Alert.alert('Error', 'No user data found!');
      }
    } catch (error: any) {
      Alert.alert('Login Failed', 'Check your credentials and try again');
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
              
               
              <Image
                source={require('../assets/image.png')}
                style={styles.image}
                resizeMode="contain"
              />

              
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Welcome Back</Text>
                <Text style={styles.headerSubtitle}>Log in to continue your progress</Text>
              </View>

              <View style={styles.formContainer}>
                 
                <View style={styles.glassCard}>
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
                    pressed && { transform: [{ scale: 0.98 }] },
                    loading && { opacity: 0.7 }
                  ]}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#0F172A" />
                  ) : (
                    <Text style={styles.mainButtonText}>Login</Text>
                  )}
                </Pressable>

                <View style={styles.footer}>
                  <Text style={styles.noAccountText}>Don't have an account? </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('signup')}
                    disabled={loading}
                  >
                    <Text style={styles.signupText}>Sign Up</Text>
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
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',  
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#94A3B8',
    marginTop: 6,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  glassCard: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#334155',
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
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
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  mainButtonText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
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
  signupText: {
    color: '#38BDF8',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default HelloWorldApp;