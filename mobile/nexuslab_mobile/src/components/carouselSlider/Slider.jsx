import { View, StyleSheet, ActivityIndicator} from 'react-native';
import React, { Component, useState, useRef, useEffect, useCallback} from 'react';
import SliderItem from './SliderItem';
import Animated, {useAnimatedRef, useAnimatedScrollHandler, useSharedValue} from 'react-native-reanimated';
import Pagination from './Pagination';

const Slider = ({sliderContent}) => {
  const scrollX = useSharedValue(0);
  const [paginationIndex, setPaginationIndex] = useState(0);
  const [data, setData] = useState(sliderContent);

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    }
  })

  useEffect(() => {
    console.log('useffect');
    console.log(sliderContent.length);
    
    setData(sliderContent); 
  }, [sliderContent]);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems[0]?.index !== undefined && viewableItems[0]?.index !== null) {
      const currentIndex = viewableItems[0].index;
      setPaginationIndex(currentIndex);
      console.log("pagination : " + currentIndex);
    }
  }, []);


  const viewabilityConfig = {
    itemVisiblePercentThreshold :50
  }
  
  return (
    <View style={styles.container}>
        {(!sliderContent || sliderContent.length === 0) && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" />
          </View>
        )}
      <Animated.FlatList
        data={data}
        keyExtractor={(item, index) => `${item.id}_${index}`} 
        renderItem={({item, index}) => (
          <SliderItem item={item} index={index} scrollX={scrollX}/>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={onScrollHandler}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        onEndReached={() => setData([...data, ...sliderContent])}
        onEndReachedThreshold={0.5}
        scrollEventThrottle={16}
      />
      <Pagination 
        items={sliderContent} 
        paginationIndex={paginationIndex % sliderContent.length}
      />
    </View>
  )
}

export default Slider

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    // height: 350
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
    // width: 250,
  },
  loader:{
    flex: 1,
    backgroundColor: 'transparent', 
    justifyContent: 'center',
    alignItems: 'center',
  },
});