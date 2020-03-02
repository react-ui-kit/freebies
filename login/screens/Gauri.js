import React, { useState, useCallback } from 'react';
import {
  Alert,
  Text,
  TextInput,
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';

const COLORS = {
  WHITE: '#FFF',
  BLACK: '#000',
  BLUE: '#69B1D6',
  ORANGE: '#FE8E4E',
  RED: '#FD696E',
  GREY: '#AFAFAF',
  DARK_GREY: '#90919E',
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
  const [password, setPassword] = useState(null);

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
  });

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
      case 'password':
      default:
        await handleLogin();
        break;
    }

    // reset loading state
    setLoading(false);
  });

  const renderInputs = () => {
    const isValid = email && password;

    return (
      <>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email address</Text>
          <TextInput
            value={email}
            style={styles.input}
            placeholder="you@email.com"
            placeholderTextColor={COLORS.DARK_GREY}
            onChangeText={value => setEmail(value)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            secureTextEntry
            value={password}
            style={styles.input}
            placeholderTextColor={COLORS.DARK_GREY}
            onChangeText={value => setPassword(value)}
          />
        </View>
        <TouchableOpacity>
          <Text style={{ fontSize: SIZES.FONT }}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!isValid}
          style={{ marginTop: SIZES.PADDING * 1.5 }}
          onPress={() => handleAuth('password')}>
          <LinearGradient
            style={[styles.button, styles.signin]}
            colors={isValid ? [COLORS.ORANGE, COLORS.RED] : [COLORS.GREY, COLORS.DARK_GREY]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}>
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
                Sign in
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </>
    );
  };

  const renderSocials = () => {
    return (
      <View style={styles.social}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.button, styles.google]}
          onPress={() => handleAuth('google')}>
          <View style={{ flexDirection: 'row' }}>
            <FontAwesome name="google" size={18} color={COLORS.WHITE} />
            <Text style={styles.socialLabel}>Google</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.button, styles.facebook]}
          onPress={() => handleAuth('facebook')}>
          <View style={{ flexDirection: 'row' }}>
            <FontAwesome size={18} name="facebook-square" color={COLORS.WHITE} />
            <Text style={styles.socialLabel}>Facebook</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={{ marginBottom: 18 }}>
          <Text style={styles.title}>Sign in</Text>
          <Text style={styles.subtitle}>Please sign in to get full access</Text>
        </View>
        <View style={{ flex: 2 }}>
          {renderInputs()}
          <View style={{ alignItems: 'center' }}>
            <View style={styles.divider}>
              <Text style={styles.dividerLabel}>or</Text>
            </View>
          </View>
          {renderSocials()}
        </View>
        <View style={{ flex: 0.25, alignItems: 'center' }}>
          <Text
            style={{
              fontSize: SIZES.FONT,
              color: COLORS.GREY,
              marginBottom: SIZES.BASE,
            }}>
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => alert('Go to Signup screen')}>
            <Text
              style={{
                fontSize: SIZES.FONT,
                fontWeight: '600',
                color: COLORS.BLUE,
              }}>
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SIZES.PADDING,
    paddingVertical: SIZES.PADDING * 2,
  },
  button: {
    alignItems: 'center',
    borderRadius: SIZES.BASE,
    justifyContent: 'center',
    padding: SIZES.PADDING / 0.83,
  },
  divider: {
    alignItems: 'center',
    backgroundColor: COLORS.GREY,
    height: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    marginVertical: SIZES.PADDING * 2,
    width: '50%',
  },
  dividerLabel: {
    backgroundColor: COLORS.WHITE,
    color: COLORS.GREY,
    fontSize: SIZES.SUBTITLE,
    paddingHorizontal: SIZES.BASE,
    position: 'absolute',
  },
  facebook: {
    backgroundColor: COLORS.FACEBOOK,
    flex: 1,
    paddingVertical: SIZES.PADDING * 1.33,
  },
  google: {
    backgroundColor: COLORS.GOOGLE,
    flex: 1,
    marginRight: SIZES.PADDING,
    paddingVertical: SIZES.PADDING * 1.33,
  },
  input: {
    borderColor: COLORS.GREY,
    borderRadius: SIZES.BASE,
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: SIZES.FONT,
    padding: SIZES.PADDING * 1.5,
  },
  inputContainer: {
    marginBottom: SIZES.PADDING,
  },
  label: {
    color: COLORS.DARK_GREY,
    fontSize: SIZES.FONT,
    marginBottom: SIZES.BASE,
  },
  signin: {
    paddingVertical: SIZES.PADDING * 1.33,
  },
  social: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialLabel: {
    color: COLORS.WHITE,
    flex: 1,
    fontWeight: '500',
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.GREY,
    fontSize: SIZES.SUBTITLE,
  },
  title: {
    fontSize: SIZES.TITLE,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: SIZES.BASE,
  },
});
