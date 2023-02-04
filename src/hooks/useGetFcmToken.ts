import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

// @ts-ignore
export const useGetFcmToken = async () => {
  if (Platform.OS === 'ios') {
    const enabled = await notifee.requestPermission();
    // await messaging().registerDeviceForRemoteMessages();
    await messaging().setAutoInitEnabled(true);
    if (enabled) {
      // messaging()
      //   .getToken()
      //   .then(token => {
      //     console.log('TOKK: ', token);
      //     return token;
      //   })
      //   .catch(e => {
      //     HoneyBadger.notify(e, null);
      //     return null;
      //   });

      const token = await messaging().getToken();
      if (token) {
        return token;
      } else {
        return null;
      }
    } else {
      await notifee.requestPermission();
    }
  }
  return null;
};
