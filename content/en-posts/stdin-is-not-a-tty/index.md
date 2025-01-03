---
title: git Error - stdin is not a tty
date: "2022-12-03T00:00:00Z"
description: "Resolving stdin is not a tty"
tags: ["git"]
---

# 1. Occurrence of the Problem

I usually work on my laptop in my own living space, but I came back home briefly to write an article for my blog. Currently, my blog uses Gatsby, and I am utilizing the Gatsby-starter-lavendar theme created by [Lee Changhee](https://xo.dev/).

However, when I tried to write an article and execute a git commit, I encountered the following error.

![bug](./bug.png)

# 2. Exploring the Error Message

What does this mean? Let's analyze it step by step. Stdin is clearly standard input/output. Tty, as I found out, is an abbreviation for Teletype, which refers to a device for telegraphy, and this has led to the naming of the folder that contains files related to input/output in the Linux /dev directory.

There is more detailed information about tty on the reference page below, but what is important now is that tty is responsible for input/output. Therefore, it must be a higher concept than stdin. The phrase stdin is not a tty indicates that something is wrong. However, this does not help much in resolving the error.

What about the following error message? I also looked into husky. It is a npm library that allows scripts to be executed during certain Git-related events, known as git hooks. Among these events, the client hook runs on the client (i.e., my computer) before committing, merging, or pushing.

The error message fits perfectly with that. It indicates that a git hook executed before the commit has ended due to an error.

My assumption is as follows. There was a command that used echo in the shell script file executed by the husky pre-commit hook, which requires tty. However, I suspect this issue arises from the difference in tty used between my laptop (running macOS) and the desktop at home (running Windows).

When I checked which tty folders are used on each computer using the `tty` command, it revealed that on Mac it shows `dev/ttys001`, while on the Windows git bash it shows `dev/pty0`. I believe that this difference has caused some error during the execution of the husky pre-commit hook.

# 3. Solution

The solution is simple. Just remove and reinstall husky. After deleting the `.husky` folder, I reinstalled husky using the `yarn` command.

![yarn](./yarn.png)

The husky pre-commit hook has changed slightly. However, since husky is primarily used for lint checking and similar tasks whenever code is committed or pushed in Git, and I only write new articles for the blog without particularly modifying the code, it doesn’t matter much.

Moreover, if I do end up modifying the blog code, I will likely be working on my laptop. Additionally, the husky folder on the home desktop is already set to be ignored in `.gitignore`, so my laptop retains the existing `.husky` folder. Therefore, it is fine.

In any case, as a result, the git commit and push commands were executed successfully.

# References

What is tty? [TTY | Introduction](https://mug896.github.io/bash-shell/tty.html)

What is husky? [Let's use husky for git hooks | Gabia Library](https://library.gabia.com/contents/8492/)