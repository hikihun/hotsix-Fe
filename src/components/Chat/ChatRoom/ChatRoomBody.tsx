import { useEffect, useRef, useState } from "react";
import { ChatUtil } from "./ChatUtil";
import { Message } from "./ChatUtil";
import { getAccessToken, getUserId, isTokenValid } from "../../API/TokenAction";

import { useParams } from "react-router-dom";
import axios from "axios";
import { partnerInfo } from "../../../pages/Chat/ChatRoomPage";
import { FaUser } from "react-icons/fa";

interface ChatUtil {
  getChats: () => Message[];
  updateChats: (newChats: Message[]) => void;
}

const ChatRoomBody = ({ chatUtil, partnerInfomation }: { chatUtil: ChatUtil; partnerInfomation: partnerInfo }) => {
  const userId = getUserId();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<HTMLLIElement>(null);
  const endRef = useRef<HTMLLIElement>(null);
  const [startIndex] = useState(0);
  const { getChats, updateChats } = chatUtil;
  const roomId = Number(useParams().chatRoomId);
  const token = getAccessToken();
  const [visibleChats, setVisibleChats] = useState<Message[]>([]);
  const [previousIndex, setpreviousIndex] = useState(0);
  const chats = getChats();

  const [imgPath, setImgPath] = useState("");
  const [nickname, setNickname] = useState("null");

  useEffect(() => {
    const checkTokenValidity = async () => {
      const isValid = await isTokenValid();
      if (isValid) {
        axios({
          method: "get",
          url: `http://localhost:8080/api/chat/room/${roomId}`,
          headers: {
            Authorization: `${token}`,
          },
        })
          .then((response) => {
            console.log("이전기록요청성공!!");

            updateChats(response.data);
            console.log(getChats()); 
          })
          .catch((error) => {
            console.error(error);
          });
        console.log("^^^^^^^^^^^^^^^^");
        console.log(getChats());
      }
    };

    checkTokenValidity();
  }, []);

  useEffect(() => {
    if (partnerInfomation.nickname !== null) {
      setImgPath(partnerInfomation.imgPath);

      setNickname(partnerInfomation.nickname);
    }
  }, [partnerInfomation]);

  useEffect(() => {
    if (getChats().length > 0) {

      console.log(getChats().length);
      setpreviousIndex(chats.length);
      
    }
  }, [getChats()]);

  useEffect(() => {
    console.log(chats.length);
    setpreviousIndex(chats.length);

  }, [chats, previousIndex]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [visibleChats]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    });

    if (startRef.current) {
      observer.observe(startRef.current);
    }
    if (endRef.current) {
      observer.observe(endRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleNewMessage = (newChats: Message[]) => {

      const visibleChats = newChats.slice(startIndex);
      setVisibleChats(visibleChats);
    };

    const chats = getChats();
    if (getChats().length > 0) {
      handleNewMessage(chats);
    }
  }, [getChats(), startIndex]);

  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        //스크롤이 화면 맨위로 올라갔을때

        console.log(getChats().length);
        console.log(getChats()); 
        //loadPreviousChats();
      }
    });
  };

  // const loadPreviousChats = () => {
  //   console.log(previousIndex);
  //   if (previousIndex - 40 >= 0) {
  //     setpreviousIndex((previousIndex: number) => previousIndex - 40);
  //     setStartIndex((prevStartIndex) => prevStartIndex - 40);
  //   } else {
  //     setStartIndex(0);
  //   }
  // };

  return (
    <div ref={chatContainerRef} className="relative flex-grow overflow-hidden" style={{ overflowY: "scroll" }}>
      <div className="w-full h-full">
        <div className="relative flex-grow">
          <div className="h-full max-h-full overflow-y-auto ">
            <ul>
              <li ref={startRef}></li>
              {visibleChats.map((message, index) => {
                /////////////////날짜 표시하는 로직
                let targetTime = "";
                targetTime = new Date(chats[index].createdAt as string).toLocaleDateString();
                let [year, month, day] = "";
                if (index === 0) {
                  [year, month, day] = targetTime.split(".");
                }
                if (index !== chats.length - 1) {
                  const isCreated = new Date(chats[index].createdAt as string).toLocaleDateString();
                  const nextCreated = new Date(chats[index+1].createdAt as string).toLocaleDateString();
                  if (isCreated !== nextCreated) {
                    targetTime = new Date(chats[index + 1].createdAt as string).toLocaleDateString();
                    [year, month, day] = targetTime.split(".");
                  }
                }
                ////////내 채팅이면 true 상대채팅이면 false
                const isMyChat = message.senderId === userId;
                return (
                  <ChatMessage
                    key={index}
                    message={message}
                    targetYear={year}
                    targetDay={day}
                    targetMonth={month}
                    imgPath={imgPath}
                    nickname={nickname}
                    isMyChat={isMyChat}
                  />
                );
              })}
              <li ref={endRef}></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatMessage = ({
  message,
  isMyChat,
  imgPath,
  nickname,
  targetDay,
  targetMonth,
  targetYear,
}: {
  targetYear:string;
  targetMonth: string;
  targetDay: string;
  message: Message;
  isMyChat: boolean;
  imgPath: string;
  nickname: string;
}) => {
  if (!message) {
    return null;
  } else {
    const targetDate = new Date(message.createdAt as string);
    let isSameDay = true;
    if (targetYear !== undefined) {
      isSameDay = false;
    }
    const hours = targetDate.getHours();
    const minutes = targetDate.getMinutes();
    return (
      <>
        {!isSameDay ? (
          <div className="text-center">
            {targetMonth}월{targetDay}일
          </div>
        ) : null}
        <li className={`relative h-auto items-end my-4 flex  ${isMyChat ? "flex-row-reverse" : "flex-row"}`}>
          {isMyChat ? (
            <>
              <span className="flex justify-center items-center inline-flex flex-col px-3 py-1 mx-1 my-1 max-w-4/5 rounded-md bg-white break-all ">
                {message.message}
              </span>
              <span className="ml-1 font-light text-sm ">
                {hours}:{minutes}
              </span>
            </>
          ) : (
            <>
              
              {imgPath.length ? (
                <img className="rounded-full ml-1 w-12 h-12" src={imgPath} alt="" />
              ) : (
                <div className={"flex top-3 justify-center rounded-full items-center pt-3  ml-1 w-12 h-12 border-2 text-4xl text-main-200 bg-white overflow-hidden "}>
                  <FaUser />
                </div>
              )}
              
              
              
              <div className="ml-4 max-w-4/5">
                <div className="mb-1">{nickname}</div>
                <span className="inline-flex flex-col rounded-md mx-1 my-1 px-1 py-1 bg-gray-300 break-all   ">{message.message}</span>
                <span className="mr-1 font-light text-sm ">
                  {hours}:{minutes}
                </span>
              </div>
            </>
          )}
        </li>
      </>
    );
  }
};

export { ChatRoomBody };
