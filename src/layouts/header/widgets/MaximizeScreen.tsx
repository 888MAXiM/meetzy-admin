import { useState } from "react";
import SvgIcon from "../../../shared/icons/SvgIcon";

const MaximizeScreen = () => {
  const [fullScreen, setFullScreen] = useState<boolean>(false);

  const fullScreenHandler = (isFullScreen: boolean) => {
    setFullScreen(isFullScreen);
    if (isFullScreen) {
      document.documentElement.requestFullscreen();
    } else {
      document?.exitFullscreen();
    }
  };
  return (
    <li className="fullscreen-body">
      <span>
        <SvgIcon onClick={() => fullScreenHandler(!fullScreen)} iconId="full-screen" />
      </span>
    </li>
  );
};

export default MaximizeScreen;
