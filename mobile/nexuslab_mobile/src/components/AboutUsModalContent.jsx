import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import {colors} from '../utils/colors'
import NexusLabImage from '../assets/logo/logo-purple.png';
import { Ionicons } from '@expo/vector-icons';

const AboutUsModalContent = () => {

  return (
    <View style={styles.container}>
      <Image
        source={NexusLabImage}
        style={styles.logo}
        accessible={true}
        accessibilityLabel="NexusLab logo purple"
        resizeMode="contain" 
      />
    
      <Text style={styles.paragraph}>
        The NexusLab project was born out of a passion and a desire to share the use of code in the artistic creation process.
        Our intention is to introduce this wonderful world to the curious and to create connections among enthusiasts!
      </Text>
      <Text style={styles.paragraph}>
        The team modestly strives to make this platform a place of creation, exchange, and reflection,
        all within an environment of kindness and respect.
      </Text>
      <Text style={styles.paragraph}>NexusLab Team.</Text>

      <Text style={styles.sectionTitle}>Contact us</Text>

      <View style={styles.contactLine}>
        <Ionicons 
          name={'at-outline'}
          size={23}
          style={styles.icon}
          accessible={true}
          accessibilityLabel={"Email icon"}
        />
        <Text style={styles.paragraph}>
        nexus.lab.contact@gmail.com
        </Text>
      </View>
      <View style={styles.contactLine}>
        <Ionicons 
          name={'location-outline'}
          size={23}
          style={styles.icon}
          accessible={true}
          accessibilityLabel={"Email icon"}
        />
        <Text style={styles.paragraph}>
          19 rue du gaz 33210 Langon      
        </Text>
      </View>
      <View style={styles.contactLine}>
        <Ionicons 
          name={'call-outline'}
          size={23}
          style={styles.icon}
          accessible={true}
          accessibilityLabel={"Email icon"}
        />
        <Text style={styles.paragraph}>
          +33 6 11 01 23 70
        </Text>
      </View>
      <Text style={[styles.paragraph, {'marginTop': 13}]}>
        If you need any information or have suggestions to make, do not hesitate to contact us.
      </Text>
    </View>
  );
};

export default AboutUsModalContent;

const styles = StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: colors.purple_dark,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 20,
      color: colors.cyan
    },
    paragraph: {
      fontSize: 14,
      lineHeight: 24,
      marginBottom: 12,
      color: colors.web_white
    },
    listItem: {
      fontSize: 14,
      marginBottom: 6,
      marginLeft: 16,
      color: colors.web_white
    },
    logo:{
      height: 100,
      width: 100,
      marginHorizontal: 'auto',
      marginBottom: 20
    },
    icon:{
      color: colors.web_white,
      marginRight: 7
    },
    contactLine:{
      flexDirection: 'row',
      marginVertical: 2
    },
  });
