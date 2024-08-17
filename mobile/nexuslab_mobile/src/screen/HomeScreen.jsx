import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from './utils/colors'
import NexusLabImage from './assets/NexusLab-full-purple.png';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={NexusLabImage} style={styles.logo}/>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.secondary_dark
    },
    logo : {
        width: 400,
        height: 300,
    }
})