import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TabNavigator from './TabNavigator';
import ProfileScreen from '../screen/ProfileScreen';
import EditProfileScreen from '../screen/EditProfileScreen';
import MyArtworksScreen from '../screen/MyArtworksScreen';
import EditArtworkScreen from '../screen/EditArtworkScreen';
import { colors } from '../utils/colors'

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={({ navigation }) => ({
          headerTransparent: true, // Rend le header transparent
          headerTitle: '', // Supprime le titre du header
          headerStyle: {
            backgroundColor: 'transparent', // Assure que le fond est transparent
            elevation: 0, // Supprime l'ombre sur Android
            shadowOpacity: 0, // Supprime l'ombre sur iOS
          },
          headerShown: true, // Cacher le header pour le TabNavigator
          accessibilityLabel: 'Main screen with navigattion bottom bar and user profile header',
          header: (props) => (
            <View style={{ pointerEvents: 'box-none', zIndex: 1000 }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Profile')}
                style={{ marginRight: -7, marginTop: -1, zIndex: 1000, position:'absolute', right:15, top:7 }}
                accessible={true} 
                accessibilityRole="button" 
                accessibilityLabel="Show user profile" 
                accessibilityHint="Touch to open user profile modale"
              >
                <Ionicons name="person-circle-outline" size={42} color="white" />
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          presentation: 'modal',
          headerShown: false,
          accessibilityLabel: 'User profile screen',
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen} 
        options={{
          headerTransparent: true,
          presentation: 'modal',
          headerTitle: 'Edit Profile',
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
          },
          headerTitleStyle: { // Text
            color: colors.lightest,
            fontSize: 18, 
          },
          headerTintColor: colors.lightest, // Icon
          accessibilityLabel: 'Edit user profile screen',
        }}
      />
      <Stack.Screen
        name="MyArtworks"
        component={MyArtworksScreen} 
        options={{
          headerTransparent: true,
          presentation: 'modal',
          headerTitle: 'My Artworks',
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
          },
          headerTitleStyle: { // Text
            color: colors.lightest,
            fontSize: 18, 
          },
          headerTintColor: colors.lightest, // Icon
          accessibilityLabel: 'User personnal artworks gallery',
        }}
      />
      <Stack.Screen
        name="EditArtwork"
        component={EditArtworkScreen} 
        options={{
          headerTransparent: true,
          presentation: 'modal',
          headerTitle: 'Edit Artwork',
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
          },
          headerTitleStyle: { // Text
            color: colors.lightest,
            fontSize: 18,
          },
          headerTintColor: colors.lightest, // Icon
          accessibilityLabel: 'Edit user artwork',
        }}
      />

    </Stack.Navigator>
  );
};

export default MainNavigator;