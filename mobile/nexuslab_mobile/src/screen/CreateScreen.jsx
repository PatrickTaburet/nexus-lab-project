import React, { useRef,useCallback} from 'react';
import { View,Text, StyleSheet, SafeAreaView, Animated, useWindowDimensions, ImageBackground, Easing  } from 'react-native';
import MyBigButton from '../components/MyBigButton';
import { useFocusEffect } from '@react-navigation/native';
import globalStyles from '../utils/styles';


const CreateScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const translateX = useRef(new Animated.Value(-width * 0.7)).current; // Départ hors écran à gauche (60% de la largeur)

  const animateForward = useCallback(() => {
    translateX.setValue(-width * 0.7); // Reset to initial position
    Animated.timing(translateX, {
      toValue: -200,
      duration: 1000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: true,
    }).start();
  }, [width]);

  useFocusEffect(
    useCallback(() => {
      animateForward();
      // Optionally, you can return a cleanup function if needed
      return () => {
        // Any cleanup code
      };
    }, [animateForward])
  );

  const handleNavigate = (target) => {
    Animated.timing(translateX, {
      toValue: -width * 0.7,
      duration: 1000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate(target);
    });
  };

  return (
    <SafeAreaView style={styles.globalContainer}>
      <Animated.View style={[styles.backgroundView,{  transform: [{ translateX }] }]}>
        <ImageBackground
          source={require('../assets/design/hexagonal-background.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      </Animated.View>
      <View style={styles.container}>
      <Text style={[styles.title, globalStyles.mainTitle]}>Choose a category</Text>
        <MyBigButton
          HandlePress={() => {handleNavigate('GenerateScene')}}
          myStyle={styles.customButton}
          buttonStyle={styles.buttonStyle}
          textStyle={styles.textStyle}
        >
          Generative Art
        </MyBigButton>
        <MyBigButton
          HandlePress={() => {handleNavigate('DataScene')}}
          myStyle={styles.customButton}
          buttonStyle={styles.buttonStyle}
          textStyle={styles.textStyle}
        >
          Data Art
        </MyBigButton>

      </View>
    </SafeAreaView>
  );
};

export default CreateScreen;

const styles = StyleSheet.create({
  globalContainer: {
    marginTop: 0,
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    flex: 1,
    width: '120%',
    height: '100%',
  },
  container:{
    flex: 1,
    width: '100%',
    height: '100%',
    position:'absolute',
    justifyContent:'center',
    alignItems:'center',
    marginTop: 10,
    gap: 20
  },
  backgroundView:{
    
  },
  customButton:{
    width: 150,
  },
  buttonStyle:{
    maxHeight: 160,

  },
  title:{
    fontSize: 28,
    marginBottom: 40
  },
  textStyle:{
    fontSize: 20,
    fontWeight: "600"
  },
});
