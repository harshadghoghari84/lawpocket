import * as React from 'react';
import Svg, { G, Path, SvgProps } from 'react-native-svg';

interface PocketIconProps extends SvgProps {
  color: string;
}

const PocketIcon = ({ color, ...props }: PocketIconProps) => {
  return (
    <Svg viewBox="0 0 22.398 20.359" width={18} height={18} {...props}>
      <G id="pocket" transform="translate(1 1)">
        <Path
          id="Path_3019"
          data-name="Path 3019"
          d="M2.04,0H18.359A2.04,2.04,0,0,1,20.4,2.04v6.12a10.2,10.2,0,0,1-20.4,0V2.04A2.04,2.04,0,0,1,2.04,0Z"
          fill="none"
          stroke={color}
          stroke-linecap="round"
          stroke-linejoin="round"
          strokeWidth={2}
          fill-rule="evenodd"
        />
        <Path
          id="Path_3020"
          data-name="Path 3020"
          d="M6,7l4.08,4.08L14.159,7"
          transform="translate(0.12 0.139)"
          fill="none"
          stroke={color}
          stroke-linecap="round"
          stroke-linejoin="round"
          strokeWidth={2}
          fill-rule="evenodd"
        />
      </G>
    </Svg>
  );
};

export default React.memo(PocketIcon);
