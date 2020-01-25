import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';

const COLORS = {
  WHITE: '#FAFAFA',
  BLACK: '#000000',
  BLUE: '#1A73E8',
  GREY: '#AFAFAF',
};

const SIZES = {
  BASE: 6,
  FONT: 12,
  TITLE: 32,
  SUBTITLE: 11,
  LABEL: 12,
  PADDING: 12,
};

export default class Sofia extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    loading: false,
    user: null,
  };

  handleLogin = async () => {
    try {
      const user = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      // signed in
      console.log('user', user);
      this.setState({ user });
    } catch (e) {
      if (e.code === 'ERR_CANCELED') {
        // handle that the user canceled the sign-in flow
      } else {
        // handle other errors
      }
    }
  };

  handleLogout = async () => {
    try {
      await AppleAuthentication.signOutAsync({ user: this.state.user });
      this.setState({ user: null });
    } catch (e) {
      console.log('handleLogout error:', e);
      if (e.code === 'ERR_CANCELED') {
        // handle that the user canceled the sign-in flow
      } else {
        // handle other errors
      }
    }
  };

  renderLogin() {
    return (
      <AppleAuthentication.AppleAuthenticationButton
        style={{ height: 44 }}
        onPress={() => this.handleLogin()}
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      />
    );
  }

  renderUser() {
    const { user } = this.state;

    if (!user) return null;

    return (
      <View>
        <Text style={styles.text}>Hey, {user.email}</Text>
        <AppleAuthentication.AppleAuthenticationButton
          style={{ height: 44 }}
          onPress={() => this.handleLogout()}
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        />
      </View>
    );
  }

  render() {
    const { user } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Apple</Text>
        <Text style={[styles.text, { marginBottom: SIZES.FONT }]}>Sign in using your Apple ID</Text>
        {user && this.renderUser()}
        {!user && this.renderLogin()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: SIZES.PADDING * 2,
    backgroundColor: COLORS.WHITE,
  },
  button: {
    backgroundColor: COLORS.BLACK,
  },
  title: {
    color: COLORS.BLACK,
    fontSize: SIZES.TITLE,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: SIZES.BASE,
    textAlign: 'center',
  },
  text: {
    color: COLORS.BLACK,
    fontSize: SIZES.FONT,
    textAlign: 'center',
  },
});
