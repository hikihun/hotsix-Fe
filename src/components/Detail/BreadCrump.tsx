import { BsChevronRight } from "react-icons/bs";

interface BreadCrumpProps {
  category: number;
}

const BreadCrump = (props: BreadCrumpProps) => {
  return (
    <ul className="flex gap-2 text-xs">
      <li>홈</li>
      <li className="flex items-center gap-2">
        <BsChevronRight />
        {props.category === 1 ? "방 구해요" : "방 있어요"}
      </li>
    </ul>
  );
};

export default BreadCrump;
