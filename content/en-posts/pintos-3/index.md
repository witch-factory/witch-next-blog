---
title: Sogang University Pintos - Project 2
date: "2022-11-14T00:00:00Z"
description: "Pintos Project 2 - User Program 2"
tags: ["CS"]
---

# 1. Project Overview

This project involves the implementation of system calls related to the file system. The required system calls are create, remove, open, close, filesize, read, write, seek, and tell. Most of these can utilize already implemented functions.

However, to implement these, a file descriptor must be created.

# 2. File Descriptor Implementation

The operating system accesses files through file descriptors. A file can be any external device such as disk I/O, monitor, or keyboard. A file descriptor is an integer representation of these files. The file descriptors start from 0, where 0 to 2 are for standard input and output, and 3 onwards are user-accessible files opened through the open function.

When accessing a file, the file descriptor table is used. For example, if there is a file with the file descriptor 3, the file descriptor table stores the mapping of 3 to the corresponding file. We need to add this file descriptor table to the thread structure.

## 2.1 Basic Functions Related to File Descriptors

According to the Pintos manual, a maximum of 128 file descriptors is needed, so we can create an array of size 130 for use. First, we will define this as a macro for convenience.

```c
#define FDTABLE_SIZE 130
```

Then, we will add the file descriptor table to the thread structure.

```c
// In src/threads/thread.h structure

#ifdef USERPROG
    /* Owned by userprog/process.c. */
    uint32_t *pagedir;                  /* Page directory. */
    // parent process descriptor
    struct thread* parent_thread;

    /* each structure that is a potential list element must embed a struct list_elem member. */
    /* child list element */
    struct list_elem child_thread_elem;
    /* child list */
    struct list child_threads;
    /* process's program memory load status */
    bool load_flag;
    /* process exit status check */
    bool exit_flag;
    /* exit semaphore for waiting for child process termination */
    struct semaphore exit_sema;
    /* load semaphore for waiting on child process creation */
    struct semaphore load_sema;
    /* exit status upon exit call */
    int exit_status;
    /* file descriptor table */
    struct file* fd_table[FDTABLE_SIZE];

#endif
```

Now we need to create a function to initialize the file descriptor table. This function should be called when a thread is created, so we will modify the thread initialization function init_thread as follows.

```c
// In src/threads/thread.c init_thread function
static void
init_thread (struct thread *t, const char *name, int priority)
{
  enum intr_level old_level;

  ASSERT (t != NULL);
  ASSERT (PRI_MIN <= priority && priority <= PRI_MAX);
  ASSERT (name != NULL);

  memset (t, 0, sizeof *t);
  t->status = THREAD_BLOCKED;
  strlcpy (t->name, name, sizeof t->name);
  t->stack = (uint8_t *) t + PGSIZE;
  t->priority = priority;
  t->magic = THREAD_MAGIC;

  old_level = intr_disable ();
  list_push_back (&all_list, &t->allelem);
  intr_set_level (old_level);

  #ifdef USERPROG
  /* Initialize the child list */
  list_init(&(t->child_threads));
  // push to the child list of the running thread
  list_push_back(&(running_thread()->child_threads), &(t->child_thread_elem));
  // Save parent process
  t->parent_thread = running_thread();
  sema_init(&(t->exit_sema), 0);
  sema_init(&(t->load_sema), 0);
  for(i=0; i<FDTABLE_SIZE;i++){
    t->fd_table[i] = NULL;
  }
  #endif
}
```

Next, we will implement functions as required by the Hanyang University Pintos presentation. First, we implement a function to create a file descriptor. This function adds a file object to the file descriptor table and returns the file descriptor.

```c
// In src/userprog/process.c process_add_file function
int process_add_file(struct file* f){
  struct thread* t = thread_current();
  int i;
  for(i=3; i<FDTABLE_SIZE; i++){
    if(t->fd_table[i] == NULL){
      t->fd_table[i] = f;
      return i;
    }
  }
  return -1;
}
```

Next, we implement a function that returns the file object corresponding to a file descriptor.

```c
// In src/userprog/process.c process_get_file function
// Return the address of the file corresponding to the file descriptor
struct file* process_get_file(int fd){
  struct thread* t = thread_current();
  if(fd<3 || fd>=FDTABLE_SIZE){
    return NULL;
  }
  return t->fd_table[fd];
}
```

Next, we implement a function that closes the file object corresponding to a file descriptor.

