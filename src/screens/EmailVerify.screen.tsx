// relative path
import { CommonActions, useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { useEffect } from 'react';
import { ActivityIndicator, SafeAreaView, Text, View } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import { makeStyles, useTheme } from 'react-native-elements';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CustomButton from 'src/components/CustomButton';
import CustomHeader from 'src/components/CustomHeader';
import { API } from 'src/constants/apiEndpoints';
import { Route } from 'src/constants/navigationConstants';
import { secureStoreKeys } from 'src/constants/secureStoreKeys';
import { useMeQuery } from 'src/hooks/useMeQuery';
import { fetch } from 'src/redux/fetch';
import { AuthTokenPayload } from 'src/types/authentication.types';
import { MainNavigationProps } from 'src/types/navigation.types';
import { setSecureValue } from 'src/utils/secureStorage';
import { useGetFcmToken } from 'src/hooks/useGetFcmToken';

const EmailVerify: React.FC<MainNavigationProps<Route.navEmailVerify>> = ({
  route: { params },
}) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const styles = useStyles();
  const { refetch } = useMeQuery();

  const [loader, setLoader] = React.useState<boolean>(false);
  const [verified, setVerified] = React.useState<boolean>(false);

  useEffect(() => {
    const Verify = async () => {
      setLoader(true);
      await BootSplash.hide({ fade: true });

      let fcmtoken: string = '';
      await useGetFcmToken().then(token => {
        fcmtoken = token;
      });
      try {
        console.log('fcmtoken', fcmtoken);

        const { statusCode, data, errors } = await fetch<AuthTokenPayload>(
          {
            url: API.VERIFY_TOKEN,
            method: 'POST',
            data: {
              token: params.token,
              email: params.email,
            },
            headers: {
              fcmtoken,
            },
          },
          false,
        );

        console.log('data, errors', data, errors);
        if (errors) {
          setLoader(false);
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: Route.navAuthentication,
                  params: {},
                },
              ],
            }),
          );
        }

        if (statusCode === 200) {
          await setSecureValue(secureStoreKeys.JWT_TOKEN, data.JWT);
          setLoader(false);
          setVerified(true);
        } else if (statusCode === 401) {
          setLoader(false);
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: Route.navAuthentication,
                  params: {},
                },
              ],
            }),
          );
        }
      } catch (error) {
        setLoader(false);
      }
    };

    navigation.addListener('focus', () => {
      Verify().then();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, navigation]);

  const onPressUpdate = () => {
    if (verified) {
      refetch().then(res => {
        if (res?.data?.steps === null) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: Route.navAuthentication,
                  state: {
                    routes: [{ name: Route.navSetProfileIntro }],
                  },
                },
              ],
            }),
          );
        } else {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: Route.navDashboard }],
            }),
          );
        }
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Email Verification" onlyHeaderTitle={true} />
      <View style={styles.inputCont}>
        <View style={styles.markCont}>
          {loader ? (
            <ActivityIndicator color={theme.colors.primary} />
          ) : (
            <FontAwesome5 name="check" size={60} color={theme.colors.primary} />
          )}
        </View>
        <Text style={styles.txtSuccess}>Email Verified!</Text>
      </View>
      <View style={styles.btnCont}>
        <CustomButton
          height={40}
          disabled={!verified}
          // loading={loader}
          name={'Next'}
          onPress={() => onPressUpdate()}
        />
      </View>
    </SafeAreaView>
  );
};

export default EmailVerify;

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors?.background,
    flex: 1,
  },
  inputCont: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCont: {
    justifyContent: 'space-between',
    marginHorizontal: theme.spacing.l - 4,
    marginBottom: theme.spacing.m - 6,
  },
  markCont: {
    height: 100,
    width: 100,
    borderRadius: theme.borderRadii.l + 50,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.spacing.l - 4,
  },
  txtSuccess: {
    fontSize: theme.fontSize.l,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
}));
