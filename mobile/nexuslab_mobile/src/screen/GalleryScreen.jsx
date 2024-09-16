import { View, Text, Button, StyleSheet, SafeAreaView, Image, ActivityIndicator, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useCallback  } from 'react'
import useApi from '../hooks/useApi';
import { CommonActions, useIsFocused } from '@react-navigation/native';
import config from '../config/config'; 


const ITEM_HEIGHT = 300; 

const SceneCard = ({ item }) => {
  const idPrefix = item.id.split('_')[0]; 
  const imagePath = `${config.apiUrl}/images/${idPrefix}Img/${item.imageName}`;

  return (
    <View style={styles.card}> 
      <Image 
        source={{ uri: imagePath }}
        style={styles.image}
      />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.comment}>{item.comment}</Text>
        <Text style={styles.username}>{item.user ? item.user.username : 'Unknown'}</Text>
        <Text style={styles.date}>{item.updatedAt}</Text>
      </View>
    </View>
)
};

const GalleryScreen = ({ navigation })  => {
  const {api} = useApi();
  const [scenes, setScenes] = useState([]);
  const [page, setPage] = useState(1);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const fetchScenes = useCallback(async () => {
    if (!hasMore) return;

    setLoading(true);
    try {
      console.log('111111111');
      const response = await api.get(`/gallery?page=${page}&limit=10`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('reponse requete gallery');
      console.log('API response:', response.data); 


      const newScenes = response.data;
      if (newScenes.length > 0) {
        setScenes(prevScenes => {
          const prevScenesMap = new Map(prevScenes.map(scene => [scene.id, scene]));
          newScenes.forEach(scene => {
            prevScenesMap.set(scene.id, scene);
          });
          return Array.from(prevScenesMap.values());
        });
        setPage(prevPage => prevPage + 1);
      } else {
        setHasMore(false);
      }    

    } catch (error) {
      console.error('Error fetching scenes:', error);
    } finally {
      setLoading(false); 
    }
  }, [api, page, loading, hasMore]);

  useEffect(() => {
    if (isFocused) {
      fetchScenes();
    }
  }, [isFocused]);

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  };

  return (
    <FlatList
      data={scenes}
      renderItem={({ item }) => <SceneCard item={item} />}
      keyExtractor={item => item.id}
      onEndReached={fetchScenes}
      onEndReachedThreshold={0.5} 
      ListFooterComponent={renderFooter}
      initialNumToRender={5} 
      maxToRenderPerBatch={5}
      windowSize={10}
      getItemLayout={(data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
    />
  );
}

export default GalleryScreen

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  comment: {
    fontSize: 14,
    marginTop: 5,
  },
  username: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
  },
  date: {
    fontSize: 12,
    color: 'gray',
  },
  loader: {
    marginVertical: 20,
    alignItems: 'center',
  },


})