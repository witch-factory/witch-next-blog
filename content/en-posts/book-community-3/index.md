---
title: Creating a Book Community - 3. Main Page Production - 1
date: "2022-02-11T00:00:00Z"
description: "The first steps in creating the main page for the book community"
tags: ["web", "study", "react"]
---

# 1. Installing styled-components

Instead of using plain CSS, we will use the styled-components library, which should be installed inside the client folder.

```
npm install styled-components
```

To check if everything works well, I copied the Button code from the styled-components official documentation and tried adding it to the main page.

```tsx
import React from 'react';
import styled from 'styled-components';

const MyButton = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid palevioletred;
  color: palevioletred;
  margin: 0 1em;
  padding: 0.25em 1em;
`;

function MainPage() {
  return (
    <MyButton>Example Button</MyButton>
  );
}

export default MainPage;
```

The example button is displayed correctly. Now, let's start creating the elements for the main page.

# 2. Site Logo

The text for the site logo was created based on the idea of our project team member, Hanul (https://github.com/hamuneulbo). We decided to write "Reviewary - Your and My Review Library" on the logo. Since we are currently in the early phase of just shaping the page, I created it fairly simply.

```tsx
const HeaderMainLogo = styled.h1`
  font-size: 3rem;
  margin: 3px;
`;

const HeaderSubLogo = styled.h2`
  font-size: 1.5rem;
  margin: 0;
`;

function HeaderLogo() {
  return (
    <>
      <HeaderMainLogo>Reviewary</HeaderMainLogo>
      <HeaderSubLogo>Your and My Review Library</HeaderSubLogo>
    </>
  );
}
```

While not particularly impressive, a reasonably sized logo has been added to the site.

![logo](./logo.png)

After creating the logo, I separated the logo component into `src/common/HeaderLogo.js` as it is expected to be reused on most pages.

# 3. Creating Containers

I created simple containers that will likely be used frequently. To make them quickly, I designed these containers to use `display: flex` to determine whether to align the internal elements horizontally or vertically. Features like element alignment will be added later.

```tsx
/* src/common/HorizontalContainer.js */
import styled from 'styled-components';

const HorizontalContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export default HorizontalContainer;

```

```tsx
/* src/common/VerticalContainer.js */
import styled from 'styled-components';

const VerticalContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export default VerticalContainer;
```

Using this, I modified the logo so that `HeaderMainLogo` and `HeaderSubLogo` are arranged vertically.

```tsx
/* src/common/HeaderLogo.js part */
function HeaderLogo() {
  return (
    <VerticalContainer>
      <HeaderMainLogo>Reviewary</HeaderMainLogo>
      <HeaderSubLogo>Your and My Review Library</HeaderSubLogo>
    </VerticalContainer>
  );
}
```

# 4. Menu

I decided to create a common dropdown menu. The reference documents used while creating the dropdown menu are noted below. The `DropDown Menu 2` document was used as a reference to implement the `DropDownMenuHeader` component, which expresses the header of the dropdown menu similarly.

```tsx
const DropDownMenuHeader = styled.div`
  font-weight: 500;
  font-size: 1.3rem;
  background: #ffffff;
  height: 1.8rem;
  width: 9rem;
`;
```

Next, I created the `DropDownMenuContainer`, which will hold the submenus that appear when the dropdown menu is activated.

```tsx
const DropDownMenuContainer = styled.div`
  color: #000000;
  width: 10rem;
  margin: 0 auto;
`;
```

Then, I created the `DropDownMenuList`, which is a `ul` element that contains the dropdown list items.

```tsx
const DropDownMenuList = styled.ul`
  padding: 0;
  margin: 0;
  background: #ffffff;
  border: 2px solid #000000;
  box-sizing: border-box;
  color: #000000;
  font-size: 1.3rem;
  font-weight: 500;
  &:first-child {
    padding-top: 0.8rem;
  }
`;

