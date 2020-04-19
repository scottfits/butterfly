import React, {useState} from 'react';
import {Button, TextInput, Text, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import styles from './Style';

export default function PhoneSignIn() {
  // If null, no SMS has been sent
  const [confirm, setConfirm] = useState(null);

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');

  // Handle the button press
  async function signInWithPhoneNumber(phoneNumber) {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    setConfirm(confirmation);
  }

  async function confirmCode() {
    try {
      await confirm.confirm(code);
    } catch (error) {
      console.log('Invalid code.');
    }
  }

  function formatPhone(phone) {
    const areaCode = phone.slice(0, 3);
    const firstPart = phone.slice(3, 6);
    const secondPart = phone.slice(6, 10);
    return `+1 ${areaCode} ${firstPart} ${secondPart}`;
  }

  if (!confirm) {
    return (
      <>
        <View style={{height: 40}} />
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TextInput
            keyboardType="number-pad"
            placeholder="415 456 4321"
            autoFocus={true}
            style={styles.bigField}
            value={phone}
            onChangeText={text => setPhone(text)}
          />
        </View>
        <View style={{height: 40}} />

        <Button
          disabled={phone.length != 10}
          color="#c669c6"
          title="Sign In"
          onPress={() => signInWithPhoneNumber(formatPhone(phone))}
        />
      </>
    );
  }

  return (
    <>
      <View style={{height: 40}} />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TextInput
          keyboardType="number-pad"
          placeholder={'Verification code'}
          value={code}
          style={styles.bigField}
          onChangeText={text => setCode(text)}
        />
      </View>
      <View style={{height: 40}} />
      <Button
        disabled={code.length != 6}
        title="Confirm Code"
        color="#c669c6"
        onPress={() => confirmCode()}
      />
    </>
  );
}
