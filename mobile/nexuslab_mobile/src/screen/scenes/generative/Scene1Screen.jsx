import { View, Text, Button, StyleSheet } from 'react-native';
import React from 'react'

const Scene1Screen = ({ navigation })  => {


  return (
      <View style={styles.container}>
        <Text style={styles.text}>Bienvenue sur Scene1Screen!</Text>
      </View>
  )
}

export default Scene1Screen

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