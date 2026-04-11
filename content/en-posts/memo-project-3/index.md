---
title: Creating a Notepad Project - 3. Building the Basic Notepad Page
date: "2021-08-30T00:00:00Z"
description: "Web Notepad Project, The Record of Struggles 3"
tags: ["web", "react"]
---

# 1. Introduction

The pages we need to create, according to the current design, are:

1. Notepad page
2. Login page
3. Signup page

Given that the purpose of this project is to create a "notepad" managed by individual users, I want to build the notepad page first.

I prefer colors that give a soft feeling, so I will work with colors from that spectrum. I mainly refer to [open color](https://yeun.github.io/open-color/) when choosing colors. However, I am not a design expert nor is this project aimed at achieving a very beautiful design, so I plan to work with colors that are not overly jarring to my eyes.

If someone sees this project, they might find the colors I've chosen are not soft at all or may not like my design. Therefore, it would be great if there are any alternatives regarding the design that could be pointed out. Additionally, if there are any industry standards for color selection, I would greatly appreciate it if you could share that with me through comments or email.

Let's start by adding a very basic background. Create a new file `src/note.js`.

```jsx
//note.js
import React from 'react';

const Note = () => (
  <>
    <h1>This is the Notepad Page</h1>
  </>
);

export default Note;
```

This component currently just displays a simple line of text. For reference, `<>` is a shorthand for React.Fragment that is often used to group multiple tags into one. You could use a `<div>`, but using `<div>` adds an extra level of depth to the tags, which is why I used `<>`.

Now, let's display this text on the homepage and add a background. Navigate to `src/App.js`.

```jsx
//App.js
import React from 'react';
import { Route } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import Note from './note';

const NoteGlobalStyle = createGlobalStyle`
  body{
    background:#e3fafc;
  }
`;

function App() {
  return (
    <div>
      <NoteGlobalStyle />
      <Route path="/" component={Note} />
    </div>
  );
}

export default App;
```

`createGlobalStyle` is a keyword used in styled-components to specify styles that apply universally, such as those for the body. This applies a very light cyan background to the entire page.

Also, it is set to display the Note component on the homepage (`/` path). Running `yarn start` will show a page with a light cyan background and bold text saying "This is the Notepad Page".

One thing to note is that `index.js`, which is executed through `yarn start`, must be configured to use React Router.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Configured index.js for BrowserRouter usage

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

# 2. Creating the Basic Layout of the Notepad 

## 2.1 Creating Buttons

First, I will create basic blocks that will be used in the notes. I will center the internal content, set the font color to white, and round the corners appropriately to refine the shape. The functionality to receive colors via props will also be added.

The buttons used to add and delete notes will inherit the design of this `NoteBasicBlock`.

```css
const NoteBasicBlock = styled.div`
  background: ${(props) => props.color || 'white'};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  font-size: 1rem;
`;
```

Now, I will create buttons for adding and deleting notes, which will simply inherit from the block above and specify their sizes. I might also add some margin.

```css
const NoteListButton = styled(NoteBasicBlock)`
  width: 8rem;
  height: 2.5rem;
  margin: 5px;
`;
```

Using this, I can easily create buttons for adding and deleting notes.

After creating the buttons, I added a temporary flex container for layout.

```jsx
//App.js
import React from 'react';
import styled from 'styled-components';

const FlexContainer = styled.div`
  display: flex;
`;

const NoteContainer = styled(FlexContainer)`
  height: 100%;
  width: 100%;
`;

const NoteBasicBlock = styled.div`
  background: ${(props) => props.color || 'white'};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  font-size: 1rem;
`;

const NoteListButton = styled(NoteBasicBlock)`
  width: 8rem;
  height: 2.5rem;
  margin: 5px;
`;

const Note = () => (
  <>
    <NoteContainer>
      <NoteListButton color="#b197fc">Add Note</NoteListButton>
      <NoteListButton color="#ff6b6b">Delete Note</NoteListButton>
    </NoteContainer>
  </>
);

export default Note;
```

After modifying App.js, running `yarn start` will display two buttons on a light blue screen.

Future adjustments will aim for harmony without being overly distracting, and minor color or size changes may occur. However, any significant structural changes would require revisiting previous sections to update those parts accordingly. For instance, if the inheritance hierarchy changes, that would need revisions as well. It's a project that does not start with a very firm structure, so the design may evolve gradually.

![button](./button.png)

As stated, this button will allow for adding and deleting notes. However, I will temporarily postpone implementing these functionalities until a proper layout design is established.

### 2.1.1 Adding Button Hover Options

Buttons in typical programs usually indicate an active state by changing colors slightly when the mouse hovers over them. Similarly, when buttons serve to toggle functionalities, color changes often signify active and inactive statuses.

This can be achieved using CSS hover and active pseudo-classes. However, since the functions to add and delete notes do not inherently have active/inactive states, they will execute their actions immediately upon clicking. Therefore, I will only make the button darker when the mouse hovers over it, without adding an active option.

Since we are receiving colors via `props`, the button color can be any color specified by the user. It would be better to handle color darkening more generally rather than specifying a darkened color for each button. To facilitate this, we will use the `polished` library.

```
yarn add polished
```

Next, let's import the functionalities we will use.

```jsx
import styled, { css } from 'styled-components';
import { darken } from 'polished';
```

We will add a simple CSS that returns a darkened color if the hover condition is satisfied by accepting the button's `props.color`.

```jsx
const NoteListButton = styled(NoteBasicBlock)`
  width: 8rem;
  height: 2.5rem;
  margin: 5px;
  ${(props) => {
    const selected = props.color;
    return css`
      &:hover {
        background: ${darken(0.1, selected)};
      }
    `;
  }}
`;
```

This way, when the mouse hovers over the button, it will change to a slightly darker color.

## 2.2 Creating Individual Notepad Blocks

According to the design, I want individual notes' previews to be stacked below the add/delete buttons, with the ability to manage certain notes as folders. For now, I will design a block to manage individual note previews, utilizing the previously created `NoteBasicBlock`.

```css
const NoteListBlock = styled(NoteBasicBlock)`
  width: 18rem;
  height: 2.5rem;
  border: solid 1px #868e96;
  background: #f1f3f5;
  margin: 3px;
`;
```

Next, I will place a few of these as a test to ensure everything is functioning properly.

```jsx
const Note = () => (
  <>
    <NoteContainer>
      <NoteListButton color="#b197fc">Add Note</NoteListButton>
      <NoteListButton color="#ff6b6b">Delete Note</NoteListButton>
    </NoteContainer>
    <NoteListBlock />
    <NoteListBlock />
    <NoteListBlock />
  </>
);
```

![memo_test](./memo_test.png)

## 2.3 Creating the Note Editing Window

Now, I will create an editing area for the note text. The note editing area is quite large, so I will adjust the proportions appropriately for the display.

Since it's easier to read with lines in the notepad, I will also add appropriately spaced lines.

```css
const NoteEditBlock = styled.textarea`
  width: 95%;
  height: 95%;
  border: 1px solid black;
  border-radius: 10px;
  overflow: auto;
  white-space: pre;
  font-size: 12pt;
  display: flex;
  background-attachment: local;
  background-image:
    linear-gradient(to right, white 10px, transparent 10px),
    linear-gradient(to left, white 10px, transparent 10px),
    repeating-linear-gradient(white, white 30px, #ccc 30px, #ccc 31px, white 31px);
  line-height: 31px;
  padding: 8px 10px;
  resize: none;
`;
```

However, there is a problem. The text editing area we've created has its width and height maximized, but that maximum is influenced by the dimensions of its parent element. If the parent element is only 10 pixels wide and tall, we then define width and height relative to it, and no matter how we specify them as 100%, they won't occupy the desired available space.

Thus, using developer tools, I need to adjust the maximum limits imposed on this area.

First, in `GlobalStyle`, I will set the width and height of the root components, `html` and `body`, to maximum.

```jsx
const NoteGlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  html {
    width: 100%;
    height: 100%;
  }
  body {
    width: 100%;
    height: 100%;
    background: #e3fafc;
  }
`;
```

The `box-sizing` property relates to how the width and height of elements are calculated, ensuring borders are included when determining size. This makes layout calculations more intuitive, as we normally account for borders when measuring element dimensions.

Next, we need to modify the existing HTML, as React normally renders all content within the HTML element with the `root` ID, which limits the space we are trying to create.

```html
<!-- Adjusting the body section in public/index.html -->
<body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div style="width:100%; height:100%;" id="root"></div>
    <!--
      This HTML file is a template.
      If you open it directly in the browser, you will see an empty page.

      You can add webfonts, meta tags, or analytics to this file.
      The build step will place the bundled scripts into the <body> tag.

      To begin the development, run `npm start` or `yarn start`.
      To create a production bundle, use `npm run build` or `yarn build`.
    -->
  </body>
```

To improve layout, I will modify the container into a column layout (`ColumnContainer`) where elements stack vertically, and a row layout (`RowContainer`) where elements stack horizontally. The width and height can be selected based on the props passed to these containers.

```jsx
const FlexContainer = styled.div`
  display: flex;
`;

const ColumnContainer = styled(FlexContainer)`
  height: ${(props) => props.height || 'auto'};
  width: ${(props) => props.width || 'auto'};
  flex-direction: column;
`;

const RowContainer = styled(FlexContainer)`
  height: ${(props) => props.height || 'auto'};
  width: ${(props) => props.width || 'auto'};
  flex-direction: row;
`;
```

Now, I will use these containers to appropriately arrange the elements created so far within the `Note` component.

```jsx
const Note = () => (
  <ColumnContainer width="100%" height="100%">
    <RowContainer>
      <NoteListButton color="#b197fc">Add Note</NoteListButton>
      <NoteListButton color="#ff6b6b">Delete Note</NoteListButton>
    </RowContainer>
    <RowContainer width="100%" height="100%">
      <ColumnContainer>
        <NoteListBlock />
        <NoteListBlock />
        <NoteListBlock />
      </ColumnContainer>
      <ColumnContainer width="100%" height="100%">
        <NoteEditBlock />
      </ColumnContainer>
    </RowContainer>
  </ColumnContainer>
);
```

Running this will result in a layout that looks reasonably like a notepad interface, even though there are still many aspects to improve. Finally, I will include the complete code for `note.js`.

```jsx
import React from 'react';
import styled, { css } from 'styled-components';
import { darken } from 'polished';

const FlexContainer = styled.div`
  display: flex;
`;

const ColumnContainer = styled(FlexContainer)`
  height: ${(props) => props.height || 'auto'};
  width: ${(props) => props.width || 'auto'};
  flex-direction: column;
`;

const RowContainer = styled(FlexContainer)`
  height: ${(props) => props.height || 'auto'};
  width: ${(props) => props.width || 'auto'};
  flex-direction: row;
`;

const NoteBasicBlock = styled.div`
  background: ${(props) => props.color || 'white'};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  font-size: 1rem;
`;

const NoteListButton = styled(NoteBasicBlock)`
  width: 8rem;
  height: 2.5rem;
  margin: 5px;
  ${(props) => {
    const selected = props.color;
    return css`
      &:hover {
        background: ${darken(0.1, selected)};
      }
    `;
  }}
`;

const NoteListBlock = styled(NoteBasicBlock)`
  width: 18rem;
  height: 2.5rem;
  border: solid 1px #868e96;
  background: #f1f3f5;
  margin: 3px;
`;

const NoteEditBlock = styled.textarea`
  width: 95%;
  height: 95%;
  border: 1px solid black;
  border-radius: 10px;
  overflow: auto;
  white-space: pre;
  font-size: 12pt;
  display: flex;
  background-attachment: local;
  background-image:
    linear-gradient(to right, white 10px, transparent 10px),
    linear-gradient(to left, white 10px, transparent 10px),
    repeating-linear-gradient(white, white 30px, #ccc 30px, #ccc 31px, white 31px);
  line-height: 31px;
  padding: 8px 10px;
  resize: none;
`;

const Note = () => (
  <ColumnContainer width="100%" height="100%">
    <RowContainer>
      <NoteListButton color="#b197fc">Add Note</NoteListButton>
      <NoteListButton color="#ff6b6b">Delete Note</NoteListButton>
    </RowContainer>
    <RowContainer width="100%" height="100%">
      <ColumnContainer>
        <NoteListBlock />
        <NoteListBlock />
        <NoteListBlock />
      </ColumnContainer>
      <ColumnContainer width="100%" height="100%">
        <NoteEditBlock />
      </ColumnContainer>
    </RowContainer>
  </ColumnContainer>
);

export default Note;
```

Having established the basic framework for each page, the next step will be to create the login page.