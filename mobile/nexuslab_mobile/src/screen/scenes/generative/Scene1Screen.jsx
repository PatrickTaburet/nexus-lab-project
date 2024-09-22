import React, {useState, useEffect} from 'react';
import { SafeAreaView, TouchableOpacity, Text, Modal,  View, StyleSheet } from 'react-native';

import { WebView } from 'react-native-webview';
import config from '../../../config/config'; 
import { Asset } from 'expo-asset';
import { colors } from '../../../utils/colors'
import globalStyles from '../../../utils/styles';
import { Ionicons } from '@expo/vector-icons'; 

const Scene1Screen = ({ navigation }) => {
  const [htmlContent, setHtmlContent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    async function loadHtmlFile() {
      const htmlAsset = Asset.fromModule(require('../../../assets/webView/SceneG1.html'));
      await htmlAsset.downloadAsync();
      setHtmlContent(htmlAsset.uri);
    }
    loadHtmlFile();
  }, []);

  if (!htmlContent) {
    return null; // ou un composant de chargement
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        onPress={()=>{navigation.goBack()}}
        style={styles.backButton}
      >
        <Ionicons 
          name={"arrow-back"}
          size={40}
          color={'white'}
        />
      </TouchableOpacity>
      <Text style={[styles.text, globalStyles.mainTitle]}>Random Line Walkers</Text>
      <TouchableOpacity 
        style={styles.descriptionButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.description, globalStyles.mainTitle]}>Description</Text>
      </TouchableOpacity>
      <WebView 
        originWhitelist={['*']}
        source={{ uri: htmlContent }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        style={styles.webview}
      />
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              This scene is a generator of randomly moving lines, called walkers.
            </Text>
            <Text style={styles.modalText}>
              By touching the canvas you can make these walkers appear wherever you desire. They will then move in a more or less random manner according to the parameters you choose.
            </Text>
            <Text style={styles.modalText}>
              You can influence the style, number, and movement of these walkers! Experiment with different settings and admire the results!
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView> 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.purple_dark,
  },
  webview: {
    flex: 1,
  },
  text:{
    color:'white',
    textAlign: 'center',
    fontSize: 16,
    margin: 20,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1000,
  },
  descriptionButton:{
   position: 'absolute',
   top: 410,
   left: 20,
   zIndex:1000,

  },
  description:{
    fontWeight: 700,
    fontSize: 15
  },

  // Modale style :

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  closeButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: colors.purple_dark,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default Scene1Screen;
