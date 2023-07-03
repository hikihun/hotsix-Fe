import { Dispatch, SetStateAction } from "react";
import { JsonConfig } from "../API/AxiosModule";

interface Board {
  postId: number;
  nickName: string;
  address: string;
  likesFlag: boolean;
  userFile: string;
  createdAt: string;
  gender: number;
  content: string;
  roomFiles: string;
  commentCount: string;
  memberId: number;
}
interface RegionProps {
  regionId: number;
  sido: string;
  sigg: string;
}

interface RegionAllProps {
  setRegionList: Dispatch<SetStateAction<RegionProps[]>>;
  setUserRegion: Dispatch<SetStateAction<number | undefined>>;
  setRegionId: Dispatch<SetStateAction<number | undefined>>;
  regionId: number | undefined;
  userId: number | undefined;
}

interface GetFindRoomProps {
  setBoardOneList: Dispatch<SetStateAction<Board[]>>;
  regionId?: number | undefined;
  setLastPostId: Dispatch<SetStateAction<number | null>>;
  userId: number | undefined;
}

interface GetHasRoomProps {
  setBoardTwoList: Dispatch<SetStateAction<Board[]>>;
  regionId?: number | undefined;
  setLastPostId: Dispatch<SetStateAction<number | null>>;
  userId: number | undefined;
}

interface loadMoreFindProps {
  regionId: number | undefined;
  lastPostId: number | null;
  userId: number | undefined;
  setBoardOneList: Dispatch<SetStateAction<Board[]>>;
  setLastPostId: Dispatch<SetStateAction<number | null>>;
}

interface loadMoreHasProps {
  regionId: number | undefined;
  lastPostId: number | null;
  userId: number | undefined;
  setBoardTwoList: Dispatch<SetStateAction<Board[]>>;
  setLastPostId: Dispatch<SetStateAction<number | null>>;
}

//첫 화면 지역데이터 다 가져오기
export async function regionAll({ setRegionList, setUserRegion, setRegionId, regionId, userId }: RegionAllProps) {
  await JsonConfig("get", `api/main/${userId}`, null, undefined)
    .then((response) => {
      console.log(response.data);
      setRegionList(response.data.regionMainDtoList);
      setUserRegion(response.data.regionId);
      if (regionId === undefined) {
        setRegionId(response.data.regionId);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

// "방구해요" 게시물 가져오기
export async function getFindRoomPostData({ setBoardOneList, regionId, setLastPostId, userId }: GetFindRoomProps) {
  if (regionId) {
    const params = { size: 10, lastPostId: null };
    await JsonConfig("get", `api/main/${userId}/${regionId}/1`, null, params)
      .then((response) => {
        // console.log(response.data);
        setBoardOneList(response.data.postMainDtoList);
        setLastPostId(response.data.lastPostId);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
//"방구해요" 게시물 무한스크롤
export async function loadMoreFindRoom({ regionId, lastPostId, userId, setBoardOneList, setLastPostId }: loadMoreFindProps) {
  if (regionId && lastPostId !== null) {
    const params = { size: 10, lastPostId: lastPostId };
    await JsonConfig("get", `api/main/${userId}/${regionId}/1`, null, params)
      .then((response) => {
        // console.log(response.data);
        setBoardOneList((prev) => [...prev, ...response.data.postMainDtoList]);
        setLastPostId(response.data.lastPostId);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

//"방 있어요" 게시물 가져오기
export async function getHasRoomPostData({ setBoardTwoList, regionId, setLastPostId, userId }: GetHasRoomProps) {
  if (regionId) {
    const params = { size: 10, lastPostId: null };
    await JsonConfig("get", `api/main/${userId}/${regionId}/2`, null, params)
      .then((response) => {
        // console.log(response.data);
        setBoardTwoList(response.data.postMainDtoList);
        setLastPostId(response.data.lastPostId);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

//"방 있어요" 게시물 무한스크롤
export async function loadMoreHasRoom({ regionId, lastPostId, userId, setBoardTwoList, setLastPostId }: loadMoreHasProps) {
  if (regionId && lastPostId !== null) {
    const params = { size: 10, lastPostId: lastPostId };
    await JsonConfig("get", `api/main/${userId}/${regionId}/2`, null, params)
      .then((response) => {
        console.log(response.data);
        setBoardTwoList((prev) => [...prev, ...response.data.postMainDtoList]);
        setLastPostId(response.data.lastPostId);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
