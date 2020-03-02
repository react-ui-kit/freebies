import React, { useState, useCallback } from 'react';
import {
  Alert,
  Text,
  TextInput,
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

const COLORS = {
  WHITE: '#FFF',
  BLACK: '#000',
  PRIMARY: '#9C7DE4',
  BLUE: '#4856B7',
  GREY: '#AFAFAF',
  GOOGLE: '#DC4E41',
  FACEBOOK: '#3A5896',
};

const SIZES = {
  BASE: 6,
  FONT: 12,
  TITLE: 24,
  SUBTITLE: 11,
  LABEL: 12,
  PADDING: 12,
};

const FACEBOOK_APP_ID = '';
const GOOGLE_IOS_ID = '';
const GOOGLE_ANDROID_ID = '';
const API_URL = 'http://5e08ac18434a370014168b98.mockapi.io/api/v1';

export default () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('contact@react-ui-kit.com');
  const [password, setPassword] = useState('subscribe');

  const handleFacebook = useCallback(async () => {
    try {
      await Facebook.initializeAsync(FACEBOOK_APP_ID);
      const { type, token } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile'],
      });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
      } else {
        // type === 'cancel'
        alert('Facebook Login canceled');
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  });

  const handleGoogle = useCallback(async () => {
    try {
      const { type, accessToken, user } = await Google.logInAsync({
        iosClientId: GOOGLE_IOS_ID,
        androidClientId: GOOGLE_ANDROID_ID,
        scopes: ['profile', 'email'],
      });

      if (type === 'success') {
        /* `accessToken` is now valid and can be used to get data from the Google API with HTTP requests */
        console.log({ user, accessToken });
      } else {
        alert(`Google Login canceled`);
      }
    } catch ({ message }) {
      alert(`Google Login Error: ${message}`);
    }
  });

  const handleApple = useCallback(async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      // signed in
      console.log(credential);
    } catch (e) {
      if (e.code === 'ERR_CANCELED') {
        // handle that the user canceled the sign-in flow
        alert('Apple Login canceled');
      } else {
        alert('Apple Login error');
      }
    }
  });

  const handleLogin = useCallback(async () => {
    fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then(response => response.json())
      .then(result => {
        alert(`Login token: ${result?.token}`);
      })
      .catch(error => {
        console.error('Login Error:', error);
      });
  }, [email, password]);

  const handleAuth = useCallback(async type => {
    setLoading(true);
    // implement login logic using type
    switch (type) {
      case 'google':
        await handleGoogle();
        break;
      case 'facebook':
        await handleFacebook();
        break;
      case 'apple':
        await handleApple();
        break;
      case 'password':
      default:
        await handleLogin();
        break;
    }
    setLoading(false);
  });

  const renderInputs = () => {
    return (
      <View>
        <View style={styles.inputContainer}>
          <Ionicons
            name="ios-mail"
            size={SIZES.FONT * 1.5}
            color={COLORS.PRIMARY}
            style={styles.inputIcon}
          />
          <View style={styles.input}>
            <TextInput
              value={email}
              placeholder="you@email.com"
              placeholderTextColor={COLORS.BLACK}
              onChangeText={value => setEmail(value)}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Ionicons
            name="md-lock"
            color={COLORS.PRIMARY}
            size={SIZES.FONT * 1.8}
            style={[styles.inputIcon, styles.passwordIcon]}
          />
          <View style={styles.input}>
            <TextInput
              secureTextEntry
              value={password}
              placeholderTextColor={COLORS.BLACK}
              onChangeText={value => setPassword(value)}
            />
          </View>
        </View>
        <Text style={styles.divider}>or</Text>
        {renderActions()}
      </View>
    );
  };

  const renderSocials = () => {
    return (
      <View style={styles.social}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.button, styles.socialButton, styles.facebook]}
          onPress={() => handleAuth('facebook')}>
          <FontAwesome size={18} name="facebook" color={COLORS.WHITE} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.button, styles.socialButton, styles.google]}
          onPress={() => handleAuth('google')}>
          <FontAwesome name="google" size={18} color={COLORS.WHITE} />
        </TouchableOpacity>

        <AppleAuthentication.AppleAuthenticationButton
          cornerRadius={SIZES.BASE * 4}
          onPress={() => handleAuth('apple')}
          style={[styles.button, styles.socialButton]}
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        />
      </View>
    );
  };

  const renderActions = () => {
    const isValid = email && password;
    return (
      <>
        {renderSocials()}
        <TouchableOpacity
          disabled={!isValid}
          style={[styles.button, styles.signin]}
          onPress={() => handleAuth('password')}>
          {loading ? (
            <ActivityIndicator size={SIZES.FONT * 1.4} color={COLORS.WHITE} />
          ) : (
            <Text
              style={{
                fontWeight: '500',
                letterSpacing: 0.5,
                color: COLORS.WHITE,
                backgroundColor: 'transparent',
              }}>
              Login
            </Text>
          )}
        </TouchableOpacity>
      </>
    );
  };

  return (
    <ImageBackground
      source={require('../assets/background.jpeg')}
      style={{ width: '100%', height: '100%' }}>
      <View style={styles.container}>
        <Text style={[styles.title, { textAlign: 'center' }]}>Login</Text>
        {renderInputs()}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: SIZES.BASE * 4,
    height: SIZES.BASE * 8,
    justifyContent: 'center',
    padding: SIZES.PADDING,
  },
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    paddingHorizontal: '12%',
    paddingVertical: SIZES.PADDING * 2,
  },
  divider: {
    color: COLORS.BLACK,
    fontSize: SIZES.TITLE,
    marginVertical: SIZES.BASE * 2,
    textAlign: 'center',
  },
  facebook: {
    backgroundColor: COLORS.FACEBOOK,
  },
  google: {
    backgroundColor: COLORS.GOOGLE,
  },
  input: {
    padding: SIZES.PADDING * 1.5,
    paddingLeft: SIZES.BASE * 7.5,
    fontSize: SIZES.FONT,
    backgroundColor: COLORS.WHITE, // "rgba(255, 255, 255, 0.5)",
    borderRadius: SIZES.BASE * 2,
  },
  inputContainer: {
    marginBottom: SIZES.PADDING * 2,
  },
  inputIcon: {
    left: SIZES.BASE * 2.8,
    position: 'absolute',
    top: SIZES.BASE * 2.8,
    zIndex: 1,
  },
  passwordIcon: {
    top: SIZES.BASE * 2.2,
  },
  signin: {
    backgroundColor: COLORS.PRIMARY,
    marginVertical: SIZES.BASE * 3,
  },
  social: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: SIZES.BASE * 3,
  },
  socialButton: {
    height: SIZES.BASE * 8,
    marginHorizontal: SIZES.BASE * 2,
    width: SIZES.BASE * 8,
  },
  title: {
    color: COLORS.BLACK,
    fontSize: SIZES.TITLE,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: SIZES.BASE,
  },
});
