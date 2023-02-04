import * as React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Snackbar from 'react-native-snackbar';
import Octicons from 'react-native-vector-icons/Octicons';
import { useSelector } from 'react-redux';
import CustomButton from 'src/components/CustomButton';
import CustomHeader from 'src/components/CustomHeader';
import { ProgressBar } from 'src/components/ProgressBar';
import AttorneyIcon from 'src/components/svg/AttorneyIcon';
import ClientIcon from 'src/components/svg/ClientIcon';
import LawFirmIcon from 'src/components/svg/LawFirmIcon';
import LawStudentIcon from 'src/components/svg/LawStudentIcon';
import constants, { UserType } from 'src/constants/constants';
// relative path
import { Route } from 'src/constants/navigationConstants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useMeQuery } from 'src/hooks/useMeQuery';
import { selectSetProfileLoading } from 'src/redux/setProfile/setProfile.selectors';
import { updateRegisterType } from 'src/redux/setProfile/setProfile.thunk';
import { commonStyles } from 'src/screens/Authentication/Setprofile/SetProfileStyle';
import { LoadingState, ThemeProps } from 'src/types/global.types';
import { AuthNavigationProps } from 'src/types/navigation.types';

interface RegisterTypes {
  index: {};
  item: {
    tit: string;
    userType: number;
  };
}

const registerType: { tit: string; userType: number }[] = [
  { tit: 'Client', userType: UserType.CLIENT },
  { tit: 'Law student', userType: UserType.LAW_STUDENT },
  { tit: 'Attorney', userType: UserType.ATTORNEY },
  { tit: 'Law firm', userType: UserType.LAW_FIRM },
  { tit: 'Legal Service Provider', userType: UserType.LEGAL_SERVICE_PROVIDER },
];

const Register1: React.FC<AuthNavigationProps<Route.navRegister1>> = ({
  navigation,
}) => {
  const setProfileLoading = useSelector(selectSetProfileLoading);
  const insets = useSafeAreaInsets();
  const styles = useStyles({ insets });
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const commonStyle = commonStyles();
  const { data: currentUser } = useMeQuery();

  const [activeType, setActiveType] = React.useState<string>('');
  const [activeUserType, setActiveUserType] = React.useState<number>(
    currentUser?.userType,
  );

  React.useEffect(() => {
    if (currentUser) {
      registerType.map(ele => {
        if (ele?.userType === currentUser?.userType) {
          setActiveType(ele.tit);
        }
      });
    }
  }, [currentUser]);

  const onContinuePress = async () => {
    if (activeType) {
      const result = await dispatch(
        updateRegisterType({ steps: 1, userType: activeUserType }),
      );

      if (updateRegisterType.fulfilled.match(result)) {
        navigation.navigate(Route.navSetProfileLocation);
      } else {
        // setErrors(formatErrors(result.payload.errors));
      }
    } else {
      Snackbar.show({
        text: 'please select type from above',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: theme.colors.error,
        textColor: theme.colors.white,
      });
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        profileIcon={true}
        title={constants.setProfile}
        dummy={true}
      />

      <View style={commonStyle.progressBarCont}>
        <ProgressBar count={20} totalCount={5} height={10} color={true} />
      </View>
      <Text style={commonStyle.txtTitle}>1. I want to register as</Text>

      <View style={styles.flatListCont}>
        <FlatList
          data={registerType}
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatCont}
          renderItem={({ item, index }: RegisterTypes) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setActiveType(item.tit);
                  setActiveUserType(item.userType);
                }}
              >
                <View
                  style={[
                    styles.FlatListItemCont,
                    {
                      borderColor:
                        activeType === item.tit
                          ? theme.colors.primary
                          : theme.colors.textPrimary,
                    },
                  ]}
                >
                  <View style={styles.iconAndTxtCont}>
                    {index === 0 ? (
                      <ClientIcon
                        color={
                          activeType === item.tit
                            ? theme.colors.primary
                            : theme.colors.grey
                        }
                      />
                    ) : index === 1 ? (
                      <LawStudentIcon
                        color={
                          activeType === item.tit
                            ? theme.colors.primary
                            : theme.colors.grey
                        }
                      />
                    ) : index === 2 ? (
                      <AttorneyIcon
                        color={
                          activeType === item.tit
                            ? theme.colors.primary
                            : theme.colors.grey
                        }
                      />
                    ) : (
                      <LawFirmIcon
                        color={
                          activeType === item.tit
                            ? theme.colors.primary
                            : theme.colors.grey
                        }
                      />
                    )}

                    <Text
                      style={[
                        styles.itmTxtTitle,
                        {
                          color:
                            activeType === item.tit
                              ? theme.colors.primary
                              : theme.colors.textPrimary,
                        },
                      ]}
                    >
                      {item.tit}
                    </Text>
                  </View>
                  {activeType === item.tit ? (
                    <Octicons
                      name="check"
                      size={20}
                      color={theme.colors.primary}
                    />
                  ) : (
                    <View />
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View style={styles.btnCont}>
        <CustomButton
          onPress={() => onContinuePress()}
          name={'Continue'}
          disabled={setProfileLoading === LoadingState.CREATE}
          loading={setProfileLoading === LoadingState.CREATE}
        />
      </View>
    </View>
  );
};

export default Register1;

export const useStyles = makeStyles((theme, props: ThemeProps) => ({
  bottomSafeAreaView: {
    flex: 0,
    backgroundColor: theme.colors.bottomSafeAreaViewColor,
  },
  lgCont: { flex: 1 },
  topSafeAreaView: {
    flex: 0,
    zIndex: 999,
    backgroundColor: theme.colors.background,
  },
  container: {
    backgroundColor: theme.colors?.background,
    flex: 1,
    paddingBottom: props.insets.bottom,
  },
  flatCont: {
    flexGrow: 1,
  },
  topViewCont: {
    marginHorizontal: theme.spacing.xl,
    marginTop: theme.spacing.m,
  },
  registerCont: {},
  txtRegister: {
    fontSize: theme.fontSize.l,
    color: theme.colors.textPrimary,
  },
  txtRegister2: {
    fontSize: theme.fontSize.m - 2,
    color: theme.colors.textSecondary,
  },
  flatListCont: {
    flex: 1,
    marginTop: theme.spacing.l - 4,
    marginHorizontal: theme.spacing.xl,
  },
  FlatListItemCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 80,
    borderColor: theme.colors.black,
    borderWidth: 1,
    borderRadius: theme.borderRadii.m,
    marginVertical: theme.spacing.m - 6,
    paddingHorizontal: theme.spacing.l - 4,
  },
  iconAndTxtCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtRegisterAs: {
    fontSize: theme.fontSize.m,
    color: theme.colors.textPrimary,
  },
  btnCont: {
    paddingBottom: theme.spacing.m - 6,
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: theme.colors.transparent,
  },
  btnClose: {
    alignSelf: 'flex-start',
    height: 40,
    width: 40,
    justifyContent: 'center',
  },
  itmTxtTitle: { marginLeft: theme.spacing.m, fontSize: theme.fontSize.m },
}));
