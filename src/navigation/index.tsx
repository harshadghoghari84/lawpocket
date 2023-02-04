import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import i18n from 'i18next';
import * as React from 'react';
import { useEffect } from 'react';
import { initReactI18next } from 'react-i18next';
import { Linking } from 'react-native';
import Config from 'react-native-config';
import { useTheme } from 'react-native-elements';
import { Host } from 'react-native-portalize';
import Snackbar from 'react-native-snackbar';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { Languages } from 'src/lang';
import MainStack from 'src/navigation/Main.stack';
import {
  selectGlobalErrors,
  selectGlobalSuccess,
} from 'src/redux/global/global.selectors';
import { clearErrors, clearSuccess } from 'src/redux/global/global.slice';
import messaging from '@react-native-firebase/messaging';

const linking: LinkingOptions<{}> = {
  prefixes: [`https://${Config.REDIRECT_URL}/`, `${Config.SCHEMA}://`],
  async getInitialURL() {
    // First, you may want to do the default deep link handling
    // Check if app was opened from a deep link
    const url = await Linking.getInitialURL();

    if (url != null) {
      return url;
    }

    // Check if there is an initial firebase notification
    const message = await messaging().getInitialNotification();
    console.log('message :', message?.data?.link);
    // Get deep link from data
    // if this is undefined, the app will open the default/home page
    return message?.data?.link;
  },
  subscribe(listener) {
    // First, you may want to do the default deep link handling
    const onReceiveURL = ({ url }: { url: string }) => listener(url);

    // Listen to incoming links from deep linking
    Linking.addEventListener('url', onReceiveURL);

    // Listen to firebase push notifications
    const unsubscribeNotification = messaging().onNotificationOpenedApp(
      message => {
        const url = message?.data?.link;

        if (url) {
          // Any custom logic to check whether the URL needs to be handled

          // Call the listener to let React Navigation handle the URL
          listener(url);
        }
      },
    );

    return () => {
      // Clean up the event listeners
      Linking.removeEventListener('url', onReceiveURL);
      unsubscribeNotification();
    };
  },
  config: {
    screens: {
      EmailVerify: 'verify-email/:token/:email',
      NewPassword: 'password-setup/:token',
      ChatRoom: 'chat-box/:id/:sender_id/:chat_id/:fireConsole',
      // MyProfile: 'chat-box/:id/:chat_id/:fireConsole',
      OtherUserProfile: 'viewing-profile/:id',
    },
  },
};

const MainNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const { errors, errorMessage } = useSelector(selectGlobalErrors);
  const { success, successMessage } = useSelector(selectGlobalSuccess);
  const { theme } = useTheme();

  useEffect(() => {
    Linking.getInitialURL()
      .then(url => {
        if (url) {
          console.log('url---', url);
        }
      })
      .catch(err => console.error('An error occurred', err));
  }, []);

  useEffect(() => {
    if (
      errors &&
      errors.errors?.findIndex(
        err => err.domain === 'global' || err.domain === 'nonFieldErrors',
      ) !== -1
    ) {
      Snackbar.show({
        text: errorMessage,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: theme.colors.error,
        textColor: theme.colors.white,
        // fontFamily: theme.fontFamily.medium,
      });

      dispatch(clearErrors());
    }
  }, [
    dispatch,
    errorMessage,
    errors,
    theme.colors.error,
    theme.colors.white,
    // theme.fontFamily.medium,
  ]);

  useEffect(() => {
    if (success && successMessage) {
      Snackbar.show({
        text: successMessage,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: theme.colors.grey5,
        textColor: theme.colors.black,
        // // fontFamily: theme.fontFamily.medium,
      });

      dispatch(clearSuccess());
    }
  }, [
    dispatch,
    success,
    successMessage,
    theme.colors.black,
    theme.colors.grey5,
    // theme.fontFamily.medium,
  ]);

  useEffect(() => {
    i18n.use(initReactI18next).init({
      compatibilityJSON: 'v3',
      resources: Languages.resources,
      lng: Languages.defaultLng,
      fallbackLng: Languages.defaultLng,
    });
  }, []);

  useEffect(() => {
    const requestUserPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      } else {
        //  no permission for push notification
        await messaging().requestPermission();
      }
    };

    requestUserPermission().then();
  }, []);

  return (
    <NavigationContainer linking={linking}>
      <Host>
        <MainStack />
      </Host>
    </NavigationContainer>
  );
};

export default MainNavigator;
