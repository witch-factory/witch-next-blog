---
title: Project Task - Carousel Creator 5
date: "2022-08-29T00:00:00Z"
description: "The fifth installment of the chaotic Carousel Creator, renewing the carousel operation method"
tags: ["web", "front", "react"]
---

# 1. Changing the Carousel Operation Method

The carousel created so far operates by arranging images in a long strip and translating them. However, this posed several challenges regarding transition effects. Therefore, it will be altered to a different method.

Originally, I planned to renew the previous writings to align with the newly designed method, but I will leave the previous writings untouched to preserve the traces of various contemplations.

The newly designed method is as follows. It saves two page indices: `previousIndex` for the image that was displayed previously and `currentIndex` for the currently displayed image. When displaying a new image, the existing displayed image index is sent to `previousIndex`, and the new image index is set to `currentIndex`.

Then, the previous image is displayed with an opacity of 0, while the new image is displayed with an opacity of 1. By setting the z-index of the previous image higher than that of the new image, the previously displayed image disappears, and the new image appears.

The new image is rendered immediately, but the previous image has a higher z-index. This way, the existing image effectively covers the new image while diminishing in opacity and disappearing.

# 2. Changing the Carousel Operation Method - Code

## 2.1 Type Definitions

The type representing the state of each page in the carousel has been redefined as follows.

```tsx
const CarouselItemStates = {
  CURRENT: "current",
  PREVIOUS: "previous",
  INACTIVE: "inactive",
} as const;
type CarouselItemStateType =
  typeof CarouselItemStates[keyof typeof CarouselItemStates];
```

As the names suggest, `CURRENT` represents the currently displayed page, `PREVIOUS` is the page previously displayed, and `INACTIVE` is the page that is not displayed.

## 2.2 CarouselItem Component

The CarouselItem component has been modified as follows. The currently displayed page has an opacity of 1, while the previous page has an opacity of 0 and a higher z-index to create a disappearing effect for the user. The inactive state page is given a hidden class (equivalent to `display:none`), but if the page is in the inactive state, it returns null to prevent rendering.

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
            Go
          </button>
        </Link>
      </div>
    </div>
  ) : null;
}
```

## 2.3 Carousel Component

The Carousel component has been modified as follows. The format of `carouselIndex` has been changed, and the `prevClick` and `nextClick` functions have been updated accordingly. Additionally, the `determineCarouselItemState` function has been introduced to determine the state of each page.

With the change in the carousel operation method, there are no more images spilling outside the screen. Therefore, the div element that previously had the `overflow-hidden` class has been removed.

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

  // Function to determine the state of each carousel item
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
        {/* These CarouselItems do not occupy space in the layout due to absolute positioning */}
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

The transition effects upon navigation now work effectively. Regardless of the page moved to, the existing image vanishes and the new image is well displayed. In subsequent writings, I will address various minor adjustments and handle touch events.