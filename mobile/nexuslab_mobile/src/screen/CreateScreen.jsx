import React, { useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView, Animated, useWindowDimensions, ImageBackground, Easing  } from 'react-native';
import MyButton from '../components/MyButton';



const CreateScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  console.log(width);
  const translateX = useRef(new Animated.Value(-width * 0.7)).current; // Départ hors écran à gauche (60% de la largeur)

  useEffect(() => {
    // Démarrage de l'animation lors du montage du composant
    Animated.timing(translateX, {
      toValue: -200, // Arrivée à 0 (position initiale normale)
      duration: 1000, // Durée de l'animation en millisecondes (ici 1 seconde)
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: true, // Optimisation des performances
    }).start();
  }, []);

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
        <MyButton
          // HandlePress={}
          myStyle={styles.customButton}
        >
          Generative Art
        </MyButton>

      </View>
    </SafeAreaView>
  );
};

export default CreateScreen;

const styles = StyleSheet.create({
  globalContainer: {
    marginTop: 25,
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
  },
  backgroundView:{
    
  },
  customButton:{
    paddingVertical: 50,
    paddingHorizontal: 100
    
  },
});
