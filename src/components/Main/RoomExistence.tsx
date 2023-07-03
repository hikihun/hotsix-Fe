import React from "react";

import { useAtomValue } from "jotai";
import { isSelectedFindRoomAtom, isSelectedHasRoomAtom } from "./Jotai";

interface RoomExistProps {
  handleHasRoom: React.MouseEventHandler<HTMLButtonElement> & React.TouchEventHandler<HTMLButtonElement>;
  handleFindRoom: React.MouseEventHandler<HTMLButtonElement> & React.TouchEventHandler<HTMLButtonElement>;
}

const RoomExistence = ({ handleHasRoom, handleFindRoom }: RoomExistProps) => {
  const isSelectedFindRoom = useAtomValue(isSelectedFindRoomAtom);
  const isSelectedHasRoom = useAtomValue(isSelectedHasRoomAtom);

  return (
    <div className="flex justify-evenly mt-2 mb-2 pt-2 pb-2">
      <button
        onClick={handleFindRoom}
        className={`px-9 py-2 rounded-full drop-shadow-xl  ${isSelectedFindRoom ? "bg-main-400 text-white" : " bg-white"}`}
      >
        방 구해요
      </button>
      <button
        onClick={handleHasRoom}
        className={`px-9 py-2 rounded-full drop-shadow-xl  ${isSelectedHasRoom ? "bg-main-400 text-white" : " bg-white"}`}
      >
        방 있어요
      </button>
    </div>
  );
};

export default RoomExistence;
