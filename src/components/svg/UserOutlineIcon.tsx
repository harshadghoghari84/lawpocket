import * as React from 'react';
import Svg, { G, Path, SvgProps } from 'react-native-svg';

interface UserOutlineIconProps extends SvgProps {
  color: string;
}

const UserOutlineIcon = ({ color, ...props }: UserOutlineIconProps) => {
  return (
    <Svg viewBox="0 0 52.124 60" width={20} height={20} {...props}>
      <G id="user-outline" transform="translate(0 -0.008)">
        <Path
          id="Path_2411"
          data-name="Path 2411"
          d="M99.711,29.216a14.509,14.509,0,0,1-14.379-14.6,14.381,14.381,0,1,1,28.758,0A14.509,14.509,0,0,1,99.711,29.216Zm0-24.827a10.224,10.224,0,1,0,10.065,10.223A10.156,10.156,0,0,0,99.711,4.389Zm0,0"
          transform="translate(-73.916 0)"
          fill={color}
        />
        <Path
          id="Path_2412"
          data-name="Path 2412"
          d="M49.952,282.3H2.172A2.182,2.182,0,0,1,0,280.105V269.882a13.831,13.831,0,0,1,13.755-13.874H38.369a13.831,13.831,0,0,1,13.755,13.874v10.223A2.182,2.182,0,0,1,49.952,282.3ZM4.344,277.914H47.78v-8.032a9.463,9.463,0,0,0-9.411-9.493H13.755a9.463,9.463,0,0,0-9.411,9.493Zm0,0"
          transform="translate(0 -222.288)"
          fill={color}
        />
      </G>
    </Svg>
  );
};

export default React.memo(UserOutlineIcon);