```c
// In src/userprog/process.c process_close_file function
void process_close_file(int fd){
  struct thread* t = thread_current();
  if(fd<3 || fd>=FDTABLE_SIZE){
    return;
  }
  // Cannot close a NULL file.
  if(t->fd_table[fd] != NULL){
    file_close(t->fd_table[fd]);
    t->fd_table[fd] = NULL;
  }
}
```

When a process terminates, it should close all open files. We then modify the process_exit function as follows.

```c
/* Free the current process's resources. */
void
process_exit (void)
{
  struct thread *cur = thread_current ();
  uint32_t *pd;
  int i;

  /* new! */
  for(i=3; i<FDTABLE_SIZE; i++){
    process_close_file(i);
  }

  /* Destroy the current process's page directory and switch back
     to the kernel-only page directory. */
  pd = cur->pagedir;
  if (pd != NULL)
    {
      /* Correct ordering here is crucial. */
      cur->pagedir = NULL;
      pagedir_activate (NULL);
      pagedir_destroy (pd);
    }
}
```

## 2.2 File System Call Implementation

Now let's implement the file system calls. Pintos already provides several functions for handling files. The Hanyang University presentation has detailed explanations that we will use.

### 2.2.0 Considerations Before Implementing

Before implementing system calls related to files, one crucial aspect to consider is avoiding concurrent access to files. For example, if I am reading file A and another process attempts to write to it, the contents of A could change while I am reading it. Moreover, if two or more processes try to write to file A simultaneously, the contents might get corrupted.

To prevent concurrent access to files, a lock must be used. Similar to the reader-writer problem, where reading can be done by multiple processes simultaneously while writing should be restricted to one process, we will implement a mechanism to ensure that only one process can access a file at a time.

Pintos has declared a lock structure in `src/threads/synch.h` for this purpose. We will use it.

First, add `struct lock filesys_lock;` as a global variable in `src/userprog/syscall.h`.

Then, in `src/userprog/syscall.c`, add `lock_init(&filesys_lock);` in `syscall_init()`.

```c
void
syscall_init (void)
{
  lock_init(&filesys_lock);
  intr_register_int (0x30, 3, INTR_ON, syscall_handler, "syscall");
}
```

This lock will be utilized in the future to implement the open, read, and write system calls.

### 2.2.1 Opening Files

The open system call opens a file and returns its descriptor. The lock should be acquired while opening the file and released after. We also need to handle cases when the file is NULL. For assigning a file descriptor, we will use the previously implemented `process_add_file()`.

```c
int open(const char* file){
  int fd;
  struct file* f;
  if(file==NULL) { exit(-1); }
  lock_acquire(&filesys_lock);
  f = filesys_open(file);
  if(f==NULL){
    lock_release(&filesys_lock);
    return -1;
  }
  fd = process_add_file(f);
  lock_release(&filesys_lock);
  return fd;
}
```

### 2.2.2 Reading Files

In Project 1, the read system call was implemented only for stdin. This time, we will implement it for files as well. First, we will check if the incoming fd is negative, if it is stdout (==1), or if it is greater than or equal to the size of the file descriptor table; in such cases, we will call the exit system call. Then, we acquire the lock.

If fd is stdin, we perform the keyboard input reading. Otherwise, we will read the contents of the file corresponding to fd. After these operations, we must release the lock.

```c
int read(int fd, void *buffer, unsigned int size){
  int result;
  uint8_t temp;
  if(fd<0 || fd==1 || fd>=FDTABLE_SIZE) { exit(-1); }
  lock_acquire(&filesys_lock);
  if(fd==0){
    for(result=0; (result<size) && (temp=input_getc()); result++){
      *(uint8_t*)(buffer+result) = temp;
    }
  } else {
    struct file* f = process_get_file(fd);
    if(f==NULL){
      lock_release(&filesys_lock);
      exit(-1);
    }
    result = file_read(f, buffer, size);
  }
  lock_release(&filesys_lock);
  return result;
}
```

### 2.2.3 Writing Files

The write system call performs writing to a file. The implementation is similar to the above read system call. We check if the incoming fd is negative, if it is stdin (==0), or if it is greater than or equal to the size of the file descriptor table; in such cases, we will call the exit system call. Then, we acquire the lock.

If fd is stdout, we perform screen output as done in Project 1. Otherwise, we write to the file corresponding to fd. After these operations, we must release the lock.

