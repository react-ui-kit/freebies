import { FontAwesome } from '@expo/vector-icons';
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useCallback } from 'react';
import {
  Alert,
  Text,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

const COLORS = {
  WHITE: '#FAFAFA',
  BLACK: '#000',
  BLUE: '#15A1F1',
  PURPLE: '#534FFF',
  PURPLE2: '#6320DE',
  ORANGE: '#FE8E4E',
  RED: '#FD696E',
  GREY: '#AFAFAF',
  DARK_GREY: '#90919E',
  GOOGLE: '#DC4E41',
  FACEBOOK: '#3A5896',
  GRADIENT: ['#00BDD3', '#15A1F1', '#534FFF', '#6320DE'],
};

const SIZES = {
  BASE: 6,
  FONT: 12,
  TITLE: 32,
  SUBTITLE: 11,
  LABEL: 12,
  PADDING: 12,
  GRADIENT: [0, 0.34, 0.74, 1],
};

const FACEBOOK_APP_ID = '';
const GOOGLE_IOS_ID = '';
const GOOGLE_ANDROID_ID = '';
const API_URL = 'http://5e08ac18434a370014168b98.mockapi.io/api/v1';

export default () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('react-ui-kit');
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
        scopes: ['profile', 'username'],
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
      body: JSON.stringify({ username, password }),
    })
      .then(response => response.json())
      .then(result => {
        alert(`Login token: ${result?.token}`);
      })
      .catch(error => {
        console.error('Login Error:', error);
      });
  }, [username, password]);

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
    const isValid = username && password;

    return (
      <>
        <TextInput
          value={username}
          style={styles.input}
          placeholder="Username"
          placeholderTextColor={COLORS.WHITE}
          onChangeText={value => setUsername(value)}
        />
        <TextInput
          secureTextEntry
          value={password}
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={COLORS.WHITE}
          onChangeText={value => setPassword(value)}
        />
        <TouchableOpacity
          disabled={!isValid}
          style={[styles.button, styles.signin]}
          onPress={() => handleAuth('password')}>
          {loading ? (
            <ActivityIndicator size={SIZES.FONT * 1.4} color={COLORS.PURPLE2} />
          ) : (
            <Text style={styles.signinLabel}>Get in</Text>
          )}
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
            <FontAwesome size={18} name="google" color="rgba(255,255,255,0.5)" />
            <Text style={styles.socialLabel}>Login with Google</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.button, styles.facebook]}
          onPress={() => handleAuth('facebook')}>
          <View style={{ flexDirection: 'row' }}>
            <FontAwesome size={18} name="facebook-square" color="rgba(255,255,255,0.5)" />
            <Text style={styles.socialLabel}>Login with Facebook</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <LinearGradient
      style={{ flex: 1 }}
      end={{ x: 0, y: 1 }}
      start={{ x: 1, y: 0 }}
      colors={COLORS.GRADIENT}>
      <View style={styles.container}>
        <View style={{ flex: 0.25, justifyContent: 'center' }}>
          <Text style={styles.title}>Login</Text>
        </View>
        <View style={{ flex: 1 }}>
          {renderInputs()}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={styles.divider} />
            <Text style={styles.dividerLabel}>OR</Text>
            <View style={styles.divider} />
          </View>
          {renderSocials()}
          <View style={styles.footer}>
            <Text style={styles.forgotLabel}>FORGOT PASSWORD?</Text>
            <TouchableOpacity onPress={() => alert("Go to 'Forgot Password' screen")}>
              <Text style={[styles.forgotLabel, { textDecorationLine: 'underline' }]}>RECOVER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: SIZES.BASE,
    justifyContent: 'center',
    padding: SIZES.PADDING / 0.83,
  },
  container: {
    flex: 1,
    padding: SIZES.PADDING * 2,
  },
  divider: {
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    height: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    marginVertical: SIZES.PADDING * 3,
    width: '25%',
  },
  dividerLabel: {
    color: COLORS.WHITE,
    fontSize: SIZES.SUBTITLE,
    marginHorizontal: SIZES.BASE,
  },
  facebook: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: SIZES.BASE * 5,
    borderWidth: 1,
    paddingVertical: SIZES.PADDING * 1.33,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: SIZES.PADDING * 2,
  },
  forgotLabel: {
    color: COLORS.WHITE,
    fontSize: SIZES.FONT,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginRight: SIZES.BASE,
  },
  google: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: SIZES.BASE * 5,
    borderWidth: 1,
    marginBottom: SIZES.PADDING * 2,
    paddingVertical: SIZES.PADDING * 1.33,
  },
  input: {
    borderBottomColor: COLORS.WHITE,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderWidth: 0,
    color: COLORS.WHITE,
    fontSize: SIZES.FONT,
    marginBottom: SIZES.PADDING,
    paddingHorizontal: SIZES.PADDING,
    paddingVertical: SIZES.PADDING * 1.5,
  },
  signin: {
    backgroundColor: COLORS.WHITE,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: SIZES.BASE * 5,
    borderWidth: 4,
    marginTop: SIZES.PADDING,
    paddingVertical: SIZES.PADDING,
    shadowColor: 'rgba(0,0,0,0.10)',
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
  },
  signinLabel: {
    backgroundColor: 'transparent',
    color: COLORS.PURPLE2,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  social: {
    flex: 0,
    justifyContent: 'space-between',
  },
  socialLabel: {
    color: 'rgba(255,255,255,0.75)',
    flex: 1,
    fontWeight: '500',
    textAlign: 'center',
  },
  title: {
    color: COLORS.WHITE,
    fontSize: SIZES.TITLE,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: SIZES.BASE,
    textAlign: 'center',
  },
});
