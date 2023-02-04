// relative path
import { useNavigation } from '@react-navigation/native';
import { useFormik } from 'formik';
import * as React from 'react';
import { View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import CustomButton from 'src/components/CustomButton';
import CustomHeader from 'src/components/CustomHeader';
import { CustomTxtInput } from 'src/components/CustomTextInput';
import LockIcon from 'src/components/svg/LockIcon';
import { WIDTH } from 'src/constants';
import { Route } from 'src/constants/navigationConstants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { selectAuthenticationLoading } from 'src/redux/authentication/authentication.selectors';
import { userChangePassword } from 'src/redux/authentication/authentication.thunks';
import { ChangePasswordFormProps } from 'src/types/authentication.types';
import { LoadingState, ThemeProps } from 'src/types/global.types';
import { MainNavigationProps } from 'src/types/navigation.types';
import { formatErrors } from 'src/utils/formatErrors';
import * as Yup from 'yup';

export const LoginScreenSchema = Yup.object().shape({
  oldPassword: Yup.string().required('old password is required'),
  newPassword: Yup.string().required('new password is required'),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref('newPassword'), null],
    'Passwords must match',
  ),
});

const ChangePassword: React.FC<
  MainNavigationProps<Route.navChangePassword>
> = () => {
  const loading = useSelector(selectAuthenticationLoading);

  const navigation = useNavigation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const styles = useStyles({ insets });
  const dispatch = useAppDispatch();

  const {
    handleChange,
    handleBlur,
    touched,
    values,
    errors,
    handleSubmit,
    setErrors,
  } = useFormik<ChangePasswordFormProps>({
    validationSchema: LoginScreenSchema,
    initialValues: { oldPassword: '', newPassword: '', confirmPassword: '' },
    onSubmit: async ({ oldPassword, newPassword }) => {
      const result = await dispatch(
        userChangePassword({ oldPassword, newPassword }),
      );

      if (userChangePassword.fulfilled.match(result)) {
        // dispatch(setSuccess(result.payload.message));
        navigation.goBack();
      } else {
        setErrors(formatErrors(result.payload.errors));
      }
    },
  });

  return (
    <View style={styles.container}>
      <CustomHeader title="Change Password" backBtn={true} dummy={true} />
      <View style={styles.inputCont}>
        <CustomTxtInput
          placeholder="Old Password"
          icon={<LockIcon color={theme.colors.primary} />}
          returnKeyType="next"
          onChangeText={handleChange('oldPassword')}
          onBlur={handleBlur('oldPassword')}
          value={values.oldPassword}
          error={errors.oldPassword}
          secureTextEntry
          touched={touched.oldPassword}
          returnKeyLabel="next"
        />
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
        <CustomButton
          height={40}
          smallBtn={WIDTH / 2 - 30}
          borderBtn={true}
          name={'Cancel'}
          onPress={() => navigation.goBack()}
        />
        <CustomButton
          height={40}
          smallBtn={WIDTH / 2 - 30}
          disabled={loading === LoadingState.CREATE}
          loading={loading === LoadingState.CREATE}
          name={'Update'}
          onPress={() => handleSubmit()}
        />
      </View>
    </View>
  );
};

export default ChangePassword;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    backgroundColor: theme.colors?.background,
    flex: 1,
    paddingBottom: props.insets.bottom,
  },
  inputCont: {
    flex: 1,
    marginHorizontal: theme.spacing.l - 4,
    marginTop: theme.spacing.m - 6,
  },
  btnCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: theme.spacing.l - 4,
    marginBottom: theme.spacing.m - 6,
  },
}));
