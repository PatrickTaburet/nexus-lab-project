import { Image, ScrollView, SafeAreaView, ImageBackground, View, Text, Button, StyleSheet } from 'react-native';
import React, {useState, useCallback, useEffect} from 'react'
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../utils/colors'
import config from '../config/config'; 
import useApi from '../hooks/useApi';
import {  useIsFocused } from '@react-navigation/native';
import Slider from '../components/carouselSlider/Slider'
import Likes from '../components/LikesManager';

const ITEM_HEIGHT = 300; 

const SceneCard = React.memo(({ item, onImagePress, onLabelPress }) => {
  const idPrefix = item.id.split('_')[0]; 
  const sceneId = item.id.split('_')[1]; 
  const imagePath = `${config.apiUrl}/images/${idPrefix}Img/${item.imageName}`;
  const avatarPath = `${config.apiUrl}/images/avatar/${item.user.avatar}`; 

  return (
    <View style={styles.card}> 
    <TouchableWithoutFeedback  
      onPress={() => onImagePress(imagePath)}
    >
      <Image 
        source={{ uri: imagePath }}
        style={styles.image}
      />
    </TouchableWithoutFeedback >
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.comment}>{item.comment}</Text>
        <View style={styles.separator}></View>
        <View style={styles.userContainer}>
          <Image 
            source={{ uri: avatarPath }}
            style={styles.avatarImage}
          />
          <View>
            <Text style={styles.username}>Created by  <Text style={{color: colors.primary_dark, fontSize: 17}}>{item.user.username}</Text></Text>
            <Text style={styles.date}>{item.updatedAt}</Text> 
          </View>
        </View>
        <View style={styles.bottomCard}>
          <TouchableOpacity onPress={() => onLabelPress(idPrefix)}>
            <Text 
              style={[styles.label, idPrefix.includes('D') ? styles.labelData : styles.labelGenerative]}
            >
              {idPrefix.includes('D') ? "Data Art" : "Generative Art"}
            </Text>
          </TouchableOpacity>
          <Likes
            userId= {item.user.id}
            sceneId= {sceneId}
            likesNum= {item.likes}
            entity= {idPrefix}
            isLikedByUser= {item.isLiked}
          />
        </View>
      </View> 
    </View> 
  )
});

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
      fetchScenes(true);
    }
  }, [isFocused]);


  return (
    <SafeAreaView style={styles.safeArea}> 
      <ImageBackground
        source={require('../assets/design/background-cyber-form.jpg')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* <ScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', height: '100%'}}> */}
          <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%', marginBottom: 100}}>
            <View style={styles.topContainer}>
              <Image
                source={{ uri: logoUrl }}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Text style={styles.text}>Collaborative platform for generative art and creative coding ! </Text>
            </View>
            <View style={styles.sliderContainer}>
              <Text style={styles.text}>Last artwork generated :</Text>
              <Slider sliderContent={scenes}/>
            </View>
          </View>  
        {/* </ScrollView> */}

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
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
    width: 250,
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

})