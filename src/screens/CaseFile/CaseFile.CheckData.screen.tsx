import LottieView from 'lottie-react-native';
import * as React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomButton from 'src/components/CustomButton';
// relative path
import CustomHeader from 'src/components/CustomHeader';
import constants from 'src/constants/constants';
import { Route } from 'src/constants/navigationConstants';
import { ThemeProps } from 'src/types/global.types';
import { MainNavigationProps } from 'src/types/navigation.types';

const CaseFileCheckData: React.FC<
  MainNavigationProps<Route.navCaseFileCheckData>
> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles({ insets });

  const { theme } = useTheme();

  const [loading, setLoading] = React.useState<boolean>(true);
  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  const onContinuePress = () => {
    navigation.navigate(Route.navInformationAboutIssue);
  };

  return (
    <View style={styles.container}>
      <CustomHeader onlyHeaderTitle={true} title={constants.caseFile} />
      <View style={styles.innerContainer}>
        <LottieView
          style={styles.lottieView}
          source={require('src/helper/casefile.json')}
          autoPlay
          loop
        />
        <View style={styles.loaderCont}>
          {loading ? <ActivityIndicator color={theme.colors.primary} /> : null}
          <Text style={styles.txtPleaseWait}>
            {loading ? 'Please Wait!' : 'Case file Generated'}
          </Text>
        </View>

        <Text style={styles.txtDescription}>
          Please click continue to find lawyer.
        </Text>
      </View>
      <View style={styles.btnCont}>
        <CustomButton
          name={'Continue'}
          disabled={loading}
          loading={loading}
          onPress={() => onContinuePress()}
        />
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
    marginHorizontal: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: { alignSelf: 'center' },
  txtIntro: {
    fontSize: theme.fontSize.l,
    marginVertical: theme.spacing.l - 4,
    color: theme.colors.textPrimary,
  },
  txtDescription: {
    fontSize: theme.fontSize.m,
    lineHeight: 25,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },

  btnCont: {
    marginVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.m + 4,
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
  lottieView: {
    height: 200,
    width: 200,
  },
}));

export default CaseFileCheckData;
