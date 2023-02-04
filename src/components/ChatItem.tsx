import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import * as React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { NameFirstChar } from 'src/components/NameFirstChar';
import { UserType, USER_COLLECTION } from 'src/constants/constants';
import { Route } from 'src/constants/navigationConstants';
import { useMeQuery } from 'src/hooks/useMeQuery';
import { ChatDataItemProps } from 'src/types/common.types';

const ChatItem: React.FC<ChatDataItemProps> = ({ item, closedChat }) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const navigation = useNavigation();

  const [latestMessage, setLatestMessage] = React.useState('');
  const [time, setTime] = React.useState(null);

  const { data: currentUser } = useMeQuery();

  let TIME = moment(time * 1000).fromNow();

  const name =
    currentUser?.userType === UserType.CLIENT ||
    currentUser?.userType === UserType.LAW_STUDENT
      ? item?.attorney?.firstName && item?.attorney?.lastName
        ? `${item?.attorney?.firstName} ${item?.attorney?.lastName}`
        : item?.attorney?.firstName
        ? `${item?.attorney?.firstName}`
        : item?.attorney?.lastName
        ? `${item?.attorney?.lastName}`
        : ''
      : item?.client?.firstName && item?.client?.lastName
      ? `${item?.client?.firstName} ${item?.client?.lastName}`
      : item?.client?.firstName
      ? `${item?.client?.firstName}`
      : item?.client?.lastName
      ? `${item?.client?.lastName}`
      : '';

  const profilePhoto =
    currentUser?.userType === UserType.CLIENT ||
    currentUser?.userType === UserType.LAW_STUDENT
      ? item?.attorney?.profilePhoto
        ? item?.attorney?.profilePhoto
        : ''
      : item?.client?.profilePhoto
      ? item?.client?.profilePhoto
      : '';

  const uid =
    currentUser?.userType === UserType.CLIENT ||
    currentUser?.userType === UserType.LAW_STUDENT
      ? item?.attorney?.id
      : item?.client?.id;

  React.useEffect(() => {
    const Init = async () => {
      await firestore()
        .collection(USER_COLLECTION)
        .doc(item.fireConsole)
        .onSnapshot(documentSnapshot => {
          setLatestMessage(documentSnapshot?.data()?.latestMessage);
          setTime(documentSnapshot?.data()?.time?.seconds);
          // documentSnapshot?.data()?.user?.map((ele: users) => {
          //   setLatestMessage(ele.latestMessage);
          //   setTime(ele?.time?.seconds);
          // });
        });
    };

    Init().then();
  }, [item]);

  return (
    <TouchableOpacity
      key={item?.id}
      onPress={() => {
        navigation.navigate({
          name: Route.navChatRoom as never,
          params: {
            sender_id: uid,
            chat_id: item.id,
            closedChat: closedChat,
            fireConsole: item.fireConsole,
          } as never,
        });
      }}
      activeOpacity={0.6}
      style={styles.itemCont}
    >
      {profilePhoto ? (
        <Image source={{ uri: profilePhoto }} style={styles.profileImg} />
      ) : (
        <NameFirstChar name={name} />
      )}

      <View style={styles.innerItmCont}>
        <View style={styles.nameTimeCont}>
          <Text
            numberOfLines={1}
            style={[
              styles.txtItemName,
              // { fontWeight: item?.msgCount > 0 ? '600' : 'normal' },
            ]}
          >
            {name}
          </Text>
          {TIME ? <Text style={styles.txtItemTime}>{TIME}</Text> : null}
        </View>
        <View style={styles.nameTimeCont}>
          {latestMessage ? (
            <Text
              numberOfLines={1}
              style={[
                styles.txtDisc,
                {
                  color: theme.colors.grey,
                  // item?.msgCount > 0
                  //   ? theme.colors.textPrimary
                  //   : theme.colors.grey,
                },
              ]}
            >
              {latestMessage}
            </Text>
          ) : null}
          {/* {item?.msgCount > 0 ? (
                    <View style={styles.msgCountCont}>
                      <Text style={styles.txtMsgCount}>{item?.msgCount}</Text>
                    </View>
                  ) : null} */}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const useStyles = makeStyles(theme => ({
  itemCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: theme.spacing.m - 6,
    paddingHorizontal: theme.spacing.l - 4,
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
    width: 130,
  },
  txtItemTime: {
    fontSize: theme.fontSize.m - 2,
    color: theme.colors.grey,
  },
  txtDisc: {
    width: '80%',
    fontSize: theme.fontSize.m,
  },
  msgCountCont: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadii.l,
    height: 22,
    width: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtMsgCount: {
    color: theme.colors.white,
    fontSize: theme.fontSize.s + 2,
  },
  innerItmCont: { flex: 1 },
}));

export default ChatItem;
