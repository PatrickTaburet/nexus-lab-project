import { TouchableWithoutFeedback , ImageBackground, View, Text, ScrollView, StyleSheet,TouchableOpacity, Modal, SafeAreaView, Image, ActivityIndicator, FlatList} from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react'
import useApi from '../hooks/useApi';
import {  useIsFocused } from '@react-navigation/native';
import config from '../config/config'; 
import { colors } from '../utils/colors';
import globalStyles from '../utils/styles';
import { Ionicons } from '@expo/vector-icons';
import MyButton from '../components/MyButton';

const ITEM_HEIGHT = 300; 

const DeleteArtworkModal = ({ visible, onClose, onSubmit, artworkName }) => {

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={[styles.modalHeader, globalStyles.mainTitle]}>Delete the Artwork : <Text style={{color: colors.lightest}}>{artworkName}</Text> ?</Text>
          <View style={styles.modalBtnContainer}>
            <MyButton
               HandlePress={onSubmit}
              buttonStyle={styles.submitButton}
            >
              Confirm
            </MyButton>
            <MyButton
              HandlePress={onClose}
              myStyle={styles.closeButton}
              isSecondary={true}
            >
              Back
            </MyButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const SceneCard = React.memo(({ item, onImagePress, onLabelPress, api, onDeleteSuccess }) => {
  const idPrefix = item.id.split('_')[0]; 
  const sceneId = item.id.split('_')[1]; 
  const imagePath = `${config.apiUrl}/images/${idPrefix}Img/${item.imageName}`;
  const [modalVisible, setModalVisible] = useState(false);


  const deleteArtwork = async() => {
    try {
      const response = await api.post(`/artworks/delete/${sceneId}/${idPrefix}`);
      // console.log(response.data);
      if (response.status !== 200) {
        throw new Error("Erreur lors de la suppression de la scène");
      }
      console.log(`Artwork removed`);
      setModalVisible(false);
      onDeleteSuccess(); 
    } catch (error) {
      console.error("Erreur lors de la suppression de la scène:", error);
    }
  };
  
  return (
    <View style={styles.card}> 
      <DeleteArtworkModal 
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}
        onSubmit={deleteArtwork}
        artworkName={item.title}
      />
    <TouchableWithoutFeedback  
      onPress={() => onImagePress(imagePath)}
    >
      <Image 
        source={{ uri: imagePath }}
        style={styles.image}
        
      />
    </TouchableWithoutFeedback >
      <View style={styles.cardContent}>
        <Text style={styles.title}>Title : {item.title}</Text>
        <Text style={styles.comment}>Comment : {item.comment}</Text>
        <View style={styles.separator}></View>
        <View style={styles.userContainer}>
            <Text style={styles.text}>Date : {item.updatedAt}</Text> 
        </View>
        <View style={styles.bottomCard}>
          <TouchableOpacity onPress={() => onLabelPress(idPrefix)} style={styles.labelContainer}>
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
                    return "Unknown scene"; // or some default value
                }
              })()}
            </Text >
          </TouchableOpacity>
          <Text style={styles.text}>
          {item.likes} like{item.like > 0 ? "s" : ""}
          </Text>
        </View>
        <View style={styles.buttonBottom}>
          <MyButton
           // HandlePress={() => setIsGenerativeArt(false)}
          >       
            Update
          </MyButton>
          <MyButton
            HandlePress={() => {setModalVisible(true)}}
            isSecondary={true}
            myStyle={styles.cardButton}
          >       
            Delete
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
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [isGenerativeArt, setIsGenerativeArt] = useState(true);
  const scrollViewRef = useRef(null);

  const fetchScenes = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await api.get(`/myArtworks?page=${page}&limit=10&sort=${isGenerativeArt}`, {
        headers: {
          'Content-Type': 'application/json',
        }, 
      });
      console.log('REPONSE FETCHSCENE');
      console.log(response); 
      
      const newScenes = response.data;
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
  
  const resetPages = useCallback(() => {
    console.log("reset page fonction");
    setScenes([]); // On vide les scènes
    setPage(1);    // Retour à la première page
    setHasMore(true); // On autorise de nouveau la pagination
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchScenes();
    }
  }, [isFocused, page]);

  useEffect(() => {
      console.log("reset page USE EFFECT");
      resetPages(); 
  }, [isGenerativeArt, resetPages]); // Se déclenche lorsque `isGenerativeArt` change 

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
        disabled={page === 1}
        style={styles.paginationButton}
      >
       <Ionicons 
          name={"arrow-back-circle"}
          size={47}
          style={styles.inputIcon}
          color={ page === 1 ? "grey" : colors.cyan}
        />
      </TouchableOpacity>
      <Text style={styles.paginationText}>{page}</Text>
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
         <View style={styles.header}>
            <View style={styles.buttonContainer}>
              <MyButton
                HandlePress={() => setIsGenerativeArt(true)}
                myStyle={isGenerativeArt ? styles.submitButtonOn : styles.submitButtonOff}
                buttonStyle = { styles.submitButton}
                isSecondary={isGenerativeArt ? true : false}
              >       
                Generative Art
              </MyButton>
              <MyButton
                HandlePress={() => setIsGenerativeArt(false)}
                myStyle={isGenerativeArt ? styles.submitButtonOff : styles.submitButtonOn}
                isSecondary={isGenerativeArt ? false : true}
              >       
                Data Art
              </MyButton>
            </View>
          </View>
        <ScrollView style={styles.scrollView} ref={scrollViewRef}>
         
          <View style={styles.sceneContainer}>
            {scenes.map(item => (
              <SceneCard
                key={item.id}
                item={item}
                onImagePress={handleImagePress}
                onLabelPress={handleNavigate}
                api={api}
                onDeleteSuccess={resetPages}
              />
            ))}
          </View>
        </ScrollView>

        {/* Pagination */}
        {renderPagination()}

        {/* Loader */}
        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" />
          </View>
        )}
      </ImageBackground>

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
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.lightest,
    paddingHorizontal: 10
  },
  comment: {
    fontSize: 15,
    marginTop: 5,
    color: colors.lightest,
    paddingHorizontal: 10
  },

  text: {
    fontSize: 15,
    color: 'white',
  },
  loader: {
    width:'100%',
    marginVertical: 70,
    flex: 1,
    alignItems: 'center',
  },
  buttonContainer:{
    position:'absolute',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 60,
    top:0,
    zIndex: 10000,
    height: 70,
  },
  header:{

  },
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
  userContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
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
    marginRight: 13,
    marginLeft: 5,
    marginVertical: 5
  },
  separator:{
    width: '90%',
    height: 2,
    backgroundColor: colors.line_dark,
    alignSelf: 'center',
    marginVertical: 5,
  },
  submitButtonOn:{
    color: 'black'
  },
  submitButtonOff:{
    color: 'white'
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
    height: 70
  },
  cardButton:{
    color: 'black'
  },

  // Modal 

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.purple_dark,
    padding: 25,
    borderRadius: 10,
    width: '80%',
    height: '23%',
    borderWidth: 2,
    borderColor: colors.cyan,
    alignItems: 'center',
    justifyContent: 'center'
  },
  submitButton: {
  },
  closeButton: {
    color: colors.purple_dark,
    margin: 0
  },
  modalHeader:{
    textAlign: "center",
    marginBottom: 15,
    fontSize: 19,
    height: 40,
    marginTop: 10,
  },
  modalBtnContainer:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
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
    marginVertical: 20,
    paddingHorizontal: 30,
    position:'absolute',
    bottom: 0,
  },
  paginationButton: {
    borderRadius:50,
    backgroundColor: 'transparent',
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
    borderWidth: 3,
    borderColor: 'black'
  },
  disabledButton: {
    backgroundColor: 'grey', // Une couleur plus claire ou grisée
  },
  inputIcon:{

  }
})


