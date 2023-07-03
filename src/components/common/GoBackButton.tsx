import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const GoBackButton = () => {
  const navigate = useNavigate();

  const handleButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <button className="border-0 text-2xl focus:outline-0 hover:border-0" onClick={handleButton}>
      <BiArrowBack />
    </button>
  );
};

export default GoBackButton;
