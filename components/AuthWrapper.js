import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import LoginScreen from '../screens/LoginScreen.js';
import CreateProfileScreen from '../screens/CreateProfileScreen.js';
import Video from './Video';

export default function AuthWrapper() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    // auth().signOut();
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  // if (USER HAS NO INFO ENTRY) {
  //   return <CreateProfileScreen />;
  // }

  if (!user) {
    return <LoginScreen />;
  }

  return <Video />;
}
