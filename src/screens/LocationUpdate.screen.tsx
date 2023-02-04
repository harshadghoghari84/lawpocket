import * as React from 'react';
import { Text, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { Modalize } from 'react-native-modalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Snackbar from 'react-native-snackbar';
import Icon from 'react-native-vector-icons/Ionicons';
import BottomSheetChooseCity from 'src/components/BottomSheetChooseCity';
import BottomSheetChooseLocation from 'src/components/BottomSheetChooseLocation';
import BottomSheetSave from 'src/components/BottomSheetSave';
import ChooseItems from 'src/components/ChooseItems';
import CustomButton from 'src/components/CustomButton';
// relative path
import CustomHeader from 'src/components/CustomHeader';
import { WIDTH } from 'src/constants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useCityOfState, useStateOfCountry } from 'src/hooks/useLocation';
import { useMeQuery } from 'src/hooks/useMeQuery';
import { updateLocationProfile } from 'src/redux/updateProfile/updateProfile.thunk';
import { ThemeProps } from 'src/types/global.types';

export type SelectedStateProps = {
  name: string;
  isoCode: string;
  countryCode: string;
  latitude: string;
  longitude: string;
};

const LocationUpdate: React.FC = ({}) => {
  //   const loading = useSelector(selectSetProfileLoading);
  const insets = useSafeAreaInsets();

  const styles = useStyles({ insets });

  const { theme } = useTheme();
  const { data: currentUser, refetch } = useMeQuery();

  const modalizeRefState = React.useRef<Modalize>(null);
  const modalizeRefCity = React.useRef<Modalize>(null);

  const [selectedStateItem, setSelectedStateItem] = React.useState<string[]>(
    [],
  );
  const [selectedStateIso, setSelectedStateIso] = React.useState<string[]>([]);
  const [selectedCityItem, setSelectedCityItem] = React.useState<string[]>([]);
  const [loader, setLoader] = React.useState<boolean>(false);

  const dispatch = useAppDispatch();
  const { data: stateData, isLoading: stateLoading } = useStateOfCountry();
  const { data: cityData, isLoading } = useCityOfState(selectedStateIso.join());
  const modalizeRefSave = React.useRef<Modalize>(null);

  React.useEffect(() => {
    if (currentUser) {
      console.log('currentUser', currentUser);
      if (currentUser?.state) {
        let stateArr = currentUser?.state.split(',');

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
      if (currentUser?.state) {
        let cityArr = currentUser?.city.split(',');
        setSelectedCityItem(cityArr);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const onPressNext = async () => {
    setLoader(true);
    const result = await dispatch(
      updateLocationProfile({
        state: selectedStateItem.join(),
        city: selectedCityItem.join(),
      }),
    );
    if (updateLocationProfile.fulfilled.match(result)) {
      refetch().then();
      setTimeout(() => {
        setLoader(false);
        modalizeRefSave.current.open();
      }, 1000);

      // navigation.navigate(Route.navSetProfileAreaOfLaw);
    } else {
      setLoader(false);
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader backBtn={true} title={'Update location'} dummy={true} />

      <View style={styles.stateCityCont}>
        <ChooseItems
          disabled={stateLoading}
          title={'Choose State'}
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
        <View style={styles.selectedItmCont}>
          {selectedStateItem?.map(item => {
            return (
              <View style={styles.saveItemCont}>
                {stateData?.map(
                  ele =>
                    ele.name === item && (
                      <Text style={styles.txtSelectedItm}>{ele.name}</Text>
                    ),
                )}
                <Icon
                  name="close-circle"
                  size={20}
                  color={theme.colors.grey}
                  onPress={() => {
                    if (selectedStateItem.includes(item)) {
                      let filterArr = selectedStateItem.filter(
                        (itm: string) => itm !== item,
                      );
                      setSelectedStateItem(filterArr);
                      filterArr.length <= 0 && setSelectedCityItem([]);
                    }
                  }}
                />
              </View>
            );
          })}
        </View>
        <ChooseItems
          disabled={selectedStateItem?.length > 0 && isLoading}
          title={'Choose City'}
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
        <View style={styles.selectedItmCont}>
          {selectedCityItem?.map(item => {
            return (
              <View style={styles.saveItemCont}>
                <Text style={styles.txtSelectedItm}>{item}</Text>

                {/* {cityData?.map(ele => {
                  if (ele.name === item) {
                    return (
                      <Text style={styles.txtSelectedItm}>{ele.name}</Text>
                    );
                  }
                })} */}
                <Icon
                  name="close-circle"
                  size={20}
                  color={theme.colors.grey}
                  onPress={() => {
                    if (selectedCityItem.includes(item)) {
                      let filterArr = selectedCityItem.filter(
                        (itm: string) => itm !== item,
                      );
                      setSelectedCityItem(filterArr);
                    }
                  }}
                />
              </View>
            );
          })}
        </View>
      </View>
      <View style={styles.updateCont}>
        <CustomButton
          //   smallBtn={WIDTH - 110}
          name={'Update'}
          disabled={
            loader ||
            selectedCityItem.length < 0 ||
            selectedStateItem.length < 0
          }
          loading={loader}
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
  updateCont: {
    marginHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.m - 6,
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
  txtSelectedItm: {
    color: theme.colors.grey,
    marginHorizontal: theme.spacing.s,
  },
  selectedItmCont: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.m,
  },
}));

export default LocationUpdate;