```c
int write(int fd, const void* buffer, unsigned int size){
  int file_write_result;
  struct file* f;
  if(fd<=0 || fd>=FDTABLE_SIZE) { exit(-1); }
  lock_acquire(&filesys_lock);
  if(fd==1){
    putbuf(buffer, size);
    lock_release(&filesys_lock);
    return size;
  } else {
    f = process_get_file(fd);
    if(f==NULL){
      lock_release(&filesys_lock);
      exit(-1);
    }
    file_write_result = file_write(f, buffer, size);
    lock_release(&filesys_lock);
    return file_write_result;
  }
}
```

### 2.2.4 Creating Files

File creation can be implemented as follows. Just use the filesys_create function.

```c
bool create(const char *file, unsigned initial_size){
  // Cannot open a NULL file.
  if(file==NULL){
    exit(-1);
  }
  return filesys_create(file, initial_size);
}
```

### 2.2.5 Removing Files

File deletion can be implemented as follows. Just use the filesys_remove function.

```c
bool remove(const char *file){
  // Cannot open a NULL file.
  if(file==NULL){
    exit(-1);
  }
  return filesys_remove(file);
}
```

### 2.2.6 Closing Files

File closing can be implemented by simply using the process_close_file function.

```c
void close(int fd){
  process_close_file(fd);
}
```

### 2.2.7 File Size

File size can be obtained using the file_length function.

```c
int filesize(int fd){
  struct file* f = process_get_file(fd);
  if(f==NULL) { exit(-1); }
  return file_length(f);
}
```

### 2.2.8 Changing File Read/Write Position

Changing the edit position of a file can be done using the file_seek function.

```c
void seek(int fd, unsigned int position){
  struct file* f = process_get_file(fd);
  if(f==NULL) { exit(-1); }
  file_seek(f, position);
}
```

### 2.2.9 Returning File Position

Returning the file position can be done using the file_tell function.

```c
unsigned int tell(int fd){
  struct file* f = process_get_file(fd);
  if(f==NULL) { exit(-1); }
  return file_tell(f);
}
```

### 2.2.10 Testing

Now we will add the system calls that we have implemented to the system call handler.

```c
static void
syscall_handler (struct intr_frame *f UNUSED)
{
  switch(*(int32_t*)(f->esp)){
    case SYS_HALT:                   /* Halt the operating system. */
    halt();
    break;
    case SYS_EXIT:                   /* Terminate this process. */
    check_address(f->esp+4);
    exit(*(int*)(f->esp+4));
    break;
    case SYS_EXEC:                   /* Start another process. */
    check_address(f->esp+4);
    f->eax = exec((char*)*(uint32_t*)(f->esp+4));
    break;
    case SYS_WAIT:                   /* Wait for a child process to die. */
    check_address(f->esp+4);
    f->eax = wait(*(uint32_t*)(f->esp+4));
    break;
    case SYS_CREATE:                 /* Create a file. */
    check_address(f->esp+4);
    check_address(f->esp+8);
    f->eax = create((char*)*(uint32_t*)(f->esp+4), *(uint32_t*)(f->esp+8));
    break;
    case SYS_REMOVE:                 /* Delete a file. */
    check_address(f->esp+4);
    f->eax = remove((char*)*(uint32_t*)(f->esp+4));
    break;
    case SYS_OPEN:                   /* Open a file. */
    check_address(f->esp+4);
    f->eax = open((char*)*(uint32_t*)(f->esp+4));
    break;
    case SYS_FILESIZE:               /* Obtain a file's size. */
    check_address(f->esp+4);
    f->eax = filesize(*(uint32_t*)(f->esp+4));
    break;
    case SYS_READ:                   /* Read from a file. */
    check_address(f->esp+4);
    check_address(f->esp+8);
    check_address(f->esp+12);
    f->eax = read((int)*(uint32_t*)(f->esp+4), (void*)*(uint32_t*)(f->esp+8),
					(unsigned)*(uint32_t*)(f->esp+12));
    break;
    case SYS_WRITE:                  /* Write to a file. */
    check_address(f->esp+4);
    check_address(f->esp+8);
    check_address(f->esp+12);
    f->eax = write((int)*(uint32_t*)(f->esp+4), (const void*)*(uint32_t*)(f->esp+8),
					(unsigned)*(uint32_t*)(f->esp+12));
    break;
    case SYS_SEEK:                   /* Change position in a file. */
    check_address(f->esp+4);
    check_address(f->esp+8);
    seek((int)*(uint32_t*)(f->esp+4), (unsigned)*(uint32_t*)(f->esp+8));
    break;
    case SYS_TELL:                   /* Report current position in a file. */
    check_address(f->esp+4);
    f->eax = tell((int)*(uint32_t*)(f->esp+4));
    break;
    case SYS_CLOSE:                  /* Close a file. */
    check_address(f->esp+4);
    close(*(uint32_t*)(f->esp+4));
    break;
  }
}
```

