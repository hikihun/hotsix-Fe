import { useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { createLoginConfig } from "../components/API/AxiosModule";
import { useNavigate } from "react-router-dom";

const Findpassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");

  const emailSubmit = async () => {
    const requestData = {
      email: email,
    };
    createLoginConfig("post", "email/password", requestData)
      .then(() => {
        alert("이메일로 임시비밀번호가 전송되었습니다.");
        navigate("/signin");
      })
      .catch((error) => {
        console.error("이메일 전송 실패", error);
        alert(error.response?.data?.message);
      });
  };
  console.log(email);
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col mx-auto bg-main-100 p-4 w-9/12">
        <label htmlFor="input-email" className="w-9/12">
          이메일
        </label>
        <div className="flex mt-2 ">
          <input
            type="email"
            id="input-email"
            className="w-4/5 h-10 p-2  placeholder:text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            placeholder="이메일을 입력해주세요"
          />
          <button type="button" className="rounded-none bg-main-400 w-1/5 h-10 text-white" onClick={emailSubmit}>
            <AiOutlineCheck className="mx-auto my-0" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Findpassword;
