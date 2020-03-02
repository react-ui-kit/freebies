import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useCallback } from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';

const COLORS = {
  WHITE: '#FFF',
  BLACK: '#000',
  BLUE: '#5C7EE0',
  PURPLE: '#6636D8',
};

const SIZES = {
  BASE: 6,
  FONT: 12,
  TITLE: 20,
  PADDING: 12,
};

const API_URL = 'http://5e08ac18434a370014168b98.mockapi.io/api/v1';
const timeout = ms => new Promise(response => setTimeout(response, ms));

export default () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('contact@react-ui-kit.com');
  const [password, setPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = useCallback(async () => {
    setLoading(true);

    await timeout(2000);
    fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then(response => response.json())
      .then(result => {
        // do something with the result token
        alert(`Login token: ${result?.token}`);
      })
      .catch(error => alert(`Login error: ${error}`));

    setLoading(false);
  });

  const renderInputs = () => {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.inputContainer}>
          <TextInput
            value={email}
            placeholder="Email"
            style={styles.input}
            selectionColor={COLORS.WHITE}
            placeholderTextColor={COLORS.WHITE}
            onChangeText={value => setEmail(value)}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            value={password}
            style={styles.input}
            placeholder="Password"
            selectionColor={COLORS.WHITE}
            placeholderTextColor={COLORS.WHITE}
            secureTextEntry={!showPassword}
            onChangeText={value => setPassword(value)}
          />
          <TouchableOpacity
            style={{
              right: 0,
              top: SIZES.BASE,
              position: 'absolute',
            }}
            onPress={() => setShowPassword(!showPassword)}>
            <Feather
              color={COLORS.WHITE}
              size={SIZES.FONT * 1.3}
              name={!showPassword ? 'eye' : 'eye-off'}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => alert("Go to 'Forgot Password' screen")}>
          <Text
            style={{
              textAlign: 'right',
              fontWeight: '300',
              color: COLORS.WHITE,
              fontSize: SIZES.BASE * 1.6,
              paddingBottom: SIZES.PADDING * 2,
            }}>
            Forgot your password?
          </Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} style={styles.signin} onPress={() => handleLogin()}>
          {loading ? (
            <ActivityIndicator size={SIZES.FONT * 1.2} color={COLORS.PURPLE} />
          ) : (
            <Text style={styles.signinLabel}>Sign in</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <LinearGradient
      style={{ flex: 1 }}
      end={{ x: 1, y: 0.7 }}
      start={{ x: 0, y: 0 }}
      colors={[COLORS.BLUE, COLORS.PURPLE]}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={styles.container}>
          <View style={{ flex: 0.5, justifyContent: 'center' }}>
            <Text style={styles.title}>Sign in</Text>
          </View>
          {renderInputs()}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.BASE * 4,
  },
  input: {
    borderBottomColor: COLORS.WHITE,
    borderColor: 'transparent',
    borderWidth: StyleSheet.hairlineWidth,
    color: COLORS.WHITE,
    fontSize: SIZES.FONT,
    paddingVertical: SIZES.PADDING * 0.5,
  },
  inputContainer: {
    marginBottom: SIZES.PADDING * 2,
  },
  signin: {
    backgroundColor: COLORS.WHITE,
    borderRadius: SIZES.BASE * 5,
    paddingVertical: SIZES.PADDING,
    textAlign: 'center',
  },
  signinLabel: {
    color: COLORS.PURPLE,
    fontSize: SIZES.FONT,
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  title: {
    color: COLORS.WHITE,
    fontSize: SIZES.TITLE,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: SIZES.BASE,
  },
});
