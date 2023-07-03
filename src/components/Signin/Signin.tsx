import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { createKakaoLoginConfig, createLoginConfig } from "../API/AxiosModule";
import {
  getTokenExpiration,
  isTokenValid,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "../API/TokenAction";

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenCategory: string;
}

const Signin = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const redirect_uri = "http://localhost:8080/login/oauth2/code/kakao";

  useEffect(() => {
    handleAuthorizationCode();
  }, []);

  const handleAuthorizationCode = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const Rest_api_key = localStorage.getItem("Rest_api_key");

    if (code && Rest_api_key) {
      createKakaoLoginConfig("POST", "authorization_code", Rest_api_key, redirect_uri, code)
        .then((response) => {
          const accessToken = response.data["access_token"];
          const refreshToken = response.data["refresh_token"];

          const tokenResponse: TokenResponse = {
            accessToken: accessToken,
            refreshToken: refreshToken,
            tokenCategory: "kakao",
          };
          const accessTokenExpire = response.data["expires_in"];
          const refreshTokenExpire = response.data["refresh_token_expires_in"];

          handleTokenResponse(tokenResponse, accessTokenExpire, refreshTokenExpire);
        })
        .catch((error) => {
          console.log("에러");
          console.error(error);
        });
    }
  };

  const defaultSignin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    removeAccessToken();
    removeRefreshToken();
    const IDPW = {
      email: email,
      password: password,
    };

    createLoginConfig("POST", "login", IDPW)
      .then((response) => {
        console.log(response);
        const accessToken = response.data["Authorization"];
        const refreshToken = response.data["Authorization-refresh"];

        const tokenResponse: TokenResponse = {
          accessToken: accessToken,
          refreshToken: refreshToken,
          tokenCategory: "default",
        };

        handleTokenResponse(tokenResponse);
      })
      .catch((error) => {
        console.log("에러");
        console.error(error);
      });
  };

  const kakaotalkSignIn = () => {
    removeAccessToken();
    removeRefreshToken();
    localStorage.setItem("Rest_api_key", "f97c55d9d92ac41363b532958776d378");
    const Rest_api_key = localStorage.getItem("Rest_api_key");
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;
    window.location.href = kakaoURL;
  };

  const handleTokenResponse = (tokenResponse: TokenResponse, accessTokenExpire: number = -1, refreshTokenExpire: number = -1) => {
    if (tokenResponse.accessToken && tokenResponse.refreshToken) {
      setAccessToken(tokenResponse.accessToken); // 로컬스토리지에 액세스토큰 저장
      setRefreshToken(tokenResponse.refreshToken); // httponly 쿠키에 refresh 토큰 저장
      localStorage.setItem("tokenCategory", tokenResponse.tokenCategory);
      getTokenExpiration("accessToken", accessTokenExpire);
      getTokenExpiration("refreshToken", refreshTokenExpire);

      isTokenValid().then((response) => {
        if (response === true) {
          //console.log(getUserId());
          navigate("/main"); //메인페이지로 이동
        }
      });
    }
  };

  return (
    <div className="w-full h-screen pt-11 bg-main-100">
      <img className="mx-auto w-44" src="logo.png" alt="" />
      <form className="mt-11" action="">
        <div className="flex flex-col mt-5 items-center">
          <label htmlFor="input-email" className="w-9/12">
            이메일
          </label>
          <div className="flex w-9/12">
            <input type="email" id="input-email" className="w-full h-10" value={email} onChange={(e) => setEmail(e.target.value)} name="email" />
          </div>
        </div>
        <div className="flex flex-col mt-5 items-center">
          <label htmlFor="input-password" className=" w-9/12">
            비밀번호
          </label>
          <div className="flex w-9/12">
            <input
              type="password"
              id="input-password"
              className="w-full h-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
            />
          </div>
        </div>
      </form>
      <div className="bg-main-100">
        <button
          onClick={defaultSignin}
          type="submit"
          className=" flex items-center justify-center mx-auto rounded-none mt-4 py-2 w-9/12 bg-main-400 text-white"
        >
          로그인
        </button>
        <div className="flex justify-between w-9/12 items-center mx-auto mt-2 text-sm ">
          <Link to={"/findPassword"}>비밀번호찾기</Link>
          <Link to={"/Signup"}>회원가입</Link>
        </div>
        <img src="kakao_login_medium_wide.png" className="mx-auto mt-2 w-9/12" onClick={kakaotalkSignIn} />
      </div>
    </div>
  );
};

export default Signin;
