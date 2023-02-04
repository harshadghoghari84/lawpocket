import * as React from 'react';
import { Text, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { Modalize } from 'react-native-modalize';
import { IHandles } from 'react-native-modalize/lib/options';
import { Portal } from 'react-native-portalize';
import UserIcon from 'src/components/svg/UserIcon';

export interface BottomSheetUpdateEmailProps {
  modalizeRef: React.MutableRefObject<IHandles>;
  children?: React.ReactNode;
}

const BottomSheetUpdateEmail: React.FC<BottomSheetUpdateEmailProps> = ({
  modalizeRef,
  children,
}) => {
  const styles = useStyles();
  const { theme } = useTheme();
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
        handlePosition="inside"
        handleStyle={styles.modalHandleStyle}
      >
        <View style={styles.modalItmCont}>
          <View style={styles.modalCont}>
            <View style={styles.vLockResetPass}>
              <UserIcon color={theme.colors.primary} height={40} width={40} />
            </View>
            <Text style={styles.txtResetPass}>Upload Email</Text>
            <Text style={styles.txtResetPass2}>Please enter your email</Text>
          </View>
        </View>
        <View style={styles.modalChildrenCont}>
          <View style={styles.modalTextInCont}>{children}</View>
        </View>
      </Modalize>
    </Portal>
  );
};

const useStyles = makeStyles(theme => ({
  modalCont: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  modalHandleStyle: { backgroundColor: theme.colors.modalHandleColor },
  textInCont: {
    height: 150,
    borderRadius: theme.borderRadii.m,
    borderWidth: 1,
    borderColor: theme.colors.grey,
    padding: theme.spacing.m,
  },
  modalItmCont: {
    justifyContent: 'center',
    paddingBottom: theme.spacing.m - 6,
    paddingHorizontal: theme.spacing.l,
    flex: 1,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadii.l - 5,
    borderTopRightRadius: theme.borderRadii.l - 5,
  },
  modalChildrenCont: {
    justifyContent: 'center',
    paddingBottom: theme.spacing.m - 6,
    paddingHorizontal: theme.spacing.l,
    flex: 1,
    backgroundColor: theme.colors.background,
    // borderTopLeftRadius: theme.borderRadii.l - 5,
    // borderTopRightRadius: theme.borderRadii.l - 5,
  },
  modalTextInCont: { marginTop: theme.spacing.m - 6 },
  vLockResetPass: {
    height: 100,
    width: 100,
    borderRadius: theme.borderRadii.xxl,
    backgroundColor: theme.colors.textInBgColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.l - 4,
  },
  txtResetPass: {
    fontSize: theme.fontSize.l,
    marginVertical: theme.spacing.l - 4,
    color: theme.colors.textPrimary,
  },
  txtResetPass2: {
    fontSize: theme.fontSize.m,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginHorizontal: theme.spacing.l - 4,
    lineHeight: theme.spacing.l,
  },
}));

export default BottomSheetUpdateEmail;
