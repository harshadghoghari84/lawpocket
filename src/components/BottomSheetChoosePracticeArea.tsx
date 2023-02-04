import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { Modalize } from 'react-native-modalize';
import { IHandles } from 'react-native-modalize/lib/options';
import { Portal } from 'react-native-portalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ModalHeader from 'src/components/BottomSheetHeader';
import CheckIcon from 'src/components/svg/CheckIcon';
import { WIDTH } from 'src/constants';
import { commonStyles } from 'src/screens/Authentication/Setprofile/SetProfileStyle';
import { ThemeProps } from 'src/types/global.types';
import { GetAreaOfLawProps } from 'src/types/setProfile.types';

export interface BottomSheetPracticeAreaProps {
  modalizeRef: React.MutableRefObject<IHandles>;
  title?: string;
  stateData: GetAreaOfLawProps[];
  selectedPracticeArea: number[];
  setSelectedPracticeArea: (val: number[]) => void;
}

const BottomSheetPracticeArea: React.FC<BottomSheetPracticeAreaProps> = ({
  modalizeRef,
  stateData,
  selectedPracticeArea,
  setSelectedPracticeArea,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const styles = useStyles({ insets });
  const commonStyle = commonStyles();

  return (
    <Portal>
      <Modalize
        adjustToContentHeight
        ref={modalizeRef}
        scrollViewProps={{
          showsVerticalScrollIndicator: false,
          bounces: false,
        }}
        handlePosition="inside"
        handleStyle={commonStyle.modalHandleStyle}
        HeaderComponent={() => <ModalHeader title="Area of Law" />}
      >
        <>
          <View style={styles.modalCont}>
            <View style={styles.vStateCity}>
              {stateData?.map((item, i) => {
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      if (selectedPracticeArea.includes(item.id)) {
                        let filterArr = selectedPracticeArea.filter(
                          (itm: number) => itm !== item.id,
                        );
                        setSelectedPracticeArea(filterArr);
                      } else {
                        setSelectedPracticeArea([
                          ...selectedPracticeArea,
                          item.id,
                        ]);
                      }
                    }}
                    style={styles.selectStateCont}
                  >
                    <Text
                      style={{
                        color: selectedPracticeArea.includes(item.id)
                          ? theme.colors.textPrimary
                          : theme.colors.grey,
                      }}
                    >
                      {item.label}
                    </Text>
                    {selectedPracticeArea.includes(item.id) ? (
                      <CheckIcon color={theme.colors.primary} />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
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
  modalCont: {
    flex: 1,
    paddingBottom: props.insets.bottom,
    paddingHorizontal: theme.spacing.m - 6,
    backgroundColor: theme.colors.background,
  },
}));

export default BottomSheetPracticeArea;
