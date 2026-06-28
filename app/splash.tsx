import React from 'react';
import { StyleSheet, View, Text, Image, Pressable, Dimensions, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  splash: undefined;
  login: undefined;
};

const { width } = Dimensions.get('window');

export default function Splash() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <View style={styles.glowCircle} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.imageContainer}>
             <Image
              source={require('../assets/image.png')}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          <View style={styles.header}>
            <Text style={styles.text}>Quizly</Text>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>POWERED BY AI</Text>
            </View>
            <Text style={styles.subtitle}>
                Transform your documents into interactive quizzes in seconds.
            </Text>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.stylecardoverall}>
            <View style={styles.glassTile}>
              <View style={styles.iconCircle}>
                <Text style={{fontSize: 16}}>⚡</Text>
              </View>
              <Text style={styles.cardText}>Instant Generation</Text>
            </View>
            
            <View style={styles.glassTile}>
              <View style={styles.iconCircle}>
                <Text style={{fontSize: 16}}>📄</Text>
              </View>
              <Text style={styles.cardText}>Smart PDF Support</Text>
            </View>
          </View>

          <View style={styles.buttonWrapper}>
            <Pressable
              style={({ pressed }) => [
                styles.mainButton,
                pressed && styles.buttonPressed
              ]}
              onPress={() => navigation.navigate('login')}
            >
              <Text style={styles.mainButtonText}>Get started</Text>
              <View style={styles.arrowCircle}>
                 <Text style={styles.arrow}>→</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  glowCircle: {
    position: 'absolute',
    top: -100,
    right: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#38BDF8',
    opacity: 0.05,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  imageContainer: {
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 10,
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  text: {
    color: '#F8FAFC',
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: -2,
  },
  badge: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    marginTop: -5,
    marginBottom: 15,
  },
  badgeText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 17,
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  bottomSection: {
    paddingBottom: 40,
  },
  stylecardoverall: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    paddingHorizontal: 25,
    marginBottom: 25,
  },
  glassTile: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    flex: 1,
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardText: {
    color: '#F8FAFC',
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 18,
  },
  buttonWrapper: {
    paddingHorizontal: 25,
  },
  mainButton: {
    backgroundColor: '#38BDF8',
    height: 64,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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
});