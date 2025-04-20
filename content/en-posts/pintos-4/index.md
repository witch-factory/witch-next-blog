---
title: Sogang University Pintos - Project 3
date: "2022-11-16T00:00:00Z"
description: "Pintos Project 3 - Threads"
tags: ["CS"]
---

# 1. Project Start

Another new project has emerged. It’s just the beginning... Let’s figure out what needs to be done.

Pintos is currently using a round-robin scheduler and does not consider the priority of each process or thread at all. Therefore, in this project, we need to implement an alarm, priority scheduling, and a BSD scheduler.

Let's review what has been provided.

## 1.1 Current Scheduler

How does the currently implemented round-robin scheduler work?

```c
// src/threads/thread.c
void
thread_yield (void)
{
  struct thread *cur = thread_current ();
  enum intr_level old_level;

  ASSERT (!intr_context ());
  old_level = intr_disable ();
  if (cur != idle_thread)
    list_push_back (&ready_list, &cur->elem);
  cur->status = THREAD_READY;
  schedule ();
  intr_set_level (old_level);
}
```

The currently running thread is placed at the end of the ready_list, and schedule() is called. schedule() executes the thread at the front of the ready_list. The functions used in this process are next_thread_to_run and switch_threads. This process repeats, executing the threads in the ready_list in order.

## 1.2 Current Alarm

timer_sleep is a function that makes the current thread wait for a specified number of ticks.

```c
void
timer_sleep (int64_t ticks)
{
  int64_t start = timer_ticks ();

  ASSERT (intr_get_level () == INTR_ON);
  while (timer_elapsed (start) < ticks)
    thread_yield ();
}
```

timer_ticks returns the number of ticks since the operating system started. The timer_elapsed function returns the number of ticks that have elapsed since start. In other words, the above function executes thread_yield until ticks amount of time passes. When the thread becomes running again, it returns to the ready state.

When the specified ticks have passed, it stops executing thread_yield and exits the function. This means the thread resumes execution.

Looking at how thread_yield works above, this function keeps putting the current thread at the end of the ready_list for ticks duration and executes other threads. Therefore, threads continuously oscillate between RUNNING and READY states. This is inefficient. Thus, one of the goals of this project is to improve this inefficiency.

# 2. Alarm Clock Improvement

How can we improve this? First, we will create a data structure called sleep_list to manage sleeping threads. This sleep_list stores the thread that calls timer_sleep and also saves wakeup_tick, the point at which the thread should resume execution. When the set wakeup_tick is reached, the thread should wake up.

To do this, we utilize the timer_interrupt function that is called every tick. Based on the current time, it puts back into the ready_list threads from the sleep_list whose wakeup_tick has been reached. The thread is then removed from the sleep_list.

To implement this, we first add `wakeup_tick` to the thread data structure.

```c
struct thread
  {
    /* Owned by thread.c. */
    tid_t tid;                          /* Thread identifier. */
    enum thread_status status;          /* Thread state. */
    char name[16];                      /* Name (for debugging purposes). */
    uint8_t *stack;                     /* Saved stack pointer. */
    int priority;                       /* Priority. */
    struct list_elem allelem;           /* List element for all threads list. */

    /* Shared between thread.c and synch.c. */
    struct list_elem elem;              /* List element. */

#ifdef USERPROG
    /* Owned by userprog/process.c. */
    uint32_t *pagedir;                  /* Page directory. */
    struct thread* parent_thread;
    struct list_elem child_thread_elem; /* Child list element */
    struct list child_threads;           /* Child list */
    bool load_flag;                     /* Process memory load flag */
    bool exit_flag;                     /* Process exit flag */
    struct semaphore exit_sema;         /* Exit semaphore for waiting child termination */
    struct semaphore load_sema;         /* Load semaphore for waiting child creation */
    struct semaphore remove_sema;       /* Semaphore left for removing the child from parent list */
    int exit_status;                    /* Exit status on exit call */
    struct file* fd_table[FDTABLE_SIZE]; /* File descriptor table */
    struct file* exec_file;             /* Currently executing file */
#endif
    // new!
    int64_t wakeup_tick;
    /* Owned by thread.c. */
    unsigned magic;                     /* Detects stack overflow. */
  };
```

Next, we create the sleep_list to store blocked threads.

```c
//src/threads/thread.c
// Manages threads in THREAD_BLOCKED state
static struct list sleep_list;
```

The reason it’s declared as a static variable is that static variables are stored in the thread's data area, created when the thread runs and destroyed when it terminates. This means the variable shares its fate with the thread.

Next, we initialize sleep_list in the thread_init function.

