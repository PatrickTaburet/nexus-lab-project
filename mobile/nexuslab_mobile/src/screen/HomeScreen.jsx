import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../utils/colors'
import NexusLabImage from '../assets/logo/NexusLab-full-purple.png';
import { globalStyles } from '../utils/styles';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={[styles.headerText, globalStyles.text]}>vddvffd</Text>
        <Image 
          source={NexusLabImage}
          style={styles.logo}
        />
      </View>  
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.secondary_dark,
    },
    content : {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 50
    },
    logo : {
        width: 300,
        resizeMode: 'contain',
        position: 'absolute',
        bottom: -230,
    },
    headerText:{
      color: 'white',
      fontSize: 40,
      textAlign: 'center',
      marginBottom: -200,
      fontFamily: '',
    }
})