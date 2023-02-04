import HoneyBadger from '@honeybadger-io/react-native';
import React, { useEffect } from 'react';
import { Platform, StatusBar } from 'react-native';
import Config from 'react-native-config';
import { ThemeProvider } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider, useSelector } from 'react-redux';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { isDark } from 'src/redux/settings/settings.selectors';
import { getTheme } from 'src/theme/index';
import { store } from 'src/redux/store';
import MainNavigator from 'src/navigation';
import { isDarkMode } from 'src/redux/settings/settings.slice';
import { getDarkMode, setDarkMode } from 'src/utils/asyncStorage';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
// Create a client
const queryClient = new QueryClient();

async function onMessageReceived(
  message: FirebaseMessagingTypes.RemoteMessage,
) {
  console.log('Message:', message);
  if (Platform.OS === 'ios') {
    // await messaging().registerDeviceForRemoteMessages();
    await messaging().setAutoInitEnabled(true);
    await notifee.requestPermission();
    // const channelId = await notifee.createChannel({
    //   id: 'Card Suggestion',
    //   name: 'Card Suggestion',
    //   importance: AndroidImportance.HIGH,
    //   vibration: true,
    // });

    await notifee.displayNotification({
      title: message.notification?.title,
      body: message.notification?.body,
      // android: {
      //   channelId,
      //   // Reference the name created (Optional, defaults to 'ic_launcher')
      //   smallIcon: 'ic_small',
      //   largeIcon: ImageConfig.APP_LOGO,
      //   style: { type: AndroidStyle.BIGTEXT, text: body },
      //   // Set color of icon (Optional, defaults to white)
      //   color: theme.colors.primary,
      // },
    });
  }
}
notifee.onBackgroundEvent(async localMessage => {
  console.log(
    'notifee setBackgroundMessageHandler localMessage',
    JSON.stringify(localMessage.detail.notification.android),
  );
});

// @todo - handle in-app notifications
messaging().onMessage(onMessageReceived);
messaging().setBackgroundMessageHandler(onMessageReceived);

HoneyBadger.configure(Config.HONEYBADGER_API_KEY);

const AppWrapper = () => {
  const isEnabled = useSelector(isDark);
  const dispatch = useAppDispatch();

  useEffect(() => {
    checkTheme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkTheme = async () => {
    let theme = await getDarkMode();

    if (theme !== undefined && theme !== null) {
      setDarkMode(theme);
      theme === 0 ? dispatch(isDarkMode(true)) : dispatch(isDarkMode(false));
    } else {
      setDarkMode(0);
      dispatch(isDarkMode(true));
    }
  };

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={getTheme(isEnabled ? 'dark' : 'light')}>
        <StatusBar
          barStyle={isEnabled ? 'light-content' : 'dark-content'}
          backgroundColor={
            getTheme(isEnabled ? 'dark' : 'light').colors.background
          }
        />
        <MainNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppWrapper />
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
