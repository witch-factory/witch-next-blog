---
title: Project Work - Carousel Creator 1
date: "2022-08-25T00:00:00Z"
description: "The first installment of a lively carousel creator, implementing the key action of transitioning between slides."
tags: ["web", "front", "react"]
---

# 1. Creating a Carousel

A carousel is an interface that allows users to view multiple images and content by transitioning through them. It is also referred to as a slider. This carousel has the following features:

- It appears at the top of the website.
- It occupies a significant portion of the monitor upon loading.
- It displays multiple images one at a time.
- Indicators or navigation elements inform users that there is additional content to slide through.
- It contains images along with brief text.
- The content pertains to organizational introductions, missions, key information, or promotions.

Of course, there are pros and cons to using a carousel. In most cases, it is better to use a hero image. However, carousels are still widely used, and I do not consider them to be bad design. Therefore, I decided to implement a carousel menu on the homepage of my project.

Creating a carousel, however, is not an easy task. Especially when considering various exceptional scenarios. Hence, I will outline the process of creating a carousel and handling various situations here.

The project utilizes React, Tailwind, and TypeScript. Thus, the code will be written in React, Tailwind, and TypeScript. Additionally, we are using DaisyUI, a UI component library. However, if we were to use a UI component for the carousel, I would likely have used the carousel provided by DaisyUI instead.

![carousel](./carousel-1.jpeg)

# 2. Displaying Images

The carousel essentially comprises multiple images displayed one at a time. So, after rendering the multiple images, it should suffice to show only one on the screen, right?

![carousel2](./carousel-2.png)

Let’s try writing the code. What should the carousel component look like? In its simplest form, it should accept some images and render them in a carousel format. Therefore, we will first render the images in a long format and then display only one on the screen. The individual item type for the carousel can be defined as follows:

```tsx
interface CarouselItemType {
  id: number;
  image: string;
}
```

How can we render this as desired? Since it needs to be arranged horizontally, it should be laid out using flex. The height must also be fixed. Here, it is set to 50% of the viewport's height. The width should be sufficient to include all the elements inside, hence we use fit-content. Lastly, to ensure that parts extending beyond the screen are hidden, we set overflow-hidden on the parent element. Thus, the carousel component is structured as follows:

```tsx
function Carousel({ items }: { items: CarouselItemType[] }) {
  return (
    <section className="overflow-hidden">
      <div className="flex flex-row w-fit h-[50vh]">
        {items.map((item) => (
          <CarouselItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
```

Imagine a strip of images stretching horizontally, where only the first image is visible on the screen, while the rest are cut off.

Now, how should `CarouselItem` be constructed? Since we want to show only one image at a time, it should have full width (`width:100%`). Additionally, since the image's width should not be reduced, we also set the shrink property. It can be written as follows:

```tsx
function CarouselItem({ item }: { item: CarouselItemType }) {
  return (
    <div className="w-full shrink-0">
      <img
        className="object-fill w-full h-full"
        src={item.image}
        alt={`carousel-item-${item.id}`}
      />
    </div>
  );
}
```

To ensure the image fully occupies the box, we applied full width and full height, along with the object-fit option to prevent the image from shrinking to fit the container div. With this, the basic elements are in place. Next, let’s create the transition effect for the images.

# 3. Creating the Transition Effect for the Images

How can we display the next image? Imagine the current structure of the carousel. The long strip of images is contained within a `section` tag, revealing only a portion at a time. By moving this strip a bit, we could change the visible portion.

This is achieved through the `transform` property with `translate`. First, let’s create the buttons to move the slides. We can insert "Previous Slide" and "Next Slide" buttons below the carousel. The modified code of the Carousel component is as follows:

```tsx
function Carousel({ items }: { items: CarouselItemType[] }) {
  return (
    // The section tag becomes the outermost tag, but the layout remains unchanged.
    <section>
      <div className="overflow-hidden">
        <div className="flex flex-row w-fit h-[50vh]">
          {items.map((item) => (
            <CarouselItem key={item.id} item={item} />
          ))}
        </div>
      </div>
      {/* Added previous slide and next slide buttons. */}
      <button className="p-3 border border-gray-500">Previous Slide</button>
      <button className="p-3 border border-gray-500">Next Slide</button>
    </section>
  );
}
```

Now that the buttons for sliding have been created, we just need to implement the functionality. The CSS translate values should be adjusted according to button clicks.

