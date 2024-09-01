import { View, Text, Button, StyleSheet } from 'react-native';
import React from 'react'
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation })  => {


  return (
      <View style={styles.container}>
        <Text style={styles.text}>Bienvenue sur HomeScreen!</Text>

      </View>
  )
}

export default HomeScreen

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