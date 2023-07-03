import { useEffect, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { partnerInfo } from "../../../pages/Chat/ChatRoomPage";
import { FaUser } from "react-icons/fa";

const ChatRoomHeader = ({ partnerInfomation }: { partnerInfomation: partnerInfo }) => {
  const navigate = useNavigate();
  
  
  const [imgPath, setImgPath] = useState("");
  const [nickname, setNickname] = useState("null");
  const onClickBackBtn = () => {
    navigate(-1);
  };

  useEffect(() => {
    if(partnerInfomation.nickname !== null)
    {
      setImgPath(partnerInfomation.imgPath);
      
      setNickname(partnerInfomation.nickname);
    }
  },[partnerInfomation]);

  return (
    <div className="flex justify-between items-center h-16 px-3 border-solid border-black shadow-md">
      <div className="flex items-center p-4">
        <div className="hover:cursor-pointer" onClick={onClickBackBtn}>
          <IoArrowBackOutline></IoArrowBackOutline>
        </div>
        
        {imgPath.length ? (
                <img className="rounded-full ml-4 w-12 h-12" src={imgPath} alt="" />
              ) : (
                <div className={"flex rounded-full justify-center items-center pt-3 ml-4 w-12 h-12 bg-white text-4xl text-main-200  overflow-hidden "}>
                  <FaUser />
                </div>
              )}
        {/* <img className="ml-4 w-12 h-12 border-2 rounded-full" src={imgPath} alt="" /> */}
      </div>
      <div className="mr-4">{nickname}</div>
    </div>
  );
};

export { ChatRoomHeader };
