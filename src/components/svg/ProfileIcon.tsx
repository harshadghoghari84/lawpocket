import * as React from 'react';
import Svg, { Circle, Path, SvgProps } from 'react-native-svg';

interface ProfileIconProps extends SvgProps {
  color: string;
}

const ProfileIcon = ({ color, ...props }: ProfileIconProps) => {
  return (
    <Svg viewBox="0 0 16 15.238" width={18} height={18} {...props}>
      <Path
        id="Path_653"
        data-name="Path 653"
        d="M134.266,21.975a4.28,4.28,0,1,0-4.279-4.286A4.283,4.283,0,0,0,134.266,21.975Zm0-7.442a3.156,3.156,0,1,1-3.15,3.156A3.162,3.162,0,0,1,134.266,14.533Z"
        transform="translate(-126.292 -13.415)"
        fill={color}
      />
      <Path
        id="Path_654"
        data-name="Path 654"
        d="M.565,346.869h14.87A.561.561,0,0,0,16,346.3a5.382,5.382,0,0,0-5.373-5.378H5.373A5.382,5.382,0,0,0,0,346.3.561.561,0,0,0,.565,346.869Zm4.808-4.812h5.255a4.242,4.242,0,0,1,4.2,3.681H1.169A4.253,4.253,0,0,1,5.373,342.057Z"
        transform="translate(0 -331.631)"
        fill={color}
      />
      <Circle
        id="Ellipse_2678"
        data-name="Ellipse 2678"
        cx="4"
        cy="4"
        r="4"
        transform="translate(4 0)"
        fill={color}
      />
      <Path
        id="Path_2695"
        data-name="Path 2695"
        d="M.638,28.028l1.15-3.05,2.8-1.7h7.1l3,2.1.6,2.1v.55Z"
        transform="translate(0 -13.415)"
        fill={color}
      />
    </Svg>
  );
};

export default React.memo(ProfileIcon);
