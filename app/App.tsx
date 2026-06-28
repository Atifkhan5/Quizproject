import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import splash from './splash';
import login from './Login';
import signup from './signup';
import tabscreen from './tab';
import tab1 from './tabforquiz';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <Stack.Navigator 
      initialRouteName="splash"
        screenOptions={{ 
            headerShown: false,
            animation: 'slide_from_right',  
            contentStyle: { backgroundColor: '#F8F9FB' }  
        }}
    >
      <Stack.Screen name="splash" component={splash} options={{ headerShown: false }} />
      <Stack.Screen name="login" component={login} options={{ headerShown: false }} />
      <Stack.Screen name="signup" component={signup} options={{ headerShown: false }} />
      <Stack.Screen name="tabscreen" component={tabscreen} options={{ headerShown: false }} />
      <Stack.Screen name="tab1" component={tab1} options={{ headerShown: false }} />
    </Stack.Navigator>

  );
}


