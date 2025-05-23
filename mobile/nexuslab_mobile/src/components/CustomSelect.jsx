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
                const finalValue = topOffset + heightOfComponent + 5
                setTop(finalValue)
            }}
        >  
            <TouchableOpacity 
                style={styles.button} 
                activeOpacity={0.8}
                onPress={toogleExpanded}
                // hitSlop={{ top: 20, bottom: 30, left: 20, right: 20 }} 
                accessible={true}
                accessibilityLabel={expanded ? "Collapse dropdown" : "Expand dropdown"}
                accessibilityHint={`Tap to ${expanded ? 'collapse' : 'expand'} the options`}
                accessibilityRole="button"
            >
                <Text style={styles.text}>{value || placeholder}</Text>
                <Ionicons 
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
                                accessible={true}
                                accessibilityLabel="Dropdown options"
                            >
                                <FlatList
                                    keyExtractor = {(item) => item.value}
                                    data = {data}
                                    renderItem = {({ item }) =>(
                                        <TouchableOpacity 
                                            activeOpacity={0.8} 
                                            style={styles.optionItem}
                                            onPress={() => onSelect(item)}
                                            accessibilityLabel={item.label}
                                            accessibilityHint={`Select ${item.label}`}
                                        >
                                            <Text style={styles.optionItemTxt}>{item.label}</Text>
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
        height: 35,
        justifyContent: 'center',
    }, 
    optionItemTxt:{
        fontSize: 16,
    },
    separator:{
        height: 4
    },
    options:{
        position:"absolute",
        // top:53,
        backgroundColor: '#F5F5F5',
        width: 110,
        padding: 10,
        borderRadius: 6,
        maxHeight: 250,
        zIndex: 15, 
        left: 20,
    },
    text:{
        fontSize: 16,
        fontWeight: '600',
        opacity: 0.8,
    },
    button:{
        height: 40,
        justifyContent: 'space-between',
        backgroundColor: '#F5F5F5',
        flexDirection: 'row',
        width: 110,
        alignItems: 'center',
        paddingHorizontal: 15,
        marginTop: 10,
        marginHorizontal: 0,
        borderRadius: 8,
        zIndex: 10
    },
    arrowIcon:{

    },


})