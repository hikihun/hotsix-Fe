import { useState } from "react";
import Detail from "../components/Detail/Detail";
import PostToolButtons from "../components/common/PostToolButtons";
import CommentList from "../components/Detail/CommentList";
import Header from "../components/Detail/Header";
import { useParams } from "react-router-dom";

const DetailPage = () => {
  const [showPostButtons, setShowPostButtons] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const { postId } = useParams();

  if (!postId) return <></>;

  return (
    <div className="pt-16 min-h-screen bg-main-100">
      <Header />
      <Detail handleShow={() => setShowPostButtons(true)} postId={postId} commentCount={commentCount} setCommentCount={setCommentCount} />
      <CommentList postId={Number(postId)} setCommentCount={setCommentCount} />
      {showPostButtons && <PostToolButtons postId={postId} handleShow={() => setShowPostButtons(false)} />}
    </div>
  );
};

export default DetailPage;
