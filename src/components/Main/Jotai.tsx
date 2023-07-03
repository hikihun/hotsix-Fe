import { atom } from "jotai";

//뒤로가기 눌렀을때 regionId, 방구해요/방있어요 버튼 유지를 위해서 전역변수로 설정
export const isSelectedFindRoomAtom = atom<boolean>(true);
export const isSelectedHasRoomAtom = atom<boolean>(false);
export const regionIdAtom = atom<number | undefined>(undefined);
