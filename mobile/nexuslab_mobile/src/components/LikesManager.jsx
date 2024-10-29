import React, { useState } from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useApi from '../services/api/hooks/useApi';
import { colors } from '../utils/colors'

export default function LikesManager({ userId, sceneId, likesNum, entity, isLikedByUser}) {
  const [isLiked, setIsLiked] = useState(isLikedByUser);
  const [likes, setLikes] = useState(likesNum)
  const {api} = useApi();

  const handleLike = async () => {
  
    setIsLiked(!isLiked);
    const response = await api.post(`/like/artwork/${sceneId}/${entity}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
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
        <Ionicons 
          onPress={handleLike} 
          name={isLiked ? 'heart' : 'heart-outline'}
          size={27}
          style={styles.inputIcon}
          accessible={true}
          accessibilityLabel={isLiked ? "Unlike artwork" : "Like artwork"}
          accessibilityHint={`Tap to ${isLiked ? 'remove your like' : 'like this artwork'}`}
        />
      <Text style={styles.numLikes} accessible={true} accessibilityLabel={`${likes} likes`}>
        {likes} like{likes <= 1 ? '' : 's'}
      </Text>
  </View>
  )
}

const styles = StyleSheet.create({
    numLikes:{
        color: colors.web_white,
        fontSize: 18
    },
    inputIcon:{
        color: colors.web_white,
    },
    container:{
      flexDirection:'row',
      alignItems: 'center',
      gap: 7
    }

});