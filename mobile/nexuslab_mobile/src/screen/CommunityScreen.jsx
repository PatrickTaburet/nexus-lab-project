import { View, Text, Button, StyleSheet } from 'react-native';
import React from 'react'

const CommunityScreen = ({ navigation })  => {


  return (
      <View style={styles.container}>
        <Text style={styles.text}>Bienvenue sur CommunityScreen!</Text>
      </View>
  )
}

export default CommunityScreen

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