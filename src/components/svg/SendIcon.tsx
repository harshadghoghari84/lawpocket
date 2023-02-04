import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface SendIconProps extends SvgProps {
  color?: string;
}

const SendIcon = ({ ...props }: SendIconProps) => {
  return (
    <Svg viewBox="0 0 16 15.998" width={15} height={15} {...props}>
      <Path
        id="ios-send"
        d="M20,4.539,4.7,11.206a.351.351,0,0,0,.013.638l4.138,2.338a.667.667,0,0,0,.763-.075l8.159-7.034c.054-.046.183-.133.233-.083s-.029.179-.075.233l-7.059,7.951a.665.665,0,0,0-.067.8l2.7,4.338a.352.352,0,0,0,.633-.008L20.469,5A.351.351,0,0,0,20,4.539Z"
        transform="translate(-4.502 -4.503)"
        fill="#fff"
      />
    </Svg>
  );
};

export default React.memo(SendIcon);
