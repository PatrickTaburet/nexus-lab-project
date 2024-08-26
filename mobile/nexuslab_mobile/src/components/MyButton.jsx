import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import globalStyles from '../utils/styles';
import { colors } from '../utils/colors'
import { LinearGradient } from 'expo-linear-gradient';

const MyButton = ({children, myStyle, HandlePress}) => {

  const textStyle = {
    ...myStyle,
    marginTop: undefined,
    marginBottom: undefined,
    marginLeft: undefined,
    marginRight: undefined,
    padding: undefined,
    paddingHorizontal: undefined,
    paddingVertical: undefined,
  };

  return (
    <View>
      <LinearGradient
        colors={['#AF40FF', '#5B42F3', '#00DDEB']}
        start={{ x: 0, y: 0.3 }}
        end={{ x: 1, y: 0.7 }}
        style={[styles.gradient, myStyle]}
      >
        <TouchableOpacity 
          style={[styles.customButton]}
          onPress={HandlePress}
        >
          <Text style={[styles.text, textStyle]} >{children}</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>

  )
}

export default MyButton

const styles = StyleSheet.create({
  text: {
    color: "white",
    fontFamily: 'Outfit_400Regular',
    fontSize: 16,
  },
  gradient: {
    flex: 1,
    backgroundColor: "yellow",
    borderRadius: 10,
    margin: 10,
    minHeight: 40,
    maxHeight: 50,
  },
  customButton:{
    alignItems: 'center',
    backgroundColor: 'rgb(5, 6, 45)',
    borderColor: 'transparent',
    borderRadius: 8,
    shadowColor: 'rgba(151, 65, 252, 0.2)',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    flex: 1,
    fontFamily: 'Orbitron_400Regular',
    fontSize: 17,
    justifyContent: 'center',
    lineHeight: 1,
    maxWidth: 150,
    minWidth: 110,
    minHeight: 40,
    maxHeight: 50,
    padding: 10,
    paddingHorizontal: 14,
    margin: 3,
    shadowInset: { offset: { width: 0, height: 0 }, opacity: 1, radius: 10, color: colors.primary },
    cursor: 'pointer',
    color: '#FFFFFF',
  }
})