import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
// relative path
import { makeStyles } from 'react-native-elements';
import { WebView } from 'react-native-webview';
import CustomHeader from 'src/components/CustomHeader';
import { Route } from 'src/constants/navigationConstants';
import { MainNavigationProps } from 'src/types/navigation.types';

const FileView: React.FC<MainNavigationProps<Route.navFileViewer>> = ({
  route,
}) => {
  const { fileName, url } = route.params.data;

  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    setImageUrl(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

  const styles = useStyles();

  return (
    <View style={styles.container}>
      <CustomHeader backBtn={true} title={fileName} dummy={true} />
      <WebView
        source={{
          // uri:
          //   getUrlExtension(imageUrl) === 'pdf'
          //     ? `http://docs.google.com/gview?embedded=true&url=${imageUrl.replace(
          //         'file://',
          //         '',
          //       )}`
          //     : imageUrl,
          uri: imageUrl,
        }}
        style={styles.webCont}
      />
    </View>
  );
};

export default FileView;

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors?.background,
    flex: 1,
  },
  webCont: { flex: 1, backgroundColor: theme.colors.background },
}));
