import * as React from 'react';
import Svg, { Circle, G, Path } from 'react-native-svg';

const PlusIcon = ({ ...props }) => {
  return (
    <Svg viewBox="0 0 24 24" width={22} height={22} {...props}>
      <G id="plus" transform="translate(-20 -130)">
        <Circle
          id="Ellipse_2728"
          data-name="Ellipse 2728"
          cx="12"
          cy="12"
          r="12"
          transform="translate(20 130)"
          fill="#999"
        />
        <G id="grid_goldenratio_black_24dp" transform="translate(23 133)">
          <G
            id="Group_10108"
            data-name="Group 10108"
            transform="translate(2 2)"
          >
            <G id="Group_10107" data-name="Group 10107">
              <Path
                id="Path_3001"
                data-name="Path 3001"
                d="M16,8.3V6.9H11.1V2H9.7V6.9H8.3V2H6.9V6.9H2V8.3H6.9V9.7H2v1.4H6.9V16H8.3V11.1H9.7V16h1.4V11.1H16V9.7H11.1V8.3ZM9.7,9.7H8.3V8.3H9.7Z"
                transform="translate(-2 -2)"
                fill="#fff"
              />
            </G>
          </G>
        </G>
      </G>
    </Svg>
  );
};

export default React.memo(PlusIcon);
