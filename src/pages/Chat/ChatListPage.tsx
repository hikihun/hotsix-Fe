import HeaderDeleteMode from "../../components/Chat/ChatList/HeaderDeleteMode";
import ChatList from "../../components/Chat/ChatList/ChatList";
import { useState } from "react";
import Footer from "../../components/common/Footer";
import ChatListHeader from "../../components/Chat/ChatList/ChatListHeader";
import { getUserId } from "../../components/API/TokenAction";

const ChatListPage = () => {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [allSelect, setAllSelect] = useState(false);
  const [filter, setFilter] = useState("");
  const userId = getUserId();

  const DeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-main-100">
      {isDeleteMode ? (
        <>
          <HeaderDeleteMode DeleteMode={DeleteMode} allSelect={allSelect} setAllSelect={setAllSelect} />
        </>
      ) : (
        <>
          <ChatListHeader DeleteMode={DeleteMode} filter={filter} setFilter={setFilter} />
          <Footer userId={userId} selected={false} />
        </>
      )}
      <ChatList isDeleteMode={isDeleteMode} allSelect={allSelect} setAllSelect={setAllSelect} filter={filter} />
    </div>
  );
};

export default ChatListPage;
