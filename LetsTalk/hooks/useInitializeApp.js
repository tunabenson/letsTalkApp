// hooks/useInitializeApp.js
import { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../api/firebaseConfig';
import * as SplashScreen from 'expo-splash-screen';

const useInitializeApp = () => {
  const [user, setUser] = useState(null);
  const [signedIn, setSignedIn] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);
  const [authChecked, setAuthIsChecked] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        onAuthStateChanged(auth, (user) => {
          if (user && auth.currentUser.emailVerified) {
            setUser(user);
            setSignedIn(true);
          } else {
            setUser(null);
            setSignedIn(false);
          }
          setAuthIsChecked(true);
        });
      } catch (error) {
        console.error('Error loading resources:', error);
      } finally {
        setIsAppReady(true);
      }
    };

    prepareApp();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isAppReady && authChecked) {
      await SplashScreen.hideAsync();
    }
  }, [isAppReady, authChecked]);

  return { user, signedIn, isAppReady, authChecked, onLayoutRootView };
};

export default useInitializeApp;
