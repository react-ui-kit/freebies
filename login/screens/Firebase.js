import React, { Component } from 'react';
import {
  Alert,
  Text,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import * as firebase from 'firebase';

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

const firebaseConfig = {
  apiKey: 'AIzaSyCnOk2rHrhTYQuCNCeuWl8E2mteX2HaXTk',
};

export default class Sofia extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    loading: false,
    user: null,
    email: 'contact@react-ui-kit.com',
    password: 'subscribe',
  };

  componentDidMount() {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
      this.checkAuth();
    }
  }

  checkAuth = () => {
    // Listen for authentication state to change.
    firebase.auth().onAuthStateChanged(user => {
      if (user != null) {
        this.setState({ user });
      }
      this.setState({ loading: false });
    });
  };

  handleLogin = () => {
    const { email, password } = this.state;

    // Sign in with credential from the Facebook user.
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(error => {
        // reset loading state
        this.setState({ loading: false });
        alert(error.message);
      });
  };

  handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.setState({ user: null });
      })
      .catch(error => {
        alert(error.message);
        this.setState({ user: null });
      });
  };

  handleAuth = () => {
    this.setState({ loading: true });
    this.handleLogin();
  };

  renderInputs() {
    const { email, password, loading } = this.state;
    const isValid = email && password;

    return (
      <>
        <TextInput
          value={email}
          style={styles.input}
          placeholder="email"
          placeholderTextColor={COLORS.WHITE}
          onChangeText={value => this.setState({ email: value })}
        />
        <TextInput
          secureTextEntry
          value={password}
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={COLORS.WHITE}
          onChangeText={value => this.setState({ password: value })}
        />
        <TouchableOpacity
          disabled={!isValid}
          style={[styles.button, styles.signin]}
          onPress={() => this.handleAuth('password')}>
          {loading ? (
            <ActivityIndicator size={SIZES.FONT * 1.4} color={COLORS.BLUE} />
          ) : (
            <Text style={styles.signinLabel}>Login</Text>
          )}
        </TouchableOpacity>
      </>
    );
  }

  renderUser() {
    const { user } = this.state;

    if (!user) return null;

    return (
      <View>
        <Text style={styles.text}>Hey, {user.email}</Text>
        <TouchableOpacity
          style={[styles.button, styles.signin]}
          onPress={() => this.handleLogout()}>
          <Text style={styles.signinLabel}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { user } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Firebase</Text>
        {user && this.renderUser()}
        {!user && this.renderInputs()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: SIZES.PADDING * 2,
    backgroundColor: COLORS.BLUE,
  },
  button: {
    alignItems: 'center',
    borderRadius: SIZES.BASE,
    justifyContent: 'center',
    padding: SIZES.PADDING / 0.83,
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
    color: COLORS.BLUE,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  title: {
    color: COLORS.WHITE,
    fontSize: SIZES.TITLE,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: SIZES.BASE,
    textAlign: 'center',
  },
  text: {
    color: COLORS.WHITE,
    fontSize: SIZES.FONT,
    textAlign: 'center',
  },
});
