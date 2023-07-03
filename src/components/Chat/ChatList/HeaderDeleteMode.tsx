import { AiFillCheckCircle, AiOutlineCheckCircle } from "react-icons/ai";
import { IoArrowBackOutline } from "react-icons/io5";

interface HeaderDeleteModeProps {
  DeleteMode: () => void;
  allSelect: boolean;
  setAllSelect: (value: React.SetStateAction<boolean>) => void;
}

const HeaderDeleteMode = (props: HeaderDeleteModeProps) => {
  const { DeleteMode, allSelect, setAllSelect } = props;

  const onClickBackBtn = () => {
    DeleteMode();
  };

  const clickAllSelect = () => {
    setAllSelect(true);
  };

  return (
    <div className="flex justify-between items-center h-14 px-4 py-2 shadow-md">
      <div className="flex justify-between">
        <div className="flex items-center">
          <div className="flex justify-center hover:cursor-pointer" onClick={onClickBackBtn}>
            <IoArrowBackOutline />
          </div>
          <h2 className="ml-4">채팅</h2>
        </div>
      </div>
      {!allSelect ? (
        <button className="flex justify-center items-center border-none text-main-400 hover:border-none focus:outline-none" onClick={clickAllSelect}>
          <AiOutlineCheckCircle className="w-6 h-6" />
        </button>
      ) : (
        <button className="flex justify-center items-center border-none text-main-400 hover:border-none focus:outline-none">
          <AiFillCheckCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default HeaderDeleteMode;
