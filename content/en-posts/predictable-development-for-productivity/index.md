---
title: Predictable Development - Thoughts on Structure and Mindset That Reduce Cognitive Load
date: "2025-10-11T00:00:00Z"
description: "This post explains my thoughts on environments that improve productivity, including code consistency, balancing readability and abstraction, and making good use of tools."
tags: ["tip", "react"]
---

# Background

> Do you have enough time to work? I’m not simply asking whether you have enough time. Of course you don’t. I’m not asking whether you have more work than the time you’ve been given. Of course you do. Ask yourself, “How would I work if I had enough time?” If that answer is very different from how you’re actually working, then you do not have enough time to work.
>
> Kent Beck, translated by Younghoe Ahn, "Kent Beck's Tidy First?" p.91

I am the only dedicated frontend developer at my company. But even though there has only ever been one frontend headcount, traces of more than five predecessors remained in the codebase. With multiple people rotating through one or two frontend positions, I found a folder structure with broken consistency and components left behind with overlapping or unclear responsibilities.

I fixed and reorganized them little by little. I also added new features as they came in and fixed various bugs. That is still ongoing.

While doing so, I tried to follow these rules. I still do.

- Write code with future me, and anyone else unfamiliar with this codebase, in mind
- Design code and components with an intuitive structure that can be read top to bottom, taking in information sequentially
- Make each component responsible for only one thing, and classify them by role
- Build flexible structures that can absorb change
- Follow the rules consistently, even if I’m the only one doing it

Then at some point I had this thought. Aren’t these rules I’m trying to follow really just a chain of obvious ideas that most developers already know? I had heard all of them myself not long after I started programming. So did my predecessors really leave behind the kind of legacy code I’m now dealing with because they knew none of this?

![A developer under time pressure writing trash code](./trash_code_developer.jpg)

At first, I assumed it was because they were the kind of developers who simply did not care about code quality. But within just a few months, I found myself doing the same thing. Embarrassingly enough, I was writing patchwork code that broke conventions, or abandoning the folder structure I had been carefully cleaning up and making it messy again. I justified it, or made excuses, with things like “It would take too much effort to do this perfectly right now” or “This is too big for one person to handle.” Seeing myself do that made me wonder what it is I should really be pursuing consistently.

Between principles everyone knows but almost no one truly follows. In environments and schedules where you cannot insist on only theoretically perfect, clean code. What direction should we really move in, and what should we use as the basis for decisions? I still do not know the answer, and maybe there is no such answer, but I wanted to get closer to one. So I’m writing down the thoughts and examples that led me there.

I wanted to turn these from principles everyone merely knows into something more concrete and tangible. I wanted to write as if I had my thoughts firmly organized, as if I were fully confident. I believe that even the experience of seeing confidently held ideas break down within reasonable limits helps me learn.

I could try to write something that can never be wrong. I could say that most things are uncertain and case by case. Then many people would reluctantly agree. But I would learn nothing by saying that, so I’ll just go ahead and speak as if I’m sure.

# Thoughts on the Essence

> If I had exactly one hour to chop down a tree, I would spend 45 minutes sharpening the axe.[^1]

Why should we write consistent code? Why define conventions and spend time refactoring? Why are there rules for writing good code, and why should we spend time thinking about how to follow them?

