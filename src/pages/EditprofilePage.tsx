import { useNavigate } from "react-router-dom";
import GoBackButton from "../components/common/GoBackButton";
import { AiOutlineCheck } from "react-icons/ai";
import Region from "../components/Signup/Region";
import Personality from "../components/Signup/Personality";
import { useEffect, useRef, useState } from "react";
import jwtDecode from "jwt-decode";
import { JsonConfig, MultiConfig, createLoginConfig } from "../components/API/AxiosModule";
import { FaUser } from "react-icons/fa";

interface DecodedToken {
  id: string;
}
interface UserData {
  nickname: string;
  imgPath: string;
  introduction: string;
  personality: string | null;
  region: {
    id: number;
    sido: string;
    sigg: string;
  };
}
const Editprofile = () => {
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [personality, setPersonality] = useState<string[]>([]);
  const [nickname, setNickname] = useState<string>("");
  const [regionId, setRegionId] = useState<number | null>(null);
  const [introduction, setIntroduction] = useState<string>("");
  const accessToken = localStorage.getItem("accessToken");
  const [userId, setUserId] = useState(0);
  const imgRef = useRef<HTMLInputElement>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [nicknameCheckError, setenicknameCheckError] = useState<string | null>("");
  const defaultRegionId = userData?.region?.id || null;

  useEffect(() => {
    if (!accessToken) return;
    const decodeToken = jwtDecode<DecodedToken>(accessToken);

    if (decodeToken.id) {
      setUserId(Number(decodeToken.id));
    }
  }, [accessToken]);
  const saveImgFile = () => {
    const file = imgRef.current?.files?.[0];
    setImgFile(file || null);
  };

  const navigate = useNavigate();

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

  const fileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (nickname.length < 2) {
      alert("닉네임을 2글자이상으로 해주세요 .");
      return;
    }
    if (personality.length === 0) {
      alert("성향을 1개 이상 골라주세요.");
      return false;
    }

    if (regionId === null) {
      alert("지역을 선택해주세요.");
      return false;
    }
    if (!introduction) {
      alert("자기소개를 입력해주세요.");
      return false;
    }
    const data = {
      nickname,
      personality: [...personality],
      regionId,
      introduction,
      imgPath: userData && userData.imgPath,
    };
    const formData = new FormData();
    formData.append("form", new Blob([JSON.stringify(data)], { type: "application/json" }));
    if (imgFile) {
      formData.append("files", imgFile, imgFile.name);
    } else {
      formData.append("files", new File([], ""), "image.jpg");
    }
    console.log(formData);
    MultiConfig("put", `api/membership/update/${userId}`, formData)
      .then(() => {
        alert("수정이 완료되었습니다.");
        navigate(-1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (!userId) return;
    JsonConfig("get", `api/membership/detail/${userId}`)
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userId]);

  useEffect(() => {
    if (userData) {
      if (userData.personality) {
        setPersonality([...userData.personality]);
      }
      if (userData.introduction) {
        setIntroduction(userData.introduction);
      }
      if (userData.nickname) {
        setNickname(userData.nickname);
      }
    }
  }, [userData]);

  const removeImg = () => {
    setImgFile(null);
    if (userData) {
      const updatedUserData = { ...userData, imgPath: "" };
      setUserData(updatedUserData);
    }
  };
  const nicknameSubmit = async () => {
    const requestData = {
      nickname: nickname,
    };
    createLoginConfig("post", "nickname", requestData)
      .then(() => {
        alert("닉네임 사용가능 합니다.");
        setenicknameCheckError("");
      })
      .catch((error) => {
        setenicknameCheckError(error.response?.data?.message);
      });
  };

  return (
    <div className="relative bg-main-100">
      <div className="flex flex-row justify-center items-center pt-4">
        <div onClick={() => navigate(-1)} className="absolute left-5">
          <GoBackButton />
        </div>
        <h2 className="mx-10 text-center text-3xl">프로필 편집</h2>
      </div>
      <form action="" onSubmit={fileSubmit}>
        {imgFile ? (
          <img className="block rounded-full mt-4 w-24 h-24 mx-auto " src={URL.createObjectURL(imgFile)} alt="" />
        ) : userData && userData.imgPath ? (
          <img className="block rounded-full mx-auto mt-4 w-24 h-24 " src={userData.imgPath} alt="" />
        ) : (
          <div className="flex items-center justify-center mx-auto mt-4 bg-main-200 rounded-full  w-24 h-24">
            <FaUser className="fill-main-100 w-12 h-12" />
          </div>
        )}
        <div className="flex flex-row justify-around items-center mx-auto w-9/12 mt-5 ">
          <label htmlFor="input-file" className="mt-2.5 cursor-pointer">
            프로필 수정
          </label>
          <button type="button" className="mt-2.5 cursor-pointer" onClick={removeImg}>
            프로필 삭제
          </button>
          <input className="hidden" type="file" ref={imgRef} accept="image/jpg, image/jpeg, image/png" onChange={saveImgFile} id="input-file" />
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
        <Region handleRegionIdChange={handleRegionIdChange} defaultRegionId={defaultRegionId} />
        <Personality personality={personality} handlePersonalityChange={handlePersonalityChange} />
        <div className="flex flex-col mt-5 mx-auto w-9/12">
          <label htmlFor="input-about">자기소개</label>
          <textarea
            name="inttroduction"
            id="input-about"
            value={introduction}
            placeholder="자신에 대해 소개해주세요"
            onChange={(e) => setIntroduction(e.target.value)}
            className="h-40 p-4 mt-2.5"
          ></textarea>
        </div>
        <button
          type="submit"
          onClick={() => {
            fileSubmit;
          }}
          className="rounded-none mt-16 w-full h-12 bg-main-400 text-white"
        >
          수정 완료
        </button>
      </form>
    </div>
  );
};

export default Editprofile;
