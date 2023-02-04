// relative path

import { useFormik } from 'formik';
import * as React from 'react';
import { TextInput, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { Modalize } from 'react-native-modalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheetSave from 'src/components/BottomSheetSave';
import CustomButton from 'src/components/CustomButton';
import CustomHeader from 'src/components/CustomHeader';
import { CustomTxtInput } from 'src/components/CustomTextInput';
import LawFirmIcon from 'src/components/svg/LawFirmIcon';
import UserIcon from 'src/components/svg/UserIcon';
import ProfileUpdateForm from 'src/components/ui/ProfileUpdateForm';
import { UserType } from 'src/constants/constants';
import { Route } from 'src/constants/navigationConstants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useMeQuery } from 'src/hooks/useMeQuery';
import { studentSendEmailVerification } from 'src/redux/setProfile/setProfile.thunk';
import {
  updateAttorneyProfile,
  updateClientProfile,
  updateLFAndLSPProfile,
  updateStudentProfile,
} from 'src/redux/updateProfile/updateProfile.thunk';
import { emailUpdateSchema } from 'src/screens/Authentication/Setprofile/SetProfile.studentEmail.screen';
import {
  EditProfileAtrFormProps,
  EditProfileFormProps,
  EditProfileLfFormProps,
  EditProfileStudentFormProps,
} from 'src/types/authentication.types';
import { ThemeProps } from 'src/types/global.types';
import { MainNavigationProps } from 'src/types/navigation.types';
import { emailUpdateProps } from 'src/types/setProfile.types';
import { formatErrors } from 'src/utils/formatErrors';
import * as Yup from 'yup';

export const EditProfileClientScreenSchema = Yup.object().shape({
  firstName: Yup.string().required('Full name is required'),
  lastName: Yup.string().required('Last name is required'),
});
export const EditProfileStudentScreenSchema = Yup.object().shape({
  firstName: Yup.string().required('Full name is required'),
  lastName: Yup.string().required('Last name is required'),
});
export const EditProfileAtrScreenSchema = Yup.object().shape({
  firstName: Yup.string().required('Full name is required'),
  lastName: Yup.string().required('Last name is required'),
  associationNumber: Yup.string().required('associationNumber is required'),
});
export const EditProfileLfScreenSchema = Yup.object().shape({
  firstName: Yup.string().required('Full name is required'),
  lastName: Yup.string().required('Last name is required'),
});

const EditProfile: React.FC<MainNavigationProps<Route.navEditProfile>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  const styles = useStyles({ insets });
  const { theme } = useTheme();
  const { data: currentUser, refetch } = useMeQuery();
  const dispatch = useAppDispatch();

  const modalizeRef = React.useRef<Modalize>(null);
  const firstRef = React.useRef<TextInput>(null);
  const lastRef = React.useRef<TextInput>(null);
  // const emailRef = React.useRef<TextInput>(null);
  const associationNumRef = React.useRef<TextInput>(null);
  const phoneNumberRef = React.useRef<TextInput>(null);

  const [loader, setLoader] = React.useState(false);
  const [submitProfileLoader, setSubmitProfile] = React.useState(false);

  const AtrFormik = useFormik<EditProfileAtrFormProps>({
    validationSchema: EditProfileAtrScreenSchema,
    initialValues: {
      firstName: currentUser?.firstName ? currentUser.firstName : '',
      lastName: currentUser?.lastName ? currentUser.lastName : '',
      associationNumber: currentUser?.associationNumber || '',
    },
    onSubmit: async ({ firstName, lastName, associationNumber }) => {
      setSubmitProfile(true);
      const result = await dispatch(
        updateAttorneyProfile({
          firstName,
          lastName,
          associationNumber,
        }),
      );
      if (updateAttorneyProfile.fulfilled.match(result)) {
        refetch().then();

        setTimeout(() => {
          setSubmitProfile(false);
          modalizeRef.current?.open();
        }, 1000);
      } else {
        setSubmitProfile(false);
      }
    },
  });
  const LfFormik = useFormik<EditProfileLfFormProps>({
    validationSchema: EditProfileLfScreenSchema,
    initialValues: {
      firstName: currentUser?.firstName ? currentUser.firstName : '',
      lastName: currentUser?.lastName ? currentUser.lastName : '',
    },
    onSubmit: async ({ firstName, lastName }) => {
      setSubmitProfile(true);

      const result = await dispatch(
        updateLFAndLSPProfile({
          firstName,
          lastName,
        }),
      );
      if (updateLFAndLSPProfile.fulfilled.match(result)) {
        refetch().then();

        setTimeout(() => {
          setSubmitProfile(false);
          modalizeRef.current?.open();
        }, 1000);
      } else {
        setSubmitProfile(false);
      }
    },
  });

  const { handleChange, handleBlur, touched, values, errors, handleSubmit } =
    useFormik<EditProfileFormProps>({
      validationSchema: EditProfileClientScreenSchema,
      initialValues: {
        firstName: currentUser?.firstName ? currentUser.firstName : '',
        lastName: currentUser?.lastName ? currentUser.lastName : '',
      },
      onSubmit: async ({ firstName, lastName }) => {
        setSubmitProfile(true);

        const result = await dispatch(
          updateClientProfile({
            firstName,
            lastName,
          }),
        );

        if (updateClientProfile.fulfilled.match(result)) {
          refetch().then();
          setTimeout(() => {
            setSubmitProfile(false);
            modalizeRef.current?.open();
          }, 1000);
        } else {
          setSubmitProfile(false);
        }
      },
    });

  const StudFormik = useFormik<EditProfileStudentFormProps>({
    validationSchema: EditProfileStudentScreenSchema,
    initialValues: {
      firstName: currentUser?.firstName ? currentUser.firstName : '',
      lastName: currentUser?.lastName ? currentUser.lastName : '',
      // studentEmail: '',
    },
    onSubmit: async ({ firstName, lastName }) => {
      setSubmitProfile(true);
      const result = await dispatch(
        updateStudentProfile({
          firstName,
          lastName,
          studentEmail: StudEmailFormik.values.email,
        }),
      );
      if (updateStudentProfile.fulfilled.match(result)) {
        refetch().then();
        setTimeout(() => {
          setSubmitProfile(false);
          modalizeRef.current?.open();
        }, 1000);
      } else {
        setSubmitProfile(false);
      }
    },
  });

  const StudEmailFormik = useFormik<emailUpdateProps>({
    validationSchema: emailUpdateSchema,
    initialValues: {
      email: currentUser?.studentEmail ? currentUser.studentEmail : '',
    },
    onSubmit: async ({ email }) => {
      setLoader(true);
      const result = await dispatch(
        studentSendEmailVerification({
          studentEmail: email,
        }),
      );

      if (studentSendEmailVerification.fulfilled.match(result)) {
        setLoader(false);
        navigation.navigate(Route.navVerifyOtp);
      } else {
        setLoader(false);
        StudEmailFormik.setErrors(formatErrors(result.payload.errors));
      }
    },
  });

  const ClientsProfileUpdate = () => {
    return (
      <>
        <CustomTxtInput
          placeholder="First Name"
          icon={<UserIcon color={theme.colors.primary} />}
          ref={firstRef}
          returnKeyType="next"
          returnKeyLabel="next"
          onChangeText={handleChange('firstName')}
          onBlur={handleBlur('firstName')}
          value={values.firstName}
          error={errors.firstName}
          touched={touched.firstName}
          onSubmitEditing={() => lastRef.current?.focus()}
        />

        <CustomTxtInput
          placeholder="Last Name"
          icon={<UserIcon color={theme.colors.primary} />}
          returnKeyType="next"
          ref={lastRef}
          returnKeyLabel="next"
          onChangeText={handleChange('lastName')}
          onBlur={handleBlur('lastName')}
          value={values.lastName}
          error={errors.lastName}
          touched={touched.lastName}
          onSubmitEditing={() => phoneNumberRef.current?.focus()}
        />
      </>
    );
  };
  const StudentProfileUpdate = () => {
    return (
      <>
        <CustomTxtInput
          placeholder="First Name"
          icon={<UserIcon color={theme.colors.primary} />}
          ref={firstRef}
          returnKeyType="next"
          returnKeyLabel="next"
          onChangeText={StudFormik.handleChange('firstName')}
          onBlur={StudFormik.handleBlur('firstName')}
          value={StudFormik.values.firstName}
          error={StudFormik.errors.firstName}
          touched={StudFormik.touched.firstName}
          onSubmitEditing={() => lastRef.current?.focus()}
        />

        <CustomTxtInput
          placeholder="Last Name"
          icon={<UserIcon color={theme.colors.primary} />}
          returnKeyType="next"
          ref={lastRef}
          returnKeyLabel="next"
          onChangeText={StudFormik.handleChange('lastName')}
          onBlur={StudFormik.handleBlur('lastName')}
          value={StudFormik.values.lastName}
          error={StudFormik.errors.lastName}
          touched={StudFormik.touched.lastName}
          onSubmitEditing={() => phoneNumberRef.current?.focus()}
        />
        <View style={styles.innerContainer}>
          <TextInput
            placeholder="Enter Email"
            placeholderTextColor={theme.colors.grey}
            returnKeyType="done"
            returnKeyLabel="done"
            onChangeText={StudEmailFormik.handleChange('email')}
            onBlur={StudEmailFormik.handleBlur('email')}
            value={StudEmailFormik.values.email}
            style={styles.textIN}
          />
          <View style={styles.btnVerify}>
            <CustomButton
              smallBtn={80}
              name={'Verify'}
              disabled={StudEmailFormik.values.email === ''}
              loading={loader}
              onPress={() => StudEmailFormik.handleSubmit()}
            />
          </View>
        </View>
      </>
    );
  };

  const AttorneyProfileUpdate = () => {
    return (
      <>
        <CustomTxtInput
          placeholder="First Name"
          icon={<UserIcon color={theme.colors.primary} />}
          ref={firstRef}
          returnKeyType="next"
          returnKeyLabel="next"
          onChangeText={AtrFormik.handleChange('firstName')}
          onBlur={AtrFormik.handleBlur('firstName')}
          value={AtrFormik.values.firstName}
          error={AtrFormik.errors.firstName}
          touched={AtrFormik.touched.firstName}
          onSubmitEditing={() => lastRef.current?.focus()}
        />

        <CustomTxtInput
          placeholder="Last Name"
          icon={<UserIcon color={theme.colors.primary} />}
          returnKeyType="done"
          ref={lastRef}
          returnKeyLabel="done"
          onChangeText={AtrFormik.handleChange('lastName')}
          onBlur={AtrFormik.handleBlur('lastName')}
          value={AtrFormik.values.lastName}
          error={AtrFormik.errors.lastName}
          touched={AtrFormik.touched.lastName}
          onSubmitEditing={() => associationNumRef.current?.focus()}
        />

        <CustomTxtInput
          placeholder="association number"
          icon={
            <LawFirmIcon color={theme.colors.primary} height={18} width={18} />
          }
          returnKeyType="done"
          returnKeyLabel="done"
          ref={associationNumRef}
          onChangeText={AtrFormik.handleChange('associationNumber')}
          onBlur={AtrFormik.handleBlur('associationNumber')}
          value={AtrFormik.values.associationNumber}
          error={AtrFormik.errors.associationNumber}
          touched={AtrFormik.touched.associationNumber}
        />
      </>
    );
  };

  const LawFirmAndLegalProfileUpdate = () => {
    return (
      <>
        <CustomTxtInput
          placeholder="First Name"
          icon={<UserIcon color={theme.colors.primary} />}
          ref={firstRef}
          returnKeyType="next"
          returnKeyLabel="next"
          onChangeText={LfFormik.handleChange('firstName')}
          onBlur={LfFormik.handleBlur('firstName')}
          value={LfFormik.values.firstName}
          error={LfFormik.errors.firstName}
          touched={LfFormik.touched.firstName}
          onSubmitEditing={() => lastRef.current?.focus()}
        />

        <CustomTxtInput
          placeholder="Last Name"
          icon={<UserIcon color={theme.colors.primary} />}
          returnKeyType="next"
          ref={lastRef}
          returnKeyLabel="next"
          onChangeText={LfFormik.handleChange('lastName')}
          onBlur={LfFormik.handleBlur('lastName')}
          value={LfFormik.values.lastName}
          error={LfFormik.errors.lastName}
          touched={LfFormik.touched.lastName}
        />
      </>
    );
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Edit Profile" backBtn={true} dummy={true} />
      {currentUser?.userType === UserType.CLIENT ? (
        <ProfileUpdateForm
          children={ClientsProfileUpdate()}
          loading={submitProfileLoader}
          onPress={() => handleSubmit()}
        />
      ) : null}
      {currentUser?.userType === UserType.LAW_STUDENT ? (
        <ProfileUpdateForm
          children={StudentProfileUpdate()}
          // disabled={!activeOtp}
          loading={submitProfileLoader}
          onPress={() => StudFormik.handleSubmit()}
        />
      ) : null}
      {currentUser?.userType === UserType.ATTORNEY ? (
        <ProfileUpdateForm
          children={AttorneyProfileUpdate()}
          loading={submitProfileLoader}
          onPress={() => AtrFormik.handleSubmit()}
        />
      ) : null}
      {currentUser?.userType === UserType.LAW_FIRM ||
      currentUser?.userType === UserType.LEGAL_SERVICE_PROVIDER ? (
        <ProfileUpdateForm
          children={LawFirmAndLegalProfileUpdate()}
          loading={submitProfileLoader}
          onPress={() => LfFormik.handleSubmit()}
        />
      ) : null}

      <BottomSheetSave
        modalizeRef={modalizeRef}
        title="Profile saved successfully"
      />
    </View>
  );
};

