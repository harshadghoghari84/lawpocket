import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface FacebookIconProps extends SvgProps {
  color: string;
}

const FacebookIcon = ({ color, ...props }: FacebookIconProps) => {
  return (
    <Svg viewBox="0 0 12.106 26.053" width={25} height={25} {...props}>
      <Path
        id="_104498_facebook_icon"
        data-name="104498_facebook_icon"
        d="M30.088,14.532H25.965v-2.7a1.1,1.1,0,0,1,1.147-1.252h2.909V6.112L26.015,6.1c-4.448,0-5.46,3.33-5.46,5.46v2.976H17.982v4.6h2.572V32.149h5.411V19.132h3.651Z"
        transform="translate(-17.982 -6.096)"
        fill={color}
      />
    </Svg>
  );
};

export default React.memo(FacebookIcon);
