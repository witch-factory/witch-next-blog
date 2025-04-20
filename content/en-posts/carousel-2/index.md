---
title: Project Work - Carousel Creator 2
date: "2022-08-26T00:00:00Z"
description: "The second installment of the lively carousel creator, focused on creating a flexible code carousel with less rendering."
tags: ["web", "front", "react"]
---

# 1. Start Creating an Improved Carousel

In the previous article (https://www.witch.work/carousel-1/), we created a carousel using Tailwind CSS. However, there were the following issues:

1. Only one image is visible on the screen, but eventually all images need to be rendered.
2. An object for calculating the translate width must be hardcoded or other styling outside of Tailwind must be used.

In this article, we will improve those issues and create a cleaner and less rendering-intensive carousel.

# 2. Render Only the Current and Adjacent Images

How can we reduce the number of images rendered in the carousel? By rendering only the visible images. Therefore, we will render just the currently displayed image, the previous image, and the next image. The reason for rendering the previous and next images is to add animations when transitioning between slides in the carousel.

First, let’s define the following type.

```tsx
interface CarouselIndexType {
  prevIndex: number;
  currentIndex: number;
  nextIndex: number;
}
```

## 2.1 CarouselItem Component

Now, how do we render the images of the carousel using this type? We thought of passing the current state to the `CarouselItem` component and rendering the elements differently based on that state. Thus, we created a function that takes the indices that the carousel should currently display and the index of the carousel item to return the state of that item.

```tsx
const CarouselItemStates = {
  PREV: "prev",
  CURRENT: "current",
  NEXT: "next",
  INACTIVE: "inactive",
} as const;
type CarouselItemStateType =
  typeof CarouselItemStates[keyof typeof CarouselItemStates];

function determineCarouselItemState(
  itemIndex: number,
  carouselIndex: CarouselIndexType
): CarouselItemStateType {
  switch (itemIndex) {
    case carouselIndex.prevIndex:
      return "prev";
    case carouselIndex.currentIndex:
      return "current";
    case carouselIndex.nextIndex:
      return "next";
    default:
      return "inactive";
  }
}
```

Instead of using an enum type, we opted for a union type as it is believed to be better. Enum types do not exist in JavaScript, so the TypeScript compiler creates an immediately invoked function expression, which is not ideal due to the lack of tree-shaking. A reference to this is noted in the LINE Engineering Technical Blog, which will be included in the references below.

Now let’s make the `CarouselItem` component operate by taking the required state as an argument and applying styles accordingly. We will use the states: prev, current, next, and inactive from the return value of `determineCarouselItemState`.

The desired states are as follows:

- prev: Image displayed when moving left
- current: Currently displayed image
- next: Image displayed when moving right
- inactive: Currently not visible image

![carousel-model](./carousel-2-1.png)

To implement this, we set each image to have an absolute position. We will assign their locations with the following classNames:

- prev: `-translate-x-full` (equivalent to transform: translateX(-100%);)
- current: `translate-x-0` (equivalent to transform: translateX(0); no need for translation, so it can be set to an empty string)
- next: `translate-x-full` (equivalent to transform: translateX(100%);)
- inactive: Not rendered

By setting the parent component's position to relative and the item width to 100%, only the current item's state will be visible on the screen. The previous and next slides will be hidden off-screen to the left and right respectively, while the inactive state items will not be rendered.

The implemented `CarouselItem` component is as follows:

```tsx
function CarouselItem({
  item,
  itemState,
}: {
  item: CarouselItemType;
  itemState: CarouselItemStateType;
}) {
  const carouselItemTranslateX = {
    [CarouselItemStates.PREV]: "-translate-x-full",
    [CarouselItemStates.CURRENT]: "",
    [CarouselItemStates.NEXT]: "translate-x-full",
  };

  return itemState !== CarouselItemStates.INACTIVE ? (
    <div
      className={`absolute w-full h-full shrink-0 ${carouselItemTranslateX[itemState]}`}
    >
      <img
        className="object-fill w-full h-full"
        src={item.image}
        alt={`carousel-item-${item.id}`}
      />
    </div>
  ) : null;
}
```

As the position is set to absolute, it does not automatically fit the height of the parent component. Therefore, we added `h-full` to the className to ensure the item fits within the available height.

## 2.2 Carousel Component

Now we can render the `CarouselItem` components within the `Carousel` component. We removed the existing translation state and added a `carouselIndex` state that indicates the index of the currently rendered image. We also modified the `prevClick` and `nextClick` functions accordingly. Additionally, we set the relative position on the higher level where the `CarouselItem` components are rendered, allowing individual components to move in accordance with the rendering position of the `Carousel` component.

```tsx
function Carousel({ items }: { items: CarouselItemType[] }) {
  const [carouselIndex, setCarouselIndex] = useState<CarouselIndexType>({
    prevIndex: items.length - 1,
    currentIndex: 0,
    nextIndex: 1,
  });

  const prevClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (carouselIndex.currentIndex === 0) {
      setCarouselIndex({
        prevIndex: items.length - 2,
        currentIndex: items.length - 1,
        nextIndex: 0,
      });
    } else if (carouselIndex.currentIndex === 1) {
      setCarouselIndex({
        prevIndex: items.length - 1,
        currentIndex: 0,
        nextIndex: 1,
      });
    } else {
      setCarouselIndex({
        prevIndex: carouselIndex.currentIndex - 2,
        currentIndex: carouselIndex.currentIndex - 1,
        nextIndex: carouselIndex.currentIndex,
      });
    }
  };

  const nextClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (carouselIndex.currentIndex === items.length - 1) {
      setCarouselIndex({
        prevIndex: items.length - 1,
        currentIndex: 0,
        nextIndex: 1,
      });
    } else if (carouselIndex.currentIndex === 0) {
      setCarouselIndex({
        prevIndex: 0,
        currentIndex: 1,
        nextIndex: 2,
      });
    } else {
      setCarouselIndex({
        prevIndex: carouselIndex.currentIndex,
        currentIndex: carouselIndex.currentIndex + 1,
        nextIndex: carouselIndex.currentIndex + 2,
      });
    }
  };

  return (
    <section>
      <div className="overflow-hidden">
        <div className={`relative flex flex-row w-full h-[50vh]`}>
          {items.map((item, index) => (
            <CarouselItem
              key={item.id}
              item={item}
              itemState={determineCarouselItemState(index, carouselIndex)}
            />
          ))}
        </div>
      </div>
      <button onClick={prevClick} className="p-3 border border-gray-500">
        Previous Slide
      </button>
      <button onClick={nextClick} className="p-3 border border-gray-500">
        Next Slide
      </button>
    </section>
  );
}
```

Executing this will confirm that it operates as intended. Unlike the previous article, we appropriately used Tailwind styles without hardcoding any values. In the next article, we will add animations and enhance the appearance further.

# References

Using union types over enum types: https://engineering.linecorp.com/ko/blog/typescript-enum-tree-shaking/