```c
//src/threads/thread.c
void
thread_init (void)
{
  ASSERT (intr_get_level () == INTR_OFF);

  lock_init (&tid_lock);
  list_init (&ready_list);
  list_init (&all_list);
  // new!
  list_init(&(sleep_list));

  /* Set up a thread structure for the running thread. */
  initial_thread = running_thread ();
  init_thread (initial_thread, "main", PRI_DEFAULT);
  initial_thread->status = THREAD_RUNNING;
  initial_thread->tid = allocate_tid ();
}
```

Then we declare the following functions in `src/threads/thread.h`.

```c
/* for project 3 Threads, alarm clock */
void thread_sleep(int64_t ticks);
void thread_awake(int64_t ticks);
```

Let’s implement these vital functions one by one.

## 2.1 thread_sleep

The thread_sleep function puts the currently running thread into a sleep state. It receives as an argument the number of ticks after which it should wake up.

The functions proceed as follows: disable interrupts -> save the current thread’s wakeup tick -> insert it into sleep_list -> change the current thread state to BLOCKED and invoke scheduling -> enable interrupts. This is done when the current thread is not idle.

```c
//src/threads/thread.c
// wakes up after ticks
void thread_sleep(int64_t ticks){
  struct thread* cur=thread_current();
  enum intr_level old_level;
  // Disable interrupts
  old_level=intr_disable();
  if(cur!=idle_thread){
    cur->status=THREAD_BLOCKED;
    // Set wakeup tick for after ticks duration
    cur->wakeup_tick=ticks;
    list_push_back(&sleep_list, &(cur->elem));
    schedule();
  }
  // Enable interrupts
  intr_set_level(old_level);
}
```

## 2.2 thread_awake

The thread_awake function wakes up threads from the sleep_list that need to awaken. It wakes threads whose wakeup_tick is less than the received ticks. During this process, it traverses the sleep_list and performs the removal operation, being careful of the order of list elements, so there is no need to increment to the next element if removal occurs.

```c
void thread_awake(int64_t ticks){
  struct list_elem* elem;
  struct thread* t;
  for(elem=list_begin(&(sleep_list)); elem!=list_end(&(sleep_list));){
    t=list_entry(elem, struct thread, elem);
    if(t->wakeup_tick<=ticks){
      elem=list_remove(elem);
      thread_unblock(t);
    }
    else{
      elem=list_next(elem);
    }
  }
}
```

## 2.3 Application

Replace the code that used the prior busy waiting in timer_sleep with the thread_sleep function.

```c
void
timer_sleep (int64_t ticks)
{
  int64_t start = timer_ticks ();

  ASSERT (intr_get_level () == INTR_ON);
  thread_sleep(start+ticks);
}
```

Also, since threads that reach wakeup_ticks need to be woken up, add the thread_awake function to the timer_interrupt function, which executes every tick.

```c
/* Timer interrupt handler. */
static void
timer_interrupt (struct intr_frame *args UNUSED)
{
  ticks++;
  thread_awake(ticks);
  thread_tick ();
}
```

Upon making this change in src/threads and attempting to compile? An error arises. The issue occurs in thread_exit code using exit_sema and remove_sema added in the user program's thread. We need to wrap these in #ifdef USERPROG #endif.

```c
// src/threads/thread.c
void
thread_exit (void)
{
  ASSERT (!intr_context ());

#ifdef USERPROG
  process_exit ();
  sema_up(&(thread_current()->exit_sema));
  sema_down(&(thread_current()->remove_sema));
#endif

  /* Remove thread from all threads list, set our status to dying,
     and schedule another process.  That process will destroy us
     when it calls thread_schedule_tail(). */
  intr_disable ();
  list_remove (&thread_current()->allelem);

  thread_current ()->status = THREAD_DYING;
  schedule ();
  NOT_REACHED ();
}
```

Now, passing the make check and running `pintos -v -- -q run alarm-multiple` shows that idle ticks have appeared. Initially, the idle tick was 0 since the thread occupied the CPU even in sleep state.

# 3. Priority Scheduling

The current round-robin scheduler needs to be transformed into a scheduler that considers thread priorities. If a new thread has a higher priority than the currently running thread, then the current thread should yield immediately. Also, if multiple threads are competing for a lock, the thread with the higher priority should acquire the lock. This applies equally to semaphores.

Priorities range from 0 to 63, with higher numbers indicating higher priority. Higher priority threads are executed first. The thread.h file also defines the following macros.

```c
/* Thread priorities. */
#define PRI_MIN 0                       /* Lowest priority. */
#define PRI_DEFAULT 31                  /* Default priority. */
#define PRI_MAX 63                      /* Highest priority. */
```

We will utilize existing functions to retrieve and change the priority of the current thread.

```c
// src/threads/thread.c
/* Sets the current thread's priority to NEW_PRIORITY. */
void
thread_set_priority (int new_priority)
{
  thread_current ()->priority = new_priority;
}

/* Returns the current thread's priority. */
int
thread_get_priority (void)
{
  return thread_current ()->priority;
}
```

