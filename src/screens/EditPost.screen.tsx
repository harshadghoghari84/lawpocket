// relative path
import * as React from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { Modalize } from 'react-native-modalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Snackbar from 'react-native-snackbar';
import Icon from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import { useSelector } from 'react-redux';
import BottomSheetChooseImage from 'src/components/BottomSheetChooseImage';
import BottomSheetSave from 'src/components/BottomSheetSave';
import CustomHeader from 'src/components/CustomHeader';
import { NameFirstChar } from 'src/components/NameFirstChar';
import BackIcon from 'src/components/svg/BackIcon';
import CloseIcon from 'src/components/svg/CloseIcon';
import { NoDataFound } from 'src/components/ui/NoDataFound';
import { Route } from 'src/constants/navigationConstants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useFeedById } from 'src/hooks/useFeeds';
import { useMeQuery } from 'src/hooks/useMeQuery';
import { selectFeedsLoading } from 'src/redux/feeds/feeds.selector';
import { feedsUpdate, removefeedsMedia } from 'src/redux/feeds/feeds.thunk';
import {
  feedSelector,
  isDraftPostSelector,
} from 'src/redux/settings/settings.selectors';
import { feedMediaProps } from 'src/types/feed.types';
import { ThemeProps } from 'src/types/global.types';
import { MainNavigationProps } from 'src/types/navigation.types';
import { getUrlExtension } from 'src/utils/common';

export interface PostDataProps {
  name: string;
  profile: string;
  description: string;
  image: ImageProps[];
}

export interface ImageProps {
  name?: string;
  type?: string;
  uri?: string;
  location: string;
  mimetype: string;
  originalname?: string;
}

