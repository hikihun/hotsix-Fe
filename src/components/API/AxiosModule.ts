import axios from "axios";
import { getAccessToken, isTokenValid } from "./TokenAction.tsx";
import qs from "qs";

axios.defaults.paramsSerializer = (params) => {
  //params string으로바꾸기

  return qs.stringify(params);
};

const axiosInstance = axios.create();
const accessToken = getAccessToken();

//요청 전 액션
axiosInstance.interceptors.request.use(
  (config) => {
    if (!config.headers.Authorization) {
      //헤더에 액세스토큰 안넣는건 로그인이랑 회원가입?밖에 없으니
      console.log("토큰만료검증 스킵"); //토큰만료 검증 스킵
    } else {
      const res = isTokenValid();
      console.log(res);
    }

    // isTokenValid().then((response)=>{
    //   if(response === false){
    //     window.location.href = 'www.naver.com';
    //   }
    // })

    console.log("1");
    return config;
  },
  (error) => {
    // 요청에 오류가 있으면
    console.log("2");
    return Promise.reject(error);
  }
);

//응답 후 액션
axiosInstance.interceptors.response.use(
  (response) => {
    //응답 성공적이면
    console.log("3");
    return response;
  },
  (error) => {
    //응답이 error로 왔으면
    console.log("4");
    return Promise.reject(error);
  }
);

//로그인할때만 필요
const createLoginConfig = (method: string, url: string, requestBody: unknown) => {
  const config = {
    baseURL: `http://localhost:8080/${url}`,
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    data: requestBody,
  };

  return axiosInstance(config);
};

const SignupConfig = (method: string, url: string, requestBody: unknown) => {
  const config = {
    baseURL: `http://localhost:8080/${url}`,
    method: method,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: requestBody,
  };

  return axiosInstance(config);
};

//로그인할때만 필요
const createKakaoLoginConfig = (method: string, grant_type: string, client_id: string, redirect_uri: string, code: string) => {
  const config = {
    baseURL: "https://kauth.kakao.com/oauth/token",
    method: method,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    data: { grant_type, client_id, redirect_uri, code },
  };

  return axiosInstance(config);
};

//카카오 액세스토큰 갱신
const createKakaoRenewAccessTokenConfig = (method: string, grant_type: string, client_id: string, refresh_token: string) => {
  const config = {
    baseURL: "https://kauth.kakao.com/oauth/token",
    method: method,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    data: { grant_type, client_id, refresh_token },
  };

  return axiosInstance(config);
};

//requestBody 모듈화: unknwon으로 하던가 인터페이스 전부 적어놓고 if else같은걸로 그때그때 맞추던가 해야함
//그외의 요청?

const JsonConfig = (method: string, url: string, requestBody: unknown = null, params: object = {}) => {
  const config = {
    baseURL: `http://localhost:8080/${url}`, //요청을보낼url
    method: method, //get,post,delete등 요청을 보낼방식
    headers: {
      //요청 헤더에 들어갈 부분
      Authorization: `Bearer ${accessToken}`, //액세스토큰을 넣고
      "Content-Type": "application/json", //data의 형식을 정의
    },
    data: requestBody, //요청 본문엔 requestbody가 들어감
    params: params, //params는 url끝에 딸려들어감
  };
  console.log(params);
  return axiosInstance(config);
};

const MultiConfig = (method: string, url: string, requestBody: unknown = null, params: object = {}) => {
  const config = {
    baseURL: `http://localhost:8080/${url}`,
    method: method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    },
    data: requestBody,
    params: params,
  };
  return axiosInstance(config);
};

// createLoginConfig(원하는method,엔드포인트,요청본문에 들어갈거,params 넣을거).then((response)=>{
//response 왔을때 할 행동 (response.data로 뭐 한다던지)
// }).catch((error)=>{
//   console.log("에러")
//   console.error(error);
// });

export { createLoginConfig, JsonConfig, createKakaoLoginConfig, MultiConfig, createKakaoRenewAccessTokenConfig, SignupConfig };
