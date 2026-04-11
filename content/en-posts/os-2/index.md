---
title: Operating System Dinosaur Book Chapter 3 Summary
date: "2022-11-25T00:00:00Z"
description: "Summary of Chapter 3 of Operating Systems"
tags: ["study", "CS"]
---

This document summarizes Chapter 3 of the Operating System, focusing on processes.

# 1. Concept of a Process

A process refers to a currently executing program. A program exists on a disk, and when it is loaded into memory and executed with a program counter, it becomes a process. Such processes are also used as units of work in computing systems.

Multiple programs can be loaded into memory, and a single program can create multiple processes.

Each process has its own memory and program counter, indicating that it runs independently. A process's memory layout is divided into code (text), data, stack, and heap regions.

Here, the text and data sections are of fixed size during execution, while the stack and heap sections can dynamically change in size. The heap area contains memory dynamically allocated by the user, while the stack area contains an activation record each time a function is called. Detailed information is generally found in system or programming language courses.

## 1.1 Process States

As a process executes, its state changes. The state of a process can be broadly categorized into five types: new, ready, running, waiting, and terminated.

- New: The process is being created. At this stage, the process is not registered in the process table and transitions to the ready state upon approval.
- Ready: The process is waiting to be allocated to the CPU. Once the process is assigned to the CPU for scheduling, it transitions to the running state.
- Running: The process is currently allocated to the CPU and executing. If it transitions to I/O or waits for a specific event, it becomes waiting. When the process concludes, it transitions to the terminated state. Additionally, if an interrupt occurs, it returns to the ready state.
- Waiting: The process is waiting for I/O or a specific event. Once the I/O is complete or the event occurs, it returns to the ready state.
- Terminated: The process has completed execution. Once terminated, the process is removed from the process table.

A single core can have only one process in execution at any given time.

## 1.2 Process Control Block

Each process is represented by a Process Control Block (PCB) in the OS. PCBs are created upon the process creation and managed by the process manager. They contain the following information:

- Process state
- Process number
- Program counter
- CPU registers
- CPU scheduling information
- Memory management information
- Accounting information (CPU usage time, elapsed time, time limits, etc.)
- I/O status information

# 2. Process Scheduling

The purpose of multiprogramming is to ensure that the CPU is always executing some process. Time-sharing frequently switches between processes so that users can work with multiple programs.

As a single processor can execute only one process at a time, processes must be scheduled to run multiple processes. The number of processes currently in memory is referred to as the Degree of Multiprogramming.

To facilitate this, processes can be classified into two types:

- I/O bound processes: These spend more time on I/O than computation, meaning I/O operations dominate the process.
- CPU bound processes: These spend more time on computation than I/O, meaning computation operations dominate the process.

## 2.1 Scheduling Queue

Ready state processes that wait to be executed in the main memory are stored in a linked list form known as the ready queue. This ready queue contains the PCBs.

Processes waiting for the completion of I/O are stored in an I/O Wait Queue (also known as the device queue). Additionally, as seen in the Pintos project, there is also a sleep queue for waiting on the termination of child processes.

## 2.2 CPU Scheduling

The CPU scheduler selects a process from the ready queue and allocates the CPU to that process. The scheduler runs very frequently, typically in milliseconds.

The scheduler can perform an operation called swapping, which is based on the idea that it may be better to remove a process from memory and bring it back later for execution. Swapping is covered in detail in Chapter 9.

## 2.3 Context Switching

The information that represents the state of a process, including the program counter and the process state, is called the process context.

The operation of switching the CPU from one process to another is called context switching. The context of the existing process must be saved and restored later. In other words, the PCB of the currently running process must be saved, and a new process must be executed (as context is expressed within the PCB). After the new process completes execution, the PCB of the old process must be retrieved to continue its execution.

During this context switching, the CPU cannot perform any work, making the time spent on context switching pure overhead. The speed of this switching varies by device.

# 3. Process Operations

Let's look at the process creation techniques. Most processes within a system can operate concurrently, requiring dynamic creation and removal. Therefore, it is essential for the operating system to have functionality for process creation and termination.

## 3.1 Process Creation

Processes are managed and identified through a unique identifier called pid (process identifier). Each process can create multiple child processes, forming a tree structure based on these relationships. The systemd (or init, which may differ by OS) process, which always has a pid of 1, is the top-level process.

This root process with pid 1 is the parent of all processes and is created when the system boots.

When a process creates a child process, there are options that can be specified:

What resources will the child process inherit?
- Share all resources of the parent process.
- Share some resources of the parent process.
- Do not share any resources of the parent process (in which case resources must be allocated separately for the child process).

What about the execution of the child process?
- The parent process continues to execute in parallel with the child.
- The parent process waits until the child process is finished (this is commonly used).