Now, after performing a make check, if it does not pass, the processes do not terminate.

Through some investigation, I found that in Project 1, the `palloc_free_page` in the `thread_schedule_tail` function had commented out, preventing the deletion of the process descriptor. This part had reverted back to the original reference. I will uncomment this part and retest.

```c
// Modified thread_schedule_tail
void
thread_schedule_tail (struct thread *prev)
{
  struct thread *cur = running_thread ();

  ASSERT (intr_get_level () == INTR_OFF);

  /* Mark us as running. */
  cur->status = THREAD_RUNNING;

  /* Start a new time slice. */
  thread_ticks = 0;

#ifdef USERPROG
  /* Activate the new address space. */
  process_activate ();
#endif

  /* If the thread we switched from is dying, destroy its struct thread. */
  if (prev != NULL && prev->status == THREAD_DYING && prev != initial_thread)
    {
      ASSERT (prev != cur);
      /* Uncommented to delete the process descriptor. */
      palloc_free_page (prev);
    }
}
```

After this modification, I can confirm that 7 tests pass out of all.

```
run: wait for child 2 of 10 returned 0 (expected 1): FAILED
pass tests/userprog/args-none
pass tests/userprog/args-single
pass tests/userprog/args-multiple
pass tests/userprog/args-many
pass tests/userprog/args-dbl-space
pass tests/userprog/sc-bad-sp
pass tests/userprog/sc-bad-arg
pass tests/userprog/sc-boundary
pass tests/userprog/sc-boundary-2
pass tests/userprog/sc-boundary-3
pass tests/userprog/halt
pass tests/userprog/exit
pass tests/userprog/create-normal
pass tests/userprog/create-empty
pass tests/userprog/create-null
pass tests/userprog/create-bad-ptr
pass tests/userprog/create-long
pass tests/userprog/create-exists
pass tests/userprog/create-bound
pass tests/userprog/open-normal
pass tests/userprog/open-missing
pass tests/userprog/open-boundary
pass tests/userprog/open-empty
pass tests/userprog/open-null
pass tests/userprog/open-bad-ptr
pass tests/userprog/open-twice
pass tests/userprog/close-normal
pass tests/userprog/close-twice
pass tests/userprog/close-stdin
pass tests/userprog/close-stdout
pass tests/userprog/close-bad-fd
pass tests/userprog/read-normal
FAIL tests/userprog/read-bad-ptr
pass tests/userprog/read-boundary
pass tests/userprog/read-zero
pass tests/userprog/read-stdout
pass tests/userprog/read-bad-fd
pass tests/userprog/write-normal
pass tests/userprog/write-bad-ptr
pass tests/userprog/write-boundary
pass tests/userprog/write-zero
pass tests/userprog/write-stdin
pass tests/userprog/write-bad-fd
pass tests/userprog/exec-once
pass tests/userprog/exec-arg
pass tests/userprog/exec-bound
pass tests/userprog/exec-bound-2
pass tests/userprog/exec-bound-3
pass tests/userprog/exec-multiple
pass tests/userprog/exec-missing
pass tests/userprog/exec-bad-ptr
pass tests/userprog/wait-simple
pass tests/userprog/wait-twice
pass tests/userprog/wait-killed
pass tests/userprog/wait-bad-pid
pass tests/userprog/multi-recurse
pass tests/userprog/multi-child-fd
FAIL tests/userprog/rox-simple
FAIL tests/userprog/rox-child
FAIL tests/userprog/rox-multichild
pass tests/userprog/bad-read
pass tests/userprog/bad-write
pass tests/userprog/bad-read2
pass tests/userprog/bad-write2
pass tests/userprog/bad-jump
pass tests/userprog/bad-jump2
FAIL tests/userprog/no-vm/multi-oom
pass tests/filesys/base/lg-create
pass tests/filesys/base/lg-full
pass tests/filesys/base/lg-random
pass tests/filesys/base/lg-seq-block
pass tests/filesys/base/lg-seq-random
pass tests/filesys/base/sm-create
pass tests/filesys/base/sm-full
pass tests/filesys/base/sm-random
pass tests/filesys/base/sm-seq-block
pass tests/filesys/base/sm-seq-random
FAIL tests/filesys/base/syn-read
pass tests/filesys/base/syn-remove
FAIL tests/filesys/base/syn-write
7 of 80 tests failed.
```

