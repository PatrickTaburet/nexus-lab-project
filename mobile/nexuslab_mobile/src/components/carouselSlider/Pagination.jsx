import { StyleSheet, Text, View, Dimensions} from 'react-native'
import React from 'react'
import Animated, {Extrapolation, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue} from 'react-native-reanimated';

const {width} = Dimensions.get('screen');

const Pagination = ({items, paginationIndex, scrollX}) => {
  return (
    <View style={styles.container}>
        {items.map((_,index) => {
            // const pgAnimatedStyle = useAnimatedStyle(() => {
            //     const dotWidth = interpolate(
            //         scrollX.value,
            //         [(index-1) * width, index * width, (index+1) * width],
            //         [8, 20, 8],
            //         Extrapolation.CLAMP
            //     );
            //     return { width: dotWidth};
            // })
            return (
                <Animated.View 
                key={index} 
                style={[
                    styles.dot, 
                    // pgAnimatedStyle,
                    {backgroundColor: paginationIndex % items.length === index ? '#222' : '#aaa'},
                ]}/>
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