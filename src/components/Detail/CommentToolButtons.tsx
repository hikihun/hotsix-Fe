import { useNavigate } from "react-router";
import { JsonConfig } from "../API/AxiosModule";
import { Dispatch, SetStateAction } from "react";
import { getUserId } from "../API/TokenAction";

interface Comment {
  commentId: number;
  content: string;
  createdAt: string;
  imgPath: string;
  memberId: number;
  nickName: string;
}

interface CommentToolButtonsProps {
  comments: Comment[];
  setComments: Dispatch<SetStateAction<Comment[]>>;
  editComment: () => void;
  onClickClose: () => void;
  commentData: Comment;
  setShowCommentButtons: Dispatch<SetStateAction<boolean>>;
  handleDelete: () => void;
  myComment: boolean;
}

const CommentToolButtons = (props: CommentToolButtonsProps) => {
  const { comments, setComments, editComment, onClickClose, commentData, setShowCommentButtons, handleDelete, myComment } = props;
  const navigate = useNavigate();
  const userId = getUserId();
  const partner = {
    membershipId: commentData.memberId,
    imgPath: commentData.imgPath,
    nickname: commentData.nickName,
  };

  //댓글 삭제
  const deleteComment = () => {
    const ok = confirm("정말 삭제하시겠습니까😃?");

    if (ok) {
      JsonConfig("delete", `api/comment/${commentData.commentId}`, null, undefined).then((res) => {
        console.log(res);
        setComments(
          comments.filter((c) => {
            return c.commentId !== res.data;
          })
        );
      });
      handleDelete();
    }
    setShowCommentButtons(false);
  };

  const goChatRoom = async () => {
    try {
      const response = await JsonConfig("post", "api/chat/room", {
        senderId: userId,
        receiverId: commentData.memberId,
      });
      navigate(`/chat/${response.data}`, { state: partner });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div onClick={() => setShowCommentButtons(false)}>
      <div className="fixed top-0 left-0 right-0 bottom-0 z-50 bg-black opacity-30" />
      <div className="fixed bottom-4 flex flex-col items-center z-50 w-full text-md">
        <div className="mb-2 w-11/12 rounded-xl bg-white shadow opacity-80">
          {myComment ? (
            <>
              <button
                className="block px-4 py-3 w-full border-0 border-b-2 border-gray-200 rounded-none hover:border-gray-200 focus:outline-none"
                onClick={editComment}
              >
                댓글 수정
              </button>
              <button
                className="block px-4 py-3 w-full border-0 rounded-t-none rounded-b-xl hover:border-0 focus:outline-none"
                onClick={deleteComment}
              >
                댓글 삭제
              </button>
            </>
          ) : (
            <button
              className="block px-4 py-3 w-full border-0 border-b-2 border-gray-200 rounded-none hover:border-gray-200 focus:outline-none"
              onClick={goChatRoom}
            >
              채팅 보내기
            </button>
          )}
        </div>
        <button className="px-4 py-3 w-11/12 border-0 rounded-xl shadow bg-white hover:border-0 focus:outline-none" onClick={onClickClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default CommentToolButtons;