We can debug the failed tests one by one, but before that, let's perform the remaining tasks. According to the Hanyang University presentation, the section on "denying write to executable" is the next step. Additionally, the school presentation mentions that writing data to an executing file must be prevented. Let's implement that first.

# 3. Denying Write to Executable

It is essential to prevent any data modifications while a user program is executing. Data can only be modified when the program is in a terminated state, not while it is running. We will utilize the built-in functions in Pintos that prevent data modification for this implementation.

First, we will add `struct file *exec_file` to the thread structure to keep track of the currently executing file.

```c
// Part of thread.h structure
#ifdef USERPROG
    /* Owned by userprog/process.c. */
    uint32_t *pagedir;                  /* Page directory. */
    // parent process descriptor
    struct thread* parent_thread;

    /* each structure that is a potential list element must embed a struct list_elem member. */
    /* child list element */
    struct list_elem child_thread_elem;
    /* child list */
    struct list child_threads;
    /* process's program memory load status */
    bool load_flag;
    /* process exit status check */
    bool exit_flag;
    /* exit semaphore for waiting for child process termination */
    struct semaphore exit_sema;
    /* load semaphore for waiting on child process creation */
    struct semaphore load_sema;
    /* exit status upon exit call */
    int exit_status;
    /* file descriptor table */
    struct file* fd_table[FDTABLE_SIZE];
    /* new! current executing file */
    struct file* exec_file;
#endif
```

Next, as described in the Hanyang University presentation, we will determine how to utilize `file_deny_write()` and `file_allow_write`. We will apply this as follows.

First, in the load function, when opening the executable file, we set the executing file and call `file_deny_write()`.

```c
bool
load (const char *file_name, void (**eip) (void), void **esp)
{
  struct thread *t = thread_current ();
  struct Elf32_Ehdr ehdr;
  struct file *file = NULL;
  off_t file_ofs;
  bool success = false;
  int i;
  char command[200];
  char* command_ptr;
  char* command_file_name;

  /* Allocate and activate page directory. */
  t->pagedir = pagedir_create ();
  if (t->pagedir == NULL)
    goto done;
  process_activate ();

  // parse file name
  strlcpy(command, file_name, 129);
  command_file_name = strtok_r(command, " ", &command_ptr);
  /* Open executable file. */
  file = filesys_open (command_file_name);
  if (file == NULL)
    {
      printf ("load: %s: open failed\n", command_file_name);
      goto done;
    }

    /* Prevent data modification */
    t->exec_file = file;
    file_deny_write(file);

  /* Read and verify executable header. */
  if (file_read (file, &ehdr, sizeof ehdr) != sizeof ehdr
      || memcmp (ehdr.e_ident, "\177ELF\1\1\1", 7)
      || ehdr.e_type != 2
      || ehdr.e_machine != 3
      || ehdr.e_version != 1
      || ehdr.e_phentsize != sizeof (struct Elf32_Phdr)
      || ehdr.e_phnum > 1024)
    {
      printf ("load: %s: error loading executable\n", file_name);
      goto done;
    }

  /* Read program headers. */
  file_ofs = ehdr.e_phoff;
  for (i = 0; i < ehdr.e_phnum; i++)
    {
      struct Elf32_Phdr phdr;

      if (file_ofs < 0 || file_ofs > file_length (file))
        goto done;
      file_seek (file, file_ofs);

      if (file_read (file, &phdr, sizeof phdr) != sizeof phdr)
        goto done;
      file_ofs += sizeof phdr;
      switch (phdr.p_type)
        {
        case PT_NULL:
        case PT_NOTE:
        case PT_PHDR:
        case PT_STACK:
        default:
          /* Ignore this segment. */
          break;
        case PT_DYNAMIC:
        case PT_INTERP:
        case PT_SHLIB:
          goto done;
        case PT_LOAD:
          if (validate_segment (&phdr, file))
            {
              bool writable = (phdr.p_flags & PF_W) != 0;
              uint32_t file_page = phdr.p_offset & ~PGMASK;
              uint32_t mem_page = phdr.p_vaddr & ~PGMASK;
              uint32_t page_offset = phdr.p_vaddr & PGMASK;
              uint32_t read_bytes, zero_bytes;
              if (phdr.p_filesz > 0)
                {
                  /* Normal segment.
                     Read initial part from disk and zero the rest. */
                  read_bytes = page_offset + phdr.p_filesz;
                  zero_bytes = (ROUND_UP (page_offset + phdr.p_memsz, PGSIZE)
                                - read_bytes);
                }
              else
                {
                  /* Entirely zero.
                     Don't read anything from disk. */
                  read_bytes = 0;
                  zero_bytes = ROUND_UP (page_offset + phdr.p_memsz, PGSIZE);
                }
              if (!load_segment (file, file_page, (void *) mem_page,
                                 read_bytes, zero_bytes, writable))
                goto done;
            }
          else
            goto done;
          break;
        }
    }

  /* Set up stack. */
  if (!setup_stack (esp))
    goto done;

  //printf("stack pointer before construct stack %p\n", *esp);
  // construct stack
  construct_stack(file_name, esp);
  //printf("stack pointer %p\n", *esp);
  /* Start address. */
  *eip = (void (*) (void)) ehdr.e_entry;

  success = true;

 done:
  /* We arrive here whether the load is successful or not. */
  file_close (file);
  return success;
}
```

