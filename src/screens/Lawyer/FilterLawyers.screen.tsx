import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { Modalize } from 'react-native-modalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Entypo from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import BottomSheetChooseLocation from 'src/components/BottomSheetChooseLocation';
import BottomSheetPracticeArea from 'src/components/BottomSheetChoosePracticeArea';
import CustomButton from 'src/components/CustomButton';
import CustomHeader from 'src/components/CustomHeader';
import { Divider } from 'src/components/Divider';
import { WIDTH } from 'src/constants';
import { Route } from 'src/constants/navigationConstants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useAreaOfLaw } from 'src/hooks/useAreaOfLaw';
import { useStateOfCountry } from 'src/hooks/useLocation';
import { selectFilterLawyer } from 'src/redux/settings/settings.selectors';
import { selectedFilterLawyer } from 'src/redux/settings/settings.slice';
import { ThemeProps } from 'src/types/global.types';
import { MainNavigationProps } from 'src/types/navigation.types';

const FilterLawyers: React.FC<
  MainNavigationProps<Route.navFindLawyer>
> = ({}) => {
  const { state, practiceArea } = useSelector(selectFilterLawyer);
  const insets = useSafeAreaInsets();

  const styles = useStyles({ insets });
  const { theme } = useTheme();
  const { data: areaOfLawData } = useAreaOfLaw();
  const { data: stateData, isLoading: stateLoading } = useStateOfCountry();
  const dispatch = useAppDispatch();

  const navigation = useNavigation();

  const [selectedStateItem, setSelectedStateItem] = React.useState<string[]>(
    [],
  );
  const [selectedStateIso, setSelectedStateIso] = React.useState<string[]>([]);

  const modalizeRef = React.useRef<Modalize>(null);
  const modalizeStateRef = React.useRef<Modalize>(null);

  const [selectedPracticeArea, setSelectedPracticeArea] = React.useState<
    number[]
  >([]);

  React.useEffect(() => {
    if (state) {
      let stateArr = state?.split(',');
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
    if (practiceArea) {
      setSelectedPracticeArea(JSON.parse(practiceArea));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, practiceArea]);

  const onPressApply = async () => {
    dispatch(
      selectedFilterLawyer({
        state: selectedStateItem.join(),
        practiceArea:
          selectedPracticeArea.length > 0 ? `[${selectedPracticeArea}]` : null,
      }),
    );
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        backBtn={true}
        title={'Filter attorneys'}
        right={
          <TouchableOpacity
            onPress={() => {
              dispatch(
                selectedFilterLawyer({
                  state: '',
                  practiceArea: '',
                }),
              );
              navigation.goBack();
            }}
            style={styles.resetCont}
          >
            <Text style={styles.txtReset}>Reset</Text>
          </TouchableOpacity>
        }
      />
      <ScrollView
        contentContainerStyle={styles.scrollCont}
        bounces={false}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.practiceAreaCont}>
          <Text style={styles.txtPracticeArea}>Practice Areas</Text>
          <View style={styles.innerPracticeAreaCont}>
            <TouchableOpacity
              onPress={() => modalizeRef.current?.open()}
              activeOpacity={0.6}
              style={styles.addCont}
            >
              <Icon name="add-circle" size={20} color={theme.colors.primary} />
              <Text style={styles.txtAdd}>Add</Text>
            </TouchableOpacity>
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
        <Divider />
        <View style={styles.regionCont}>
          <Text style={styles.txtRegion}>Region</Text>
          <TouchableOpacity
            onPress={() => modalizeStateRef.current?.open()}
            activeOpacity={0.6}
            style={styles.selectStateCont}
          >
            <Text
              style={{
                color: theme.colors.textPrimary,
              }}
            >
              {'Select State'}
            </Text>
            {stateLoading ? (
              <ActivityIndicator color={theme.colors.primary} />
            ) : (
              <Entypo
                name="chevron-thin-right"
                size={18}
                color={theme.colors.primary}
              />
            )}
          </TouchableOpacity>
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
                      }
                    }}
                  />
                </View>
              );
            })}
          </View>
        </View>
        {/* <Divider />
        <View style={styles.rateCont}>
          <Text style={styles.txtRate}>Rate</Text>
          <RangeSlider
            style={styles.rangeSlider}
            gravity={'center'}
            min={5}
            max={50}
            step={1}
            // low={low}
            // high={high}
            // onValueChanged={(low, high) => {
            //   setLow(low);
            //   setHigh(high);
            // }}
            labelStyle="always"
            renderThumb={() => (
              <LinearGradient
                colors={[
                  theme.colors.gradientSecond,
                  theme.colors.gradientPrime,
                ]}
                style={styles.thumb}
              />
            )}
            renderRail={() => <View style={styles.rail} />}
            renderRailSelected={() => <View style={styles.railSelected} />}
            renderLabel={(text: number) => (
              <View style={styles.labelCont}>
                <Text style={styles.txtLabel}>${text}</Text>
              </View>
            )}
            renderNotch={() => <View style={styles.notch} />}
          />
        </View> */}
      </ScrollView>
      <View style={styles.bottomCont}>
        <CustomButton
          name="Cancel"
          onPress={() => navigation.goBack()}
          borderBtn={true}
          smallBtn={WIDTH / 2 - 30}
        />
        <CustomButton
          name="Apply"
          onPress={() => onPressApply()}
          smallBtn={WIDTH / 2 - 30}
        />
      </View>
      <BottomSheetPracticeArea
        modalizeRef={modalizeRef}
        stateData={areaOfLawData}
        selectedPracticeArea={selectedPracticeArea}
        setSelectedPracticeArea={setSelectedPracticeArea}
      />
      {/* <BottomSheetState
        modalizeRef={modalizeStateRef}
        stateData={stateData}
        setSelectedState={setSelectedState}
        setValue={setValue}
        value={value}
        selectedState={selectedState}
      /> */}
      <BottomSheetChooseLocation
        modalizeRef={modalizeStateRef}
        locationData={stateData}
        title={'State'}
        selectedStateItem={selectedStateItem}
        selectedStateIso={selectedStateIso}
        selectMultiple={true}
        setSelectedStateItem={setSelectedStateItem}
        setSelectedStateIso={setSelectedStateIso}
      />
    </View>
  );
};

