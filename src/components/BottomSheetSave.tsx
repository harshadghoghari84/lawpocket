import * as React from 'react';
import { Platform, Text, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { Modalize } from 'react-native-modalize';
import { IHandles } from 'react-native-modalize/lib/options';
import { Portal } from 'react-native-portalize';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ModalHeader from 'src/components/BottomSheetHeader';
import { HEIGHT } from 'src/constants';

export interface BottomSheetSaveProps {
  modalizeRef: React.MutableRefObject<IHandles>;
  title: string;
  activeRating?: boolean;
}

const BottomSheetSave: React.FC<BottomSheetSaveProps> = ({
  modalizeRef,
  title,
}) => {
  const { theme } = useTheme();
  const styles = useStyles();

  return (
    <Portal>
      <Modalize
        adjustToContentHeight={true}
        ref={modalizeRef}
        disableScrollIfPossible={false}
        scrollViewProps={{
          showsVerticalScrollIndicator: false,
          bounces: false,
        }}
        handlePosition={'inside'}
        handleStyle={styles.modalHandleStyle}
        HeaderComponent={() => <ModalHeader />}
      >
        <>
          <View style={styles.modalCont}>
            <View style={styles.markCont}>
              <FontAwesome5
                name="check"
                size={60}
                color={theme.colors.primary}
              />
            </View>
            <Text style={styles.txtSuccess}>Success!</Text>
            <Text style={styles.txtTitle}>{title}</Text>
          </View>
        </>
      </Modalize>
    </Portal>
  );
};

const useStyles = makeStyles(theme => ({
  safeAreaView: {
    paddingBottom: theme.spacing.m - 6,
    backgroundColor: theme.colors.background,
  },
  modalCont: {
    alignItems: 'center',
    justifyContent: 'center',
    height: HEIGHT / 1.5,
    backgroundColor: theme.colors.background,
  },
  modalContRating: {
    // height: HEIGHT / 1.4,
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? theme.spacing.m : null,
  },
  secondRateCont: { flex: 1, marginHorizontal: theme.spacing.l - 4 },
  modalHandleStyle: { backgroundColor: theme.colors.modalHandleColor },
  modalHeaderCont: {
    height: 50,
    width: '100%',
    paddingHorizontal: theme.spacing.m - 6 + 5,
    paddingVertical: theme.spacing.m - 6,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadii.l - 5,
    borderTopRightRadius: theme.borderRadii.l - 5,
  },
  modalCloseCont: {
    height: 50,
    width: 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  txtTitle: {
    color: theme.colors.grey,
    marginTop: theme.spacing.l - 4,
    fontSize: theme.fontSize.m + 2,
  },
  txtSuccess: {
    fontSize: theme.fontSize.l,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  txtNameAttorney: {
    fontSize: theme.fontSize.m + 3,
    fontWeight: '600',
    marginTop: theme.spacing.m,
    color: theme.colors.textPrimary,
  },
  markCont: {
    height: 100,
    width: 100,
    borderRadius: theme.borderRadii.l + 50,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.spacing.l - 4,
  },
  txtRateAttorney: {
    fontSize: theme.fontSize.m + 3,
    fontWeight: '500',
    color: theme.colors.textPrimary,
  },
  dummyView: { width: 50 },
  imageCont: {
    borderRadius: theme.borderRadii.xxl + 50,
    height: 140,
    width: 140,
    resizeMode: 'cover',
  },
  nameProfileRateCont: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  txtWriteReview: {
    fontSize: theme.fontSize.m,
    fontWeight: '500',
    marginVertical: theme.spacing.m - 6,
    color: theme.colors.textPrimary,
  },
  textInCont: {
    height: 150,
    borderRadius: theme.borderRadii.m,
    borderWidth: 1,
    borderColor: theme.colors.grey,
    padding: theme.spacing.m,
  },
  bottomBtnCont: { marginVertical: theme.spacing.s },
  txtAndTextInCont: { flex: 1 },
}));

export default BottomSheetSave;
