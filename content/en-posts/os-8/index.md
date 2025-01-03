Operating System Dinosaur Book Chapter 10 Summary

# 1. Virtual Memory

Virtual memory allows a program to execute without all of its contents residing in memory. It enables programmers to utilize a memory space that is much larger than the actual physical memory, alleviating the concern over the size of physical memory.

## 1.1 Virtual Address Space

The virtual address space refers to how a process is logically stored in memory. This space typically consists of areas such as the stack, heap, data, and code segments.

![space](./space.png)

These areas are managed through paging and are not necessarily stored contiguously in actual physical memory. Furthermore, the empty space between the stack and the heap does not occupy any physical memory. When the stack or heap expands, it will request actual physical memory, achieved by allocating a new range in the virtual address space.

Using virtual memory also allows multiple processes to share files or memory.

# 2. Demand Paging

Demand paging loads a page into memory only when it is needed. During the execution of a process, some pages reside in memory while others remain on secondary storage (disk). This clearly enhances memory utilization efficiency.

## 2.1 Valid/Invalid Bit

Each entry in the page table includes a valid/invalid bit. This bit indicates whether the page is present in memory. If the bit is set to 0, it signifies that the page is either invalid or valid but resides on the disk. Initially, if no page is loaded, all entries have their bits set to 0.

## 2.2 Page Fault

A page fault occurs when a process references a page that is not in memory. If the valid bit for the page being accessed is set to 0, the hardware triggers a page fault trap.

The handling of this trap proceeds as follows:

1. It checks an internal table (typically located within the Process Control Block) to verify the validity of the reference. If invalid, the process is halted; if valid, the page is fetched from the disk.
2. To retrieve the page from the disk, it first searches for an empty frame, then reads the page into that frame, updating the page table entry.
3. It restarts the instruction that was halted earlier. **Naturally, the instruction must resume processing after handling the page fault.**

Even if no pages are loaded in memory, the process can be executed, resulting in continual page faults until all pages utilized by the process are loaded. This method of loading pages strictly upon necessity is known as pure demand paging.

Additionally, during the page fault handling, a mechanism finds an empty frame. Most operating systems maintain a list of available frames to resolve such requests. When the system starts, all available memory is included in this list.

## 2.3 Difficulties

After handling a page fault, the instruction must be restarted. However, if the instruction involves moving a specific memory fragment to another location, src and dest could overlap. In this case, simply restarting the instruction would lead to an error.

There are two solutions: One is to check in advance if the two blocks overlap and raise a page fault if they do. The other is to store the part of the data that would be overwritten in a temporary register and recover it later.

## 2.4 Performance

The page fault rate will naturally be between 0 and 1. If we let the page fault rate be $p$, the Effective Access Time (EAT) is defined as follows:

$$EAT = (1-p) \times Memory \ Access \ Time + p \times Page \ Fault \ Time$$

The page fault time consists of various components:

- Overhead for handling the page fault interrupt
- Swap-in time for the page
- Time taken to save a modified existing page
- Time to restart the instruction (including memory access time after the page fault)

Due to these factors, the occurrence of page faults significantly degrades performance. An example from the textbook assumes that memory access time is 200ns ($200 \times 10^{-9}s$) and the average time taken during a page fault is 8ms ($8 \times 10^{-3}s$). The difference is substantial. However, in a demand paging scenario, it is unavoidable that some page faults will occur. To mitigate performance degradation in demand paging, it is crucial to reduce page faults.

## 2.5 Copy-on-Write

The fork command creates a child process that is a copy of the parent process. However, if the exec command is executed immediately after fork, the pages copied from the parent process become redundant. Copy-on-Write allows the child process to temporarily share the parent’s pages at the time of fork.

If either the parent or child process modifies one of these shared pages, only that modified page gets copied, while unmodified pages continue to be shared between the parent and child processes.

By only copying modified pages, more efficient operations are achieved during process creation.

# 3. Page Replacement

When a page fault occurs during the execution of a process and there are no available frames, what should be done? To address this situation, the concept of page replacement arises.

Selecting which page to replace is important, but let's first examine the basic mechanics of page replacement before discussing page replacement algorithms.

## 3.1 Structure of Page Replacement