What about the address space of the child process?
- The child process uses the parent's address space directly, meaning it has the same program and data.
- The child process has its new program to be loaded into its address space.

## 3.2 Example from Real UNIX Operating System

In UNIX, a new process is created using the `fork()` system call. When this function is called, the parent creates an identical child process.

This child process is a copy of the parent process's address space. Both processes then continue executing from the command following the `fork` system call.

The difference between the parent and child process lies in the pid value returned by the fork. In the parent process, fork returns the child's pid, while in the child process, fork returns 0. Both processes operate simultaneously.

The child process can load its unique program via `exec()`. This overwrites the original program's memory image and executes the program loaded through exec().

The code for such an operation is as follows:

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>

int main(void) {
    pid_t pid;
    pid = fork();
    if(pid < 0){
        fprintf(stderr, "Fork Failed");
        exit(-1);
    }
    else if(pid == 0){ // The child process receives 0 from fork.
        execlp("/bin/ls", "ls", NULL);
    }
    else{
        wait(NULL); // The parent waits for the child to finish.
        printf("Child Complete");
        exit(0);
    }
    return 0;
}
```

The parent process waits for the child to complete. If the child process has called `exec()`, it will not transfer control until the address space is overwritten with the new program, barring errors.

The child process may, of course, continue executing as a copy of the parent without calling `exec()`.

## 3.3 Process Termination

Once a process executes its final command, it requests deletion from the operating system using the exit() system call. It also returns status values to the waiting parent process through the wait(&status) system call, and all resources allocated to the child process are released and returned to the operating system.

Alternatively, parents or users can arbitrarily terminate child processes through the kill system call, for reasons such as:
- The child process uses more resources than allocated.
- The work done by the child process is no longer needed.
- The parent process has terminated, and the operating system does not allow child processes to continue running after a parent exit (some operating systems terminate all child processes when the parent exits, known as cascading termination).

To terminate the child process using kill(pid), the pid of the child process is required.

## 3.4 Orphan Processes and Zombie Processes

A zombie process is one that has exited but whose parent process has not yet called wait. Therefore, all processes become zombie processes for a brief period after termination. When the parent calls wait, the zombie child process is fully terminated. In other words, a zombie process has already terminated but still exists in the process table (the parent is still running).

In contrast, an orphan process refers to a process that exists without a living parent. In UNIX-like systems, the init process adopts orphan processes, managing them as its child processes. The init process periodically calls wait to collect the termination status of its child processes.

Orphan processes arise when a parent process exits without calling wait.

# 4. Process Address Space

Each process has a virtual address space. The memory of this virtual address space is mapped to actual physical memory. Commonly referenced are the stack, heap, data, and code segments corresponding to the process's virtual address space. This virtual address space typically consists of a contiguous address range (0~MAX). However, the physical memory mapped to this virtual address space does not necessarily have to be contiguous.

So how is this virtual address space organized and mapped to physical memory? Several techniques and the crucial concept of paging will be discussed in a later section.

# 5. Interprocess Communication

If a process can influence and be influenced by other running processes, it is called a cooperating process. Conversely, a process that does not impact other processes is referred to as an independent process. The advantages of using cooperating processes are as follows:

- Multiple processes can jointly access the same information.
- Specific tasks can be executed in parallel by multiple processes.
- Modular system configuration can be achieved by dividing system functions into separate processes/threads.
- Increased convenience.

To facilitate interprocess cooperation, Interprocess Communication (IPC) is necessary. There are two main methods for IPC:

- Shared memory
- Message passing

## 5.1 Shared Memory Method

In the shared memory method, a memory area is established that is shared among cooperating processes. This memory area holds data that processes share. By reading from and writing to this area, processes can exchange information. Each process must add the shared memory segment to its address space.

The shared memory method only requires a system call during the construction of the shared memory area; once established, all access is treated as regular memory access, eliminating the need for kernel intervention. Thus, it is faster than message passing. However, it needs to implement a mechanism to prevent concurrent access to the same memory location (as simultaneous writes can corrupt data).

### 5.1.1 Producer-Consumer Problem

The shared memory method can address the producer-consumer problem, which arises when two processes operate concurrently. Typically, this issue occurs because the information production rate exceeds the consumption rate, leading to synchronization problems. This can be resolved by creating a buffer in the shared memory area shared by the producer and consumer processes.

Information produced by the producer is stored in the buffer, while the consumer retrieves and consumes information from the buffer. If the buffer is empty, the consumer waits, and if the buffer is full, the producer waits. This solution resolves the synchronization problems that arise when producers and consumers operate simultaneously.

## 5.2 Message Passing Method

In the message passing method, communication between processes occurs through messages exchanged between each other. There is no need for memory to be shared between processes in this approach.

The message passing method provides at least two operations:

- Send: Sends a message. The message length can be fixed or variable.
- Receive: Receives a message. The receiver waits until a message is available.

To send and receive messages through send/receive, a communication link must be established. Factors to consider in designing message-passing methods include:

- Naming: How will the communicating processes identify each other?
- Synchronization: How will the processes synchronize during message exchanges?
- Buffering: How will message queues between processes be managed?

### 5.2.1 Naming

In direct communication, processes must know each other's addresses for identification. For instance, to send a message to P, one would use send(P, msg), and to receive a message at Q, it would be receive(Q, msg).

There is also an indirect communication method through mailboxes (or ports). In this approach, messages are sent to a mailbox and then received from it, forming a structure of process - mailbox - process.

Each mailbox possesses a unique ID. For two processes to communicate, they must share a mailbox. Messages can be sent and received via send(A, msg) and receive(A, msg) respectively, enabling communication among multiple processes. However, a dedicated mailbox for storing messages is required.

### 5.2.2 Synchronization

Interprocess communication can be blocking or non-blocking. Blocking = synchronous, non-blocking = asynchronous. Their features are as follows:

Blocking send: The sender cannot perform new sends until the message is received by the receiver (or mailbox).
Non-blocking send: The sender does not wait for the receiver to receive the message and can initiate a new send as soon as the send operation completes.
Blocking receive: The receiving process is blocked until a message becomes available.
Non-blocking receive: The receiving process obtains either a valid message or null.

### 5.2.3 Buffering

Messages exchanged between communicating processes reside in a queue. There are three types of queue configurations:

1. Zero capacity: The maximum queue length is zero. Since there is no place to store messages, the sender must wait until the receiver retrieves the message.
2. Bounded capacity: The maximum queue length is predetermined. If the queue is full, the sender must wait until there is space.
3. Unbounded capacity: There is no limit on the queue length, and the sender never has to wait.

## 5.3 Comparison

Most operating systems implement both methods. The message passing method does not require collision avoidance, making it useful for sharing small quantities of data and easier to implement in distributed systems.

However, the shared memory method is faster, as the message passing method generally implements system calls, which can induce kernel interference and slow down the process. The shared memory method requires system calls only when constructing the shared memory area, and afterward, kernel intervention is unnecessary.

# 6. Actual IPC Techniques

## 6.1 Pipes

Pipes act as communicators between two processes. Typical pipes only allow one-way communication—one end writes data while the other reads. To enable bidirectional communication, two pipes must be utilized, each oriented in opposite directions.

Pipes are commonly used in command line command chaining. For instance, executing `ls | grep` sends the output of the `ls` command as the input for the `grep` command.

Since pipes lack structured communication, it is impossible to know the size of the data they contain or the identities of the sender and receiver.

A typical anonymous pipe can only facilitate communication with ancestor processes. Therefore, to use a pipe, the parent process must create it and transfer the pipe to the child process through fork.

Creating an anonymous pipe can be done via the pipe function. The `pipe(fd)` function creates a pipe and stores file descriptors for reading and writing in fd[0] and fd[1] respectively.

- fd[0]: Read-only file descriptor
- fd[1]: Write-only file descriptor

The actual code exemplifying this is as follows:

```c
#include <stdio.h>
#include <unistd.h>

