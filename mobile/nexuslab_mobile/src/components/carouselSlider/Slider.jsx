import { Image, View, Text, StyleSheet } from 'react-native';
import React, { Component, useState, useRef, useEffect} from 'react';
import SliderItem from './SliderItem';
import Animated, {useAnimatedRef, useAnimatedScrollHandler, useSharedValue} from 'react-native-reanimated';
import Pagination from './Pagination';

const Slider = ({sliderContent}) => {
  const [paginationIndex, setPaginationIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const [data, setData] = useState(sliderContent);
  const ref = useAnimatedRef();

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    }
  })

  useEffect(() => {
    setData(sliderContent);
  }, [sliderContent]);

  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems[0].index !== undefined && viewableItems[0].index !== null) {
      const currentIndex = viewableItems[0].index;

      // Boucler après le dernier élément
      if (currentIndex === sliderContent.length) {
        // Retourner au premier élément
        ref.current.scrollToIndex({ index: 0, animated: false });
        setPaginationIndex(0);
      } else {
        setPaginationIndex(currentIndex % data.length);
      }
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
        ref={ref}
        data={data}
        keyExtractor={(item, index) => `${item.id}_${index}`} 
        renderItem={({item, index}) => (
          <SliderItem item={item} index={index} scrollX={scrollX}/>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={onScrollHandler}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        onEndReached={() => setData([...data, ...sliderContent])}
        onEndReachedThreshold={0.5}
        scrollEventThrottle={16}
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