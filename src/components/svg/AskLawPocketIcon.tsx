import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface AskLawPocketProps extends SvgProps {
  color: string;
}

const AskLawPocket = ({ color, ...props }: AskLawPocketProps) => {
  return (
    <Svg viewBox="0 0 82.75 82.388" width={20} height={20} {...props}>
      <Path
        id="Exclusion_4"
        data-name="Exclusion 4"
        d="M46.916,82.388H0V75.821H46.916v6.568Zm24.889-2.316,0,0-54.676-53.6L28.078,15.752,82.751,69.365,71.809,80.07ZM22.893,64.1l0,0L1.013,42.665,11.954,31.951l21.88,21.433L22.9,64.095ZM55.507,32.146l0,0L33.622,10.719,44.561,0,66.45,21.427,55.51,32.144Z"
        transform="translate(-0.001)"
        fill={color}
      />
    </Svg>
  );
};

export default React.memo(AskLawPocket);
