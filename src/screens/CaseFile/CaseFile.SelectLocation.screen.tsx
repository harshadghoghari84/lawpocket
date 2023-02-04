import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { Modalize } from 'react-native-modalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Snackbar from 'react-native-snackbar';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import BottomSheetChooseCity from 'src/components/BottomSheetChooseCity';
import BottomSheetChooseLocation from 'src/components/BottomSheetChooseLocation';
import ChooseItems from 'src/components/ChooseItems';
import CustomButton from 'src/components/CustomButton';
// relative path
import CustomHeader from 'src/components/CustomHeader';
import { ProgressBar } from 'src/components/ProgressBar';
import BackIcon from 'src/components/svg/BackIcon';
import { WIDTH } from 'src/constants';
import constants from 'src/constants/constants';
import { Route } from 'src/constants/navigationConstants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useCaseFile } from 'src/hooks/useCaseFile';
import { useCityOfState, useStateOfCountry } from 'src/hooks/useLocation';
import { selectCaseFileLoading } from 'src/redux/caseFile/caseFile.selector';
import { updateCaseFile } from 'src/redux/caseFile/caseFile.thunk';
import { caseFileSelector } from 'src/redux/settings/settings.selectors';
import { commonStyles } from 'src/screens/Authentication/Setprofile/SetProfileStyle';
import { LoadingState, ThemeProps } from 'src/types/global.types';
import { MainNavigationProps } from 'src/types/navigation.types';

const CaseFileLocation: React.FC<
  MainNavigationProps<Route.navCaseFileLocation>
> = ({ navigation }) => {
  const loading = useSelector(selectCaseFileLoading);
  const insets = useSafeAreaInsets();

  const styles = useStyles({ insets });
  const commonStyle = commonStyles();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const myCaseFileID = useSelector(caseFileSelector);

  const modalizeRefState = React.useRef<Modalize>(null);
  const modalizeRefCity = React.useRef<Modalize>(null);

  const [selectedStateItem, setSelectedStateItem] = React.useState<string[]>(
    [],
  );
  const [selectedStateIso, setSelectedStateIso] = React.useState<string[]>([]);
  const [selectedCityItem, setSelectedCityItem] = React.useState<string[]>([]);

  // const dispatch = useAppDispatch();
  const { data: stateData, isLoading: stateLoading } = useStateOfCountry();
  const { data: cityData, isLoading } = useCityOfState(
    selectedStateIso?.length > 0 ? selectedStateIso.join() : '',
  );

  const { data: currentCaseFile, refetch } = useCaseFile(myCaseFileID);

  React.useEffect(() => {
    if (myCaseFileID) {
      refetch().then();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myCaseFileID]);

  React.useEffect(() => {
    if (currentCaseFile) {
      if (currentCaseFile?.state) {
        let stateArr = currentCaseFile?.state.split(',');
        setSelectedStateItem(stateArr);

        let ISO: string[] = [];
        stateData?.map(ele => {
          stateArr?.map(itm => {
            if (ele.name === itm) {
              ISO.push(ele.iso);
            }
          });
        });
        setSelectedStateIso(ISO);
      }

      if (currentCaseFile?.city) {
        let cityArr = currentCaseFile?.city.split(',');
        setSelectedCityItem(cityArr);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCaseFile]);

  const onPressNext = async () => {
    // navigation.navigate(Route.navCaseFileDescription);
    console.log('selectedStateItem', selectedStateItem);
    if (selectedStateItem?.length > 0) {
      const formData = new FormData();

      formData.append('state', selectedStateItem.join());
      formData.append('city', selectedCityItem.join());
      const result = await dispatch(
        updateCaseFile({ formData: formData, caseFileID: myCaseFileID }),
      );

      if (updateCaseFile.fulfilled.match(result)) {
        navigation.navigate(Route.navCaseFileDescription);
      } else {
      }
    } else {
      Snackbar.show({
        text: 'please select state and city from above',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: theme.colors.error,
        textColor: theme.colors.white,
      });
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader title={constants.caseFile} onlyHeaderTitle={true} />

      <View style={commonStyle.progressBarCont}>
        <ProgressBar count={66.33} totalCount={5} height={10} color={true} />
      </View>
      <Text style={commonStyle.txtTitle}>2. Choose your location</Text>
      <View style={styles.stateCityCont}>
        <ChooseItems
          disabled={stateLoading}
          title={
            selectedStateItem.length > 0
              ? selectedStateItem.join()
              : 'Choose State'
          }
          icon={
            <Icon
              name="location-sharp"
              size={20}
              color={theme.colors.primary}
            />
          }
          onPress={() => {
            setSelectedCityItem([]);
            modalizeRefState.current?.open();
          }}
        />

        <ChooseItems
          disabled={selectedStateItem?.length > 0 && isLoading}
          title={
            selectedCityItem.length > 0
              ? selectedCityItem.join()
              : 'Choose City'
          }
          icon={
            <Icon
              name="location-sharp"
              size={20}
              color={theme.colors.primary}
            />
          }
          onPress={() => {
            if (selectedStateItem) {
              modalizeRefCity.current?.open();
            } else {
              Snackbar.show({
                text: 'please select State first',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: theme.colors.error,
                textColor: theme.colors.white,
              });
            }
          }}
        />
      </View>
      <View style={commonStyle.bottomCont}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
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
      <BottomSheetChooseLocation
        modalizeRef={modalizeRefState}
        locationData={stateData}
        title={'State'}
        selectedStateItem={selectedStateItem}
        selectedStateIso={selectedStateIso}
        setSelectedStateItem={setSelectedStateItem}
        setSelectedStateIso={setSelectedStateIso}
      />
      <BottomSheetChooseCity
        modalizeRef={modalizeRefCity}
        title={'City'}
        locationData={cityData}
        selectedCityItem={selectedCityItem}
        setSelectedCityItem={setSelectedCityItem}
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
    color: theme.colors.grey,
    marginLeft: theme.spacing.m - 6,
    fontSize: theme.fontSize.m,
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
    marginVertical: theme.spacing.m,
    justifyContent: 'center',
  },
  modalHeaderCont: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
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
    marginTop: theme.spacing.m - 6,
    // height: '100%',
  },
  modalHandle: {
    backgroundColor: theme.colors.transparent,
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
  txtSelectedItm: {
    color: theme.colors.grey,
    marginHorizontal: theme.spacing.s,
  },
  selectedItmCont: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
}));

export default CaseFileLocation;
