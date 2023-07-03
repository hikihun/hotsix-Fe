import { useEffect, useState } from "react";
import { BiComment } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import { GoKebabHorizontal } from "react-icons/go";
import PostToolButtons from "../common/PostToolButtons";
import { useNavigate } from "react-router-dom";
import LikeButton from "../common/LikeButton";
import { AiOutlineCalendar } from "react-icons/ai";
import { FiMapPin } from "react-icons/fi";
import { GiFemale, GiMale } from "react-icons/gi";
import utility from "../../utils/utils";

interface PostType {
  nickname: string;
  imgPath: string;
  gender: number;
  address: string;
  createdAt: string;
  content: string;
  commentCount: number;
  postId: number;
  postImgPath: string;
  like: boolean;
}

interface CardProps {
  post: PostType;
  setPostList: (value: React.SetStateAction<PostType[] | null>) => void;
}

const Card = (props: CardProps) => {
  const { post, setPostList } = props;
  const navigate = useNavigate();
  const [showPostButtons, setShowPostButtons] = useState(false);
  const [like, setLike] = useState(false);

  useEffect(() => {
    setLike(post.like);
  }, [post.like]);

  const deletePost = () => {
    setPostList((prev: PostType[] | null) => {
      if (!prev) return null;
      return prev.filter((allPost) => allPost.postId !== post.postId);
    });
  };

  return (
    <>
      <section
        className="flex flex-col gap-3 bg-white rounded-lg p-4 w-full drop-shadow-xl cursor-pointer"
        onClick={() => navigate(`/detail/${post.postId}`)}
      >
        <article className="flex items-start justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="relative flex justify-center items-center w-12 h-12 border-2 rounded-full bg-white text-black overflow-hidden">
              {post.imgPath.length ? (
                <img className="w-full h-full object-cover" src={post.imgPath} alt={`${post.imgPath}의 프로필 이미지`} />
              ) : (
                <div className={"absolute top-3 flex justify-center items-center text-4xl text-main-200"}>
                  <FaUser />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center justify-center gap-0.5 text-base font-semibold text-black">
                {post.nickname}
                {post.gender === 1 ? <GiMale className="text-blue-400" /> : <GiFemale className="text-red-400" />}
              </div>
            </div>
          </div>
          <button
            className="p-2 border-0 text-lg rounded-full focus:outline-0 hover:bg-main-100"
            onClick={(e) => {
              e.stopPropagation();
              setShowPostButtons(true);
            }}
          >
            <GoKebabHorizontal />
          </button>
        </article>
        <article className="flex flex-col gap-1 text-sm text-black">
          <div className="flex flex-col items-start gap-0.5 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              {<FiMapPin className="flex items-center justify-center gap-1.5 text-sm text-main-400" />}
              {post.address}
            </div>
            <div className="flex items-center gap-1">
              <AiOutlineCalendar className="flex items-center justify-center gap-1.5 text-sm text-main-400" />
              {post.createdAt.split("T")[0]}
            </div>
          </div>
          <p className="two-line">{utility.changeLineBreak(post.content)}</p>
          {post.postImgPath.length !== 0 && (
            <div className="inline-flex flex-col items-center rounded-lg justfiy-center mt-1 h-60 overflow-hidden">
              <img src={post.postImgPath} className="w-full h-full object-cover" draggable="false" />
            </div>
          )}
        </article>
        <article className="flex justify-between items-center px-1">
          <div className="flex items-center">
            <div className="text-indigo-300">
              <BiComment className="text-2xl" />
            </div>
            <div className="ml-1">{post.commentCount}</div>
          </div>
          <LikeButton postId={post.postId} like={like} setLike={setLike} />
        </article>
      </section>
      {showPostButtons && <PostToolButtons deletePost={deletePost} handleShow={() => setShowPostButtons(false)} postId={post.postId} />}
    </>
  );
};

export default Card;
