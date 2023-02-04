import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface StarOutlineIconProps extends SvgProps {
  color: string;
}

const StarOutlineIcon = ({ color, ...props }: StarOutlineIconProps) => {
  return (
    <Svg viewBox="0 0 38.052 36.493" width={22} height={22} {...props}>
      <Path
        id="star-lg"
        d="M17.51,1.2l-4.394,8.909L3.285,11.54a2.154,2.154,0,0,0-1.191,3.674l7.113,6.931L7.524,31.936A2.152,2.152,0,0,0,10.647,34.2l8.795-4.623L28.236,34.2a2.154,2.154,0,0,0,3.122-2.268l-1.682-9.791,7.113-6.931A2.154,2.154,0,0,0,35.6,11.54l-9.831-1.433L21.373,1.2a2.155,2.155,0,0,0-3.862,0Z"
        transform="translate(-0.415 1.001)"
        fill="none"
        stroke={color}
        stroke-width="2"
      />
    </Svg>
  );
};

export default React.memo(StarOutlineIcon);
