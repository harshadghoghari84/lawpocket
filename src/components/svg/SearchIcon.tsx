import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface SearchIconProps extends SvgProps {
  color: string;
}

const SearchIcon = ({ color, ...props }: SearchIconProps) => {
  return (
    <Svg viewBox="0 0 17.848 18.4" width={18} height={18} {...props}>
      <Path
        id="search"
        d="M18.1,16.4,13.814,11.94a7.265,7.265,0,1,0-5.562,2.6,7.19,7.19,0,0,0,4.164-1.315l4.317,4.489A.948.948,0,1,0,18.1,16.4ZM8.251,1.9A5.372,5.372,0,1,1,2.88,7.267,5.378,5.378,0,0,1,8.251,1.9Z"
        transform="translate(-0.784 0.2)"
        fill={color}
        stroke={color}
        stroke-width="0.4"
      />
    </Svg>
  );
};

export default React.memo(SearchIcon);
