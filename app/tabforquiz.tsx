import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { View } from 'react-native'
import Home from './Home'
import Quiz from './quiz'

const Tab = createBottomTabNavigator()

export default function TabScreen() {
  return (
    <Tab.Navigator
      initialRouteName="Quiz"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#4475ef',
        tabBarInactiveTintColor: '#78869d',
        tabBarStyle: {
          position: 'absolute',
          bottom: 18,
          left: 18,
          right: 18,
          height: 70,
          borderRadius: 22,
          backgroundColor: '#ffffffee',
          elevation: 12,
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarIcon: ({ focused, color }) => {
          let icon: keyof typeof Ionicons.glyphMap = 'home-outline'

          if (route.name === 'Home') {
            icon = focused ? 'home' : 'home-outline'
          }
          if (route.name === 'Quiz') {
            icon = focused ? 'document' : 'document-outline'
          }

          return (
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: focused ? '#d4e1ff' : 'transparent'
              }}
            >
              <Ionicons name={icon} size={24} color={color} />
            </View>
          )
        }
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Quiz" component={Quiz} />
    </Tab.Navigator>
  )
}