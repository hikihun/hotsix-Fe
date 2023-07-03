//토큰값 반환(isTokenValid 빼고테스트 완료)

import axios from "axios";
import { setCookie, getCookie, removeCookie } from "./Cookies";
import jwt_decode from "jwt-decode";
import { createKakaoRenewAccessTokenConfig } from "./AxiosModule";
import jwtDecode from "jwt-decode";

//-------------------------------------------------------------------------토큰 저장,삭제,가져오기 액션
const setAccessToken = (token: string) => {
  removeAccessToken();
  localStorage.setItem("accessToken", token);
};

const setRefreshToken = (token: string) => {
  removeRefreshToken();
  setCookie("refreshToken", token, { path: "/" });
};

const getAccessToken = () => {
  const accessToken = localStorage.getItem("accessToken");
  return accessToken;
};

const getRefreshToken = () => {
  const refreshToken = getCookie("refreshToken");
  return refreshToken;
};

const getUserId = () => {
  const userId = Number(localStorage.getItem("userId"));
  return userId;
};

const removeAccessToken = () => {
  localStorage.removeItem("accessTokenExpire");
  localStorage.removeItem("accessToken");
};

const removeRefreshToken = () => {
  removeCookie("refreshTokenExpire");
  removeCookie("refreshToken");
};

//-------------------------------------------------------------------------토큰 유효성 검사 액션
// case 1) access 토큰은 만료, refresh 토큰 유효 ⇒ refresh 토큰을 검증하여 access 토큰 발급
// case 2) : access 토큰은 유효, refresh 토큰은 만료된 경우 ⇒ 일단 진행시키고 access 토큰도 만료되면 로그아웃
// case 3): 두개의 토큰 모두 만료 ⇒ 로그아웃

//토큰이 유효한지 검사(테스트 완료)
//const navigate  = useNavigate();
const isTokenValid = async () => {
  const tokenCategory = localStorage.getItem("tokenCategory");
  let isAccessTokenValid = checkTokenExpiration("accessToken");
  const isRefreshTokenValid = checkTokenExpiration("refreshToken");

  if (isAccessTokenValid) {
    return true;
  }
  while (!isAccessTokenValid) {
    if (tokenCategory === "default") {
      if (!isAccessTokenValid && isRefreshTokenValid) {
        await refreshAccessToken();
        isAccessTokenValid = checkTokenExpiration("accessToken");
        return true;
      } else if (!isAccessTokenValid && !isRefreshTokenValid) {
        removeAccessToken();
        removeRefreshToken();

        console.log("둘다 만료");
        alert("토큰이 만료됐습니다!");
        window.location.href = "/";
        return false;

        // 로그아웃
      }
    } else if (tokenCategory === "kakao") {
      if (!isAccessTokenValid && isRefreshTokenValid) {
        await refreshKakaoAccessToken();
        console.log("$$$$$");
        isAccessTokenValid = checkTokenExpiration("accessToken");
        return true;
      } else if (!isAccessTokenValid && !isRefreshTokenValid) {
        removeAccessToken();
        removeRefreshToken();
        console.log("둘다 만료");
        window.location.href = "/";
        return false;
        // 로그아웃
      }
    }
  }
};

interface DecodedToken {
  email: string;
  exp: number;
  id: number;
  sub: string;
}

