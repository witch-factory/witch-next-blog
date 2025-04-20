---
title: Operating System Dinosaur Book Chapter 7 Summary
date: "2022-12-07T00:00:00Z"
description: "Summary of Chapter 7 of Operating Systems"
tags: ["study", "CS"]
---

This document summarizes the examples related to synchronization from Chapter 7 of the Operating System. The content was not covered in depth during school lectures, so only classical problems and their solutions related to synchronization will be summarized. Most solutions involve the use of semaphores.

# 1. Bounded Buffer Problem

The bounded buffer problem is a type of producer-consumer problem. The producer process creates information, and the consumer process consumes it. How can this be implemented?

In Chapter 3, we saw the solution using shared memory. The producer fills the buffer with information, and the consumer consumes it from the buffer. The issue arises when both the producer and the consumer access the buffer simultaneously. Problems will occur if the consumer tries to consume an item that has not yet been produced. Thus, synchronization is necessary.

We can declare the following variables that will be shared between the producer and the consumer. Assume a pool composed of n buffers, where each buffer can store one item.

```c
int n; // number of buffers
semaphore mutex = 1; // number of processes that can access the buffer pool
semaphore empty = n; // number of empty buffers
semaphore full = 0; // number of full buffers
```

The producer can be implemented as follows. Note that it waits if the buffer is full (i.e., if there are no empty buffers).

```c
do{
  ...
  /* produce an item in next_produced */
  ...
  wait(empty); // wait until there is an empty buffer
  wait(mutex); // decrease the number of processes that can access the buffer pool
  /* add next_produced to the buffer pool */
  ...
  signal(mutex); // increase the number of processes accessing the buffer pool
  signal(full); // increase the number of full buffers
}while(1);
```

The consumer can be implemented as follows. Note that it waits if the buffer is empty (i.e., if full <= 0).

```c
do{
  wait(full); // wait until there is an item in the buffer
  wait(mutex); // decrease the number of processes that can access the buffer pool
  ...
  /* remove an item from buffer pool to next_consumed */
  ...
  signal(mutex); // increase the number of processes accessing the buffer pool
  signal(empty); // increase the number of empty buffers since an item was consumed
  ...
  /* consume the item in next_consumed */
  ...
}while(1);
```

As the consumer consumes information, it increases `empty`, and the producer waits until `empty` is greater than 0. The producer increases `full` as it produces information, and the consumer waits until `full` is greater than 0.

# 2. Reader-Writer Problem

In the context of shared data among multiple processes, reader processes that only read data can be separated from writer processes that update the data. Multiple processes can read the data simultaneously without issues. However, multiple processes writing simultaneously, or a single process writing while another reads, can lead to problems.

To resolve this issue, we allow the writer process exclusive access to the data during writing, while reader processes wait until writing is completed.

Declare the following variables shared by readers and writers.

```c
int readcount = 0; // number of processes currently reading
semaphore mutex = 1; // for mutual exclusion on readcount
semaphore wrt = 1; // for writer mutual exclusion
```

The writer process can be implemented as follows.

```c
do{
  // Prevent other processes from reading while modifying the data.
  wait(wrt); // writer mutual exclusion
  ...
  /* write to the shared data */
  ...
  signal(wrt); // release writer mutual exclusion
  ...
  /* do other things */
  ...
}while(1);
```

The reader process can be implemented as follows. While someone is reading, the `wrt` semaphore prevents the writer from accessing the data. Additionally, this approach allows multiple readers to access the process simultaneously.

```c
do{
  wait(mutex); // mutual exclusion for readcount
  readcount++;
  if(readcount == 1) // if this process is the first to enter the critical section
    wait(wrt); // writer mutual exclusion
  signal(mutex); // release mutual exclusion for readcount
  ...
  /* read from the shared data */
  ...
  wait(mutex); // mutual exclusion for readcount
  readcount--;
  // If the process ending its read is the last reader
  if(readcount == 0)
    signal(wrt); // release writer mutual exclusion
  signal(mutex); // release mutual exclusion for readcount
  ...
  /* do other things */
  ...
}while(1);
```

The issue with this method is that the continuous creation of reader processes could cause the writer process to suffer from starvation.

# 3. Dining Philosophers

![dining](./dining.png)

This is a well-known problem. However, due to time constraints, I will summarize the next more important parts for the exam.