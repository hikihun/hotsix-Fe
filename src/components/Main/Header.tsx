import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const moveToHome = () => {
    window.scrollTo({ top: 0, behavior: "auto" });
    navigate("/main");
  };
  return (
    <div className="fixed w-full z-20 top-0 left-0 shadow bg-main-100">
      <div className="flex flex-row justify-between items-center h-16 px-3 ">
        <img src="public/logo.png" className="w-16 cursor-pointer" onClick={moveToHome} />
      </div>
    </div>
  );
};

export default Header;
