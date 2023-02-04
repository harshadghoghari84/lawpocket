import * as React from 'react';
import { Text } from 'react-native';
import { makeStyles } from 'react-native-elements';

export interface MoreLessTextProps {
  children: string;
  numberOfLines: number;
}

const MoreLessText: React.FC<MoreLessTextProps> = ({
  children,
  numberOfLines,
}) => {
  const [isTruncatedText, setIsTruncatedText] = React.useState<boolean>(false);
  const [showMore, setShowMore] = React.useState<boolean>(true);
  const styles = useStyles();
  return isTruncatedText ? (
    <>
      <Text
        style={styles.txtTruncatedText}
        numberOfLines={showMore ? numberOfLines : 0}
      >
        {children}
      </Text>

      <Text
        style={styles.txtReadMoreLess}
        onPress={() => setShowMore(!showMore)}
      >
        {showMore ? 'Read More' : 'Less'}
      </Text>
    </>
  ) : (
    <Text
      style={styles.txtNormal}
      onTextLayout={event => {
        const { lines } = event.nativeEvent;
        setIsTruncatedText(lines?.length > numberOfLines);
      }}
    >
      {children}
    </Text>
  );
};

export default MoreLessText;

const useStyles = makeStyles(theme => ({
  txtTruncatedText: {
    fontSize: theme.fontSize.m,
    color: theme.colors.grey,
    // lineHeight: 20,
  },
  txtReadMoreLess: { color: theme.colors.primary },
  txtNormal: {
    fontSize: theme.fontSize.m,
    color: theme.colors.grey,
    // lineHeight: 20,
    // backgroundColor: 'red',
    alignSelf: 'flex-start',
  },
}));
