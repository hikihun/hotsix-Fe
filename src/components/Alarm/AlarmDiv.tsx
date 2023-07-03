import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineCheckCircle, AiFillCheckCircle } from "react-icons/ai";

interface isDeleteMode {
  isDeleteMode: boolean;
}

const AlarmDiv = (props: isDeleteMode) => {
  const [isDeleteBtnPushed, setIsDeleteBtnPushed] = useState(false);
  const navigate = useNavigate();

  const handleEnterClick = () => {
    navigate("/ChatLoom");
  };

  const handleDeleteClick = () => {
    setIsDeleteBtnPushed(!isDeleteBtnPushed);
  };

  const onClickHandler = props.isDeleteMode ? handleDeleteClick : handleEnterClick;
  return (
    <div className="relative w-full h-24 border-solid border-black border-b-2 " onClick={onClickHandler}>
      <div className="absolute top-1/2 left-6">사진</div>
      <div className="absolute top-1/4 left-28 ">댓글알림</div>
      <div className="absolute top-1/4 right-4 ">전</div>
      <div className="absolute top-2/3 left-28 ">알림내용</div>
      {props.isDeleteMode && (
        <div className="absolute top-14 right-2.5 ">
          {!isDeleteBtnPushed ? <AiOutlineCheckCircle className="w-6 h-6" /> : <AiFillCheckCircle className="w-6 h-6" />}
        </div>
      )}
    </div>
  );
};
// asdasd
export default AlarmDiv;
