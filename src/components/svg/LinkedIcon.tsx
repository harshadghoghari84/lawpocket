import * as React from 'react';
import Svg, { Circle, G, Path, Rect, SvgProps } from 'react-native-svg';

interface LinkedinIconProps extends SvgProps {
  color: string;
}

const LinkedIcon = ({ color, ...props }: LinkedinIconProps) => {
  return (
    <Svg viewBox="0 0 19.343 20.374" width={22} height={22} {...props}>
      <G
        id="_2959747_employment_business_linkedin_work_icon"
        data-name="2959747_employment_business_linkedin_work_icon"
        transform="translate(-20.062 -19.698)"
      >
        <Rect
          id="Rectangle_1654"
          data-name="Rectangle 1654"
          width="4.244"
          height="15.099"
          transform="translate(20.062 24.955)"
          fill={color}
        />
        <Path
          id="Path_3009"
          data-name="Path 3009"
          d="M63.043,50.4c-3.636,0-3.7,2.1-3.7,2.247V50.4H55V65.5h4.342V56.88A1.97,1.97,0,0,1,61.6,54.76a2,2,0,0,1,2.037,2.073v8.684h4.295V56.11C67.928,51.648,65.493,50.4,63.043,50.4Z"
          transform="translate(-28.522 -25.445)"
          fill={color}
        />
        <Circle
          id="Ellipse_2731"
          data-name="Ellipse 2731"
          cx="2.12"
          cy="2.12"
          r="2.12"
          transform="translate(20.062 19.698)"
          fill={color}
        />
      </G>
    </Svg>
  );
};

export default React.memo(LinkedIcon);
