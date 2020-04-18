import React from 'react';
import {Text, View} from 'react-native';
import Login from '../components/Login';

export default (LoginScreen = () => {
  return (
    <View>
      <Text>Welcome</Text>
      <Text>Butterfly</Text>
      <Login />
    </View>
  );
});