Next, we will call `file_allow_write()` in `process_exit()`, but this occurs in the `file_close` function, which already contains the code to call `process_exit` for closing all currently executing files. Therefore, I think it is fine to only modify the load function and run it. However, the results remain the same with 80 tests failing on 7 counts.

# 3.1 Debugging

Let’s examine the load function carefully. The label `done:` is where we arrive whether or not file opening was successful. However, here we call `file_close`, which triggers `file_allow_write`, thus negating the purpose of having called `file_deny_write`. Therefore, we need to modify the load function to avoid calling `file_close` here. 

Let's comment out the `file_close(file);` line below `done:`.

```c
 done:
  /* We arrive here whether the load is successful or not. */
  //file_close (file);
  return success;
```

Next, I feel that the process_exit function should close the currently executing file and the process_exit function should also allow the write operation to occur, as we have already implemented closing all open files in that function. The modified process_exit function looks like this.

```c
/* Free the current process's resources. */
void
process_exit (void)
{
  struct thread *cur = thread_current ();
  uint32_t *pd;
  int i;

  // Close the currently executing file (file_allow_write will also occur)
  file_close(cur->exec_file);
  for(i=3;i<FDTABLE_SIZE;i++){
    process_close_file(i);
  }
  /* Destroy the current process's page directory and switch back
     to the kernel-only page directory. */
  pd = cur->pagedir;
  if (pd != NULL)
    {
      /* Correct ordering here is crucial. */
      cur->pagedir = NULL;
      pagedir_activate (NULL);
      pagedir_destroy (pd);
    }
  //printf("process exit\n");

}
```

After this modification, I will make check again. Wow! The failure count dropped to 4 out of 80 tests.

# 4. Remaining Test Debugging

## 4.1 read-bad-ptr

Now, with 80 tests remaining, `read-bad-ptr`, `multi-oom`, `syn-read`, and `syn-write` are the failures. The easiest one seems to be `read-bad-ptr`, so I will troubleshoot it first. The failure reason can be found in `src/userprog/build/tests/userprog/read-bad-ptr.result`, where a kernel panic occurs. It seems like we are reading some bad pointer.

To fix the issue in the read system call, I will add address checking for the buffer parameter.

```c
int read(int fd, void *buffer, unsigned int size){
  int result;
  uint8_t temp;
  if(fd<0 || fd==1 || fd>=FDTABLE_SIZE) { exit(-1); }
  /* new! */
  check_address(buffer);
  lock_acquire(&filesys_lock);
  if(fd==0){
    for(result=0; (result<size) && (temp=input_getc()); result++){
      *(uint8_t*)(buffer+result) = temp;
    }
  } else {
    struct file* f = process_get_file(fd);
    if(f==NULL){
      lock_release(&filesys_lock);
      exit(-1);
    }
    result = file_read(f, buffer, size);
  }
  lock_release(&filesys_lock);
  return result;
}
```

Similar address checks should also be performed for the buffer parameter in the write system call.

```c
int write(int fd, const void* buffer, unsigned int size){
  int file_write_result;
  struct file* f;
  if(fd<=0 || fd>=FDTABLE_SIZE) { exit(-1); }
  check_address(buffer);
  lock_acquire(&filesys_lock);
  if(fd==1){
    putbuf(buffer, size);
    lock_release(&filesys_lock);
    return size;
  } else {
    f = process_get_file(fd);
    if(f==NULL){
      lock_release(&filesys_lock);
      exit(-1);
    }
    file_write_result = file_write(f, buffer, size);
    lock_release(&filesys_lock);
    return file_write_result;
  }
}
```

Now this resolves the issue. Upon running make check again, the failing tests are reduced to `syn-read`, `syn-write`, and `multi-oom`.

