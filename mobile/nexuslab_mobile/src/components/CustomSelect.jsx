import React, {useCallback, useState, useRef} from 'react';
import {TouchableWithoutFeedback, Modal, FlatList, StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CustomSelect({ data, onChange, placeholder }) {

    const buttonRef = useRef(null);
    const [top, setTop] = useState(0);
    const [value, setValue] = useState("");
    const [expanded, setExpanded] = useState(false);

    const toogleExpanded = useCallback(() => setExpanded(!expanded), [expanded]);

    const onSelect = useCallback((item) => {
        onChange(item);
        console.log(top);
        setValue(item.label);
        setExpanded(false);
      }, [onChange]);

    return (
        <View
            ref={buttonRef}
            onLayout={(event)=>{
                const layout = event.nativeEvent.layout;
                const topOffset = layout.y;
                const heightOfComponent = layout.height;
                // const finalValue = topOffset + heightOfComponent
                const finalValue = topOffset + heightOfComponent + 23
                console.log(finalValue)
                setTop(finalValue)
            }}
        >  
            <TouchableOpacity 
                style={styles.button} 
                activeOpacity={0.8}
                onPress={toogleExpanded}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} 
            >
                <Text style={styles.text}>{value || placeholder}</Text>
                <Ionicons 
                    // onPress={handleLike} 
                    name={expanded ? "caret-up" : "caret-down"}
                    size={25}
                    style={styles.arrowIcon}
                />
            </TouchableOpacity>
            {expanded ? (
                <Modal visible={expanded} transparent>
                    <TouchableWithoutFeedback onPress={()=> setExpanded(false)}>
                        <View style={styles.backdrop}>
                            <View 
                                style={[
                                    styles.options, 
                                    {
                                        top,
                                    },
                                ]}
                            >
                                <FlatList
                                    keyExtractor = {(item) => item.value}
                                    data = {data}
                                    renderItem = {({ item }) =>(
                                        <TouchableOpacity 
                                            activeOpacity={0.8} 
                                            style={styles.optionItem}
                                            onPress={() => onSelect(item)}

                                        >
                                            <Text>{item.label}</Text>
                                        </TouchableOpacity>
                                    )}
                                    ItemSeparatorComponent = {() => (
                                        <View style={styles.separator}/>
                                    )}
                                />
                            </View>
                        </View>  
                    </TouchableWithoutFeedback>
                </Modal>
                
            ): null }
        </View>
    )
}

const styles = StyleSheet.create({
    backdrop:{
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    optionItem:{
        height: 40,
        justifyContent: 'center',
    },
    separator:{
        height: 4
    },
    options:{
        position:"absolute",
        // top:53,
        backgroundColor: 'white',
        width: 130,
        padding: 10,
        borderRadius: 6,
        maxHeight: 250,
        zIndex: 5,
        left: 20
    },
    text:{
        fontSize: 15,
        opacity: 0.8,
    },
    button:{
        height: 40,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        flexDirection: 'row',
        width: 130,
        alignItems: 'center',
        paddingHorizontal: 15,
        marginVertical: 10,
        borderRadius: 8,
        margin: 'auto'
    },
    arrowIcon:{

    },


})