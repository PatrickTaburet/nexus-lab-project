import React, { useState, useEffect, useRef} from 'react';
import { Image, SafeAreaView, TouchableOpacity, Text, StyleSheet, Modal, View, TextInput, ActivityIndicator, ImageBackground } from 'react-native';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';
import { colors } from '../../../utils/colors'
import globalStyles from '../../../utils/styles';
import { Ionicons } from '@expo/vector-icons'; 
import useApi from '../../../services/api/hooks/useApi';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import {jwtDecode} from 'jwt-decode';
import SaveArtworkModal from '../../../components/SaveArtworkModale';

const Scene1Screen = ({ navigation }) => {
  const [htmlContent, setHtmlContent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSceneId, setCurrentSceneId] = useState(null);
  const webViewRef = useRef(null);
  const {api} = useApi();
  const [initialLoading, setInitialLoading] = useState(true); 
  const [sendingDataLoading, setSendingDataLoading] = useState(false); 
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    async function loadHtmlFile() {
      const htmlAsset = Asset.fromModule(require('../../../assets/webView/SceneG1.html'));
      await htmlAsset.downloadAsync();
      setHtmlContent(htmlAsset.uri);
      setInitialLoading(false);   
    }
    loadHtmlFile();
  }, []);

  const handleWebViewMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    //console.log('Données reçues de la WebView:', data);
    sendDataToBackend(data);
  };

  const sendDataToBackend = async (data) => {
    try {
      setSendingDataLoading(true);
      const token = await AsyncStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      const fullData = {
        ...data, 
        userId: userId
      };
      const response = await api.post(`/generative/sendDataG1`, fullData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status !== 200) {
        throw new Error("Error sending data to the API");
      }

      const result = await response.data;
   
      setCurrentSceneId(result.sceneId);
      getImagePreview(result.sceneId);
      setModalVisible(true);
      setSendingDataLoading(false);
    } catch (error) {
      console.error("Error sending data :", error);
      setSendingDataLoading(false); 
    }
  };

  const getImagePreview = async (sceneId) => {
    try {
      const response = await api.post(`/saveScene/getPreview`, {
        sceneId: sceneId,
        sceneType: "Scene1"
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.data;
      setImagePreview(result.imageName);
     
      if (response.status !== 200) {
        throw new Error("Error getting image preview");
      }
    } catch (error) {
      console.error("Error trying to get image preview:", error);

    }
  }

  const handleSaveArtwork = async (title, comment) => {
    try {
      const response = await api.post(`/saveScene/Scene1/${currentSceneId}`, {
        title : title,
        comment : comment
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // console.log(response.data);
      if (response.status !== 200) {
        throw new Error("Error updating the scene");
      }
      setModalVisible(false);
      alert(`Artwork ${title} save in the gallery`);
    } catch (error) {
      console.error("Error trying to update the scene:", error);
    }
  };

  const deleteArtwork = async() => {
    try {
      const response = await api.post(`/artworks/delete/${currentSceneId}/Scene1`);
      // console.log(response.data);
      if (response.status !== 200) {
        throw new Error("Error deleting the scene");
      }
      console.log(`Artwork removed`);
    } catch (error) {
      console.error("Error trying to delete the scene:", error);
    }
  };
  
  const InitialLoadingOverlay = () => (
    <View style={[styles.loadingOverlay, { backgroundColor: colors.purple_dark }]}>
      <ActivityIndicator size="large" color={colors.purple_light} />
    </View>
  );

  const SendingDataLoadingOverlay = () => (
    <View style={[styles.loadingOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
      <ActivityIndicator size="large" color={colors.purple_light} />
    </View>
  );


  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../../assets/design/background-pannel-mobile.jpg')}
        style={styles.backgroundImage} 
        resizeMode="cover"
      >
        <TouchableOpacity 
          onPress={()=>{navigation.goBack()}}
          style={styles.backButton}
          accessible={true}
          accessibilityLabel="Go back"
          accessibilityHint="Returns to the previous screen"
        >
          <Ionicons 
            name={"arrow-back"}
            size={23}
            color={'white'}
          />
        </TouchableOpacity>
        <Text style={[styles.text, globalStyles.mainTitle]} accessible={true} accessibilityLabel="Title" accessibilityHint="Title of the artwork">
          Random Line Walkers
        </Text>

        {/* WebView : generative art scene */}

        {htmlContent && (
          <WebView 
            ref={webViewRef}
            originWhitelist={['*']}
            source={{ uri: htmlContent }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            style={styles.webview}
            onMessage={handleWebViewMessage}
            onLoadStart={() => setInitialLoading(true)}
            onLoadEnd={() => setInitialLoading(false)}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.error('WebView Error: ', nativeEvent);
            }}
            accessible={true}
            accessibilityLabel="Interactive content area"
            accessibilityHint="This area displays the interactive web content related to the artwork."
          />
        )}

        {/* Saving modale */}
        
        <SaveArtworkModal 
          visible={modalVisible}
          imagePreview={imagePreview}
          imageFolder={"scene1Img"}
          onClose={() => {
            setModalVisible(false);
            deleteArtwork();
          }}
          onSubmit={handleSaveArtwork}
        />
        {initialLoading && <InitialLoadingOverlay />}
        {sendingDataLoading && <SendingDataLoadingOverlay />}
      </ImageBackground>
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
    backgroundColor: 'transparent'
  },
  text:{
    color:'white',
    textAlign: 'center',
    fontSize: 18,
    margin: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 15,
    zIndex: 1000,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },


});

export default Scene1Screen;
