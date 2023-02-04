import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface CloseIconProps extends SvgProps {
  color: string;
}

const CloseIcon = ({ color, ...props }: CloseIconProps) => {
  return (
    <Svg viewBox="0 0 18 18" width={18} height={18} {...props}>
      <Path
        id="close"
        d="M22.418,20.289l6.429-6.431a1.507,1.507,0,0,0-2.13-2.131l-6.429,6.431-6.429-6.431a1.507,1.507,0,1,0-2.13,2.131l6.429,6.431-6.429,6.431a1.507,1.507,0,1,0,2.13,2.131l6.429-6.431,6.429,6.431a1.507,1.507,0,1,0,2.13-2.131Z"
        transform="translate(-11.285 -11.289)"
        fill={color}
      />
    </Svg>
  );
};

export default React.memo(CloseIcon);
