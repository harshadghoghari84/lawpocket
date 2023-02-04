import * as React from 'react';
import { useEffect, useState } from 'react';
import { FlatList, Image, RefreshControl, Text, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import BlockedUserItem from 'src/components/BlockedUserItem';
import CustomHeader from 'src/components/CustomHeader';
import { Divider } from 'src/components/Divider';
import { NoDataFound } from 'src/components/ui/NoDataFound';
import { Route } from 'src/constants/navigationConstants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useBlockedUsers } from 'src/hooks/useBlockedUserList';
import { unBlockUser } from 'src/redux/blockUser/blockUser.thunk';
import { MainNavigationProps } from 'src/types/navigation.types';

const BlockedUser: React.FC<MainNavigationProps<Route.navBlockedUser>> = () => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { data, refetch, isLoading, isRefetching } = useBlockedUsers();
  const dispatch = useAppDispatch();

  const [refreshing, setRefreshing] = useState(false);

  const onPress = async (forUser: number) => {
    const result = await dispatch(
      unBlockUser({
        forUser: forUser,
      }),
    );

    if (unBlockUser.fulfilled.match(result)) {
      // updateUser(forUser);
      refetch().then();
    } else {
    }
  };

  const pullToRefreshData = () => {
    setRefreshing(true);
  };

  useEffect(() => {
    if (!isRefetching && refreshing) {
      setTimeout(() => setRefreshing(false), 1000);
    }
  }, [refreshing, isRefetching]);

  // const updateUser = (forUser: number) => {
  //   let chatId =
  //     currentUser?.userType === UserType.CLIENT ||
  //     currentUser?.userType === UserType.LAW_STUDENT
  //       ? `${currentUser?.id}-${forUser}`
  //       : `${forUser}-${currentUser?.id}`;

  //   let userUpdt: { user: users[] } = {
  //     user: [],
  //   };

  //   firestore()
  //     .collection('Users')
  //     .doc(chatId)
  //     .get()
  //     .then(querySnapshot => {
  //       querySnapshot.data().user.map((flt: any) => {
  //         userUpdt.user.push({ ...flt, blockedUser: false });
  //       });
  //       firestore()
  //         .collection('Users')
  //         .doc(chatId)
  //         .set(userUpdt, { merge: true })
  //         .then(() => {
  //           console.log('userUnblock');
  //         });
  //     });
  // };
  return (
    <View style={styles.container}>
      <CustomHeader backBtn={true} title={'Blocked users'} dummy={true} />
      <View style={styles.reviewCont}>
        <Text style={styles.txtReviews}>
          Blocked{' '}
          <Text style={styles.txtInnerReviews}>{`(${
            data ? data?.length : 0
          })`}</Text>
        </Text>
      </View>
      {data?.length > 0 ? (
        <FlatList
          data={data}
          ItemSeparatorComponent={() => <Divider style={styles.divider} />}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              tintColor={theme.colors.refreshLoaderColor}
              onRefresh={pullToRefreshData}
            />
          }
          keyExtractor={(_item, index) => index.toString()}
          contentContainerStyle={styles.scrollCont}
          renderItem={({ item }) => {
            return (
              <View style={styles.reviewItmCont}>
                <BlockedUserItem
                  date={item.date}
                  forUser={item.forUser}
                  id={item.id}
                  onPress={() => onPress(item?.forUser?.id)}
                />
              </View>
            );
          }}
        />
      ) : (
        <NoDataFound
          loading={isLoading}
          noDataText={'No blocked users!'}
          noDataIcon={
            <Image
              source={require('src/helper/image/noData.png')}
              style={styles.noDataIcons}
            />
          }
        />
      )}
    </View>
  );
};

export default BlockedUser;

export const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors?.background,
    flex: 1,
  },
  scrollCont: { flexGrow: 1 },
  DividerCont: {
    backgroundColor: theme.colors.textInBgColor,
    height: 10,
    width: '100%',
  },
  reviewItmCont: {
    paddingHorizontal: theme.spacing.l - 4,
    paddingVertical: theme.spacing.m - 6,
  },
  reviewCont: {
    marginLeft: theme.spacing.l - 4,
    marginTop: theme.spacing.l - 4,
  },
  txtReviews: {
    fontSize: theme.fontSize.m + 3,
    fontWeight: '500',
    marginVertical: theme.spacing.s - 5,
    color: theme.colors.textPrimary,
  },
  txtInnerReviews: {
    color: theme.colors.grey,
  },
  divider: {
    height: 1,
  },
  noDataIcons: {
    height: 70,
    width: 70,
  },
}));
