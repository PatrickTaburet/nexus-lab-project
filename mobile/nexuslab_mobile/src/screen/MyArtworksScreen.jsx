import { PanResponder , ImageBackground, View, Text, ScrollView, StyleSheet,TouchableOpacity, Modal, SafeAreaView, Image, ActivityIndicator} from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react'
import useApi from '../services/api/hooks/useApi';
import { useIsFocused } from '@react-navigation/native';
import { colors } from '../utils/colors';
import globalStyles from '../utils/styles';
import { Ionicons } from '@expo/vector-icons';
import MyBigButton from '../components/MyBigButton';
import UserCard from '../components/UserCard';

const MyArtworksScreen = ({ navigation })  => {
  const {api} = useApi();
  const [scenes, setScenes] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState();
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [isGenerativeArt, setIsGenerativeArt] = useState(true);
  const scrollViewRef = useRef(null);
  const prevIsGenerativeArtRef = useRef(isGenerativeArt);

  useEffect(() => {
    if (isFocused) {
      if (prevIsGenerativeArtRef.current !== isGenerativeArt) {
        console.log("isGenerativeArt a changé");
        fetchScenes(true);
      }
      fetchScenes();
    }
    // Mettre à jour la référence après l'exécution de l'effet
    prevIsGenerativeArtRef.current = isGenerativeArt;
  }, [isFocused, page, isGenerativeArt]);

  useEffect(() => {
    resetPages();
  }, [isGenerativeArt]);

  const fetchScenes = useCallback(async (reset = false) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await api.get(`/myArtworks?page=${ reset ? 1 : page}&limit=10&sort=${isGenerativeArt}`, {
        headers: {
          'Content-Type': 'application/json',
        }, 
      });
      console.log('REPONSE FETCHSCENE');
      //console.log(response.config); 
      
      const newScenes = response.data.scenes;
      setMaxPage(response.data.totalPages);
      if (newScenes.length > 0) {
        setScenes(newScenes); 
        setHasMore(newScenes.length === 10); // Si moins de 10, pas d'autres pages
      } else {
        setHasMore(false);
      }    
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    } catch (error) {     
      console.error('Error fetching scenes:', error);
    } finally {
      setLoading(false); 
    }
  }, [api, page, isGenerativeArt, loading]);
  
  const resetPages = () => {
    setScenes([]);
    setPage(1);  
    setHasMore(true); 
  };

  const handleImagePress = (imagePath) => {
    setFullScreenImage(imagePath);
  };
  
  const handleNavigate = (target) => {
    console.log(target);
    navigation.navigate('Create', {
      screen: target,  // cible l'écran spécifique du CreateStack
    });
  };

  // Changer l'état des bouttons avec un swipe
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const { dx } = gestureState;
        return Math.abs(dx) > 10; // Seuil pour détecter le swipe
      },
      onPanResponderEnd: (evt, gestureState) => {
        const { dx } = gestureState;
        if (dx > 20) {
          // Swipe vers la droite
          setIsGenerativeArt(true);
        } else if (dx < -20) {
          // Swipe vers la gauche
          setIsGenerativeArt(false);
        }
      },
    })
  ).current;

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      {/* Bouton Précédent */}
      <TouchableOpacity 
        onPress={() => setPage(prevPage => Math.max(prevPage - 1, 1))} 
        disabled={page === 1 || loading}
        style={styles.paginationButton}
      >
       <Ionicons 
          name={"arrow-back-circle"}
          size={47}
          style={styles.inputIcon}
          color={ page === 1 ? "grey" : colors.cyan}
        />
      </TouchableOpacity>
      <Text style={styles.paginationText}>{page} / {maxPage}</Text>
      {/* Bouton Suivant */}
      <TouchableOpacity 
        onPress={() => setPage(prevPage => prevPage + 1)}
        disabled={!hasMore || loading}
        style={styles.paginationButton}
      >
        <Ionicons 
          name={"arrow-forward-circle"}
          size={47}
          style={styles.inputIcon}
          color={(!hasMore || loading) ? "grey" : colors.cyan}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView  style={styles.globalContainer} {...panResponder.panHandlers}>
      <ImageBackground
        source={require('../assets/design/hexagonal-background.jpg')}
        style={styles.backgroundImage} 
        resizeMode="cover"
      >
       
        <View style={styles.buttonContainer}>
          <MyBigButton
            HandlePress={() => {
              setIsGenerativeArt(true);
            }}
            textStyle={isGenerativeArt ? styles.submitButtonOn : styles.submitButtonOff}
            myStyle = { styles.submitButton}
            buttonStyle={styles.buttonStyle}
            isSecondary={isGenerativeArt ? true : false}
          >       
            Generative Art
          </MyBigButton>
          <MyBigButton
            HandlePress={() => {
              setIsGenerativeArt(false);
            }}
            textStyle={isGenerativeArt ? styles.submitButtonOff : styles.submitButtonOn}
            buttonStyle = { styles.buttonStyle}
            myStyle={[styles.submitButton, {'width' : 90, marginRight: 7}]}
            isSecondary={isGenerativeArt ? false : true}
          >       
            Data Art
          </MyBigButton>
        </View>
        { scenes.length > 0  ? (
          <ScrollView style={styles.scrollView} ref={scrollViewRef}>
            <View style={styles.sceneContainer}>
              {scenes.map(item => (
                <UserCard
                  key={item.id}
                  item={item}
                  onImagePress={handleImagePress}
                  onLabelPress={handleNavigate}
                  api={api}
                  onDeleteSuccess={() => {
                    resetPages();
                    fetchScenes(true);
                  }}
                  navigation={navigation}
                />
              ))}
            </View>
            </ScrollView>
        ) : (
          <View>
            <Text style={styles.textNoData}>Aucune donnée utilisateur disponible</Text>
          </View>
         )}       

        {/* Pagination */}
        {renderPagination()}
    
      </ImageBackground>
        {/* Loader */}
        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" />
          </View>
        )}

      {/* Modal for fullscreen image */}
      <Modal visible={!!fullScreenImage} transparent={true} onRequestClose={() => setFullScreenImage(null)}>
        <TouchableOpacity 
          style={styles.fullScreenContainer} 
          onPress={() => setFullScreenImage(null)}
          activeOpacity={1}
        >
          <Image 
            source={{ uri: fullScreenImage }} 
            style={styles.fullScreenImage} 
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

