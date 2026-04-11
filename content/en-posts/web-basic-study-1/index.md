---
title: Web Deployment Study - 1. Using Git
date: "2021-11-12T00:00:00Z"
description: "Description of Git, the tool for this study"
tags: ["web", "study", "git"]
---

# 1. Using Git in the Study

To take our first steps into the web, we created a study group to loosely cover the processes of front-end (React), back-end (Express) work, and deployment. I believe that if such a study merely imposes a discipline on participants to study, it can be considered a success.

However, since we are studying together, it would be beneficial if there are advantages to learning more than doing it alone. As the study leader, I have set up several mechanisms for this purpose. One of them is to provide opportunities for participants to read others' code and learn from their thought processes while coding.

Now, how do we share code with others? We could send files via KakaoTalk, but since we are on the development path, we will use Git, which is an essential tool that, with proficiency, will become more convenient than sending files via KakaoTalk (I believe it will). There is an abundance of resources on Git available on the internet, and everyone, including myself, should continue to research through Google, but here I will cover only the necessary parts for the study briefly.

# 2. Basics of Git

Git is a tool for managing code. It allows us to track what changes have been made and provides a backup for the code. Additionally, it offers numerous features for collaboration and convenience.

First, let’s go through the installation of Git by following the processes outlined on this site, which also contains explanations of basic features.

https://goddaehee.tistory.com/216?category=381481

https://goddaehee.tistory.com/217?category=381481

Once Git is installed, I will explain how to share code for the study. I referred to the following article heavily.

https://gmlwjd9405.github.io/2017/10/28/how-to-collaborate-on-GitHub-2.html

Firstly, fork the web-basic repository in the my-own-web organization to each of your remote repositories.

![fork](./fork.png)

Now, there should be a copy of our study repository in each of your Git accounts. Next, let’s fetch it into each of our local repositories (storage on our computers).

Create an appropriate folder for the repository in your desired location, for example, one named `web-study`. Then, open Git Bash in that folder and execute the following command.

```
git init
```

Next, we will bring the forked repository from your account's repository into the local repository. For instance, I have a repository named `witch-factory/web-basic`. Let’s fetch it. When you go into your GitHub account’s web-basic repository, there will be a green button labeled 'code'. Click that and select the SSH option, then copy the displayed address.

![ssh](./ssh.png)

Then, add that to the remote repository we just initialized. Go back into the repository where we ran `git init`, open the terminal, and execute the following command.

```
git remote add origin [the address you copied earlier]
```

In my case, the command was as follows.

```
git remote add origin git@github.com:witch-factory/web-basic.git
```

Now, let’s pull the contents from the remote repository into the local repository.

```
git pull origin main
```

<span style="color:red">Caution: We should perform this operation on the repository we forked in our own accounts, not on the web-basic repository created in the organization.</span> 

You can also do this operation using `git clone`, but I chose this method to explicitly show how to name the linked remote repository as origin. If you are curious about whether the remote repository is saved locally, you can use the command `git remote -v` to see the currently connected remote repositories.

Now, let’s assume we are working on the repository connected via Git. I created a React project folder named after my own name using create-react-app.

```
npx create-react-app sunghyun
```

This will create a folder named sunghyun in the local repository. I did this simply to work on React, and the important part is that there have been changes made to the repository. Whether I created a text file or deleted something, it is the same.

You can check the repository's changes with the `git status` command. It indicates that the sunghyun folder has been created and is currently untracked by Git.

Let’s make it tracked by Git.

```
git add .
```

This command allows all untracked files to be tracked by Git. Next, commit the changes.

```
git commit -m "commit message"
```

Now, let's reflect these changes to the actual remote repository. Until we reach the commit stage, the changes haven't been determined where they will be reflected.

```
git push origin main
```

If you encounter an error, you can use the `git branch` command to see which branch the current repository is being tracked by. At that moment, the branch may appear as `master`, in which case you can run 

```
git branch -m main
```

to have the current changes follow the main branch. After that, you can repeat the process starting from `git add .`.

https://velog.io/@kimiszero/github-src-refspec-master-does-not-match-any-%ED%95%B4%EA%B2%B0%EB%B0%A9%EB%B2%95

If you would like to manage branches better, you can use commands such as `git checkout`, and `git merge` to split tasks into separate branches.

https://backlog.com/git-tutorial/kr/stepup/stepup2_4.html

However, I believe it is not necessary at this moment. We just need to submit a pull request.

After pushing the contents of your local repository to your own remote repository, go to github.com and enter your remote repository. You will see a message such as `This branch is 1 commit ahead of my-own-web:main.`, indicating that there are changes in your remote repository compared to the central repository (our my-own-web repository).

Next to it is an item called 'contribute'. It asks if you would like to contribute the changes made in your remote repository to the central repository. The 'Fetch upstream' option next to it asks if you want to fetch the changes made in the central repository to your remote repository, but we do not need to do that yet.

In any case, click the contribute item and select 'open pull request'.

![pr](./pr.png)

When creating the pull request, write a message to be shown to the central repository team, then click 'create pull request'.

The steps we followed are as follows:

1. Fork the central repository to create a copy in my unique account repository.
2. Fetch that copied repository into my local repository.
3. Work on the local repository.
4. Reflect the changes made in the local repository to my account’s repository.
5. Request the changes made in my account's repository be reflected in the central repository.

Now, other participants can see that pull request and check what has changed and leave comments. In the lower right corner, there is a small reviewers section where you can request reviews from others.

![review](./review.png)

At this point, if their IDs are clicked, an email requesting a review of my pull request will be sent to them.

If the changes I made do not conflict with changes in the central repository, I can directly reflect them into the central repository. The green button titled `merge pull request` is for that. Since we will each create separate folders to work, it is unlikely that our work will overlap. <span style="color:red">However, let’s not merge just yet... in case of unexpected situations, the merge will occur all at once when everyone is gathered.</span>

Additionally, it has been decided in the study that everyone will review the work of designated individuals, and this review will also proceed by leaving comments in the PR as described above.