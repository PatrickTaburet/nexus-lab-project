import { Image, View, Text, StyleSheet } from 'react-native';
import React, { Component, useState, useRef} from 'react';
import SliderItem from './SliderItem';
import Animated, {useAnimatedScrollHandler, useSharedValue} from 'react-native-reanimated';
import Pagination from './Pagination';

const Slider = ({sliderContent}) => {
  const [paginationIndex, setPaginationIndex] = useState(0);
  const scrollX = useSharedValue(0);

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    }
  })
  const onViewableItemsChanged = ({viewableItems}) => {
    if (viewableItems[0].index !== undefined &&  viewableItems[0].index !== null){
      setPaginationIndex(viewableItems[0].index);
    }
  };
  const viewabilityConfig = {
    itemVisiblePercentThreshold :50
  }
  const viewabilityConfigCallbackPairs = useRef([
    {viewabilityConfig, onViewableItemsChanged}
  ])

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={sliderContent }
        renderItem={({item, index}) => (
          <SliderItem item={item} index={index} scrollX={scrollX}/>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={onScrollHandler}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />
      <Pagination 
        items={sliderContent} 
        scrollX={scrollX} 
        paginationIndex={paginationIndex}
      />
    </View>
  )
}

export default Slider


const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 350
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
    width: 250,
  },

});