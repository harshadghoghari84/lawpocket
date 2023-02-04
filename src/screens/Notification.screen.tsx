import moment from 'moment';
import * as React from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// relative path
import { makeStyles, useTheme } from 'react-native-elements';
import CustomHeader from 'src/components/CustomHeader';
import { NameFirstChar } from 'src/components/NameFirstChar';
import { NoDataFound } from 'src/components/ui/NoDataFound';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useNotification } from 'src/hooks/useNotificationList';
import { notificationRead } from 'src/redux/notification/notification.thunk';

const Notification = () => {
  const styles = useStyles();

  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const [fetchMore, setFetchMore] = React.useState(0);

  const {
    data: notificationData,
    isLoading,
    refetch,
  } = useNotification('10', `${fetchMore}`);
  console.log('notificationData', notificationData);

  const onPressNotification = async (id: number, isRead: boolean) => {
    try {
      if (!isRead) {
        const result = await dispatch(notificationRead({ id: id }));

        console.log('result', result);
        if (notificationRead.fulfilled.match(result)) {
          refetch().then();
        } else {
        }
      } else {
      }
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      <CustomHeader backBtn={true} title={'Notifications'} dummy={true} />
      {notificationData?.length > 0 ? (
        <FlatList
          data={notificationData}
          contentContainerStyle={styles.flatCont}
          onEndReached={() => setFetchMore(0)}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              tintColor={theme.colors.refreshLoaderColor}
              refreshing={isLoading}
              onRefresh={() => refetch().then()}
            />
          }
          ItemSeparatorComponent={() => <View style={styles.itmSeparator} />}
          keyExtractor={(_item, index) => index.toString()}
          renderItem={({ item }) => {
            const time = moment(item?.date?.updated).fromNow();
            // const time = moment(timeFromDate * 1000).fromNow();
            const name =
              item.fromUser?.firstName && item.fromUser?.lastName
                ? `${item.fromUser?.firstName} ${item.fromUser?.lastName}`
                : item.fromUser?.firstName
                ? `${item.fromUser?.firstName}`
                : item.fromUser?.lastName
                ? `${item.fromUser?.lastName}`
                : '';
            const profilePhoto = item?.fromUser
              ? { uri: item?.fromUser?.profilePhoto } || null
              : require('src/helper/image/lpAppIcon.png');

            return (
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => onPressNotification(item.id, item.read)}
                style={[
                  styles.itmCont,
                  {
                    backgroundColor: !item.read
                      ? theme.colors.textInBgColor
                      : theme.colors.background,
                  },
                ]}
              >
                {profilePhoto ? (
                  <Image source={profilePhoto} style={styles.profileImg} />
                ) : (
                  <NameFirstChar name={name} />
                )}
                <View style={styles.txtCont}>
                  {item.title ? (
                    <Text style={styles.txtCase}>{item.title}</Text>
                  ) : null}
                  {item.body ? (
                    <Text style={styles.txtName}>{item.body}</Text>
                  ) : null}
                  <Text style={styles.txtTime}>{time}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <NoDataFound
          loading={isLoading}
          noDataIcon={
            <Image
              source={require('src/helper/image/notification.png')}
              style={styles.noDataIcons}
            />
          }
          noDataText={'No notification!'}
        />
      )}
    </View>
  );
};

export default Notification;

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors?.background,
    flex: 1,
  },
  profileImg: {
    height: 50,
    width: 50,
    borderRadius: theme.borderRadii.xl,
  },
  itmCont: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.l - 4,
    paddingVertical: theme.spacing.m - 6,
  },
  txtCase: {
    fontSize: theme.fontSize.m,
    color: theme.colors.grey,
    flexWrap: 'wrap',
  },
  txtTime: {
    fontSize: theme.fontSize.m - 2,
    color: theme.colors.grey,
    marginTop: theme.spacing.m - 6 - 5,
  },
  txtName: {
    fontSize: theme.fontSize.m,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  txtCont: {
    marginHorizontal: theme.spacing.m - 6,
  },
  flatCont: {
    flexGrow: 1,
    // marginTop: theme.spacing.l - 4,
  },
  itmSeparator: {
    borderBottomColor: theme.colors.dividerColor,
    borderBottomWidth: 0.5,
    marginHorizontal: theme.spacing.m,
  },
  noDataIcons: {
    height: 70,
    width: 70,
  },
}));
