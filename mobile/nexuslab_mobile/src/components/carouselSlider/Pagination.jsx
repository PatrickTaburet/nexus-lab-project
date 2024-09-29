import { StyleSheet, Text, View, Dimensions} from 'react-native'
import React from 'react'
import Animated from 'react-native-reanimated';

const {width} = Dimensions.get('screen');

const Pagination = ({items, paginationIndex}) => {
    console.log('pagination :');
    
    console.log(items.length)
    console.log(paginationIndex)

  return (
    <View style={styles.container}>
        {items.map((_,index) => {
            return (
                <Animated.View 
                    key={index} 
                    style={[
                        styles.dot, 
                        // pgAnimatedStyle,
                        {backgroundColor: paginationIndex === index ? '#222' : '#aaa'}, //00fff7
                    ]}
                />
            );
        })}
    </View>
  )
}

export default Pagination

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',

    },
    dot:{
        backgroundColor: '#aaa',
        height: 8,
        width: 8,
        marginHorizontal: 2,
        borderRadius: 8

    }
})