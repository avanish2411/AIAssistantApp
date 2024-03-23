import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import AppNavigation from './src/Navigation/AppNavigation'
import { apiCall } from './src/Api/openAI'

export default function App() {
  useEffect(()=>{
    // apiCall('What is quantum computing?')
  },[])
  return (
    <AppNavigation />
  )
}