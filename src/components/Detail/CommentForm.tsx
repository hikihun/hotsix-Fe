import { Dispatch, SetStateAction, useState } from "react";
import { IoIosSend } from "react-icons/io";
import Footer from "../common/Footer";
import { JsonConfig } from "../API/AxiosModule";
import { getUserId } from "../API/TokenAction";

interface Comments {
  commentId: number;
  content: string;
  createdAt: string;
  imgPath: string;
  memberId: number;
  nickName: string;
}

interface CommentFormProps {
  postId: number;
  comments: {
    commentId: number;
    content: string;
    createdAt: string;
    imgPath: string;
    memberId: number;
    nickName: string;
  }[];
  setComments: Dispatch<SetStateAction<Comments[]>>;
  setCommentCount: Dispatch<SetStateAction<number>>;
}

const CommentForm = ({ postId, comments, setComments, setCommentCount }: CommentFormProps) => {
  const [content, setContent] = useState("");
  const userId = getUserId();

  const handleResizeHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  //댓글등록 서버로 보냄
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    window.scrollTo({ top: 0, behavior: "auto" });
    if (!userId) return;
    e.preventDefault();

    if (!content) {
      alert("댓글 입력해주세요 😀");
      return;
    }
    const data = { content: content };

    JsonConfig("post", `api/comment/${postId}/${userId}`, data, undefined).then((res) => {
      console.log(res);
      setComments([res.data, ...comments]);
    });
    setCommentCount((prev) => prev + 1);
    setContent("");
  };

  return (
    <>
      <form className="fixed pb-11 bottom-0 w-full" onSubmit={handleSubmit}>
        <div className="flex items-start gap-2 mx-1 my-4 px-4 py-2.5 rounded-3xl border-2 bg-white">
          <textarea
            className="w-full max-h-12 resize-none focus:outline-none"
            placeholder="댓글을 입력해주세요."
            value={content}
            onChange={handleResizeHeight}
            rows={1}
            wrap="virtual"
          />
          <button
            className={
              content
                ? "text-2xl border-0 focus:outline-0 text-main-400 hover:border-0 focus:outline-none"
                : "text-2xl border-0 focus:outline-0 text-gray-400 hover:border-0 focus:outline-non"
            }
          >
            <IoIosSend />
          </button>
        </div>
      </form>
      <Footer selected={false} userId={userId} />
    </>
  );
};

export default CommentForm;
