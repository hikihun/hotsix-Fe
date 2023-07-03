import { useEffect, useState } from "react";
import { BsPlusSquareFill } from "react-icons/bs";

interface PersonalityProps {
  personality: string[];
  handlePersonalityChange: (option: string) => void;
}

const Personality = ({ personality, handlePersonalityChange }: PersonalityProps) => {
  const [mbtiOptions, setMbtiOptions] = useState<string[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    setMbtiOptions([
      "ISTJ",
      "ISFJ",
      "INFJ",
      "INTJ",
      "ISTP",
      "ISFP",
      "INFP",
      "INTP",
      "ESTP",
      "ESFP",
      "ENFP",
      "ENTP",
      "ESTJ",
      "ESFJ",
      "ENFJ",
      "ENTJ",
      "야식좋아함",
      "야식싫어함",
      "야행성",
      "주행성",
      "흡연",
      "비흡연",
      "더위탐",
      "취위탐",
    ]);
  }, []);

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="flex flex-col mt-5 mx-auto w-9/12">
      <label htmlFor="input-personality " className="after:content-['*'] after:text-red-500">
        성향
      </label>
      <div className="flex flex-wrap gap-2 mb-4" id="input-personality">
        {personality.map((selectedOption: string) => (
          <span key={selectedOption} className="mt-1 px-2 py-1 bg-main-300 text-white text-sm ">
            #{selectedOption}
          </span>
        ))}
        <button type="button" className="w-7 h-7 mt-1" onClick={handleModalToggle}>
          <div className="text-main-300">
            <BsPlusSquareFill className="w-full h-full" />
          </div>
        </button>
        <input type="text" name="personality" className="hidden" defaultValue={personality !== null ? String(personality) : ""} />
      </div>
      {showModal && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col items-center rounded-lg bg-main-200">
            <h2 className="mt-4 text-center text-lg font-medium">성향</h2>
            <div className="grid grid-cols-3 gap-2 p-2">
              {mbtiOptions.map((option) => (
                <div key={option} className="mt-1 border">
                  <input
                    type="checkbox"
                    id={`input-personality-${option}`}
                    name="personalities"
                    value={option}
                    onChange={() => handlePersonalityChange(option)}
                    className="sr-only"
                  />
                  <label
                    htmlFor={`input-personality-${option}`}
                    className={`block h-full py-1 ${personality.includes(option) ? "bg-main-400 text-white" : "bg-white"} text-sm`}
                  >
                    #{option}
                  </label>
                </div>
              ))}
            </div>
            <button type="button" className="px-3 py-1 my-4 bg-main-300 text-white" onClick={handleModalToggle}>
              수정 완료
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Personality;
