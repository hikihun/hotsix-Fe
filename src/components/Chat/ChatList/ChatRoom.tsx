import { useNavigate } from "react-router-dom";
import { AiOutlineCheckCircle, AiFillCheckCircle } from "react-icons/ai";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import utility from "../../../utils/utils";

interface ChatRoomType {
  lastMessage: string;
  partner: {
    membershipId: number;
    imgPath: string;
    nickname: string;
  };
  chatRoomId: number;
  lastTime: string;
}

interface isDeleteMode {
  allSelect: boolean;
  chat: ChatRoomType;
  isDeleteMode: boolean;
  setDeleteList: (value: React.SetStateAction<number[]>) => void;
  setAllSelect: (value: React.SetStateAction<boolean>) => void;
}

const ChatRoom = (props: isDeleteMode) => {
  const navigate = useNavigate();
  const { chat, isDeleteMode, setDeleteList, allSelect, setAllSelect } = props;
  const [isDeleteBtnChecked, setIsDeleteBtnChecked] = useState(false);

  useEffect(() => {
    if (allSelect) {
      setIsDeleteBtnChecked(true);
    }
  }, [allSelect]);

  const clickChatRoom = () => {
    if (isDeleteMode) return null;
    navigate(`/chat/${chat.chatRoomId}`, { state: chat.partner });
  };

  const checkDeleteBtn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (isDeleteBtnChecked) {
      setDeleteList((prev) => {
        return prev.filter((roomId) => roomId !== chat.chatRoomId);
      });
      setIsDeleteBtnChecked(false);
      if (allSelect) {
        setAllSelect(false);
      }
    } else {
      setDeleteList((prev) => [...prev, chat.chatRoomId]);
      setIsDeleteBtnChecked(true);
    }
  };

  return (
    <div className="flex justify-between items-center border-solid border-b-2 border-gray-300 p-3 w-full h-20 font-normal" onClick={clickChatRoom}>
      <div className="flex justify-center items-center gap-3">
        {isDeleteMode && (
          <button
            className="flex justify-center items-center border-none text-main-400 hover:border-none focus:outline-none"
            onClick={checkDeleteBtn}
          >
            {!isDeleteBtnChecked ? <AiOutlineCheckCircle className="w-6 h-6" /> : <AiFillCheckCircle className="w-6 h-6" />}
          </button>
        )}
        <div className="relative flex justify-center items-center w-12 h-12 border-2 shrink-0 rounded-full bg-white overflow-hidden">
          {chat.partner.imgPath.length ? (
            <img src={chat.partner.imgPath} className="w-full h-full object-cover" />
          ) : (
            <div className={"absolute top-3 flex justify-center items-center text-4xl text-main-200"}>
              <FaUser />
            </div>
          )}
        </div>
        <div className="mt-0.5 ">
          <div className="font-semibold">{chat.partner.nickname}</div>
          <div className="text-sm w-40 overflow-hidden text-ellipsis whitespace-nowrap">{chat.lastMessage}</div>
        </div>
      </div>
      <div className="mr-1 w-14">
        <div className="flex justify-center items-center gap-2">
          <div className="text-sm">{utility.getDiffTime(chat.lastTime)}</div>
          {/* <div className="flex text-sm">
            <span className="flex justify-center items-center bg-main-400 rounded-full px-2 py-1 text-white text-sm font-normal leading-none">
              {3 > 999 ? "999+" : 3}
            </span>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
