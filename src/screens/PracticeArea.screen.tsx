import * as React from 'react';
import { Text, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { Modalize } from 'react-native-modalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import BottomSheetChoosePracticeArea from 'src/components/BottomSheetChoosePracticeArea';
import BottomSheetSave from 'src/components/BottomSheetSave';
import ChooseItems from 'src/components/ChooseItems';
import CustomButton from 'src/components/CustomButton';
// relative path
import CustomHeader from 'src/components/CustomHeader';
import { WIDTH } from 'src/constants';
import { Route } from 'src/constants/navigationConstants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useAreaOfLaw } from 'src/hooks/useAreaOfLaw';
import { useMeQuery } from 'src/hooks/useMeQuery';
import { updatePracticeAreaProfile } from 'src/redux/updateProfile/updateProfile.thunk';
import { commonStyles } from 'src/screens/Authentication/Setprofile/SetProfileStyle';
import { ThemeProps } from 'src/types/global.types';
import { MainNavigationProps } from 'src/types/navigation.types';

const PracticeArea: React.FC<MainNavigationProps<Route.navPracticeArea>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  const styles = useStyles({ insets });
  const commonStyle = commonStyles();
  const { theme } = useTheme();

  const modalizeRef = React.useRef<Modalize>(null);
  const modalizeRefSave = React.useRef<Modalize>(null);

  const [selectedPracticeArea, setSelectedPracticeArea] = React.useState<
    number[]
  >([]);
  const [loader, setLoader] = React.useState<boolean>(false);

  const dispatch = useAppDispatch();
  const { data: currentUser, refetch } = useMeQuery();

  const { data: areaOfLawData } = useAreaOfLaw();

  React.useEffect(() => {
    if (currentUser) {
      if (selectedPracticeArea.length > 0) {
      } else {
        currentUser &&
          currentUser?.userPracticeArea?.forEach(item => {
            selectedPracticeArea.push(item.id);
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, areaOfLawData, navigation]);

  const onPressUpdate = async () => {
    setLoader(true);

    const result = await dispatch(
      updatePracticeAreaProfile({
        userPracticeArea: selectedPracticeArea,
      }),
    );
    if (updatePracticeAreaProfile.fulfilled.match(result)) {
      refetch().then();
      setTimeout(() => {
        setLoader(false);
        modalizeRefSave.current.open();
      }, 1000);
    } else {
      setLoader(false);
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader backBtn={true} title={'Practice Areas'} dummy={true} />

      <View style={styles.stateCityCont}>
        <ChooseItems
          title="Choose area of Law"
          icon={<Octicons name="law" size={20} color={theme.colors.primary} />}
          onPress={() => {
            modalizeRef.current?.open();
          }}
        />
        <View style={styles.selectedItmCont}>
          {selectedPracticeArea?.map((item: number, index: number) => {
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
                    if (selectedPracticeArea.includes(item)) {
                      let filterArr = selectedPracticeArea.filter(
                        (itm: number) => itm !== item,
                      );
                      setSelectedPracticeArea(filterArr);
                    }
                  }}
                />
              </View>
            );
          })}
        </View>
      </View>
      <View style={commonStyle.bottomCont}>
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
          borderBtn={false}
          disabled={loader || selectedPracticeArea.length === 0}
          loading={loader}
          name={'Update'}
          onPress={() => onPressUpdate()}
        />
      </View>
      <BottomSheetChoosePracticeArea
        modalizeRef={modalizeRef}
        stateData={areaOfLawData}
        selectedPracticeArea={selectedPracticeArea}
        setSelectedPracticeArea={setSelectedPracticeArea}
      />
      <BottomSheetSave
        modalizeRef={modalizeRefSave}
        title="Profile saved successfully"
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
  modalHeaderCont: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
  },
  txtStateCity: {
    fontSize: theme.fontSize.m + 3,
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
  selectStateCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    flex: 1,
  },
  vStateCity: {
    marginTop: theme.spacing.m - 6,
  },
  saveItemCont: {
    borderWidth: 1,
    borderColor: theme.colors.grey,
    borderRadius: theme.borderRadii.l,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.m - 6 - 8,
    paddingVertical: theme.spacing.m - 6 - 8,
    margin: theme.spacing.m - 6 - 5,
  },
  modalCont: {
    flex: 1,
    paddingBottom: theme.spacing.l - 4,
    paddingHorizontal: theme.spacing.m - 6,
    backgroundColor: theme.colors.background,
  },
  txtSelectedItm: {
    color: theme.colors.grey,
    marginHorizontal: theme.spacing.m - 6 - 5,
  },
  selectedItmCont: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  safeAreaView: {
    paddingBottom: theme.spacing.m - 6,
    backgroundColor: theme.colors.background,
  },
}));

export default PracticeArea;
