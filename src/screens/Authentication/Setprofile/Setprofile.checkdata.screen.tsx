import * as React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Snackbar from 'react-native-snackbar';
import CustomButton from 'src/components/CustomButton';
// relative path
import CustomHeader from 'src/components/CustomHeader';
import SetProfileLoadingIcon from 'src/components/svg/SetProfileLoading';
import { WIDTH } from 'src/constants';
import constants, { SetupProfileStatus } from 'src/constants/constants';
import { Route } from 'src/constants/navigationConstants';
import { useMeQuery } from 'src/hooks/useMeQuery';
import { ThemeProps } from 'src/types/global.types';
import { AuthNavigationProps } from 'src/types/navigation.types';

const SetProfileCheckData: React.FC<
  AuthNavigationProps<Route.navSetProfileCheckData>
> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles({ insets });
  const { theme } = useTheme();
  const { refetch } = useMeQuery();

  const [loader, setLoader] = React.useState<boolean>(false);

  const onGetStarted = async () => {
    setLoader(true);
    refetch().then(({ data }) => {
      setLoader(false);
      if (data?.isVerify === SetupProfileStatus.VERIFY) {
        navigation.navigate(Route.navSubscriptions);
      } else {
        setLoader(false);

        Snackbar.show({
          text: 'Your profile is not verified yet!',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: theme.colors.error,
          textColor: theme.colors.white,
        });
      }
    });
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        profileIcon={true}
        title={constants.setProfile}
        dummy={true}
      />
      <View style={styles.innerContainer}>
        <SetProfileLoadingIcon height={WIDTH - 100} width={WIDTH - 50} />
        <View style={styles.loaderCont}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={styles.txtPleaseWait}>Please Wait!</Text>
        </View>
        <Text style={styles.txtIntro}>We are checking your data</Text>
        <Text style={styles.txtDescription}>
          Please set your Location and Areas of Law. it will take less than one
          minute and will helps us to find equivalent Attorney quicklier. it
          will take less than one minute and will helps us to find equivalent
          Attorney quicklier!
        </Text>
        <View style={styles.btnCont}>
          <CustomButton
            name={'Get Started'}
            disabled={loader}
            loading={loader}
            onPress={() => onGetStarted()}
          />
        </View>
      </View>
    </View>
  );
};

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    backgroundColor: theme.colors?.background,
    flex: 1,
    paddingBottom: props.insets.bottom,
  },
  innerContainer: {
    flex: 1,

    backgroundColor: theme.colors.background,
    // alignItems: 'center',
    marginHorizontal: theme.spacing.m + 4,
  },
  img: {
    height: WIDTH - 100,
    width: WIDTH - 20,
  },
  txtIntro: {
    fontSize: theme.fontSize.m + 3,
    marginVertical: theme.spacing.l - 4,
    fontWeight: '500',
    color: theme.colors.textPrimary,
  },
  txtDescription: {
    fontSize: theme.fontSize.m,
    lineHeight: 25,
    color: theme.colors.textSecondary,
    textAlign: 'justify',
  },
  btnCont: {
    marginTop: theme.spacing.l - 4,
  },
  loaderCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderStyle: {
    height: 50,
    width: 50,
  },
  txtPleaseWait: {
    fontWeight: '500',
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.m + 3,
    marginLeft: theme.spacing.m - 6,
  },
}));

export default SetProfileCheckData;