Based on this and the provided slides from Hanyang University, we will implement priority scheduling step by step. 

## 3.1 thread_create

In thread_create, compare the priority of the current thread with the newly created thread. If the priority of the new thread is higher, add code to yield the current thread.

```c
tid_t
thread_create (const char *name, int priority,
               thread_func *function, void *aux)
{
  struct thread *t;
  struct kernel_thread_frame *kf;
  struct switch_entry_frame *ef;
  struct switch_threads_frame *sf;
  tid_t tid;

  ASSERT (function != NULL);

  /* Allocate thread. */
  t = palloc_get_page (PAL_ZERO);
  if (t == NULL)
    return TID_ERROR;

  /* Initialize thread. */
  init_thread (t, name, priority);
  tid = t->tid = allocate_tid ();

  /* Stack frame for kernel_thread(). */
  kf = alloc_frame (t, sizeof *kf);
  kf->eip = NULL;
  kf->function = function;
  kf->aux = aux;

  /* Stack frame for switch_entry(). */
  ef = alloc_frame (t, sizeof *ef);
  ef->eip = (void (*) (void)) kernel_thread;

  /* Stack frame for switch_threads(). */
  sf = alloc_frame (t, sizeof *sf);
  sf->eip = switch_entry;
  sf->ebp = 0;

  /* Add to run queue. */
  thread_unblock (t);
  /* Compare priorities with the currently running thread */
  if(thread_get_priority() < priority){
    thread_yield();
  }

  return tid;
}
```

## 3.2 thread_unblock

When a thread is unblocked, ensure it is inserted in order based on priorities. The higher priority thread should precede, using list_insert_ordered. Additionally, we will implement the comparison function `cmp_priority`.

```c
// Comparison based on priority
bool cmp_priority(const struct list_elem *a, const struct list_elem *b, void *aux UNUSED){
  struct thread *at, *bt;
  at=list_entry(a, struct thread, elem);
  bt=list_entry(b, struct thread, elem);
  return (at->priority) > (bt->priority);
}
```

And utilize this comparison function in the thread_unblock implementation.

```c
void
thread_unblock (struct thread *t)
{
  enum intr_level old_level;

  ASSERT (is_thread (t));

  old_level = intr_disable ();
  ASSERT (t->status == THREAD_BLOCKED);
  // Modify to use the comparison function
  list_insert_ordered(&ready_list, &(t->elem), cmp_priority, NULL);
  t->status = THREAD_READY;
  intr_set_level (old_level);
}
```

## 3.3 thread_yield

Modify thread_yield so that when the current thread yields the CPU, it is inserted based on the priority order. This also requires the use of list_insert_ordered along with the comparison function.

```c
void
thread_yield (void)
{
  struct thread *cur = thread_current ();
  enum intr_level old_level;

  ASSERT (!intr_context ());

  old_level = intr_disable ();
  if (cur != idle_thread) {
    // Modify to use the comparison function
    list_insert_ordered(&ready_list, &cur->elem, cmp_priority, NULL);
  }
  cur->status = THREAD_READY;
  schedule ();
  intr_set_level (old_level);
}
```

## 3.4 thread_set_priority

When changing priority, preemption should happen if the new priority set is higher than the currently running thread’s priority. 

This needs to be reflected in the modification of thread_set_priority.

```c
void
thread_set_priority (int new_priority)
{
  int p=thread_current ()->priority;
  thread_current ()->priority = new_priority;
  // If the current thread's priority is lowered, reschedule
  if(p > new_priority){
    thread_yield();
  }
}
```

Now, running make check reveals that alarm-priority, priority-fifo, and priority-preempt tests are passing successfully.

# 4. Priority Scheduling and Synchronization

There's still more to implement. As mentioned earlier, if multiple threads are competing for locks, the higher-priority thread should take the lock first, which applies equally to semaphores.

Currently, Pintos has a semaphore that maintains a waiters list for threads waiting on that semaphore. However, the current implementation manages the waiters' list using a simple FIFO method, regardless of priority. Let’s modify this so that higher-priority threads take precedence.

## 4.1 sema_down

In the existing sema_down function, the thread is inserted into the waiters list, and then it is blocked. Let's modify it so that it is inserted based on priority.

```c
void
sema_down (struct semaphore *sema)
{
  enum intr_level old_level;

  ASSERT (sema != NULL);
  ASSERT (!intr_context ());

  old_level = intr_disable ();
  while (sema->value == 0)
    {
      // Modify to insert based on priority
      list_insert_ordered(&sema->waiters, &thread_current ()->elem, cmp_priority, NULL);
      thread_block ();
    }
  sema->value--;
  intr_set_level (old_level);
}
```

## 4.2 sema_up

Since there's a possibility that priority has changed while the threads are in the waiters list, we also need to sort the list before unblocking a thread.

