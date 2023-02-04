import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';

interface PickVideoProps {
  videoUri: string;
  pauseVideo?: boolean;
  onPress?: () => void;
}

const PickVideo: React.FC<PickVideoProps> = ({
  pauseVideo,
  videoUri,
  onPress,
  ...props
}) => {
  const { theme } = useTheme();
  const styles = useStyles();
  return (
    <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
      <Video
        source={{ uri: videoUri }}
        style={styles.postImage}
        volume={0}
        paused={!pauseVideo}
        resizeMode="cover"
        {...props}
      />
      <View style={styles.pausePlayCont}>
        {!pauseVideo ? (
          <Icon name={'play'} size={22} color={theme.colors.white} />
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const useStyles = makeStyles(theme => ({
  postImage: {
    height: 80,
    width: 80,
    borderRadius: theme.borderRadii.l,
    // margin: theme.spacing.s,
  },
  pausePlayCont: {
    position: 'absolute',
    height: 80,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
}));

export default PickVideo;
