import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface UserIconProps extends SvgProps {
  color: string;
}

const UserIcon = ({ color, ...props }: UserIconProps) => {
  return (
    <Svg viewBox="0 0 17.375 20" width={20} height={20} {...props}>
      <Path
        id="Path_2409"
        data-name="Path 2409"
        d="M94.944,4.86A4.806,4.806,0,1,1,90.138.008,4.829,4.829,0,0,1,94.944,4.86Zm0,0"
        transform="translate(-81.539 -0.008)"
        fill={color}
      />
      <Path
        id="Path_2410"
        data-name="Path 2410"
        d="M12.79,256.008h-8.2A4.6,4.6,0,0,0,0,260.617v3.4a.726.726,0,0,0,.724.728H16.651a.726.726,0,0,0,.724-.728v-3.4A4.6,4.6,0,0,0,12.79,256.008Zm0,0"
        transform="translate(0 -244.741)"
        fill={color}
      />
    </Svg>
  );
};

export default React.memo(UserIcon);
