import { IoClose } from "react-icons/io5";

interface AddImagesProps {
  files: File[];
  setFiles: (list: File[]) => void;
  imgPath?: string[];
  setImgPath?: (list: string[]) => void;
}

const AddImages = (props: AddImagesProps) => {
  const { files, setFiles, imgPath, setImgPath } = props;

  // 이미지 업로드 함수
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (files.length === 5) {
      alert("이미지를 더 이상 추가할 수 없습니다.");
      return null;
    }
    if (!e.target.files) return null;

    const file = e.target.files[0];
    setFiles([...files, file]);
  };

  const deleteImgPath = (e: React.MouseEvent<HTMLButtonElement>, url: string) => {
    e.preventDefault();

    if (!setImgPath || !imgPath) return;
    setImgPath(
      imgPath.filter((path: string) => {
        return path !== url;
      })
    );
  };

  const deleteFile = (e: React.MouseEvent<HTMLButtonElement>, file: File) => {
    e.preventDefault();

    setFiles(
      files.filter((f: File) => {
        return file !== f;
      })
    );
  };

  return (
    <div>
      <div className="mt-4 mb-2 text-base">사진첨부(최대 5개)</div>
      <label htmlFor="input-file" className="box-border px-4 w-4 h-8 rounded-xl border-2 border-main-400 bg-main-400 text-sm text-white">
        이미지 파일 추가
      </label>
      <input className="hidden" type="file" multiple accept="image/*" id="input-file" onChange={handleImageUpload} />
      <div className="flex gap-4 flex-wrap mt-2">
        {imgPath &&
          imgPath.map((path) => {
            return (
              <div className="relative" key={path}>
                <img className="w-20 h-20 rounded-xl object-cover" src={path} alt={path} />
                <button
                  className="absolute flex items-center justify-center top-0.5 right-0.5 hover:border-none text-2xl text-red-500 focus:outline-none"
                  onClick={(e) => deleteImgPath(e, path)}
                >
                  <IoClose />
                </button>
              </div>
            );
          })}
        {files.map((file) => {
          return (
            <div className="relative" key={file.name}>
              <img className="w-20 h-20 rounded-xl object-cover" src={URL.createObjectURL(file)} alt={file.name} />
              <button
                className="absolute flex items-center justify-center top-0.5 right-0.5 hover:border-none text-2xl text-red-500 focus:outline-none"
                onClick={(e) => deleteFile(e, file)}
              >
                <IoClose />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AddImages;
