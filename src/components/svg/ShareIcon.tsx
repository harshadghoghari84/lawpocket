import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface ShareIconProps extends SvgProps {
  color: string;
}

const ShareIcon = ({ color, ...props }: ShareIconProps) => {
  return (
    <Svg viewBox="0 0 16.265 18" width={22} height={22} {...props}>
      <Path
        id="Path_2870"
        data-name="Path 2870"
        d="M16.554,14.723a2.631,2.631,0,0,0-1.771.7L8.34,11.669a2.958,2.958,0,0,0,.081-.633A2.958,2.958,0,0,0,8.34,10.4l6.37-3.714a2.7,2.7,0,1,0-.867-1.979,2.958,2.958,0,0,0,.081.633L7.554,9.057a2.711,2.711,0,1,0,0,3.958l6.434,3.759a2.549,2.549,0,0,0-.072.587,2.639,2.639,0,1,0,2.639-2.639Z"
        transform="translate(-3 -2)"
        fill={color}
      />
    </Svg>
  );
};

export default React.memo(ShareIcon);
