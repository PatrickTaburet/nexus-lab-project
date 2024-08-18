import { StyleSheet } from 'react-native';
import { colors } from './colors'
const globalStyles = StyleSheet.create({
  text1: {
    fontFamily:'Orbitron_800ExtraBold',
    fontSize: 24,
  },
  text2: {
    fontFamily:'Outfit_400Regular',
    fontSize: 24,
  },
  text3: {
    fontFamily:'Oxanium_400Regular',
    fontSize: 24,
  },
  
/* 
========================
Update button style
========================
*/

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
    minWidth: 100,
    padding: 10,
    paddingHorizontal: 14,
    margin: 10,
    shadowInset: { offset: { width: 0, height: 0 }, opacity: 1, radius: 10, color: colors.primary },
    cursor: 'pointer',
    color: '#FFFFFF',
  }

});

export default globalStyles;