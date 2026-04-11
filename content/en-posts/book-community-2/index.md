---
title: Creating a Book Community - 2. Collaboration Method
date: "2022-02-09T00:00:00Z"
description: "Collaboration method guide for the book community project"
tags: ["web", "study", "git"]
---

# 1. The Need for Collaboration Guidelines

My first experience of coding with others was a year ago during a study group. Like many study groups, that one eventually fizzled out, but I had a particularly memorable experience there. At the time, we used a single repository, separating our individual tasks by branches, working independently, and merging into the master branch without using mechanisms like pull requests. 

One day, I accidentally committed and pushed my work to the master branch, overwriting everyone else's contributions. Fortunately, I didn’t push old commit records away entirely, so recovery was possible. However, the experience of nearly erasing all others' work is vividly ingrained in my memory.

While I made a mistake, I believe it is a mistake anyone could have made. The other members were not all familiar with programming or collaboration. Thus, in this project, I will create guidelines to minimize such mistakes in advance. Although errors might still occur, and perhaps I’ll encounter unforeseen mistakes, wouldn’t it be wise to prevent mistakes already experienced?

# 2. Prerequisites

## 1. Creating a Shared Workspace

Since we already have an organization we used during our study, we decided to create a shared repository there. Thus, a new repository will be created within the organization for our work.

![group](./group.png)

As explained in previous posts, we will create client and server folders and maintain a document for role assignment.

## 2. Terminology

**Central Remote Repository**: The remote repository within the organization, specifically referring to the shared book-community repository we created.

**My Remote Repository**: A repository that I forked from the central remote repository into my own account using git fork. This appears as `myusername/book-community` on the GitHub homepage, showing where the central remote repository is located.

![fork](./forked.png)

Appearance of my remote repository after forking

**Local Repository**: A repository saved on my PC, not remote. Actual coding work occurs here.

# 3. Structuring the Collaboration System

## 1. Creating My Remote Repository

On the central remote repository page on GitHub, utilize the fork option to copy the central remote repository to my account.

![forking](./fork_guide.png)

This will create a remote repository in my account.

## 2. Importing the Remote Repository to My Local

Now, for actual work, I need to bring the contents of the repository to my local environment. We will use `git clone` to accomplish this. Create a folder for the files to be worked on, initialize git within that folder, and then execute `git clone`.

```
git clone [remote repository URL]
```

Alternatively,

```
git remote add origin [remote repository URL]
git pull origin [branch name you wish to retrieve]
```

Although both methods yield the same outcome, there are differences. `git clone` updates the local repository to match the remote one, whereas `git pull` retrieves contents from the remote repository and merges them with the existing local repository.

Since we are importing the remote repository's content to an empty folder, the results are the same. However, if you execute `git clone` in a folder with existing work, its contents will be overwritten by the remote repository's contents. In contrast, `git pull` merges the remote repository's contents with the local repository, provided no conflicts arise.

Therefore, it is recommended to use `git clone` when initially transferring the remote repository to a local repository.

Where can the remote repository URL be found? If you have forked the central remote repository into your account, the corresponding repository now exists in your account. Go to that repository, and by clicking the button labeled `Code`, you can find the HTTP or SSH URL.

![url](./url.png)

By clicking the button marked in red in the image, you can access the remote repository URL. Note that you are in your remote repository (the forked version), not the central remote repository.

To verify if my remote repository is correctly linked to my local repository via `git clone`, you can use the following command.

```
git remote -v
```

This command, when used in the terminal of the local repository, will display the name and URL of the connected remote repository. You will see that the remote repository I just connected is designated as `origin`, which is the default name assigned when cloning a repository.

If you have an existing remote repository and wish to remove its connection, issue the following command:

```
git remote remove [name of the remote repository to be removed]
```

For example, if you want to remove the connection labeled `origin`, type `git remote remove origin` in the terminal.

## 3. Connecting to the Central Remote Repository Locally

Currently, our local repository is connected to the repository I forked from the central remote repository. However, it is also advantageous to link to the central remote repository since it contains contributions made by others.

Suppose an output A created by someone has been added to the central remote repository. In that case, my remote repository is separate and does not contain A. Thus, I must retrieve A from the central repository to build upon it. To facilitate this, I will also connect the local repository to the central remote repository to fetch its contents (usually outputs created by others).

Run the following script in the terminal to connect the central remote repository to the local repository.

```
git remote add upstream [central remote repository URL]
```

You can find the central remote repository URL by clicking the `Code` button on the GitHub page for the central repository.

Now, I have created my remote repository by forking the central remote repository and connected both to my local repository. My remote repository is linked as `origin`, and the central remote repository is linked as `upstream`.

# 4. Starting New Work

