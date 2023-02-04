import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface SubscribedIconProps extends SvgProps {
  color: string;
}

const SubscribedIcon = ({ color, ...props }: SubscribedIconProps) => {
  return (
    <Svg viewBox="0 0 18 17.182" width={22} height={22} {...props}>
      <Path
        id="Path_2950"
        data-name="Path 2950"
        d="M19,10.091,17,7.808l.278-3.019-2.954-.671L12.782,1.5,10,2.695,7.218,1.5,5.672,4.11l-2.954.663L3,7.8,1,10.091l2,2.283L2.718,15.4l2.954.671,1.546,2.61L10,17.479l2.782,1.195,1.546-2.61,2.954-.671L17,12.374ZM8.437,13.953,5.328,10.835,6.539,9.625l1.9,1.906,4.786-4.8,1.211,1.211Z"
        transform="translate(-1 -1.5)"
        fill={color}
      />
    </Svg>
  );
};

export default React.memo(SubscribedIcon);
