import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screen/HomeScreen';
import CreateScreen from '../screen/CreateScreen';
import GalleryScreen from '../screen/GalleryScreen';
import CommunityScreen from '../screen/CommunityScreen';
import { Ionicons } from '@expo/vector-icons'; 

const Tab = createBottomTabNavigator();

const TabNavigator = ( ) => {
  return (
    <Tab.Navigator>
        <Tab.Screen 
            name="Home"
            component={HomeScreen}
            options={{
                headerShown: false,
                tabBarLabel: 'Accueil',
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="home" color={color} size={size} />
                )
            }}
        />

        <Tab.Screen 
            name="Create"
            component={CreateScreen}
            options={{
                headerShown: false,
                tabBarLabel: 'Create',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="add-circle" color={color} size={size} />
                )
            }}
        />

        <Tab.Screen 
            name="Gallery"
            component={GalleryScreen}
            options={{
                headerShown: false,
                tabBarLabel: 'Gallery',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="images" color={color} size={size} />
                )
            }}
        />
        <Tab.Screen 
            name="Community"
            component={CommunityScreen}
            options={{
                headerShown: false,
                tabBarLabel: 'Community',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="people" color={color} size={size} />
                )
            }}
        />

    </Tab.Navigator>
  );
};

export default TabNavigator;