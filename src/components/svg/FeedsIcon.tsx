import * as React from 'react';
import Svg, { G, Path, SvgProps } from 'react-native-svg';

interface FeedsIconProps extends SvgProps {
  color: string;
}

const FeedsIcon = ({ color, ...props }: FeedsIconProps) => {
  return (
    <Svg width={20} height={20} viewBox="0 0 32 32" {...props}>
      <G
        fill="none"
        stroke={color}
        strokeLinejoin="round"
        strokeWidth={2}
        strokeMiterlimit={10}
      >
        <Path d="M25 3V1H3v28a2 2 0 0 0 2 2h22a2 2 0 0 0 2-2V3h-4z" />
        <Path d="M7 5h14v6H7zm18-2v21m0 2v2M6 15h16M6 19h16M6 23h12" />
      </G>
    </Svg>
  );
};

export default React.memo(FeedsIcon);