export default EditProfile;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    backgroundColor: theme.colors?.background,
    flex: 1,
    paddingBottom: props.insets.bottom,
  },
  inputCont: {
    marginHorizontal: theme.spacing.l - 4,
    marginTop: theme.spacing.m - 6,
    flex: 1,
  },
  btnCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: theme.spacing.l - 4,
    marginTop: theme.spacing.m - 6,
    paddingBottom: theme.spacing.m - 6,
  },
  addPhotoCont: {
    height: 150,
    width: 150,
    borderRadius: theme.borderRadii.m,
    backgroundColor: theme.colors.textInBgColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.l - 4,
  },
  addPhotoIconCont: { alignItems: 'center', justifyContent: 'center' },
  txtAddPhoto: {
    fontSize: theme.fontSize.m,
    marginTop: theme.spacing.m,
  },
  imageCont: {
    borderRadius: theme.borderRadii.m,
    height: 150,
    width: 150,
    resizeMode: 'cover',
  },
  txtChooseDoc: {
    fontSize: theme.fontSize.m + 3,
    fontWeight: '500',
    marginTop: theme.spacing.m - 6,
    color: theme.colors.textPrimary,
  },
  openCameraCont: {
    padding: theme.spacing.s - 2,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadii.l,
    position: 'absolute',
    top: -10,
    right: -10,
    zIndex: 999,
    shadowColor: theme.colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  scrollCont: {
    flexGrow: 1,
  },
  textIN: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    backgroundColor: theme.colors.textInBgColor,
    borderRadius: theme.borderRadii.m,
    paddingHorizontal: theme.spacing.m,
    color: theme.colors.textPrimary,
  },
  btnVerify: {
    marginLeft: theme.spacing.m - 6,
  },
  innerContainer: {
    // flex: 1,
    marginTop: theme.spacing.m - 6,
    // marginHorizontal: theme.spacing.l - 4,
    alignItems: 'center',
    flexDirection: 'row',
  },
  verifyCont: {
    marginTop: theme.spacing.l,
  },
  txtEnterSixDigitCode: {
    fontSize: theme.fontSize.m - 3,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  txtMessage: {
    marginLeft: theme.spacing.m + 4,
    marginTop: theme.spacing.s - 2,
    fontSize: theme.fontSize.m - 4,
    color: theme.colors.greenLight,
  },
}));
