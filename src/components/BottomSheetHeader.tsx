import React from 'react';
import { Image, Text, View } from 'react-native';
import { makeStyles } from 'react-native-elements';

// relative path

interface ModalHeaderProps {
  profile?: string;
  title?: string;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ profile, title }) => {
  const styles = useStyles();

  return (
    <View style={styles.headerQrModal}>
      {/* <TouchableOpacity
        activeOpacity={0.6}
        style={styles.closeButton}
        onPress={() => modalizeRef.current?.close()}
      >
        <CloseIcon color={theme.colors.grey} height={16} width={16} />
      </TouchableOpacity> */}
      <View style={styles.qrModalDummyView} />

      <View style={styles.headerTimerNameProfile}>
        {profile && (
          <Image
            source={{
              uri: profile,
            }}
            style={styles.imgHeader}
          />
        )}
        <Text style={styles.txtQrCode}>{title}</Text>
      </View>
      <View style={styles.qrModalDummyView} />
    </View>
  );
};

export default ModalHeader;

const useStyles = makeStyles(theme => ({
  modalHandle: { backgroundColor: theme.colors.transparent },
  headerQrModal: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: theme.spacing.m - 6 + 5,
    paddingVertical: theme.spacing.m - 6 + 5,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadii.l - 5,
    borderTopRightRadius: theme.borderRadii.l - 5,
  },
  txtQrCode: {
    fontSize: theme.fontSize.m + 2,
    fontWeight: '500',
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.s,
  },
  qrModalDummyView: {
    width: 30,
  },
  qrModalCont: {
    backgroundColor: theme.colors.background,
    paddingBottom: theme.spacing.l - 4,
    flex: 1,
  },
  headerTimerNameProfile: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  imgHeader: {
    height: 30,
    width: 30,
    borderRadius: theme.borderRadii.xl,
    marginRight: theme.spacing.m - 6,
  },
  txtTimePeriod: {
    color: theme.colors.textPrimary,
  },
  closeButton: {
    padding: theme.spacing.s,
  },
}));
