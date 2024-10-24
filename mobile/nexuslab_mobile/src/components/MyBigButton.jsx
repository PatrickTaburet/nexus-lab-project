import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import globalStyles from '../utils/styles';
import { colors } from '../utils/colors'
import { LinearGradient } from 'expo-linear-gradient';

const MyBigButton = ({children, myStyle, HandlePress, buttonStyle, textStyle, isSecondary=false }) => {

  const CustomTextStyle = {
    ...textStyle,
    marginTop: undefined,
    marginBottom: undefined,
    marginLeft: undefined,
    marginRight: undefined,
    padding: undefined,
    paddingHorizontal: undefined,
    paddingVertical: undefined,
  };

  const buttonCombinedStyle = [
    styles.customButton,
    buttonStyle,
  ];
  return (
    <View>
      <TouchableOpacity 
        style={buttonCombinedStyle}
        onPress={HandlePress}
        accessibilityLabel={children}  
        accessibilityHint="Tap to perform the action" 
        accessibilityRole="button"
      >
        <LinearGradient
          colors={isSecondary ? ['#E5E5EA', '#AAAAAA', '#666666']  : ['#AF40FF', '#5B42F3', '#00DDEB']}
          start={{ x: 0, y: 0.3 }}
          end={{ x: 1, y: 0.7 }}
          style={[styles.gradient, myStyle]}
        >
          <Text style={[styles.text, CustomTextStyle]} >{children}</Text>
        </LinearGradient>
      </TouchableOpacity>

    </View>

  )
}

export default MyBigButton

const styles = StyleSheet.create({
  text: {
    color: "white",
    fontFamily: 'Outfit_400Regular',
    fontSize: 18,
    textAlign: 'center',
    zIndex:10,
  },
  gradient: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cyan,
    // minHeight: 40,
    // maxHeight: 50,
    justifyContent: 'center', 
    alignItems: 'center',
    zIndex: 1,
    padding: 10,
  },
  customButton:{
    alignItems: 'center',
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
    // maxWidth: 150,
    // minWidth: 110,
    // minHeight: 40,
    // maxHeight: 50,
    padding: 10,
    paddingHorizontal: 14,
    margin: 3,
    shadowInset: { offset: { width: 0, height: 0 }, opacity: 1, radius: 10, color: colors.primary },
    cursor: 'pointer',
    color: '#FFFFFF',
  },

})