```c
void
sema_up (struct semaphore *sema)
{
  enum intr_level old_level;

  ASSERT (sema != NULL);

  old_level = intr_disable ();
  if (!list_empty (&sema->waiters)) {
    // new!
    list_sort(&sema->waiters, cmp_priority, NULL);
    thread_unblock (list_entry (list_pop_front (&sema->waiters),
                                struct thread, elem));
  }

  sema->value++;
  intr_set_level (old_level);
}
```

However, the slides from Hanyang University state that we need to implement priority preemption. This means we need to create the function test_max_priority in thread.c and add its prototype in thread.h.

```c
void test_max_priority (void)
{
  // Compare the highest priority thread in the ready_list with the current thread's priority
  // Essentially preemption (check that the ready_list is not empty)
  if(list_empty(&ready_list)){ return; }
  // Highest priority thread in the ready_list
  struct list_elem* e=list_front(&ready_list);
  struct thread *t=list_entry(e, struct thread, elem);
  // If the highest priority thread in the ready list has a higher priority, yield
  if(thread_get_priority() < t->priority){
    thread_yield();
  }
}
```

Now we can add this function to sema_up.

```c
void
sema_up (struct semaphore *sema)
{
  enum intr_level old_level;

  ASSERT (sema != NULL);

  old_level = intr_disable ();
  if (!list_empty (&sema->waiters)) {
    list_sort(&sema->waiters, cmp_priority, NULL);
    thread_unblock (list_entry (list_pop_front (&sema->waiters),
                                struct thread, elem));
  }

  sema->value++;
  // new!
  test_max_priority();
  intr_set_level (old_level);
}
```

Now, make check passes for priority_sema. Next, let’s proceed to priority_condvar, which is not listed in the scoring criteria from Sogang University, but it’s necessary for passing all tests. 

## 4.3 cmp_sem_priority

We need to sort the list of semaphores waiting for a specific condition variable by the highest priority of the waiting threads. We will define a comparison function for this and add its prototype in src/threads/synch.h.

```c
// src/threads/synch.h
bool cmp_sem_priority (const struct list_elem *a,
const struct list_elem *b,
void *aux);
```

The implementation is as follows.

```c
// src/threads/synch.c
/* Compares which has a higher priority among the waiters for two semaphores */
bool cmp_sem_priority (const struct list_elem *a, const struct list_elem *b, void *aux){
  struct semaphore_elem *sa = list_entry(a, struct semaphore_elem, elem);
  struct semaphore_elem *sb = list_entry(b, struct semaphore_elem, elem);
  struct list_elem *la=list_front(&(sa->semaphore.waiters));
  struct list_elem *lb=list_front(&(sb->semaphore.waiters));
  // The highest-priority thread among the waiters for each semaphore
  struct thread *ta=list_entry(la, struct thread, elem);
  struct thread *tb=list_entry(lb, struct thread, elem);
  return ta->priority > tb->priority;
}
```

## 4.4 cond_wait

In accord with the instructions from Hanyang University, we’ll adjust so that the condition variable's waiters list is inserted in order by priority.

Change the implementation from list_push_back to list_insert_ordered.

```c
void
cond_wait (struct condition *cond, struct lock *lock)
{
  struct semaphore_elem waiter;

  ASSERT (cond != NULL);
  ASSERT (lock != NULL);
  ASSERT (!intr_context ());
  ASSERT (lock_held_by_current_thread (lock));

  sema_init (&waiter.semaphore, 0);
  // Change from list_push_back to list_insert_ordered
  list_insert_ordered(&cond->waiters, &waiter.elem, cmp_sem_priority, NULL);
  lock_release (lock);
  sema_down (&waiter.semaphore);
  lock_acquire (lock);
}
```

## 4.5 cond_signal

Similar to above, we should re-sort the condition variable's waiters list by priority in case the priorities of waiting threads have changed.

```c
void
cond_signal (struct condition *cond, struct lock *lock UNUSED)
{
  ASSERT (cond != NULL);
  ASSERT (lock != NULL);
  ASSERT (!intr_context ());
  ASSERT (lock_held_by_current_thread (lock));

  if (!list_empty (&cond->waiters)) {
    // new!
    list_sort(&cond->waiters, cmp_sem_priority, NULL);
    sema_up (&list_entry (list_pop_front (&cond->waiters),
                          struct semaphore_elem, elem)->semaphore);
  }
}
```

## 4.6 Debugging

However, we encountered a kernel panic in priority_condvar during assertion for list_empty(list). This suggests a failure in some part of our implementation. One thing that stands out is the lack of handling for an empty ready list during the priority preemption checks. Since we didn’t have it when we used test_max_priority, we will revise our implementation to use test_max_priority everywhere in the preemption.

First, we update the thread_created function to call test_max_priority.