const EditPost: React.FC<MainNavigationProps<Route.navEditPost>> = ({
  navigation,
}) => {
  const loading = useSelector(selectFeedsLoading);

  const FeedId = useSelector(feedSelector);
  const isDraftPost = useSelector(isDraftPostSelector);
  const insets = useSafeAreaInsets();
  const styles = useStyles({ insets });
  const modalizeRef = React.useRef<Modalize>(null);
  const modalizeSaveRef = React.useRef<Modalize>(null);
  const modalizeRefPost = React.useRef<Modalize>(null);

  const { data: currentUser } = useMeQuery();

  const { theme } = useTheme();
  const { refetch, isLoading } = useFeedById(FeedId, { enabled: false });
  const dispatch = useAppDispatch();

  console.log('FeedId', FeedId);

  const [postDisc, setPostDisc] = React.useState<string>('');
  const [image, setImage] = React.useState<feedMediaProps[]>([]);
  const [newImage, setNewImage] = React.useState<ImageProps[]>([]);
  const [activeVideo, setActiveVideo] = React.useState<boolean>(false);
  const [onlyPickImage, setOnlyPickImage] = React.useState<boolean>(false);

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
    console.log('called');
    refetch().then(({ data }) => {
      console.log('res', data);
      setPostDisc(data?.description);
      setImage(data?.media ? data.media : []);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [FeedId]);

  React.useEffect(() => {
    if (newImage.length > 0) {
      let tmpArr: ImageProps[] = [];
      image.map(ele => {
        if (!newImage.includes(ele)) {
          tmpArr.push(ele);
        }
      });
      setImage([...tmpArr, ...newImage]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newImage]);

  console.log('edit screen  image', image);
  console.log('edit screen  newImage', newImage);

  // React.useEffect(() => {
  //   // if (FeedData) {
  //   setPostDisc(FeedData?.description);
  //   setImage(FeedData?.media ? FeedData.media : []);
  //   // }
  // }, [FeedData, FeedId]);

  const onPressSave = async (isDraft: boolean) => {
    try {
      if (postDisc !== '' || image?.length > 0) {
        const formData = new FormData();

        formData.append('description', postDisc);
        formData.append('isDraft', isDraft);
        if (newImage.length > 0) {
          Object.entries(newImage).forEach(async ([_key, val]) => {
            console.log(' val.uri', val.uri);

            formData.append('documents', {
              name:
                val.originalname ||
                `IMG-${new Date()}.${getUrlExtension(val.uri)}`,
              mimetype: val.mimetype,
              uri:
                Platform.OS === 'ios'
                  ? val.uri.replace('file://', '')
                  : val.uri,
            });
          });
        }

        console.log('FORM DATA', formData);

        const result = await dispatch(
          feedsUpdate({ formData: formData, id: FeedId }),
        );

        console.log('result', result);
        if (feedsUpdate.fulfilled.match(result)) {
          setPostDisc('');
          setImage([]);
          setNewImage([]);
          navigation.goBack();
        } else {
        }
      } else {
        Snackbar.show({
          text: 'please write some description or select documents!',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: theme.colors.error,
          textColor: theme.colors.white,
        });
      }
    } catch (error) {}
  };

  const onPressBack = () => {
    if (postDisc !== '' || image.length > 0) {
      modalizeRefPost.current.open();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <NoDataFound loading={isLoading} />
      ) : (
        <>
          <CustomHeader
            left={
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => onPressBack()}>
                <BackIcon color={theme.colors.iconColor} />
              </TouchableOpacity>
            }
            title="Edit Post"
            right={
              loading ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.txtPost} onPress={() => onPressSave(false)}>
                  Save
                </Text>
              )
            }
          />
          <ScrollView
            keyboardShouldPersistTaps={'handled'}
            bounces={false}
            style={styles.mainCont}>
            <View style={styles.profileNameCont}>
              {profilePhoto ? (
                <Image source={{ uri: profilePhoto }} style={styles.profile} />
              ) : (
                <NameFirstChar name={name} />
              )}
              <Text style={styles.name}>{name}</Text>
            </View>
            <TextInput
              value={postDisc}
              multiline={true}
              onChangeText={(val: string) => setPostDisc(val)}
              style={styles.txtDescription}
              returnKeyType={'done'}
              returnKeyLabel={'done'}
            />

            <View style={styles.imageCont}>
              {image?.map(item => {
                return (
                  <View style={styles.image}>
                    {item.mimetype === 'video/mp4' ||
                    item.mimetype === 'video/quicktime' ||
                    item.type === 'video/mp4' ? (
                      <Video
                        source={{ uri: item.uri }}
                        style={styles.postImage}
                        volume={0}
                      />
                    ) : (
                      <Image
                        source={{ uri: item.uri }}
                        style={styles.postImage}
                      />
                    )}
                    <TouchableOpacity
                      onPress={async () => {
                        var array = [...image];
                        var index = array.indexOf(item);
                        if (index !== -1) {
                          array.splice(index, 1);
                          setImage(array);
                        }
                        const result = await dispatch(
                          removefeedsMedia({ id: FeedId, key: item.key }),
                        );

                        console.log('result', result);
                        if (removefeedsMedia.fulfilled.match(result)) {
                          refetch().then();
                        } else {
                        }
                      }}
                      style={styles.btnClose}>
                      <CloseIcon
                        color={theme.colors.black}
                        height={12}
                        width={12}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </ScrollView>
          <View style={styles.bottomCont}>
            <TouchableOpacity
              onPress={() => {
                modalizeRef.current?.open();
                setOnlyPickImage(true);
                setActiveVideo(false);
              }}
              activeOpacity={0.6}
              style={styles.innerBottomCont}>
              <View style={[styles.innerBottomCont, { flexDirection: 'row' }]}>
                <Icon name="images" size={18} color={theme.colors.primary} />
                <Text style={styles.txtPhotoVideo}>Photo</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.photoVideoDivider} />
            <TouchableOpacity
              onPress={() => {
                modalizeRef.current?.open();
                setOnlyPickImage(false);
                setActiveVideo(true);
              }}
              activeOpacity={0.6}
              style={styles.innerBottomCont}>
              <View style={[styles.innerBottomCont, { flexDirection: 'row' }]}>
                <Icon name="videocam" size={18} color={theme.colors.primary} />
                <Text style={styles.txtPhotoVideo}>Video</Text>
              </View>
            </TouchableOpacity>
          </View>
        </>
      )}
      <BottomSheetChooseImage
        modalizeRef={modalizeRefPost}
        editPost={true}
        isDraftPost={isDraftPost}
        onPressDiscard={() => {
          setPostDisc('');
          setImage([]);
          setNewImage([]);
          modalizeRefPost.current.close();
          navigation.goBack();
        }}
        onPressDraft={() => onPressSave(true)}
      />
      <BottomSheetChooseImage
        modalizeRef={modalizeRef}
        image={newImage}
        setImage={setNewImage}
        multiple={true}
        onlyPickImage={onlyPickImage}
        activeVideo={activeVideo}
      />
      <BottomSheetSave
        modalizeRef={modalizeSaveRef}
        title="Profile saved successfully"
      />
    </View>
  );
};

export default EditPost;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    backgroundColor: theme.colors?.background,
    flex: 1,
    paddingBottom: props.insets.bottom,
  },
  profile: {
    height: 40,
    width: 40,
    borderRadius: theme.borderRadii.xl,
  },
  profileNameCont: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.l - 4,
    paddingVertical: theme.spacing.l - 4,
  },
  name: {
    fontSize: theme.fontSize.m + 3,
    fontWeight: '500',
    marginLeft: theme.spacing.l - 4,
    color: theme.colors.textPrimary,
  },
  txtDescription: {
    marginHorizontal: theme.spacing.l - 4,
    height: 100,
    backgroundColor: theme.colors.textInBgColor,
    borderRadius: theme.borderRadii.m,
    paddingHorizontal: theme.spacing.m - 6,
    paddingTop: theme.spacing.m - 6,
    alignItems: 'flex-start',
    textAlignVertical: 'top',
    color: theme.colors.textPrimary,
  },
  imageCont: {
    paddingHorizontal: theme.spacing.l - 4,
    paddingVertical: theme.spacing.l - 4,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: theme.borderRadii.l,
    margin: theme.spacing.s,
  },
  postImage: {
    height: 80,
    width: 80,
    borderRadius: theme.borderRadii.l,
    // margin: theme.spacing.s,
  },
  btnClose: {
    borderRadius: theme.borderRadii.l,
    backgroundColor: theme.colors.white,
    padding: theme.spacing.m - 6 - 5,
    shadowColor: theme.colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    position: 'absolute',
    right: -8,
    top: -8,
  },
  bottomCont: {
    backgroundColor: theme.colors.textInBgColor,
    height: 50,
    flexDirection: 'row',
  },
  innerBottomCont: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  txtPhotoVideo: {
    color: theme.colors.primary,
    marginLeft: theme.spacing.m - 6,
  },
  photoVideoDivider: {
    height: 50,
    width: 1,
    backgroundColor: theme.colors.textInBgColor,
  },
  mainCont: { flex: 1 },
  txtPost: {
    fontWeight: '500',
    color: theme.colors.primary,
    paddingVertical: theme.spacing.s,
  },
  backBtn: {
    height: 30,
    width: 30,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
}));
