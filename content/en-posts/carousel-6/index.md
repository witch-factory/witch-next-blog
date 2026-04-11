---
title: Project Work - Carousel Creator 6
date: "2022-08-30T00:00:00Z"
description: "The sixth installment of the Carousel Creator series, handling touch events."
tags: ["web", "front", "react"]
---

# 1. Necessity of Touch Events

Currently, our carousel can only be operated using mouse clicks. However, in a mobile environment, clicking the arrow buttons with a mouse to navigate to the next page is not user-friendly. We need to allow users to swipe on mobile screens to navigate the carousel. Therefore, we will implement this feature.

# 2. Detecting Touch Events

The logic to detect when a user swipes on a mobile screen is straightforward. First, we record the initial touch position when the user touches the screen. As the user moves their touch, we continuously update this position. If the current touch position deviates beyond a certain threshold (in this case, more than 10 pixels) from the original touch start position along the X-axis, we consider it a swipe. Let's implement this.

First, we will create a state to store the user's touch position and a function `handleTouchStart` to save the position when the user begins touching.

```tsx
// The touch position is null when no touch has started
const [touchPosition, setTouchPosition] = useState<number | null>(null);

const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
  const touchDown = e.touches[0].clientX;
  setTouchPosition(touchDown);
};
```

Next, we will create a function `handleTouchMove` to update the touch position every time the user moves their touch. This function calculates the difference between the saved touch position and the current touch position, considering a swipe if the difference exceeds a specified amount (10 pixels in this case).

When a swipe occurs, we call the `prevClick` and `nextClick` functions used for navigating the carousel in the appropriate direction. Also, after a swipe, we reset `touchPosition` to null, ensuring that even a longer swipe is counted as a single swipe.

```tsx
const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
  // Save the starting touch position
  const touchStarted = touchPosition;
  // If the touch has not started or has already ended
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

Now, we need to apply these touch-related functions to the div wrapping the carousel. Note that we will not apply swipe events to the navigation, so care should be taken not to attach events to the element wrapping the navigation.

The updated carousel component is as follows:

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
    // A negative difference indicates a swipe to the right
    if (diff < -10) {
      prevClick();
    }

    setTouchPosition(null);
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
      <div
        className="relative flex flex-row justify-between w-full h-[50vh]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {/* These CarouselItems have absolute positioning, so they do not occupy space in the layout */}
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

Now, let’s test the carousel in a mobile environment using Chrome’s developer tools device toolbar. We have now enabled swiping to navigate the carousel. The next article will finalize the carousel by reflecting various minor adjustments in the design.

# References

An article detailing how to create a carousel that supports swiping. This article has been followed exactly. https://dev.to/rakumairu/how-to-handle-swipe-event-on-react-carousel-24ab