```c
tid_t
thread_create (const char *name, int priority,
               thread_func *function, void *aux)
{
  struct thread *t;
  struct kernel_thread_frame *kf;
  struct switch_entry_frame *ef;
  struct switch_threads_frame *sf;
  tid_t tid;

  ASSERT (function != NULL);

  /* Allocate thread. */
  t = palloc_get_page (PAL_ZERO);
  if (t == NULL)
    return TID_ERROR;

  /* Initialize thread. */
  init_thread (t, name, priority);
  tid = t->tid = allocate_tid ();

  /* Stack frame for kernel_thread(). */
  kf = alloc_frame (t, sizeof *kf);
  kf->eip = NULL;
  kf->function = function;
  kf->aux = aux;

  /* Stack frame for switch_entry(). */
  ef = alloc_frame (t, sizeof *ef);
  ef->eip = (void (*) (void)) kernel_thread;

  /* Stack frame for switch_threads(). */
  sf = alloc_frame (t, sizeof *sf);
  sf->eip = switch_entry;
  sf->ebp = 0;

  /* Add to run queue. */
  thread_unblock (t);
  /* Modified */
  test_max_priority();

  return tid;
}
```

We also use test_max_priority in thread_set_priority.

```c
void
thread_set_priority (int new_priority)
{
  thread_current ()->priority = new_priority;
  // Trigger rescheduling
  test_max_priority();
}
```

Now running make check results in successful passing for priority_condvar tests.

# 5. Priority Aging

Basic priority scheduling can lead to starvation for processes with lower priorities. One way to address this issue is through aging. Let's implement aging.

First, let’s add the following to src/threads/thread.h.

```c
/* Project #3. */
#ifndef USERPROG
extern bool thread_prior_aging;
#endif
```

Now add this to src/threads/thread.c.

```c
/* Project #3. */
#ifndef USERPROG
bool thread_prior_aging;
#endif
```

Modify the thread_tick function.

```c
void
thread_tick (void)
{
  struct thread *t = thread_current ();

  /* Update statistics. */
  if (t == idle_thread)
    idle_ticks++;
#ifdef USERPROG
  else if (t->pagedir != NULL)
    user_ticks++;
#endif
  else
    kernel_ticks++;

  /* Enforce preemption. */
  if (++thread_ticks >= TIME_SLICE)
    intr_yield_on_return ();

#ifndef USERPROG
  if(thread_prior_aging == true){
    thread_aging();
  }
#endif
}
```

Add the following to the parse_options function in src/threads/init.c.

```c
#ifndef USERPROG
  else if (!strcmp (name, "-aging"))
    thread_prior_aging = true;
#endif
```

Now extract the provided thread_tests.tar and replace src/tests/threads with its contents. This can be easily handled with FTP.

With these changes, the thread_tick function invokes thread_aging each tick if the thread_prior_aging is true. 

Let’s implement thread_aging, which will simply increment the priority of all threads by 1 every tick. We will also need to add the prototype for this function in src/threads/thread.h.

```c
// src/threads/thread.c
void thread_aging(void){
  struct thread *t;
  struct list_elem* elem;

  for(elem=list_begin(&all_list); elem!=list_end(&all_list); elem=list_next(elem)){
    t=list_entry(elem, struct thread, allelem);
    t->priority++;
    if(t->priority > PRI_MAX){ t->priority = PRI_MAX; }
    if(t->priority < PRI_MIN){ t->priority = PRI_MIN; }
  }
}
```

This function will be called every tick through thread_tick, effectively implementing priority aging. After implementing this function, running make check will pass the priority-aging tests.

![aging-pass](./aging-pass.png)

# 6. BSD Scheduler

Implementing the BSD scheduler can yield bonus points for this project. BSD scheduling can be achieved using a multi-level feedback queue. Each priority uses its own ready queue, scheduled in order of priority, applying round-robin within the respective queue. 

In this setup, the priority is initialized upon thread creation and recalibrated every 4 ticks. The calculation formula is as follows:

$priority = PRI\_MAX - (recent\_cpu / 4) - (nice * 2)$

Several variables here may be unfamiliar. PRI_MAX denotes the maximum priority, but what are the others?

The `nice` value of a thread ranges from -20 to 20; a positive nice decreases priority, while a negative number increases it. Essentially, threads with higher nice values yield more CPU to others. Newly created threads start with a nice value of 0 and inherit the parent’s nice if one exists.

`recent_cpu` tracks the recent CPU usage of a thread, initialized at 0 for new threads and inherited from the parent if applicable. This value is updated each interrupt with the following formula:

$recent\_cpu = (2 * load\_avg) / (2 * load\_avg + 1) * recent\_cpu + nice$

The `load_avg` calculates the average number of processes ready for execution over the last minute, updated each tick as follows:

$load\_avg = (59/60) * load\_avg + (1/60) * ready\_threads$

Here, `ready_threads` represents the number of threads currently in the ready or running state (i.e., the total of running threads and those in ready_list). 

However, there is a complication: priority, nice, and ready_threads are integers, while recent_cpu and load_avg are floating-point numbers, but Pintos doesn’t support floating-point operations in the kernel. Hence, these must be represented as fixed-point numbers.

To implement this, we define fixed-point operations in the new file src/threads/fixed-point.h.

```c
#define F (1 << 14) // Fixed point 1
#define INT_MAX ((1 << 31) - 1)
#define INT_MIN (-(1 << 31))
// x and y denote fixed_point numbers in 17.14 format
// n is an integer

int int_to_fp(int n); /* Convert integer to fixed point */
int fp_to_int_round(int x); /* Convert FP to int (rounding) */
int fp_to_int(int x); /* Convert FP to int (floor) */
int add_fp(int x, int y); /* Addition of FP */
int add_mixed(int x, int n); /* Addition of FP and int */
int sub_fp(int x, int y); /* Subtraction of FP (x-y) */
int sub_mixed(int x, int n); /* Subtraction of FP and int (x-n) */
int mult_fp(int x, int y); /* Multiplication of FP */
int mult_mixed(int x, int n); /* Multiplication of FP and int */
int div_fp(int x, int y); /* Division of FP (x/y) */
int div_mixed(int x, int n); /* Division of FP and int (x/n) */
```

Let’s now implement these functions. Fortunately, we have the complete methods provided by the slides from Hanyang University.

```c
int int_to_fp(int n){
  return n * F;
}

/* Convert FP to int (rounding) */
int fp_to_int_round(int x){
  if(x >= 0){
    return (x + F / 2) / F;
  }
  return (x - F / 2) / F;
}

/* Convert FP to int (floor) */
int fp_to_int(int x){
  return x / F;
}

int add_fp(int x, int y){
  return x + y;
}

/* Addition of FP and int */
int add_mixed(int x, int n){
  return x + int_to_fp(n);
}

/* Subtraction of FP (x-y) */
int sub_fp(int x, int y){
  return x - y;
}

/* Subtraction of FP and int (x-n) */
int sub_mixed(int x, int n){
  return x - int_to_fp(n);
}

int mult_fp(int x, int y){
  return ((int64_t)x * y / F);
}

int mult_mixed(int x, int n){
  return x * n;
}

int div_fp(int x, int y){
  return ((int64_t) x) * F / y;
}

/* Division of FP and int (x/n) */
int div_mixed(int x, int n){
  return x / n;
}
```

## 6.1 Scheduler Implementation

First, we will add variables for the scheduler within the thread structure, including nice and recent_cpu.

```c
struct thread
  {
    /* Owned by thread.c. */
    tid_t tid;                          /* Thread identifier. */
    enum thread_status status;          /* Thread state. */
    char name[16];                      /* Name (for debugging purposes). */
    uint8_t *stack;                     /* Saved stack pointer. */
    int priority;                       /* Priority. */
    struct list_elem allelem;           /* List element for all threads list. */

    /* Shared between thread.c and synch.c. */
    struct list_elem elem;              /* List element. */

#ifdef USERPROG
    /* Owned by userprog/process.c. */
    uint32_t *pagedir;                  /* Page directory. */
    struct thread* parent_thread;       /* Parent process descriptor */
    struct list_elem child_thread_elem; /* Child list element */
    struct list child_threads;           /* Child list */
    bool load_flag;                     /* Process memory load flag */
    bool exit_flag;                     /* Process exit flag */
    struct semaphore exit_sema;         /* Exit semaphore for waiting child termination */
    struct semaphore load_sema;         /* Load semaphore for waiting child creation */
    struct semaphore remove_sema;       /* Semaphore left for removing the child from parent list */
    int exit_status;                    /* Exit status on exit call */
    struct file* fd_table[FDTABLE_SIZE]; /* File descriptor table */
    struct file* exec_file;             /* Currently executing file */
#endif
    int64_t wakeup_tick;
    // new!
    int nice;
    int recent_cpu;
    /* Owned by thread.c. */
    unsigned magic;                     /* Detects stack overflow. */
  };
```

We will also include this in thread.c.

```c
#include "threads/fixed_point.h"

#define NICE_DEFAULT 0
#define RECENT_CPU_DEFAULT 0
#define LOAD_AVG_DEFAULT 0

int load_avg;
```

Using these definitions, we will initialize values during thread creation. The nice and recent_cpu values will be 0 for the initial thread and inherited from the parent for subsequent threads. Therefore, we set parameters only for the initial thread during its initialization in the thread_init function.

