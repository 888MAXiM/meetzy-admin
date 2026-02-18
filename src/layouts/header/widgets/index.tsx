import { Col } from "reactstrap";
import Language from "./Language";
import MaximizeScreen from "./MaximizeScreen";
import MoonLight from "./MoonLight";
import Profile from "./Profile";

const RightHeader = () => {
  return (
    <Col xxl={7} xl={6} md={7} xs={8} className="nav-right pull-right right-header p-0 ms-auto">
      <ul className="nav-menus">
        <Language />
        <MaximizeScreen />
        <MoonLight />
        <Profile />
      </ul>
    </Col>
  );
};

export default RightHeader;