I will undertake new tasks by creating a new branch from my local repository. Once completed, I will push it to my remote repository and subsequently send a request (Pull Request) to merge the branch into the central remote repository. This process will be explained step by step.

## 1. Creating a Branch for New Work

The command `git branch` allows you to check which branch you are currently on. You may likely be on the `master` branch. Now, let’s create a new branch for our new task and start working there. Use the following command to create a branch with a new name.

```
git branch [new branch name]
```

Then, switch to the newly created branch using the following command.

```
git checkout [branch name to switch to]
```

These two commands can also be combined as follows:

```
git checkout -b [new branch name to create and switch to]
```

For example, I can create a `test` branch and switch to it using:

```
git branch test
git checkout test
```

Now, I can proceed with the work I intend to accomplish in the local repository.

## 2. Pushing Work to the Remote Repository

Once I complete the work in the local repository, I need to upload it to my remote repository. It’s essential to point out that I am pushing to my remote repository (which I forked from the central repository), not the central remote repository. First, you can check the status of changed files using the following command:

```
git status
```

This will display the changes made locally that have not yet been committed. Let's add these changes to the staging area, preparing them for commit.

```
git add .
```

If you want to add only a specific file to the staging area, replace the `.` with the filename you wish to add. After adding the changes to the staging area, you can proceed with the commit.

```
git commit -m "commit message"
```

Now, the changes in the local repository are ready to be pushed to the remote repository. Push to the branch we agreed to work in.

```
git push origin [current working branch name]
```

Note that the repository you are pushing to is `origin`. Origin is not the central remote repository; it is my remote repository, which I forked from the central one. Ensure that you push to the branch you are currently working on and not to `master`. If your working branch name is `test`, the command will be:

```
git commit -a -m "commit message" # This command commits and stages files in one action
git push origin test
```

## 3. Requesting Reflection in the Central Remote Repository

After completing my assigned tasks in my remote repository, I need to upload them to the central remote repository for everyone to view. This allows others to base their work on mine and prevents duplication of effort. To do this, I need to request reflection of my work in the central remote repository, a process known as creating a Pull Request.

Upon making this request, I can select a branch from my remote repository to merge into the central remote repository. Since I have been using the `test` branch in this post, I will request to merge `test` into the central remote repository.

When I work on the test branch, Git tracks which branch I was working on after forking my remote repository from the central one. If there are any changes in my remote repository that are absent from the central one, Git allows me to merge them.

![button](./pr_button.png)

As shown in the image, there is a button labeled `compare & pull request`. Clicking this button will take you to a page where you can enter a title and description for the pull request. Below, you can review the changes made. Now, write the major changes in the title section, and provide a detailed description in the content section, then click `Create pull request`.

![prex](./pr_example.png)

## 4. Merging into the Central Remote Repository

Now, if you go to the pull request menu in the central remote repository, you will see the pull request I requested.

![prsee](./pr_show.png)

Clicking on the pull request will show which commits have been requested for merging into the central repository and any descriptions provided by the requester. By clicking on the commit history, you can view what changes were made in each commit. This feature is useful for understanding changes made by others, especially since it is often not easy to grasp the modifications just by looking at the resultant code.

![mergeex](./merge_example.png)

If there are no significant issues, you can use the `Merge pull request` button to integrate the changes into the central remote repository.

However, it is essential not to merge without proper consideration. Conflicts with other contributions may arise, and other team members may identify potential issues in the requested changes. Therefore, ensure to receive confirmation and thorough understanding from others before merging.

Once approved and merged, the work I performed will be reflected in the central remote repository!

# 5. Synchronizing with Other Work

In the central remote repository, I am not the only one working. Other team members are contributing as well. Hence, the code in the central repository will be updated with their contributions, which may not correspond to my work. It is crucial to synchronize changes from the central remote repository with my local repository.

There may be conflicts between my changes and those of others, and I may also need to use the results from others in my work. Such synchronization is carried out as follows. The reason for linking the local repository to the central remote repository as `upstream` is now evident.

```
git pull upstream master
```

This command will pull the contents of the master branch from the central remote repository linked as `upstream` into the local repository. If any errors occur, it indicates there is a conflict between others' work and mine, so carefully read the error messages and address any issues accordingly.

If this command completes without any errors, it means the local repository is successfully synchronized with the central remote repository. If you wish to reflect this in your remote repository, use `git push origin master`.

## 5.1. Starting a New Task

Once I complete one task and synchronize my local repository with the outputs of others, I will be ready to start a new task. Let’s return to Step 4 and create a new branch for the new task to begin work.

# 6. References

A very detailed GitHub collaboration guide. My writing here is merely my understanding of this material. https://gmlwjd9405.github.io/2017/10/28/how-to-collaborate-on-GitHub-2.html 

Difference between git pull and git clone: https://kimcoder.tistory.com/288