```c
// src/threads/thread.c
void
thread_init (void)
{
  ASSERT (intr_get_level () == INTR_OFF);

  lock_init (&tid_lock);
  list_init (&ready_list);
  list_init (&all_list);

  list_init(&(sleep_list));

  /* Set up a thread structure for the running thread. */
  initial_thread = running_thread ();
  init_thread (initial_thread, "main", PRI_DEFAULT);
  initial_thread->status = THREAD_RUNNING;
  initial_thread->tid = allocate_tid ();
  // new!
  initial_thread->nice = NICE_DEFAULT;
  initial_thread->recent_cpu = RECENT_CPU_DEFAULT;
}
```

Now, initialize load_avg in the thread_start function.

```c
void
thread_start (void)
{
  /* Create the idle thread. */
  struct semaphore idle_started;
  sema_init (&idle_started, 0);
  thread_create ("idle", PRI_MIN, idle, &idle_started);

  // new! Initialize the load average.
  load_avg = LOAD_AVG_DEFAULT;
  /* Start preemptive thread scheduling. */
  intr_enable ();

  /* Wait for the idle thread to initialize idle_thread. */
  sema_down (&idle_started);
}
```

## 6.2 BSD Scheduling Implementation

With the necessary variables defined, we will perform the following steps for BSD scheduling.

After much reference to various blogs and the slides, I learned that we primarily need to focus on what's given there. Hence, we'll perform only the following tasks regarding the scheduler’s implementation without unnecessary additions.

1. Update the load_avg every second. A second is defined through TIMER_FREQ.
2. Update the recent_cpu every second.
3. Update the priority every 4 ticks.
4. Implement preemption based on the updated priorities.

Let’s implement these steps one by one. Pay attention to whether a value is a float or an integer while implementing the updates. 

### 6.2.1 Load Average Update

Let’s implement the function to update load_avg. The updating formula is as follows:

$load\_avg = \frac{59}{60} \times load\_avg + \frac{1}{60} \times ready\_threads$

The implementation is straightforward.

```c
void mlfqs_load_avg (void){
  int left, right;
  int ready_threads=list_size(&ready_list);
  if(thread_current() != idle_thread){ ready_threads++; }
  left = div_fp(int_to_fp(59), int_to_fp(60));
  left = mult_fp(left, load_avg);
  right = div_fp(int_to_fp(1), int_to_fp(60));
  // ready_threads is an integer
  right = mult_mixed(right, ready_threads);
  load_avg = add_fp(left, right);
}
```

### 6.2.2 Recent CPU Update

Now, let’s implement the function to update recent_cpu. Recent_cpu has to:

1. Increment the running thread’s recent_cpu by 1.
2. Update using the formula given.

$recent\_cpu = \frac{2 \times load\_avg}{2 \times load\_avg + 1} \times recent\_cpu + nice$

First, implement the part that increments recent_cpu for the running thread, considering that idle threads do not update this value.

```c
// Increase the current thread's recent_cpu value by 1
void mlfqs_increment (void){
  struct thread* cur=thread_current();
  if(cur == idle_thread){ return; }
  cur->recent_cpu = add_mixed(cur->recent_cpu, 1);
}
```

Now, implement another function that updates the recent_cpu for the specified thread according to the formula.

```c
// src/threads/thread.c
/* Calculate recent_cpu for the given thread */
void mlfqs_recent_cpu (struct thread *t){
  if(t==idle_thread){ return; }
  int temp_mult = mult_mixed(load_avg, 2);
  int temp = div_fp(temp_mult, add_mixed(temp_mult, 1));
  temp = mult_fp(temp, t->recent_cpu);
  // nice is an integer
  temp = add_mixed(temp, t->nice);
  t->recent_cpu = temp;
}
```

Next, create a function to update recent_cpu for all threads.

```c
void mlfqs_recalc_recent_cpu(void){
  struct list_elem* e;
  struct thread* t;
  for(e=list_begin(&all_list); e!=list_end(&all_list); e=list_next(e)){
    t=list_entry(e, struct thread, allelem);
    mlfqs_recent_cpu(t);
  }
}
```

### 6.2.3 Priority Update

Let’s implement the function that updates the priority. The priority is updated using the formula:

$priority = PRI\_MAX - \left( \frac{recent\_cpu}{4} \right) - \left( {nice} \times {2} \right)$

We will implement this for the specified thread.

```c
// Recalculate the priority for the specified thread
void mlfqs_priority (struct thread *t){
  if(t==idle_thread){ return; }
  int temp = add_fp(int_to_fp(PRI_MAX), div_mixed(t->recent_cpu, -4));
  temp = add_fp(temp, int_to_fp(-2 * t->nice));
  t->priority = fp_to_int(temp);
  if (t->priority > PRI_MAX) { t->priority = PRI_MAX; }
  if (t->priority < PRI_MIN) { t->priority = PRI_MIN; }
}
```

