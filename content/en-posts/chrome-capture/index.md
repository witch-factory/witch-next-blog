---
title: Capturing the Entire Chrome Page
date: "2022-11-19T00:00:00Z"
description: "How to capture the entire page in Chrome"
tags: ["tip"]
---

# Capturing the Entire Chrome Page

While creating presentation materials, I needed to capture an entire page. However, the Mac monitor cannot display the entire page at once. For example, what if I need to capture the entire Naver page? Initially, I tried pressing `shift+command+3` to take a full-screen screenshot. However, this captures the entire Mac screen, not just the Naver page.

![naver](./naver.png)

Using `shift+command+4` allows me to drag the mouse to capture a selected area, excluding the top bar and other sections. Pressing the spacebar gives the option to capture a specific window. However, it still does not provide the entire page capture I desire.

Seeking advice in an open chat room, someone with a trustworthy profile shared the solution.

![kakao](./kakao_talk.jpeg)

Open the Developer Tools with `command + option + i`, then access the command palette by pressing `command + shift + p` and search for `capture full size screenshot`.

![capture](./capture.png)

This method captures the entire page.

Looking at the downloaded image file, I can see that the Naver page has been successfully captured in full.

![naver_full](./www.naver.com_.png)