const DropDownListItem = styled.li`
  list-style: none;
  margin-bottom: 0.8rem;
`;
```

Finally, I created the `DropDownMenu` component that combines all of these elements. While handling dropdown menu interactions, I created a `selectedMenu` state to keep track of which menu item has been selected and used the `onClick` event to set that menu item as selected upon clicking.

Such interactions will later be replaced by actions like navigating to a specific board or page when selecting a dropdown menu item.

As multiple dropdown menus will be created, the header name and item names of the dropdown menu can be passed as strings and arrays, respectively. The key in the array's `map` function is simply the item itself (`key={item}`), as board names typically do not overlap. If there ever comes a case where dropdown menu items have overlapping names, it would be advisable to make the items in the array (here called `dropDownItemList`) objects and assign each an `id`.

```tsx
function DropDownMenu({ menuName, dropDownItemList }) {
  const [selectedMenu, setSelectedMenu] = useState(null);

  const onOptionSelected = (value) => () => {
    setSelectedMenu(value);
  };

  return (
    <VerticalContainer>
      <DropDownMenuHeader>{menuName}</DropDownMenuHeader>
      <DropDownMenuContainer>
        <DropDownMenuList>
          {dropDownItemList.map((item) => (
            <DropDownListItem
              onClick={onOptionSelected(item)}
              key={item}
            >
              {item}
            </DropDownListItem>
          ))}
        </DropDownMenuList>
      </DropDownMenuContainer>
    </VerticalContainer>
  );
}
```

Now let's make the dropdown menu functional. The reference document demonstrates having the menu items appear when clicking the header. However, it's more common on websites for the dropdown menu items to be displayed when hovering over the dropdown menu header.

Thus, let’s implement this using CSS. It is not too difficult. Initially, the `DropDownMenuContainer` containing the submenu items would be displayed continuously. We will configure it to be hidden in the normal state and to be visible only upon hovering. Now, the `DropDownMenuContainer` will be visible as long as the mouse hovers over it.

```tsx
const DropDownMenuContainer = styled.div`
  display: none;
  color: #000000;
  width: 10rem;
  margin: 0 auto;
  &:hover {
    display: block;
  }
`;
```

However, if the `DropDownMenuContainer` is not rendered in the first place, hovering over this container element will not be possible. Following the conventional dropdown menu pattern, we will ensure that `DropDownMenuContainer` renders when the mouse hovers over the dropdown menu header. To achieve this, we used the `+` selector appropriately, to only show the `DropDownMenuContainer` that is a sibling of `DropDownMenuHeader`. This selection method was shared by Chang-hee Lee (https://xo.dev/). I felt a need to review CSS as I vaguely remembered such selectors from my initial learning.

```tsx
const DropDownMenuHeader = styled.div`
  margin: 0;
  padding: 1rem;
  font-weight: 500;
  font-size: 1.3rem;
  background: #ffffff;
  height: 1.8rem;
  width: 9rem;
  &:hover + ${DropDownMenuContainer} {
    display: block;
  }
`;
```

If there is any gap between the header and the menu items, a hover state might be interrupted (as the mouse cursor would exit the menu items while passing over the gap), causing the dropdown menu items to become unclickable. Therefore, I have set all margins of the dropdown menu items to 0. If visual spacing is necessary, padding can be utilized instead (margin controls spacing outside the element, while padding controls spacing inside the element).

Now, upon passing appropriate name strings and item arrays as props, the dropdown menu will render and function correctly.

![dropdown](./dropdown.png)

I will also create a `DropDownMenu.js` file in the `src/common` folder to separate the dropdown menu.

# 5. Implementing Carousel

I initially searched for the term "slider menu" to describe a menu where images slide sideways to display information, but I later learned that it is called a carousel. I believe having a carousel on the site we are developing would be beneficial, so I decided to implement one on the main page.

I downloaded some images suitable for the carousel slides from Pixabay (https://pixabay.com/), obtaining images of various sizes. I also sourced book cover images from bookstore websites. Book cover images are typically longer vertically and are not common unless they pertain to books.

# 6. References

styled-components official documentation https://styled-components.com/

Creating dropdown menus https://programming-oddments.tistory.com/177

Dropdown Menu 2 https://andela.com/insights/react-js-tutorial-on-creating-a-custom-select-dropdown/

CSS flex https://studiomeal.com/archives/197

CSS selector https://poiemaweb.com/css3-selector

Various methods to implement a carousel https://programming119.tistory.com/211

Implementing a carousel using React hooks https://velog.io/@peppermint100/JSReact-Hooks%EB%A1%9C-Carousel-Slider-%EB%A7%8C%EB%93%A4%EA%B8%B0

Creating arrow-shaped buttons https://www.w3schools.com/howto/howto_css_arrows.asp