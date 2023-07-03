import { ChangeEvent, useState } from "react";
import { BiSearch } from "react-icons/bi";
import GoBackButton from "../../common/GoBackButton";

interface ChatListHeaderProps {
  DeleteMode: () => void;
  filter: string;
  setFilter: (value: React.SetStateAction<string>) => void;
}

const ChatListHeader = (props: ChatListHeaderProps) => {
  const { filter, setFilter } = props;
  const [search, setSearch] = useState(false);

  /* const onClickTrashBtn = () => {
    DeleteMode();
  }; */

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  return (
    <>
      <header className="fixed top-0 flex flex-col justify-between items-center w-full z-50 bg-main-100 shadow-md">
        <div className="flex justify-between items-center w-full h-16 px-4">
          <div className="flex">
            <GoBackButton />
            <h2 className="ml-4 text-lg">채팅</h2>
          </div>
          <button
            className="flex justify-center items-center text-2xl hover:cursor-pointer hover:border-0 focus:outline-none"
            onClick={() => setSearch(!search)}
          >
            <BiSearch />
          </button>
          {/* <button className="flex justify-center items-center hover:cursor-pointer hover:border-0 focus:outline-none" onClick={onClickTrashBtn}>
          <BsFillTrash3Fill />
        </button> */}
        </div>
      </header>
      {search && (
        <input className="fixed top-14 px-4 py-3 shadow-sm w-full z-40" value={filter} placeholder="닉네임을 입력하세요" onChange={handleChange} />
      )}
    </>
  );
};

export default ChatListHeader;
