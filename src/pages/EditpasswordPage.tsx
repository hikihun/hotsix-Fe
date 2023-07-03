import { useNavigate } from "react-router-dom";
import GoBackButton from "../components/common/GoBackButton";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import { JsonConfig } from "../components/API/AxiosModule";

interface DecodedToken {
  id: string;
}

const Editpassword = () => {
  const accessToken = localStorage.getItem("accessToken");
  const [userId, setUserId] = useState(0);
  const [password, setPassword] = useState<string>("");
  const [changepassword, setChangePassword] = useState<string>("");
  const [passwordCheck, setPasswordCheck] = useState<string>("");
  useEffect(() => {
    if (!accessToken) return;
    const decodeToken = jwtDecode<DecodedToken>(accessToken);

    if (decodeToken.id) {
      setUserId(Number(decodeToken.id));
    }
  }, [accessToken]);

  const navigate = useNavigate();
  const validatePassword = () => {
    return changepassword === passwordCheck;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatePassword()) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    const requestData = {
      password: password,
      newPassword: changepassword,
      newPasswordVerify: passwordCheck,
    };
    JsonConfig("put", `api/membership/update/password/${userId}`, requestData)
      .then(() => {
        console.log("전송 성공");
      })
      .catch((error) => {
        console.log("전송 실패", error);
      });
  };

  return (
    <div className="relative min-h-screen bg-main-100">
      <div className="flex flex-row justify-center items-center pt-4">
        <div onClick={() => navigate(-1)} className="absolute left-5">
          <GoBackButton />
        </div>
        <h2 className="mx-10 text-center text-3xl">비밀번호 수정</h2>
      </div>
      <form action="" onSubmit={handleSubmit} method="post">
        <div className="flex flex-col mt-5 mx-auto w-9/12">
          <label htmlFor="input-password" className="w-9/12 after:content-['*'] after:text-red-500">
            임시 비밀번호
          </label>
          <input
            type="password"
            id="input-password"
            className="mt-2 h-10 p-2 placeholder:text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            placeholder="비밀번호를 입력해주세요"
          />
        </div>
        <div className="flex flex-col mt-5 mx-auto w-9/12">
          <label htmlFor="input-changepassword" className="w-9/12 after:content-['*'] after:text-red-500">
            변경할 비밀번호
          </label>
          <input
            type="password"
            id="input-changepassword"
            className="mt-2 h-10 p-2 placeholder:text-sm"
            value={changepassword}
            onChange={(e) => setChangePassword(e.target.value)}
            name="password"
            placeholder="비밀번호를 입력해주세요"
          />
        </div>
        <div className="flex flex-col mt-5 mx-auto w-9/12">
          <label htmlFor="input-passwordcheck" className="w-9/12 after:content-['*'] after:text-red-500">
            비밀번호확인
          </label>
          <input
            type="password"
            id="input-passwordCheck"
            className="mt-2 h-10 p-2 placeholder:text-sm"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
            placeholder="비밀번호를 다시 한 번 입력해주세요"
          />
          {!validatePassword() ? (
            <span className="text-red-500 text-sm">비밀번호가 일치하지않습니다.</span>
          ) : (
            <span className="text-green-500 text-sm">비밀번호가 일치합니다</span>
          )}
        </div>
        <button type="submit" className="fixed bottom-0 rounded-none  w-full h-12 bg-main-400 text-white">
          가입하기
        </button>
      </form>
    </div>
  );
};

export default Editpassword;