```tsx
function Carousel({ items }: { items: CarouselItemType[] }) {
  const [translation, setTranslation] = useState(0);

  // Move to the previous slide
  const prevClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (translation === 0) {
      setTranslation(items.length - 1);
    } else {
      setTranslation(translation - 1);
    }
  };

  // Move to the next slide
  const nextClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (translation === items.length - 1) {
      setTranslation(0);
    } else {
      setTranslation(translation + 1);
    }
  };

  return (
    <section>
      <div className="overflow-hidden">
        <div
          // Adjust the translation based on the state.
          className={`flex flex-row w-fit h-[50vh] translate-x-[-${
            translation * 100
          }%]`}
        >
          {items.map((item) => (
            <CarouselItem key={item.id} item={item} />
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

Now, when the buttons are clicked, the carousel should transition while the images shift!

---

It doesn't work. No matter how many times I click the button, the images do not move. Checking the developer tools shows that the CSS values are changing correctly, and there are no apparent errors... Why isn’t it working?

# 4. Troubleshooting the Issue of Non-Moving Images

Tailwind does not directly parse our source code or execute any part of it. It merely searches for strings that could be Tailwind classes through regular expressions. It does not even look for parts in `className="..."`. Instead, it scans the entire source code. This information can be found in the official documentation referenced below.

An important point here is that the CSS is not produced by executing the source code but merely by searching for elements that can become class names in the code. Therefore, only a `complete unbroken string` will be found; a string that is not interrupted by any calculations.

Dynamic class naming can be enabled through safelisting, according to the official documentation, but this is not recommended at all.

In essence, we must provide complete class names rather than creating dynamic strings as explained above. String interpolation or appending parts of the class name result in the class name not being recognized.

How can we resolve this? One method is to use the `classnames` library (https://www.npmjs.com/package/classnames). However, this approach does not seem promising.

What if we create a complete class name using a function and pass it to the class? The following code can be written.

```jsx
function Carousel({ items }: { items: CarouselItemType[] }) {
  const [translation, setTranslation] = useState(0);

  const prevClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (translation === 0) {
      setTranslation(items.length - 1);
    } else {
      setTranslation(translation - 1);
    }
  };

  const nextClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (translation === items.length - 1) {
      setTranslation(0);
    } else {
      setTranslation(translation + 1);
    }
  };

  const calculateTranslation = (index: number) => {
    return `translate-x-[-${index * 100}%]`;
  };

  return (
    <section>
      <div className="overflow-hidden">
        <div
          className={`flex flex-row w-fit h-[50vh] ${calculateTranslation(
            translation
          )}`}
        >
          {items.map((item) => (
            <CarouselItem key={item.id} item={item} />
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

However, it seems the function is still treated as creating a dynamic class name. It did not work at all. I also attempted to create an object that could acquire the class name through the `items` array but every attempt focused on dynamically generating class names ended in failure.

The only successful method was utilizing a statically created object, `translateConfig`.

```tsx
function Carousel({ items }: { items: CarouselItemType[] }) {
  const [translation, setTranslation] = useState(0);

  const prevClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (translation === 0) {
      setTranslation(items.length - 1);
    } else {
      setTranslation(translation - 1);
    }
  };

  const nextClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (translation === items.length - 1) {
      setTranslation(0);
    } else {
      setTranslation(translation + 1);
    }
  };

  const translateConfig: { [key: number]: string } = {
    0: "translate-x-[0%]",
    1: "translate-x-[-100%]",
    2: "translate-x-[-200%]",
    3: "translate-x-[-300%]",
    4: "translate-x-[-400%]",
    5: "translate-x-[-500%]",
  };

  return (
    <section>
      <div className="overflow-hidden">
        <div
          className={`flex flex-row w-fit h-[50vh] ${translateConfig[translation]}`}
        >
          {items.map((item) => (
            <CarouselItem key={item.id} item={item} />
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

If the object is declared statically, retrieving values from it does not count as dynamic in nature. While it requires predefining the object, realistically, since we are not likely to place many images in the carousel, creating an object that covers up to approximately 30 images, or `translate-x-[-3000%]`, would function without issue.

Another method involves applying styles independent of Tailwind. As Tailwind is fundamentally CSS-based, both can be used together. The code is as follows:

```tsx
function Carousel({ items }: { items: CarouselItemType[] }) {
  const [translation, setTranslation] = useState(0);

  const prevClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (translation === 0) {
      setTranslation(items.length - 1);
    } else {
      setTranslation(translation - 1);
    }
  };

  const nextClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (translation === items.length - 1) {
      setTranslation(0);
    } else {
      setTranslation(translation + 1);
    }
  };

  return (
    <section>
      <div className="overflow-hidden">
        <div
          className={`flex flex-row w-fit h-[50vh]`}
          style={{ transform: `translateX(${-translation * 100}%)` }}
        >
          {items.map((item) => (
            <CarouselItem key={item.id} item={item} />
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

However, both previous methods do not seem ideal. The reasons the carousel created thus far are unsatisfactory are as follows:

1. Only one image is visible on the screen, yet all images must be rendered.
2. We need to hardcode an object to calculate the translation width, or use styles outside of Tailwind.

Of course, there exists a method using margin-left to create a carousel, which could also be attempted in Tailwind. However, the transform operation utilizes the GPU, making it preferable and still failing to resolve the above two issues. Therefore, in the next article, we will create a carousel that only renders the currently displayed image, eliminating the need for a translateConfig object.

# References

Definition of Carousel and UI Design Principles: https://mytory.net/2021/08/03/carousel-usability.html

Tailwind's Parsing Method and Dynamic Class Names: https://tailwindcss.com/docs/content-configuration#class-detection-in-depth

Related Stack Overflow Questions and Answers:
https://stackoverflow.com/questions/72550439/tailwind-css-unresponsive-to-react-state-change

https://stackoverflow.com/questions/71791472/fontawesome-icons-not-accepting-color-props-through-react-functional-components/