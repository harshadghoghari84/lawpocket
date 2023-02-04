import * as React from 'react';
import Svg, { G, Path, SvgProps } from 'react-native-svg';

interface MailIconProps extends SvgProps {
  color: string;
}

const MailIcon = ({ color, ...props }: MailIconProps) => {
  return (
    <Svg viewBox="0 0 20 16" width={20} height={20} {...props}>
      <G id="email" transform="translate(-2 -4)">
        <G id="Group_10163" data-name="Group 10163">
          <Path
            id="Path_2883"
            data-name="Path 2883"
            d="M20,4H4A2,2,0,0,0,2.01,6L2,18a2.006,2.006,0,0,0,2,2H20a2.006,2.006,0,0,0,2-2V6A2.006,2.006,0,0,0,20,4Zm0,4-8,5L4,8V6l8,5,8-5Z"
            fill={color}
          />
        </G>
      </G>
    </Svg>
  );
};

export default React.memo(MailIcon);
