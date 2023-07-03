import { BiComment } from "react-icons/bi";
import { GoKebabHorizontal } from "react-icons/go";
import BreadCrump from "./BreadCrump";
import Carousel from "./Carousel";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { JsonConfig } from "../API/AxiosModule";
import LikeButton from "../common/LikeButton";
import { useNavigate } from "react-router-dom";
import utility from "../../utils/utils";
import { getUserId } from "../API/TokenAction";
import { FiMapPin } from "react-icons/fi";
import { AiOutlineCalendar } from "react-icons/ai";
import { GiFemale, GiMale } from "react-icons/gi";

interface DetailProps {
  postId: string;
  handleShow: () => void;
  commentCount: number;
  setCommentCount: Dispatch<SetStateAction<number>>;
}

interface DetailType {
  boardId: number;
  gender: number;
  address: string | null;
  content: string;
  createdAt: string;
  imgPath: string[];
  membership: {
    membershipId: number;
    imgPath: string;
    nickname: string;
  };
}

const Detail = (props: DetailProps) => {
  const [details, setDetails] = useState<DetailType | null>(null);
  const { postId, handleShow, commentCount, setCommentCount } = props;
  const [myPost, setMyPost] = useState(false);
  const [likes, setLikes] = useState(0);
  const [like, setLike] = useState(false);
  const userId = getUserId();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const response = await JsonConfig("get", `api/post/${postId}/${userId}`);
        const data = response.data;
        setDetails({
          boardId: data.boardId,
          gender: data.gender,
          address: data.address,
          content: data.content,
          createdAt: data.createdAt,
          imgPath: data.imgPath,
          membership: data.membership,
        });
        setCommentCount(data.commentCount);
        setLikes(data.likes);
        setLike(data.like);
        setMyPost(data.membership.membershipId === userId);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [postId, setDetails, userId, setCommentCount]);

  const goProfile = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!details) return null;
    navigate(`/profile/${details.membership.membershipId}`);
  };

  if (!details) return <></>;

  return (
    <section className="flex flex-col items-start w-full bg-white rounded-b-xl shadow-md text-base">
      <div className="flex flex-col gap-3 items-start p-4 pb-0 w-full">
        <BreadCrump category={details.boardId} />
        <div className="flex items-start justify-between w-full">
          <div className="flex items-center gap-2">
            <div
              className="relative flex justify-center items-center w-12 h-12 border-2 rounded-full bg-white text-black overflow-hidden"
              onClick={goProfile}
            >
              {details.membership.imgPath.length ? (
                <img className="w-full h-full object-cover" src={details.membership.imgPath} alt={`${details.membership.nickname}의 프로필 이미지`} />
              ) : (
                <div className={"absolute top-3 flex justify-center items-center text-4xl text-main-200"}>
                  <FaUser />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center justify-center gap-0.5 text-base font-semibold text-black" onClick={goProfile}>
                {details.membership.nickname}
                {details.gender === 1 ? <GiMale className="text-blue-400" /> : <GiFemale className="text-red-400" />}
              </div>
            </div>
          </div>
          {myPost && (
            <button className="p-2 border-0 text-lg rounded-full focus:outline-0 hover:bg-main-100" onClick={handleShow}>
              <GoKebabHorizontal />
            </button>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-col items-start gap-0.5 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              {<FiMapPin className="flex items-center justify-center gap-1.5 text-sm text-main-400" />}
              {details.address}
            </div>
            <div className="flex items-center gap-1">
              <AiOutlineCalendar className="flex items-center justify-center gap-1.5 text-sm text-main-400" />
              {details.createdAt.split("T")[0]}
            </div>
          </div>
          <p className="whitespace-pre-line break-all">{utility.changeLineBreak(details.content)}</p>
        </div>
      </div>
      {details.imgPath.length === 1 && details.imgPath[0] === "" ? (
        <div></div>
      ) : (
        <div className="mt-3 flex justify-center align-items w-full h-80 bg-gray-200">
          <Carousel items={details.imgPath} />
        </div>
      )}
      <div className="flex items-center justify-between p-4 w-full">
        <div className="flex items-center justify-between px-2 w-full">
          <div className="flex items-center gap-2">
            <div className="text-2xl text-main-400">
              <BiComment />
            </div>
            <span className="text-base leading-4">{commentCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <LikeButton postId={Number(postId)} like={like} setLike={setLike} likes={likes} setLikes={setLikes} />
            <span className="text-base leading-4">{likes}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Detail;
