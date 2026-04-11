---
title: Project Work - Carousel Creator 3
date: "2022-08-27T00:00:00Z"
description: "The third installment of the carousel creator, making the carousel look more like a carousel."
tags: ["web", "front", "react"]
---

# 1. The Carousel Doesn't Look Like a Carousel

In the first article, we mentioned some conditions for a carousel, including the following:

- There are indicators or navigation to inform users that there are more contents to scroll through within the carousel.
- It contains images and short text.

However, our carousel does not meet these conditions. It relies on `Previous Slide` and `Next Slide` buttons for navigation and lacks short text for descriptions. Since the carousel represents key images on the site, it could include slogans, links, and much more. Additionally, the slide transitions occur with a dull static image change, without any animation.

This article aims to address these design issues. Although we are not designers, we will attempt to make it look more like a carousel than before.

# 2. Adding Animation

Currently, the created carousel changes images directly without any transition effect. However, a typical carousel features a transition effect when images change. Let's add this effect.

This is simple. We just need to apply a transition for the `transform` property in the `CarouselItem` component. We will use Tailwind's transition-related classes for this purpose. Tailwind's default duration is 150ms, which feels too short, so we will extend it to 500ms. You will notice the classname `transition-transform duration-500` added to the top-level div.

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
      className={`transition-transform duration-500 absolute w-full h-full shrink-0 ${carouselItemTranslateX[itemState]}`}
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

# 3. Changing Carousel Navigation to Arrows

Currently, below the image in the carousel, there are `Previous Slide` and `Next Slide` buttons. Let's make this more user-friendly by replacing these buttons with left and right arrow icons, and enabling the carousel to move when clicked.

We can use the arrow icons from `react-icons`, which can be installed via npm. I have already installed `react-icons` while creating other pages of the project, so I will use `IoIosArrowForward` and `IoIosArrowBack` here.

First, let's import `IoIosArrowForward` and `IoIosArrowBack`. The current structure of the carousel is as follows. Carousel items are inside a div with a relative position, and each item is positioned absolutely. Elements specified with absolute positioning do not occupy space in the normal document flow, so the parent div is considered empty.

We need to place the arrow icons in this relative position div. Adding the classes `flex flex-row justify-between` will align the two arrows to the ends. We will connect the onClick events of these arrows to the existing `prevClick` and `nextClick` functions. The component structure for the carousel code should be modified as follows:

```tsx
<section>
  <div className="overflow-hidden">
    <div className="relative flex flex-row justify-between w-full h-[50vh]">
      {/* These CarouselItems have absolute positioning, so they do not occupy space in the layout */}
      {items.map((item, index) => (
        <CarouselItem
          key={item.id}
          item={item}
          itemState={determineCarouselItemState(index, carouselIndex)}
        />
      ))}
      <button onClick={prevClick} className="z-10 h-full">
        <IoIosArrowBack className="text-base-100" size={60} />
      </button>
      <button onClick={nextClick} className="z-10 h-full">
        <IoIosArrowForward className="text-base-100" size={60} />
      </button>
    </div>
  </div>
</section>
```

# 4. Adding Text and Links Within the Carousel

Typical carousels often include text and links. Let's add these elements to our carousel. First, we need to modify `CarouselItemType` as follows. We will add properties for title, subtitle, content, and a link corresponding to each carousel item.

```tsx
interface CarouselItemType {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  content: string;
  link: string;
}
```

Next, we create a sample that includes the following content. The details can be adjusted later, so let’s start with these placeholders:

```tsx
const tempItems: CarouselItemType[] = [
  {
    id: 1,
    image: carouselImage,
    title: "Welcome",
    subtitle: "This is the first sample carousel.",
    content: "This is the content of the sample carousel.",
    link: "/",
  },
  {
    id: 2,
    image: carouselImage2,
    title: "Welcome 2",
    subtitle: "This is the second sample carousel.",
    content: "This is the content of the sample carousel.",
    link: "/",
  },
  {
    id: 3,
    image: carouselImage3,
    title: "Welcome 3",
    subtitle: "This is the third sample carousel.",
    content: "This is the content of the sample carousel.",
    link: "/",
  },
];
```

Now we need to create a space to accommodate these new elements. The new title and subtitle should overlay the carousel item images, indicating that this content should be positioned without interfering with the flow of the document. Thus, these elements should also be positioned absolutely. There is no need to worry about positioning in ancestors because there are already absolutely positioned elements in the parents.

After structuring the div, we can freely place the inner contents, which I simply arranged vertically. Additionally, I used a button provided by daisyUI for the links, wanting to use the glass effect. The link will use the Link component from react-router-dom. The individual carousel item will be arranged in the following component:

```tsx
<div className="absolute flex flex-col gap-2 items-center">
  <h1 className="text-4xl text-base-100">{item.title}</h1>
  <h2 className="text-2xl text-base-100">{item.subtitle}</h2>
  <p className="text-base text-base-100">{item.content}</p>
  <Link to={item.link}>
    <button className="btn btn-primary w-32 btn-outline glass hover:glass">
      Go to
    </button>
  </Link>
</div>
```

Now that we’ve designed the elements that will overlay on the image, we need to position them correctly. This can be achieved by specifying the `flex flex-col justify-center items-center` classes in the upper component. The completed `CarouselItem` component looks like this:

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
      className={`absolute flex flex-col justify-center items-center w-full h-full shrink-0 transition-transform duration-500 ${carouselItemTranslateX[itemState]}`}
    >
      <img
        className="object-fill w-full h-full"
        src={item.image}
        alt={`carousel-item-${item.id}`}
      />
      {/* These are the elements placed over the image, including text and links */}
      <div className="absolute flex flex-col gap-2 items-center">
        <h1 className="text-4xl text-base-100">{item.title}</h1>
        <h2 className="text-2xl text-base-100">{item.subtitle}</h2>
        <p className="text-base text-base-100">{item.content}</p>
        <Link to={item.link}>
          <button className="btn btn-primary w-32 btn-outline glass hover:glass">
            Go to
          </button>
        </Link>
      </div>
    </div>
  ) : null;
}
```

This arrangement successfully places the desired title, subtitle, content, and link button over the images of the carousel items. The current appearance of the carousel is as follows:

![carousel-2-2](./carousel-3-1.png)

However, in this state, the text often gets obscured by the images in the background. A complete solution would be to apply a blur effect to the background images using a backdrop filter. This can be done with the Tailwind class `backdrop-blur-md`.

Of course, if there are a lot of white areas in the background image, the text might still be hard to see. In such cases, changing the text color to black could also be a solution. But for now, let’s settle with just the blur effect.

The design might be a bit rudimentary, but it looks like it contains all the necessary features, and the buttons function correctly. There are some animation effects, albeit a little cheesy. Although it seems we are done, there’s still more to consider. We need to implement navigation and ensure responsiveness for touch events in mobile environments. Accessibility also needs to be addressed. The complexity of creating a carousel is certainly no joke. Nevertheless, it seems we have cleared one hurdle. Thus, I will conclude this article and, in the next article, we will focus on creating the carousel’s navigation.

# References

Use union types instead of enum types: https://engineering.linecorp.com/ko/blog/typescript-enum-tree-shaking/

Absolute positioning: https://developer.mozilla.org/ko/docs/Web/CSS/position

For more detailed information about position in CSS: https://velog.io/@rimu/css-%EC%9A%94%EC%86%8C%EC%9D%98-%EC%9C%84%EC%B9%98position-%EC%A0%95%EB%A6%AC