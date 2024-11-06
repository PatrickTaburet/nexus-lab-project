import React, { useState } from 'react'
import { TouchableWithoutFeedback, Image, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../utils/colors';
import config from '../config/config'; 
import MyModale from './MyModale';
import MyButton from './MyButton';

const UserCard = React.memo(({ item, onImagePress, onLabelPress, api, onDeleteSuccess, navigation }) => {
    const idPrefix = item.id.split('_')[0]; 
    const sceneId = item.id.split('_')[1]; 
    const imagePath = `${config.apiUrl}/images/${idPrefix}Img/${item.imageName}`;
    const [modalVisible, setModalVisible] = useState(false);
  
  
    const deleteArtwork = async() => {
        try {
            const response = await api.post(`/artworks/delete/${sceneId}/${idPrefix}`);
            console.log(response.data);
            if (response.status !== 200) {
                throw new Error("Erreur lors de la suppression de la scène");
            }
            console.log(`Artwork removed`);
            setModalVisible(false);
            onDeleteSuccess(); 
        } catch (error) {
            console.error(error.config);
            console.error("Erreur lors de la suppression de la scène:", error);
        }
    };
    
    return (
        <View style={styles.card}> 
            <MyModale
                visible={modalVisible}
                onClose={() => {
                setModalVisible(false);
                }}
                onSubmit={deleteArtwork}
                title={`Delete the Artwork : ${item.title} ?`}
                accessibilityLabel={`Delete artwork modal for ${item.title}`}
            />
            <TouchableWithoutFeedback  
                onPress={() => onImagePress(imagePath)}
                accessible={true}
                accessibilityLabel={`Open artwork titled ${item.title}`}
            >
                <Image 
                source={{ uri: imagePath }}
                style={styles.image}
                accessible={true}
                accessibilityLabel={`Artwork titled ${item.title}`}
                />
            </TouchableWithoutFeedback >
            <View style={styles.cardContent}>
                <Text 
                    style={styles.title} 
                    accessible={true} 
                    accessibilityLabel={`Artwork Title: ${item.title}`}
                >
                    Title: {item.title}
                </Text>
                <Text 
                    style={styles.comment} 
                    accessible={true} 
                    accessibilityLabel={`Comment: ${item.comment}`} 
                >
                    Comment: {item.comment}
                </Text>
                <View style={styles.separator}></View>
                <Text 
                    style={styles.text} 
                    accessible={true} 
                    accessibilityLabel={`Date: ${item.updatedAt}`}
                >
                    Date: {item.updatedAt}
                </Text> 
                <View style={styles.bottomCard}>
                    <TouchableOpacity 
                        onPress={() => onLabelPress(idPrefix)} 
                        style={styles.labelContainer}
                        accessible={true}
                        accessibilityLabel={`View label for ${idPrefix}`}
                    >
                    <Text 
                        style={[styles.label, idPrefix.includes('D') ? styles.labelData : styles.labelGenerative]}
                    >
                        {idPrefix.includes('D') ? "Data Art" : "Generative Art"}
                    </Text>
                    <Text style={styles.text}>
                        {(() => {
                        switch (idPrefix) {
                            case "Scene1":
                            return "Random Line Walker";
                            case "Scene2":
                            return "Noise Orbit";
                            case "SceneD1":
                            return "CO2 Emission Explorer";
                            case "SceneD2":
                            return "Demographic Artistry";
                            default:
                            return "Unknown scene"; 
                        }
                        })()}
                    </Text >
                </TouchableOpacity>
                <Text style={styles.likeTxt}>
                    {item.likes} like{item.like > 0 ? "s" : ""}
                </Text>
            </View>
            <View style={styles.buttonBottom}>
                <MyButton
                    onPress={() => {setModalVisible(true)}}
                    isSecondary={true}
                    style={styles.cardButton}
                    accessible={true}
                    accessibilityLabel={`Delete artwork titled ${item.title}`}
                    accessibilityHint="Touch to delete this artwork"
                >       
                    Delete
                </MyButton>
                <MyButton
                    onPress={() => navigation.navigate('EditArtwork', { idPrefix, sceneId })}
                    style={styles.cardButton}
                    accessible={true}
                    accessibilityLabel={`Edit artwork titled ${item.title}`}
                    accessibilityHint="Touch to edit this artwork"
                >       
                    Edit
                </MyButton>
            </View>
        </View> 
    </View> 
    )
}); 

export default UserCard;
  
const styles = StyleSheet.create({
    card: {
        marginBottom: 20,
        backgroundColor: colors.web_white,
        borderRadius: 12,
        borderStyle: 'solid',
        borderWidth: 1.5,
        borderColor: colors.cyan,
        overflow: 'hidden',
        marginHorizontal: 20,
        backgroundColor: 'hsla(216, 50%, 16%, 0.8)', 
    },
    image: {
        width: '100%',
        height: 200,
    },
    cardContent: {
        padding: 10,
        gap: 13
    },
    title: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.web_white,
        paddingHorizontal: 10
    },
    comment: {
        textAlign: 'center',
        fontSize: 15,
        marginTop: 5,
        color: colors.web_white,
        paddingHorizontal: 10
    },
    text: {
        fontSize: 15,
        color: colors.web_white,
        textAlign: 'center',
    },
    labelGenerative:{
        backgroundColor: colors.primary_dark,
        width: 120,
    },
    labelData:{
        backgroundColor: colors.secondary,
        width: 100,
    },
    label:{
        fontSize: 16,
        color: colors.web_white,
        textAlign:'center',
        paddingVertical: 5,
        borderRadius: 6
    },
    bottomCard:{
        flexDirection: 'row', 
        justifyContent:'space-between', 
        marginRight: 0,
        marginLeft: 15, 
        marginVertical: 5
    },
    separator:{
        width: '90%',
        height: 2,
        backgroundColor: colors.line_dark,
        alignSelf: 'center',
        marginVertical: 5,
    },
    labelContainer:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonBottom:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        height: 70,
        gap: 15,
        marginTop: 7
    },
    cardButton:{
        height: 50,
        width: 120, 
    },
    likeTxt:{
        color: colors.web_white,
        fontSize: 18,
        marginTop: 17,
        marginRight: 58
    },
});

