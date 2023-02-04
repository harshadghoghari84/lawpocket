import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface StarIconProps extends SvgProps {
  color: string;
}

const StarIcon = ({ color, ...props }: StarIconProps) => {
  return (
    <Svg viewBox="0 0 14 13.416" width={22} height={22} {...props}>
      <Path
        id="star-white"
        d="M13.964,5.561a.743.743,0,0,0-.641-.512L9.282,4.683,7.684.943a.744.744,0,0,0-1.368,0l-1.6,3.739L.677,5.05a.745.745,0,0,0-.422,1.3L3.309,9.03,2.408,13a.743.743,0,0,0,1.107.8L7,11.719,10.484,13.8a.744.744,0,0,0,1.107-.8l-.9-3.967,3.054-2.678a.744.744,0,0,0,.218-.791Zm0,0"
        transform="translate(0 -0.491)"
        fill={color}
      />
    </Svg>
  );
};

export default React.memo(StarIcon);
