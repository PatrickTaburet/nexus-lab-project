import { Image, ScrollView, SafeAreaView, ImageBackground, View, Text, Button, StyleSheet } from 'react-native';
import React, {useState, useCallback, useEffect} from 'react'
import { colors } from '../utils/colors'
import config from '../config/config'; 
import useApi from '../hooks/useApi';
import {  useIsFocused } from '@react-navigation/native';
import Slider from '../components/carouselSlider/Slider'
import MyButton from '../components/MyButton';

const HomeScreen = ({ navigation })  => {
  const logoUrl = `${config.apiUrl}/images/design/logo/NexusLab-full-purple.png`;
  const {api} = useApi();
  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();


  const fetchScenes = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    console.log("before fetch");
    
    try {
      const response = await api.get('/home/carousel?limit=3', { 
        headers: {
          'Content-Type': 'application/json', 
        },
      }); 
      console.log('response');
      console.log(response.data);
      
      const lastScenes  = response.data;
      setScenes(lastScenes);  
    } catch (error) {
      console.error('Error fetching scenes:', error); 
    } finally {
      setLoading(false); 
    }
  }, [api, loading]);

  useEffect(() => {
    if (isFocused) {
      fetchScenes();
    }
  }, [isFocused]);


  return (
    <SafeAreaView style={styles.safeArea}> 
      <ImageBackground
        source={require('../assets/design/background-cyber-form.jpg')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={{ }}>
            <View style={styles.topContainer}>
              <Image
                source={{ uri: logoUrl }}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Text style={[styles.text, {textAlign: 'center', width: 250}]}>Collaborative platform for generative art and creative coding ! </Text>
            </View>
            <View style={styles.sliderContainer}>
              <Text style={[styles.text, {textAlign: 'center', color:colors.cyan}]}>Last artwork generated :</Text>
              <Slider sliderContent={scenes}/>
            </View>
            <MyButton
              onPress={() => {navigation.navigate('Gallery')}}
              style={styles.galleryButton}
              textStyle={styles.textButton}
            >
              Watch in the gallery
            </MyButton>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>

  )
}

export default HomeScreen

const styles = StyleSheet.create({
  topContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    color: 'white',
  },
  safeArea:{
    flex: 1,
    backgroundColor: 'black', 
  },
  backgroundImage: {
    flex: 1,   
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    zIndex:2,
    width: 200,
    height: 200,
  },
  galleryButton:{
    margin: 'auto',
    width: 150,
    height: 40 ,
  },
  textButton:{
    fontSize: 14
    
  },
})