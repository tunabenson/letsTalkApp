// hooks/useLogin.js
import { useState } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../api/firebaseConfig';

const useLogin = (setAlertConfig, navigation) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hiddenPassword, setHiddenPassword] = useState(true);
  const [pressedLogin, setPressedLogin] = useState(false);

  const showAlert = (title, message) => {
    setAlertConfig({
      showAlert: true,
      title,
      message,
    });
  };

  const handleLogin = async () => {
    setPressedLogin(true); // Show the spinner

    try {
      if (!username.trim() || !password.trim()) {
        showAlert('Error', 'You left one or more fields blank');
        setPressedLogin(false);
        return;
      }
      if (!username.includes('@')) {
        showAlert('Error', 'Please Enter a valid Email Address');
        setPressedLogin(false);
        return;
      }

      await signInWithEmailAndPassword(auth, username, password)
        .then(userCredentials => {
          userCredentials.user.reload();
          if (!userCredentials.user.emailVerified) {
            signOut(auth); // Sign out if email not verified
            showAlert("Action Required", "Please Verify Email before logging on");
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: 'HomePage' }],
            });
            setUsername('');
            setPassword('');
          }
        });
    } catch (e) {
      let msg = e.message;
      if (msg.includes('auth/invalid-email')) { showAlert('Error', 'Account Does Not Exist'); }
      if (msg.includes('auth/invalid-credential')) { showAlert('Error', 'Invalid Email or Password'); }
    } finally {
      setPressedLogin(false); // Hide the spinner regardless of outcome
    }
  };

  return { username, setUsername, password, setPassword, hiddenPassword, setHiddenPassword, pressedLogin, handleLogin };
};

export default useLogin;
