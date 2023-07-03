import { ChatRoomHeader } from "../../components/Chat/ChatRoom/ChatRoomHeader";
import ChatInput2 from "../../components/Chat/ChatRoom/ChatInput2";
import { ChatRoomBody } from "../../components/Chat/ChatRoom/ChatRoomBody";
import { ChatUtil } from "../../components/Chat/ChatRoom/ChatUtil";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export interface partnerInfo{
  imgPath:string,
  nickname:string
}


function ChatRoomPage() {
  const chatUtil = ChatUtil();
  const location = useLocation();

  const [imgPath, setImgPath] = useState("");
  const [nickname, setNickname] = useState("null");

  useEffect(() => {
    const partnerInfo = location.state;
    setImgPath(partnerInfo.imgPath);
    setNickname(partnerInfo.nickname);
  },[]);

  const partnerInfomation :partnerInfo ={
    imgPath:imgPath,
    nickname:nickname
  };

  return (
    <div className="absolute flex flex-col w-full h-screen bg-main-100">
      <ChatRoomHeader partnerInfomation={partnerInfomation}/>
      <ChatRoomBody chatUtil={chatUtil} partnerInfomation={partnerInfomation} />
      <ChatInput2 chatUtil={chatUtil} />
    </div>
  );
}

export default ChatRoomPage;