## 4.2 syn-read and syn-write

Next, the `syn-read` test fails. Checking `src/userprog/build/tests/filesys/base/syn-read.result` reveals excessive loading operations resulting in many failures.

Reflecting on our previous implementation, we have not yet managed the waiting process for child processes. According to the presentation from Hanyang University, it states that the parent process must wait until the program of the created child process is loaded into memory. 

This makes perfect sense. If the parent process exits while the child process is loading, it can cause problems. Let’s implement semaphore handling to address this.

We previously added a semaphore for loaders during Project 1 within the thread structure. Thus, we will utilize it. The instructions for doing so are clearly outlined in the Hanyang University presentation.

First, let's correct the `exec` system call.

```c
pid_t exec(const char *cmd_line){
  tid_t tid;
  // Create the child process
  tid = process_execute(cmd_line);
  /* Wait for the child process to load properly before continuing */
  if(tid != -1){
    sema_down(&(get_child_process(tid)->load_sema));
  }
  return tid;
}
```

Next, we add the function for signaling that loading is complete when the memory has been fully loaded. This process occurs in the `start_process` function. Additionally, we will adjust the `load_flag` value as required by the Hanyang University presentation. 

The modified `start_process` function would look like this:

```c
static void
start_process (void *file_name_)
{
  char *file_name = file_name_;
  struct intr_frame if_;
  bool success;

  /* Initialize interrupt frame and load executable. */
  memset (&if_, 0, sizeof if_);
  if_.gs = if_.fs = if_.es = if_.ds = if_.ss = SEL_UDSEG;
  if_.cs = SEL_UCSEG;
  if_.eflags = FLAG_IF | FLAG_MBS;
  // Load the program into memory 
  success = load (file_name, &if_.eip, &if_.esp);
  /* Notify the parent process when loading is complete (using semaphore) */
  sema_up(&(thread_current()->load_sema));
  /* If loading failed, quit. */
  palloc_free_page (file_name);
  if (!success) {
    /* On load failure, exit with error */
    thread_current()->load_flag = false;
    thread_exit ();
  }
  /* On successful load, set flag to true */
  thread_current()->load_flag = true;

  /* Start the user process by simulating a return from an
     interrupt, implemented by intr_exit (in
     threads/intr-stubs.S). */
  asm volatile ("movl %0, %%esp; jmp intr_exit" : : "g" (&if_) : "memory");
  NOT_REACHED ();
}
```

Implementing these changes resolves the `syn-write` and `syn-read` tests as successful, confirming their proper execution. Only the `multi-oom` test remains.

## 4.3 multi-oom

Now, we turn to the last remaining test, `multi-oom`. First, we should check the results of the multi-oom test.

```
FAIL
run: crashed child should return -1: FAILED
```

It seems that the crash of the child process didn’t return -1 as expected, indicating something isn’t right. Let's refer back to the associated notes.

We should check if there are any child processes in the terminated state and utilize process_wait to retrieve failed processes. This follows the checks previously made for certain `load_flag` states signaling improper loads.

The modifications for `process_execute` are as follows:

```c
tid_t
process_execute (const char *file_name)
{
  char *fn_copy;
  tid_t tid;

  char file_name_copy[1000];
  char* parsed_file_name;
  char* save_ptr;
  struct list_elem* elem;
  struct thread* t;

  /* Make a copy of FILE_NAME.
     Otherwise there's a race between the caller and load(). */
  fn_copy = palloc_get_page (0);
  if (fn_copy == NULL)
    return TID_ERROR;
  strlcpy (fn_copy, file_name, PGSIZE);

  // Parse only the first word
  strlcpy(file_name_copy, file_name, strlen(file_name)+1);
  parsed_file_name = strtok_r(file_name_copy, " ", &save_ptr);

  if(filesys_open(parsed_file_name)==NULL){ return -1; }
  /* Create a new thread to execute FILE_NAME. */
  tid = thread_create (parsed_file_name, PRI_DEFAULT, start_process, fn_copy);
  if (tid == TID_ERROR)
    palloc_free_page (fn_copy);

  for(elem=list_begin(&thread_current()->child_threads); elem!=list_end(&thread_current()->child_threads); elem=list_next(elem)){
    t = list_entry(elem, struct thread, child_thread_elem);
    if(t->load_flag==false){
      return process_wait(tid);
    }
  }
  return tid;
}
```

Also, in the `start_process`, if the loading fails, instead of using `thread_exit()`, we utilize `exit(-1)` since the exit call will register the exit status, ensuring the parent processes can track them appropriately.

