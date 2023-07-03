import { useParams } from "react-router-dom";
import Post from "../components/Post/Post";
import EditPost from "../components/Post/EditPost";
import Header from "../components/Post/Header";

const PostPage = () => {
  const { postId } = useParams();

  return (
    <div className="bg-main-100">
      <Header />
      {postId ? <EditPost postId={postId} /> : <Post />}
    </div>
  );
};

export default PostPage;
