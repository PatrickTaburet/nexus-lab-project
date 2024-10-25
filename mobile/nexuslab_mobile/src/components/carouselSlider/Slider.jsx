import { View, StyleSheet, ActivityIndicator} from 'react-native';
import React, { useState,useEffect, useCallback} from 'react';
import SliderItem from './SliderItem';
import Animated, { useAnimatedScrollHandler, useSharedValue} from 'react-native-reanimated';
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
      // console.log("pagination : " + currentIndex);
    }
  }, []);


  const viewabilityConfig = {
    itemVisiblePercentThreshold :50
  }
  
  return (
    <View style={styles.container} accessible={true} accessibilityLabel="Image slider">
        {(!sliderContent || sliderContent.length === 0) && (
          <View style={styles.loader} accessibilityLabel="Loading" >
            <ActivityIndicator size="large" />
          </View>
        )}
      <Animated.FlatList
        data={data}
        keyExtractor={(item, index) => `${item.id}_${index}`} 
        renderItem={({item}) => (
          <SliderItem item={item} />
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
        accessibilityLabel="Slider of the last three artworks generated on NexusLab" 
        accessibilityRole="list" 
      />
      <Pagination 
        items={sliderContent} 
        paginationIndex={paginationIndex % sliderContent.length}
        accessible={true}
        accessibilityLabel="Pagination controls"
      />
    </View>
  )
}

export default Slider

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
  },
  loader:{
    flex: 1,
    backgroundColor: 'transparent', 
    justifyContent: 'center',
    alignItems: 'center',
  },
});