We now need to implement a function to update the priority for all threads, while also incorporating preemption for scenarios where threading priority changes.

```c
void mlfqs_recalc_priority(void){
  struct list_elem* e;
  struct thread* t;
  for(e=list_begin(&all_list); e!=list_end(&all_list); e=list_next(e)){
    t=list_entry(e, struct thread, allelem);
    mlfqs_priority(t);
  }

  if(list_empty(&ready_list)){ return; }
  // Highest priority thread in the ready_list
  e = list_front(&ready_list);
  t = list_entry(e, struct thread, elem);
  // If the highest priority thread in the ready list has a higher priority, preempt
  if(thread_get_priority() < t->priority){
    intr_yield_on_return(); // Use this for yielding in case of interrupts
  }
}
```

### 6.2.4 Tick Updates

Now, we will implement a function that performs the aforementioned updates with each tick. We update `load_avg` and `recent_cpu` every second and update priorities every 4 ticks. Additionally, every tick increments the recent_cpu of the currently running thread by 1.

```c
// src/threads/thread.c
void thread_mlfqs_tick(void){
  int64_t ticks = timer_ticks();

  mlfqs_increment();
  if(ticks % TIMER_FREQ == 0){
    mlfqs_load_avg();
    mlfqs_recalc_recent_cpu();
  }
  if(ticks % TIME_SLICE == 0){
    mlfqs_recalc_priority();
  }
}
```

Now update the thread_tick statement to invoke this function only in mlfqs mode.

```c
// src/threads/thread.c
void
thread_tick (void)
{
  struct thread *t = thread_current ();

  /* Update statistics. */
  if (t == idle_thread)
    idle_ticks++;
#ifdef USERPROG
  else if (t->pagedir != NULL)
    user_ticks++;
#endif
  else
    kernel_ticks++;

  /* Enforce preemption. */
  if (++thread_ticks >= TIME_SLICE)
    intr_yield_on_return ();

  if(thread_prior_aging == true){
    thread_aging();
  }
  // new!
  if(thread_mlfqs == true){
    thread_mlfqs_tick();
  }
}
```

### 6.2.5 Remaining Function Requirements

Additionally, there are some functions that the slides indicate are required.

```c
int thread_get_nice (void);
void thread_set_nice (int);
int thread_get_recent_cpu (void);
int thread_get_load_avg (void);
```

Add the prototypes of these functions to `src/threads/thread.h` and their implementations in `src/threads/thread.c`. According to the slides, we must deactivate interrupts for these functions, but we can implement them without that complication since they work as required.

The thread_get_nice function is simply a getter.

```c
/* Returns the current thread's nice value. */
int
thread_get_nice (void)
{
  return thread_current()->nice;
}
```

For thread_set_nice, we change the current thread's nice value and recalculate the priority.

```c
/* Sets the current thread's nice value to NICE. */
void
thread_set_nice (int nice UNUSED)
{
  // Project 3 implementation
  thread_current()->nice = nice;
  // Recalculate priority
  mlfqs_priority(thread_current());
  // Handle preemption
  test_max_priority();
}
```

The thread_get_recent_cpu is another simple getter function.

```c
/* Returns 100 times the current thread's recent_cpu value. */
int
thread_get_recent_cpu (void)
{
  int temp_recent_cpu = fp_to_int_round(mult_mixed(thread_current()->recent_cpu, 100));
  return temp_recent_cpu;
}
```

Similarly, implement the thread_get_load_avg function.

```c
/* Returns 100 times the system load average. */
int
thread_get_load_avg (void)
{
  int temp_load_avg;
  temp_load_avg = fp_to_int_round(mult_mixed(load_avg, 100));
  return temp_load_avg;
}
```

Once everything is complete, let’s run make check. The mlfqs test series will take quite some time. Be prepared to wait.

If you’ve followed this process and notice that some mlfqs tests pass while others fail, check meticulously whether you confused integers and floating-point values during the implementation of calculations. For instance, ensure that negative values should also be treated correctly as floats when using the mult_mixed function.

After going through all these implementations, the mlfqs tests are passing successfully, fulfilling all the requirements from Sogang University!

![mlfqs-pass](./proj3-pass.png)

Next, I will review the tests that failed in priority scheduling, particularly concerning the priority-donate series, as well as implement virtual memory. 

# References

Naver Blog by a senior [link](https://m.blog.naver.com/adobeillustrator/220546339744)

Hanyang University Pintos Slides [link](https://oslab.kaist.ac.kr/wp-content/uploads/esos_files/courseware/undergraduate/PINTOS/Pintos_all.pdf)

Implementation of the cmp_sem_priority function [link](https://renelemon.tistory.com/99)

Reference for implementing the BSD scheduler [link](https://for-development.tistory.com/21)

Pintos Manual [link](https://web.stanford.edu/class/cs140/projects/pintos/pintos.pdf)