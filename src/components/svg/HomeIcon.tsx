import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface HomeIconProps extends SvgProps {
  color: string;
}

const HomeIcon = ({ color, ...props }: HomeIconProps) => {
  return (
    <Svg viewBox="0 0 20.5 20.61" width={20} height={20} {...props}>
      <Path
        id="home_2_"
        data-name="home (2)"
        d="M6.657,17.833V14.919a1.392,1.392,0,0,1,1.424-1.348h2.886A1.393,1.393,0,0,1,12.4,14.919h0v2.922A1.194,1.194,0,0,0,13.6,19h1.924A3.374,3.374,0,0,0,19,15.734h0V7.446a2.281,2.281,0,0,0-.962-1.81L11.458.651a3.313,3.313,0,0,0-3.944,0L.962,5.645A2.264,2.264,0,0,0,0,7.455v8.279A3.374,3.374,0,0,0,3.473,19H5.4a1.206,1.206,0,0,0,1.241-1.167h0"
        transform="translate(0.75 0.86)"
        fill="none"
        stroke={color}
        stroke-linecap="round"
        stroke-linejoin="round"
        strokeWidth={2}
      />
    </Svg>
  );
};

export default React.memo(HomeIcon);
