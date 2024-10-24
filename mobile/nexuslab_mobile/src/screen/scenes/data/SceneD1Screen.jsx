import { View, Text, Button, StyleSheet } from 'react-native';
import React from 'react';
import { colors } from '../../../utils/colors';

const SceneD1Screen = ({ navigation })  => {


  return (
      <View style={styles.container}>
        <Text style={styles.text} accessible={true} accessibilityLabel="This feature is coming soon">
          Scene CO2 Emission Explorer is incoming on NexusLab Mobile !
        </Text>
      </View>
  )
}

export default SceneD1Screen

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
    textAlign: 'center'
  },


})