```c
// Some sections from start_process
// Load state flag for program
  success = load (file_name, &if_.eip, &if_.esp);
  /* Notify parent when loading is completed (using semaphore) */
  sema_up(&(thread_current()->load_sema));
  /* If loading fails, quit. */
  palloc_free_page (file_name);
  if (!success) {
    /* Mark that loading has failed */
    thread_current()->load_flag = false;
    exit(-1);  // this part is changed
  }
  /* Mark that loading has succeeded */
  thread_current()->load_flag = true;
```

Upon implementing these modifications, the `multi-oom` test should now pass, resulting in overall successful passing of all tests.

The test results are now as follows, with all tests being passed:

```
- Test results after make check
pass tests/userprog/args-none
pass tests/userprog/args-single
pass tests/userprog/args-multiple
pass tests/userprog/args-many
pass tests/userprog/args-dbl-space
pass tests/userprog/sc-bad-sp
pass tests/userprog/sc-bad-arg
pass tests/userprog/sc-boundary
pass tests/userprog/sc-boundary-2
pass tests/userprog/sc-boundary-3
pass tests/userprog/halt
pass tests/userprog/exit
pass tests/userprog/create-normal
pass tests/userprog/create-empty
pass tests/userprog/create-null
pass tests/userprog/create-bad-ptr
pass tests/userprog/create-long
pass tests/userprog/create-exists
pass tests/userprog/create-bound
pass tests/userprog/open-normal
pass tests/userprog/open-missing
pass tests/userprog/open-boundary
pass tests/userprog/open-empty
pass tests/userprog/open-null
pass tests/userprog/open-bad-ptr
pass tests/userprog/open-twice
pass tests/userprog/close-normal
pass tests/userprog/close-twice
pass tests/userprog/close-stdin
pass tests/userprog/close-stdout
pass tests/userprog/close-bad-fd
pass tests/userprog/read-normal
pass tests/userprog/read-bad-ptr
pass tests/userprog/read-boundary
pass tests/userprog/read-zero
pass tests/userprog/read-stdout
pass tests/userprog/read-bad-fd
pass tests/userprog/write-normal
pass tests/userprog/write-bad-ptr
pass tests/userprog/write-boundary
pass tests/userprog/write-zero
pass tests/userprog/write-stdin
pass tests/userprog/write-bad-fd
pass tests/userprog/exec-once
pass tests/userprog/exec-arg
pass tests/userprog/exec-bound
pass tests/userprog/exec-bound-2
pass tests/userprog/exec-bound-3
pass tests/userprog/exec-multiple
pass tests/userprog/exec-missing
pass tests/userprog/exec-bad-ptr
pass tests/userprog/wait-simple
pass tests/userprog/wait-twice
pass tests/userprog/wait-killed
pass tests/userprog/wait-bad-pid
pass tests/userprog/multi-recurse
pass tests/userprog/multi-child-fd
pass tests/userprog/rox-simple
pass tests/userprog/rox-child
pass tests/userprog/rox-multichild
pass tests/userprog/bad-read
pass tests/userprog/bad-write
pass tests/userprog/bad-read2
pass tests/userprog/bad-write2
pass tests/userprog/bad-jump
pass tests/userprog/bad-jump2
pass tests/userprog/no-vm/multi-oom
pass tests/filesys/base/lg-create
pass tests/filesys/base/lg-full
pass tests/filesys/base/lg-random
pass tests/filesys/base/lg-seq-block
pass tests/filesys/base/lg-seq-random
pass tests/filesys/base/sm-create
pass tests/filesys/base/sm-full
pass tests/filesys/base/sm-random
pass tests/filesys/base/sm-seq-block
pass tests/filesys/base/sm-seq-random
pass tests/filesys/base/syn-read
pass tests/filesys/base/syn-remove
pass tests/filesys/base/syn-write
All 80 tests passed.
```

```
make grade outcome
SUMMARY BY TEST SET

Test Set                                      Pts Max  % Ttl  % Max
--------------------------------------------- --- --- ------ ------
tests/userprog/Rubric.functionality           108/108  35.0%/ 35.0%
tests/userprog/Rubric.robustness               88/ 88  25.0%/ 25.0%
tests/userprog/no-vm/Rubric                     1/  1  10.0%/ 10.0%
tests/filesys/base/Rubric                      30/ 30  30.0%/ 30.0%
--------------------------------------------- --- --- ------ ------
Total                                                 100.0%/100.0%
```

Ah, I feel very good about this.... However, project three will soon come...