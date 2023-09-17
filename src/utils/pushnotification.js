import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

// 1. Kullanıcının FCM tokenini Firestore'a kaydetme
async function saveTokenToFirestore(token) {
    // Belge ID'si olarak benzersiz bir ID oluştur
    const userId = uuidv4();

    return firestore()
        .collection('users')
        .doc(userId)
        .set({
            token: token,
            createdAt: firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
            console.log('Token stored in Firestore!');
        })
        .catch(error => {
            console.error('Error storing token in Firestore:', error);
        });
}

async function GetFCMTokenAndStore() {
    let fcmtoken = await AsyncStorage.getItem("fcmtoken");
    console.log(fcmtoken, "old token");
    if (!fcmtoken) {
        try {
            fcmtoken = await messaging().getToken();
            if (fcmtoken) {
                console.log(fcmtoken, "new token");
                await AsyncStorage.setItem("fcmtoken", fcmtoken);
                await saveTokenToFirestore(fcmtoken);
            }
        } catch (error) {
            console.log(error, "error in fcmtoken");
        }
    } else {
        // Token zaten AsyncStorage'de varsa Firestore'da da kontrol edelim
        const usersRef = firestore().collection('users');
        const snapshot = await usersRef.where('token', '==', fcmtoken).get();

        // Eğer token Firestore'da yoksa, onu ekleyelim
        if (snapshot.empty) {
            await saveTokenToFirestore(fcmtoken);
        }
    }
}

export { GetFCMTokenAndStore };
