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
import * as FileSystem from 'expo-file-system';
import config from '../../../config/config'; 

const SaveArtworkModal = ({ visible, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  return (
    <Modal visible={visible} transparent animationType="slide" accessible={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={[styles.modalHeader, globalStyles.mainTitle]}>Save my Artwork</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            accessible={true}
            accessibilityLabel="Artwork Title"
            accessibilityHint="Enter the title for your artwork"
          />
          <TextInput
            style={styles.input}
            placeholder="Comment"
            value={comment}
            onChangeText={setComment}
            multiline
            accessible={true}
            accessibilityLabel="Artwork Comment"
            accessibilityHint="Enter comments or description for your artwork"
          />
          <View style={styles.buttonContainer}>
            <MyButton
              onPress={() => {
                onSubmit(title, comment);
                setTitle('');
                setComment('');
              }}
              accessible={true}
              accessibilityLabel="Submit Artwork"
              accessibilityHint="Tap to submit your artwork details"
            >
              Submit
            </MyButton>
            <MyButton
              onPress={onClose}
              isSecondary={true}
              accessible={true}
              accessibilityLabel="Close Modal"
              accessibilityHint="Tap to go back without saving"
            >
              Back
            </MyButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const SceneD2Screen = ({ navigation }) => {
  const [htmlContent, setHtmlContent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSceneId, setCurrentSceneId] = useState(null);
  const webViewRef = useRef(null);
  const {api} = useApi();
  const [initialLoading, setInitialLoading] = useState(true); 
  const [sendingDataLoading, setSendingDataLoading] = useState(false); 

  useEffect(() => {
    async function loadHtmlFile() {
      try {
        const htmlAsset = Asset.fromModule(require('../../../assets/webView/SceneD2.html'));
        await htmlAsset.downloadAsync();
        setHtmlContent(htmlAsset.uri);
      } catch (error) {
        console.error('Erreur de téléchargement du fichier HTML:', error);
      } finally {
        setInitialLoading(false);
      }
    }
    loadHtmlFile();
  }, []);

  const downloadFile = async (url, filename) => {
    const fileUri = `${FileSystem.documentDirectory}${filename}`;
    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      fileUri,
      {},
      false
    );
    try {
      const { uri } = await downloadResumable.downloadAsync();
      return uri;
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const loadPopulationData = async () => {
      try {
        const files = ['China_pop.txt', 'India_pop.txt', 'US_pop.txt'];
        const data = {};
  
        for (const file of files) {
          const fileUri = await downloadFile(`${config.apiUrl}/data/dataS2/${file}`, file);
          const content = await FileSystem.readAsStringAsync(fileUri);
          const countryName = file.split('_')[0];
          data[countryName] = JSON.parse(content);
        }
        //console.log('Données chargées:', data);
        // setPopulationData(data); 
        const populationDataString = JSON.stringify(data);
        //console.log(populationDataString);
         
        if (webViewRef.current) {
          const jsCode = `
            window.populationData = ${populationDataString};
            window.dispatchEvent(new Event('populationDataReceived'));
          `;
          webViewRef.current.injectJavaScript(jsCode);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } 
    };
  
    loadPopulationData();
  }, []);

  const handleWebViewMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    console.log('Message reçu:');
    // console.log(data);
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
      console.log("avant requete");
      
      const response = await api.post(`/dataScene/sendDataD2`, fullData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status !== 200) {
        throw new Error("Erreur lors de l'envoi des données à l'API");
      }

      const result = await response.data;
      console.log("result")
      console.log(result)
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
      const response = await api.post(`/saveScene/SceneD2/${currentSceneId}`, {
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

  const deleteArtwork = async($currentSceneId) => {
    try {
      const response = await api.post(`/artworks/delete/${currentSceneId}/SceneD2`);
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
        source={require('../../../assets/design/background-data-mobile.jpg')}
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
          Demographic Artistery
        </Text>

        {/* WebView : data art scene */}
        
        {htmlContent && (
          <WebView 
            ref={webViewRef}
            originWhitelist={['*']}
            source={{ uri: htmlContent }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            style={styles.webview} 
            // onMessage={(event) => {
            //   console.log("Log from WebView:", event.nativeEvent.data);
            // }}
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
          onClose={() => {
            setModalVisible(false);
            deleteArtwork(currentSceneId);
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
  submitButton: {
  },
  closeButton: {
    color: colors.purple_dark,
    margin: 0
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
    marginTop: 5,
  }
});

export default SceneD2Screen;
