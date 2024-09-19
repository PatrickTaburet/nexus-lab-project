import { StyleSheet } from 'react-native';
import {colors} from './colors';

const globalStyles = StyleSheet.create({
  text1: {
    fontFamily:'Orbitron_800ExtraBold',
  },
  text2: {
    fontFamily:'Outfit_400Regular',
  },
  text3: {
    fontFamily:'Oxanium_400Regular',
  },
  mainTitle: {
    fontFamily:'Oxanium_400Regular',
    color: colors.primary,
  },
  warning: {
    color: 'red',
    fontSize: 16,
    fontFamily:'Outfit_400Regular',
  }


});

export default globalStyles;