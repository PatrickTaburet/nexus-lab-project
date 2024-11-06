import React from 'react';
import { TouchableWithoutFeedback, Image, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../utils/colors';
import Likes from './LikesManager'; 
import config from '../config/config'; 

const GalleryCard = React.memo(({ item, onImagePress, onLabelPress }) => {
  const idPrefix = item.id.split('_')[0]; 
  const sceneId = item.id.split('_')[1]; 
  const imagePath = `${config.apiUrl}/images/${idPrefix}Img/${item.imageName}`;
  const avatarPath = `${config.apiUrl}/images/avatar/${item.user.avatar}`; 

  return (
    <View style={styles.card}> 
      <TouchableWithoutFeedback  
        onPress={() => onImagePress(imagePath)}
        accessibilityRole="button"
        accessibilityLabel="View image"
        accessibilityHint="Double tap to view the full image"
      >
        <Image 
          source={{ uri: imagePath }}
          style={styles.image}
          accessible={true}
          accessibilityLabel="Artwork image"
          accessibilityHint="This is an artwork"
        />
      </TouchableWithoutFeedback >
      <View style={styles.cardContent}>
        <Text style={styles.title} accessibilityLabel="Artwork title">{item.title}</Text>
        <Text style={styles.comment} accessibilityLabel="Comment">{item.comment}</Text>
        <View style={styles.separator}></View>
        <View style={styles.userContainer}>
          <Image 
            source={{ uri: avatarPath }}
            style={styles.avatarImage}
            accessible={true}
            accessibilityLabel="User  avatar"
            accessibilityHint="This is the profile picture of the artwork creator"
          />
          <View>
            <Text style={styles.username}>
              Created by {' '}
              <Text style={{ color: colors.primary_dark, fontSize: 17 }} accessibilityLabel="Username">
                {item.user.username}
              </Text>
            </Text>
            <Text style={styles.date} accessibilityLabel="Date of last update">{item.updatedAt}</Text>
          </View>
        </View>
        <View style={styles.bottomCard}>
          <TouchableOpacity 
            onPress={() => onLabelPress(idPrefix)}
            accessibilityRole="button"
            accessibilityLabel="View art type"
            accessibilityHint="Tap to view more scenes of this type of art"
          >
            <Text 
              style={[styles.label, idPrefix.includes('D') ? styles.labelData : styles.labelGenerative]}
              accessibilityLabel={idPrefix.includes('D') ? "Data Art" : "Generative Art"}
            >
              {idPrefix.includes('D') ? "Data Art" : "Generative Art"}
            </Text>
          </TouchableOpacity>
          <Likes
            userId= {item.user.id}
            sceneId= {sceneId}
            likesNum= {item.likes}
            entity= {idPrefix}
            isLikedByUser = {item.isLiked}
          />
        </View>
      </View> 
    </View> 
  );
});

export default GalleryCard;

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    backgroundColor: colors.web_white,
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
    color: colors.web_white,
    paddingHorizontal: 10
  },
  comment: {
    fontSize: 15,
    marginTop: 5,
    color: colors.web_white,
    paddingHorizontal: 10
  },
  avatarImage:{
    width: 50,
    height: 50,
    borderRadius: 70,
    borderWidth: 1.5,
    borderColor: colors.web_white
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
    color: colors.web_white,
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
  username: {
      fontSize: 15,
      color: colors.web_white,
  },
  date: {
      fontSize: 15,
      color: colors.web_white,
  },
});

