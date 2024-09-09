import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TabNavigator from './TabNavigator';
import ProfileScreen from '../screen/ProfileScreen';

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
              style={{ marginRight: 5 }}
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
    </Stack.Navigator>
  );
};

export default MainNavigator;