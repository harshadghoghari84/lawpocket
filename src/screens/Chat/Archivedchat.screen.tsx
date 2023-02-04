import * as React from 'react';
import { FlatList, Image, Platform, RefreshControl, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import ChatItem from 'src/components/ChatItem';
import { NoDataFound } from 'src/components/ui/NoDataFound';
import { Route } from 'src/constants/navigationConstants';
import { useInActiveChats } from 'src/hooks/useChats';
import { ChatTopTabNavigationProps } from 'src/types/navigation.types';

const ArchivedChat: React.FC<
  ChatTopTabNavigationProps<Route.navArchivedChat>
> = ({ navigation }) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const [fetchMore, setFetchMore] = React.useState(0);

  const {
    data: ChatList,
    isLoading,
    refetch,
    isPreviousData,
  } = useInActiveChats(true, '10', `${fetchMore}`);

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

  //           let blockedUserList: users[] = [];
  //           finalUserList.filter((itm: users) => {
  //             if (itm.chatClosed) {
  //               blockedUserList.push(itm);
  //             }
  //           });

  //           let onlyHaveChatUserList: users[] = [];

  //           blockedUserList.filter((itm: users) => {
  //             if (itm.latestMessage) {
  //               onlyHaveChatUserList.push(itm);
  //             }
  //           });

  //           setUserList(onlyHaveChatUserList);
  //           setLoading(false);
  //         },
  //       });
  //   };

  //   navigation.addListener('focus', () => {
  //     listUsers().then();
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [navigation]);

  return (
    <View style={styles.container}>
      {ChatList?.data?.length > 0 ? (
        <FlatList
          data={ChatList?.data}
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
            return <ChatItem item={item} closedChat={true} />;
          }}
        />
      ) : (
        <NoDataFound
          loading={isLoading}
          noDataText={'No inactive chat!'}
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

export default ArchivedChat;
