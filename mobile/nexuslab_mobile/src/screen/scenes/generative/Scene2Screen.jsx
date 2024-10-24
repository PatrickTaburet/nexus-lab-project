import { View, Text, Button, StyleSheet } from 'react-native';
import React from 'react'
import { colors } from '../../../utils/colors';

const Scene2Screen = ({ navigation })  => {


  return (
    <View style={styles.container}>
      <Text style={styles.text} accessible={true} accessibilityLabel="This feature is coming soon">
        Scene Noise Orbit is incoming on NexusLab Mobile !
      </Text>
    </View>
  )
}

export default Scene2Screen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.purple_dark
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
    color: colors.cyan,
    textAlign: 'center',
  },


})