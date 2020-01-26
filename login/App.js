import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Text, View } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

// screens
import Sofia from './screens/Sofia';
import Velvet from './screens/Velvet';
import Gauri from './screens/Gauri';
import Frida from './screens/Frida';
import Firebase from './screens/Firebase';
import Apple from './screens/Apple';

const App = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View>
        <Text style={[styles.title, { textAlign: 'center' }]}>Login UI screens</Text>
        <Text style={{ fontSize: 14, fontWeight: '600', textAlign: 'center' }}>How to use</Text>
        <Text style={styles.subtitle}>- go to screens/ folder</Text>
        <Text style={styles.subtitle}>
          - copy/paste the code from Sofia.js, Velvet.js, Gauri.js, Frida.js
        </Text>
        <Text style={styles.subtitle}>
          - install required packages for each screen (see{' '}
          <Text style={{ textDecorationLine: 'underline' }}>import</Text> section)
        </Text>
      </View>
      <View>
        <ScrollView>
          <TouchableOpacity
            style={[styles.button, styles.velvet]}
            onPress={() => navigation.navigate('Velvet')}>
            <View>
              <Text style={{ textAlign: 'center', color: '#FFF' }}>Velvet</Text>
              <Text style={{ textAlign: 'center', color: '#FFF', fontSize: 11 }}>
                using ImageBackground
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.sofia]}
            onPress={() => navigation.navigate('Sofia')}>
            <View>
              <Text style={{ textAlign: 'center', color: '#FFF' }}>Sofia</Text>
              <Text style={{ textAlign: 'center', color: '#FFF', fontSize: 11 }}>
                using LinearGradient background
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.gauri]}
            onPress={() => navigation.navigate('Gauri')}>
            <View>
              <Text style={{ textAlign: 'center', color: '#FFF' }}>Gauri</Text>
              <Text style={{ textAlign: 'center', color: '#FFF', fontSize: 11 }}>
                using Google & Facebook login
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.frida]}
            onPress={() => navigation.navigate('Frida')}>
            <View>
              <Text style={{ textAlign: 'center', color: '#FFF' }}>Frida</Text>
              <Text style={{ textAlign: 'center', color: '#FFF', fontSize: 11 }}>
                using LinearGradient background
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.firebase]}
            onPress={() => navigation.navigate('Firebase')}>
            <View>
              <Text style={{ textAlign: 'center', color: '#FFF' }}>Firebase</Text>
              <Text style={{ textAlign: 'center', color: '#FFF', fontSize: 11 }}>
                login using email & password
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.apple]}
            onPress={() => navigation.navigate('Apple')}>
            <View>
              <Text style={{ textAlign: 'center', color: '#FFF' }}>Apple</Text>
              <Text style={{ textAlign: 'center', color: '#FFF', fontSize: 11 }}>
                login using your Apple ID
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

const AppNavigator = createStackNavigator(
  {
    App: {
      screen: App,
      navigationOptions: () => ({
        header: null,
        headerBackTitle: null,
      }),
    },
    Sofia,
    Velvet,
    Gauri,
    Frida,
    Firebase,
    Apple,
  },
  {
    initialRouteName: 'App',
    defaultNavigationOptions: {
      headerTintColor: '#FFF',
    },
  }
);

export default createAppContainer(AppNavigator);

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 4,
    justifyContent: 'center',
    margin: 8,
    marginBottom: 4,
    padding: 8,
  },
  container: {
    backgroundColor: '#FFF',
    flex: 1,
    justifyContent: 'space-evenly',
    marginHorizontal: 24,
  },
  frida: {
    backgroundColor: '#6636D8',
  },
  gauri: {
    backgroundColor: '#F36060',
  },
  sofia: {
    backgroundColor: '#34CFE1',
  },
  subtitle: {
    fontSize: 11,
  },
  title: {
    fontSize: 18,
    marginVertical: 10,
  },
  velvet: {
    backgroundColor: '#F5B1F5',
  },
  firebase: {
    backgroundColor: '#1A73E8',
  },
  apple: {
    backgroundColor: '#000000',
  },
});
