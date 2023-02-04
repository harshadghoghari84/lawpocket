import * as React from 'react';
import { FlatList, Image, Platform, RefreshControl, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import ChatItem from 'src/components/ChatItem';
import { NoDataFound } from 'src/components/ui/NoDataFound';
import { Route } from 'src/constants/navigationConstants';
import { useActiveChats } from 'src/hooks/useChats';
import { ChatTopTabNavigationProps } from 'src/types/navigation.types';

const ActiveChat: React.FC<ChatTopTabNavigationProps<Route.navActiveChat>> = ({
  navigation,
}) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const [fetchMore, setFetchMore] = React.useState(0);

  const {
    data: ChatList,
    isLoading,
    refetch,
    isPreviousData,
  } = useActiveChats(false, '10', `${fetchMore}`);

  React.useEffect(() => {
    navigation.addListener('focus', () => {
      refetch().then();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  // React.useEffect(() => {
  //   const listUsers = async () => {
  //     setLoading(true);

  //     firestore()
  //       .collection('Users')
  //       // .get()
  //       .onSnapshot({
  //         error: e => console.log('e :', e),
  //         next: querySnapshot => {
  //           let totUser: users[] = [];
  //           querySnapshot.docs.forEach(documentSnapshot => {
  //             documentSnapshot.data().user.map((flt: users) => {
  //               if (flt.id === currentUser?.id) {
  //                 totUser.push(...documentSnapshot.data().user);
  //               }
  //             });
  //           });
  //           let finalUserList: users[] = [];
  //           totUser.filter((itm: users) => {
  //             if (itm.id !== currentUser?.id) {
  //               finalUserList.push(itm);
  //             }
  //           });

  //           // let notBlockedUserList: users[] = [];
  //           // finalUserList.filter((itm: users) => {
  //           //   if (!itm.chatClosed) {
  //           //     notBlockedUserList.push(itm);
  //           //   }
  //           // });

  //           console.log('finalUserList', finalUserList);
  //           // let onlyHaveChatUserList: users[] = [];

  //           finalUserList?.map((itm: users) => {
  //             if (itm?.latestMessage) {
  //               // console.log('itm', itm);
  //               ChatList?.map(item => {
  //                 if (item.id === itm.id) {
  //                   console.log('item', item);
  //                   setUserList([
  //                     ...ChatList,
  //                     { latestMessage: itm.latestMessage },
  //                   ]);
  //                 }
  //               });
  //               // onlyHaveChatUserList.push(itm);
  //             }
  //           });
  //           // setUserList(onlyHaveChatUserList);
  //           // setLoading(false);
  //         },
  //       });
  //   };

  //   // navigation.addListener('focus', () => {
  //   //   listUsers().then();
  //   // });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [navigation]);

  return (
    <View style={styles.container}>
      {ChatList?.data?.length > 0 ? (
        <FlatList
          data={ChatList?.data}
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyExtractor={(_item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              tintColor={theme.colors.refreshLoaderColor}
              refreshing={isLoading}
              onRefresh={() => refetch().then()}
            />
          }
          onEndReached={() => {
            if (!isPreviousData && ChatList?.count > ChatList?.data?.length) {
              setFetchMore(old => old + 1);
            }
          }}
          ItemSeparatorComponent={() => <View style={styles.itmSeparator} />}
          contentContainerStyle={styles.scrollContStyle}
          renderItem={({ item }) => {
            return <ChatItem item={item} closedChat={false} />;
          }}
        />
      ) : (
        <NoDataFound
          loading={isLoading}
          noDataText={'No active chat!'}
          noDataIcon={
            <Image
              source={require('src/helper/image/noChats.png')}
              style={styles.noDataIcons}
            />
          }
        />
      )}
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  scrollContStyle: {
    flexGrow: 1,
    paddingTop: theme.spacing.s,
    paddingBottom:
      Platform.OS === 'ios' ? theme.spacing.l * 4 : theme.spacing.l * 3,
    backgroundColor: theme.colors.background,
  },
  itmSeparator: {
    backgroundColor: theme.colors.primaryLight,
    height: 0.5,
  },
  noDataIcons: {
    height: 70,
    width: 70,
  },
}));

export default ActiveChat;
