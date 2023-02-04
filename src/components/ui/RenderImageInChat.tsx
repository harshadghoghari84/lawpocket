import * as React from 'react';
import { Image, Text, View } from 'react-native';
import { makeStyles } from 'react-native-elements';
import Lightbox from 'react-native-lightbox-v2';
import { HEIGHT, WIDTH } from 'src/constants';
import { API } from 'src/constants/apiEndpoints';
import { fetch } from 'src/redux/fetch';
import { GetDocumentFromIDProps } from 'src/types/myPocket.types';

interface RenderImageInChatProps {
  id: string;
}
export interface GetDocumentProps {
  fileName: string;
  fileType: string;
  url: string;
}

export const RenderImageInChat: React.FC<RenderImageInChatProps> = ({ id }) => {
  const styles = useStyles();
  const [image, setImage] = React.useState<string>('');
  const [changeSize, setChangeSize] = React.useState<boolean>(false);
  const [imageDeleted, setImageDeleted] = React.useState<boolean>(false);

  React.useEffect(() => {
    const getDocFromId = async () => {
      try {
        const { statusCode, data } = await fetch<GetDocumentFromIDProps>(
          {
            url: `${API.MY_POCKET}?myPocketId=${id}`,
            method: 'GET',
          },
          true,
        );
        if (statusCode === 200) {
          setImage(data.documents);
        } else if (statusCode === 404) {
          setImageDeleted(true);
        }
      } catch (error) {
        console.log('ERR==>', error);
      }
    };

    getDocFromId().then();
  }, [id]);

  return (
    <>
      {imageDeleted ? (
        <View style={styles.deleteImageContainer}>
          <Text style={styles.txtImageDeleted}>Image deleted</Text>
        </View>
      ) : (
        <Lightbox
          // renderHeader={() => (
          //   <View style={styles.lbHeaderCont}>
          //     <Ionicons name="ios-download" color={theme.colors.white} size={25} />
          //   </View>
          // )}
          onOpen={() => setChangeSize(true)}
          onClose={() => setChangeSize(false)}
        >
          <Image
            source={{
              uri: image,
            }}
            style={[
              styles.messageImageCont,
              changeSize && styles.fullImageSize,
            ]}
          />
        </Lightbox>
      )}
    </>
  );
};

const useStyles = makeStyles(theme => ({
  dividerCont: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtNodataFound: {
    color: theme.colors.textPrimary,
  },
  messageImageCont: {
    height: 200,
    width: 200,
    borderRadius: theme.borderRadii.l,
    resizeMode: 'cover',
    marginTop: theme.spacing.s - 5,
  },
  deleteImageContainer: {
    height: 200,
    width: 200,
    borderRadius: theme.borderRadii.l,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.s - 5,
  },
  txtImageDeleted: { color: theme.colors.textPrimary },
  fullImageSize: {
    height: HEIGHT,
    width: WIDTH,
    resizeMode: 'contain',
  },
  lbHeaderCont: {
    marginTop: theme.spacing.m,
    alignItems: 'flex-end',
  },
}));
