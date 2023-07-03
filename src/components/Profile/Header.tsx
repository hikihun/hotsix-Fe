import { IoSettingsOutline } from "react-icons/io5";
import GoBackButton from "../common/GoBackButton";

interface ProfileProps {
  mypage: boolean;
  handleShow: () => void;
}

const Header = (props: ProfileProps) => {
  return (
    <div>
      <div className="fixed top-0 flex items-center justify-between z-50 px-4 w-full h-16 bg-main-100 shadow-md">
        <GoBackButton />
        {props.mypage && (
          <button className="border-0 text-3xl focus:outline-0 hover:border-0" onClick={props.handleShow}>
            <IoSettingsOutline />
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
