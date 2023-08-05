---
title: 프로젝트 작업 - 캐로셀 제작기 5
date: "2022-08-29T00:00:00Z"
description: "우당탕탕 캐로셀 제작기 그 다섯번째, 캐로셀 작동 방식 리뉴얼"
tags: ["web", "front", "react"]
---

# 1. 캐로셀의 작동 방식 바꾸기

지금까지 만든 캐로셀은 사진을 긴 띠처럼 배열한 후 이를 평행 이동하는 방식으로 작동한다. 하지만 이는 전환 효과 등을 넣는 데에 있어서 여러 힘든 점이 있었다. 따라서 이를 다른 방식으로 바꿀 것이다.

원래는 지금까지 한 글들도 새로 설계한 방식에 맞게 리뉴얼하려고 했지만 여러 방식을 고민했던 흔적을 남겨 놓고자 이전 글들은 그대로 남겨 놓는다.

새로 설계한 방식은 다음과 같다. 이전에 표시하고 있던 이미지의 인덱스(`previousIndex`)와 현재 표시중인 이미지의 인덱스(`currentIndex`) 2개의 페이지 인덱스를 저장해 놓는다. 그리고 새로운 이미지를 표시하려고 할 시 기존에 표시하던 이미지 인덱스를 `previousIndex`로 보내고 새로운 이미지 인덱스를 `currentIndex` 로 만든다.

그 후 이전 이미지는 투명도 0으로 표시하고 새로운 이미지는 투명도 1로 표시한다. 그리고 나서 이전 이미지의 z-index를 새로운 이미지보다 높게 주면 기존에 표시하던 이미지는 사라지고 새로운 이미지가 나타나는 효과를 낼 수 있다.

새로운 이미지는 즉시 렌더링되지만 이전 이미지가 z-index가 더 높다. 그래서 이렇게 하면 기존 이미지가 새로운 이미지를 덮은 상태에서 투명도가 줄어들면서 사라지는 효과를 보일 수 있다.

# 2. 캐로셀의 작동 방식 바꾸기 - 코드

## 2.1 타입 정의

캐로셀의 각 페이지의 상태를 나타내는 타입을 다음과 같이 다시 정의하였다.

```tsx
const CarouselItemStates = {
  CURRENT: "current",
  PREVIOUS: "previous",
  INACTIVE: "inactive",
} as const;
type CarouselItemStateType =
  typeof CarouselItemStates[keyof typeof CarouselItemStates];
```

말 그대로다. currentsms 현재 표시중인 페이지, previous는 이전에 표시하던 페이지, inactive는 표시되지 않는 페이지를 나타낸다.

## 2.2 CarouselItem 컴포넌트

CarouselItem 컴포넌트는 다음과 같이 변경되었다. 현재 표시중인 페이지는 투명도 1, 이전 페이지는 투명도 0인 대신 z-index를 높게 줘서 사라지는 효과가 사용자에게 보일 수 있도록 했다. 그리고 inactive 상태의 페이지는 hidden(`display:none`과 동일)클래스를 줬지만 만약 inactive 상태의 페이지일 경우 아예 null을 반환하여 렌더링이 되지 않도록 했다.

```tsx
function CarouselItem({
  item,
  itemState,
}: {
  item: CarouselItemType;
  itemState: CarouselItemStateType;
}) {
  const carouselItemStateConfig = {
    [CarouselItemStates.CURRENT]: "opacity-100",
    [CarouselItemStates.PREVIOUS]: "opacity-0 z-10",
    [CarouselItemStates.INACTIVE]: "hidden",
  };

  return itemState !== CarouselItemStates.INACTIVE ? (
    <div
      className={`absolute flex flex-col justify-center items-center w-full h-full shrink-0 transition-opacity duration-700 ${carouselItemStateConfig[itemState]}`}
    >
      <img
        className="object-fill w-full h-full"
        src={item.image}
        alt={`carousel-item-${item.id}`}
      />
      <div className="backdrop-blur-md p-3 rounded-3xl absolute flex flex-col gap-2 items-center">
        <h1 className="text-4xl text-base-100">{item.title}</h1>
        <h2 className="text-2xl text-base-100">{item.subtitle}</h2>
        <p className="text-base text-base-100">{item.content}</p>
        <Link to={item.link}>
          <button className="btn btn-primary w-32 btn-outline glass hover:glass">
            이동하기
          </button>
        </Link>
      </div>
    </div>
  ) : null;
}
```

## 2.3 Carousel 컴포넌트

Carousel 컴포넌트는 다음과 같이 변경되었다. carouselIndex 형식을 변경하고 그에 따라 `prevClick`, `nextClick`함수를 변경한 것, 그리고 `determineCarouselItemState`를 도입해 각 페이지의 상태를 결정하는 변경사항이 있었다.

또한 이제 캐로셀의 작동 방식이 바뀌어서 화면 밖으로 넘쳐 나오는 사진이 없다. 따라서 화면 밖으로 나오는 사진을 가리기 위해 `overflow-hidden`클래스를 주었던 div element를 제거하였다.

```tsx
function Carousel({ items }: { items: CarouselItemType[] }) {
  const [carouselIndex, setCarouselIndex] = useState<CarouselIndexType>({
    previousIndex: items.length - 1,
    currentIndex: 0,
  });

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
      <div className="relative flex flex-row justify-between w-full h-[50vh]">
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

네비게이션에 따른 전환 효과도 이제 잘 작동한다. 어떤 페이지로 이동해도 기존 이미지가 사라지고 새로운 이미지가 잘 표시된다. 이제 다음 글들에서는 잡다한 수정 사항들을 처리하고, 터치 이벤트에 대해 처리해 보겠다.
