import { TouchableWithoutFeedback , ImageBackground, View, Text, Button, StyleSheet,TouchableOpacity, Modal, SafeAreaView, Image, ActivityIndicator, FlatList} from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react'
import useApi from '../hooks/useApi';
import {  useIsFocused } from '@react-navigation/native';
import config from '../config/config'; 
import { colors } from '../utils/colors';
import Likes from '../components/LikesManager';
import CustomSelect from '../components/CustomSelect';
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
            <Text style={styles.date}>Date : {item.updatedAt}</Text> 
        </View>
        <View style={styles.bottomCard}>
          <TouchableOpacity onPress={() => onLabelPress(idPrefix)} style={styles.labelContainer}>
            <Text 
              style={[styles.label, idPrefix.includes('D') ? styles.labelData : styles.labelGenerative]}
            >
              {idPrefix.includes('D') ? "Data Art" : "Generative Art"}
            </Text>
            <Text style={styles.date}>
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
          <Text style={styles.date}>
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
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [isGenerativeArt, setIsGenerativeArt] = useState(true);

  const fetchScenes = useCallback(async (reset = false) => {
    if (!hasMore && loading) return;
 
    setLoading(true);
    try {
      const currentPage = reset ? 1 : page;
      const response = await api.get(`/myArtworks?page=${currentPage}&limit=10&sort=${isGenerativeArt}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('REPONSE FETCHSCENE');
      console.log(response);
      
      const newScenes = response.data;
      if (newScenes.length > 0) {
        setScenes(prevScenes => {
          const prevScenesMap = new Map(reset ? [] : prevScenes.map(scene => [scene.id, scene]));
          newScenes.forEach(scene => {
            prevScenesMap.set(scene.id, scene);
          });
          return Array.from(prevScenesMap.values());
        });
        setPage(prevPage => reset ? 2 : prevPage + 1);
      } else {
        setHasMore(false);
      }    

    } catch (error) {
      console.error('Error fetching scenes:', error);
    } finally {
      setLoading(false); 
    }
  }, [api, page, isGenerativeArt, hasMore, loading]);
  
  const resetPages = () => {
    console.log("reset page fonction");
    
    setScenes([]); // Réinitialiser les scènes
    setPage(1);    // Réinitialiser la page
    setHasMore(true); // Réinitialiser la condition pour charger plus
    fetchScenes(true); // Recharger les scènes avec la nouvelle option de tri
  };
  
  useEffect(() => {
    if (isFocused) {
      fetchScenes(true);
    }
  }, [isFocused]);

  useEffect(() => {
      console.log("reset page USE EFFECT");
      resetPages(); 
  }, [isGenerativeArt]); // Se déclenche lorsque `isGenerativeArt` change 

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
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


      <FlatList
        style={{ flex: 1, paddingTop: 94 }}
        data={scenes}
        renderItem={({ item }) => 
          <SceneCard 
            item={item} 
            onImagePress={handleImagePress} 
            onLabelPress={handleNavigate} 
            api={api}
            onDeleteSuccess={resetPages}
          />
        }
        keyExtractor={item => item.id}
        onEndReached={() => {
          if (!loading && hasMore) {
            fetchScenes();
          }
        }}
        onEndReachedThreshold={0.5} 
        ListFooterComponent={renderFooter}
        initialNumToRender={10} 
        maxToRenderPerBatch={10}
        windowSize={10}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
      />
      </ImageBackground>
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
      <TouchableOpacity onPress={resetPages} style={styles.arrowIconTouch}>
        <Ionicons name="arrow-up-circle" size={47} color={colors.cyan} style={styles.arrowIcon}/>
      </TouchableOpacity>
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
  username: {
    fontSize: 15,
    color: 'white',
  },
  date: {
    fontSize: 15,
    color: 'white',
  },
  loader: {
    width:'100%',
    marginVertical: 70,
    flex: 1,
    alignItems: 'center',
  },
  inputIcon:{
    color:'white'
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
  headerTitle:{
    position:'absolute',
    top:13,
    right: '28%',
    fontSize: 25,
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
  avatarImage:{
    width: 50,
    height: 50,
    borderRadius: 70,
    borderWidth: 1.5,
    borderColor: 'white'
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
  arrowIcon:{
    position:'absolute',
    bottom: 10,
    right: 10
  },
  arrowIconTouch:{
    width: '100%'
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

  // Modale

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
  }

})


