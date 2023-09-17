import React, { useEffect, useState } from 'react';
import { Animated, Image, View, StyleSheet, Platform, PermissionsAndroid } from 'react-native';
import { Provider } from 'react-redux';
import Navigation from "./StackNavigator";
import { store } from "./src/redux/store";
import { settings } from './src/utils/settings';
import { GetFCMTokenAndStore } from './src/utils/pushnotification';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

export default function App() {
  const [animation] = useState(new Animated.Value(0.3));
  const [appIsReady, setAppIsReady] = useState(false);

  async function requestNotificationPermission() {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: "Bildirim İzinleri",
            message: "Uygulamamızın bildirim göndermesi için izin vermelisiniz.",
            buttonNeutral: "Daha Sonra Sor",
            buttonNegative: "İptal",
            buttonPositive: "Tamam"
          }
        );
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Bildirim izni verildi.");
        } else {
          console.log("Bildirim izni reddedildi.");
        }
      } catch (err) {
        console.warn(err);
      }
    }
  }

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
    GetFCMTokenAndStore();
    requestNotificationPermission();  
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
