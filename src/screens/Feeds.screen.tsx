// relative path
import * as React from 'react';
import { FlatList, Image, Platform, RefreshControl, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { Modalize } from 'react-native-modalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheetComments from 'src/components/BottomSheetComments';
import { Divider } from 'src/components/Divider';
import FeedCreate from 'src/components/FeedCreate';
import FeedsItem from 'src/components/FeedsItem';
import { NoDataFound } from 'src/components/ui/NoDataFound';
import { Route } from 'src/constants/navigationConstants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useFeeds } from 'src/hooks/useFeeds';
import { useMeQuery } from 'src/hooks/useMeQuery';
import { feedsLikeUnlike } from 'src/redux/feeds/feeds.thunk';
import { ThemeProps } from 'src/types/global.types';
import { BottomTabNavigationProps } from 'src/types/navigation.types';

const Feeds: React.FC<BottomTabNavigationProps<Route.navFeeds>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles({ insets });
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const [pauseVideo, setPauseVideo] = React.useState<boolean>(false);
  const [feedId, setFeedId] = React.useState<number>(null);
  const [feedRefetch, setRefetch] = React.useState<boolean>(null);

  const { data: currentUser } = useMeQuery();
  const { data: FeedData, refetch, isLoading } = useFeeds();

  const modalizeCommentRef = React.useRef<Modalize>(null);

  const name =
    currentUser?.firstName && currentUser?.lastName
      ? `${currentUser?.firstName} ${currentUser?.lastName}`
      : currentUser?.firstName
      ? `${currentUser?.firstName}`
      : currentUser?.lastName
      ? `${currentUser?.lastName}`
      : '';

  const profilePhoto = currentUser?.profilePhoto
    ? currentUser?.profilePhoto
    : '';

  React.useEffect(() => {
    if (feedRefetch) {
      refetch().then();
      setRefetch(false);
    }
  }, [feedRefetch, refetch]);

  const onPressLike = async (id: number) => {
    try {
      const result = await dispatch(feedsLikeUnlike({ feedId: id }));
      if (feedsLikeUnlike.fulfilled.match(result)) {
        refetch().then();
        // modalizeSaveRef.current?.open();
      } else {
      }
    } catch (error) {}
  };

  const onPressComment = (id: number) => {
    setFeedId(id);
    modalizeCommentRef.current.open();
  };

  return (
    <View style={styles.mainCont}>
      <FeedCreate
        profile={profilePhoto}
        name={name}
        onPress={() => navigation.navigate(Route.navCreatePost)}
      />
      <Divider />
      {FeedData?.length > 0 ? (
        <FlatList
          data={FeedData}
          keyExtractor={(_item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              tintColor={theme.colors.refreshLoaderColor}
              refreshing={isLoading}
              onRefresh={() => refetch().then()}
            />
          }
          ItemSeparatorComponent={() => (
            <View style={styles.DividerPvCont}>
              <Divider />
            </View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollCont}
          renderItem={({ item }) => {
            return (
              <FeedsItem
                user={item.user}
                id={item.id}
                description={item.description}
                media={item.media}
                date={item.date}
                comments={item.comments}
                likes={item.likes}
                isLiked={item.isLiked}
                admin={item.admin}
                setPauseVideo={setPauseVideo}
                pauseVideo={pauseVideo}
                onPressLike={() => onPressLike(item.id)}
                onPressComment={() => onPressComment(item.id)}
              />
            );
          }}
        />
      ) : (
        <NoDataFound
          loading={isLoading}
          noDataText={'No feeds!'}
          noDataIcon={
            <Image
              source={require('src/helper/image/noFeeds.png')}
              style={styles.noDataIcons}
            />
          }
        />
      )}
      <BottomSheetComments
        modalizeRef={modalizeCommentRef}
        title="Comments"
        id={feedId}
        setRefetch={setRefetch}
      />
    </View>
  );
};

export default Feeds;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  mainCont: {
    flex: 1,
    backgroundColor: theme.colors.background,
    // paddingTop: props.insets.top,
    paddingBottom: props.insets.bottom,
  },
  DividerCont: {
    backgroundColor: theme.colors.textInBgColor,
    height: 10,
    width: '100%',
  },
  scrollCont: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    paddingBottom:
      Platform.OS === 'ios' ? theme.spacing.l * 4 : theme.spacing.l * 3,
  },
  profileImg: {
    height: 50,
    width: 50,
    borderRadius: theme.borderRadii.xl,
  },
  createPostCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: theme.spacing.l - 4,
    marginVertical: theme.spacing.l - 4,
  },
  innerCreatePostCont: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    marginHorizontal: theme.spacing.l - 4,
    backgroundColor: theme.colors.textInBgColor,
    borderRadius: theme.borderRadii.xl,
    paddingHorizontal: theme.spacing.l - 4,
  },
  DividerPvCont: { marginBottom: theme.spacing.m - 6 },
  textIn: {
    color: theme.colors.black,
  },
  noDataIcons: {
    height: 70,
    width: 70,
  },
}));