//토큰의 유효기간을 추출(테스트 완료)
const getTokenExpiration = (tokenName: string, kakaoExpire: number = -1) => {
  const token = tokenName === "refreshToken" ? getRefreshToken() : tokenName === "accessToken" ? getAccessToken() : null;
  let expirationTime = new Date();

  if (token && kakaoExpire === -1) {
    try {
      if (tokenName === "accessToken") {
        const decodeToken = jwtDecode<DecodedToken>(token);
        const userId = JSON.stringify(decodeToken.id);
        localStorage.setItem("userId", userId);
      }
      const decoded = jwt_decode(token) as { exp: number } | null;
      console.log(decoded);

      if (decoded && decoded.exp) {
        expirationTime = new Date(decoded.exp * 1000);
        console.log(`${tokenName} 만료시간:`, expirationTime);
        const offset = 9 * 60;
        expirationTime.setMinutes(expirationTime.getMinutes() + offset);
        console.log(`${tokenName} 만료시간:`, expirationTime.toISOString());
      } else {
        console.log("잘못된 토큰.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log("잘못된 토큰:", err.message);
      } else {
        console.log("알수없는 에러");
      }
    }
  } else if (token && kakaoExpire != -1) {
    const currentTime = new Date().getTime();
    const remainingTimeInSeconds = kakaoExpire;
    expirationTime = new Date(currentTime + remainingTimeInSeconds * 1000);


    console.log(`${tokenName} 만료시간:`, expirationTime.toISOString());

  } else {
    console.log(`${tokenName} 없음.`);
  }
  tokenName === "refreshToken"
    ? setCookie("refreshTokenExpire", expirationTime.toISOString(), { path: "/" })
    : tokenName === "accessToken"
    ? localStorage.setItem("accessTokenExpire", expirationTime.toISOString())
    : null;
};

//토큰이 만료되기 30분전인지 확인 (테스트 완료)
//let a = 0;
const checkTokenExpiration = (tokenName: string) => {
  const expirationTimeString  =
    tokenName === "refreshToken" ? 
    getCookie("refreshTokenExpire") : tokenName === "accessToken" ? 
    localStorage.getItem("accessTokenExpire") : null;
    const tokenCategory = localStorage.getItem("tokenCategory");

  if (expirationTimeString && tokenCategory === "default") {
    const offset = 9 * 60;
    console.log("예상종료시간",expirationTimeString)
    const  expirationTime  = new Date(expirationTimeString);
    expirationTime.setMinutes(expirationTime.getMinutes() - offset);
    const currentTime = new Date();
    const expirationTimeMs = expirationTime.getTime();
    const currentTimeMs = currentTime.getTime();
    let timeDiffMinutes = Math.ceil((expirationTimeMs - currentTimeMs) / 1000 / 60);
    
    // if (tokenName === "accessToken" && a < 1) {
    //   a++;
    //   timeDiffMinutes = timeDiffMinutes - 99999999999;
    // }

    console.log(`${tokenName}이 만료되기까지` + timeDiffMinutes + `분 남았습니다`);
    if (timeDiffMinutes <= 5) {
      console.log(`${tokenName}이 만료되기 5분전입니다. 갱신합니다`);
      return false;
    } else {
      console.log(`${tokenName}이 유효합니다.`);
      return true;
    }
  }
  else if(expirationTimeString && tokenCategory === "kakao"){
    const currentTime = new Date();
    console.log("예상종료시간",expirationTimeString)
    let timeDiffMinutes = Math.round((new Date(expirationTimeString).getTime() - currentTime.getTime()) / (1000 * 60));
    if (timeDiffMinutes <= 5) {
      console.log(`${tokenName}이 만료되기 5분전입니다. 갱신합니다`);
      return false;
    } else {
      console.log(`${tokenName}이 유효합니다.`);
      return true;
    }
  }else{
    console.log("유효하지 않은 토큰");
  }
};

//토큰 재발급
const refreshAccessToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    const accessToken = getAccessToken();

    const headers = {
      Authorization: accessToken,
      "Authorization-refresh": refreshToken,
    };
    //만료안된 액세스토큰으로 재발급신청하면 재발급이 되는데
    //만료된 액세스토큰으로 재발급신청하면 response.data에 null이 찍힘
    const response = await axios.post("http://localhost:8080/refresh", null, {
      headers: headers,
    });
    console.log(response.data);
    const newAceessToken = response.data["Authorization"];
    console.log(newAceessToken);
    removeAccessToken();
    setAccessToken(newAceessToken);
    console.log(getAccessToken());
    getTokenExpiration("accessToken");

    console.log("Access token 갱신.");
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "에러");
    } else {
      throw new Error("모르는에러?");
    }
  }
};

const refreshKakaoAccessToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    const Rest_api_key = localStorage.getItem("Rest_api_key");
    console.log(Rest_api_key);
    if (Rest_api_key) {
      createKakaoRenewAccessTokenConfig("POST", "refresh_token", Rest_api_key, refreshToken)
        .then((response) => {
          const accessToken = response.data["access_token"];

          if (accessToken) {
            setAccessToken(accessToken); // 로컬스토리지에 액세스토큰 저장
            getTokenExpiration("accessToken", response.data["expires_in"]);
            isTokenValid();
          }
        })
        .catch((error) => {
          console.log("에러");
          console.error(error);
        });
    } else {
      console.log("rest api key없음");
    }
    console.log("Access token 갱신.");
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "에러");
    } else {
      throw new Error("모르는에러?");
    }
  }
};

// const refreshRefreshToken = async () => {
//   try {
//     const refreshToken = getRefreshToken();
//     const accessToken = getAccessToken();

//     const headers = {
//       'Authorization': accessToken,
//       'Authorization-refresh': refreshToken
//     };

//     const response = await axios.post("api엔드포인트",null, {
//         headers:headers
//     });

//     const newRefreshToken = response.data["Authorization-refresh"];
//     removeRefreshToken();
//     setRefreshToken(newRefreshToken);

//     console.log('Access token 갱신.');
//   } catch (error: unknown) {
//     if (axios.isAxiosError(error)) {
//       throw new Error(error.response?.data?.message || "에러");
//     } else {
//       throw new Error("모르는에러?");
//     }
//   }
// };

export {
  getUserId,
  isTokenValid,
  setAccessToken,
  setRefreshToken,
  getRefreshToken,
  getAccessToken,
  removeAccessToken,
  removeRefreshToken,
  checkTokenExpiration,
  getTokenExpiration,
  refreshAccessToken,
};
