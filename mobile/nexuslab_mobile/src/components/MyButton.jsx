import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const MyButton = ({children, style, onPress, color, isSecondary = false, textStyle  }) => {

  // Merges the provided textStyle prop with default styles,
  // while explicitly removing margin and padding properties to prevent layout conflicts.
  const finalTextStyle = {
    ...textStyle,
    marginTop: undefined,
    marginBottom: undefined,
    marginLeft: undefined,
    marginRight: undefined,
    padding: undefined,
    paddingHorizontal: undefined,
    paddingVertical: undefined,
  };

  const defaultButtonStyle = {
    height: 50,
    width: 130,   
  };
  const combinedButtonStyle = [
    style || defaultButtonStyle, 
  ];

  return (
    <View style={[styles.container, combinedButtonStyle]}>
      <LinearGradient
        colors={['#AF40FF', '#5B42F3', '#00DDEB']}
        start={{ x: 0, y: 0.3 }}
        end={{ x: 1, y: 0.7 }}
        style={[styles.gradient]}
      >
        <View style={[(isSecondary ? styles.secondaryBackground : styles.innerButton), (color? {backgroundColor : color} : null)]}>
          <TouchableOpacity 
            style={styles.touchable}
            onPress={onPress}
            accessibilityLabel={children}  
            accessibilityHint="Tap to perform the action" 
            accessibilityRole="button"
          >
            <Text style={[styles.text, finalTextStyle, isSecondary && {color: '#1A1A1A'}]}   numberOfLines={0} >{children}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  )
}

export default MyButton

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  text: {
    color: "white",
    fontFamily: 'Outfit_400Regular',
    fontSize: 18,
    textAlign: 'center',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    padding: 2
  },
  customButton:{
    backgroundColor: 'rgb(5, 6, 45)',

  },
  secondaryBackground:{
    backgroundColor: 'rgba(255, 226, 255, 0.7)',
    flex: 1,
    borderRadius: 8,

  },
  innerButton: {
    flex: 1,
    backgroundColor: 'rgb(5, 6, 45)',
    borderRadius: 8,
  },
  touchable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})