import * as React from 'react';
import Svg, { G, Path, SvgProps } from 'react-native-svg';

interface LockIconProps extends SvgProps {
  color: string;
}

const LockIcon = ({ color, ...props }: LockIconProps) => {
  return (
    <Svg viewBox="0 0 13.747 19.373" width={20} height={20} {...props}>
      <G id="password" transform="translate(-0.627)">
        <Path
          id="Path_2429"
          data-name="Path 2429"
          d="M28.5,219.28H17.25A1.252,1.252,0,0,1,16,218.027v-8.773A1.252,1.252,0,0,1,17.25,208H28.5a1.252,1.252,0,0,1,1.25,1.253v8.773A1.252,1.252,0,0,1,28.5,219.28Zm0,0"
          transform="translate(-15.373 -199.907)"
          fill={color}
        />
        <Path
          id="Path_2432"
          data-name="Path 2432"
          d="M73.362,8.774a.626.626,0,0,1-.624-.627V5.013a3.745,3.745,0,1,0-7.49,0V8.147a.624.624,0,1,1-1.248,0V5.013a4.993,4.993,0,1,1,9.987,0V8.147A.626.626,0,0,1,73.362,8.774Zm0,0"
          transform="translate(-61.493)"
          fill={color}
        />
      </G>
    </Svg>
  );
};

export default React.memo(LockIcon);
