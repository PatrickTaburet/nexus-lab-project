import React, {useState, useEffect} from 'react';
import { SafeAreaView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import config from '../../../config/config'; 
import { Asset } from 'expo-asset';
import { colors } from '../../../utils/colors'
import globalStyles from '../../../utils/styles';
import { Ionicons } from '@expo/vector-icons'; 

const Scene1Screen = ({ navigation }) => {
  const [htmlContent, setHtmlContent] = useState(null);
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
      <TouchableOpacity onPress={()=>{navigation.goBack()}}>
        <Ionicons 
          name={"arrow-back"}
          size={40}
          style={styles.inputIcon}
        />
      </TouchableOpacity>
      <Text style={[styles.text, globalStyles.mainTitle]}>Random Line Walkers</Text>
      <WebView 
        originWhitelist={['*']}
        source={{ uri: htmlContent }}
        // source={{ uri: 'assets/webView/sketch.html' }} // Pour Android
        // source={{ uri: `${config.apiUrl}/assets/webView/sketch.html` }} // Pour Android
        // source={{ uri: 'file://sketch.html' }} // Pour iOS
        javaScriptEnabled={true}
        domStorageEnabled={true}
        style={styles.webview}
      />
    </SafeAreaView> 
  );
};

// navigation.goBack();

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
  inputIcon:{
    position: 'absolute',
    
    margin:10,
    width: 40,
    color: 'white'
  },
});

export default Scene1Screen;

// const Scene1Screen = ({ navigation })  => {


//   return (
//       <View style={styles.container}>
//         <Text style={styles.text}>Bienvenue sur Scene1Screen!</Text>
//       </View>
//   )
// }

// export default Scene1Screen

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   text: {
//     fontSize: 20,
//     marginBottom: 20,
//   },


// })