int main(void){
  int n, fd[2], pid;
  char line[100];

  if(pipe(fd) < 0){
    fprintf(stderr, "pipe error\n");
    exit(-1);
  }
  if((pid=fork()) < 0){exit(-1);}
  else if(pid > 0){ // parent
    close(fd[0]); // close read end
    write(fd[1], "hello world\n", 12); // parent writes
    wait(NULL); // wait for child process
  }
  else{ // child
    close(fd[1]); // close write end
    n = read(fd[0], line, 100); // child reads
    write(STDOUT_FILENO, line, n); // output received string to standard output
  }
}
```

## 6.2 Named Pipes

Named pipes relax the limitations of ordinary pipes. Named pipes enable bidirectional communication and allow communication with processes other than the parent and child.

They exist in the file system, meaning they do not disappear even if the communicating processes terminate. They can be manipulated using system calls like `open, read, write, close`.

## 6.3 Sockets

A socket is an endpoint for communication. Each socket has an IP address and a port number. Sockets define an interface for communication over a network, typically following a server-client model.

A socket formed by an IP address and a port number can be thought of as an address (e.g., `146.86.5.20:1625`). For server-client communication, both parties need to know each other’s socket address. Thus, the server provides its socket address, while the client needs to obtain the server's socket address.

Once both the client and server know each other’s socket addresses, they can communicate using methods such as TCP and UDP. If the two processes that created the sockets are running on the same computer under the same operating system, interprocess communication is also feasible through sockets.