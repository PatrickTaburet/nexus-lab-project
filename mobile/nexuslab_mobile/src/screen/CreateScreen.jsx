import { View, Text, Button, StyleSheet } from 'react-native';
import React from 'react'
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomSelect from '../components/CustomSelect';

const CreateScreen = ({ navigation })  => {


  return (
      // <View style={styles.container}>
      //   <Text style={styles.text}>Bienvenue sur CreateScreen!</Text>
      // </View>
              <View style={styles.selectContainer}>
                <CustomSelect
                  data={[
                    { value: "date", label: "Date" },
                    { value: "likes", label: "Like" },
                  ]}
                  onChange={(item) => {
                    console.log(item.value); 
                  }}
                  placeholder="Sort by .."
                />
              </View>
  )
}

export default CreateScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  selectContainer:{
    position:'absolute',
    alignItems: 'flex-start',
    marginLeft: 20,
    marginTop: 0,
    top:0,
    zIndex: 1000
 }

})