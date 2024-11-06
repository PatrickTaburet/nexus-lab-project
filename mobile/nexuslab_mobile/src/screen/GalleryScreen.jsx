import { TouchableWithoutFeedback , ImageBackground, View, Text, Button, StyleSheet,TouchableOpacity, Modal, SafeAreaView, Image, ActivityIndicator, FlatList} from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react'
import useApi from '../services/api/hooks/useApi';
import {  useIsFocused } from '@react-navigation/native';
import { colors } from '../utils/colors';
import CustomSelect from '../components/CustomSelect';
import globalStyles from '../utils/styles';
import { Ionicons } from '@expo/vector-icons';
import GalleryCard from '../components/GalleryCard';

const ITEM_HEIGHT = 300; 

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
    if (selectedOption) { 
      console.log("reset page USE EFFECT");
      resetPages(); 
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
              accessibilityLabel="Sort options"
              accessibilityHint="Choose how to sort the gallery artworks"
            />
          </View>
          <Text style={[styles.headerTitle, globalStyles.mainTitle]} accessibilityRole="header" accessibilityLevel={1}>
            Gallery
          </Text>
        </View>

      <FlatList
        style={{ flex: 1, marginTop: 57 }}
        data={scenes}
        renderItem={({ item }) => <GalleryCard item={item} onImagePress={handleImagePress} onLabelPress={handleNavigate}/>}
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
        accessibilityLabel="Gallery list"
        accessibilityHint="Scroll through the items in the gallery"
      />
      </ImageBackground>
      <Modal visible={!!fullScreenImage} transparent={true} onRequestClose={() => setFullScreenImage(null)}>
        <TouchableOpacity 
          style={styles.fullScreenContainer} 
          onPress={() => setFullScreenImage(null)}
          activeOpacity={1}
          accessibilityLabel="Full screen image"
          accessibilityHint="Tap to close the image"
        >
          <Image 
            source={{ uri: fullScreenImage }} 
            style={styles.fullScreenImage} 
            resizeMode="contain"
            accessibilityLabel="Full screen image"
          />
        </TouchableOpacity>
      </Modal>
      <TouchableOpacity onPress={resetPages} style={styles.arrowIconTouch}>
        <Ionicons 
          name="arrow-up-circle" 
          size={47} 
          color={colors.cyan} 
          style={styles.arrowIcon}
          accessibilityLabel="Reset pages"
          accessibilityHint="Double tap to reset the gallery to the top"
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default GalleryScreen

const styles = StyleSheet.create({
  globalContainer:{
    marginTop: 0,
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
  loader: {
    width:'100%',
    marginVertical: 70,
    flex: 1,
    alignItems: 'center',
  },
  inputIcon:{
    color: colors.web_white
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
  arrowIcon:{
    position:'absolute',
    bottom: 10,
    right: 10
  },
  arrowIconTouch:{
    width: '100%'
  }
})


