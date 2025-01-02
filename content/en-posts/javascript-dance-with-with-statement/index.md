---
title: Exploring the with Statement and Its Associated Series
date: "2024-07-08T01:00:00Z"
description: "Starting from a sentence in an old JavaScript book to contributing to MDN"
tags: ["javascript", "web"]
---

# This article is in progress.

I recently conducted research on the `with` statement and wrote about it on my blog.

[JS Exploration - About the with Statement](https://witch.work/posts/javascript-with-statement)

[JS Exploration - The Troublesome with Statement and the Chronicle of Symbol.unscopables](https://witch.work/posts/javascript-with-statement-2)

I believe I effectively achieved what I strive for when writing blog posts or studying something, and since I invested considerable time and effort, I would like to document the process here.

Each time I encounter problem cases or learn something, I strive to understand completely, searching for connections in my mind and identifying areas that do not quite connect or seem suspicious. Then, I delve into these issues until they are completely resolved or until I feel I cannot explore any deeper. Through this process, knowledge, understanding, and contributions follow naturally.

# Beginning

Because I have a keen interest in the history of JavaScript, I often look for old JavaScript books or materials. While reading Axel Rauschmayer's "Speaking JavaScript," I came across the following sentence in the section discussing the issues related to the `with` statement.

> This is not a thought experiment. When the array method `values()` was added to Firefox, it caused issues in the TYPO3 content management system's code. Brendan Eich identified the cause of this issue (http://mzl.la/1jCrXti).
>
> Axel Rauschmayer, translated by Han Seon-yong, "Speaking JavaScript," p. 248

After reading this sentence, I became curious and visited the provided link. I found a Bugzilla report page regarding the bug described in the book. However, I could barely understand the context when I first viewed it.

# Translation of MDN Document

After reading the comments on the bug report page, it seemed that the code `with(values)` was causing issues. Additionally, examining related links and other bug documents revealed a connection to the well-known symbol `Symbol.unscopables`. Although I had encountered the name in a previous article about [the uses of symbols](https://witch.work/posts/javascript-symbol-usage), I had not fully understood that section.

To comprehend this bug report, it was essential to learn about `with` and `Symbol.unscopables`. As such, I first looked for the MDN documents on `with` and `Symbol.unscopables`. Since they pertained to concepts that are rarely used in practical development, the translations were not present (surprisingly, the documentation for `Array.prototype[@@unscopables]` was translated).

Thus, I thought I would need to read the documents multiple times for my understanding, so I decided to translate them.

Having developed a technique while already translating [JavaScript: The First 20 Years](https://js-history.vercel.app/), the translation was not too difficult. Moreover, the official guidelines, such as the [MDN Web Docs contribution guide](https://github.com/mdn/content/blob/main/CONTRIBUTING.md), were very friendly, allowing me to follow them easily. There were also many articles online summarizing the feedback and guidelines from previous contributors, helping me to complete the PR effortlessly.

I was able to submit two PRs: [[ko] New Translation of the with Document](https://github.com/mdn/translated-content/pull/22055) and [[ko] New Translation of the Symbol.unscopables Document](https://github.com/mdn/translated-content/pull/22078).

While receiving reviews, there were parts where the reviewers asked for my thoughts alongside the guidelines. Studying to answer their questions allowed me to explore more accurately the parts I originally wanted to understand.

After making corrections based on the reviews, my PR was merged. It was gratifying to leave a small trace in a site that had helped me immensely, and it greatly aided my ongoing exploration.

![MDN Translation PR](./mdn-translation.png)

I had thought that contributing to document translation was one of the easiest ways to contribute, and MDN was quite famous for this. However, after translating just two relatively obscure documents, I realized I had to consider many aspects, which made me feel embarrassed about my previous assumptions.

By thoroughly understanding the documents through translation, I could easily comprehend the original bug report I was viewing. Based on that, I investigated historical contexts and wrote [JS Exploration - The Troublesome with Statement and the Chronicle of Symbol.unscopables](https://witch.work/posts/javascript-with-statement-2).

# Contributing to the MDN Original Content

As I worked on translating the MDN documents and exploring the bug report, I noticed something odd. The MDN document stated that `Symbol.unscopables` was introduced because of `Array.prototype.keys()`. However, the more I searched, the more it became clear that `Symbol.unscopables` arose because of `Array.prototype.values()`.

It is indeed true that when `Symbol.unscopables` was first introduced, `keys` was included. However, this occurred because the array methods `keys()`, `values()`, and `entries()` were introduced together, and the method that actually triggered the bug was `values()`.

Of course, there could be circumstances that I do not know about. Most MDN document contributors are experts, and they may have knowledge of behind-the-scenes information that I lack. Therefore, I looked for the contributor of the relevant MDN document. However, based on their resume, I did not expect them to have participated in TC39 discussions related to `with` or have information about the behind-the-scenes issues.

[So, I nervously gathered as many sources as possible and raised an issue stating that there was incorrect information in the document, along with a question about whether I could submit a PR.](https://github.com/mdn/content/issues/34639)

![My MDN Issue Submission](./mdn-upstream-issue.png)

A surprisingly prompt reply came saying, "Of course, you can submit a PR." Therefore, I corrected the content to reflect that `Symbol.unscopables` arose from `values()`, not `keys()`, and submitted [a PR.](https://github.com/mdn/content/pull/34646#issuecomment-2209978411)

Then, a reviewer expressed interest in my findings and asked if I intended to add more content related to the issue. I, of course, welcomed the opportunity to contribute further but noted that this might mean there was a possibility of revising the `Array.prototype[@@unscopables]` document. I was advised to proceed as I saw fit.

![Comment on the MDN Issue](./mdn-upstream-pr-comment.png)

I then simply drafted my findings to submit a PR. It was quickly reviewed, and after incorporating feedback, the PR was merged.

![MDN PR Merged](./mdn-upstream-pr-merged.png)

Although the topic may not be widely sought after, helping the MDN documents—which are still regarded as a significant authority—provide complete information was a source of great joy.

# Twitter

Upon posting about my findings on Twitter, someone shared a paper titled [All about the with statement in JavaScript: removing with statements in JavaScript applications](https://dl.acm.org/doi/10.1145/2578856.2508173). It piqued my interest since it was authored by Professor Ryu Seok-young, one of the few Koreans mentioned in JS-related documents.

Fortunately, the paper was only twelve pages long and discussed creating a static analyzer that rewrites the with statement. While the subject was not something I initially wanted to know, the preliminary investigation section in the paper summarized existing uses of `with`. This information was helpful, and I added it to my own writings.

Let's Bring Back JavaScript's `with()` Statement

https://witch.work/posts/javascipt-dance-with-with-statement