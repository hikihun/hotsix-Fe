import GoBackButton from "../common/GoBackButton";

const Header = () => {
  return (
    <div>
      <div className="fixed top-0 flex items-center justify-start px-3 w-full h-16 bg-main-100 shadow">
        <GoBackButton />
      </div>
    </div>
  );
};

export default Header;
