import React, { Component } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './components/Home';
import Chat from './components/Chat';

const Stack = createStackNavigator();

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Screen1">
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Chat" component={Chat} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
