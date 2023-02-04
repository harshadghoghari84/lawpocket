import * as React from 'react';
import { FlatList, Image, RefreshControl, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { Modalize } from 'react-native-modalize';
import BottomSheetComments from 'src/components/BottomSheetComments';
import BottomSheetEditDeletePost from 'src/components/BottomSheetEditDeletePost';
import CustomHeader from 'src/components/CustomHeader';
import { Divider } from 'src/components/Divider';
import FeedsItem from 'src/components/FeedsItem';
import { NoDataFound } from 'src/components/ui/NoDataFound';
import { Route } from 'src/constants/navigationConstants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useMyFeeds } from 'src/hooks/useFeeds';
import { feedsDelete, feedsLikeUnlike } from 'src/redux/feeds/feeds.thunk';
import {
  setIsDraftPost,
  setSelectedFeedId,
} from 'src/redux/settings/settings.slice';
import { MainNavigationProps } from 'src/types/navigation.types';

const MyFeeds: React.FC<MainNavigationProps<Route.navMyFeeds>> = ({
  navigation,
}) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const [pauseVideo, setPauseVideo] = React.useState<boolean>(false);
  const [feedId, setFeedId] = React.useState<number>(null);
  const [feedRefetch, setRefetch] = React.useState<boolean>(null);
  const [selectedPostId, setSelectedPostId] = React.useState<number>(null);
  const [isDraftPostSelected, setIsDraftPostSelected] =
    React.useState<boolean>(false);

  const { data: MyFeedData, refetch, isLoading } = useMyFeeds(true);

  console.log('MyFeedData', MyFeedData);

  const modalizeCommentRef = React.useRef<Modalize>(null);
  const modalizeRef = React.useRef<Modalize>(null);

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

  const onPressDelete = async () => {
    try {
      const result = await dispatch(feedsDelete({ id: selectedPostId }));

      console.log('result', result);
      if (feedsDelete.fulfilled.match(result)) {
        refetch().then();
        modalizeRef.current.close();
      } else {
      }
    } catch (error) {}
  };

  const onPressEdit = (id: number, isDraft: boolean) => {
    setIsDraftPostSelected(isDraft);
    setSelectedPostId(id);
    modalizeRef.current.open();
  };

  return (
    <View style={styles.mainCont}>
      <CustomHeader backBtn={true} title={'My Feeds'} dummy={true} />
      <>
        {MyFeedData?.length > 0 ? (
          <FlatList
            data={MyFeedData}
            // ListHeaderComponent={() => (
            //   <>
            //     <FeedCreate
            //       profile={profilePhoto}
            //       name={name}
            //       onPress={() => navigation.navigate(Route.navCreatePost)}
            //     />
            //     <Divider />
            //   </>
            // )}
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
                  edit={true}
                  user={item.user}
                  id={item.id}
                  description={item.description}
                  media={item.media}
                  date={item.date}
                  comments={item.comments}
                  likes={item.likes}
                  isLiked={item.isLiked}
                  admin={item.admin}
                  isDraft={item.isDraft}
                  setPauseVideo={setPauseVideo}
                  pauseVideo={pauseVideo}
                  onPressLike={() => onPressLike(item.id)}
                  onPressComment={() => onPressComment(item.id)}
                  onPressEdit={() => onPressEdit(item.id, item.isDraft)}
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

        <BottomSheetEditDeletePost
          modalizeRef={modalizeRef}
          onPressEdit={() => {
            dispatch(setSelectedFeedId(selectedPostId));
            dispatch(setIsDraftPost(isDraftPostSelected));
            modalizeRef.current.close();
            navigation.navigate({
              name: Route.navEditPost as never,
              params: {} as never,
            });
          }}
          onPressDelete={() => onPressDelete()}
        />
      </>
    </View>
  );
};

export default MyFeeds;

const useStyles = makeStyles(theme => ({
  mainCont: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  DividerCont: {
    backgroundColor: theme.colors.textInBgColor,
    height: 10,
    width: '100%',
  },
  scrollCont: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
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
