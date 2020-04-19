import React, {useState} from 'react';
import {
  Button,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  Picker,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {Keyboard} from 'react-native';
import styles from './Style';

export default function ProfileForm() {
  // If null, no SMS has been sent
  const [age, setAge] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Female');
  const [photoURL, setPhotoURL] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  return (
    <View>
      <View style={{height: 70}} />
      <View style={{alignItems: 'center'}}>
        <TextInput
          placeholder={'Name'}
          autoCapitalize={'words'}
          value={name}
          style={styles.bigField}
          onChangeText={text => setName(text)}
        />
        <View style={{height: 20}} />
        <TextInput
          keyboardType="number-pad"
          placeholder={'Age'}
          value={age}
          style={styles.bigField}
          onChangeText={text => setAge(text)}
        />
        <View style={{height: 20}} />
        <TextInput
          placeholder={'Gender'}
          value={gender}
          style={styles.bigField}
          onChangeText={text => {
            setGender(text);
            setShowPicker(false);
          }}
          onFocus={() => {
            Keyboard.dismiss();
            setShowPicker(true);
          }}
        />

        {showPicker && (
          <>
            <Picker
              selectedValue={gender}
              style={{height: 20, width: 150}}
              onValueChange={(itemValue, itemIndex) => {
                setGender(itemValue);
                setShowPicker(false);
              }}>
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
            </Picker>
            <View style={{height: 200}} />
          </>
        )}

        <View style={{height: 20}} />
        <TouchableOpacity style={styles.bigButton}>
          {gender == 'Male' ? (
            <Text style={{fontSize: 20}}>💁🏽‍♂️</Text>
          ) : (
            <Text style={{fontSize: 20}}>💁🏽‍♀️</Text>
          )}
          <Text style={{fontSize: 20}}>photo</Text>
        </TouchableOpacity>
        <View style={{height: 20}} />
      </View>

      <Button title="Submit" color="#c669c6" />
    </View>
  );
}
