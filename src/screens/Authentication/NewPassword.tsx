// relative path
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useFormik } from 'formik';
import * as React from 'react';
import { View } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import { makeStyles, useTheme } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomButton from 'src/components/CustomButton';
import CustomHeader from 'src/components/CustomHeader';
import { CustomTxtInput } from 'src/components/CustomTextInput';
import LockIcon from 'src/components/svg/LockIcon';
import { API } from 'src/constants/apiEndpoints';
import { Route } from 'src/constants/navigationConstants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { fetch } from 'src/redux/fetch';
import { setSuccess } from 'src/redux/global/global.slice';
import {
  AuthTokenPayload,
  NewPasswordFormProps,
} from 'src/types/authentication.types';
import { ThemeProps } from 'src/types/global.types';
import { MainNavigationProps } from 'src/types/navigation.types';
import * as Yup from 'yup';

export const LoginScreenSchema = Yup.object().shape({
  newPassword: Yup.string().min(6).required(),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref('newPassword'), null],
    'Passwords must match',
  ),
});

const NewPassword: React.FC<MainNavigationProps<Route.navNewPassword>> = ({
  route: { params },
}) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useStyles({ insets });
  const dispatch = useAppDispatch();

  const [loader, setLoader] = React.useState<boolean>(false);

  React.useEffect(() => {
    const Init = async () => {
      await BootSplash.hide({ fade: true });
    };

    Init().then();
  }, []);

  const { handleChange, handleBlur, touched, values, errors, handleSubmit } =
    useFormik<NewPasswordFormProps>({
      validationSchema: LoginScreenSchema,
      initialValues: { newPassword: '', confirmPassword: '' },
      onSubmit: async ({ newPassword }) => {
        setLoader(true);
        try {
          const { statusCode } = await fetch<AuthTokenPayload>(
            {
              url: `${API.RESET_PASSWORD}?token=${params.token}`,
              method: 'POST',
              data: { newPassword },
            },
            false,
          );

          if (statusCode === 200) {
            // await setSecureValue(secureStoreKeys.JWT_TOKEN, data.JWT);
            dispatch(setSuccess('Password Reset Successfully!'));
            setTimeout(() => {
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
            }, 1000);
          } else {
            setLoader(false);
          }
        } catch (error) {
          setLoader(false);
        }
      },
    });

  return (
    <View style={styles.container}>
      <CustomHeader title="New Password" onlyHeaderTitle={true} />
      <View style={styles.inputCont}>
        <CustomTxtInput
          placeholder="New Password"
          icon={<LockIcon color={theme.colors.primary} />}
          returnKeyType="next"
          onChangeText={handleChange('newPassword')}
          onBlur={handleBlur('newPassword')}
          value={values.newPassword}
          error={errors.newPassword}
          touched={touched.newPassword}
          secureTextEntry
          returnKeyLabel="next"
        />
        <CustomTxtInput
          placeholder="Confirm Password"
          icon={<LockIcon color={theme.colors.primary} />}
          onChangeText={handleChange('confirmPassword')}
          onBlur={handleBlur('confirmPassword')}
          value={values.confirmPassword}
          error={errors.confirmPassword}
          touched={touched.confirmPassword}
          secureTextEntry
          returnKeyType="done"
          returnKeyLabel="done"
        />
      </View>
      <View style={styles.btnCont}>
        {/* <CustomButton
          height={40}
          smallBtn={WIDTH / 2 - 30}
          borderBtn={true}
          name={'Cancel'}
          onPress={() => navigation.goBack()}
        /> */}
        <CustomButton
          height={40}
          // smallBtn={WIDTH / 2 - 30}
          // borderBtn={false}
          disabled={loader}
          loading={loader}
          name={'Update'}
          onPress={() => handleSubmit()}
        />
      </View>
    </View>
  );
};

export default NewPassword;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    backgroundColor: theme.colors?.background,
    flex: 1,
    paddingBottom: props.insets.bottom,
  },
  inputCont: {
    flex: 1,
    marginHorizontal: theme.spacing.l - 4,
    marginTop: theme.spacing.l - 4,
  },
  btnCont: {
    // flexDirection: 'row',
    // alignItems: 'center',

    justifyContent: 'space-between',
    marginHorizontal: theme.spacing.l - 4,
    marginBottom: theme.spacing.l - 4,
  },
}));
