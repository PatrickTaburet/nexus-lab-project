import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { colors } from '../../utils/colors';
import NexusLabImage from '../../assets/logo/NexusLab-full-purple.png';
import globalStyles from '../../utils/styles';
import { useNavigation } from '@react-navigation/native';
import MyButton from '../../components/MyButton';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  const HandleLogin = () => {
    navigation.navigate('Login');
  }
  const HandleSignup = () => {
    navigation.navigate('Signup');
  }


  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={[styles.headerText, globalStyles.text3]}>vdddddddvffd</Text>
        <Image 
          source={NexusLabImage}
          style={styles.logo}
        />
    
        <View style={styles.buttonContainer}>
          <MyButton
            onPress={HandleLogin}
          >
            Login
          </MyButton>
          <MyButton
            onPress={HandleSignup}
          >
            Sign up
          </MyButton>
        </View>
      </View>
    </View>
  )
}

export default WelcomeScreen 

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
    },
    buttonContainer:{
      flexDirection: 'row',
      bottom:115,
      position: 'absolute',
      gap: 15
    },
    text:{
      color: "white"
    }
})