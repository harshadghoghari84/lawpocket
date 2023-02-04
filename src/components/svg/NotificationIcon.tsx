import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface NotificationIconProps extends SvgProps {
  color: string;
}

const NotificationIcon = ({ color, ...props }: NotificationIconProps) => {
  return (
    <Svg viewBox="0 0 20 19.97" width={17} height={17} {...props}>
      <Path
        id="_47"
        data-name="47"
        d="M21,17H20V12a8,8,0,0,0-7-7.93V3a1,1,0,0,0-2,0V4.07A8,8,0,0,0,4,12v5H3a1,1,0,0,0,0,2H8.13a4,4,0,0,0,7.73,0H21a1,1,0,0,0,0-2Zm-9,3a2,2,0,0,1-1.73-1h3.45A2,2,0,0,1,12,20ZM6,17V12a6,6,0,0,1,12,0v5Z"
        transform="translate(-2 -2)"
        fill={color}
      />
    </Svg>
  );
};

export default React.memo(NotificationIcon);
