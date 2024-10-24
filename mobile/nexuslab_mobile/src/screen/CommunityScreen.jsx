import { View, Text, Button, Image, StyleSheet, SafeAreaView } from 'react-native';
import { colors } from '../utils/colors'
import config from '../config/config'; 
import React from 'react'

const CommunityScreen = ({ navigation })  => {

  const decorUrl = `${config.apiUrl}/images/design/logo/logo-purple.png`;

  return (
    <SafeAreaView style={styles.container}>
      <Image
          source={{ uri: decorUrl }}
          style={styles.profileImage}
          resizeMode="contain"
          accessible={true}
          accessibilityLabel="Purple NexusLab logo"
      />
      <Text
        style={styles.text}
        accessible={true}
        accessibilityLabel="Community section message"
        accessibilityHint="Indicates that the community section is coming soon"
      >
        Community section incoming..
      </Text>
    </SafeAreaView> 

  )
}

export default CommunityScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
    justifyContent: 'center',
    backgroundColor: colors.purple_dark,
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
    color:'white',
    marginBottom: 100
  },
  profileImage: {
   flex:1,
    zIndex:2,
    width: '80%',
  },

})