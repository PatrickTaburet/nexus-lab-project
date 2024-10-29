import { StyleSheet, Text, View, Image, Dimensions } from 'react-native'
import React from 'react'
import config from '../../config/config'; 
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';
import { colors } from '../../utils/colors'

const {width} = Dimensions.get('screen');

const SliderItem = ({item}) => {
  const idPrefix = item.id.split('_')[0]; 
  // const sceneId = item.id.split('_')[1]; 
  const imagePath = `${config.apiUrl}/images/${idPrefix}Img/${item.imageName}`;

  return (
    <Animated.View style={[styles.itemContainer]} accessible={true} accessibilityRole="image">
      <Image 
        source={{ uri: imagePath }}
        style={styles.image}
        accessibilityLabel="Artwork image"
        accessibilityRole="image" 
      />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.background}>
        <View style={{alignItems: 'flex-end'}}>
          <Text style={[styles.text, {}]} accessibilityRole="text" accessibilityLabel={`Created by ${item.user.username}`}>
            Created by: <Text style={styles.pseudo}>{item.user.username}</Text>
          </Text>
        </View>
        <View  style={{gap: 10}}>
          <Text 
            style={styles.title} 
            accessibilityRole="header" 
            accessibilityLabel={`Title: ${item.title}`} 
          >
            {item.title}
          </Text>
          {/* <Text 
            style={styles.text} 
            accessibilityRole="text" 
            accessibilityLabel={`Comment: ${item.comment}`} 
          >
            {item.comment}
          </Text> */}
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
    fontSize: 14,
    color: 'white',
  },
  pseudo:{
    color: colors.cyan,
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
    padding: 15,
    borderRadius: 20,
    justifyContent: 'space-between'
  },

})