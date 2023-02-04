import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { Modalize } from 'react-native-modalize';
import { IHandles } from 'react-native-modalize/lib/options';
import { Portal } from 'react-native-portalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ModalHeader from 'src/components/BottomSheetHeader';
import { CustomTxtInput } from 'src/components/CustomTextInput';
import CheckIcon from 'src/components/svg/CheckIcon';
import SearchIcon from 'src/components/svg/SearchIcon';
import { HEIGHT, WIDTH } from 'src/constants';
import { UserType } from 'src/constants/constants';
import { useMeQuery } from 'src/hooks/useMeQuery';
import { ThemeProps } from 'src/types/global.types';
import { City } from 'src/types/setProfile.types';

export interface BottomSheetChooseCityProps {
  modalizeRef: React.MutableRefObject<IHandles>;
  title?: string;
  locationData: City[];
  selectedCityItem: string[];
  setSelectedCityItem: (val: string[]) => void;
}

const BottomSheetChooseCity: React.FC<BottomSheetChooseCityProps> = ({
  modalizeRef,
  title,
  locationData,
  selectedCityItem,
  setSelectedCityItem,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useStyles({ insets });
  const [value, setValue] = React.useState<string>('');
  const { data: currentUser } = useMeQuery();

  let filtered_Data = locationData?.filter((item: City) => {
    return item.name.toLowerCase().indexOf(value.toLowerCase()) > -1;
  });

  return (
    <Portal>
      <Modalize
        modalHeight={HEIGHT - 50}
        ref={modalizeRef}
        disableScrollIfPossible={false}
        scrollViewProps={{
          showsVerticalScrollIndicator: false,
          bounces: false,
        }}
        //   FooterComponent={() => <ModalFooter />}
        handleStyle={styles.modalHandle}
        handlePosition="inside"
        modalStyle={styles.modalStyle}
        HeaderComponent={() => (
          <View style={styles.headerComponent}>
            <ModalHeader title={title} />
            <View style={styles.headerComponentTextIn}>
              <CustomTxtInput
                placeholder={`Search ${title}`}
                icon={<SearchIcon color={theme.colors.primary} />}
                value={value}
                onChangeText={val => setValue(val)}
              />
            </View>
          </View>
        )}
      >
        <>
          <View style={styles.modalizeCont}>
            <View style={styles.vStateCity}>
              {filtered_Data?.length > 0 ? (
                <>
                  {filtered_Data?.map((item, i) => {
                    if (
                      currentUser?.userType === UserType.LAW_FIRM ||
                      currentUser?.userType === UserType.LEGAL_SERVICE_PROVIDER
                    ) {
                      return (
                        <TouchableOpacity
                          key={i}
                          onPress={() => {
                            if (selectedCityItem.includes(item.name)) {
                              let filterArr = selectedCityItem.filter(
                                (itm: string) => itm !== item.name,
                              );
                              setSelectedCityItem(filterArr);
                            } else {
                              setSelectedCityItem([
                                ...selectedCityItem,
                                item.name,
                              ]);
                            }
                          }}
                          style={styles.selectStateCont}
                        >
                          <Text
                            style={{
                              color: selectedCityItem.includes(item.name)
                                ? theme.colors.textPrimary
                                : theme.colors.grey,
                            }}
                          >
                            {item.name}
                          </Text>
                          {selectedCityItem.includes(item.name) ? (
                            <CheckIcon color={theme.colors.primary} />
                          ) : null}
                        </TouchableOpacity>
                      );
                    } else {
                      return (
                        <TouchableOpacity
                          key={i}
                          onPress={() => {
                            setSelectedCityItem([item.name]);
                            modalizeRef.current?.close();
                          }}
                          style={styles.selectStateCont}
                        >
                          <Text
                            key={i}
                            style={{
                              color: selectedCityItem.includes(item.name)
                                ? theme.colors.textPrimary
                                : theme.colors.grey,
                            }}
                          >
                            {item.name}
                          </Text>
                          {selectedCityItem.includes(item.name) ? (
                            <CheckIcon color={theme.colors.primary} />
                          ) : null}
                        </TouchableOpacity>
                      );
                    }
                  })}
                </>
              ) : (
                <View style={styles.noDataFoundCont}>
                  <Text style={styles.txtNoDataFound}>no data found</Text>
                </View>
              )}
            </View>
          </View>
        </>
      </Modalize>
    </Portal>
  );
};

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  modalizeCont: {
    paddingHorizontal: theme.spacing.m,
    justifyContent: 'center',
    flex: 1,
    paddingBottom: props.insets.bottom,
    backgroundColor: theme.colors.background,
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
  modalCont: {
    flex: 1,
    paddingBottom: theme.spacing.l - 4,
    paddingHorizontal: theme.spacing.m - 6,
    backgroundColor: theme.colors.background,
  },
}));

export default BottomSheetChooseCity;
