import * as React from 'react';
import {
  PermissionsAndroid,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import { Modalize } from 'react-native-modalize';
import { IHandles } from 'react-native-modalize/lib/options';
import { Portal } from 'react-native-portalize';
import Snackbar from 'react-native-snackbar';
import ModalFooter from 'src/components/BottomSheetFooter';
import { WIDTH } from 'src/constants';
import { CaseFileType } from 'src/constants/constants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { closeChat } from 'src/redux/lawyer/lawyer.thunk';
import { commonStyles } from 'src/screens/Authentication/Setprofile/SetProfileStyle';
import DocumentPicker from 'react-native-document-picker';
import { ImageProps } from 'src/screens/EditPost.screen';
import MovToMp4 from 'react-native-mov-to-mp4';
import { getUrlExtension } from 'src/utils/common';

export interface BottomSheetChooseImageProps {
  modalizeRef: React.MutableRefObject<IHandles>;
  title?: string;
  setImage?: (value: any) => void;
  editPost?: boolean;
  onPress?: () => void;
  onPressDiscard?: () => void;
  onPressDraft?: () => void;
  activeVideo?: boolean;
  onChat?: boolean;
  image?: ImageProps[];
  setActiveRatingSheet?: (value: boolean) => void;
  onlyPickImage?: boolean;
  multiple?: boolean;
  fireConsole?: string;
  client?: number;
  isDraftPost?: boolean;
}

const BottomSheetChooseImage: React.FC<BottomSheetChooseImageProps> = ({
  modalizeRef,
  setImage,
  editPost,
  onPressDiscard,
  activeVideo,
  image,
  onChat,
  setActiveRatingSheet,
  client,
  onlyPickImage,
  onPressDraft,
  isDraftPost,
  multiple = false,
}) => {
  const { theme } = useTheme();
  const styles = useStyles();
  const dispatch = useAppDispatch();

  const pickImageOrVideoRef = React.useRef<Modalize>(null);

  const {
    modalizeCont,
    openPickerCont,
    txtModalText,
    modalDividerCont,
    modalizeCancelBtn,
    fontBold,
  } = commonStyles();

  const onPressCloseChat = async (reason: number, reasonText: string) => {
    const result = await dispatch(
      closeChat({
        id: client,
        reason: reason,
        reasonText: reasonText,
      }),
    );

    console.log('chat close result', result);

    if (closeChat.fulfilled.match(result)) {
      // updateUser();
      setActiveRatingSheet(true);
      modalizeRef.current?.close();
    } else {
      modalizeRef.current?.close();
    }
  };

  // const updateUser = () => {
  //   let userUpdt: { user: users[] } = {
  //     user: [],
  //   };

  //   firestore()
  //     .collection('Users')
  //     .doc(fireConsole)
  //     .get()
  //     .then(querySnapshot => {
  //       querySnapshot.data().user.map((flt: any) => {
  //         userUpdt.user.push({ ...flt, chatClosed: true });
  //       });
  //       firestore()
  //         .collection('Users')
  //         .doc(fireConsole)
  //         .set(userUpdt, { merge: true })
  //         .then(() => {});
  //     });
  // };

  const options = {
    quality: 0.6,
    maxWidth: 500,
    maxHeight: 500,
    includeBase64: true,
    multiple: multiple,
    storageOptions: {
      // skipBackup: true
      cameraRoll: true,
      waitUntilSaved: true,
    },
  };

  const openPickerCamera = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Law-Pocket Photo App Camera Permission',
            message: 'Law-Pocket Photo App needs access to your camera ',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          if (activeVideo) {
            ImagePicker.openCamera({ mediaType: 'video', ...options }).then(
              images => {
                setImage([...image, { img: images.path }]);
              },
            );
          } else {
            ImagePicker.openCamera(options).then(images => {
              setImage([...image, { img: images.path }]);
            });
          }
        } else {
          Snackbar.show({
            text: 'Camera permission denied',
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: theme.colors.grey5,
            textColor: theme.colors.black,
          });
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      if (onlyPickImage) {
        openPickerCameraImage();
      } else if (activeVideo) {
        openPickerCameraVideo();
      } else {
        pickImageOrVideoRef.current.open();
      }
      // if (activeVideo) {
      //   ImagePicker.openCamera({ mediaType: 'any' }).then(images => {
      //     setImage([...image, { img: images.path }]);
      //   });
      // } else {
      //   ImagePicker.openCamera({ mediaType: 'video' }).then(images => {
      //     console.log('images', images);
      //     // let obj = {
      //     //   name: images.filename ? images.filename : '',
      //     //   mimetype: images.mime,
      //     //   uri: images.path,
      //     // };
      //     // setImage([...image, obj]);
      //   });
      // }
    }
  };

  const openPickerPhotos = () => {
    ImagePicker.openPicker({ mediaType: 'photo', ...options }).then(images => {
      console.log('images', images);
      let tmpArr: any = [];

      images?.map(ele => {
        tmpArr.push({
          name: ele.filename ? ele.filename : '',
          type: ele.mime,
          uri: ele.path,
        });
      });
      console.log('tmpArr', tmpArr);
      setImage([...image, ...tmpArr]);

      // setImage([obj]);
    });
  };
  const openPickerVideos = () => {
    ImagePicker.openPicker({ mediaType: 'video', ...options }).then(video => {
      console.log('video', video);

      let tmpArr: any = [];

      video?.map(ele => {
        tmpArr.push({
          name: ele.filename ? ele.filename : '',
          type: ele.mime,
          uri: ele.path,
        });
      });
      setImage([...image, ...tmpArr]);

      // setImage([obj]);
    });
  };

  const pickImage = async () => {
    try {
      const res = await DocumentPicker.pickMultiple({
        type: activeVideo
          ? [DocumentPicker.types.video]
          : [DocumentPicker.types.allFiles],
      });

      if (res.length) {
        let obj = {
          name: res[0].name ? res[0].name : '',
          mimetype: res[0].type,
          uri: res[0].uri,
        };

        if (getUrlExtension(res[0].uri) === 'MOV') {
          const filename = Date.now().toString();
          MovToMp4.convertMovToMp4(res[0].uri, 'IMG-' + filename + '.mp4').then(
            function (results: string) {
              //here you can upload the video...

              obj.uri = results;
              obj.name = 'IMG-' + filename + '.mp4';
              setImage([...image, ...[obj]]);
            },
          );
        } else {
          setImage([...image, ...[obj]]);
        }
      }
    } catch (e) {
      if (DocumentPicker.isCancel(e)) {
      } else {
        console.log('catch err', e);
      }
    }
  };

  const openPickerCameraImage = async () => {
    try {
      await ImagePicker.openCamera({ mediaType: 'photo', ...options })
        .then(images => {
          console.log('camera image ', images);
          let obj = {
            name: images.filename ? images.filename : '',
            mimetype: images.mime,
            uri: images.path,
          };
          setImage([...image, obj]);
        })
        .catch(err => console.log('err', err));
    } catch (error) {
      console.log('image ERROR', error);
    }
  };
  const openPickerCameraVideo = () => {
    try {
      ImagePicker.openCamera({ mediaType: 'video', ...options })
        .then(video => {
          console.log('camera video ', video);

          let obj = {
            name: video.filename ? video.filename : '',
            mimetype: video.mime,
            uri: video.path,
          };
          setImage([...image, obj]);
        })
        .catch(err => console.log('err', err));
    } catch (error) {
      console.log('video ERROR', error);
    }
  };

  return (
    <Portal>
      <Modalize
        adjustToContentHeight
        ref={modalizeRef}
        disableScrollIfPossible
        handleStyle={styles.modalHandleStyle}
        FooterComponent={() => <ModalFooter />}
        modalStyle={styles.modalStyle}>
        <>
          {/* <StatusBar showHideTransition="none" hidden /> */}
          {editPost ? (
            <>
              <View style={modalizeCont}>
                {isDraftPost ? (
                  <>
                    <TouchableOpacity
                      onPress={onPressDraft}
                      style={openPickerCont}>
                      <Text style={txtModalText}>Save as draft</Text>
                    </TouchableOpacity>
                    <View style={modalDividerCont} />
                    <TouchableOpacity
                      onPress={onPressDiscard}
                      style={openPickerCont}>
                      <Text style={txtModalText}>Discard changes</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                    onPress={onPressDiscard}
                    style={openPickerCont}>
                    <Text style={txtModalText}>Discard changes</Text>
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity
                onPress={() => {
                  modalizeRef.current?.close();
                }}
                activeOpacity={0.6}
                style={modalizeCancelBtn}>
                <Text style={[txtModalText, fontBold]}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : onChat ? (
            <>
              <View style={[modalizeCont, { height: WIDTH / 2.5 }]}>
                <TouchableOpacity
                  onPress={() => {
                    onPressCloseChat(
                      CaseFileType.NEED_ANOTHER_LAWYER,
                      'Need another lawyer',
                    );
                  }}
                  style={openPickerCont}>
                  <Text style={txtModalText}>Need another lawyer</Text>
                </TouchableOpacity>
                <View style={modalDividerCont} />
                <TouchableOpacity
                  onPress={() => {
                    onPressCloseChat(
                      CaseFileType.ISSUE_SOLVED,
                      'Issue resolved',
                    );
                  }}
                  style={openPickerCont}>
                  <Text style={txtModalText}>Issue resolved</Text>
                </TouchableOpacity>
                <View style={modalDividerCont} />

                <TouchableOpacity
                  onPress={() => {
                    onPressCloseChat(
                      CaseFileType.USER_BREAKS_THE_RULES,
                      'User breaks the rules',
                    );
                  }}
                  style={openPickerCont}>
                  <Text style={txtModalText}>User breaks the rules</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => {
                  modalizeRef.current?.close();
                }}
                activeOpacity={0.6}
                style={modalizeCancelBtn}>
                <Text style={[txtModalText, fontBold]}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={modalizeCont}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => {
                    openPickerCamera();
                    modalizeRef.current?.close();
                  }}
                  style={openPickerCont}>
                  <Text style={txtModalText}>Camera</Text>
                </TouchableOpacity>
                <View style={modalDividerCont} />
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => {
                    if (activeVideo) {
                      openPickerVideos();
                    } else {
                      openPickerPhotos();
                    }
                    modalizeRef.current?.close();
                  }}
                  style={openPickerCont}>
                  <Text style={txtModalText}>
                    {activeVideo ? 'Videos' : 'Photos'}
                  </Text>
                </TouchableOpacity>
                <View style={modalDividerCont} />

                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => {
                    pickImage();
                    modalizeRef.current?.close();
                  }}
                  style={openPickerCont}>
                  <Text style={txtModalText}>Files</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  modalizeRef.current?.close();
                }}
                style={modalizeCancelBtn}>
                <Text style={[txtModalText, fontBold]}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </>
      </Modalize>
      <Modalize
        adjustToContentHeight
        ref={pickImageOrVideoRef}
        disableScrollIfPossible
        handleStyle={styles.modalHandleStyle}
        FooterComponent={() => <ModalFooter />}
        modalStyle={styles.modalStyle}>
        <>
          <View style={modalizeCont}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                openPickerCameraImage();
                pickImageOrVideoRef.current?.close();
              }}
              style={openPickerCont}>
              <Text style={txtModalText}>Image</Text>
            </TouchableOpacity>
            <View style={modalDividerCont} />
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                openPickerCameraVideo();
                pickImageOrVideoRef.current?.close();
              }}
              style={openPickerCont}>
              <Text style={txtModalText}>Video</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              pickImageOrVideoRef.current?.close();
            }}
            style={modalizeCancelBtn}>
            <Text style={[txtModalText, fontBold]}>Cancel</Text>
          </TouchableOpacity>
        </>
      </Modalize>
    </Portal>
  );
};

const useStyles = makeStyles(theme => ({
  modalHandleStyle: { backgroundColor: theme.colors.transparent },
  modalStyle: {
    backgroundColor: theme.colors.transparent,
    elevation: 0,
    // flex: 1,
  },
  modalHeaderCont: {
    width: '100%',
    paddingHorizontal: theme.spacing.m - 6 + 5,
    paddingVertical: theme.spacing.m - 6,
  },
  modalCloseCont: {
    height: 50,
    width: 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  txtTitle: {
    color: theme.colors.grey,
    marginTop: theme.spacing.l - 4,
    fontSize: theme.fontSize.l,
  },
  txtSuccess: {
    fontSize: theme.fontSize.l,
    fontWeight: '600',
  },
  markCont: {
    height: 100,
    width: 100,
    borderRadius: theme.borderRadii.l + 50,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.spacing.l - 4,
  },
  safeAreaView: {
    paddingBottom: theme.spacing.m - 6,
    backgroundColor: theme.colors.background,
  },
}));

export default BottomSheetChooseImage;
