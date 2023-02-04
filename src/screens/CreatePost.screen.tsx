// relative path
import { useNavigation } from '@react-navigation/native';
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
import { useSelector } from 'react-redux';
import BottomSheetChooseImage from 'src/components/BottomSheetChooseImage';
import BottomSheetSave from 'src/components/BottomSheetSave';
import CustomHeader from 'src/components/CustomHeader';
import { NameFirstChar } from 'src/components/NameFirstChar';
import PickVideo from 'src/components/PickVideo';
import BackIcon from 'src/components/svg/BackIcon';
import CloseIcon from 'src/components/svg/CloseIcon';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useMeQuery } from 'src/hooks/useMeQuery';
import { selectFeedsLoading } from 'src/redux/feeds/feeds.selector';
import { feedsCreate } from 'src/redux/feeds/feeds.thunk';
import { ImageProps } from 'src/screens/EditPost.screen';
import { ThemeProps } from 'src/types/global.types';
import { getFilename, getUrlExtension } from 'src/utils/common';

const CreatePost: React.FC = () => {
  const loading = useSelector(selectFeedsLoading);
  // const isDraftPost = useSelector(isDraftPostSelector);

  const modalizeRef = React.useRef<Modalize>(null);
  const modalizeRefPost = React.useRef<Modalize>(null);
  const modalizeSaveRef = React.useRef<Modalize>(null);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const styles = useStyles({ insets });
  const { theme } = useTheme();

  const { data: currentUser } = useMeQuery();
  const dispatch = useAppDispatch();

  const [postDisc, setPostDisc] = React.useState<string>('');
  const [image, setImage] = React.useState<ImageProps[]>([]);
  const [activeVideo, setActiveVideo] = React.useState<boolean>(false);
  const [onlyPickImage, setOnlyPickImage] = React.useState<boolean>(false);
  const [pauseVideo, setPauseVideo] = React.useState<boolean>(true);

  console.log('image---', image);

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

  const onPressPost = async (isDraft: boolean) => {
    try {
      if (postDisc !== '' || image.length > 0) {
        const formData = new FormData();

        formData.append('description', postDisc);
        formData.append('isDraft', isDraft);
        Object.entries(image).forEach(([_key, val]) => {
          console.log(' val.uri', val.uri);

          formData.append('documents', {
            name: val.name || `IMG-${new Date()}.${getUrlExtension(val.uri)}`,
            type: val.mimetype,
            uri:
              Platform.OS === 'ios' ? val.uri.replace('file://', '') : val.uri,
          });
        });

        const result = await dispatch(feedsCreate(formData));

        console.log('result', result);

        if (feedsCreate.fulfilled.match(result)) {
          setPostDisc('');
          setImage([]);
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
      <CustomHeader
        left={
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => onPressBack()}>
            <BackIcon color={theme.colors.iconColor} />
          </TouchableOpacity>
        }
        title="New Post"
        right={
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.postCont}
            onPress={() => onPressPost(false)}>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.txtPost}>Post</Text>
            )}
          </TouchableOpacity>
        }
      />
      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        bounces={false}
        style={styles.mainCont}>
        <View style={styles.profileNameCont}>
          {profilePhoto ? (
            <Image
              source={{
                uri: profilePhoto,
              }}
              style={styles.profile}
            />
          ) : (
            <NameFirstChar name={name} />
          )}
          <Text style={styles.name}>{name}</Text>
        </View>
        <TextInput
          placeholder="Write something here...."
          value={postDisc}
          placeholderTextColor={theme.colors.grey}
          multiline={true}
          onChangeText={(val: string) => setPostDisc(val)}
          style={styles.txtDescription}
        />

        <View style={styles.imageCont}>
          {image?.map(item => {
            return (
              <View style={styles.image}>
                {item.mimetype === 'video/mp4' ||
                item.mimetype === 'video/quicktime' ||
                item.type === 'video/mp4' ? (
                  <PickVideo
                    videoUri={item.uri}
                    onPress={() => {
                      setPauseVideo(!pauseVideo);
                    }}
                    pauseVideo={pauseVideo}
                  />
                ) : (
                  <Image source={{ uri: item.uri }} style={styles.postImage} />
                )}
                <TouchableOpacity
                  onPress={() => {
                    var array = [...image];
                    var index = array.indexOf(item);
                    if (index !== -1) {
                      array.splice(index, 1);
                      setImage(array);
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
        <View style={styles.camVideoDivider} />
        <TouchableOpacity
          onPress={() => {
            modalizeRef.current?.open();
            setActiveVideo(true);
            setOnlyPickImage(false);
          }}
          activeOpacity={0.6}
          style={styles.innerBottomCont}>
          <View style={[styles.innerBottomCont, { flexDirection: 'row' }]}>
            <Icon name="videocam" size={18} color={theme.colors.primary} />
            <Text style={styles.txtPhotoVideo}>Video</Text>
          </View>
        </TouchableOpacity>
      </View>
      <BottomSheetChooseImage
        modalizeRef={modalizeRef}
        image={image}
        setImage={setImage}
        multiple={true}
        onlyPickImage={onlyPickImage}
        activeVideo={activeVideo}
      />
      <BottomSheetChooseImage
        modalizeRef={modalizeRefPost}
        editPost={true}
        isDraftPost={true}
        onPressDiscard={() => {
          setPostDisc('');
          setImage([]);
          modalizeRefPost.current.close();
          navigation.goBack();
        }}
        onPressDraft={() => onPressPost(true)}
      />
      <BottomSheetSave
        modalizeRef={modalizeSaveRef}
        title="Profile saved successfully"
      />
    </View>
  );
};

export default CreatePost;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    backgroundColor: theme.colors?.background,
    flex: 1,
    paddingBottom: props.insets.bottom,
  },
  profile: {
    height: 50,
    width: 50,
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
  camVideoDivider: {
    height: 50,
    width: 1,
    backgroundColor: theme.colors.textInBgColor,
  },
  mainCont: { flex: 1 },
  postCont: {
    paddingHorizontal: theme.spacing.s + 3,
    paddingVertical: theme.spacing.s,
  },
  txtPost: {
    fontWeight: '500',
    color: theme.colors.primary,
  },
  backBtn: {
    paddingHorizontal: theme.spacing.s + 3,
    paddingVertical: theme.spacing.s,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
}));
