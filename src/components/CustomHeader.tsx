import * as React from 'react';
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useNavigation } from '@react-navigation/native';
import BackIcon from 'src/components/svg/BackIcon';
import CloseChatIcon from 'src/components/svg/CloseChatIcon';
import { NameFirstChar } from 'src/components/NameFirstChar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeProps } from 'src/types/global.types';

export interface CustomHeaderProps {
  title?: string;
  bgc?: string;
  profileIcon?: boolean;
  backBtn?: boolean;
  dummy?: boolean;
  btnSave?: string;
  profile?: string;
  chatRight?: boolean;
  onlyHeaderTitle?: boolean;
  onPress?: () => void;
  onPressChatRight?: () => void;
  add?: boolean;
  inChat?: boolean;
  right?: React.ReactElement;
  left?: React.ReactElement;
  chatProfile?: string;
  chatUserName?: string;
  blockedUser?: boolean;
  leftSpace?: boolean;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  profileIcon,
  backBtn,
  dummy,
  bgc,
  btnSave,
  profile,
  chatRight,
  onPress,
  onlyHeaderTitle,
  onPressChatRight,
  add,
  right,
  inChat,
  chatProfile,
  chatUserName,
  blockedUser,
  leftSpace,
  left,
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const styles = useStyles({ insets });
  const { theme } = useTheme();
  return (
    <View style={[styles.container, bgc && { backgroundColor: bgc }]}>
      {profileIcon && (
        <MaterialCommunityIcons
          name="account-circle"
          size={25}
          color={theme.colors.grey}
        />
      )}
      {left && left}
      {leftSpace && <View style={styles.dummyView} />}
      {backBtn && (
        <View style={styles.chatWithBackCont}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <BackIcon color={theme.colors.iconColor} />
          </TouchableOpacity>
          {inChat && (
            <TouchableOpacity
              activeOpacity={1}
              onPress={onPress}
              style={styles.titProfileCont}
            >
              {chatProfile ? (
                <Image
                  source={{ uri: chatProfile }}
                  style={styles.imgProfile}
                />
              ) : (
                <NameFirstChar
                  name={chatUserName}
                  size={35}
                  style={styles.nameCharCont}
                />
              )}
              <View style={styles.chatWithProfileNameCont}>
                <Text style={styles.txtTitle}>{chatUserName}</Text>
                {blockedUser && <Text style={styles.txtBlock}>Blocked</Text>}
              </View>
            </TouchableOpacity>
          )}
        </View>
      )}
      {onlyHeaderTitle && <View style={styles.dummyView} />}

      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        style={styles.titProfileCont}
      >
        {profile && (
          <Image source={{ uri: profile }} style={styles.imgProfile} />
        )}
        <Text numberOfLines={1} style={styles.txtTitle}>
          {title}
        </Text>
      </TouchableOpacity>
      {btnSave && (
        <Text onPress={onPress} style={styles.txtSave}>
          {btnSave}
        </Text>
      )}
      {add && (
        <Text onPress={onPress} style={styles.txtSave}>
          {'Add'}
        </Text>
      )}
      {right && right}
      {chatRight && (
        <TouchableOpacity onPress={onPressChatRight} style={styles.closeCont}>
          <CloseChatIcon color={theme.colors.pinkDark} />
        </TouchableOpacity>
      )}
      {onlyHeaderTitle && <View style={styles.dummyView} />}

      {dummy && <View style={styles.dummyView} />}
    </View>
  );
};

export default CustomHeader;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    // height: 50,
    backgroundColor: theme.colors?.background,
    // backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: theme.colors.headerBottomLineColor,
    borderBottomWidth: Platform.OS === 'ios' ? 0.5 : 1,
    paddingHorizontal: theme.spacing.m,
    paddingTop: props.insets.top + theme.spacing.s,
    paddingBottom: theme.spacing.s,
  },
  txtTitle: {
    fontWeight: '500',
    fontSize: theme.fontSize.m + 4,
    color: theme.colors.textPrimary,
  },
  txtSave: {
    fontWeight: '500',
    color: theme.colors.primary,
    paddingVertical: theme.spacing.s,
  },
  dummyView: { width: theme.spacing.m + theme.spacing.s + 3 },
  closeCont: { width: 20 },
  imgProfile: {
    height: 30,
    width: 30,
    borderRadius: theme.borderRadii.l,
    marginRight: theme.spacing.s,
  },
  titProfileCont: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing.s,
  },
  backBtn: {
    // height: 30,
    // width: 30,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.s + 3,
    paddingVertical: theme.spacing.s,
  },
  chatWithBackCont: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtBlock: {
    color: theme.colors.textPrimary,
  },
  chatWithProfileNameCont: {
    flexDirection: 'column',
  },
  nameCharCont: {
    marginRight: theme.spacing.s,
  },
}));
