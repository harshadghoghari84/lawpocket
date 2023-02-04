import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { Modalize } from 'react-native-modalize';
import { IHandles } from 'react-native-modalize/lib/options';
import { Portal } from 'react-native-portalize';
import Entypo from 'react-native-vector-icons/Entypo';
import ModalHeader from 'src/components/BottomSheetHeader';
import { CustomTxtInput } from 'src/components/CustomTextInput';
import SearchIcon from 'src/components/svg/SearchIcon';
import { WIDTH } from 'src/constants';

export interface BottomSheetStateProps {
  modalizeRef: React.MutableRefObject<IHandles>;
  title?: string;
  stateData: { code: string; name: string }[];
  selectedState: string;
  setSelectedState: (val: string) => void;
  setValue: (val: string) => void;
  value: string;
}

const BottomSheetState: React.FC<BottomSheetStateProps> = ({
  modalizeRef,
  stateData,
  selectedState,
  setSelectedState,
  setValue,
  value,
}) => {
  const { theme } = useTheme();
  const styles = useStyles();

  let filtered_State = stateData.filter(item => {
    return item.name.toLowerCase().indexOf(value.toLowerCase()) > -1;
  });

  return (
    <Portal>
      <Modalize
        adjustToContentHeight
        ref={modalizeRef}
        disableScrollIfPossible={false}
        scrollViewProps={{
          showsVerticalScrollIndicator: false,
          bounces: false,
        }}
        handleStyle={styles.modalHandle}
        handlePosition="inside"
        // FooterComponent={() => <ModalFooter />}
        modalStyle={styles.modalStyle}
        HeaderComponent={() => (
          <View style={styles.headerComponent}>
            <ModalHeader title={'Location'} />
            <View style={styles.headerComponentTextIn}>
              <CustomTxtInput
                placeholder={'Search States'}
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
              {filtered_State.length > 0 ? (
                <>
                  {filtered_State.map((item, i) => {
                    return (
                      <TouchableOpacity
                        key={i}
                        onPress={() => {
                          setSelectedState(item.name);
                          modalizeRef.current?.close();
                        }}
                        style={styles.selectStateCont}
                      >
                        <Text
                          key={i}
                          style={{
                            color:
                              item.name === selectedState
                                ? theme.colors.black
                                : theme.colors.grey,
                          }}
                        >
                          {item.name}
                        </Text>
                        {item.name === selectedState ? (
                          <Entypo
                            name="check"
                            size={20}
                            color={theme.colors.primary}
                          />
                        ) : null}
                      </TouchableOpacity>
                    );
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

const useStyles = makeStyles(theme => ({
  modalizeCont: {
    paddingHorizontal: theme.spacing.m,
    justifyContent: 'center',
    flex: 1,
    paddingBottom: theme.spacing.l - 4,
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
}));

export default BottomSheetState;
