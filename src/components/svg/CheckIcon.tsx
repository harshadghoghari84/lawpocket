import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface CheckIconProps extends SvgProps {
  color: string;
}

const CheckIcon = ({ color, ...props }: CheckIconProps) => {
  return (
    <Svg viewBox="0 0 20 14.553" width={16} height={16} {...props}>
      <Path
        id="check"
        d="M19.414,58.6,8.863,69.155a2,2,0,0,1-2.831,0L.586,63.708a2,2,0,0,1,2.83-2.831l4.032,4.032,9.135-9.135A2,2,0,0,1,19.414,58.6Z"
        transform="translate(0 -55.188)"
        fill={color}
      />
    </Svg>
  );
};

export default React.memo(CheckIcon);
