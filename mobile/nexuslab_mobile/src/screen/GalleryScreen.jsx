import { TouchableWithoutFeedback , ImageBackground, View, Text, Button, StyleSheet,TouchableOpacity, Modal, SafeAreaView, Image, ActivityIndicator, FlatList} from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react'
import useApi from '../hooks/useApi';
import {  useIsFocused } from '@react-navigation/native';
import config from '../config/config'; 
import { colors } from '../utils/colors';
import Likes from '../components/LikesManager';
import CustomSelect from '../components/CustomSelect';
import globalStyles from '../utils/styles';

const ITEM_HEIGHT = 300; 

const SceneCard = React.memo(({ item, onImagePress }) => {
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
          <Text 
            style={[styles.label, idPrefix.includes('D') ? styles.labelData : styles.labelGenerative]}
          >
            {idPrefix.includes('D') ? "Data Art" : "Generative Art"}
          </Text>
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

const GalleryScreen = ({ navigation })  => {
  const {api} = useApi();
  const [scenes, setScenes] = useState([]);
  const [page, setPage] = useState(1);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [selectedOption, setSelectedOption] = useState();
  const [fullScreenImage, setFullScreenImage] = useState(null);

  const fetchScenes = useCallback(async (reset = false) => {
    if (!hasMore && loading) return;

    setLoading(true);
    try {
      const currentPage = reset ? 1 : page;
      const response = await api.get(`/gallery?page=${currentPage}&limit=10&sort=${selectedOption}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
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
  }, [api, page, selectedOption, hasMore, loading]);

  useEffect(() => {
    if (isFocused) {
      fetchScenes(true);
    }
  }, [isFocused]);

  useEffect(() => {
    if (selectedOption) {
      setScenes([]); // Réinitialiser les scènes
      setPage(1);    // Réinitialiser la page
      setHasMore(true); // Réinitialiser la condition pour charger plus
      fetchScenes(true); // Recharger les scènes avec la nouvelle option de tri
    }
  }, [selectedOption]); // Se déclenche lorsque `selectedOption` change 

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

  return (
    <SafeAreaView  style={styles.globalContainer}>
      <ImageBackground
        source={require('../assets/design/hexagonal-background.jpg')}
        style={styles.backgroundImage} 
        resizeMode="cover"
      >
        <View style={styles.header}>
          <View style={styles.selectContainer}>
            <CustomSelect
              data={[
                { value: "date", label: "Date" },
                { value: "likes", label: "Like" },
              ]}
              onChange={(item) => {
                setSelectedOption(item.value); 
              }}
              placeholder="Sort by .."
            />
          </View>
          <Text style={[styles.headerTitle, globalStyles.mainTitle]}>
              Gallery
          </Text>
        </View>


      <FlatList
        style={{ flex: 1, marginTop: 57 }}
        data={scenes}
        renderItem={({ item }) => <SceneCard item={item} onImagePress={handleImagePress}/>}
        keyExtractor={item => item.id}
        // onEndReached={() => fetchScenes()}
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
    </SafeAreaView>

  );
}

export default GalleryScreen

const styles = StyleSheet.create({
  globalContainer:{
    marginTop: 25,
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
  selectContainer:{
    position:'absolute',
    alignItems: 'flex-start',
    marginLeft: 20,
    marginTop: 0,
    top:0,
  },
  header:{

  },
  headerTitle:{
    position:'absolute',
    top:13,
    right: '28%',
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

  }
})


