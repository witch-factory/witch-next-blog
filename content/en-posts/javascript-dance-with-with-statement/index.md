---
title: The Art of Exploration - How a Sentence About with statement Led Me to Contribute to MDN
date: "2025-02-02T01:00:00Z"
description: "Beginning with a sentence from an old JavaScript book, leading to contributions to MDN"
tags: ["javascript", "web", "study", "tip"]
---

# Introduction

I have recently reflected on the process of finding inspiration and conducting exploration. Having run a technical blog for several years, I often pondered ways to write differentiated content. In this context, I recalled some articles I had previously written.

These include [JS Exploration - On the with Statement](https://witch.work/posts/javascript-with-statement) and [JS Exploration - The Troublesome with Statement and the Chronicles of Symbol.unscopables](https://witch.work/posts/javascript-with-statement-2). As the titles suggest, these articles delve into the longstanding JavaScript syntax known as the `with` statement.

I believe these articles achieved the goals I pursue while writing or studying quite well. As is typically the case with satisfactory results, they required considerable time and effort. Thus, I would like to document this process as it comes to mind.

I believe that my method of thorough exploration involves striving for complete understanding, identifying parts that do not connect to existing knowledge or that seem questionable, and digging until clarity is reached. In doing so, I believe knowledge, understanding, pull requests, and blog posts follow naturally. Consequently, the exploration of the `with` statement resulted in the linked articles above, and this piece summarizes that journey.

However, this article does not address the specific syntax or issues of the `with` statement, so I recommend referring to the blog posts linked above for understanding.

# Motivation for Exploration

I have a keen interest in the history of JavaScript. Therefore, I often look for old JavaScript books or related materials. While reading Axel Rauschmayer's "Speaking JavaScript," I came across the following sentence in a section discussing the issues of the `with` statement.

> This is not a thought experiment. There was a time when the introduction of the array method values() in Firefox tangled the code of the TYPO3 content management system. Brendan Eich uncovered the root of this issue (http://mzl.la/1jCrXti).
>
> Axel Rauschmayer, translated by Han Seon-yong, "Speaking JavaScript", p. 248

Seeing this sentence piqued my curiosity, so I visited the provided link. An explanation of the bug referenced in the book appeared; however, I initially struggled to grasp the context.

# Translation of MDN Documentation

Upon reading the comments on the bug report page, it seemed that the code `with(values)` was causing the issue. Additionally, as I read related links and other bug documents, I found that this was associated with the well-known symbol `Symbol.unscopables`. While I had previously encountered this term in the article [Exploring the Uses of Symbols](https://witch.work/posts/javascript-symbol-usage), my understanding of it was limited.

To comprehend this bug report, I needed to learn about `with` and `Symbol.unscopables`, so I searched for MDN documentation on both subjects. Since these concepts are rarely applied in practical development, the documents were not translated (surprisingly, the translation for `Array.prototype[@@unscopables]` existed).

Thus, I figured I should translate the documents as I would need to read them multiple times for understanding.

Previously, I had translated and published the document "JavaScript: The First 20 Years," which detailed the history of JavaScript. As such, I found the translation manageable. Moreover, official guides like the [MDN Web Docs contribution guide](https://github.com/mdn/content/blob/main/CONTRIBUTING.md) were very helpful, allowing me to follow along easily. Translating MDN documents is a common project for those making their first contributions to open-source, and there were many testimonials and guides from previous contributors, which aided me in completing the translation and the pull request.

The pull requests I submitted were [[ko] New Translation of the with Document](https://github.com/mdn/translated-content/pull/22055) and [[ko] New Translation of Symbol.unscopables Document](https://github.com/mdn/translated-content/pull/22078). The reviews were prompt, with reviewers providing various guidance, occasionally seeking my input on certain aspects. Responding appropriately assisted me in deepening my understanding of the elements I initially aimed to grasp.

After several rounds of revisions, the pull requests were merged. Leaving even a small trace on a site I greatly benefited from was fulfilling and significantly aided my ongoing exploration.

![MDN Translation PR](./mdn-translation.png)

Honestly, I had thought that translating MDN was an easy task that anyone could do. It seemed to be one of the lowest entry barriers for contributions, especially since MDN provides such opportunities. However, translating even just two lesser-known documents required considerable thought, making me reflect on my previous assumptions.

Of course, I do not now believe that translating MDN documents is an exceedingly difficult task reserved for a select group of individuals. But just because anyone can exercise does not mean it is easy. Furthermore, the accumulation of such tasks can lead to significant outcomes. Having made even a small contribution, I realized that these seemingly simple efforts can collectively build complex and invaluable knowledge.

Regardless, having translated the documents allowed me to comprehend them thoroughly, making it easier to re-examine the bug report. Based on that, I investigated the historical aspects and wrote [JS Exploration - The Troublesome with Statement and the Chronicles of Symbol.unscopables](https://witch.work/posts/javascript-with-statement-2).

# Contribution to the Original MDN Document

However, while conducting both the translation of MDN documents and exploring the bug report, I discovered a discrepancy. The MDN document indicated that `Symbol.unscopables` emerged due to `Array.prototype.keys()`. Yet, my findings consistently reinforced the notion that `Symbol.unscopables` actually arose from `Array.prototype.values()`.

It is true that `keys` was part of the initial introduction of `Symbol.unscopables`. However, this was due to the simultaneous introduction of the `keys()`, `values()`, and `entries()` array methods, with `values()` being the actual cause of the bug.

Certainly, there may be factors I am unaware of. Additionally, most MDN document contributors are experts who might possess knowledge of underlying circumstances I may not know. Therefore, I searched for the contributor to the MDN document on `Symbol.unscopables`. However, based on their history, I predicted they were not involved in TC39 discussions related to `with`.

[Thus, I sought sources to support my argument and opened an issue, asking whether I could submit a pull request for rectification.](https://github.com/mdn/content/issues/34639)

![My MDN Issue](./mdn-upstream-issue.png)

A reply stating, "Of course, you can submit a PR," came alarmingly quickly. Consequently, I revised the content to reflect that `Symbol.unscopables` emerged from `values()`, not `keys()`, and submitted a [PR](https://github.com/mdn/content/pull/34646#issuecomment-2209978411).

The reviewer commented that it might be interesting to know if I intended to add more content referenced in the issue.

![Comment on MDN Issue](./mdn-upstream-pr-comment.png)

Naturally, I welcomed the opportunity to contribute further. However, it seemed that this would require rectifying the `Array.prototype[@@unscopables]` document, which I mentioned in my reply. The reviewer, who was also the maintainer, encouraged me to proceed as I wished.

I then simply drafted a pull request incorporating my findings. The review process was also exceedingly swift, and after the revisions, the pull request was soon merged.

![MDN PR Merged](./mdn-upstream-pr-merged.png)

While it may not concern highly sought-after content, assisting the MDN documentation—recognized as one of the most authoritative resources on the frontend—in providing accurate information was a significant accomplishment.

# Papers Related to the with Statement

After posting these writings on Twitter, someone shared the paper [All about the with statement in JavaScript: Removing with statements in JavaScript applications](https://dl.acm.org/doi/10.1145/2578856.2508173).

Fortunately, it was only 12 pages long and discussed creating a static analyzer to improve the efficiency of programs by rewriting the `with` statement. I was not well-versed in static analysis, so the content was not exactly within the scope of my interest. However, the preliminary investigation section outlined the existing usage of `with`.

Referencing this revealed alternative usages of the `with` statement. For instance, it included a method where the `this` context is wrapped in a `with` statement within a constructor function, allowing property access without explicitly referencing `this`, as mentioned in the book "Secrets of the JavaScript Ninja."

The paper presents an example showcasing the usage of the `with` statement in a constructor function:

```javascript
function simpleCons(x) {
  var privateVar = 1;
  this.publicVar = x;
  this.copyvalue = function() {
    privateVar = this.publicVar;
  };

  // copyvalue can be changed to use the with statement as follows.
  this.copyvalue = function() {
    with(this) {
      privateVar = publicVar;
    }
  };
}
```

Several other patterns are introduced, but since the `with` statement is no longer in use and the paper does not delve into actual code involving `with`, I will omit further details. Nonetheless, through this paper, I learned about nearly all the usages of the `with` statement.

# Conclusion

Starting from a small sentence in a JavaScript book, I progressed through the translation of MDN documents, contributions to the original MDN documentation, and engagement with a research paper. While the `with` statement itself may be of minimal importance—I have never directly used it or encountered it in production code during development, and I might never encounter code utilizing it in the future—I believe that is not the crux of the matter.

What truly matters is that I will undoubtedly confront many challenges in the future. Although I may face similar issues, I will undoubtedly encounter entirely new problems as well. Each time, what is important is not what I have explored, but how I have delved into solutions and the flow of thoughts I have developed.

From a single sentence in a book to contributing, albeit modestly, to a document visible to people worldwide: I have gained insights into how an infrequently used and outdated syntax influenced a well-known symbol that emerged in ES6. My previous queries regarding symbols aided my understanding of this dynamic.

With the engagement in the paper, I even encountered aspects requiring knowledge of concepts such as constructor functions or `this` in order to comprehend fully. How much knowledge was necessary to deeply understand a syntax I may never use and might not encounter again? How intricately connected are these various elements? Finding these connections, gaining understanding, and seeking out further links represent the exploration I endeavor to pursue. Someday, perhaps all the knowledge I possess will form a structured web of interconnected ideas in my mind.

# References

Axel Rauschmayer, translated by Han Seon-yong, "Speaking JavaScript"

All about the with statement in JavaScript: Removing with statements in JavaScript applications

https://typeset.io/pdf/all-about-the-with-statement-in-javascript-removing-with-31zttjdgy3.pdf