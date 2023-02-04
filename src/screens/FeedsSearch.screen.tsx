// relative path
import * as React from 'react';
import {
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { Modalize } from 'react-native-modalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheetComments from 'src/components/BottomSheetComments';
import { Divider } from 'src/components/Divider';
import FeedsItem from 'src/components/FeedsItem';
import BackIcon from 'src/components/svg/BackIcon';
import SearchIcon from 'src/components/svg/SearchIcon';
import { NoDataFound } from 'src/components/ui/NoDataFound';
import { Route } from 'src/constants/navigationConstants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useFeedsBySearch } from 'src/hooks/useFeeds';
import { feedsLikeUnlike } from 'src/redux/feeds/feeds.thunk';
import { ThemeProps } from 'src/types/global.types';
import { BottomTabNavigationProps } from 'src/types/navigation.types';

const FeedsSearch: React.FC<BottomTabNavigationProps<Route.navFeedsSearch>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles({ insets });
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const [pauseVideo, setPauseVideo] = React.useState<boolean>(false);
  const [feedId, setFeedId] = React.useState<number>(null);
  const [feedRefetch, setRefetch] = React.useState<boolean>(null);
  const [val, setVal] = React.useState<string>('');

  const { data: FeedData, refetch, isLoading } = useFeedsBySearch(false, val);

  const modalizeCommentRef = React.useRef<Modalize>(null);

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

  // let filtered_Feeds = FeedData?.filter(item => {
  //   return (
  //     item?.userId?.firstName?.toLowerCase().indexOf(val.toLowerCase()) > -1
  //   );
  // });
  return (
    <View style={styles.cont}>
      <View style={styles.headerCont}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backCont}
        >
          <BackIcon color={theme.colors.iconColor} />
        </TouchableOpacity>
        <View style={styles.innerCreatePostCont}>
          <TextInput
            placeholder="Search feeds...."
            placeholderTextColor={theme.colors.grey}
            style={styles.textIn}
            value={val}
            onChangeText={t => setVal(t)}
          />
          <SearchIcon color={theme.colors.primary} />
        </View>
      </View>
      <Divider />
      {FeedData?.length > 0 ? (
        <FlatList
          data={FeedData}
          keyboardShouldPersistTaps={'handled'}
          bounces={false}
          keyExtractor={(_item, index) => index.toString()}
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
                admin={item.admin}
                id={item.id}
                description={item.description}
                media={item.media}
                date={item.date}
                comments={item.comments}
                likes={item.likes}
                isLiked={item.isLiked}
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
          noDataText={'No search result!'}
          noDataIcon={
            <Image
              source={require('src/helper/image/searchResult.png')}
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

export default FeedsSearch;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  cont: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: props.insets.top,
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
    marginRight: theme.spacing.m,
    backgroundColor: theme.colors.textInBgColor,
    borderRadius: theme.borderRadii.xl,
    paddingHorizontal: theme.spacing.l - 4,
  },
  DividerPvCont: { marginBottom: theme.spacing.m - 6 },
  textIn: {
    color: theme.colors.textPrimary,
    height: 50,
    flex: 1,
    borderRadius: theme.borderRadii.xl,
  },
  headerCont: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.m,
  },
  backCont: {
    padding: theme.spacing.m + 4,
  },
  noDataIcons: {
    height: 100,
    width: 100,
  },
}));
