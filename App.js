import React, { useEffect, useState } from 'react';
import { Animated, Image, View, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import Navigation from "./StackNavigator";
import { store } from "./src/redux/store";
import { settings } from './src/utils/settings';

export default function App() {
  const [animation] = useState(new Animated.Value(0.3));
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        setAppIsReady(true);
      }, 1000);
    });
  }, []);

  if (!appIsReady) {
    return (
      <View style={styles.container}>
        <Animated.Image
          style={{
            height: settings.CARD_WIDTH,
            width: settings.CARD_WIDTH * 2,
            resizeMode: "contain",
            transform: [{ scale: animation }],
          }}
          source={require('./assets/logo.png')}
        />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});