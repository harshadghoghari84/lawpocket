import * as React from 'react';
import { Text, View } from 'react-native';
import { makeStyles } from 'react-native-elements';
import CustomButton from 'src/components/CustomButton';
// relative path
import CustomHeader from 'src/components/CustomHeader';
import SetProfileIntroIcon from 'src/components/svg/SetProfileIntroIcon';
import { WIDTH } from 'src/constants';
import constants from 'src/constants/constants';
import { Route } from 'src/constants/navigationConstants';
import { useMeQuery } from 'src/hooks/useMeQuery';
import { AuthNavigationProps } from 'src/types/navigation.types';

const SetProfileIntro: React.FC<
  AuthNavigationProps<Route.navSetProfileIntro>
> = ({ navigation }) => {
  const styles = useStyles();
  const { data: currentUser } = useMeQuery();
  const onContinuePress = () => {
    navigation.navigate(Route.navRegister1);
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        profileIcon={true}
        title={constants.setProfile}
        dummy={true}
      />
      <View style={styles.innerContainer}>
        <SetProfileIntroIcon
          height={WIDTH / 1.2}
          width={WIDTH / 1.2}
          style={styles.img}
        />
        <Text style={styles.txtIntro}>Hi, {currentUser?.firstName}!</Text>
        <Text style={styles.txtDescription}>
          Please set your location and areas of law. it will take less than one
          minute and will helps us to find equivalent attorney quicklier!
        </Text>
        <View style={styles.btnCont}>
          <CustomButton name={'Continue'} onPress={() => onContinuePress()} />
        </View>
      </View>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors?.background,
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    marginHorizontal: theme.spacing.xl,
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
  },

  btnCont: {
    marginTop: theme.spacing.l - 4,
  },
}));

export default SetProfileIntro;
