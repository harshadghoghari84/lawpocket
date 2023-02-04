import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { Modalize } from 'react-native-modalize';
import { IHandles } from 'react-native-modalize/lib/options';
import { Portal } from 'react-native-portalize';
import ModalFooter from 'src/components/BottomSheetFooter';
import { commonStyles } from 'src/screens/Authentication/Setprofile/SetProfileStyle';

export interface BottomSheetEditDeletePostProps {
  modalizeRef: React.MutableRefObject<IHandles>;

  onPressDelete?: () => void;
  onPressEdit?: () => void;
}

const BottomSheetEditDeletePost: React.FC<BottomSheetEditDeletePostProps> = ({
  modalizeRef,
  onPressDelete,
  onPressEdit,
}) => {
  const styles = useStyles();

  const { theme } = useTheme();

  const {
    modalizeCont,
    openPickerCont,
    txtModalText,
    modalDividerCont,
    modalizeCancelBtn,
    fontBold,
  } = commonStyles();

  return (
    <Portal>
      <Modalize
        adjustToContentHeight
        ref={modalizeRef}
        disableScrollIfPossible
        handleStyle={styles.modalHandleStyle}
        FooterComponent={() => <ModalFooter />}
        modalStyle={styles.modalStyle}
      >
        <>
          <View style={modalizeCont}>
            <TouchableOpacity onPress={onPressEdit} style={openPickerCont}>
              <Text style={txtModalText}>Edit</Text>
            </TouchableOpacity>
            <View style={modalDividerCont} />
            <TouchableOpacity onPress={onPressDelete} style={openPickerCont}>
              <Text style={[txtModalText, { color: theme.colors.pinkDark }]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              modalizeRef.current?.close();
            }}
            activeOpacity={0.6}
            style={modalizeCancelBtn}
          >
            <Text style={[txtModalText, fontBold]}>Cancel</Text>
          </TouchableOpacity>
        </>
      </Modalize>
    </Portal>
  );
};

const useStyles = makeStyles(theme => ({
  modalHandleStyle: { backgroundColor: theme.colors.transparent },
  modalStyle: {
    backgroundColor: theme.colors.transparent,
    elevation: 0,
    // flex: 1,
  },
  modalHeaderCont: {
    width: '100%',
    paddingHorizontal: theme.spacing.m - 6 + 5,
    paddingVertical: theme.spacing.m - 6,
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
    fontSize: theme.fontSize.l,
  },
  txtSuccess: {
    fontSize: theme.fontSize.l,
    fontWeight: '600',
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
  safeAreaView: {
    paddingBottom: theme.spacing.m - 6,
    backgroundColor: theme.colors.background,
  },
}));

export default BottomSheetEditDeletePost;
