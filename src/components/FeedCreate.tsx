import * as React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

interface FeedCreateProps {
  profile?: string;
  onPress?: () => void;
  name: string;
}

const FeedCreate: React.FC<FeedCreateProps> = ({ onPress }) => {
  const { theme } = useTheme();
  const styles = useStyles();
  return (
    <View style={styles.createPostCont}>
      {/* {profile ? (
        <Image source={{ uri: profile }} ‚style={styles.profileImg} />
      ) : (
        <NameFirstChar name={name} />
      )} */}
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.6}
        style={styles.innerCreatePostCont}
      >
        <TextInput
          placeholder="Write something here...."
          editable={false}
          placeholderTextColor={theme.colors.grey}
          style={styles.textIn}
        />
        <Icon name="images" size={20} color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  profileImg: {
    height: 50,
    width: 50,
    borderRadius: theme.borderRadii.xl,
  },
  createPostCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // marginLeft: theme.spacing.l - 4,
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
}));

export default FeedCreate;
