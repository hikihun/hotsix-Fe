import { useState, useEffect, useRef, useCallback, SetStateAction, Dispatch } from "react";
import Comment from "./Comment";
import { JsonConfig } from "../API/AxiosModule";
import CommentForm from "./CommentForm";
import { getUserId } from "../API/TokenAction";

interface CommentListProps {
  postId: number;
  setCommentCount: Dispatch<SetStateAction<number>>;
}

interface CommentType {
  commentId: number;
  content: string;
  createdAt: string;
  imgPath: string;
  memberId: number;
  nickName: string;
}

const CommentList = (props: CommentListProps) => {
  const { postId, setCommentCount } = props;
  const userId = getUserId();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastCommentId, setLastCommentId] = useState();
  const target = useRef<HTMLDivElement>(null);

  //  댓글 불러오는 api
  const getFirstCommentData = useCallback(async () => {
    await JsonConfig("get", `api/comment/basic/${postId}`, null).then((res) => {
      console.log(res);
      setComments(res.data.data);
      setLoading(false);
      setLastCommentId(res.data.data[res.data.data.length - 1]?.commentId);
    });
  }, [postId]);

  //첫 화면 댓글 가져오기
  useEffect(() => {
    if (!userId) return;
    getFirstCommentData();
  }, [userId, getFirstCommentData]);

  //댓글 무한스크롤
  const loadMore = useCallback(async () => {
    if (lastCommentId) {
      const params = { lastCommentId: lastCommentId, size: 10 };
      await JsonConfig("get", `api/comment/${postId}`, null, params).then((res) => {
        console.log(res);
        setComments((prev: CommentType[]) => [...prev, ...res.data.data]);
        setLoading(false);
        setLastCommentId(res.data.data[res.data.data.length - 1]?.commentId);
      });
    }
  }, [lastCommentId, postId]);

  //intersection callback 함수 작성
  const intersectionCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      console.log("entry", entry);
      if (entry.isIntersecting) {
        loadMore();
      }
    },
    [loadMore]
  );

  //관찰자가 target을 관찰시작
  useEffect(() => {
    const observer = new IntersectionObserver(intersectionCallback, {
      threshold: 1,
    });

    if (target.current) {
      if (loading) {
        observer.unobserve(target.current);
      } else {
        observer.observe(target.current);
      }
    }

    return () => {
      observer.disconnect();
    };
  }, [intersectionCallback, loading]);

  return (
    <>
      <section className="pb-20 mb-10">
        {comments &&
          comments.map((co, i) => {
            return (
              <Comment key={i} commentData={co} comments={comments} setComments={setComments} userId={userId} setCommentCount={setCommentCount} />
            );
          })}
      </section>
      <div ref={target}></div>
      <CommentForm postId={postId} comments={comments} setComments={setComments} setCommentCount={setCommentCount} />
    </>
  );
};

export default CommentList;
