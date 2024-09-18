import React, { useState } from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useApi from '../hooks/useApi';


export default function LikesManager({ userId, sceneId, likesNum, entity, isLikedByUser}) {
  const [isLiked, setIsLiked] = useState(isLikedByUser);
  const [likes, setLikes] = useState(likesNum)
  const {api} = useApi();

  const handleLike = async () => {
  
    setIsLiked(!isLiked);
    console.log(likes);
    const response = await api.post(`/like/artwork/${sceneId}/${entity}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log("2222222"); 
    // console.log(response.data);
    const data = await response.data;
      // Update the like count
    if (data.message === 'Like successfully added.') {
      setLikes(likes + 1);
    } else if (data.message === 'Like successfully deleted.') {
      setLikes(likes - 1);
    }
  }

  return (
    <View style={styles.container}>
        {isLiked? (
            <Ionicons 
            onPress={handleLike} 
            name={"heart"}
            size={27}
            style={styles.inputIcon}
            />
        ) : (
            <Ionicons 
                onPress={handleLike} 
                name={"heart-outline"}
                size={27}
                style={styles.inputIcon}
            />
      )}
    
      <Text style={styles.numLikes}>{likes} like{ likes<=1 ?  '' : 's' }</Text>

  </View>
  )
}

const styles = StyleSheet.create({
    numLikes:{
        color:'white',
        fontSize: 18
    },
    inputIcon:{
        color:'white',
    },
    container:{
      flexDirection:'row',
      alignItems: 'center',
      gap: 7
    }

});