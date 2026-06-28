import { Ionicons } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import Home from './Home'
import Quiz from './quiz'

const Tab = createBottomTabNavigator()

export default function TabScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#6366f1',  
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)', 
        tabBarStyle: {
          position: 'absolute',
          left: 20,
          right: 20,
          height: 75,
          borderRadius: 25,
          backgroundColor: 'rgba(255, 255, 255, 0.25)', 
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.3)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          ...Platform.select({
            ios: { backgroundColor: 'rgba(255, 255, 255, 0)' },
            android: { backgroundColor: '#23252c' },
          }),
        },
        tabBarIcon: ({ focused, color }) => {
          let icon: keyof typeof Ionicons.glyphMap = 'home-outline'

          if (route.name === 'Home') {
            icon = focused ? 'home' : 'home-outline'
          }
          if (route.name === 'Quiz') {
            icon = focused ? 'add-circle' : 'add-circle-outline'
          }

          return (
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: focused ? '#FFFFFF' : 'transparent',

                }
              ]}
            >
              <Ionicons name={icon} size={26} color={color} />
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

const styles = StyleSheet.create({
  iconContainer: {
    width: 55,
    height: 45,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
     
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  }
})