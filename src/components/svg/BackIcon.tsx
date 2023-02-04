import * as React from 'react';
import Svg, { G, Path, SvgProps } from 'react-native-svg';

interface BackIconProps extends SvgProps {
  color: string;
}

const BackIcon = ({ color, ...props }: BackIconProps) => {
  return (
    <Svg viewBox="0 0 16 15.595" width={16} height={16} {...props}>
      <G id="back" transform="translate(0 -1)">
        <Path
          id="icon-arrow-left"
          d="M9.194,17.2,8.4,17.99a.854.854,0,0,1-1.211,0L.248,11.052a.854.854,0,0,1,0-1.211L7.19,2.9A.854.854,0,0,1,8.4,2.9l.793.793a.858.858,0,0,1-.014,1.225l-4.3,4.1H15.139A.855.855,0,0,1,16,9.873v1.143a.855.855,0,0,1-.857.857H4.876l4.3,4.1A.852.852,0,0,1,9.194,17.2Z"
          transform="translate(0.004 -1.647)"
          fill={color}
        />
      </G>
    </Svg>
  );
};

export default React.memo(BackIcon);
