import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface ChatIconProps extends SvgProps {
  color: string;
}

const ChatIcon = ({ color, ...props }: ChatIconProps) => {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" {...props}>
      <Path
        fill="none"
        stroke={color}
        strokeWidth={2}
        d="M19 1H5a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h12l6 5V5a4 4 0 0 0-4-4Zm0 6H6m13 4h-9"
      />
    </Svg>
  );
};

export default React.memo(ChatIcon);
