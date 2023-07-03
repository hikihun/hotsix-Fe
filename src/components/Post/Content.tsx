interface ContentProp {
  content: string;
  setContent: (value: string) => void;
}

const Content = (props: ContentProp) => {
  const { content, setContent } = props;

  return (
    <div>
      <div className="mt-4 mb-2 text-base">내용</div>
      <textarea
        className="block w-full h-60 px-4 py-4 rounded-xl border-2 border-inherit text-sm resize-none focus:outline-main-400"
        placeholder="내용을 입력해주세요."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
    </div>
  );
};

export default Content;
