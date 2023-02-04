import firestore from '@react-native-firebase/firestore';
import { CommonActions, useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import { makeStyles, useTheme } from 'react-native-elements';
import {
  Actions,
  Bubble,
  Composer,
  GiftedChat,
  Send,
} from 'react-native-gifted-chat';
import LinearGradient from 'react-native-linear-gradient';
import { Modalize } from 'react-native-modalize';
import Snackbar from 'react-native-snackbar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import BottomSheetChooseImage from 'src/components/BottomSheetChooseImage';
import BottomSheetRating from 'src/components/BottomSheetRating';
import CustomHeader from 'src/components/CustomHeader';
import { NameFirstChar } from 'src/components/NameFirstChar';
import AttachmentIcon from 'src/components/svg/AttachmentIcon';
import BackIcon from 'src/components/svg/BackIcon';
import CloseChatIcon from 'src/components/svg/CloseChatIcon';
import PdfIcon from 'src/components/svg/PdfIcon';
import SendIcon from 'src/components/svg/SendIcon';
import { RenderImageInChat } from 'src/components/ui/RenderImageInChat';
import { API } from 'src/constants/apiEndpoints';
import {
  MESSAGE_COLLECTION,
  UserType,
  USER_COLLECTION,
} from 'src/constants/constants';
import { Route } from 'src/constants/navigationConstants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useMeQuery } from 'src/hooks/useMeQuery';
import { useUserById } from 'src/hooks/useUserById';
import { fetch } from 'src/redux/fetch';
import { shareFile } from 'src/redux/myPocket/myPocket.thunk';
import { selectFiles } from 'src/redux/settings/settings.selectors';
import { selectedFiles } from 'src/redux/settings/settings.slice';
import { GetDocumentFromIDProps } from 'src/types/myPocket.types';
import { MainNavigationProps } from 'src/types/navigation.types';
import { getUrlExtension } from 'src/utils/common';

// relative path

export type ChatObjProps = {
  createdAt: Date;
  _id: number;
  text?: string;
  // file?: string;
  // image?: string;
  myPocketId?: string;
  caseId?: string;
  fileName?: string;
  docType?: string;
  type?: string;
  user?: {
    _id: number;
    name: string;
    avatar?: string;
  };
};

const ChatRoom: React.FC<MainNavigationProps<Route.navChatRoom>> = ({
  navigation,
  route,
}) => {
  const {
    id: uid,
    chat_id,
    sender_id,
    closedChat = false,
    fireConsole,
  } = route.params;

  const { theme } = useTheme();
  const styles = useStyles();
  const dispatch = useAppDispatch();

  const modalizeRef = React.useRef<Modalize>(null);
  const modalizeRefActiveRate = React.useRef<Modalize>(null);
  const [chatClosed, setChatClosed] = useState<boolean>(false);

  const selectedDataFiles = useSelector(selectFiles);
  const isFocuse = useIsFocused();
  const { data: currentUser, refetch: currUserRefetch } = useMeQuery();

  const { data: userInfo, isLoading, refetch } = useUserById(sender_id);

  const isBlocked = userInfo?.isBlocked;
  const isChatClosed = userInfo?.chatClosed || closedChat || chatClosed;

  const userName =
    userInfo?.firstName && userInfo?.lastName
      ? `${userInfo?.firstName} ${userInfo?.lastName}`
      : userInfo?.firstName
      ? `${userInfo?.firstName}`
      : userInfo?.lastName
      ? `${userInfo?.lastName}`
      : '';

  const userProfilePhoto = userInfo?.profilePhoto;

  // console.log('selectedDataFiles', selectedDataFiles);

  let chatId = closedChat ? fireConsole : userInfo?.activeChat || fireConsole;

  // console.log('chatId', chatId);
  // console.log('currentUser?.id------------------------', currentUser?.id, uid);

  const [messages, setMessages] = useState([]);
  const [activeRatingSheet, setActiveRatingSheet] = useState<boolean>(false);

  React.useEffect(() => {
    const Init = async () => {
      await RNBootSplash.hide();
    };

    Init().then();
  }, []);

  useEffect(() => {
    refetch().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocuse]);
  useEffect(() => {
    currUserRefetch().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  useEffect(() => {
    refetch().then();
    if (activeRatingSheet) {
      setChatClosed(true);
      modalizeRefActiveRate.current?.open();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRatingSheet]);

  useLayoutEffect(() => {
    const unsubscribe = firestore()
      .collection(USER_COLLECTION)
      .doc(chatId)
      .collection(MESSAGE_COLLECTION)
      .orderBy('createdAt', 'desc')
      .onSnapshot({
        error: e => console.log('e :', e),
        next: querySnapshot => {
          setMessages(
            querySnapshot.docs?.map(doc => ({
              _id: doc.data()._id,
              createdAt: doc.data().createdAt.toDate(),
              text: doc.data().text,
              user: doc.data().user,
              myPocketId: doc.data().myPocketId,
              caseId: doc.data().caseId,
              fileName: doc.data().fileName,
              docType: doc.data().docType,
              // image: doc.data().image,
              // file: doc.data().file,
            })),
          );
        },
      });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  useEffect(() => {
    if (selectedDataFiles.myPocketId || selectedDataFiles.caseId) {
      shareFiles(selectedDataFiles.myPocketId, selectedDataFiles.caseId);

      let obj = {
        createdAt: new Date(),
        _id: 'id' + new Date().getTime(),
        text: '',
        user: {
          _id: currentUser?.id,
          name: currentUser?.firstName,
        },
      };
      onSend([
        {
          ...obj,
          myPocketId: selectedDataFiles.myPocketId,
          caseId: selectedDataFiles.caseId,
          docType: selectedDataFiles.fileType,
          fileName: selectedDataFiles.fileName,
        },
      ]);
    }
    // return () => dispatch(selectedFiles({ id: '', docType: '' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDataFiles]);
  const shareFiles = async (myPocketId: string, caseFileId: string) => {
    const result = await dispatch(
      shareFile({
        document: myPocketId,
        caseFile: caseFileId,
        toUser: sender_id,
      }),
    );

    console.log('share result', result);
    if (shareFile.fulfilled.match(result)) {
    } else {
    }
  };

  const updateUser = (obj: {}) => {
    // let userUpdt: { user: users[] } = {
    //   user: [],
    // };

    // firestore()
    //   .collection(USER_COLLECTION)
    //   .doc(chatId)
    //   .get()
    //   .then(querySnapshot => {
    //     querySnapshot.data().user.map((flt: any) => {
    //       userUpdt.user.push({ ...flt, ...obj });
    //     });
    console.log('obj', obj);
    firestore()
      .collection(USER_COLLECTION)
      .doc(chatId)
      .set(obj, { merge: true })
      .then(() => {})
      .catch(err => {
        console.log('err', err);
      });
    // });
  };

  const onSend = useCallback((message = []) => {
    message
      .filter((msg: ChatObjProps) => msg.text !== '')
      .forEach((messageAll: ChatObjProps[]) =>
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, messageAll),
        ),
      );

    const {
      _id,
      createdAt,
      text,
      myPocketId,
      caseId,
      fileName,
      docType,
      user,
    } = message[0];
    if (myPocketId || caseId) {
      firestore()
        .collection(USER_COLLECTION)
        .doc(chatId)
        .collection(MESSAGE_COLLECTION)
        .add({ _id, createdAt, myPocketId, caseId, fileName, docType, user });

      let obj = {
        myPocketId: myPocketId,
        caseId: caseId,
        fileName: fileName,
        docType: docType,
        time: createdAt,
        latestMessage:
          docType === 'application/pdf' ? 'pdf shared' : 'Image shared',
        attorneyUnreadCount:
          currentUser?.userType === UserType.CLIENT ||
          currentUser?.userType === UserType.LAW_STUDENT
            ? 1
            : 0,
        clientUnreadCount:
          currentUser?.userType === UserType.ATTORNEY ||
          currentUser?.userType === UserType.LAW_FIRM ||
          currentUser?.userType === UserType.LEGAL_SERVICE_PROVIDER
            ? 1
            : 0,
        messageReceiverId: userInfo?.id || sender_id,
        messageSenderId: currentUser?.id ? currentUser?.id : uid,
        chat_id: chat_id || '',
      };

      updateUser(obj);
    } else {
      firestore()
        .collection(USER_COLLECTION)
        .doc(chatId)
        .collection(MESSAGE_COLLECTION)
        .add({ _id, createdAt, text, user });

      let obj = {
        latestMessage: text,
        time: createdAt,
        attorneyUnreadCount:
          currentUser?.userType === UserType.CLIENT ||
          currentUser?.userType === UserType.LAW_STUDENT
            ? 1
            : 0,
        clientUnreadCount:
          currentUser?.userType === UserType.ATTORNEY ||
          currentUser?.userType === UserType.LAW_FIRM ||
          currentUser?.userType === UserType.LEGAL_SERVICE_PROVIDER
            ? 1
            : 0,
        messageReceiverId: userInfo?.id || sender_id,
        messageSenderId: currentUser?.id ? currentUser.id : uid,
        chat_id: chat_id || '',
      };
      updateUser(obj);
    }
    dispatch(
      selectedFiles({ myPocketId: '', caseId: '', fileName: '', fileType: '' }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function GetFilename(url: string) {
    if (url) {
      var m = url.toString().match(/.*\/(.+?)\./);
      if (m && m.length > 1) {
        return m[1];
      }
    }
    return '';
  }

  const DownloadFiles = (url: string) => {
    let image_url = url;
    let ext = getUrlExtension(image_url);
    const options = {
      fileCache: true,
      path: `${RNFetchBlob.fs.dirs.DocumentDir}/${GetFilename(url)}.${ext}`,
      appendExt: ext,
    };
    RNFetchBlob.config(options)
      .fetch('GET', image_url)
      .then(() => {
        Snackbar.show({
          text: 'Download file successfully!',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: theme.colors.grey0,
          textColor: theme.colors.white,
        });
      });
  };

  const getImageForCurrentUser = async (myPocketId: string, caseId: string) => {
    try {
      const { statusCode, data, errors } = await fetch<GetDocumentFromIDProps>(
        {
          url: API.MY_POCKET,
          method: 'GET',
          params: {
            ...(myPocketId && {
              myPocketId,
            }),
            ...(caseId && {
              caseId,
            }),
          },
        },
        true,
      );

      if (statusCode === 200) {
        return myPocketId ? data.documents : data.pdf;
      } else if (statusCode === 404) {
        Snackbar.show({
          text: errors.message,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: theme.colors.error,
          textColor: theme.colors.white,
        });
      }
    } catch (error) {
      console.log('ERR==>', error);
    }
  };

  // console.log('blockedUser || chatClosed ', blockedUser, chatClosed);
  // console.log('storage ', storage);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          <CustomHeader
            // backBtn={true}
            left={
              <View style={styles.chatWithBackCont}>
                <TouchableOpacity
                  style={styles.backBtn}
                  onPress={() => {
                    if (navigation.canGoBack()) {
                      navigation.goBack();
                    } else {
                      navigation.dispatch(
                        CommonActions.reset({
                          index: 1,
                          routes: [
                            {
                              name: Route.navDashboard,
                              state: {
                                routes: [{ name: Route.navChat }],
                              },
                            },
                          ],
                        }),
                      );
                    }
                  }}>
                  <BackIcon color={theme.colors.iconColor} />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    if (!isBlocked) {
                      navigation.navigate({
                        name: Route.navOtherUserProfile as never,
                        params: { id: userInfo?.id } as never,
                      });
                    } else {
                      navigation.navigate(Route.navBlockedUser);
                    }
                  }}
                  style={styles.titProfileCont}>
                  {userProfilePhoto ? (
                    <Image
                      source={{ uri: userProfilePhoto }}
                      style={styles.imgProfile}
                    />
                  ) : (
                    <NameFirstChar
                      name={userName}
                      size={35}
                      style={styles.nameCharCont}
                    />
                  )}
                  <View style={styles.chatWithProfileNameCont}>
                    <Text style={styles.txtTitle}>{userName}</Text>
                    {isBlocked && <Text style={styles.txtBlock}>Blocked</Text>}
                  </View>
                </TouchableOpacity>
              </View>
            }
            // chatUserName={userName}
            // blockedUser={isBlocked}
            // chatProfile={userProfilePhoto}
            // inChat={true}
            // onPress={() => {
            //   if (!isBlocked) {
            //     navigation.navigate({
            //       name: Route.navOtherUserProfile as never,
            //       params: { id: userInfo?.id } as never,
            //     });
            //   }
            // }}
            right={
              <>
                {isBlocked || isChatClosed ? (
                  <View style={styles.closeCont} />
                ) : (
                  <>
                    {currentUser?.userType === UserType.ATTORNEY ||
                    currentUser?.userType === UserType.LAW_FIRM ||
                    currentUser?.userType ===
                      UserType.LEGAL_SERVICE_PROVIDER ? (
                      <TouchableOpacity
                        onPress={() => {
                          modalizeRef.current?.open();
                        }}
                        style={styles.closeCont}>
                        <CloseChatIcon color={theme.colors.pinkDark} />
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.closeCont} />
                    )}
                  </>
                )}
              </>
            }
          />

          <GiftedChat
            messages={messages}
            onSend={messagesVal => {
              if (messagesVal[0].text !== '') {
                onSend(messagesVal);
              }
            }}
            renderInputToolbar={props => {
              if (isChatClosed || isBlocked) {
                return null;
              } else {
                return (
                  <KeyboardAvoidingView style={styles.inputToolbarCont}>
                    <Actions
                      {...props}
                      containerStyle={styles.actionCont}
                      icon={() => (
                        <AttachmentIcon
                          color={theme.colors.primary}
                          height={25}
                          width={25}
                          style={styles.iconAttachment}
                        />
                      )}
                      onSend={propsSend => onSend(propsSend)}
                      onPressActionButton={() =>
                        navigation.navigate(Route.navStorage, {
                          activeAdd: true,
                        })
                      }
                    />
                    {/* <View style={styles.composerCont}> */}
                    <Composer
                      {...props}
                      placeholder="Write here"
                      // onInputSizeChanged={val => setTextInputHeight(val.height)}
                      textInputStyle={styles.textInComposer}
                    />
                    {/* </View> */}

                    <Send
                      {...props}
                      alwaysShowSend
                      containerStyle={styles.btnSendCont}>
                      <LinearGradient
                        style={styles.btnSend}
                        colors={[
                          theme.colors.gradientSecond,
                          theme.colors.gradientPrime,
                        ]}>
                        <SendIcon />
                      </LinearGradient>
                    </Send>
                  </KeyboardAvoidingView>
                );
              }
            }}
            renderAvatar={null}
            renderBubble={props => {
              var messageBelongsToCurrentUser =
                props.currentMessage.user._id === currentUser?.id;

              return (
                <View>
                  <View
                    style={
                      messageBelongsToCurrentUser
                        ? styles.messageTimeAndNameContainerRight
                        : styles.messageTimeAndNameContainerLeft
                    }>
                    {!messageBelongsToCurrentUser &&
                      !props.currentMessage.image && (
                        <>
                          {props.currentMessage.user.name &&
                          props.currentMessage.user._id !== currentUser?.id ? (
                            <Text style={styles.txtBubbleUserName}>
                              {props.currentMessage.user.name}
                            </Text>
                          ) : null}
                        </>
                      )}

                    <Bubble
                      {...props}
                      // renderCustomView={props => renderCustomView(props)}
                      wrapperStyle={{
                        left: styles.bubbleWrapperLeft,
                        right: styles.bubbleWrapperRight,
                      }}
                      textStyle={{
                        right: styles.txtBubbleWrapperLeft,
                        left: styles.txtBubbleWrapperRight,
                      }}
                      renderCustomView={() => {
                        if (
                          props?.currentMessage?.docType === 'image/jpg' ||
                          props?.currentMessage?.docType === 'image/jpeg' ||
                          props?.currentMessage?.docType === 'image/png'
                        ) {
                          return (
                            <RenderImageInChat
                              id={props.currentMessage.myPocketId}
                            />
                          );
                        }
                        return (
                          props?.currentMessage?.docType ===
                            'application/pdf' && (
                            <View style={styles.customViewCont}>
                              <View style={styles.fileIconTxtCont}>
                                <PdfIcon height={30} width={30} />
                                <Text
                                  numberOfLines={1}
                                  style={styles.txtFileName}>
                                  {props?.currentMessage?.fileName}
                                </Text>
                              </View>
                              <TouchableOpacity
                                onPress={async () => {
                                  let document = await getImageForCurrentUser(
                                    props.currentMessage.myPocketId,
                                    props.currentMessage.caseId,
                                  );
                                  DownloadFiles(document);
                                }}>
                                <Ionicons
                                  name="cloud-download"
                                  size={20}
                                  color={theme.colors.primary}
                                  style={styles.iconDownload}
                                />
                              </TouchableOpacity>
                            </View>
                          )
                        );
                      }}
                    />
                  </View>

                  <Text
                    style={
                      messageBelongsToCurrentUser
                        ? styles.timeRight
                        : styles.timeLeft
                    }>
                    {moment(new Date(props.currentMessage.createdAt)).format(
                      'LT',
                    )}
                  </Text>
                </View>
              );
            }}
            // bottomOffset={Platform.OS === 'ios' && 30}
            maxComposerHeight={35}
            renderTime={() => {
              return null;
            }}
            user={{
              _id: currentUser?.id,
              name: currentUser?.firstName,
            }}
          />
        </>
      )}

      <BottomSheetChooseImage
        modalizeRef={modalizeRef}
        onChat={true}
        setActiveRatingSheet={setActiveRatingSheet}
        fireConsole={chatId}
        client={chat_id}
      />

      <BottomSheetRating
        modalizeRef={modalizeRefActiveRate}
        name={userName}
        profile={userInfo?.profilePhoto}
        uid={sender_id}
        userType={userInfo?.userType}
        setActiveRatingSheet={setActiveRatingSheet}
      />
    </View>
  );
};

export default ChatRoom;

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors?.background,
    flex: 1,
  },
  btnSend: {
    height: Platform.OS === 'ios' ? 35 : 40,
    width: Platform.OS === 'ios' ? 35 : 40,
    borderRadius: theme.borderRadii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    //   shadowColor: theme.colors.shadowColor,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.23,
    // shadowRadius: 2.62,

    // elevation: 4,
  },
  btnSendCont: {
    height: Platform.OS === 'ios' ? 30 : 40,
    width: Platform.OS === 'ios' ? 30 : 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: theme.spacing.m - 6,
    borderRadius: theme.borderRadii.xl,
    shadowColor: theme.colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    backgroundColor: theme.colors.transparent,
    marginTop: theme.spacing.s,
  },
  messageTimeAndNameContainerRight: {
    backgroundColor: theme.colors.textInBgColor,
    padding: theme.spacing.s - 3,
    borderTopLeftRadius: theme.borderRadii.l,
    borderTopRightRadius: theme.borderRadii.l,
    borderBottomLeftRadius: theme.borderRadii.l,
    borderBottomRightRadius: 0,
    marginLeft: theme.spacing.m - 6,
  },
  messageTimeAndNameContainerLeft: {
    backgroundColor: theme.colors.primaryLight,
    padding: theme.spacing.s - 3,
    borderTopLeftRadius: theme.borderRadii.l,
    borderTopRightRadius: theme.borderRadii.l,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: theme.borderRadii.l,
    marginRight: theme.spacing.m - 6,
  },
  timeLeft: {
    marginVertical: theme.spacing.s,
    color: theme.colors.textSecondary,
  },
  timeRight: {
    marginVertical: theme.spacing.s,
    color: theme.colors.textSecondary,
    alignSelf: 'flex-end',
  },
  messageImageCont: {
    height: 200,
    width: 200,
    borderRadius: theme.borderRadii.l,
    resizeMode: 'cover',
  },
  iconDownload: { marginRight: theme.spacing.s },
  txtFileName: {
    marginLeft: theme.spacing.m - 6,
    color: theme.colors.textPrimary,
    width: 100,
  },
  fileIconTxtCont: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.xl,
    marginLeft: theme.spacing.s,
  },
  customViewCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.s - 5,
    marginBottom: theme.spacing.s - 5,
  },
  bubbleWrapperLeft: {
    backgroundColor: null,
    // alignSelf: 'stretch',
    marginRight: 0,
  },
  bubbleWrapperRight: {
    backgroundColor: null,
    // alignSelf: 'stretch',
    marginLeft: 0,
  },
  txtBubbleWrapperLeft: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.m,
  },
  txtBubbleWrapperRight: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.m,
  },
  txtBubbleUserName: {
    marginLeft: theme.spacing.s,
    marginTop: theme.spacing.s - 5,
    fontWeight: '600',
    fontSize: theme.fontSize.m - 2,
    marginBottom: theme.spacing.s - 5,
    marginRight: theme.spacing.s,
    color: theme.colors.textPrimary,
  },
  iconSend: { transform: [{ rotate: '-45deg' }] },
  textInComposer: {
    borderColor: theme.colors.grey,
    borderWidth: 1,
    borderRadius: theme.borderRadii.m,
    padding: theme.spacing.s - 3,
    paddingTop: theme.spacing.s,
    paddingLeft: theme.spacing.s,
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.m - 3,
    maxHeight: 35,
  },
  iconAttachment: {},
  inputToolbarCont: {
    flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'center',
    // marginHorizontal: theme.spacing.s,
    minHeight: 40,
    // backgroundColor: 'red',
    // marginBottom: theme.spacing.s - 4,
    // flex: 1,
  },
  modalContRating: {
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? theme.spacing.m : null,
  },
  secondRateCont: { flex: 1, marginHorizontal: theme.spacing.l - 4 },
  modalHandleStyle: { backgroundColor: theme.colors.transparent },
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
  nameProfileRateCont: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  txtWriteReview: {
    fontSize: theme.fontSize.m,
    fontWeight: '500',
    marginVertical: theme.spacing.m - 6,
    color: theme.colors.black,
  },
  textInCont: {
    height: 150,
    borderRadius: theme.borderRadii.m,
    borderWidth: 1,
    borderColor: theme.colors.grey,
    padding: theme.spacing.m,
    alignItems: 'flex-start',
    textAlignVertical: 'top',
    color: theme.colors.black,
  },
  bottomBtnCont: { marginVertical: theme.spacing.s },
  txtAndTextInCont: { flex: 1 },
  addPhotoCont: {
    height: 160,
    width: 160,
    borderRadius: theme.borderRadii.xxl + 50,
    backgroundColor: theme.colors.black1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.l - 4,
  },
  imageCont: {
    borderRadius: theme.borderRadii.xxl + 50,
    height: 140,
    width: 140,
    resizeMode: 'cover',
  },
  addPhotoContInner: {
    height: 150,
    width: 150,
    borderRadius: theme.borderRadii.xxl + 50,
    backgroundColor: theme.colors.black1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtNameAttorney: {
    fontSize: theme.fontSize.m + 3,
    fontWeight: '600',
    marginTop: theme.spacing.m,
    color: theme.colors.black,
  },
  safeAreaView: { paddingBottom: theme.spacing.m - 6 },
  actionCont: {
    height: Platform.OS === 'ios' ? 40 : 50,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.s - 4,
    // backgroundColor: 'green',
  },
  // composerCont: { minHeight: 50, flex: 1, backgroundColor: 'red' },
  modalRattingCont: {
    flexDirection: 'row',

    width: '60%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeCont: { width: 20 },
  chatWithBackCont: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtBlock: {
    color: theme.colors.textPrimary,
  },
  chatWithProfileNameCont: {
    flexDirection: 'column',
  },
  imgProfile: {
    height: 30,
    width: 30,
    borderRadius: theme.borderRadii.l,
    marginRight: theme.spacing.s,
  },
  titProfileCont: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing.s,
  },
  backBtn: {
    // height: 30,
    // width: 30,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.s + 3,
    paddingVertical: theme.spacing.s,
  },
  nameCharCont: {
    marginRight: theme.spacing.s,
  },
  txtTitle: {
    fontWeight: '500',
    fontSize: theme.fontSize.m + 4,
    color: theme.colors.textPrimary,
  },
}));
