import * as React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

const UltraSubscriptionIcon = ({ ...props }) => {
  return (
    <Svg viewBox="0 0 24 24" width={22} height={22} {...props}>
      <Circle
        id="Ellipse_2729"
        data-name="Ellipse 2729"
        cx="12"
        cy="12"
        r="12"
        fill="#999"
      />
      <Path
        id="flash"
        d="M83.829,31.966a.612.612,0,0,1-.6-.718v0l.937-5.145H80.535a.533.533,0,0,1-.415-.869L87.425,16.2a.615.615,0,0,1,1.093.457.182.182,0,0,1,0,.03l-.94,5.146H91.2a.533.533,0,0,1,.415.869l-7.306,9.031A.615.615,0,0,1,83.829,31.966Z"
        transform="translate(-74.002 -11.966)"
        fill="#fff"
      />
    </Svg>
  );
};

export default React.memo(UltraSubscriptionIcon);
