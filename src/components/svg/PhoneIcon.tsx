import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface PhoneIconProps extends SvgProps {
  color: string;
}

const PhoneIcon = ({ color, ...props }: PhoneIconProps) => {
  return (
    <Svg viewBox="0 0 11.818 20" width={18} height={18} {...props}>
      <Path
        id="Path_2910"
        data-name="Path 2910"
        d="M14.545,1H7.273A2.274,2.274,0,0,0,5,3.273V18.727A2.274,2.274,0,0,0,7.273,21h7.273a2.274,2.274,0,0,0,2.273-2.273V3.273A2.274,2.274,0,0,0,14.545,1ZM10.909,20.091a1.364,1.364,0,1,1,1.364-1.364A1.362,1.362,0,0,1,10.909,20.091ZM15,16.455H6.818V3.727H15Z"
        transform="translate(-5 -1)"
        fill={color}
      />
    </Svg>
  );
};

export default React.memo(PhoneIcon);
