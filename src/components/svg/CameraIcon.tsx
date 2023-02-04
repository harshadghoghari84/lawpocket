import * as React from 'react';
import Svg, { G, Path, Rect, SvgProps } from 'react-native-svg';

interface CameraIconProps extends SvgProps {
  color: string;
}

const CameraIcon = ({ color, ...props }: CameraIconProps) => {
  return (
    <Svg viewBox="0 0 16 14.438" width={22} height={22} {...props}>
      <G id="camera" transform="translate(0 -25)">
        <G id="Group_639" data-name="Group 639" transform="translate(0 25)">
          <G id="Group_638" data-name="Group 638">
            <Path
              id="Path_2505"
              data-name="Path 2505"
              d="M135.069,157a4.069,4.069,0,1,0,4.069,4.069A4.074,4.074,0,0,0,135.069,157Zm0,6.836a2.767,2.767,0,1,1,2.767-2.767A2.77,2.77,0,0,1,135.069,163.836Z"
              transform="translate(-127.069 -153.078)"
              fill={color}
            />
            <Path
              id="Path_2506"
              data-name="Path 2506"
              d="M14.125,27.25h-2.3a.193.193,0,0,1-.172-.1l-.636-1.337-.005-.011A1.437,1.437,0,0,0,9.72,25h-3.4a1.436,1.436,0,0,0-1.292.8l-.005.011-.636,1.337a.193.193,0,0,1-.172.1H1.875A1.877,1.877,0,0,0,0,29.125v8.438a1.877,1.877,0,0,0,1.875,1.875h12.25A1.877,1.877,0,0,0,16,37.563V29.125A1.877,1.877,0,0,0,14.125,27.25Zm.625,10.312a.626.626,0,0,1-.625.625H1.875a.626.626,0,0,1-.625-.625V29.125a.626.626,0,0,1,.625-.625H4.219a1.437,1.437,0,0,0,1.292-.8l.005-.011.636-1.337a.193.193,0,0,1,.172-.1h3.4a.193.193,0,0,1,.172.1l.636,1.337.005.011a1.437,1.437,0,0,0,1.292.8h2.3a.626.626,0,0,1,.625.625Z"
              transform="translate(0 -25)"
              fill={color}
            />
            <Rect
              id="Rectangle_657"
              data-name="Rectangle 657"
              width="1"
              height="1"
              transform="translate(12.128 4.595)"
              fill={color}
            />
          </G>
        </G>
      </G>
    </Svg>
  );
};

export default React.memo(CameraIcon);
