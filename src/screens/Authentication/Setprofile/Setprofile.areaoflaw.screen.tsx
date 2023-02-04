import * as React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { Modalize } from 'react-native-modalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
// relative path
import BottomSheetChoosePracticeArea from 'src/components/BottomSheetChoosePracticeArea';
import ChooseItems from 'src/components/ChooseItems';
import CustomButton from 'src/components/CustomButton';
import CustomHeader from 'src/components/CustomHeader';
import { ProgressBar } from 'src/components/ProgressBar';
import BackIcon from 'src/components/svg/BackIcon';
import LawFirmIcon from 'src/components/svg/LawFirmIcon';
import { WIDTH } from 'src/constants';
import constants, { UserType } from 'src/constants/constants';
import { Route } from 'src/constants/navigationConstants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useAreaOfLaw } from 'src/hooks/useAreaOfLaw';
import { useMeQuery } from 'src/hooks/useMeQuery';
import { selectSetProfileLoading } from 'src/redux/setProfile/setProfile.selectors';
import { updateUserPracticeArea } from 'src/redux/setProfile/setProfile.thunk';
import { commonStyles } from 'src/screens/Authentication/Setprofile/SetProfileStyle';
import { LoadingState, ThemeProps } from 'src/types/global.types';
import { AuthNavigationProps } from 'src/types/navigation.types';

const SetProfileAreaOfLaw: React.FC<
  AuthNavigationProps<Route.navSetProfileAreaOfLaw>
> = ({ navigation }) => {
  const loading = useSelector(selectSetProfileLoading);
  const insets = useSafeAreaInsets();
  const styles = useStyles({ insets });
  const commonStyle = commonStyles();
  const { theme } = useTheme();
  const { data: currentUser } = useMeQuery();

  const { data: areaOfLawData } = useAreaOfLaw();
  const dispatch = useAppDispatch();

  const modalizeRef = React.useRef<Modalize>(null);

  const [selectedItem, setSelectedItem] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (currentUser) {
      if (selectedItem.length > 0) {
      } else {
        currentUser &&
          currentUser?.userPracticeArea?.forEach(item => {
            selectedItem.push(item.id);
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, areaOfLawData, navigation]);

  const onPressNext = async () => {
    const result = await dispatch(
      updateUserPracticeArea({
        steps: 3,
        userPracticeArea: selectedItem,
      }),
    );
    if (updateUserPracticeArea.fulfilled.match(result)) {
      if (
        currentUser.userType === UserType.CLIENT ||
        currentUser.userType === UserType.LAW_FIRM ||
        currentUser.userType === UserType.LEGAL_SERVICE_PROVIDER
      ) {
        navigation.navigate(Route.navSetProfileProfilePhoto);
      } else if (currentUser.userType === UserType.LAW_STUDENT) {
        navigation.navigate(Route.navSetProfileStudentEmail);
      } else if (currentUser.userType === UserType.ATTORNEY) {
        // If Attorney then redirection AssociationNum  =---->
        navigation.navigate(Route.navSetProfileAssociationNum);
      }
    } else {
      // setErrors(formatErrors(result.payload.errors));
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
        <ProgressBar count={40} totalCount={5} height={10} color={true} />
      </View>
      <Text style={commonStyle.txtTitle}>3. Set Areas of Law</Text>
      <View style={styles.stateCityCont}>
        <ChooseItems
          title={'Choose area of Law'}
          icon={
            <LawFirmIcon color={theme.colors.primary} height={16} width={16} />
          }
          onPress={() => {
            modalizeRef.current?.open();
          }}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={styles.scrollCont}
        >
          <View style={styles.selectedItmCont}>
            {selectedItem?.map((item: number, index: number) => {
              return (
                <View key={index} style={styles.saveItemCont}>
                  {areaOfLawData?.map(
                    ele =>
                      ele.id === item && (
                        <Text key={ele.id} style={styles.txtSelectedItm}>
                          {ele.label}
                        </Text>
                      ),
                  )}
                  <Icon
                    name="close-circle"
                    size={20}
                    color={theme.colors.grey}
                    onPress={() => {
                      if (selectedItem.includes(item)) {
                        let filterArr = selectedItem.filter(
                          (itm: number) => itm !== item,
                        );
                        setSelectedItem(filterArr);
                      }
                    }}
                  />
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
      <View style={commonStyle.bottomCont}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={commonStyle.backCont}
        >
          <BackIcon color={theme.colors.grey} />
        </TouchableOpacity>
        <CustomButton
          smallBtn={WIDTH - 110}
          name={'Next'}
          disabled={loading === LoadingState.CREATE}
          loading={loading === LoadingState.CREATE}
          onPress={() => onPressNext()}
        />
      </View>
      <BottomSheetChoosePracticeArea
        modalizeRef={modalizeRef}
        stateData={areaOfLawData}
        selectedPracticeArea={selectedItem}
        setSelectedPracticeArea={setSelectedItem}
      />
    </View>
  );
};

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    backgroundColor: theme.colors?.background,
    flex: 1,
    paddingBottom: props.insets.bottom,
  },
  stateCityCont: {
    flex: 1,
    marginTop: theme.spacing.l - 4,
    marginHorizontal: theme.spacing.l - 4,
  },
  vState: {
    backgroundColor: theme.colors.lightestGrey,
    height: 50,
    borderRadius: theme.borderRadii.m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.m - 6,
    marginBottom: theme.spacing.l - 4,
  },
  iconAndTxtCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    color: theme.colors.grey3,
    marginLeft: theme.spacing.m - 6,
    fontSize: theme.fontSize.m,
  },
  modalHeaderCont: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
  },
  txtStateCity: {
    fontSize: theme.fontSize.m + 4,
    fontWeight: '700',
    color: theme.colors.black,
  },
  modalCloseCont: {
    height: 40,
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  dummyView: {
    width: 50,
  },
  selectStateCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
  },
  vStateCity: {
    // width: '85%',
    marginTop: theme.spacing.m - 6,
  },
  saveItemCont: {
    borderWidth: 1,
    borderColor: theme.colors.grey,
    borderRadius: theme.borderRadii.l,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.s - 6,
    paddingVertical: theme.spacing.s - 6,
    margin: theme.spacing.s - 4,
  },
  modalCont: {
    paddingHorizontal: theme.spacing.m,
    justifyContent: 'center',
    flex: 1,
    paddingBottom: theme.spacing.l - 4,
    backgroundColor: theme.colors.background,
  },
  txtSelectedItm: {
    color: theme.colors.grey,
    marginHorizontal: theme.spacing.s,
  },
  selectedItmCont: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  scrollCont: {
    flexGrow: 1,
    paddingBottom: theme.spacing.m,
  },
  safeAreaView: {
    paddingBottom: theme.spacing.m - 6,
    backgroundColor: theme.colors.background,
  },
}));

export default SetProfileAreaOfLaw;
