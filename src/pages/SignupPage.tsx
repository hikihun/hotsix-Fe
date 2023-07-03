import { useEffect, useRef, useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Region from "../components/Signup/Region";
import Personality from "../components/Signup/Personality";
import GoBackButton from "../components/common/GoBackButton";
import { SignupConfig, createLoginConfig } from "../components/API/AxiosModule";
import { FaUser } from "react-icons/fa";
import utility from "../utils/utils";

const SignUp = () => {
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [year, setYear] = useState<number | "year">("year");
  const [month, setMonth] = useState<number | "month">("month");
  const [day, setDay] = useState<number | "day">("day");
  const [birth, setBirthday] = useState<string>("");
  const imgRef = useRef<HTMLInputElement>(null);
  const [gender, setGender] = useState<number>();
  const [introduction, setIntroduction] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emailCheck, setEmailCheck] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordCheck, setPasswordCheck] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [personality, setPersonality] = useState<string[]>([]);
  const [regionId, setRegionId] = useState<number | null>(null);
  const [verify, setVerify] = useState<string>("false");
  const [emailerror, setEmailerror] = useState<string | null>("");
  const [emailCheckError, seteEailCheckError] = useState<string | null>("");
  const [nicknameCheckError, setenicknameCheckError] = useState<string | null>("");
  const [countdown, setCountdown] = useState<number | null>(null);
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }

    return () => clearTimeout(timer);
  }, [countdown]);

  const handleRegionIdChange = (id: number | null) => {
    setRegionId(id);
  };

  const handlePersonalityChange = (option: string) => {
    if (personality.includes(option)) {
      setPersonality(personality.filter((item: string) => item !== option));
    } else {
      if (personality.length < 5) {
        setPersonality([...personality, option]);
      }
    }
  };
  const navigate = useNavigate();

  const saveImgFile = () => {
    const file = imgRef.current?.files?.[0];
    setImgFile(file || null);
  };

  const years = utility.getYears();
  const months = utility.getMonths();
  const days = utility.getDays(year === "year" ? NaN : year, month === "month" ? NaN : month);

  useEffect(() => {
    if (year !== "year" && month !== "month" && day !== "day") {
      setBirthday(`${year}-${month}-${day}`);
    } else {
      setBirthday("");
    }
  }, [year, month, day]);

  const handleGenderChange = (option: string) => {
    if (option === "남성") {
      setGender(1);
    } else if (option === "여성") {
      setGender(0);
    }
  };

  const validatePassword = () => {
    return password === passwordCheck;
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const isValid = utility.validateForm(email, password, passwordCheck, nickname, personality, regionId, birth, introduction);
    e.preventDefault();
    if (isValid) {
      const data = {
        email,
        password,
        nickname,
        birth,
        gender,
        personality: [...personality],
        regionId,
        introduction,
        verify,
      };
      const formData = new FormData();
      formData.append("form", new Blob([JSON.stringify(data)], { type: "application/json" }));

      if (imgFile) {
        formData.append("files", imgFile, imgFile.name);
      } else {
        formData.append("files", new File([], ""), "image.jpg");
      }
      console.log(formData);
      SignupConfig("post", "signup", formData)
        .then(() => {
          navigate("/signin");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const emailSubmit = async () => {
    const requestData = {
      email: email,
    };
    createLoginConfig("post", "email/auth", requestData)
      .then(() => {
        alert("이메일 전송 성공");
        setEmailerror("true");
        setCountdown(300);
      })
      .catch((error) => {
        alert("이메일 전송 실패");
        setEmailerror(error.response?.data?.message);
      });
  };

  const emailVerifySubmit = async () => {
    const requestData = {
      email: email,
      code: emailCheck,
    };
    createLoginConfig("post", "email/verify", requestData)
      .then(() => {
        setVerify("true");
        setCountdown(0);
        seteEailCheckError("true");
      })
      .catch((error) => {
        setVerify("false");
        seteEailCheckError(error.response?.data?.message);
      });
  };

  const nicknameSubmit = async () => {
    const requestData = {
      nickname: nickname,
    };
    createLoginConfig("post", "nickname", requestData)
      .then(() => {
        alert("닉네임 사용가능 합니다.");
      })
      .catch((error) => {
        setVerify("false");
        setenicknameCheckError(error.response?.data?.message);
      });
  };

  const formattedCountdown =
    countdown !== null
      ? `${Math.floor(countdown / 60)
          .toString()
          .padStart(2, "0")}:${(countdown % 60).toString().padStart(2, "0")}`
      : "";

  return (
    <div className="relative bg-main-100">
      <div className="flex flex-row justify-center items-center pt-4">
        <div onClick={() => navigate(-1)} className="absolute left-5">
          <GoBackButton />
        </div>
        <h2 className="mx-10 text-center text-3xl">회원가입</h2>
      </div>
      <form action="http://localhost:8080/signup" onSubmit={handleSubmit} method="post">
        <div className="flex flex-col items-center mx-auto w-9/12 mt-5 ">
          {imgFile ? (
            <img className="block rounded-full w-24 h-24 " src={URL.createObjectURL(imgFile)} alt="프로필 사진" />
          ) : (
            <div className="flex items-center justify-center bg-main-200 rounded-full w-24 h-24">
              <FaUser className="fill-main-100 w-12 h-12" />
            </div>
          )}
          <label htmlFor="input-file" className="mt-2.5 cursor-pointer">
            프로필 사진 추가
          </label>
          <input className="hidden" type="file" ref={imgRef} accept="image/jpg, image/jpeg, image/png" onChange={saveImgFile} id="input-file" />
        </div>
        <div className="flex flex-col mt-5 mx-auto w-9/12">
          <label htmlFor="input-email" className="w-9/12 after:content-['*'] after:text-red-500">
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
          {emailerror === "true" ? (
            <span className="mt-2 text-green-500 text-sm">이메일을 확인해주세요</span>
          ) : (
            <span className="mt-2 text-red-500 text-sm">{emailerror}</span>
          )}
        </div>
        <div className="flex flex-col mt-5 mx-auto w-9/12">
          <label htmlFor="input-emailCheck" className="w-9/12 after:content-['*'] after:text-red-500">
            이메일 인증
          </label>
          <div className="flex mt-2 ">
            <input
              type="text"
              id="input-emailCheck"
              className="w-4/5 h-10 p-2 placeholder:text-sm"
              value={emailCheck}
              onChange={(e) => setEmailCheck(e.target.value)}
              name="emailCheck"
              placeholder="인증번호를 입력해주세요"
            />
            <button type="button" className="rounded-none bg-main-400 w-1/5 h-10 text-white" onClick={emailVerifySubmit}>
              <AiOutlineCheck className="mx-auto my-0" />
            </button>
          </div>
          {emailCheckError === "true" ? (
            <span className="mt-2 text-green-500 text-sm">인증이 완료되었습니다.</span>
          ) : (
            <span className="mt-2 text-red-500 text-sm">{emailCheckError}</span>
          )}
          {emailerror === "true" ? (
            <div className="mt-2 text-sm text-red-500">{formattedCountdown}</div>
          ) : (
            <div className="mt-2 text-sm text-red-500"></div>
          )}
        </div>
        <div className="flex flex-col mt-5 mx-auto w-9/12">
          <label htmlFor="input-password" className="w-9/12 after:content-['*'] after:text-red-500">
            비밀번호
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
          <span className="text-red-500 text-sm w-9/12">영문자, 숫자 8자 이상</span>
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
        <div className="flex flex-col mt-5 mx-auto w-9/12">
          <label htmlFor="input-nickname" className="w-9/12 after:content-['*'] after:text-red-500">
            닉네임
          </label>
          <div className="flex mt-2 ">
            <input
              type="text"
              id="input-nickname"
              className="w-4/5 h-10 p-2 placeholder:text-sm"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              name="nickname"
              placeholder="닉네임을 입력해주세요"
            />
            <button className="rounded-none bg-main-400 w-1/5 h-10 text-white" type="button" onClick={nicknameSubmit}>
              <AiOutlineCheck className="mx-auto my-0" />
            </button>
          </div>
          <span className="text-red-500 text-sm w-9/12">{nicknameCheckError}</span>
        </div>
        <div className="flex flex-col mt-5 mx-auto w-9/12">
          <label htmlFor="input-birth" className="w-9/12 after:content-['*'] after:text-red-500">
            생년월일
          </label>
          <div className="flex justify-between mt-2">
            <select value={year} id="input-birth" onChange={(e) => setYear(e.target.value as number | "year")} className="py-1 w-1/4 text-sm">
              <option disabled value={"year"}>
                연도
              </option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select value={month} onChange={(e) => setMonth(e.target.value as number | "month")} className="w-1/4 text-sm">
              <option disabled value={"month"}>
                월
              </option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <select value={day} onChange={(e) => setDay(e.target.value as number | "day")} className="w-1/4 text-sm">
              <option disabled value={"day"}>
                일
              </option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <input type="text" name="birth" className="hidden" defaultValue={birth} />
          </div>
        </div>
        <Region handleRegionIdChange={handleRegionIdChange} defaultRegionId={null} />
        <Personality personality={personality} handlePersonalityChange={handlePersonalityChange} />
        <div className="flex flex-col mt-5 mx-auto w-9/12">
          <label htmlFor="input-gender" className="w-9/12 after:content-['*'] after:text-red-500">
            성별
          </label>
          <div className="flex w-9/12 mt-2.5 " id="input-gender">
            <div className="mt-1 mr-4 border">
              <input
                type="checkbox"
                id="input-gender-man"
                name="gender"
                value="1"
                onChange={() => handleGenderChange("남성")}
                checked={gender === 1}
                className="sr-only"
              />
              <label htmlFor="input-gender-man" className={`block h-full px-1 ${gender === 1 ? "bg-main-400 text-white" : "bg-white"}`}>
                남성
              </label>
            </div>
            <div className="mt-1 border">
              <input
                type="checkbox"
                id="input-gender-woman"
                name="gender"
                value="2"
                onChange={() => handleGenderChange("여성")}
                checked={gender === 0}
                className="sr-only"
              />
              <label htmlFor="input-gender-woman" className={`block h-full px-1 ${gender === 0 ? "bg-main-400 text-white" : "bg-white"}`}>
                여성
              </label>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-5 mx-auto w-9/12">
          <label htmlFor="input-about" className="after:content-['*'] after:text-red-500">
            자기소개
          </label>
          <textarea
            name="inttroduction"
            id="input-about"
            value={introduction}
            placeholder="자신에 대해 소개해주세요"
            onChange={(e) => setIntroduction(e.target.value)}
            className="h-40 p-4 mt-2.5"
          ></textarea>
        </div>
        <button type="submit" className="rounded-none mt-16 w-full h-12 bg-main-400 text-white">
          가입하기
        </button>
      </form>
    </div>
  );
};

export default SignUp;
