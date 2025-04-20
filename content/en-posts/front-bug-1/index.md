---
title: Project Troubleshooting - Updating User Profiles
date: "2022-08-13T00:00:00Z"
description: "Issues encountered while communicating with the server in React"
tags: ["web", "front", "react"]
---

# 1. Issue Introduction

Currently, I am working on a project to create a website that can assist band operations, with the frontend under my responsibility. In this project, there is a section in the user profile where information related to band activities, such as preferred music genres, activity areas, and typical activity days, is recorded. Naturally, this information is stored on the server associated with the user. While implementing the API for modifying this information, an issue arose.

Specifically, I was implementing a feature that allows users to edit and save this information when it involves selecting certain items from a specific group. This article will detail the situations and problems I encountered during the project while outlining the process of finding a general solution.

# 2. Project Context

Given that this is a band-related service, users generally would have preferences for several music genres. Thus, a field was created to set and display preferred genres. However, circumstances may arise where users wish to update these preferences. Changes in preferred music genres are quite common.

![editfield](./editfield.png)

For example, suppose a user wants to remove K-POP and add J-POP as their new preferred genre in an editing field. The user would delete K-POP from the screen, add J-POP, and then save the changes.

The requests that need to be sent to the server when saving these modifications are twofold: (the modifications are not reflected on the server until the "complete edit" button is pressed, at which point all changes are completed and sent to the server at once).

1. Remove K-POP from preferred genres.
2. Add J-POP to preferred genres.

# 3. The Simplest Solution - Save Separately

Considering the simplest solution, one might think of saving the removed and added genres separately and sending these two requests to the server at the time of saving.

In this case, the component managing preferred genres will have `deletedGenres` and `addedGenres` as states passed down to child components via props. If the component managing preferred genres is called `GenreField`, it will likely have components like `GenreItem` responsible for rendering each genre item and `GenreAddButton` responsible for adding genres.

All these components would need to receive `deletedGenres` and `addedGenres` via props to manage genre updates. Additionally, the described child components also manage updates to preferred genres, requiring them to receive the functions `setDeletedGenres` and `setAddedGenres` as props. Expanding the props to four for a single genre update and drilling them down to child components does not seem like an optimal strategy.

# 4. Refined Solution - Update by Comparing with Server State

Ultimately, what we want to achieve is as follows:

```
Send the edited user's preferred genres to the server for storage upon completion of editing.
```

What then is the basis for this edited content? It is, of course, the user's preferred genres previously stored on the server. Therefore, we can compare the existing user preferred genres stored on the server with the user's edits, only sending the differing parts to the server at the time of editing completion. APIs for adding and removing preferred genres already exist. Additionally, we will already have the edited values that the user is working on. Hence, we only need to maintain a state for the currently stored preferred genres on the server.

When we have both, upon completing the edits (i.e., when the modification complete button is pressed), the requests to send to the server are as follows:

1. Remove any items that exist on the server but not in the edited user preferences.
2. Add any items in the edited user preferences that do not exist on the server.

The function representing this in the project was as follows. The `deleteUserGenre` and `addUserGenre` functions communicate with the server via axios.

```jsx
function updateUserGenres(curUserGenres, serverUserGenres) {
  for (const genre of serverUserGenres) {
    // Remove genres that existed before but have been deleted by the user
    if (curUserGenres.find((g) => g.id === genre.id) === undefined) {
      UserProfileAPI.deleteUserGenre(genre.id);
    }
  }

  for (const genre of curUserGenres) {
    // Add genres that have been edited but did not exist on the server
    if (serverUserGenres.find((g) => g.id === genre.id) === undefined) {
      UserProfileAPI.addUserGenre(genre.id);
    }
  }
}
```

# 5. Removing Everything Before Re-adding - Race Condition Occurrence and Resolution

However, coding as such has the downside of searching through all existing elements to see if something exists for every single addition/removal. This results in a time complexity of O(n^2). While the number of music genres is unlikely to reach tens of thousands and user profile edits are not an extremely frequent operation, it is still inefficient code.

Thus, I decided to use a method of removing all preferred genres stored on the server before re-adding the edited ones. This approach achieves a time complexity of O(n). The steps required are as follows:

1. Remove all the preferred genres stored on the server.
2. Add the entirety of the user's edited preferred genres to the server.

In this scenario, it is crucial to first remove the preferred genres stored on the server. If the added genres are sent before removing the stored ones, any genres that the user has not edited will inadvertently be deleted as well. Thus, I enforced the order using `await`.

```jsx
async function updateUserGenres(curUserGenres, serverUserGenres) {
  // Synchronizing user's preferred genres with the server
  const UserGenreDeletePromises = serverUserGenres.map((genre) => {
    return UserProfileAPI.deleteUserGenres(genre.id);
  });

  const UserGenreAddPromises = curUserGenres.map((genre) => {
    return UserProfileAPI.addUserGenres(genre.id);
  });

  await Promise.all(UserGenreDeletePromises);
  await Promise.all(UserGenreAddPromises);
}
```

While writing this code, I initially thought that triggering the promises for the user genre deletion would occur first, followed by the promises for adding the user's edited preferred genres. However, this did not work as expected. There were instances where unedited content was deleted.

This contradicts my assumption that using `await` would ensure the order. The functions `UserProfileAPI.deleteUserGenres` and `UserProfileAPI.addUserGenres` were structured as follows:

```jsx
addUserGenre: (genreID) => {
  return request.post(`/api/users/${userID}/genres/${genreID}`, genreID);
},
deleteUserGenre: (genreID) => {
  return request.delete(`/api/users/${userID}/genres/${genreID}`);
},
```

The point of constructing the `UserGenreDeletePromises` and `UserGenreAddPromises` arrays in the `updateUserGenres` function created promises that were already sent to the server via axios requests. At this point, these axios request promises are processed asynchronously, potentially leading to a race condition where the order of deletion and addition requests could become entangled.

This situation was resolved by enforcing the order of axios requests in the following manner:

```jsx
async function updateUserGenres(curUserGenres, serverUserGenres) {
  try {
    await Promise.all(
      serverUserGenres.map((genre) => {
        return UserProfileAPI.deleteUserGenre(genre.id);
      })
    );
    await Promise.all(
      curUserGenres.map((genre) => {
        return UserProfileAPI.addUserGenre(genre.id);
      })
    );
  } catch (err) {
    console.log(err);
  }
}
```

With this code,

```jsx
serverUserGenres.map((genre) => {
  return UserProfileAPI.deleteUserGenre(genre.id);
});
```

the API requests are collected into a single promise through `Promise.all`. Thus, the user’s existing preferred genre deletion requests are executed asynchronously as a consolidated operation. The sequence is enforced by using `await`, which ensures that the next set of code executes only after the aggregated promise resolves.

Now, the requests to delete user preferred genres must be resolved before adding the user's preferred genres. The enforcement of this order is handled by `await`. Only after all user preferred genre deletion requests (which are wrapped in `Promise.all`) have resolved does the execution proceed to the next line of code.

However, the requests to delete each preferred genre and to add the user's preferred genres do not need to execute in a specific sequence. If they did, the execution result remains the same but the execution time would unnecessarily increase. Therefore, I bundled those requests using `Promise.all` again, enabling each request to execute asynchronously. 

# 6. Room for Improvement

However, this was only suitable because the APIs for adding and deleting preferred genres operated one genre at a time. Essentially, a more efficient approach would involve sending the user's edited preferred genre list to the server in a single request, allowing the server to handle the additions and deletions accordingly. Sending multiple requests like this could lead to issues and increase the server's workload unnecessarily.