import { View, Text, Button, StyleSheet } from 'react-native';
import React from 'react'

const GenerateSceneScreen = ({ navigation })  => {


  return (
      <View style={styles.container}>
        <Text style={styles.text}>Bienvenue sur GenerateSceneScreen!</Text>
      </View>
  )
}

export default GenerateSceneScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },


})