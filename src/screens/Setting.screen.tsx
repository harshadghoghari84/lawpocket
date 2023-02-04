// relative path
import { useFormik } from 'formik';
import * as React from 'react';
import { Text, TextInput, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import CustomButton from 'src/components/CustomButton';
import CustomHeader from 'src/components/CustomHeader';
import { CustomTxtInput } from 'src/components/CustomTextInput';
import SettingItem from 'src/components/SettingItem';
import MailIcon from 'src/components/svg/MailIcon';
import NotificationIcon from 'src/components/svg/NotificationIcon';
import ToggleButton from 'src/components/ToggleButton';
import { WIDTH } from 'src/constants';
import { UserType } from 'src/constants/constants';
import { Route } from 'src/constants/navigationConstants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useMeQuery } from 'src/hooks/useMeQuery';
import { setSuccess } from 'src/redux/global/global.slice';
import { isDark } from 'src/redux/settings/settings.selectors';
import { isDarkMode } from 'src/redux/settings/settings.slice';
import {
  updateEmailProfile,
  updateNotificationStatus,
} from 'src/redux/updateProfile/updateProfile.thunk';
import { UpdateEmailProps } from 'src/types/authentication.types';
import { ThemeProps } from 'src/types/global.types';
import { MainNavigationProps } from 'src/types/navigation.types';
import { setDarkMode } from 'src/utils/asyncStorage';
import { formatErrors } from 'src/utils/formatErrors';
import * as Yup from 'yup';
export const UpdateEmailSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

const Setting: React.FC<MainNavigationProps<Route.navSetting>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  const styles = useStyles({ insets });
  const { theme } = useTheme();
  const { data: currentUser, refetch } = useMeQuery();

  const [activeNotification, setActiveNotification] = React.useState<boolean>(
    currentUser?.isAllowNotification ? currentUser?.isAllowNotification : true,
  );
  const [loader, setLoader] = React.useState<boolean>(false);
  const modalizeRef = React.useRef<Modalize>(null);
  const emaiRef = React.useRef<TextInput>(null);

  React.useEffect(() => {
    if (currentUser) {
      setActiveNotification(currentUser?.isAllowNotification);
    }
  }, [currentUser, activeNotification]);

  const dispatch = useAppDispatch();
  const isEnabled = useSelector(isDark);

  const emailFormik = useFormik<UpdateEmailProps>({
    validationSchema: UpdateEmailSchema,
    initialValues: { email: '' },
    onSubmit: async ({ email }) => {
      setLoader(true);
      const result = await dispatch(updateEmailProfile({ email }));
      if (updateEmailProfile.fulfilled.match(result)) {
        setLoader(false);

        dispatch(setSuccess('verify your email'));
        emailFormik.setFieldValue('email', '');
        modalizeRef.current?.close();
      } else {
        setLoader(false);

        emailFormik.setErrors(formatErrors(result.payload.errors));
      }
    },
  });

  const onPressNotification = async () => {
    const result = await dispatch(
      updateNotificationStatus({ isAllowNotification: !activeNotification }),
    );
    console.log('result', result);
    if (updateNotificationStatus.fulfilled.match(result)) {
      refetch().then();
      // dispatch(setSuccess('verify your email'));
    } else {
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Settings" backBtn={true} dummy={true} />
      <SettingItem
        icon={
          <NotificationIcon color={theme.colors.grey} height={20} width={20} />
        }
        name={'Notification'}
        toggle={
          <ToggleButton
            isOn={activeNotification}
            onToggle={() => onPressNotification()}
          />
        }
      />
      <SettingItem
        icon={<MailIcon color={theme.colors.grey} />}
        name={'Update Email'}
        onPress={() => modalizeRef?.current.open()}
        rightIconEnable={true}
      />
      <SettingItem
        icon={
          <FontAwesome5 name="briefcase" size={20} color={theme.colors.grey} />
        }
        name={'Practice Areas'}
        data={`${currentUser?.userPracticeArea.length}`}
        onPress={() => navigation.navigate(Route.navPracticeArea)}
        rightIconEnable={true}
      />
      <SettingItem
        icon={
          <Icon name="location-sharp" size={20} color={theme.colors.grey} />
        }
        name={'Location'}
        data={currentUser?.city ? `${currentUser?.city}` : ''}
        onPress={() => navigation.navigate(Route.navUpdateLocation)}
        rightIconEnable={true}
      />
      <SettingItem
        icon={<Icon name="lock-closed" size={20} color={theme.colors.grey} />}
        name={'Subscription'}
        data={
          currentUser?.userType === UserType.CLIENT ||
          currentUser?.userType === UserType.LAW_STUDENT
            ? currentUser?.subscription
              ? `${currentUser?.subscription?.title}`
              : 'Free Plans'
            : currentUser?.subscription
            ? `${currentUser?.subscription?.title}`
            : 'No Plans'
        }
        rightIconEnable={true}
        onPress={() =>
          navigation.navigate(Route.navSubscriptions, { activeBack: true })
        }
      />
      <SettingItem
        icon={
          <MaterialCommunityIcons
            name="circle-half-full"
            size={20}
            color={theme.colors.grey}
            // style={styles.iconStyle}
          />
        }
        name={'Dark Mode'}
        toggle={
          <ToggleButton
            isOn={isEnabled}
            onToggle={val => {
              setDarkMode(val ? 0 : 1);
              dispatch(isDarkMode(val));
            }}
          />
        }
      />
      <Portal>
        <Modalize
          handleStyle={styles.modalHandle}
          adjustToContentHeight
          closeOnOverlayTap
          handlePosition="inside"
          ref={modalizeRef}
        >
          <View style={styles.modalItmCont}>
            <View style={styles.modalCont}>
              <View style={styles.vLockResetPass}>
                <MailIcon color={theme.colors.primary} height={25} width={25} />
              </View>
              <Text style={styles.txtUserCurrentEmail}>
                {currentUser?.email}
              </Text>
              <Text style={styles.txtResetPass}>Update Email</Text>
              <Text style={styles.txtResetPass2}>
                Please enter your new email
              </Text>
            </View>
            <View style={styles.modalTextInCont}>
              <CustomTxtInput
                ref={emaiRef}
                icon={<MailIcon color={theme.colors.primary} />}
                placeholder="Email"
                // returnKeyType="done"
                // returnKeyLabel="done"
                keyboardType={'email-address'}
                onChangeText={emailFormik.handleChange('email')}
                onBlur={emailFormik.handleBlur('email')}
                value={emailFormik.values.email}
                error={emailFormik.errors.email}
                touched={emailFormik.touched.email}
              />
              <View style={styles.modalButtons}>
                <CustomButton
                  height={40}
                  smallBtn={WIDTH / 2 - 50}
                  borderBtn={true}
                  name={'Cancel'}
                  onPress={() => {
                    emailFormik.setFieldValue('email', '');
                    modalizeRef.current?.close();
                  }}
                />
                <CustomButton
                  height={40}
                  smallBtn={WIDTH / 2 - 50}
                  borderBtn={false}
                  name={'Update'}
                  disabled={!emailFormik.isValid}
                  loading={loader}
                  onPress={() => emailFormik.handleSubmit()}
                />
              </View>
            </View>
          </View>
        </Modalize>
      </Portal>
    </View>
  );
};

export default Setting;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    backgroundColor: theme.colors?.background,
    flex: 1,
  },
  txtItemName: {
    fontSize: theme.fontSize.m + 2,
    marginLeft: theme.spacing.m - 6,
    color: theme.colors.black,
  },
  txtItemData: {
    fontSize: theme.fontSize.m,
    marginRight: theme.spacing.m - 6,
    color: theme.colors.primary,
  },
  itemCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: theme.spacing.l - 4,
    marginVertical: theme.spacing.l - 4 - 5,
  },
  innerItmCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalizeCont: {
    paddingHorizontal: theme.spacing.m,
    justifyContent: 'center',
    flex: 1,
    paddingBottom: theme.spacing.l - 4,
    backgroundColor: theme.colors.background,
  },
  modalHeaderMainCont: {
    marginHorizontal: theme.spacing.m,
    justifyContent: 'center',
  },
  modalHeaderCont: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
  },
  txtStateCity: {
    fontSize: theme.fontSize.m,
    fontWeight: '700',
  },
  modalCloseCont: {
    height: 50,
    width: 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  dummyView: {
    width: 50,
  },
  vStateCity: {
    marginTop: theme.spacing.m - 6,
  },
  selectStateCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
  },
  modalHandle: {
    backgroundColor: theme.colors.modalHandleColor,
  },
  noDataFoundCont: {
    alignItems: 'center',
    justifyContent: 'center',
    height: WIDTH + WIDTH / 2,
  },
  txtNoDataFound: {
    color: theme.colors.textPrimary,
  },
  safeAreaView: {
    paddingBottom: theme.spacing.m - 6,
    backgroundColor: theme.colors.background,
  },
  headerComponent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadii.l - 5,
    borderTopRightRadius: theme.borderRadii.l - 5,
  },
  headerComponentTextIn: { marginHorizontal: theme.spacing.m - 6 },
  modalStyle: { backgroundColor: theme.colors.background },
  txtResetPass: {
    fontSize: theme.fontSize.l,
    marginTop: theme.spacing.l - 4,
    color: theme.colors.textPrimary,
  },
  txtResetPass2: {
    fontSize: theme.fontSize.m,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginHorizontal: theme.spacing.l - 4,
    lineHeight: theme.spacing.l,
    marginTop: theme.spacing.m - 6,
  },
  vLockResetPass: {
    height: 100,
    width: 100,
    borderRadius: theme.borderRadii.xxl,
    backgroundColor: theme.colors.textInBgColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.l - 4,
  },
  modalButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.m - 6,
    paddingBottom: props.insets.bottom + theme.spacing.s,
  },
  modalItmCont: {
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.l,
    flex: 1,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadii.l - 5,
    borderTopRightRadius: theme.borderRadii.l - 5,
  },
  modalTextInCont: { marginTop: theme.spacing.m - 6 },
  modalCont: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtUserCurrentEmail: {
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.m - 6,
  },
}));