export default MyArtworksScreen

const styles = StyleSheet.create({
  globalContainer:{
    display:'flex',
    alignItems: 'center',
    flex: 1, 
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  sceneContainer:{
    flex: 1,
    marginBottom: 130
  },
  text: {
    fontSize: 15,
    color: colors.web_white,
    textAlign: 'center',
  },
  textNoData:{
    fontSize: 15,
    color: colors.web_white,
    textAlign: 'center',
    top: 250
  },
  loader: {
    position:'absolute',
    top: 0,
    left: 0,
    width:'100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },

  //  Top Buttons

  buttonContainer:{
    position:'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 40,
    top: 50, 
    zIndex:1000,
  },
  submitButtonOn:{
    fontSize: 13,
    color: colors.web_black,
      fontWeight: '700'
  },
  submitButtonOff:{
    color: colors.web_white,
    fontSize: 13,
  },
  submitButton: {
    borderWidth: 5, 
    borderRadius: 50,
    borderColor: colors.web_black
  },

  ///////

  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
    borderWidth: 1.5,
    borderColor: colors.cyan
    
  },
  scrollView:{
    flex:1,
    paddingTop:95,
    paddingBottom: 20
  },

  // Pagination

  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
    paddingHorizontal: 30,
    position:'absolute',
    bottom: 0,
  },
  paginationButton: {
    borderRadius:50,
    backgroundColor: colors.web_black,
  },
  paginationText: {
    textAlign:'center',
    color: colors.secondary_bg,
    fontWeight: 'bold',
    fontSize: 22,
    fontWeight: '800',
    backgroundColor: colors.cyan,
    paddingHorizontal: 30,
    paddingTop: 7,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: colors.web_black
  },
  disabledButton: {
    backgroundColor: 'grey', // Une couleur plus claire ou grisée
  },
  inputIcon:{

  }
})


