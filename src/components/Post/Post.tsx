import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SelectCategory from "./SelectCategory";
import SelectRegion from "./SelectRegion";
import Content from "./Content";
import AddImages from "./AddImages";
import { MultiConfig } from "../API/AxiosModule";
import { getUserId } from "../API/TokenAction";

const EditPost = () => {
  const [boardId, setBoardId] = useState(0);
  const [regionId, setRegionId] = useState(0);
  const [address, setAddress] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const navigate = useNavigate();
  const userId = getUserId();

  // 폼 db에 보내기
  const postData = async () => {
    try {
      const data = { boardId, regionId, address, content };
      const formData = new FormData();
      formData.append("form", new Blob([JSON.stringify(data)], { type: "application/json" }));
      if (files.length) {
        files.forEach((file) => {
          formData.append("files", file, file.name);
        });
      } else {
        formData.append("files", new File([], ""));
      }

      const response = await MultiConfig("post", `api/post/${userId}`, formData);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  };

  // 등록하기 버튼을 눌렀을 때 실행되는 함수
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!boardId) {
      alert("카테고리를 선택해주세요.");
      return;
    }

    if (!regionId) {
      alert("지역을 선택해주세요.");
      return;
    }

    if (!content) {
      alert("내용을 입력해주세요.");
      return;
    }

    (async () => {
      const response = await postData();
      console.log(response);
      navigate(`/detail/${response}`);
    })();
  };

  return (
    <form className="pt-16 pb-12 min-w-0 min-h-screen overflow-auto" onSubmit={handleSubmit}>
      <article className="px-4 pb-4">
        <SelectCategory buttons={["방 구해요", "방 있어요"]} value={boardId} setValue={setBoardId} />
        <SelectRegion regionId={regionId} address={address} setRegionId={setRegionId} setAddress={setAddress} />
        <Content content={content} setContent={setContent} />
        <AddImages files={files} setFiles={setFiles} />
      </article>
      <button className="fixed bottom-0 block w-full h-14 rounded-none bg-main-400 text-white focus:outline-none">등록하기</button>
    </form>
  );
};

export default EditPost;
