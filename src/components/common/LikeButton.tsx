import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { JsonConfig } from "../API/AxiosModule";
import { getUserId } from "../API/TokenAction";

interface LikeButtonProps {
  postId: number;
  like: boolean;
  setLike: (like: boolean) => void;
  likes?: number;
  setLikes?: (likes: number) => void;
}

const LikeButton = (props: LikeButtonProps) => {
  const userId = getUserId();
  const { postId, like, setLike, likes, setLikes } = props;

  // 좋아요 버튼 기능
  const handleLike = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    (async () => {
      try {
        if (like) {
          const response = await JsonConfig("delete", `api/likes/${postId}/${userId}`);
          if (setLikes && typeof likes === "number") {
            setLikes(likes - 1);
          }
          setLike(response.data);
        } else {
          const response = await JsonConfig("post", `api/likes/${postId}/${userId}`);
          if (setLikes && typeof likes === "number") {
            setLikes(likes + 1);
          }
          setLike(response.data);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  };
  return (
    <button className="text-2xl border-0 focus:outline-0 hover:border-0" onClick={handleLike}>
      {like ? <AiFillHeart className="text-red-400" /> : <AiOutlineHeart className="text-main-400" />}
    </button>
  );
};

export default LikeButton;
