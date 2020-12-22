import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  HeaderBackButton,
} from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ElevatorDetailsScreen from '../screens/ElevatorDetailsScreen';
import { Text, View, StyleSheet } from 'react-native';

const Stack = createStackNavigator();

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          // options={logOutOption(true)}
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
          // options={logOutOption({ arrowBack: true })}
          name="ElevatorDetails"
          component={ElevatorDetailsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MyStack;
