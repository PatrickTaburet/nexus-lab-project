import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TabNavigator from './TabNavigator';
import ProfileScreen from '../screen/ProfileScreen';
import EditProfileScreen from '../screen/EditProfileScreen';
import { colors } from '../utils/colors'

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={({ navigation }) => ({
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile')}
              style={{ marginRight: -5, marginTop: 5 }}
            >
              <Ionicons name="person-circle-outline" size={42} color="black" />
            </TouchableOpacity>
          ),
          headerTransparent: true, // Rend le header transparent
          headerTitle: '', // Supprime le titre du header
          headerStyle: {
            backgroundColor: 'transparent', // Assure que le fond est transparent
            elevation: 0, // Supprime l'ombre sur Android
            shadowOpacity: 0, // Supprime l'ombre sur iOS
          },
          headerShown: true, // Cacher le header pour le TabNavigator
        })}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          presentation: 'modal',
          headerShown: false,
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
            backgroundColor: 'rgba(0, 0, 0, 0.7)', 
          },
          headerTitleStyle: { // Text
            color: colors.lightest,
            fontSize: 18, 
          },
          headerTintColor: colors.lightest, // Icon
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;