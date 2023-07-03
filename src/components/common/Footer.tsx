import { HiOutlineChatBubbleLeftRight, HiUserCircle, HiOutlineUserCircle, HiChatBubbleLeftRight } from "react-icons/hi2";
import { AiOutlineHeart, AiFillHeart, AiOutlineHome, AiFillHome } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  selected: boolean;
  userId: number | undefined;
}

const Footer = ({ userId }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const moveToHome = () => {
    navigate("/main");
  };

  const moveToCart = () => {
    navigate("/cart");
  };

  const moveToChat = () => {
    navigate("/chatlist");
  };

  const moveToProfile = () => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="fixed w-full bottom-0 shadow">
      <article className="flex justify-between items-center h-14 bg-white text-main-300">
        <div className="flex items-center justify-center w-full text-3xl cursor-pointer" onClick={moveToProfile}>
          {location.pathname.includes("/profile/") ? <HiUserCircle /> : <HiOutlineUserCircle />}
        </div>
        <div className="flex items-center justify-center w-full text-center text-3xl cursor-pointer" onClick={moveToCart}>
          {location.pathname.includes("/cart") ? <AiFillHeart className="text-red-400" /> : <AiOutlineHeart />}
        </div>
        <div className="flex items-center justify-center w-full text-center text-3xl cursor-pointer" onClick={moveToHome}>
          {location.pathname.includes("/main") ? <AiFillHome /> : <AiOutlineHome />}
        </div>
        <div className="flex items-center justify-center w-full text-center text-3xl cursor-pointer" onClick={moveToChat}>
          {location.pathname.includes("/chatlist") ? <HiChatBubbleLeftRight /> : <HiOutlineChatBubbleLeftRight />}
        </div>
      </article>
    </div>
  );
};

export default Footer;
