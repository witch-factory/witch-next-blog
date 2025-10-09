---
title: Project Task - Carousel Navigation 4
date: "2022-08-27T01:00:00Z"
description: "The fourth part of the carousel builder, implementing navigation for the carousel."
tags: ["web", "front", "react"]
---

# 1. Starting the Implementation of Carousel Navigation

In previous posts, we implemented the transition between images in the carousel and designed the UI elements such as buttons. Our carousel is steadily advancing and is beginning to resemble an actual carousel. However, there is still much to be done. We need to implement navigation and make it responsive to touch events for mobile environments, while also considering accessibility. The complexities of building a carousel are not without reason. In this article, we will focus on implementing carousel navigation, aiming not just to line up buttons, but to create a neat and user-friendly design.

The need for navigation arises because the current carousel provides no information beyond the images it displays. Users cannot tell how many images are in the carousel or the significance of each image. While explanations exist, they can only be obtained by navigating through the carousel.

Moreover, even if a user wants to quickly access a specific image, there is currently no way to jump directly to a certain position in the carousel. Therefore, we will create navigation buttons at the bottom of the carousel that allow users to navigate to each page, accompanied by simple descriptions.

For the design of this carousel, I referenced the carousel layout on the MapleStory main homepage (https://maplestory.nexon.com/Home/Main). Of course, the implementation is in a much simplified form.

# 2. Creating Navigation Buttons

First, let’s consider how the navigation will be implemented. Typically, it resides below the carousel. Each navigation element will contain the image and content of a corresponding carousel item. Additionally, there should be an indication of which item is currently being viewed.

I sketched a brief design: the arrows for carousel navigation will also be positioned below.

![caruosel-4-0](./carousel-4-0.jpeg)

We already have properties for each carousel item that provide the image and a brief description: `CarouselItemType`'s `image` and `title`. We will use these properties to create navigation elements displaying each image alongside its description. Let’s start by ensuring all buttons are displayed in a single row.

To achieve this, we will create `CarouselNavigation` and `CarouselNavigationItem` components.

Our designed `CarouselNavigationItem` will consist of a single image and a short text. This could be represented as a collection of `<div>` elements or using `<ul>` and `<li>`. However, I have recently learned about using `<dl>`, `<dt>`, and `<dd>` tags to represent collections of data, and I opted to use them for this implementation. Each `CarouselNavigationItem` will consist of a `<dt>` containing the image and a `<dd>` containing the short text, both wrapped in a `<div>`.

Furthermore, each navigation item will be given a flex-1 class (`flex:1 1 0;`) to ensure that the buttons evenly divide the parent container's width. Since the navigation elements will split the image and text equally, we will also apply the `flex-1` class to the `<dt>` and `<dd>` tags.

```tsx
function CarouselNavigationItem({ item }: { item: CarouselItemType }) {
  return (
    <div className="flex-1 flex flex-row border border-gray-500">
      <dt className="flex-1">
        <img
          className="object-fill w-full h-full"
          src={item.image}
          alt={`carousel-item-${item.id}`}
        />
      </dt>
      <dd className="flex-1 text-sm">{item.title}</dd>
    </div>
  );
}
```

Now, `CarouselNavigation` will consist of a `<dl>` element that includes multiple `CarouselNavigationItem` components. We simply need to arrange them horizontally.

```tsx
function CarouselNavigation({ items }: { items: CarouselItemType[] }) {
  return (
    <dl className="flex flex-row w-full h-10">
      {items.map((item, index) => (
        <CarouselNavigationItem key={index} item={item} />
      ))}
    </dl>
  );
}
```

Adding this to the bottom of the Carousel component will render it as shown below.

![Carousel-4-1](./carousel-4-1.png)

## 2.1 Removing Overlapping Borders

Upon reviewing the rendering, we can observe that the borders of the navigation elements are overlapping where they meet. The solution to this is simple: we need to omit borders in overlapping areas. We will remove the right border of the buttons. Instead of using the simple `border` class, we assign the `border-y border-l` classes. This way, the right border will be removed, leaving the top and left borders intact.

There remains one issue. We expected the right border we discarded to be served by the left border of the next button. However, in the case of the rightmost button, there is no subsequent button present. This means the right border of the rightmost button is entirely absent.

As the buttons currently fit in a single line, we can resolve this by using the `last-child` selector to reintroduce the right border for the rightmost button. This solution might potentially lead to issues if the buttons wrap into two or more lines, but for now, it resolves our current concern.

```tsx
function CarouselNavigationItem({ item }: { item: CarouselItemType }) {
  return (
    <div className="flex-1 flex flex-row border-y border-l last:border-r border-gray-500">
      <dt className="flex-1">
        <img
          className="object-fill w-full h-full"
          src={item.image}
          alt={`carousel-item-${item.id}`}
        />
      </dt>
      <dd className="flex-1 text-sm">{item.title}</dd>
    </div>
  );
}
```

Now, there will be no overlapping borders among the buttons in the current code.

# 3. Indicating the Current Position of Navigation Buttons

Let’s provide information that allows users to see which page they are currently on. A straightforward approach is to visually highlight the navigation element corresponding to the page currently displayed by the carousel. Ideally, this activated element should be positioned in the center of the navigation.

## 3.1 Changing the Color of the Activated Button

First, let’s change the color of the navigation element that corresponds to the current page in the carousel. We will modify the navigation item component to accept the required state as props (which can be states like active, pending, inactive) and render it appropriately based on the state.

To achieve this, let’s create a function that determines the state of the navigation item. For now, it will simply return `active` if the item is activated or `inactive` if it is not.

```tsx
const determineCarouselItemState = (itemIndex: number) => {
  if (itemIndex === carouselIndex.currentIndex) {
    return "active";
  } else {
    return "inactive";
  }
};
```

Next, we’ll modify the carousel navigation item component to accept `itemState` as a prop, which indicates whether the item is activated. We’ll use `carouselItemConfig` to determine styles for brightness, background color, etc. We’ll also ensure that the transition for the activated item is smoothly animated via the transition property.

```tsx
function CarouselNavigationItem({
  item,
  itemState,
}: {
  item: CarouselItemType;
  itemState: string;
}) {
  const carouselItemConfig: { [key: string]: string } = {
    active: "border-none bg-gray-500 text-base-100 hover:bg-gray-600",
    inactive: "border-y border-l last:border-r border-gray-500 brightness-50",
  };

  return (
    <div
      className={`flex-1 flex flex-row transition-all duration-700 ${carouselItemConfig[itemState]}`}
    >
      <dt className="flex-1">
        <img
          className="object-fill w-full h-full"
          src={item.image}
          alt={`carousel-item-${item.id}`}
        />
      </dt>
      <dd className="flex-1 text-sm">{item.title}</dd>
    </div>
  );
}
```

The carousel navigation component will now utilize the `determineCarouselItemState` function to pass `itemState` to each item.

```tsx
function CarouselNavigation({
  items,
  carouselIndex,
}: {
  items: CarouselItemType[];
  carouselIndex: CarouselIndexType;
}) {
  const determineCarouselItemState = (itemIndex: number) => {
    if (itemIndex === carouselIndex.currentIndex) {
      return "active";
    } else {
      return "inactive";
    }
  };

  return (
    <dl className="flex flex-row w-full h-10">
      {items.map((item, index) => (
        <CarouselNavigationItem
          key={index}
          item={item}
          itemState={determineCarouselItemState(index)}
        />
      ))}
    </dl>
  );
}
```

You can now see that the element corresponding to the activated page in the carousel navigation is distinctly highlighted.

![carousel-4-3](./carousel-4-3.png)

## 3.2 Displaying Only a Specific Number of Items in Navigation

But what if the carousel has many pages? Ideally, the number of pages in the carousel should be minimal, but sometimes that is not the case. For instance, the MapleStory main page serves as an important design reference and currently has 25 pages in its carousel. Even using only half of that—approximately 11 pages—results in a cluttered navigation layout.

![carousel-4-4](./carousel-4-4.png)

Therefore, we will design the carousel navigation to display the button for the currently activated page and two buttons on either side, resulting in a total of 5 buttons. The remaining buttons will not be displayed on the screen initially. To implement this, we will modify the previously written `determineCarouselItemState` function as follows.

The activated item will be `active`, the items that are visible but not activated will be `pending`, and items that are completely invisible will be `inactive`.

```tsx
const determineCarouselItemState = (itemIndex: number) => {
  if (itemIndex === carouselIndex.currentIndex) {
    return "active";
  } else if (
    carouselIndex.currentIndex === 0 ||
    carouselIndex.currentIndex === 1
  ) {
    return itemIndex < 5 ? "pending" : "inactive";
  } else if (
    carouselIndex.currentIndex === items.length - 1 ||
    carouselIndex.currentIndex === items.length - 2
  ) {
    return itemIndex >= items.length - 5 ? "pending" : "inactive";
  } else {
    return carouselIndex.currentIndex - 2 <= itemIndex &&
      itemIndex <= carouselIndex.currentIndex + 2
      ? "pending"
      : "inactive";
  }
};
```

We will apply the `hidden` class, which corresponds to `display:none`, to the inactive elements so that they are not visible on the screen. Additionally, we will style the `pending` state appropriately. The `CarouselNavigationItem` component will now look like this.

```tsx
function CarouselNavigationItem({
  item,
  itemState,
}: {
  item: CarouselItemType;
  itemState: string;
}) {
  const carouselItemConfig: { [key: string]: string } = {
    active:
      "border-y border-l last:border-r border-gray-500 bg-gray-500 text-base-100 hover:bg-gray-600",
    pending: "border-y border-l last:border-r border-gray-500 brightness-50",
    inactive: "hidden",
  };

  return (
    <div
      className={`flex-1 flex flex-row transition-all duration-700 ${carouselItemConfig[itemState]}`}
    >
      <dt className="flex-1">
        <img
          className="object-fill w-full h-full"
          src={item.image}
          alt={`carousel-item-${item.id}`}
        />
      </dt>
      <dd className="flex-1 text-sm">{item.title}</dd>
    </div>
  );
}
```

Once complete, rendering the carousel will display it as follows. The design may not be exemplary, but at least each page's corresponding button is displayed, and the buttons for adjacent pages are well presented. The navigation behaves generally correctly when the carousel is at the beginning or the end of the pages, consistently displaying 5 buttons (except when there are fewer than 5 items in the carousel).

![carousel-4-5](./carousel-4-5.png)

# 4. Implementing Navigation Button Actions

Currently, when a navigation item is clicked, there is no moving function to that specific page. Navigating the carousel using the existing arrows merely changes the color of the activated element. Now, let’s implement a feature that allows navigation to specific pages via the navigation items.

However, the functionality for managing the active page index in the carousel is currently handled via the `carouselIndex` state in the `Carousel` component, the parent of `CarouselNavigation`. Thus, we need to pass `setCarouselIndex` as a prop to the `CarouselNavigation` component to add the page navigation functionality.

The modified `CarouselNavigation` component will look like this.

```tsx
function CarouselNavigation({
  items,
  carouselIndex,
  setCarouselIndex,
}: {
  items: CarouselItemType[];
  carouselIndex: CarouselIndexType;
  setCarouselIndex: (newCarouselIndex: CarouselIndexType) => void;
}) {
  const determineCarouselItemState = (itemIndex: number) => {
    if (itemIndex === carouselIndex.currentIndex) {
      return "active";
    } else if (
      carouselIndex.currentIndex === 0 ||
      carouselIndex.currentIndex === 1
    ) {
      return itemIndex < 5 ? "pending" : "inactive";
    } else if (
      carouselIndex.currentIndex === items.length - 1 ||
      carouselIndex.currentIndex === items.length - 2
    ) {
      return itemIndex >= items.length - 5 ? "pending" : "inactive";
    } else {
      return carouselIndex.currentIndex - 2 <= itemIndex &&
        itemIndex <= carouselIndex.currentIndex + 2
        ? "pending"
        : "inactive";
    }
  };

  const onCarouselNavigationItemClick = (itemIndex: number) => {
    setCarouselIndex({
      prevIndex: itemIndex === 0 ? items.length - 1 : itemIndex - 1,
      currentIndex: itemIndex,
      nextIndex: itemIndex === items.length - 1 ? 0 : itemIndex + 1,
    });
  };

  return (
    <dl className="flex flex-row w-full h-10">
      {items.map((item, index) => (
        <CarouselNavigationItem
          key={index}
          item={item}
          itemState={determineCarouselItemState(index)}
          onItemClick={() => {
            onCarouselNavigationItemClick(index);
          }}
        />
      ))}
    </dl>
  );
}
```

The `CarouselNavigationItem` component, which receives the `onCarouselNavigationItemClick` function, will now create buttons and attach the onClick event handler accordingly.

```tsx
function CarouselNavigationItem({
  item,
  itemState,
  onItemClick,
}: {
  item: CarouselItemType;
  itemState: string;
  onItemClick: () => void;
}) {
  const carouselItemConfig: { [key: string]: string } = {
    active:
      "border-y border-l last:border-r border-gray-500 bg-gray-500 text-base-100 hover:bg-gray-600",
    pending: "border-y border-l last:border-r border-gray-500 brightness-50",
    inactive: "hidden",
  };

  return (
    <button
      onClick={onItemClick}
      className={`flex-1 flex flex-row transition-all duration-700 ${carouselItemConfig[itemState]}`}
    >
      <dt className="flex-1">
        <img
          className="object-fill w-full h-full"
          src={item.image}
          alt={`carousel-item-${item.id}`}
        />
      </dt>
      <dd className="flex-1 text-sm">{item.title}</dd>
    </button>
  );
}
```

However, there remains a bothersome issue. Previously, we had included a transform animation for the carousel items to create a motion effect; however, moving pages via the navigation bar buttons does not exhibit the same effect. This is because the carousel only stores the information of the previous and next indices.

While this could be handled to allow for a smooth transition from the current page to the intended page, doing so would create an overwhelming visual experience if many pages were activated in quick succession. Therefore, we will revamp the transition effect.

We will address the carousel's operational logic significantly in the next article.

# References

Design reference: https://maplestory.nexon.com/Home/Main

Use of `<dl>`, `<dt>`, `<dd>` tags: https://xo.dev/why-html-is-important-than-you-think/

Uniformly distributing the width of child elements: https://stackoverflow.com/questions/23930684/allocate-equal-width-to-child-elements-with-css

Meaning of `flex:1 1 0;`: https://heewon26.tistory.com/275

Preventing overlapping borders on buttons: https://stackoverflow.com/questions/12692089/preventing-double-borders-in-css