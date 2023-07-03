import { GoKebabHorizontal } from "react-icons/go";
import { FaUser } from "react-icons/fa";
import { ChangeEvent, useState } from "react";
import CommentToolButtons from "./CommentToolButtons";
import { IoIosSend } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { JsonConfig } from "../API/AxiosModule";
import { Dispatch, SetStateAction } from "react";
import utility from "../../utils/utils";

interface Comment {
  commentId: number;
  content: string;
  createdAt: string;
  imgPath: string;
  memberId: number;
  nickName: string;
}

interface CommentProps {
  commentData: Comment;
  comments: Comment[];
  setComments: Dispatch<SetStateAction<Comment[]>>;
  userId: number;
  setCommentCount: Dispatch<SetStateAction<number>>;
}

const Comment = (props: CommentProps) => {
  const { commentData, comments, setComments, userId, setCommentCount } = props;
  const [text, setText] = useState(commentData.content);
  const [editText, setEditText] = useState(false);
  const [showCommentButtons, setShowCommentButtons] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const editComment = () => {
    setEditText(true);
    setShowCommentButtons(false);
  };
  const onClickClose = () => {
    setShowCommentButtons(false);
  };

  //댓글 수정해서 서버 / 배열 에 보냄
  const editCommentData = () => {
    const data = { content: text };
    JsonConfig("put", `api/comment/${commentData.commentId}`, data, undefined).then((response) => {
      console.log(response);
      setComments(
        comments.map((c) => {
          console.log(c);
          return c.commentId === response.data ? { ...c, content: text } : c;
        })
      );
    });
    setEditText(false);
  };

  //댓글 수정중인거 취소
  const cancelCommentData = () => {
    setEditText(false);
    setText(commentData.content);
  };

  const handleDelete = () => {
    setCommentCount((prev) => prev - 1);
  };

  return (
    <>
      <div className="flex flex-col gap-1 p-4 border-b-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex justify-center items-center gap-2">
            <div className="relative flex justify-center items-center w-12 h-9 border-2 rounded-full bg-white text-black overflow-hidden">
              {commentData.imgPath !== "" ? (
                <img className="w-full h-full object-cover" src={commentData.imgPath} alt={`${commentData.imgPath}의 프로필 이미지`} />
              ) : (
                <div className={"absolute top-2.5 flex justify-center items-center text-2xl text-main-200"}>
                  <FaUser />
                </div>
              )}
            </div>

            <div className="flex items-end gap-1.5 w-full">
              <div className="text-sm font-semibold text-black">{commentData.nickName}</div>
              <div className="flex text-xs text-gray-400">
                <div className="mr-1">{commentData.createdAt.split("T")[0]}</div>
                <div className="text-right">{commentData.createdAt.split("T")[1]} </div>
              </div>
            </div>
          </div>

          <button
            className="p-2 border-0 text-lg rounded-full focus:outline-0 hover:bg-main-200"
            onClick={() => {
              setShowCommentButtons(true);
            }}
          >
            <GoKebabHorizontal />
          </button>
        </div>
        {!editText ? (
          <p className="ml-1 text-base whitespace-pre-line break-all">{utility.changeLineBreak(commentData.content)}</p>
        ) : (
          <form className="flex items-center p-2 gap-2 rounded-3xl bg-white" onSubmit={handleSubmit}>
            <textarea value={text} onChange={onChange} className="w-full px-3 py-1 rounded-lg resize-none focus:outline-none" />
            <button onClick={cancelCommentData}>
              <MdCancel className="text-2xl text-main-400" />
            </button>
            <button onClick={editCommentData}>
              <IoIosSend className={text.length ? "text-2xl text-main-400" : "text-2xl text-gray-400"} />
            </button>
          </form>
        )}
      </div>

      {showCommentButtons && (
        <CommentToolButtons
          commentData={commentData}
          comments={comments}
          setComments={setComments}
          editComment={editComment}
          onClickClose={onClickClose}
          setShowCommentButtons={setShowCommentButtons}
          handleDelete={handleDelete}
          myComment={userId === commentData.memberId}
        />
      )}
    </>
  );
};

export default Comment;
