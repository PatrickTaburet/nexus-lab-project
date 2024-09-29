import { StyleSheet, Text, View, Image, Dimensions } from 'react-native'
import React from 'react'
import config from '../../config/config'; 
import { LinearGradient } from 'expo-linear-gradient';
import Likes from '../../components/LikesManager';
import Animated from 'react-native-reanimated';
import { colors } from '../../utils/colors'

const {width} = Dimensions.get('screen');

const SliderItem = ({item, index, scrollX}) => {
  const idPrefix = item.id.split('_')[0]; 
  const sceneId = item.id.split('_')[1]; 
  const imagePath = `${config.apiUrl}/images/${idPrefix}Img/${item.imageName}`;

  return (
    <Animated.View style={[styles.itemContainer]}>
      <Image 
        source={{ uri: imagePath }}
        style={styles.image}
      />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.background}>
        <View style={{alignItems: 'flex-end'}}>
          <Likes
            userId= {item.user.id}
            sceneId= {sceneId}
            likesNum= {item.likes}
            entity= {idPrefix}
            isLikedByUser= {item.isLiked}
          />
        </View>
        <View  style={{gap: 10}}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.text}>{item.comment}</Text>
        </View>
   
      </LinearGradient>
    </Animated.View>
  )
}

export default SliderItem

const styles = StyleSheet.create({
  title: {
      fontSize: 18,
      color: 'white',
  },
  text: {
      fontSize: 16,
      color: 'white',
  },
  image: {
    width: 290,
    height: 290,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.cyan
  },
  itemContainer:{
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    width: width
  },
  background:{
    position: 'absolute',
    height: 290,
    width: 290,
    padding: 20,
    borderRadius: 20,
    justifyContent: 'space-between'
  }
})