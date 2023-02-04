import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import Entypo from 'react-native-vector-icons/Entypo';
import { SettingItemProps } from 'src/types/common.types';

const SettingItem: React.FC<SettingItemProps> = ({
  name,
  data,
  icon,
  onPress,
  toggle,
  rightIconEnable,
  viewContainer,
}) => {
  const { theme } = useTheme();
  const styles = useStyles();
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      style={[styles.itemCont, viewContainer]}
    >
      <View style={styles.innerItmCont}>
        {icon}
        <Text style={styles.txtItemName}>{name}</Text>
      </View>
      {toggle ? (
        toggle
      ) : (
        <View style={styles.innerItmCont}>
          <Text numberOfLines={1} style={styles.txtItemData}>
            {data}
          </Text>
          {rightIconEnable && (
            <Entypo
              name="chevron-thin-right"
              size={20}
              color={theme.colors.primary}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const useStyles = makeStyles(theme => ({
  txtItemName: {
    fontSize: theme.fontSize.m,
    marginLeft: theme.spacing.m - 6,
    color: theme.colors.textPrimary,
  },
  txtItemData: {
    fontSize: theme.fontSize.m,
    marginRight: theme.spacing.m - 6,
    color: theme.colors.primary,
    maxWidth: 200,
  },
  itemCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: theme.spacing.l - 4,
    marginVertical: theme.spacing.l - 4,
  },
  innerItmCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default SettingItem;
