import GoBackButton from "../common/GoBackButton";

const Header = () => {
  return (
    <div className="fixed top-0 flex items-center z-50 justify-between px-4 w-full h-16 bg-main-100 shadow-md">
      <GoBackButton />
    </div>
  );
};

export default Header;
