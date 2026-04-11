---
title: Notepad Creation Project - 1 Design
date: "2021-08-27T00:00:00Z"
description: "Web Notepad Project, A Record of Struggles"
tags: ["web"]
---

# 1 Starting a Side Project

There has been a study I have been working on for about a year. Initially, it was a study to read and summarize "Python for Experts." Later, it transitioned to studying Django for the backend and React for the frontend. The motivation was, "Having studied the book 'Python for Experts,' let's create something with Python!" However, there were many discussions about how complex Django was (I shared that sentiment; it felt incredibly difficult as it was my first experience with backend development), leading us to switch to an Express backend. Before I knew it, the study had completely deviated from Python.

We have been progressing with simple clone coding using the React + Express combination, which is now nearing completion. I was responsible for the backend using Express. Although it was somewhat sluggish, I learned quite a bit. I believe it was a decent process. Not everything can run perfectly, and I, myself, cannot even achieve that.

Anyway, as we approach the end, I want to utilize the diverse knowledge I have acquired thus far to create a simple project and document the process to post on my blog.

After considering various options, I decided to create a web notepad. It will have a membership system where users can manage their notes after logging in.

# 2 Design

I will use React for the frontend, Express for the backend, and MySQL for the database. Additionally, I will use styled-components for styling, React Router for page management, and passport for the login/signup system. This is the broad framework, and I will add necessary libraries along the way, such as a crypto library for encrypting user information.

For the core notepad functionality, I had previously created a simple notepad while studying React, which I plan to modify and use. It is available at https://witch-factory.netlify.app/. I will be borrowing the design, but I will rewrite the code from scratch. I intend to add features like folder functionality and user-specific note databases.

The login and signup pages will initially be simple, featuring input fields that match the color scheme of the notepad design, and I will gradually refine the design afterward. This approach is necessary because I lack design skills and have no prior experience.

Currently, I believe the only necessary pages are the notepad, login page, and signup page, but if additional pages are required later, I will add them at that time. I will take it as it comes.

Additionally, there is a commercial notepad site that I will reference extensively for the notepad design. It's [Somnote](https://somcloud.com/apps/note), which I used to enjoy quite a bit. While I don’t think the design is perfect, there are certainly aspects that bother me, so I will definitely differentiate in elements like color and layout. It provides features like grouping notes into folders and deleting them through a modification button, among others; it can be difficult to describe in words, but there may be many similarities in structure.

If the design becomes more robust in the future, I may add more content to this article.