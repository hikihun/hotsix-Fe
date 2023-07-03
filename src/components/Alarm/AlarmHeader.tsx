import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { BsFillTrash3Fill } from "react-icons/bs";

interface DeleteMode {
  DeleteMode: () => void;
}

const AlarmHeader = (props: DeleteMode) => {
  const navigate = useNavigate();

  const onClickBackBtn = () => {
    navigate(-1);
  };

  const onClickTrashBtn = () => {
    props.DeleteMode();
  };

  return (
    <div className="flex justify-between items-center h-24 border-solid border-black border-b-2">
      <div className="flex items-center p-4">
        <div className="hover:cursor-pointer" onClick={onClickBackBtn}>
          <IoArrowBackOutline></IoArrowBackOutline>
        </div>
        <h2 className="ml-4">알림</h2>
      </div>
      <BsFillTrash3Fill className="mr-4" onClick={onClickTrashBtn}></BsFillTrash3Fill>
    </div>
  );
};

export default AlarmHeader;
