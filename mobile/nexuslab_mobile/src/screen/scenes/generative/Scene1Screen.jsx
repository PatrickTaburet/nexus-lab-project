import React, {useState, useEffect, useRef} from 'react';
import { SafeAreaView, TouchableOpacity, Text, StyleSheet, Modal, View, TextInput, ActivityIndicator, ImageBackground } from 'react-native';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';
import { colors } from '../../../utils/colors'
import globalStyles from '../../../utils/styles';
import { Ionicons } from '@expo/vector-icons'; 
import useApi from '../../../services/api/hooks/useApi';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import {jwtDecode} from 'jwt-decode';
import MyButton from '../../../components/MyButton';

const SaveArtworkModal = ({ visible, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={[styles.modalHeader, globalStyles.mainTitle]}>Save my Artwork</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Comment"
            value={comment}
            onChangeText={setComment}
            multiline
          />
          <View style={styles.buttonContainer}>
            <MyButton
              onPress={() => onSubmit(title, comment)}
            >
              Submit
            </MyButton>
            <MyButton
              onPress={onClose}
              isSecondary={true}
            >
              Back
            </MyButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const Scene1Screen = ({ navigation }) => {
  const [htmlContent, setHtmlContent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSceneId, setCurrentSceneId] = useState(null);
  const webViewRef = useRef(null);
  const {api} = useApi();
  const [initialLoading, setInitialLoading] = useState(true); 
  const [sendingDataLoading, setSendingDataLoading] = useState(false); 

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
    // console.log('Données reçues de la WebView:', data);
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
        throw new Error("Erreur lors de l'envoi des données à l'API");
      }

      const result = await response.data;
   
      setCurrentSceneId(result.sceneId);
      setModalVisible(true);
      setSendingDataLoading(false);
    } catch (error) {
      console.error("Erreur lors de l'envoi des données:", error);
      setSendingDataLoading(false); 
    }
  };

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
        throw new Error("Erreur lors de la mise à jour de la scène");
      }
      setModalVisible(false);
      alert(`Artwork ${title} save in the gallery`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la scène:", error);
    }
  };

  const deleteArtwork = async() => {
    try {
      const response = await api.post(`/artworks/delete/${currentSceneId}/Scene1`);
      // console.log(response.data);
      if (response.status !== 200) {
        throw new Error("Erreur lors de la suppression de la scène");
      }
      console.log(`Artwork removed`);
    } catch (error) {
      console.error("Erreur lors de la suppression de la scène:", error);
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
        >
          <Ionicons 
            name={"arrow-back"}
            size={23}
            color={'white'}
          />
        </TouchableOpacity>
        <Text style={[styles.text, globalStyles.mainTitle]}>Random Line Walkers</Text>

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
          />
        )}
        <SaveArtworkModal 
          visible={modalVisible}
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
  // Modale

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.purple_dark,
    padding: 20,
    borderRadius: 10,
    width: '80%',
    borderWidth: 2,
    borderColor: colors.cyan,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: colors.lightest
  },
  modalHeader:{
    textAlign: "center",
    marginBottom: 15,
    fontSize: 19,
    height: 40,
    marginTop: 10,
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
  buttonContainer:{
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    marginTop: 5
  }
});

export default Scene1Screen;
