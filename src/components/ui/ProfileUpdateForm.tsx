// relative path

import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { makeStyles } from 'react-native-elements';
import CustomButton from 'src/components/CustomButton';
import { WIDTH } from 'src/constants';

interface ProfileUpdateFormProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const ProfileUpdateForm: React.FC<ProfileUpdateFormProps> = ({
  onPress,
  children,
  disabled,
  loading,
}) => {
  const styles = useStyles();
  const navigation = useNavigation();
  //   const { theme } = useTheme();
  //   const { data: currentUser } = useMeQuery();
  //   const dispatch = useAppDispatch();

  //   const [image, setImage] = React.useState<ImageProps[]>([]);
  //   const modalizeRef = React.useRef<Modalize>(null);
  //   const modalChooseImageRef = React.useRef<Modalize>(null);

  //   const firstRef = React.useRef<TextInput>(null);
  //   const lastRef = React.useRef<TextInput>(null);
  //   const emailRef = React.useRef<TextInput>(null);
  //   const associationNumRef = React.useRef<TextInput>(null);
  //   const phoneNumberRef = React.useRef<TextInput>(null);

  //   const AtrFormik = useFormik<EditProfileAtrFormProps>({
  //     validationSchema: EditProfileAtrScreenSchema,
  //     initialValues: {
  //       firstName: '',
  //       lastName: '',
  //     },
  //     onSubmit: async ({ firstName, lastName }) => {
  //       const result = await dispatch(
  //         updateAttorneyProfile({
  //           firstName,
  //           lastName,
  //         }),
  //       );
  //       if (updateAttorneyProfile.fulfilled.match(result)) {
  //         modalizeRef.current?.open();
  //       } else {
  //       }
  //     },
  //   });
  //   const LfFormik = useFormik<EditProfileLfFormProps>({
  //     validationSchema: EditProfileLfScreenSchema,
  //     initialValues: {
  //       firstName: '',
  //       lastName: '',
  //       associationNumber: '',
  //     },
  //     onSubmit: async ({ firstName, lastName, associationNumber }) => {
  //       const result = await dispatch(
  //         updateLFAndLSPProfile({
  //           firstName,
  //           lastName,
  //           associationNumber,
  //         }),
  //       );
  //       if (updateLFAndLSPProfile.fulfilled.match(result)) {
  //         modalizeRef.current?.open();
  //       } else {
  //       }
  //     },
  //   });

  //   const ClientsAndStudentsProfileUpdate = () => {
  //     const { handleChange, handleBlur, touched, values, errors, handleSubmit } =
  //       useFormik<EditProfileFormProps>({
  //         validationSchema: EditProfileScreenSchema,
  //         initialValues: {
  //           firstName: '',
  //           lastName: '',
  //           phoneNumber: '',
  //         },
  //         onSubmit: async ({ firstName, lastName, phoneNumber }) => {
  //           const result = await dispatch(
  //             updateClientAndStudentProfile({
  //               firstName,
  //               lastName,
  //               phoneNumber,
  //             }),
  //           );
  //           if (updateClientAndStudentProfile.fulfilled.match(result)) {
  //             modalizeRef.current?.open();
  //           } else {
  //           }
  //         },
  //       });
  //     return (
  //       <>
  //         <CustomTxtInput
  //           placeholder="First Name"
  //           icon={<UserIcon color={theme.colors.primary} />}
  //           ref={firstRef}
  //           returnKeyType="next"
  //           returnKeyLabel="next"
  //           onChangeText={handleChange('firstName')}
  //           onBlur={handleBlur('firstName')}
  //           value={values.firstName}
  //           error={errors.firstName}
  //           touched={touched.firstName}
  //           onSubmitEditing={() => lastRef.current?.focus()}
  //         />

  //         <CustomTxtInput
  //           placeholder="Last Name"
  //           icon={<UserIcon color={theme.colors.primary} />}
  //           returnKeyType="next"
  //           ref={lastRef}
  //           returnKeyLabel="next"
  //           onChangeText={handleChange('lastName')}
  //           onBlur={handleBlur('lastName')}
  //           value={values.lastName}
  //           error={errors.lastName}
  //           touched={touched.lastName}
  //           onSubmitEditing={() => phoneNumberRef.current?.focus()}
  //         />

  //         {/* <CustomTxtInput
  //           placeholder="Email"
  //           icon={<MailIcon color={theme.colors.primary} />}
  //           returnKeyType="next"
  //           returnKeyLabel="next"
  //           ref={emailRef}
  //           onChangeText={handleChange('email')}
  //           onBlur={handleBlur('email')}
  //           value={values.email}
  //           error={errors.email}
  //           touched={touched.email}
  //           onSubmitEditing={() => phoneNumberRef.current?.focus()}
  //         /> */}

  //         <CustomTxtInput
  //           placeholder="Phone number"
  //           icon={<PhoneIcon color={theme.colors.primary} />}
  //           returnKeyType="done"
  //           returnKeyLabel="done"
  //           ref={phoneNumberRef}
  //           onChangeText={handleChange('phoneNumber')}
  //           onBlur={handleBlur('phoneNumber')}
  //           value={values.phoneNumber}
  //           error={errors.phoneNumber}
  //           touched={touched.phoneNumber}
  //         />
  //         <View style={styles.btnCont}>
  //           <CustomButton
  //             height={40}
  //             smallBtn={WIDTH / 2 - 30}
  //             borderBtn={true}
  //             name={'Cancel'}
  //             onPress={() => navigation.goBack()}
  //           />
  //           <CustomButton
  //             height={40}
  //             smallBtn={WIDTH / 2 - 30}
  //             borderBtn={false}
  //             name={'Update'}
  //             onPress={() => {
  //               handleSubmit();
  //             }}
  //           />
  //         </View>
  //       </>
  //     );
  //   };

  //   const AttorneyProfileUpdate = () => {
  //     return (
  //       <>
  //         <CustomTxtInput
  //           placeholder="First Name"
  //           icon={<UserIcon color={theme.colors.primary} />}
  //           ref={firstRef}
  //           returnKeyType="next"
  //           returnKeyLabel="next"
  //           onChangeText={AtrFormik.handleChange('firstName')}
  //           onBlur={AtrFormik.handleBlur('firstName')}
  //           value={AtrFormik.values.firstName}
  //           error={AtrFormik.errors.firstName}
  //           touched={AtrFormik.touched.firstName}
  //           onSubmitEditing={() => lastRef.current?.focus()}
  //         />

  //         <CustomTxtInput
  //           placeholder="Last Name"
  //           icon={<UserIcon color={theme.colors.primary} />}
  //           returnKeyType="done"
  //           ref={lastRef}
  //           returnKeyLabel="done"
  //           onChangeText={AtrFormik.handleChange('lastName')}
  //           onBlur={AtrFormik.handleBlur('lastName')}
  //           value={AtrFormik.values.lastName}
  //           error={AtrFormik.errors.lastName}
  //           touched={AtrFormik.touched.lastName}
  //           // onSubmitEditing={() => emailRef.current?.focus()}
  //         />
  //         {/* <CustomTxtInput
  //           placeholder="Email"
  //           icon={<MailIcon color={theme.colors.primary} />}
  //           returnKeyType="next"
  //           returnKeyLabel="next"
  //           ref={emailRef}
  //           onChangeText={AtrFormik.handleChange('email')}
  //           onBlur={AtrFormik.handleBlur('email')}
  //           value={AtrFormik.values.email}
  //           error={AtrFormik.errors.email}
  //           touched={AtrFormik.touched.email}
  //           onSubmitEditing={() => phoneNumberRef.current?.focus()}
  //         /> */}
  //       </>
  //     );
  //   };

  //   const LawFirmAndLegalProfileUpdate = () => {
  //     return (
  //       <>
  //         <CustomTxtInput
  //           placeholder="First Name"
  //           icon={<UserIcon color={theme.colors.primary} />}
  //           ref={firstRef}
  //           returnKeyType="next"
  //           returnKeyLabel="next"
  //           onChangeText={LfFormik.handleChange('firstName')}
  //           onBlur={LfFormik.handleBlur('firstName')}
  //           value={LfFormik.values.firstName}
  //           error={LfFormik.errors.firstName}
  //           touched={LfFormik.touched.firstName}
  //           onSubmitEditing={() => lastRef.current?.focus()}
  //         />

  //         <CustomTxtInput
  //           placeholder="Last Name"
  //           icon={<UserIcon color={theme.colors.primary} />}
  //           returnKeyType="next"
  //           ref={lastRef}
  //           returnKeyLabel="next"
  //           onChangeText={LfFormik.handleChange('lastName')}
  //           onBlur={LfFormik.handleBlur('lastName')}
  //           value={LfFormik.values.lastName}
  //           error={LfFormik.errors.lastName}
  //           touched={LfFormik.touched.lastName}
  //           onSubmitEditing={() => associationNumRef.current?.focus()}
  //         />
  //         <CustomTxtInput
  //           placeholder="association number"
  //           icon={
  //             <LawFirmIcon color={theme.colors.primary} height={18} width={18} />
  //           }
  //           returnKeyType="done"
  //           returnKeyLabel="done"
  //           ref={associationNumRef}
  //           onChangeText={LfFormik.handleChange('associationNumber')}
  //           onBlur={LfFormik.handleBlur('associationNumber')}
  //           value={LfFormik.values.associationNumber}
  //           error={LfFormik.errors.associationNumber}
  //           touched={LfFormik.touched.associationNumber}
  //           // onSubmitEditing={() => phoneNumberRef.current?.focus()}
  //         />
  //         {/* <CustomTxtInput
  //           placeholder="Email"
  //           icon={<MailIcon color={theme.colors.primary} />}
  //           returnKeyType="next"
  //           returnKeyLabel="next"
  //           ref={emailRef}
  //           onChangeText={LfFormik.handleChange('email')}
  //           onBlur={LfFormik.handleBlur('email')}
  //           value={LfFormik.values.email}
  //           error={LfFormik.errors.email}
  //           touched={LfFormik.touched.email}
  //           onSubmitEditing={() => phoneNumberRef.current?.focus()}
  //         /> */}
  //       </>
  //     );
  //   };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps={'handled'}
      bounces={false}
      contentContainerStyle={styles.scrollCont}
    >
      <KeyboardAvoidingView style={styles.subContainer}>
        {children}
      </KeyboardAvoidingView>
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
          disabled={disabled}
          loading={loading}
          smallBtn={WIDTH / 2 - 30}
          borderBtn={false}
          name={'Update'}
          onPress={onPress}
        />
      </View>
    </ScrollView>
  );
};

export default ProfileUpdateForm;

const useStyles = makeStyles(theme => ({
  scrollCont: {
    flexGrow: 1,
  },
  subContainer: {
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
}));
