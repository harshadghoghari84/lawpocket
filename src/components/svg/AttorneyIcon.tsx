import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface AttorneyIconProps extends SvgProps {
  color: string;
}

const AttorneyIcon = ({ color, ...props }: AttorneyIconProps) => {
  return (
    <Svg viewBox="0 0 17.641 19.673" width={20} height={20} {...props}>
      <Path
        id="Attorney"
        d="M45.156,10.01,41.069,8.258a.261.261,0,0,0-.357.1.27.27,0,0,0-.012.234l4.484,13.114a.267.267,0,0,1-.151.342.218.218,0,0,1-.111.016H39.993a.26.26,0,0,1-.262-.2L36.979,11.034a.262.262,0,0,0-.524,0L33.7,21.857a.264.264,0,0,1-.262.2H28.492a.262.262,0,0,1-.262-.353L32.713,8.592a.262.262,0,0,0-.147-.342.269.269,0,0,0-.214.008L28.269,10.01a.265.265,0,0,1-.373-.326l1.97-6.466.183-.631A.265.265,0,0,1,30.37,2.4a.243.243,0,0,1,.048.02l1.779.786L36.6,5.18a.271.271,0,0,0,.222,0l4.4-1.974L43,2.42a.265.265,0,0,1,.353.119.243.243,0,0,1,.02.048l.183.631,1.95,6.466a.269.269,0,0,1-.159.338.257.257,0,0,1-.2-.012Z"
        transform="translate(-27.879 -2.392)"
        fill={color}
      />
    </Svg>
  );
};

export default React.memo(AttorneyIcon);
