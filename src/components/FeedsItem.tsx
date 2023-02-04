// @ts-ignore
import InViewPort from '@coffeebeanslabs/react-native-inviewport';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import * as React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import Lightbox from 'react-native-lightbox-v2';
// @ts-ignore
import Carousel from 'react-native-looped-carousel';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';
import MoreLessText from 'src/components/MoreLessText';
import { NameFirstChar } from 'src/components/NameFirstChar';
import { WIDTH } from 'src/constants';
import { Route } from 'src/constants/navigationConstants';
import { useMeQuery } from 'src/hooks/useMeQuery';
import { feedsProps } from 'src/types/feed.types';

const FeedsItem: React.FC<feedsProps> = ({
  pauseVideo,
  setPauseVideo,
  edit,
  id,
  user,
  likes,
  comments,
  date,
  media,
  description,
  onPressLike,
  isLiked,
  onPressComment,
  onPressEdit,
  admin,
  isDraft,
}) => {
  const styles = useStyles();
  const videoRef = React.useRef();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { data: currentUser } = useMeQuery();

  const [currentImgIndex, setCurrentImgIndex] = React.useState<number>(1);
  const [visiblePaused, setVisiblePaused] = React.useState<boolean>(false);
  const [time, setTime] = React.useState<string>('');
  const [loaded, setLoaded] = React.useState<boolean>(true);

  const onViewRef = React.useRef(
    (info: { viewableItems: Array<ViewToken>; changed: Array<ViewToken> }) => {
      setCurrentImgIndex(info.viewableItems[0]?.index + 1);
    },
  );

  const name = admin
    ? admin.name
    : user?.firstName && user?.lastName
    ? `${user?.firstName} ${user?.lastName}`
    : user?.firstName
    ? `${user?.firstName}`
    : user?.lastName
    ? `${user?.lastName}`
    : '';

  const profile = admin
    ? require('src/helper/image/lpAppIcon.png')
    : user?.profilePhoto
    ? { uri: user?.profilePhoto }
    : null;
  // const time = moment(date.updated).format('hh:mm A');

  React.useEffect(() => {
    let newDate = new Date().setHours(0, 0, 0, 0);
    let oldDate = new Date(date.updated).setHours(0, 0, 0, 0);
    if (newDate <= oldDate) {
      setTime(moment(date.updated).format('hh:mm A'));
    } else {
      setTime(moment(date.updated).format('hh:mm A DD/MM/YYYY'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View key={id} style={[styles.itemCont, { flexDirection: 'column' }]}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            if (user) {
              if (currentUser?.id !== user?.id) {
                navigation.navigate({
                  name: Route.navOtherUserProfile as never,
                  params: { id: user?.id } as never,
                });
              } else {
                navigation.navigate({
                  name: Route.navMyProfileScreen as never,
                  params: {} as never,
                });
              }
            }
          }}
          activeOpacity={0.6}
          style={styles.profileCont}>
          {profile ? (
            <Image source={profile} style={styles.profileImg} />
          ) : (
            <NameFirstChar name={name} />
          )}
          <View style={styles.itmNameTimeCont}>
            <View style={styles.nameTimeCont}>
              <Text style={styles.txtItemName}>{name}</Text>
            </View>
            <View style={styles.nameTimeCont}>
              <Text style={{ color: theme.colors.grey }}>{time}</Text>
            </View>
          </View>
          {edit && isDraft && (
            <View style={styles.draftCont}>
              <Text style={styles.txtDraft}>Draft</Text>
            </View>
          )}
        </TouchableOpacity>
        {edit && (
          <TouchableOpacity style={styles.iconEdit} onPress={onPressEdit}>
            <Entypo
              name="dots-three-vertical"
              size={20}
              color={theme.colors.grey}
            />
          </TouchableOpacity>
        )}
      </View>
      {description !== '' && (
        <View style={styles.txtDiscMoreLess}>
          <MoreLessText children={description} numberOfLines={3} />
        </View>
      )}
      <View style={styles.feedImageCont}>
        {media.length > 0 && (
          <FlatList
            data={media}
            bounces={false}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewRef.current}
            viewabilityConfig={{
              itemVisiblePercentThreshold: 50,
            }}
            keyExtractor={(_item, index) => index.toString()}
            renderItem={({ item: itm }) => {
              return (
                <>
                  {itm.mimetype === 'video/mp4' ? (
                    <InViewPort
                      onChange={(isVisible: boolean) =>
                        setVisiblePaused(isVisible)
                      }>
                      {media.length > 0 && (
                        <TouchableOpacity
                          activeOpacity={1}
                          onPress={() => {
                            if (visiblePaused) {
                              setPauseVideo(!pauseVideo);
                            }
                          }}>
                          <Video
                            source={{
                              uri: itm.uri,
                            }}
                            ref={videoRef}
                            repeat={true}
                            resizeMode="contain"
                            paused={!pauseVideo || !visiblePaused}
                            style={styles.feedVideoStyle}
                          />
                          <View style={styles.pausePlayCont}>
                            {!pauseVideo || !visiblePaused ? (
                              <Icon
                                name={'play'}
                                size={50}
                                color={theme.colors.white}
                              />
                            ) : null}
                          </View>
                        </TouchableOpacity>
                      )}
                    </InViewPort>
                  ) : (
                    <>
                      <Lightbox
                        // springConfig={{tension: 15, friction: 7}}
                        swipeToDismiss={false}
                        renderContent={() => (
                          <Carousel
                            autoplay={false}
                            style={{ width: WIDTH, height: WIDTH }}>
                            {media.map(ele => {
                              return (
                                <Image
                                  source={{ uri: ele.uri }}
                                  style={styles.feedImgStyle}
                                />
                              );
                            })}
                          </Carousel>
                        )}>
                        <Image
                          source={{ uri: itm.uri }}
                          onLoadEnd={() => setLoaded(false)}
                          style={styles.feedImgStyle}
                        />
                      </Lightbox>
                      {loaded && (
                        <ActivityIndicator
                          style={styles.imageLoaderCont}
                          color={theme.colors.loaderColor}
                        />
                      )}
                      {/* {media.length > 0 && (
                        <View style={styles.countFeedImage}>
                          <Text style={styles.txtCountFeedImage}>
                            {`${currentImgIndex}/${media.length}`}
                          </Text>
                        </View>
                      )} */}
                    </>
                  )}
                </>
              );
            }}
          />
        )}
        {media.length > 0 && (
          <View style={styles.countFeedImage}>
            <Text style={styles.txtCountFeedImage}>
              {`${currentImgIndex}/${media.length}`}
            </Text>
          </View>
        )}
      </View>
      {isDraft ? null : (
        <View style={styles.likeCommentMainCont}>
          <View style={styles.viewLikeCommentCont}>
            <View style={styles.totalLikeCont}>
              <AntDesign name="like1" size={15} color={theme.colors.grey} />
              <Text style={styles.txtTotalLike}>{likes}</Text>
            </View>

            <Text style={styles.txtTotalComment}>{comments} Comments</Text>
          </View>
          <View style={styles.Divider} />
          <View style={styles.editLikeCommentCont}>
            <TouchableOpacity onPress={onPressLike} style={styles.editLikeCont}>
              <AntDesign
                name="like1"
                size={20}
                color={isLiked ? theme.colors.primary : theme.colors.grey}
              />
              <Text
                style={[
                  styles.txtEditLike,
                  { color: isLiked ? theme.colors.primary : theme.colors.grey },
                ]}>
                like
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.6}
              onPress={onPressComment}
              style={styles.editCommentCont}>
              <MaterialIcons
                name="comment"
                size={20}
                color={theme.colors.grey}
              />
              <Text style={styles.txtEditComment}>Comments</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  txtDisc: {
    width: '80%',
    fontSize: theme.fontSize.l,
  },
  msgCountCont: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m - 6 - 5,
    borderRadius: theme.borderRadii.l,
    height: 22,
    width: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtMsgCount: {
    color: theme.colors.white,
    fontSize: theme.fontSize.m,
  },
  profileCont: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.l - 4,
    alignItems: 'center',
    flex: 1,
  },
  itmNameTimeCont: { flex: 1 },
  txtDiscMoreLess: {
    marginTop: theme.spacing.m - 6,
    paddingHorizontal: theme.spacing.l - 4,
    width: WIDTH,
  },
  feedImageCont: { flex: 1, marginTop: theme.spacing.m - 6 },
  feedImgStyle: { height: 250, width: WIDTH },
  imageLoaderCont: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 9999,
    height: 250,
    width: WIDTH,
  },
  countFeedImage: {
    paddingVertical: theme.spacing.m - 6 - 7,
    paddingHorizontal: theme.spacing.m - 6 - 2,
    backgroundColor: theme.colors.blackTrans,
    alignSelf: 'flex-end',
    borderRadius: theme.borderRadii.s,
    position: 'absolute',
    top: theme.spacing.m - 6,
    right: theme.spacing.m - 6,
  },
  txtCountFeedImage: {
    color: theme.colors.white,
    fontSize: theme.fontSize.m,
  },
  feedVideoStyle: {
    height: 250,
    width: WIDTH,
  },
  pausePlayCont: {
    position: 'absolute',
    height: 250,
    width: WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  likeCommentMainCont: {
    width: '90%',
  },
  viewLikeCommentCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
  },
  totalLikeCont: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  txtTotalLike: {
    fontSize: theme.fontSize.s + 2,
    color: theme.colors.grey,
    marginLeft: theme.spacing.m - 6,
  },
  txtTotalComment: {
    fontSize: theme.fontSize.s + 2,
    color: theme.colors.grey,
  },
  Divider: {
    backgroundColor: theme.colors.grey,
    height: 0.5,
  },
  editLikeCommentCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.m - 8,
    height: 40,
  },
  editLikeCont: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingVertical: theme.spacing.s,
  },
  txtEditLike: {
    fontSize: theme.fontSize.m,
    color: theme.colors.grey,
    marginLeft: theme.spacing.m - 6,
  },
  editCommentCont: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingVertical: theme.spacing.s,
  },
  txtEditComment: {
    fontSize: theme.fontSize.m,
    color: theme.colors.grey,
    marginLeft: theme.spacing.m - 6,
  },
  draftCont: {
    backgroundColor: theme.colors.textInBgColor,
    paddingVertical: theme.spacing.s - 4,
    paddingHorizontal: theme.spacing.s,
    borderRadius: theme.borderRadii.m,
  },
  txtDraft: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.m,
  },
  iconEdit: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
  },
}));

export default FeedsItem;
