import * as React from 'react';
import Svg, { G, Path, SvgProps } from 'react-native-svg';

interface AppleIconProps extends SvgProps {
  color: string;
}

const AppleIcon = ({ color, ...props }: AppleIconProps) => {
  return (
    <Svg viewBox="0 0 18.045 22" width={25} height={25} {...props}>
      <G id="apple" transform="translate(-46.022)">
        <Path
          id="Path_2511"
          data-name="Path 2511"
          d="M52,134.99c-3.274-.019-5.983-6.742-5.983-10.167,0-5.593,4.171-6.818,5.779-6.818a6.617,6.617,0,0,1,2.18.539,4.852,4.852,0,0,0,1.245.359,3.858,3.858,0,0,0,.893-.291,7.124,7.124,0,0,1,2.692-.655h.006a5.505,5.505,0,0,1,4.617,2.346l.337.509-.485.368a4.106,4.106,0,0,0-1.956,3.383,3.819,3.819,0,0,0,2.118,3.53c.3.184.617.373.617.787,0,.27-2.145,6.076-5.26,6.076a4.21,4.21,0,0,1-1.776-.434,3.585,3.585,0,0,0-1.581-.383,4.048,4.048,0,0,0-1.252.341,6.1,6.1,0,0,1-2.171.51Z"
          transform="translate(0 -112.99)"
          fill={color}
        />
        <Path
          id="Path_2512"
          data-name="Path 2512"
          d="M259.206,0c.08,2.867-1.971,4.856-4.019,4.732A4.569,4.569,0,0,1,259.206,0Z"
          transform="translate(-200.093)"
          fill={color}
        />
      </G>
    </Svg>
  );
};

export default React.memo(AppleIcon);
