import moment from 'moment';
import * as React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { makeStyles } from 'react-native-elements';
import { NameFirstChar } from 'src/components/NameFirstChar';
import { BlockedUserItemProps } from 'src/types/blockUser.types';

const BlockedUserItem: React.FC<BlockedUserItemProps> = ({
  id,
  date,
  forUser,
  onPress,
}) => {
  const styles = useStyles();

  const formateDate = moment(date?.updated).format('DD/MM/YYYY');
  return (
    <View key={id} style={[styles.itemCont, { flexDirection: 'column' }]}>
      <View style={styles.profCont}>
        {forUser?.profilePhoto?.length > 0 ? (
          <Image
            source={{ uri: forUser.profilePhoto }}
            style={styles.profileImg}
          />
        ) : (
          <NameFirstChar
            name={
              forUser?.firstName && forUser?.lastName
                ? `${forUser?.firstName} ${forUser?.lastName}`
                : forUser?.firstName
                ? `${forUser?.firstName}`
                : forUser?.lastName
                ? `${forUser?.lastName}`
                : ''
            }
          />
        )}

        <View style={styles.innerProfCont}>
          <View style={styles.nameTimeCont}>
            <Text style={styles.txtItemName}>
              {forUser?.firstName && forUser?.lastName
                ? `${forUser?.firstName} ${forUser?.lastName}`
                : forUser?.firstName
                ? `${forUser?.firstName}`
                : forUser?.lastName
                ? `${forUser?.lastName}`
                : ''}
            </Text>
          </View>
          <Text style={styles.txtDateCont}>{formateDate}</Text>
        </View>
        <View>
          <TouchableOpacity onPress={onPress}>
            <Text style={styles.txtUnblockedUser}>unblock</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  itemCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: theme.spacing.m - 6,
  },
  profileImg: {
    height: 50,
    width: 50,
    borderRadius: theme.borderRadii.xl,
  },
  nameTimeCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    height: 10,
    paddingLeft: theme.spacing.l - 4,
  },
  txtItemName: {
    fontSize: theme.fontSize.m + 3,
    color: theme.colors.textPrimary,
  },
  txtItemTime: {
    fontSize: theme.fontSize.m + 3,
    color: theme.colors.grey,
  },

  moreLessTxt: {
    marginTop: theme.spacing.m - 6,
    flex: 1,
  },
  profCont: {
    flexDirection: 'row',
  },
  innerProfCont: { flex: 1 },
  starCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starIcon: { marginRight: 5 },
  txtDateCont: {
    color: theme.colors.grey,
    paddingLeft: theme.spacing.l - 4,
  },
  txtUnblockedUser: {
    color: theme.colors.primary,
    paddingVertical: theme.spacing.s,
  },
}));

export default BlockedUserItem;
