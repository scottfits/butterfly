import React from 'react';
import {Text, View, Image} from 'react-native';
import Login from '../components/Login';

export default (LoginScreen = () => {
  return (
    <View>
      <View style={{height: 150}} />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          style={{width: 150, height: 150}}
          reiszeMode="contain"
          source={require('../butterfly-icon.png')}
        />
      </View>
      <View style={{height: 70}} />
      <Login />
    </View>
  );
});
