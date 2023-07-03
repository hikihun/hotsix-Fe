import { BsDot } from "react-icons/bs";
import { useState, useCallback } from "react";
import CarouselItem from "./CarouselItem";

interface CarouselProps {
  items: string[];
}

const Carousel = (props: CarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mouseDownClientX, setMouseDownClientX] = useState(0);
  const [mouseDownClientY, setMouseDownClientY] = useState(0);
  const [touchedX, setTouchedX] = useState(0);
  const [touchedY, setTouchedY] = useState(0);
  const { items } = props;

  const updateIndex = useCallback(
    (value: -1 | 1) => {
      let newIndex;
      if (value < 0) {
        if (activeIndex === 0) {
          newIndex = 0;
        } else {
          newIndex = activeIndex - 1;
        }
      } else {
        if (activeIndex === items.length - 1) {
          newIndex = activeIndex;
        } else {
          newIndex = activeIndex + 1;
        }
      }
      setActiveIndex(newIndex);
    },
    [activeIndex, items.length]
  );

  //마우스event로 캐러셀 사진 넘기기
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setMouseDownClientX(e.clientX);
    setMouseDownClientY(e.clientY);
  };
  const onMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    const dragSpaceX = Math.abs(e.clientX - mouseDownClientX);
    const dragSpaceY = Math.abs(e.clientY - mouseDownClientY);
    const vector = dragSpaceX / dragSpaceY;
    if (mouseDownClientX !== 0 && dragSpaceX > 50 && vector > 2) {
      if (e.clientX < mouseDownClientX) {
        updateIndex(1);
      } else if (e.clientX > mouseDownClientX) {
        updateIndex(-1);
      }
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchedX(e.changedTouches[0].pageX);
    setTouchedY(e.changedTouches[0].pageY);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const distanceX = touchedX - e.changedTouches[0].pageX;
    const distanceY = touchedY - e.changedTouches[0].pageY;
    const vector = Math.abs(distanceX / distanceY);
    if (distanceX > 30 && vector > 2) {
      updateIndex(1);
    } else if (distanceX < -30 && vector > 2) {
      updateIndex(-1);
    }
  };

  return (
    <div className="relative flex flex-col max-w-full h-full justify-center overflow-hidden">
      <div
        className="w-full h-full whitespace-nowrap transition-transform duration-300"
        style={{
          transform: `translate(-${activeIndex * 100}%) `,
        }}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {items.map((item) => {
          if (items.length === 0) return null;
          return (
            <div className="inline-flex flex-col items-center justifiy-center w-full h-full" key={item}>
              <CarouselItem item={item} />
            </div>
          );
        })}
      </div>
      <div className="flex justify-evenly ">
        <div className="flex absolute bottom-2">
          <div className="flex flex-row justify-center -space-x-3">
            {items.map((_, idx) => {
              return (
                <div key={idx} onClick={() => setActiveIndex(idx)}>
                  <BsDot className={`text-3xl ${activeIndex === idx ? "text-indigo-400" : "text-indigo-200"}`} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
