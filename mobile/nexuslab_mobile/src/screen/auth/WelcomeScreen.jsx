import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useRef, useState } from 'react';
import { colors } from '../../utils/colors';
import NexusLabImage from '../../assets/logo/NexusLab-full-purple.png';
import globalStyles from '../../utils/styles';
import { useNavigation } from '@react-navigation/native';
import MyButton from '../../components/MyButton';
import { Video } from 'expo-av';
import videoSource from '../../assets/design/videos/orbit-scene.mp4';

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const video = useRef(null);
  const [status, setStatus] = useState({});

  const HandleLogin = () => {
    navigation.navigate('Login');
  }
  const HandleSignup = () => {
    navigation.navigate('Signup');
  }

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={styles.backgroundVideo}
        source={videoSource}
        resizeMode="cover"
        isLooping
        shouldPlay
        isMuted
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      />
      <View style={styles.content}>
        <Text 
          style={[styles.headerText, globalStyles.text3]}
          accessible={true}
          accessibilityRole="header"
        >
          Welcome to NexusLab !
        </Text>
        <Image 
          source={NexusLabImage}
          style={styles.logo}
          accessible={true}
          accessibilityLabel="Purple NexusLab logo"
          accessibilityRole="image"
        />
    
        <View style={styles.buttonContainer}>
          <MyButton
            onPress={HandleLogin}
            accessible={true} 
            accessibilityLabel="Login" 
            accessibilityHint="Touch to authenticate"
            accessibilityRole="button"
          >
            Login
          </MyButton>
          <MyButton
            onPress={HandleSignup}
            accessible={true} 
            accessibilityLabel="Signup" 
            accessibilityHint="Touch to registrate"
            accessibilityRole="button"
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
    backgroundColor: 'black',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 230,
    left: 0,
    bottom: 0,
    right: 0,
    height: 362
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
    bottom: -130,
  },
  headerText:{
    color: 'white',
    fontSize: 30,
    textAlign: 'center',
    marginTop: 130,
    width: '70%',
    lineHeight: 40,
  },
  buttonContainer:{
    flexDirection: 'row',
    bottom: 45,
    position: 'absolute',
    gap: 15
  },
  text:{
    color: "white"
  }
})