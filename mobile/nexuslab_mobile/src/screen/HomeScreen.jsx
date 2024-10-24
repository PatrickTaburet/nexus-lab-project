import { Image, ScrollView, SafeAreaView, ImageBackground, View, Text, Button, StyleSheet, ActivityIndicator, Animated, Dimensions } from 'react-native';
import React, {useState, useCallback, useEffect, useRef} from 'react'
import { colors } from '../utils/colors'
import config from '../config/config'; 
import useApi from '../services/api/hooks/useApi';
import {  useIsFocused } from '@react-navigation/native';
import Slider from '../components/carouselSlider/Slider'
import MyButton from '../components/MyButton';
import ArtistRoleModale from '../components/MyModale'

const { height, width } = Dimensions.get('window');

const HomeScreen = ({ navigation })  => {
  const logoUrl = `${config.apiUrl}/images/design/logo/NexusLab-full-purple.png`;
  const {api} = useApi();
  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const imagePath1 = `${config.apiUrl}/images/design/gallery.jpg`;
  const imagePath2 = `${config.apiUrl}/images/design/share-your-code.jpg`;
  const scrollY = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);


  const fetchScenes = useCallback(async () => {
    if (loading) return;
    setLoading(true);    
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

  const backgroundTranslate = scrollY.interpolate({
    inputRange: [0, height * 2], // Adapter les valeurs en fonction du besoin
    outputRange: [0, -170], // Parallaxe vers le haut
    extrapolate: 'clamp', // Empêcher de dépasser les limites
  });

  return (
    <SafeAreaView style={styles.safeArea}> 
      <Animated.View style={[styles.backgroundWrapper, { transform: [{ translateY: backgroundTranslate }] }]}>
        <ImageBackground
          source={require('../assets/design/background-cyber-form.jpg')} 
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      </Animated.View>
        <ScrollView 
          contentContainerStyle={{ }}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          accessible={true}
          accessibilityLabel="Home page with the last generated artworks"
        >
            <View style={styles.topContainer}>
              <Image
                source={{ uri: logoUrl }}
                style={styles.logoImage}
                resizeMode="contain"
                accessible={true} 
                accessibilityLabel="NexusLab Logo"
              />
              <Text style={[styles.text, {textAlign: 'center', width: 250}]}>Collaborative platform for generative art and creative coding ! </Text>
            </View>
            <View style={styles.sliderContainer}>
              <Text style={[styles.text, {textAlign: 'center', color:colors.cyan}]}>Last artworks generated :</Text>
              {loading ? (
                <View style={styles.loader}>
                  <ActivityIndicator size="large" />
                </View>
              ) : (
                <Slider sliderContent={scenes}/>
              )}
            </View>
            <MyButton
              onPress={() => {navigation.navigate('Gallery')}}
              style={styles.galleryButton}
              textStyle={styles.textButton}
              accessible={true}
              accessibilityLabel="Acess to public gallery of generated artworks"
              accessibilityHint="Touch to access to gallery"
            >
              Watch in the gallery
            </MyButton>
            <View style={styles.bottomContainer}>
              <Text style={[styles.text, {textAlign: 'center', width: 250, color: colors.cyan, fontWeight: '700', marginBottom: 10}]}>Create yout own artworks</Text>
              <Text style={[styles.text, {textAlign: 'center', width: 300, fontSize : 15, marginBottom: 30}]}>Have fun manipulating the image through the work of artist members !</Text>
              <Image 
                source={{ uri: imagePath1 }}
                style={styles.image}
                accessible={true}
                accessibilityLabel="Art gallery image"
              />
              <MyButton
                onPress={() => {navigation.navigate('Create', { screen: 'CreateMain' })}}
                style={styles.createButton}
                textStyle={styles.textButton}
                accessible={true}
                accessibilityLabel="Acess to Create section for create artworks"
                accessibilityHint="Touch to access to Create section"
              >
                Generate Art
              </MyButton>
              <MyButton
                onPress={() => {setModalVisible(true)}}
                style={styles.roleButton}
                textStyle={styles.textButton}
                accessible={true}
                accessibilityLabel="Modale for role request description"
                accessibilityHint="Touch to open modale"
              >
                Get Artist Role
              </MyButton>
              <Image 
                source={{ uri: imagePath2 }}
                style={styles.image}
                accessible={true}
                accessibilityLabel="Code lines image"
              />   
              <MyButton
                onPress={() => {navigation.navigate('AboutUs')}}
                isSecondary={true}
                style={styles.aboutUs}
                accessible={true}
                accessibilityLabel="Acess to About section, informations about NexusLab"
                accessibilityHint="Touch to access to About section"
              >
                About us
            </MyButton>
          </View>
          <ArtistRoleModale 
            title={"Get Artist Role"}
            content={"Do you want to become an even more active member and share your generative scenes with the community? \n Simply head over to the web version of NexusLab and fill out a quick form. We'll get back to you as soon as possible! No need to create a new account ;)"}
            visible={modalVisible}
            onClose={() => {
              setModalVisible(false);
            }}
            accessible={true}
            accessibilityViewIsModal={true}
            accessibilityLabel="Get Artist role"
            accessibilityHint="Touch to close the modal"
          />
        </ScrollView>
   
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
    color: '#FFFDFD',
  },
  safeArea:{
    flex: 1,
    backgroundColor: 'black', 
  },
  backgroundImage: {   
    width: '100%',
    height: '100%',
  },
  backgroundWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height + 100, // Adapter la hauteur
    zIndex: -1, // Assurer que l'image reste derrière
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
  createButton:{
    position: 'absolute',
    bottom: 570,
    margin: 'auto',
    width: 150,
    height: 40 ,
  },
  roleButton:{
    position: 'absolute',
    width: 150,
    height: 40 ,
    bottom: 210,
    margin: 'auto',
    zIndex: 1000
  },
  bottomContainer:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 50,
  },
  image: {
    width: 290,
    height: 290,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.cyan,
    marginVertical: 30
  },
  aboutUs:{
    height: 50,
    width: 130,   
    color: colors.cyan, 
    fontWeight: '700', 
    fontSize: 18,
    marginTop: 15

  },
  loader:{ 
    flex: 1,
    width: '100%',
    height: 300,
    backgroundColor: 'transparent', 
    justifyContent: 'center',
    alignItems: 'center',
  },

})