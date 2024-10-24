import { TouchableWithoutFeedback , ImageBackground, View, Text, ScrollView, StyleSheet,TouchableOpacity, Modal, SafeAreaView, Image, ActivityIndicator, FlatList} from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react'
import useApi from '../services/api/hooks/useApi';
import {  useIsFocused } from '@react-navigation/native';
import config from '../config/config'; 
import { colors } from '../utils/colors';
import globalStyles from '../utils/styles';
import { Ionicons } from '@expo/vector-icons';
import MyButton from '../components/MyButton';
import MyBigButton from '../components/MyBigButton';
import MyModale from '../components/MyModale';

const ITEM_HEIGHT = 300; 

const SceneCard = React.memo(({ item, onImagePress, onLabelPress, api, onDeleteSuccess, navigation }) => {
  const idPrefix = item.id.split('_')[0]; 
  const sceneId = item.id.split('_')[1]; 
  const imagePath = `${config.apiUrl}/images/${idPrefix}Img/${item.imageName}`;
  const [modalVisible, setModalVisible] = useState(false);


  const deleteArtwork = async() => {
    try {
      const response = await api.post(`/artworks/delete/${sceneId}/${idPrefix}`);
       console.log(response.data);
      if (response.status !== 200) {
        throw new Error("Erreur lors de la suppression de la scène");
      }
      console.log(`Artwork removed`);
      setModalVisible(false);
      onDeleteSuccess(); 
    } catch (error) {
      console.error(error.config);
      console.error("Erreur lors de la suppression de la scène:", error);
    }
  };
  
  return (
    <View style={styles.card}> 
    <MyModale
      visible={modalVisible}
      onClose={() => {
        setModalVisible(false);
      }}
      onSubmit={deleteArtwork}
      title={`Delete the Artwork : ${item.title} ?`}
      accessibilityLabel={`Delete artwork modal for ${item.title}`}
    />
    <TouchableWithoutFeedback  
      onPress={() => onImagePress(imagePath)}
      accessible={true}
      accessibilityLabel={`Open artwork titled ${item.title}`}
    >
      <Image 
        source={{ uri: imagePath }}
        style={styles.image}
        accessible={true}
        accessibilityLabel={`Artwork titled ${item.title}`}
      />
    </TouchableWithoutFeedback >
      <View style={styles.cardContent}>
        <Text 
          style={styles.title} 
          accessible={true} 
          accessibilityLabel={`Artwork Title: ${item.title}`}
        >
          Title: {item.title}
        </Text>
        <Text 
          style={styles.comment} 
          accessible={true} 
          accessibilityLabel={`Comment: ${item.comment}`} 
        >
          Comment: {item.comment}
        </Text>
        <View style={styles.separator}></View>
        <Text 
          style={styles.text} 
          accessible={true} 
          accessibilityLabel={`Date: ${item.updatedAt}`}
        >
          Date: {item.updatedAt}
        </Text> 
        <View style={styles.bottomCard}>
          <TouchableOpacity 
            onPress={() => onLabelPress(idPrefix)} 
            style={styles.labelContainer}
            accessible={true}
            accessibilityLabel={`View label for ${idPrefix}`}
          >
            <Text 
              style={[styles.label, idPrefix.includes('D') ? styles.labelData : styles.labelGenerative]}
            >
              {idPrefix.includes('D') ? "Data Art" : "Generative Art"}
            </Text>
            <Text style={styles.text}>
              {(() => {
                switch (idPrefix) {
                  case "Scene1":
                    return "Random Line Walker";
                  case "Scene2":
                    return "Noise Orbit";
                  case "SceneD1":
                    return "CO2 Emission Explorer";
                  case "SceneD2":
                    return "Demographic Artistry";
                  default:
                    return "Unknown scene"; 
                }
              })()}
            </Text >
          </TouchableOpacity>
          <Text style={styles.likeTxt}>
            {item.likes} like{item.like > 0 ? "s" : ""}
          </Text>
        </View>
        <View style={styles.buttonBottom}>
          <MyButton
            onPress={() => {setModalVisible(true)}}
            isSecondary={true}
            style={styles.cardButton}
            accessible={true}
            accessibilityLabel={`Delete artwork titled ${item.title}`}
            accessibilityHint="Touch to delete this artwork"
          >       
            Delete
          </MyButton>
          <MyButton
            onPress={() => navigation.navigate('EditArtwork', { idPrefix, sceneId })}
            style={styles.cardButton}
            accessible={true}
            accessibilityLabel={`Edit artwork titled ${item.title}`}
            accessibilityHint="Touch to edit this artwork"
          >       
            Edit
          </MyButton>
        </View>
      </View> 
    </View> 
  )
}); 

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
    setScenes([]); // On vide les scènes
    setPage(1);    // Retour à la première page
    setHasMore(true); // On autorise de nouveau la pagination
  };

  useEffect(() => {
    if (isFocused) {
      if (prevIsGenerativeArtRef.current !== isGenerativeArt) {
        // isGenerativeArt a changé
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

  const handleImagePress = (imagePath) => {
    setFullScreenImage(imagePath);
  };
  
  const handleNavigate = (target) => {
    console.log(target);
    navigation.navigate('Create', {
      screen: target,  // cible l'écran spécifique du CreateStack
    });
  };

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
    <SafeAreaView  style={styles.globalContainer}>
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
            <Text>Generative{'\n'}Art</Text>
          </MyBigButton>
          <MyBigButton
            HandlePress={() => {
              setIsGenerativeArt(false);
            }}
            textStyle={isGenerativeArt ? styles.submitButtonOff : styles.submitButtonOn}
            buttonStyle = { styles.buttonStyle}
            myStyle={[styles.submitButton, {'width' : 90}]}
            isSecondary={isGenerativeArt ? false : true}
          >       
            Data Art
          </MyBigButton>
        </View>
         { scenes.length > 0  ? (
                  <ScrollView style={styles.scrollView} ref={scrollViewRef}>

            <View style={styles.sceneContainer}>
              {scenes.map(item => (
                <SceneCard
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
  card: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    borderStyle: 'solid',
    borderWidth: 1.5,
    borderColor: colors.cyan,
    overflow: 'hidden',
    marginHorizontal: 20,
    backgroundColor: 'hsla(216, 50%, 16%, 0.8)', 
  },
  image: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 10,
    gap: 13
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.lightest,
    paddingHorizontal: 10
  },
  comment: {
    textAlign: 'center',
    fontSize: 15,
    marginTop: 5,
    color: colors.lightest,
    paddingHorizontal: 10
  },

  text: {
    fontSize: 15,
    color: 'white',
    textAlign: 'center',

  },
  textNoData:{
    fontSize: 15,
    color: 'white',
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
    gap: 55,
    top: 50, 
    zIndex:1000,
  },
  submitButtonOn:{
    fontSize: 13,
    color: 'black',
      fontWeight: '700'
  },
  submitButtonOff:{
    color: 'white',
    fontSize: 13,
  },
  submitButton: {
    borderWidth: 5, 
    borderRadius: 50,
    borderColor: 'black'
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
  labelGenerative:{
    backgroundColor: colors.primary_dark,
    width: 120,
  },
  labelData:{
    backgroundColor: colors.secondary,
    width: 100,
  },
  label:{
    fontSize: 16,
    color: 'white',
    textAlign:'center',
    paddingVertical: 5,
    borderRadius: 6
  },
  bottomCard:{
    flexDirection: 'row', 
    justifyContent:'space-between', 
    marginRight: 0,
    marginLeft: 15, 
    marginVertical: 5
  },
  separator:{
    width: '90%',
    height: 2,
    backgroundColor: colors.line_dark,
    alignSelf: 'center',
    marginVertical: 5,
  },

  labelContainer:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonBottom:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    height: 70,
    gap: 15,
    marginTop: 7
  },
  cardButton:{
    height: 50,
    width: 120, 
  },
  deleteButton:{
    color: 'black',
  },
  likeTxt:{
    color: 'white',
    fontSize: 18,
    marginTop: 17,
    marginRight: 58
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
    backgroundColor: 'black',
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
    borderColor: 'black'
  },
  disabledButton: {
    backgroundColor: 'grey', // Une couleur plus claire ou grisée
  },
  inputIcon:{

  }
})


