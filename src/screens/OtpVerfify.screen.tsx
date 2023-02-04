import { useNavigation } from '@react-navigation/native';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomButton from 'src/components/CustomButton';
import MailIcon from 'src/components/svg/MailIcon';
import OtpField from 'src/components/ui/OTPField';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { setSuccess } from 'src/redux/global/global.slice';
import { studentVerifyOTPForEmail } from 'src/redux/setProfile/setProfile.thunk';
import { ThemeProps } from 'src/types/global.types';
import { formatErrors } from 'src/utils/formatErrors';
import * as Yup from 'yup';

const { width } = Dimensions.get('window');

interface OTPForm {
  otp: string;
}

const OTPSchema = Yup.object().shape({
  otp: Yup.string().required('OTP is required').length(6, ''),
});

const VerifyOtpScreen: React.FC = ({}) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles({ insets });
  const { theme } = useTheme();
  const navigation = useNavigation();
  //   const loading = useSelector(selectAuthenticationLoading);
  const dispatch = useAppDispatch();

  const [loader, setLoader] = useState(false);

  const OTP = useFormik<OTPForm>({
    validationSchema: OTPSchema,
    initialValues: { otp: '' },
    onSubmit: async ({ otp }) => {
      setLoader(true);
      const result = await dispatch(studentVerifyOTPForEmail({ otp: otp }));
      console.log('otp result', result);
      if (studentVerifyOTPForEmail.fulfilled.match(result)) {
        dispatch(setSuccess('Email verified Successfully!'));
        setTimeout(() => {
          setLoader(false);
          navigation.goBack();
        }, 1000);
      } else {
        OTP.setErrors(formatErrors(result.payload.errors));
      }
    },
  });

  return (
    <ScrollView
      scrollEnabled={false}
      bounces={false}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps={'handled'}
    >
      <View style={styles.header}>
        <MailIcon color={theme.colors.primary} />
        <Text style={styles.heading}>Verify Your OTP</Text>
        <Text style={styles.subtitle}>
          Please enter the number code send to your email address
        </Text>
      </View>
      <View style={styles.verifyCont}>
        <Text style={styles.txtEnterSixDigitCode}>Enter six digit code</Text>
        <OtpField
          value={OTP.values.otp}
          touched={OTP.touched.otp}
          error={OTP.errors.otp}
          handleChange={code => OTP.setFieldValue('otp', code)}
        />
      </View>
      <CustomButton
        name={'Submit'}
        disabled={OTP.values.otp.length < 6}
        loading={loader}
        onPress={() => OTP.handleSubmit()}
      />
    </ScrollView>
  );
};

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
    paddingTop: props.insets.top + theme.spacing.s,
    paddingBottom: props.insets.bottom + theme.spacing.s,
    paddingHorizontal: theme.spacing.l,
  },
  header: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  icon: {
    marginBottom: theme.spacing.xxl,
  },
  heading: {
    fontSize: 24,
    marginBottom: theme.spacing.s,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.grey,
    textAlign: 'center',
    width: width * 0.6,
    lineHeight: 16,
  },
  formContainer: {
    flex: 0.5,
    marginTop: theme.spacing.l,
  },
  button: {
    width: width * 0.6,
    alignSelf: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.m,
  },
  verifyCont: {
    marginTop: theme.spacing.l,
    flex: 1,
  },
  txtEnterSixDigitCode: {
    fontSize: theme.fontSize.m - 3,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
}));

export default VerifyOtpScreen;
