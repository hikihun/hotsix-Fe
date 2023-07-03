import { useState } from "react";

interface CarouselItemProps {
  item: string;
}

const CarouselItem = (props: CarouselItemProps) => {
  const { item } = props;
  const [full, setFull] = useState(false);

  const isMobileDevice = () => {
    return navigator.userAgent.indexOf("Mobile") !== -1;
  };

  const handleClick = () => {
    if (isMobileDevice()) {
      setFull(!full);
    }
  };

  return (
    <>
      <img src={item} onClick={handleClick} className={full ? "h-80 w-full object-cover" : "h-80 w-full object-contain"} draggable="false" />
    </>
  );
};

export default CarouselItem;
