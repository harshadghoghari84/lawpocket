import * as React from 'react';
import Svg, { G, Path, SvgProps } from 'react-native-svg';

interface EditIconProps extends SvgProps {
  color: string;
}

const EditIcon = ({ color, ...props }: EditIconProps) => {
  return (
    <Svg viewBox="0 0 18 18" width={16} height={16} {...props}>
      <G id="Group_656" data-name="Group 656">
        <Path
          id="Path_961"
          data-name="Path 961"
          d="M0,78.959V82.71H3.75L14.817,71.643l-3.75-3.75Z"
          transform="translate(0 -64.71)"
          fill={color}
        />
        <Path
          id="Path_962"
          data-name="Path 962"
          d="M264.247,2.628,261.911.293a1,1,0,0,0-1.415,0l-1.83,1.83,3.75,3.75,1.83-1.83A1,1,0,0,0,264.247,2.628Z"
          transform="translate(-246.539)"
          fill={color}
        />
      </G>
    </Svg>
  );
};

export default React.memo(EditIcon);
