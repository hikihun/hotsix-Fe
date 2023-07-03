import { useState, useEffect } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { GoKebabHorizontal } from "react-icons/go";
import PostToolButtons from "../common/PostToolButtons";
import { FaUser } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { GiFemale, GiMale } from "react-icons/gi";
import { AiOutlineCalendar } from "react-icons/ai";
import { JsonConfig } from "../API/AxiosModule";
import { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";

interface boardProps {
  postId: number;
  nickName: string;
  address: string;
  likesFlag: boolean;
  userFile: string;
  createdAt: string;
  gender: number;
  content: string;
  roomFiles: string;
  commentCount: string;
  memberId: number;
}

interface Props {
  userId: number | undefined;
  board: {
    postId: number;
    nickName: string;
    address: string;
    likesFlag: boolean;
    userFile: string;
    createdAt: string;
    gender: number;
    content: string;
    roomFiles: string;
    commentCount: string;
    memberId: number;
  };
  boardList: {
    postId: number;
    nickName: string;
    address: string;
    likesFlag: boolean;
    userFile: string;
    createdAt: string;
    gender: number;
    content: string;
    roomFiles: string;
    commentCount: string;
    memberId: number;
  }[];
  setBoardList: Dispatch<SetStateAction<boardProps[]>>;
}

const BoardCard: React.FC<Props> = ({ userId, board, boardList, setBoardList }: Props) => {
  const [like, setLike] = useState<boolean | null>();
  const [showPostButtons, setShowPostButtons] = useState<boolean>(false);
  const navigate = useNavigate();
  //좋아요 상태 최신화
  useEffect(() => {
    setLike(board.likesFlag);
  }, [board.likesFlag]);
  // console.log("boardLikes :", board.likesFlag);
  // console.log("Likes :", like);

  const postButtonOpen = (e: React.TouchEvent<HTMLButtonElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowPostButtons(true);
  };

  const onClickHeart = (e: React.TouchEvent<HTMLButtonElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!like) {
      JsonConfig("post", `api/likes/${board.postId}/${userId}`, null, undefined).then((res) => {
        console.log(res);
        setBoardList(
          boardList.map((b) => {
            console.log(b);
            return b.postId === board.postId ? { ...b, likesFlag: true } : b;
          })
        );
      });
    } else if (like) {
      JsonConfig("delete", `api/likes/${board.postId}/${userId}`, null, undefined).then((res) => {
        console.log(res);
        setBoardList(
          boardList.map((b) => {
            console.log(b);
            return b.postId === board.postId ? { ...b, likesFlag: false } : b;
          })
        );
      });
    }
  };
  const onClickBoard = () => {
    navigate(`/detail/${board.postId}`);
  };

  return (
    <>
      <div className="mt-6" onClick={onClickBoard}>
        <div className="relative bg-white rounded-lg m-4 p-4 drop-shadow-xl">
          <section className="cursor-pointer">
            <article className="flex ">
              <div className="flex items-start justify-between w-full">
                <div className="flex items-center gap-2 ">
                  <div className="relative flex justify-center items-center w-12 h-12 border-2 rounded-full bg-white text-black overflow-hidden">
                    {board.userFile !== "" ? (
                      <img className="w-full h-full object-cover" src={board.userFile} alt={`${board.nickName}의 프로필 이미지`} />
                    ) : (
                      <div className={"absolute top-3 flex justify-center items-center text-4xl text-main-200"}>
                        <FaUser />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center text-base font-semibold text-black">
                      {board.nickName}
                      <div className=" text-base ml-0.5">
                        {" "}
                        {board.gender === 1 ? <GiMale className="text-blue-400" /> : <GiFemale className="text-red-400" />}
                      </div>
                    </div>
                  </div>
                </div>
                {userId === board.memberId && (
                  <button className="relative p-2 border-0 text-lg rounded-full focus:outline-0 hover:bg-main-200" onClick={postButtonOpen}>
                    <GoKebabHorizontal />
                  </button>
                )}
              </div>
            </article>

            <article className="my-3 text-sm">
              <div className="text-gray-400 text-xs">
                <div className="flex flex-col text-xs">
                  <div className="flex items-center gap-1 mr-1">
                    <FiMapPin className="text-main-400" /> {board.address}
                  </div>
                  <div className="flex items-center gap-1">
                    <AiOutlineCalendar className="text-main-400" />
                    {board.createdAt}
                  </div>
                </div>
              </div>
              <div className="mt-1 break-all two-line"> {board.content}</div>
            </article>
          </section>

          {board.roomFiles !== "" && (
            <div className="w-full inline-flex flex-col items-center justfiy-center mb-3">
              <img src={board.roomFiles} className="w-full h-60 object-cover rounded-lg" draggable="false" />
            </div>
          )}

          <section className="flex justify-between items-center px-1">
            <article className="flex items-center">
              <div className="text-main-300">
                <BiComment className="text-2xl cursor-pointer" />
              </div>
              <div className="ml-1">{board.commentCount}</div>
            </article>

            <article className="flex">
              {like ? (
                <AiFillHeart className="cursor-pointer text-red-400 text-2xl" onClick={onClickHeart} />
              ) : (
                <span className="text-indigo-300">
                  <AiOutlineHeart className="cursor-pointer text-2xl" onClick={onClickHeart} />
                </span>
              )}
            </article>
          </section>
        </div>
      </div>
      {showPostButtons && <PostToolButtons handleShow={() => setShowPostButtons(false)} postId={board.postId} />}
    </>
  );
};

export default BoardCard;
