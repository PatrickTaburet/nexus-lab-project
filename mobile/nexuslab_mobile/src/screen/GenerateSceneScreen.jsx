import React, { useRef,useCallback} from 'react';
import { ScrollView, View,Text, StyleSheet, SafeAreaView, Animated, useWindowDimensions, ImageBackground, Easing  } from 'react-native';
import MyBigButton from '../components/MyBigButton';
import { useFocusEffect } from '@react-navigation/native';
import globalStyles from '../utils/styles';
import { colors } from '../utils/colors';


const GenerateSceneScreen = ({ navigation }) => {
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
        <ScrollView 
          contentContainerStyle={{ justifyContent: 'center', alignItems: 'center'}}
          style={styles.scrollViewStyle}
        >
          <Text style={[styles.title, globalStyles.mainTitle]} accessibilityLabel="Choose a scene" accessibilityRole="header" accessibilityLevel={1}>
            Choose a scene
          </Text>
          <MyBigButton
            HandlePress={() => {handleNavigate('Scene1')}}
            myStyle={styles.customButton}
            buttonStyle={styles.buttonStyle}
            textStyle={styles.textStyle}
            accessibilityRole="button"
            accessibilityLabel="Navigate to Random Line Walkers scene"
            accessibilityHint="Tap to explore the Random Line Walkers scene"
          >
            Random Line Walkers
          </MyBigButton>
          <MyBigButton
            HandlePress={() => {handleNavigate('Scene2')}}
            myStyle={styles.customButton}
            buttonStyle={styles.buttonStyle}
            textStyle={styles.textStyle}
            accessibilityRole="button"
            accessibilityLabel="Navigate to Noise Orbit scene"
            accessibilityHint="Tap to explore the Noise Orbit scene"
          >
            Noise Orbit
          </MyBigButton>
          <MyBigButton
            myStyle={styles.customButton}
            buttonStyle={styles.buttonStyle}
            textStyle={styles.textStyleOff}
            accessibilityRole="button"
            accessibilityLabel="Upcoming feature"
            accessibilityHint="This feature is coming soon"
          >
            Incoming ..
          </MyBigButton>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default GenerateSceneScreen;

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
    gap: 20,

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
    marginBottom: 30,
    marginTop: 10,
    marginTop: 80
  },
  textStyle:{
    fontSize: 20,
    fontWeight: "600",
  },
  textStyleOff:{
    fontSize: 20,
    fontWeight: "600",
    color: 'rgb(180, 180, 180)',
  },
  scrollViewStyle:{
    width: '100%',
    height: '100%',
  }
});
