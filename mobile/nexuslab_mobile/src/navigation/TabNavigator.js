import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screen/HomeScreen';
import CreateScreen from '../screen/CreateScreen';
import GalleryScreen from '../screen/GalleryScreen';
import CommunityScreen from '../screen/CommunityScreen';
import { Ionicons } from '@expo/vector-icons'; 

const Tab = createBottomTabNavigator();

const TabNavigator = ({ setIsLoggedIn }) => {
  return (
    <Tab.Navigator>
        <Tab.Screen 
            name="Home"
            options={{
                tabBarLabel: 'Accueil',
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="home" color={color} size={size} />
                )
            }}
        >
            {(props) => <HomeScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
        </Tab.Screen>
        <Tab.Screen 
            name="Create"
            options={{
                tabBarLabel: 'Create',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="add-circle" color={color} size={size} />
                )
            }}
        >
            {(props) => <CreateScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
        </Tab.Screen>
        <Tab.Screen 
            name="Gallery"
            options={{
                tabBarLabel: 'Gallery',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="images" color={color} size={size} />
                )
            }}
        >
            {(props) => <GalleryScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
        </Tab.Screen>
        <Tab.Screen 
            name="Community"
            options={{
                tabBarLabel: 'Community',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="people" color={color} size={size} />
                )
            }}
        >
            {(props) => <CommunityScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
        </Tab.Screen>

    </Tab.Navigator>
  );
};

export default TabNavigator;