import * as React from 'react';
import Svg, { G, Path, SvgProps } from 'react-native-svg';

interface ChatCloseIconProps extends SvgProps {
  color: string;
}

const ChatCloseIcon = ({ color, ...props }: ChatCloseIconProps) => {
  return (
    <Svg viewBox="0 0 18.93 18.93" width={18} height={18} {...props}>
      <G
        id="Group_10551"
        data-name="Group 10551"
        transform="translate(-375 -52)"
      >
        <Path
          id="chat_1_"
          data-name="chat (1)"
          d="M27.464,36.93H18.591a.591.591,0,0,1-.418-1.01l2.193-2.193a9.465,9.465,0,1,1,7.1,3.2Zm-7.445-1.183h7.445a8.282,8.282,0,1,0-5.856-2.426.592.592,0,0,1,.173.418C21.781,33.9,21.719,34.046,20.019,35.746Z"
          transform="translate(357.001 34)"
          fill={color}
        />
        <Path
          id="Icon_ionic-ios-close"
          data-name="Icon ionic-ios-close"
          d="M14.432,13.833l1.817-1.818a.426.426,0,1,0-.6-.6L13.83,13.23l-1.817-1.818a.426.426,0,1,0-.6.6l1.817,1.818L11.41,15.65a.426.426,0,0,0,.6.6l1.817-1.818,1.817,1.818a.426.426,0,0,0,.6-.6Z"
          transform="translate(370.715 47.711)"
          fill={color}
        />
      </G>
    </Svg>
  );
};

export default React.memo(ChatCloseIcon);