[Some concepts, like REST API, are widely misunderstood and difficult to apply perfectly in general web development.](https://witch.work/ko/translations/misappropriated-rest-dissertation) Even so, the reason these principles exist, despite the fact that we could spend that time making one more page or one more function, is that they are originally meant to help us ship results faster.

Once a project is in developers’ hands, it usually means the planning has progressed enough that we are implementing given functionality.[^2] Then what do we need at this stage to develop faster? I think one important factor is having an environment where we can focus on what actually matters.

For example, let’s say you are implementing chat functionality. Chat is often more complex than simple API integration, and in most cases there are more things to think through. Now imagine you want to reuse an `Input` UI component another teammate implemented for the chat input field, but it contains logic related to posting comments. For example, it has props like `showComment`.

What should you do? Pause the chat work, fix that component first, split it into `Input` and `CommentInput`, and then come back? Or should you implement `ChatInput` from scratch? There may be other options too. But whatever you choose, one thing is certain: your attention has already been pulled away from chat. If you could have reused `Input` as is, you would have been able to stay focused on the chat feature.

So how do we create an environment where we can “focus on what needs focus,” an environment where we can work more productively? In the end, it comes back to the development principles every developer has probably seen to the point of exhaustion.

Create intuitive, easy-to-learn, consistent rules. Make the code itself convey as much information as possible. Ensure each function or component stays within its role and context, and give it names and props that make its role intuitive. Avoid [leaky abstractions](https://medium.com/@vagabond95/leaky-abstraction-77f798dcecd7). Apply these rules across the project so that once you know the rules, the code becomes predictable.

Being good at development, I think, goes beyond simply knowing these rules. It comes from understanding their original purpose, helping us do things better, and from having the discipline to keep following them even under tight schedules and difficult conditions.

So let’s approach this more concretely. I’ll talk about tools that help us uphold these good principles and spend our time and effort where it really matters. And I’ll also go through examples of how I think while writing code.

# Ways to Focus on What Matters

## Libraries

One obvious but excellent tool for creating an environment where you can focus on what matters is the library. A library reduces the number of things you need to worry about, so the code lets you focus on the feature you are actually implementing instead of unrelated concerns.

In React, when writing code to fetch and use server data, you originally had to create state like `isLoading` and handle things in `useEffect`. [Resolving race conditions, error handling, success callbacks, and caching were not easy to implement directly.](https://www.robinwieruch.de/react-hooks-fetch-data/)

But with [TanStack Query](https://tanstack.com/query/latest), you can worry much less about server data fetching. It provides features that are hard to implement well yourself, such as error handling, success callbacks, and caching. It also allows server data and client data management to stay largely separated, which improves separation of concerns.

If you use headless UI libraries like [Radix primitive](https://www.radix-ui.com/primitives) or [base-ui](https://base-ui.com/react/overview/quick-start), you spend less effort worrying about accessibility and the low-level pieces that make up UI components. If you use UI libraries that also provide styling, like [shadcn/ui](https://ui.shadcn.com/) or [daisyUI](https://daisyui.com/), customization becomes harder, but you can delegate a fair amount of styling as well. There are also libraries for UI elements that are tricky to build yourself, such as [sonner](https://sonner.emilkowal.ski/) for toast notifications or [cmdk](https://github.com/pacocoursey/cmdk) for command menus, and they reduce the need to think through UX or complex accessibility issues yourself.

[TailwindCSS](https://tailwindcss.com/) is not really my personal preference, but it clearly reduces the burden of naming CSS `className`s or styling component names. Utility libraries like [lodash](https://lodash.com/) and [es-toolkit](https://es-toolkit.dev/) save you from having to implement all kinds of convenience functions yourself.

That is the purpose of using these things: to focus only on the features you truly need to implement. It is worth choosing libraries with that in mind.

## A Predictable Folder Structure

In collaborative work, folder structure, file placement, and file naming are good examples of high-leverage places to create and follow predictable rules. Most of what you need to do for such rules is move files to match the convention, rename them, and fix a few import statements. Even that is mostly handled by the IDE. Yet I have still experienced several cases where this made work significantly faster.

The reason is that even if I didn’t write the code, the things I expect are usually where I expect them to be, and I can roughly predict what role something plays from its folder location. Then I can just reuse what already exists.

And because I don’t have to wonder whether the component I’m looking for might be hiding somewhere completely unexpected, I also don’t need to search all over the codebase thinking, “Maybe the component I’m about to build already exists somewhere else.”

Since it is rare for a project to have everything perfectly in place, it matters not only that “things are where they should be,” but also that you can quickly realize, “If a component of this role is not here, then it doesn’t exist in the project yet,” and start implementing. That also has a major impact on development speed.

For the same reason, I think the FSD (Feature-Sliced Design) folder convention, often described like this, is meaningful not because it is some revolutionary classification system, but because it presents a shared structure that teams can adopt quickly and predictably.

![FSD folder structure](./fsd-architecture.webp)

Of course, there is no single correct structure. What matters is appropriate classification by role and rigorous consistency. If there is one part especially worth getting right, I would say it is the design and strict organization of “shared components.” Consistency matters most.

Personally, I have seen folder structures that did not feel intuitive at first. [But humans adapt quickly to repeated structures and can apply them in new places.](https://medium.com/weavedesign/the-law-of-repetition-designing-for-consistency-63ea3ff7920e) I was able to get used to unfamiliar structures more quickly than I expected. In fact, I found projects with a systematic folder structure but scattered rule-breaking exceptions much harder to understand.

## Reducing Cognitive Load with Productivity Tools

Using productivity tools helps you work faster. I think this matters not only in development or team projects but also in personal work. Personally, I am trying to learn keyboard shortcuts for programs I use often, along with tools like Raycast. I collect what I learn in [“Notes for Efficient Development” in my personal archive](https://archive.witch.work/study/raycast/).

But what I want to talk about here is not how to use tools, but why. Why use productivity tools, and why are shortcuts useful? Of course, if you compare using shortcuts with the extreme case of using none at all, using them is generally better. Shortcuts like save (`command + s`), copy/paste (`command + c,v`), and refresh (`command + r`) are used so frequently that memorizing them will likely save a lot of time compared to using the mouse.

But some people do not stop there. Some intentionally learn vim because they want to minimize moving their hand to the mouse, and maybe also because it looks a little cool. There are even enthusiasts who write Hammerspoon Lua scripts or Raycast scripts to automate a task they do once a day for five minutes. At that point, if you compare “time saved on the task” with “time spent learning or automating it,” the effort may well outweigh the benefit.

But was the real purpose of this kind of automation simply to make the same task take a few seconds less? If writing the automation script takes more time, is not doing it always the rational choice? Would it really have been better to spend that time implementing one small feature instead? I do not think so.

These principles and tasks exist not merely to turn something that took 10 seconds into 5 seconds, or one click. I think their real purpose is to reduce the burden imposed by side tasks so that when writing code and doing necessary work, we can focus on what truly needs focus. Attention is too easily scattered.

For example, let’s say you are writing code and need to look something up. It could be GitHub, a web search, or a local file. It does not matter. The important part is that you have to step out of the context of writing code and think about something else.

There are too many distractions in the path to that. Clicking the browser on your desktop to open it, doing a web search, opening Finder and digging through folders to find the project you want, or opening a new terminal and navigating to the project path.

If you used something like Raycast file search, you could do the same thing with far fewer steps.

![Raycast file search](./raycast-file-search.png)
Image source: [File Explorer for Mac](https://www.raycast.com/core-features/file-search)

There are many other tasks that can be handled with fewer steps too.

- Open the browser by clicking it in the dock -> assign a Raycast hotkey
- Find the desired project in Finder -> Raycast file search
- Web search -> Raycast browser extension
- Open terminal and navigate paths -> Raycast terminal extension + path automation tools like zoxide

Even if the actual time saved is less than 10 seconds, the key point is preventing unnecessary mental branching and going through only the steps you really need. Personally, I often had the experience of opening Finder, searching for a file, and then forgetting what file I was looking for and why. Not because file search itself takes a long time, but because thoughts sometimes scatter too quickly.

This is not because file search is a particularly long task. It is because my attention had already been divided in that brief moment. So I think we use automation and tools not merely to improve speed and move our hand to the mouse less often, but to reduce these thinking steps and the cognitive load they create.

Of course, even with these tools, the interactions should be designed simply enough that I can use them almost unconsciously, without forcing a context switch. For example, when assigning shortcuts through Raycast, they should ideally be easy to press with one hand, and they should be intuitive enough to be recalled automatically from the tool name. For instance, a terminal shortcut like `command + command` might be very easy to press, but `Hyperkey + t` is much more intuitive because it uses the first letter of terminal.

If you think through these things and build a productivity routine around them, you can work with much less mental scattering. I think this kind of automation and tool usage is not about saving one second. It is about preventing one more trap that might break your concentration.

# Writing Code

> Write code clearly, and do not try to be excessively clever.
>
> Brian Kernighan, translated by Seongchang Ha, "The Birth of Unix" p.51

Then how should we write code so that everyone can focus on what they need to focus on? In the end, it comes down to readability, but that is too vague. So I think in terms of these criteria.

- A structure that communicates as much information as possible at a glance
- Something that can be read with only the minimum necessary thinking
- Something whose role you can trust and reuse
- Something predictable

So, based on my limited experience and knowledge, I’ll share a few examples that illustrate these points.

So here are a few examples, drawn from my own experience and things I’ve read, that show what each of these points means.

## A Structure That Communicates as Much Information as Possible at a Glance

A common guideline for readable code is that the code itself should contain a lot of information. The simplest example would be using a variable name like `xIsNext` instead of something meaningless like `a`.

![Good variable naming is hard](./variable-name.jpg)

Of course, choosing intuitive variable names is something that troubles developers too. But for a project to be easy to understand, there are many things to think about beyond variable names. The real point is how, and at what level, the code communicates information to the developer, even when the underlying information is the same.

For example, suppose a page shows a different title for Korean and English users. For Korean users, it should display “제 블로그에 오신 걸 환영합니다!”, and for English users, “Welcome to my blog!”. How should we implement that?

We could create a component for the title, like this.

```tsx
type Language = "ko" | "en";

function Title({ language }: { language: Language }) {
  if (language === "ko") {
    return <h1>제 블로그에 오신 걸 환영합니다!</h1>;
  } else {
    return <h1>Welcome to my blog!</h1>;
  }
}

function App() {
  // i18n 관련 라이브러리 등을 통해 language 결정

  return (
    <Container>
      <Title language={language}>
      {/* 다른 페이지 구성 요소들 */}
    </Container>
  );
}
```

You could think of various improvements or alternatives, such as naming the component `TitleByLanguage`, having a single custom hook that determines the language so each component uses the hook instead of receiving a `language` prop, or replacing the `if` with a `switch` for better type safety through [exhaustive matching](https://tkdodo.eu/blog/exhaustive-matching-in-type-script). Even so, this version is not bad.

But before that, we can ask whether the information “the title branches by language” really needs to be split into a separate component at all. What about this instead?

```tsx
function App() {
  // i18n 관련 라이브러리 등을 통해 language 결정

  let title = "";

  if (language === "ko") {
    title = "제 블로그에 오신 걸 환영합니다!";
  } else {
    title = "Welcome to my blog!";
  }

  return (
    <Container>
      <h1>{title}</h1>
      {/* 다른 페이지 구성 요소들 */}
    </Container>
  );
}
```

Without looking at a separate `Title` component, you can immediately see from the page code itself that the title changes depending on the language.

This code has many shortcomings. It will scale poorly if the number of supported languages grows. It also feels awkward in React, where `const` declarations are preferred because of immutability. And there is nothing elegant about it. Honestly, when I first saw code like this, I thought it looked stupid.

But it is undeniably clear, and anyone can understand that “this page shows a different title depending on the language.” [It is even introduced as one of the patterns in the official React docs.](https://react.dev/learn/conditional-rendering#conditionally-assigning-jsx-to-a-variable) At the very least, that means it is not an anti-pattern.

Providing lots of information is not the only concern in writing code. But from the perspective of “clear code that provides a lot of information at once,” I think this kind of code has real value. It looks stupid at a glance. But wasn’t it visible at a glance?

For a somewhat more practical and common example, let’s look at styling code. This is the kind of code where, if you have some intuition or know the conventions, you can understand each part’s role and structure much more quickly.

One issue with css-in-js libraries like styled-components is that you cannot tell whether something is a regular component or just a styling component by name alone. For example, suppose a page is written like this. Semantic tags are not the point here, so I’m ignoring them.

```ts
import Header from "@/components/Header";

function App() {
  return (
    <Container>
      <Header title="화면 제목" />

      <ContentWrapper>
        <CoverImage
          src={displayCoverImageUrl}
          alt="series cover"
          width={100}
          height={100}
        />
      </ContentWrapper>
    </Container>;
  )
}

const Container = styled.div`...`;

const ContentWrapper = styled.div`...`;

const CoverImage = styled.img`...`;
```

`Header` is a component with internal logic, and from the styled-components definitions below, we can tell that `Container`, `ContentWrapper`, and `CoverImage` are css-in-js components used only for styling. But if you only look at the component structure above, you cannot immediately tell that. You have to look below at the definitions.

If you establish a rule such as “all components ending in `Wrapper` are styling components,” the code becomes much easier to understand quickly. Like this.

```jsx
function App(){
  return (
    <PageWrapper>
      <Header title="화면 제목" />

      <ContentWrapper>
        <ImageWrapper>
          <img
          // ...
          />
        </ImageWrapper>
      </ContentWrapper>
    </PageWrapper>;
  )
}

// ...

const PageWrapper = styled.div`...`;

const ContentWrapper = styled.div`...`;

const ImageWrapper = styled.div`...`;
```

But can we make this even more intuitive? We can go further and avoid creating separate styling components whenever possible. For styling, we can keep a single top-level component such as `Container`, then style the rest with descendant selectors. Like this.

```jsx
function App() {
  return (
    <Container>
      <Header title="화면 제목" />

      <div className="content-wrapper">
        <div className="image-wrapper">
          <img
          // ...
          />
        </div>
      </div>
    </Container>
  );
}

// 스타일링 컴포넌트들
const Container = styled.div`

  .content-wrapper {
    ...
  }

  .image-wrapper {
    ...
  }

  .image-wrapper img {
    ...
  }
`;
```

By using `className` selectors inside `Container`, elements used purely for styling are shown as plain HTML tags like `div` or `p`. In other words, by keeping them as HTML tags, the code visibly communicates which elements exist “only for styling.” Because CSS `className`s can convey only style.

If you have used CSS Modules, vanilla-extract, or zero-runtime CSS tools like panda, this separation between styling-only elements and components with real logic will probably feel familiar. This makes the role of each tag and component easier to understand at a glance, while still keeping the colocation of styles that is one of css-in-js’s real advantages.

Of course, you can expect some performance cost from using descendant selectors like this. But if a page requires optimization severe enough that even simple styling CSS must be squeezed that hard, then I think the right move would be to switch away from css-in-js entirely.

There are many other ways to distinguish component roles. For example, you could introduce layout components like `Flex`, `Grid` (used in major UI libraries like Radix and MUI), or `Stack`, `Group` (used in Mantine for horizontal and vertical flex containers). Since most layout problems on the frontend are solved with `display: flex`, and this is practically frontend common sense, these patterns also work well for intuitive design.

Of course, there is no single right answer. But what matters is continually thinking about how to communicate roles intuitively so others can understand them at a glance, and then continuing to follow the rules you decided on.

## Something That Can Be Read with Only the Minimum Necessary Thinking

> If you want the sum of a list of items, then your code should look like “taking the sum of these list items,” not like “loop over these items, maintain a separate variable, and perform a series of additions.” If a high-level language cannot let us express our intention at a high level and then figure out the lower-level operations required to implement it, why have a high-level language at all?
>
> [Python mailing list, David Eppstein, 2003-04](https://mail.python.org/pipermail/python-list/2003-April/181482.html)

This section is based on pp. 387–390 of [Fluent Python by Luciano Ramalho](https://product.kyobobook.co.kr/detail/S000214847242), 1st edition. The original examples are in Python, but I converted them to JavaScript for convenience. Also, since these are only examples, things that real code should include, such as null checks, types, and error handling, are omitted for simplicity.

As I said earlier, the core idea is to let developers focus on what needs their focus. So how can code support that? I think one clue lies in reducing as much as possible the time and mental energy spent interpreting side-branch code during [code comprehension, which takes up most of the time required for code changes](https://www.samsungsds.com/kr/insights/cleancode-0823.html).

For example, let’s say while implementing some feature, you need code that sums the second element of each item in an array. There are many real situations where you might implement something like this, such as calculating the total budget for a given category. What about writing it like this? It is the simplest form, and any developer can easily understand that it sums all the second elements.

```js
let total = 0;
for (const sub of myList) {
  total += sub[1];
}
console.log(total);
```

But is there not a smarter way? Even if the code above is easy, you still have to inspect it for a moment to recognize that it computes the sum of the second elements. We might abstract it to something you can skim in one line and move on.

```js
const total = myList.reduce((a, b) => a + b[1], 0);
```

But as far as I know, most developers are not actually that familiar with `reduce`. It may have become a one-liner, but it might also have become harder to parse. The logic itself is not very difficult, but the important point is not whether it is hard or easy. The important point is that code unrelated to the core feature still increases the cost of reading code, even if only slightly.

So what about this? Let’s use a utility function. In this example I use a library, but you could also implement it yourself. What matters is that when reading the code, someone can quickly think, “Ah, this sums the second elements of each item in the array,” understand it, and move on.

```js
// lodash
_.sumBy(myList, sub => sub[1]);
// es-toolkit
sumBy(myList, sub => sub[1]);
```

Earlier, I said readable code should be clear, even if it looks a little stupid. Of course, not all code can be written at a level a fool could read. React itself has a huge amount of core logic internally, and even small features can require significant thought to understand. But outside of that kind of core logic, code should be written so it can be read with as little brainpower as possible.

Of course, you should consider who you are collaborating with, and whether there is any benefit to writing code that may not be immediately obvious at a glance.

If I were working with functional programming gurus or math PhDs, then everyone would likely accept `reduce`-based code without difficulty. Features like the JavaScript `Intl` object or certain `Promise` methods may be unfamiliar to many developers, but they are part of the standard and have the advantage of replacing things that are difficult to implement directly.

But in ordinary situations, the goal of development is not to write code that can only be understood if you are clever, or if you know the language deeply. Code that even a fool can read is good code.

## Something Whose Role You Can Trust and Reuse

Across the project, we should make it possible to trust that each component and function stays within its own role and context. For example, if you implemented the `sumBy` function yourself, it should be written so everyone can trust that its role is simply to return the sum of the values produced by the callback over a numeric array. And it should also be guaranteed that any needed error handling or typing stays within the handling layer defined by the team’s conventions.

This becomes even more visible in component design. It is harder than it looks to properly define roles, design components so they do not exceed those roles, and apply that consistently across a project.

But if a project is built in such an ideal, predictable way, then building features becomes almost like solving a puzzle. Even if the code was written by someone else, you can think, “There is a function for this role here, and a component for that role there, so I can combine them this way and build what I need.”

As an example of how hard this can be in practice, let’s make the most common component of all: a button. Button requirements usually begin simply. It contains text, and when clicked, it performs some action. So what if we create a `Button` component like this in a `components` folder?

```tsx
// components/Button.tsx
type ButtonProps = {
  text: string;
  onClick: () => void;
};

function Button({ text, onClick }: ButtonProps) {
  return <button onClick={onClick}>{text}</button>;
}
```

This is actually not very good. Anyone with some frontend experience will understand why. It limits the button’s content to a single string, but “what goes inside the button” is not really something the button component itself should be responsible for. That makes it fragile against requirement changes. For example, what if a new requirement appears saying an icon should be shown to the right of the text? Should we change it like this?

```tsx
type ButtonProps = {
  text: string;
  onClick: () => void;
  rightIcon?: React.ReactNode;
};

function Button({ text, onClick, rightIcon }: ButtonProps) {
  return (
    <button onClick={onClick}>
      {text}
      {rightIcon && <span>{rightIcon}</span>}
    </button>
  );
}
```

And what if a new requirement says an icon should also be allowed on the left side of the text? Should we add a `leftIcon` prop too? We could. But I think anyone with some intuition will feel that this is becoming overly complicated. And the bigger problem is that such requirements can continue forever. What if the button needs to include an image? Or a validation message that changes depending on some state? Or asynchronously fetched data?

There are certainly features that are normal for a generic button component, such as `disabled` or something like `onTouch`. But unlike those, adding icon-related behavior is obviously stepping outside the essential context of a button as “an element you can click to perform some action,” even without bringing up the ARIA role.[^3]

Of course, I am not saying you must never go beyond the strict standard specification of a button. For example, a design system button might reasonably have props like `size="sm" | "md" | "lg"`. But those conventions are team decisions, and fundamentally, I think button code should behave sensibly within the role of a button.

And writing it this way is not just a problem from the perspective of separation of concerns. It also makes the code harder to recognize and trust at a glance. For example, I once saw a button written like this.

```tsx
<Button
  text="Add Task"
  initialValue="..."
  leftIcon={/* 버튼 내부 왼쪽에 들어갈 아이콘 컴포넌트 */}
  rightIcon={/* 버튼 내부 오른쪽에 들어갈 아이콘 컴포넌트 */}
  iconAlign="..."
  imagePath={"./src/assets/example.png"}
  onClick={() =>
    // onClick 로직
  }
/>
```

If a button takes this much externally injected information, it is only natural to suspect it may have some role beyond just being a button. In particular, `initialValue`, which does not look like it belongs to simple styling, strongly pushes the reader toward that suspicion. In that case, you end up having to inspect the internals even of a lightweight component like a button while building a page. How inefficient is that?

So how can we make sure a button component really does only the job of a button? There are several ways, but one option is to use a higher-order component style. Roughly like this.

```tsx
type ButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
};

function Button({ children, onClick }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}
```

Now the place that uses the component directly injects what goes inside the button. Like this.

```jsx
<Button onClick={() => alert("프리미엄 업그레이드!")}>
  <div>프리미엄 업그레이드</div>
  <div>월 9,900원</div>
</Button>
```

This makes it intuitive that the button component itself is not involved in deciding its internal content and is only doing the job of a button, because the injected content is visible in the code at the point where the button is used.

So I think moving in this kind of higher-order component direction helps a button properly fulfill its role as “an element that can trigger an action through clicking.” The button does only the work of a button, so whatever is done externally, you can trust its behavior and reuse it with confidence.

Libraries like Radix UI and daisy UI adopt this kind of higher-order component style. In particular, I think Radix does an excellent job of dividing component pieces and designing the role of each one.

![LINE design system](./line_design_system.png)

If you want to see more examples of responsibility splitting beyond what I can cover in this article, it is worth looking at Radix UI or other well-known design systems. They break UI elements down finely according to the role of each piece, and let you compose them into new components by role, which makes them great references for component design.

And the essence here is not that buttons must be unified into one component, or that props must be minimized at all costs. For example, MUI uses a `variant` prop on buttons (`"text" | "contained" | "outlined"`) to control styling. But if the button is still doing only the work of a button, then it does not really matter whether you have separate `OutlineButton` and `SolidButton` components instead.

What matters is that each button fulfills its essential role properly so that everyone in the project can immediately think, “Ah, this is the role I need right now, so I can just use this button,” and decide without hesitation. It should prevent situations where you are working on chat functionality and suddenly find yourself analyzing button component code. It should also let people use each component while trusting that there is no hidden logic inside, only the essential role, so they can focus on more important work.

## Predictable Code

> People are very good at reasoning and learning. When they see repeated patterns, they just know.
>
> C.L Deux Artistes, "A Developer’s Design Literacy", p.281

Earlier, I talked about folder structure. If the folder structure is well organized, you can predict where things are in the project. For example, suppose there is a `pages/profile/components` folder that contains components used in the `/profile/[id]` route.[^4]

Then it is easy to expect that components used in `/community` will be in `pages/community/components`. Humans adapt quickly to repeated structures, so if those expectations are consistently correct, you can find and use the components and functions you need much faster.

The same principle can be applied when writing code. Similar roles should have similar names, similar behavior, similar types, and similar scope of effect. If you already understand the project to some extent, you should be able to predict behavior just from the name, and patterns seen in one place should apply elsewhere. Of course there are special components sometimes, but most UI falls into standardized forms, so this is often possible.

Let’s look at an example. Suppose you are building a login form and create an `Input` component. What if you write it like this?

```tsx
type Props = {
  username: string;
  setUsername: (username: string) => void;
};

function Input({ username, setUsername }: Props) {
  // 기타 코드들...

  return (
    <input
      type="text"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />
  );
}
```

It works, but there is no reusability to speak of. Since this is a login form, you also immediately need a password field. So would you pass props like `username={password}`? If you design props this way, you will eventually create another input component like `PasswordInput` just for passwords.

The simplest way to improve this is, of course, to make all form components (`input`, `select`, `<input type="radio">`, and so on) accept props in the same format. You can think of props like `value`, `onChange`, and `defaultValue`, similar to native HTML inputs. On top of that, it is good to make it common that these UIs are responsible only for value input and callback execution, not for value validation itself, which should be handled by something like a custom hook or a schema library such as zod.

Someone might say that nobody actually writes props by directly copying state names into them like that. But I have seen it quite a lot, and I have heard plenty of similar stories from other developers. Embarrassingly, I myself used to write code like that too. Or in some places the prop is called `onChange`, and elsewhere `onStateChange`, which is also common. Projects often involve multiple layers of abstraction, and collaboration among many people with different ways of thinking, including your past self.

Anyway, applying these rules consistently across all input components improves DX and development speed. From a developer’s point of view, if they see that `input` takes `value`, `onChange`, and `defaultValue`, and then `select` and `textarea` use the same props too, they can develop with much less context in mind. This can apply not only to simple form controls but also to UIs like [Slider](https://www.w3.org/WAI/ARIA/apg/patterns/slider/) and [Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/), where some value exists and can change.

Many UI libraries, including Radix UI and React Aria, group props with similar roles under the same names in this way.

In a similar vein, it is also worth standardizing function names so functions with the same role use the same prefix. Utility functions covered in a mix of vaguely similar verbs like `make`, `get`, and `generate` are hard to reuse.

It may seem like all you are doing is changing names and slightly standardizing formats. But once you experience developing in an environment where these things are not unified, you feel directly how much power this has.

What matters here is not allowing exceptions to the rules. If the rule is that UIs with values that can change should use `value`, `onChange`, and `defaultValue`, then every input component should follow it. If there are exceptions, then it is no longer a rule.

In the end, as I have kept saying throughout this post, the issue is consistency, consistency, consistency. Whether it is `onChange` or `onValueChange` does not matter at all. Whether the prefix for functions that create values is `make` or `generate` also does not matter, as long as the naming is reasonable. What matters is writing code so that people can predict the whole by seeing only part of it, and so that those predictions are not betrayed, but instead reinforced through repeated patterns.

There is a reason people use utility libraries like `lodash` or `react-simplikit`. Internal libraries at large companies exist in the same context. For fast and efficient work, code across the project needs to be predictable and intuitive, and for that to happen, shared parts of the project need consistent rules applied without exception. That is why tools like complex eslint rules, libraries, and folders such as `components/base` exist.

# Wrap-up

I once happened to see someone on LinkedIn say that teams that work well become faster as their output accumulates, while teams that work poorly become slower as their output accumulates. I think that is true. But it is a strange thing. If you asked people to choose between “work getting faster and easier over time” and “work getting slower and more painful over time,” common sense says they would choose the former. So why do things so often fail to go the way they want?

I think a lot of it begins with treating “working quickly” and the rules for good development as if they are far apart, and thinking of speed and good code as a trade-off.

Of course, some code is inevitably complex. Code for something like an insurance signup flow, which collects input across five pages and has countless branches, is hard to keep perfectly clean. And even if you could make it clean, if you have to build 100 such pages, nobody is going to give you the time to spend forever polishing one of them.

It is also hard to expect that the core CRDT implementation logic of a collaborative editing tool like [Yorkie](https://yorkie.dev/) will be written in a way that is immediately understandable at a glance. The underlying algorithm is already difficult enough.

But in many cases, I think it is this obsession with immediate speed, saying things like “I’d rather write one more line of code than spend time setting that up,” or “Instead of organizing that, I could be doing something else,” that actually makes work slower. Of course, I admit there are cases where it is wasteful to spend time trying to perfectly uphold things like hexagonal architecture, TDD, compound component structure, or rendering optimization. But those are extreme examples. Most techniques were created not to satisfy developers’ vanity, but to help us get things done faster.

If you write code for only a day or two and never look at it again, it may not matter much how you do it. But if you are writing code you will keep returning to, then I believe setting decent rules and following them with obsessive consistency will increase development speed.

I do not think efficient development comes only from solving extremely difficult problems quickly. In reality, most developers are not doing highly technical work like [hacking a database down at the bit level](https://tech.devsisters.com/posts/bit-level-database-hacking/). A lot of the work is repeated production of similar pages and similar functions using similar tools. In that environment, efficiency comes from creating and following small rules, making the project’s code predictable as a whole, and eliminating small wastes of time so you can focus on the truly difficult problems or the business logic.

# References

Toss Frontend Fundamentals - A Guide for Frontend Code That Is Easy to Change

https://frontend-fundamentals.com/code-quality/

Cognitive load matters

https://github.com/zakirullin/cognitive-load/blob/main/README.ko.md

Clean Code Through Gestalt Principles: The Secret of Readability

https://velog.io/@teo/cleancode

Miller’s Law

https://designbase.co.kr/dictionary/millers-law/

[^1]: This quote is commonly attributed to Abraham Lincoln, but I could not find a clear source. Most materials I found suggested it is doubtful that Lincoln actually said it, so I assume it was distorted somewhere along the way. Still, the meaning is clear, and I think it expresses well what I want to say in this article.

[^2]: This is not always true in agile processes or mission-oriented organizations where developers also participate in planning. And when a project is in the PoC stage, planning may be rewritten countless times. Even then, however, I believe development principles still help. For example, if a shared component like `<Button>` contains business logic, then changes in project planning may cause that component to be discarded or heavily changed. But if such a base component contains no business logic at all, it might still be reusable in the next project.

[^3]: A clickable element that triggers a response when activated by the user, [MDN, ARIA: button role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/button_role)

[^4]: In Next.js, the pages router means that if there is a `pages/` folder, subfolder names become routes. So in a real Next.js project, `pages` would likely not be used as a folder name for storing route-specific components. But this is only an example to aid understanding, so I used `pages` because it is semantically intuitive.