export default FilterLawyers;

export const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    backgroundColor: theme.colors?.background,
    flex: 1,
    paddingBottom: props.insets.bottom,
  },
  practiceAreaCont: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
  },
  txtPracticeArea: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.m,
    fontWeight: '600',
    paddingBottom: theme.spacing.m - 6,
  },
  innerPracticeAreaCont: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  addCont: {
    paddingVertical: theme.spacing.s - 3,
    paddingHorizontal: theme.spacing.s,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.borderRadii.xl,
  },
  txtAdd: {
    color: theme.colors.primary,
    paddingHorizontal: theme.spacing.s,
    fontSize: theme.fontSize.m,
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
  vStateCity: {
    // width: '85%',
    marginTop: theme.spacing.m - 6,
  },
  selectStateCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.s,
  },
  scrollCont: {
    flexGrow: 1,
  },
  regionCont: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
  },
  txtRegion: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.m,
    fontWeight: '600',
    paddingBottom: theme.spacing.m - 6,
  },
  rangeSlider: { flex: 1 },
  rateCont: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
  },
  txtRate: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.m,
    fontWeight: '600',
    paddingBottom: theme.spacing.m - 6,
  },
  bottomCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.m,
    paddingBottom: theme.spacing.s,
  },
  thumb: {
    width: 30,
    height: 30,
    borderRadius: theme.borderRadii.xl,
  },
  rail: {
    flex: 1,
    height: 15,
    backgroundColor: theme.colors.textInBgColor,
    borderRadius: theme.borderRadii.xl,
  },
  railSelected: {
    height: 15,
    borderRadius: theme.borderRadii.s - 4,
  },
  labelCont: {
    alignItems: 'center',
    backgroundColor: theme.colors.transparent,
  },
  txtLabel: {
    fontSize: theme.fontSize.m,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  notch: {
    width: 8,
    height: 8,
    borderLeftColor: theme.colors.transparent,
    borderRightColor: theme.colors.transparent,
    borderTopColor: theme.colors.transparent,
  },
  txtReset: {
    color: theme.colors.textPrimary,
  },
  resetCont: {
    paddingHorizontal: theme.spacing.s + 3,
    paddingVertical: theme.spacing.s,
  },
  selectedItmCont: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginTop: theme.spacing.s,
  },
}));
