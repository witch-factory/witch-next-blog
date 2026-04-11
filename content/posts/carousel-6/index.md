---
title: 프로젝트 작업 - 캐로셀 제작기 6
date: "2022-08-30T00:00:00Z"
description: "우당탕탕 캐로셀 제작기 그 여섯번째, 터치 이벤트 처리"
tags: ["web", "front", "react"]
---

# 1. 터치 이벤트의 필요성

지금 우리의 캐로셀은 오직 마우스 클릭을 이용해서만 사용할 수 있다. 하지만 모바일 환경에서는 마우스로 화살표 버튼을 클릭해서 다음 페이지로 넘어가는 게 그렇게 편한 조작이 아니다. 모바일 화면에서 스와이프를 통해서도 캐로셀을 넘길 수 있게 해야 한다. 따라서 이를 구현한다.

# 2. 터치 이벤트 감지

사용자가 모바일 화면에서 스와이프하는 것을 감지하는 로직은 간단하다. 먼저 사용자가 화면을 터치하면 터치 시작 위치를 기억한다. 그리고 사용자가 터치를 이동하면 그 위치를 계속 갱신한다. 그리고 사용자가 터치하고 있는 위치가 처음에 사용자가 터치를 시작한 위치와 X축 상에서 일정 정도 이상의 차이를 갖게 되면 스와이프를 했다고 간주한다. 이를 구현해보자.

먼저 사용자의 터치 위치를 저장하는 state와 사용자가 터치를 시작할 때 터치한 위치를 저장하는 함수 `handleTouchStart`를 만들어준다.

```tsx
// 터치를 시작하지 않았을 땐 널 상태이다
const [touchPosition, setTouchPosition] = useState<number | null>(null);

const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
  const touchDown = e.touches[0].clientX;
  setTouchPosition(touchDown);
};
```

그리고 사용자가 터치를 이동할 때마다 터치 위치를 갱신하는 함수 `handleTouchMove`를 만들어준다. 이 함수는 `handleTouchStart`에서 저장한 터치 위치와 현재 터치 위치의 차이를 계산해서 그 차이가 일정 정도 이상(여기서는 10픽셀 이상)이면 스와이프를 했다고 간주한다.

이렇게 스와이프가 되었을 떄는 페이지를 넘길 때 사용했던 `prevClick`, `nextClick`함수를 호출해서 적절한 방향으로 캐로셀 페이지를 넘겨준다.

또한 한번 스와이프를 하고 나면 `TouchPosition`을 다시 null로 초기화시켜 준다. 따라서 10픽셀 이상 긴 스와이프를 하더라도 한번만 스와이프된 것으로 간주하도록 한다.

```tsx
const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
  // 터치를 시작했던 위치 저장
  const touchStarted = touchPosition;
  //만약 아직 터치를 시작하지 않았던 상태거나 이미 터지를
  if (touchStarted === null) {
    return;
  }

  const currentTouch = e.touches[0].clientX;
  const diff = touchStarted - currentTouch;

  if (diff > 10) {
    nextClick();
  }

  if (diff < -10) {
    prevClick();
  }

  setTouchPosition(null);
};
```

이제 이 터치 관련 함수들을 캐로셀을 감싸는 div에 적용하면 된다. 이때 캐로셀 네비게이션에는 스와이프 이벤트를 넣지 않을 것이므로 네비게이션까지 감싸는 요소에 이벤트를 넣지 않도록 주의한다.

이를 반영한 캐로셀 컴포넌트는 다음과 같다.

```tsx
function Carousel({ items }: { items: CarouselItemType[] }) {
  const [carouselIndex, setCarouselIndex] = useState<CarouselIndexType>({
    previousIndex: items.length - 1,
    currentIndex: 0,
  });

  const [touchPosition, setTouchPosition] = useState<number | null>(null);

  const prevClick = () => {
    setCarouselIndex((prev) => ({
      previousIndex: prev.currentIndex,
      currentIndex: (prev.currentIndex - 1 + items.length) % items.length,
    }));
  };

  const nextClick = () => {
    setCarouselIndex((prev) => ({
      previousIndex: prev.currentIndex,
      currentIndex: (prev.currentIndex + 1) % items.length,
    }));
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touchDown = e.touches[0].clientX;
    setTouchPosition(touchDown);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touchStarted = touchPosition;

    if (touchStarted === null) {
      return;
    }

    const currentTouch = e.touches[0].clientX;
    const diff = touchStarted - currentTouch;

    if (diff > 10) {
      nextClick();
    }
    // 차이가 음수이면 오른쪽으로 스와이프했다는 뜻
    if (diff < -10) {
      prevClick();
    }

    setTouchPosition(null);
  };

  // 각 캐로셀 아이템의 상태를 결정하는 함수
  const determineCarouselItemState = useCallback(
    (itemIndex: number) => {
      if (itemIndex === carouselIndex.currentIndex) {
        return CarouselItemStates.CURRENT;
      } else if (itemIndex === carouselIndex.previousIndex) {
        return CarouselItemStates.PREVIOUS;
      } else {
        return CarouselItemStates.INACTIVE;
      }
    },
    [carouselIndex]
  );

  return (
    <section>
      <div
        className="relative flex flex-row justify-between w-full h-[50vh]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {/* 이 CarouselItem들은 absolute position이기 때문에 레이아웃에서 공간을 차지하지 않는다 */}
        {items.map((item, index) => (
          <CarouselItem
            key={item.id}
            item={item}
            itemState={determineCarouselItemState(index)}
          />
        ))}
        <button onClick={prevClick} className="z-10 h-full">
          <IoIosArrowBack className="text-base-100" size={60} />
        </button>
        <button onClick={nextClick} className="z-10 h-full">
          <IoIosArrowForward className="text-base-100" size={60} />
        </button>
      </div>
      <CarouselNavigation
        items={items}
        carouselIndex={carouselIndex}
        setCarouselIndex={setCarouselIndex}
      />
    </section>
  );
}
```

이제 크롬의 개발자 도구에서 디바이스 툴바를 이용해서 모바일 환경에서 캐로셀을 테스트해보자. 이제 스와이프로도 캐로셀을 넘길 수 있게 되었다. 다음 글에서는 디자인에서 잡다한 수정 사항들을 반영하면서 캐로셀을 마무리하도록 하겠다.

# 참고

스와이프를 지원하는 캐로셀 만드는 법을 자세히 설명한 글. 이 글을 그대로 따라했다. https://dev.to/rakumairu/how-to-handle-swipe-event-on-react-carousel-24ab
