---
title: Computer Chronicle, One Step Further - 1. Turing Machine
date: "2025-07-06T00:00:00Z"
description: "From undecidability in mathematics to the birth of computer theory, from diagonalization to the Turing machine"
tags: ["history", "computer"]
---

# Getting Started

I’ve been unpacking stories from the history of computers across several posts. The stories of the people I discovered while researching were moving. But they were not enough to understand how computers could actually be conceived and built in theoretical terms. In fact, early on in researching the history of computers, one question kept coming back to me.

**So how, exactly, is a computer made and structured?**

As I researched, I found at least part of an answer. So based on what I learned while preparing the computer history series, I decided to go one step deeper and write about it. About how computers could really be constructed. Unlike the more narrative historical posts, I didn’t focus as much on smooth transitions here. You can think of this as a set of posts that dig further into individual topics such as the Turing machine and the implementation of logic circuits.

I think this will read most smoothly if you already know the basics of logic gates and circuit construction, along with the kind of mathematical proofs typically covered in a second- or third-year computer science curriculum.

Of course, there are parts I’ve omitted even if they matter in real computers, especially optimization details. I’m not a core computer systems developer—in fact, I’m about as far from that domain as you can get, just an ordinary frontend developer—so there are limits to how deep I can go. If you want more detail, the books listed in the references or the original papers by the relevant researchers are good places to continue.

Enough disclaimers. In this post, I’ll look at how the "Turing machine," the theoretical foundation of the computer, came to be formulated.

# Diagonalization

> No one shall expel us from the paradise that Cantor has created.
>
> David Hilbert, "Über das Unendliche", Mathematische Annalen 95, 1926

One of the major milestones leading to the idea of the computer was Cantor’s diagonal argument. It begins with thinking about infinite sets, and at first glance it seems completely unrelated to computers. But Alan Turing later used it to prove that even a universal Turing machine cannot decide certain problems. So let’s start with Cantor’s diagonal argument.

## Comparing the sizes of sets and infinity

Suppose we define a "set" as a collection of objects satisfying some condition. Then how do we compare the sizes of two sets? For example, the sets $\{Red, Green, Blue\}$ and $\{1, 2, 3\}$ contain different elements, but both clearly have size 3. How do we express that precisely in mathematics?

We can do it by requiring that there be a one-to-one correspondence between the elements of the two sets. If every element in one set can be paired with exactly one distinct element in the other, with nothing left over, then the two sets have the same size. For example, in the sets $\{Red, Green, Blue\}$ and $\{1, 2, 3\}$, we can match $1$ with $Red$, $2$ with $Green$, and $3$ with $Blue$, so the two sets have the same size.

That feels intuitive. But what happens if we apply the same idea to sets with infinitely many elements? For example, consider the set of natural numbers and the set of even numbers. For any natural number $n$, we can pair it with the even number $2n$. So there is a one-to-one correspondence between the natural numbers and the even numbers, which means the two sets have the same size. How does that feel? Is it still intuitive?

Logically it is clearly correct, but it does not feel intuitive. If the natural numbers and the even numbers have the same size, then where did all the odd numbers go? Nineteenth-century mathematicians struggled with this too. Since Euclid, it had been widely accepted that the whole is larger than a proper part. So before Cantor, many mathematicians thought the size of an infinite set was inconsistent as a concept and impossible to count meaningfully.

## Cantor’s courage

Georg Cantor, a German-Russian mathematician born in 1845, began his academic career as an unpaid lecturer at the University of Halle. At the time, most mathematicians started the same way, so they needed patronage or some other source of funding made possible by notable achievements.

Around that time, the prominent mathematician Eduard Heine recognized Cantor’s talent and encouraged him to study trigonometric series—an infinite series involving trigonometric functions. That led Cantor into research on infinity.

As Cantor worked on these topics, he too ran into the counterintuitive properties of infinite sets mentioned above. The natural numbers and the even numbers are the same size? Earlier mathematicians who encountered this kind of difficulty had largely given up on handling infinity rigorously.

But Cantor chose the path that went against intuition. He argued that if two sets admit a one-to-one correspondence, then they have the same size even in the case of infinite sets, and therefore the natural numbers and the even numbers do indeed have the same size.

He then went on to prove that one-to-one correspondences also exist between the natural numbers and several other sets of numbers. There are one-to-one correspondences between the natural numbers and the integers, the rational numbers, and the algebraic numbers (numbers that are roots of algebraic equations). In other words, all of these sets have the same size. For the details and rigor of these proofs, see pages 86–87 of "오늘날 우리는 컴퓨터라 부른다" and the [Schröder–Bernstein theorem](https://en.wikipedia.org/wiki/Schr%C3%B6der%E2%80%93Bernstein_theorem).

Naturally, Cantor then turned to the set of real numbers. Is there also a one-to-one correspondence between the natural numbers and the real numbers? No—and the method Cantor used to prove this is diagonalization.

## The idea of diagonalization

Then how do we know that one set is larger than another? We prove that no matter how we try to pair their elements, no one-to-one correspondence exists. For example, if we assign each element of a set $A$ to an element of a set $B$ one by one and there are still elements left over in $B$, then $B$ is larger than $A$.

Cantor used this to prove that the set of real numbers is larger than the set of natural numbers. To do that, he showed that the real numbers in the interval $(0,1)$ cannot be put into one-to-one correspondence with the natural numbers.

This works because $(0,1)$ itself can be put into one-to-one correspondence with the set of all real numbers $\mathbb{R}$. We can see this by defining a function $f : (0, 1) \to \mathbb{R}$ as follows.

$$
f(x) = \tan\left(\pi x - \frac{\pi}{2}\right)
$$

Now suppose there exists a function $f: \mathbb{N} \to (0, 1)$ that pairs the real numbers in $(0,1)$ one-to-one with the natural numbers. Then for each $n$, $f(n)$ can be written as follows, where $a_{ij}$ is an integer between 0 and 9.


$f(1) = 0.a_{11}a_{12}a_{13}a_{14}\cdots$

$f(2) = 0.a_{21}a_{22}a_{23}a_{24}\cdots$

$f(3) = 0.a_{31}a_{32}a_{33}a_{34}\cdots$

$\vdots$

$f(n) = 0.a_{n1}a_{n2}a_{n3}a_{n4}\cdots$

$\vdots$

Then we can define a real number $x$ as follows: make it differ from each $f(n)$ in the $n$th digit after the decimal point. There are many ways to construct such a number, but let its $n$th digit after the decimal point be $(a_{nn} + 1) \mod 10$. For example, 1 becomes 2, 2 becomes 3, ..., and 9 becomes 0. If we call the $i$th digit after the decimal point $d_i$, we can write it like this.

|       | $d_1$      | $d_2$      | $d_3$      | $d_4$      | $d_5$      | $\cdots$      |
|-------|--------|--------|--------|--------|--------|--------|
| $f(1)$  | $\textcolor{red}{a_{11}}$   | $a_{12}$    | $a_{13}$    | $a_{14}$    | $a_{15}$    | $\cdots$       |
| $f(2)$  | $a_{21}$    | $\textcolor{red}{a_{22}}$  | $a_{23}$    | $a_{24}$    | $a_{25}$    | $\cdots$       |
| $f(3)$  | $a_{31}$    | $a_{32}$    | $\textcolor{red}{a_{33}}$    | $a_{34}$    | $a_{35}$    | $\cdots$       |
| $f(4)$  | $a_{41}$    | $a_{42}$    | $a_{43}$    | $\textcolor{red}{a_{44}}$    | $a_{45}$    | $\cdots$       |
| $f(5)$  | $a_{51}$    | $a_{52}$    | $a_{53}$    | $a_{54}$    | $\textcolor{red}{a_{55}}$    | $\cdots$       |
| $\vdots$     | $\vdots$      | $\vdots$      | $\vdots$      | $\vdots$      | $\vdots$      | $\ddots$      |
| $x$     | $(a_{11}+1) \% 10$ | $(a_{22}+1) \% 10$ | $(a_{33}+1) \% 10$ | $(a_{44}+1) \% 10$ | $(a_{55}+1) \% 10$ | $\cdots$ |

Then for every natural number $n$, this $x$ differs from $f(n)$ in the $n$th digit after the decimal point. We assumed there was a one-to-one correspondence between the natural numbers and the real numbers in $(0,1)$, so $x$ should be equal to $f(m)$ for some natural number $m$—but it is not. That is a contradiction. Therefore, there is no one-to-one correspondence between the natural numbers and the real numbers in $(0,1)$.

So the set of real numbers in the interval $(0,1)$ is larger than the set of natural numbers. And since the set of real numbers in $(0,1)$ has a one-to-one correspondence with the full set of real numbers, the set of real numbers is larger than the set of natural numbers.

There is one minor issue here. Some rational numbers can be written in two different ways. For example, $0.10000\cdots$ and $0.09999\cdots$ both represent the same rational number, $1/10$. But this can be worked around using the fact that the set of all rational numbers also has a one-to-one correspondence with the natural numbers.

# Incompleteness Theorem

> Young man, in mathematics you don't understand things. You just get used to them.
>
> [John von Neumann](https://www.mathrecreation.com/2010/01/most-loved-and-hated-theorem.html?utm_source=chatgpt.com)

## Mathematicians’ dream

In the early 20th century, Hilbert and other mathematicians wanted to establish mathematics as a complete system in itself. They wanted mathematics to be expressed in a well-defined symbolic language: inside the language, each step of reasoning would be crystal clear as mathematics with meaning attached, while from outside the language it could be treated entirely as the mechanical manipulation of formulas and symbols—and still remain contradiction-free.

Here is a simple example of what it means for a system to be complete through symbol manipulation alone.

Suppose the proposition $A \implies B$ is true. And suppose I learn that $A$ is true. Then I can conclude that $B$ is also true. This does not depend on what $A$ and $B$ actually mean.

Later I may discover that $A$ meant "$x$ is even" and $B$ meant "$x$ is divisible by 2." I used the facts that $A$ is true and that $A \implies B$ to conclude that $B$—that is, "$x$ is divisible by 2"—is true. But I did not need to know the meanings of $A$ and $B$ in order to make that inference. I could derive it purely by manipulating symbols according to rules.

Inside mathematics, these propositions carry meaning, but from outside the system we can infer new facts just by symbol manipulation. And the same would be true no matter what $A$ and $B$ meant. Even if $A$ were the axiom of choice and $B$ were the Banach–Tarski paradox (a classic counterintuitive consequence of the axiom of choice stating that one sphere can be cut into finitely many pieces and reassembled into two spheres of the same size; the precise mathematics is not important here), if we knew that $A$ was true and that $A \implies B$, then we could still conclude that $B$ is true without understanding either concept at all.

This was the dream mathematicians pursued: to build mathematics as a system in which all of its elements could be represented in this way and manipulated without contradiction. Out of that effort came systems such as Whitehead and Russell’s *Principia Mathematica* and Peano arithmetic. At the 1928 International Congress of Mathematicians, Hilbert called for a proof of the completeness of Peano arithmetic.

## Gödel’s proof

Two years later, in 1931, Kurt Gödel published "On Formally Undecidable Propositions of Principia Mathematica and Related Systems," resolving the issue—but not in the direction Hilbert wanted. Gödel’s paper shook Hilbert’s entire program. Setting aside that shock for a moment, let’s look at how Gödel’s proof—the step immediately preceding the Turing machine—actually works.

Gödel used somewhat different techniques, such as converting symbols into integers by exploiting the uniqueness of prime factorization rather than the decimal-style encoding I’ll use below. If needed, you can look up [Gödel numbering](https://en.wikipedia.org/wiki/G%C3%B6del_numbering). But since the goal here is not to follow Gödel’s original proof exactly, I’ll explain it in a more unpacked form based on Martin Davis’s "오늘날 우리는 컴퓨터라 부른다".

Attempts to build mathematics as a logical system aimed to express every element of mathematics using a finite set of symbols. They then defined rules for manipulating those symbols so that, from outside the system, mathematics could be handled entirely through those rule-based symbol manipulations.

For example, Peano Arithmetic (PA) consists of just the following 16 symbols. (Different documents may use somewhat different symbol sets, but that is not important in this context.)

$$
\begin{align*}
\supset \; \neg \; \land \; \lor \; \forall \; \exists \; 1 \; \oplus \; \times \; x \; y \; z \; ( \; ) \; ` \; =
\end{align*}
$$

Then we can prove that this system is incomplete. Let’s begin.

Most strings made from these symbols are meaningless. For example, $\exists + \neg$ means nothing. But some strings can be interpreted as propositions that are either true or false. For example, $\forall x \exists y (x \oplus y = 1)$ can be interpreted as "for every $x$, there exists a $y$ such that $x+y=1$." If 1 were the identity element, this would be a proposition about the existence of inverses.

There are also strings called unary strings that define sets of natural numbers. They define a set by specifying a property of the symbol $x$. For example, the string defining the even numbers is as follows.

$$
(\exists y)(x=((1 \oplus 1) \times y))
$$

Written out more explicitly, this is:

$$
\{x \in \mathbb{N}\,|\,\exists y \in \mathbb{N}\;such\;that\;x = 2y\}
$$

Now think carefully about the form of a unary string. If we replace the symbol it describes (in the example above, $x$) with a specific number, then the string becomes a proposition about that number. For example, if in the unary string above we substitute $x=2$, we get $\exists y ((1 \oplus 1) = (1 \oplus 1) \times y)$, which is the proposition "2 is even."

So now, for a unary string $A$, we can define $[A:n]$ as the proposition obtained by replacing the variable $x$ in $A$ with $n$. For example, if $A$ is the unary string meaning "all $x$ are even," then $[A:2]$ becomes the proposition "2 is even."

Gödel’s idea is this: what matters is not what these symbols look like. As long as they preserve the same meaning, we could just as well represent them as integers. For example, $\supset$ could be 1, $\neg$ could be 2, $\land$ could be 3, ..., and $=$ could be 16. From outside the system, integers are just symbols with no intrinsic meaning, so it makes no difference whether we use $\supset$ or 1. Of course, these numbers are just examples; representing $\supset$ as 2394 would work just as well.

And using this, we can construct a proposition that can never be proved within the system.

Suppose we encode these unary strings as integers. Outside the system, the encoding itself carries no meaning, but inside the system it is just a natural number. So we can order all unary strings by the size of their integer encodings.

Since every possible unary string can be encoded as an integer, the set of unary strings has a one-to-one correspondence with the natural numbers. So we can name the unary strings in increasing order of encoding size as $A_1, A_2, A_3, \cdots$. Here, $A_n$ is the unary string with the $n$th smallest encoding.

Then for each $A_n\;(n\in\mathbb{N})$, we can define $[A_n:n]$, the proposition obtained by replacing the variable $x$ in $A_n$ with $n$. Since $A_n$ is a unary string, $[A_n:n]$ is a proposition about some natural number. Then, in a way that parallels the diagonal argument—where we manipulated each $f(n)$ to construct something new—let $K$ be the set of all $n$ such that $[A_n:n]$ cannot be proved within the system.

$$
K = \{n \in \mathbb{N}\,|\,\text{$[A_n:n]$ is not provable in PA}\}
$$

Here, "provable" means derivable from the axioms using only the rules of the system.

Regardless of how many elements it has, the set $K$ exists. That is because within PA, even sentences describing proofs of propositions can themselves be expressed using PA’s symbols, so we can define something of the form $P(x, y)$ meaning "the encoding of a sentence describing a proof of the proposition encoded by $x$ is $y$." Then an element $n$ of $K$ would be expressed as something like $n=\neg \exist xP(n,x)$.

In any case, we have now defined the set $K$. Then surely there is a unary string that defines $K$, and since it is also a unary string, it must be one of $A_1, A_2, A_3, \cdots$. Let us call that particular unary string $A_k$. Then for any $q\in\mathbb{N}$, $[A_k:q]$ means "$[A_q:q]$ is not provable in PA." So $[A_k:k]$ means "$[A_k:k]$ is not provable in PA."

In other words, $[A_k:k]$ is the proposition that says of itself that it cannot be proved. And this proposition is true. Because if we assume $[A_k:k]$ is false, then $[A_k:k]$ becomes a proposition provable in PA, and therefore true, which is a contradiction. So $[A_k:k]$ is certainly true from outside PA, but it is unprovable within PA itself.

## Additional points

Hilbert proposed three conditions that a complete mathematical system should satisfy:

- Consistency: it must contain no contradictions. A proposition and its negation cannot both be provable.
- Completeness: every proposition must be provably either true or false within the system.
- Decidability: there must be a general procedure for proving propositions.

But Gödel’s proof above made completeness impossible. And the following argument shows that consistency is also impossible.

The proposition we constructed, $[A_k:k]$, was true but unprovable in PA. Now consider its negation. For convenience, let $B=[A_k:k]$, so the negation is $\neg B$. Given the original meaning of $B$, $\neg B$ is the proposition that it can prove itself. And since $B$ was true, the law of excluded middle tells us that $\neg B$ is false.

So the proposition that $\neg B$ is provable is false, and therefore $\neg B$ is also unprovable. Since $B$ is unprovable and $\neg B$ is also unprovable, consistency too becomes impossible.

# Up to Turing’s universal machine

> If the basic principle of a machine used for solving differential equations is the same as that of a machine used for issuing department store receipts, I should regard it as the most amazing coincidence I have ever encountered.
>
> Howard Aiken[^1]

Gödel’s incompleteness theorem, described above, denied completeness and consistency in mathematics. But decidability still remained. Is there a general algorithm that can determine the truth or falsity of any proposition after a finite number of computational steps? This question was called Hilbert’s Entscheidungsproblem, or decision problem. To prove that no such algorithm exists, Turing devised the Turing machine.

Turing first tried to express a computable algorithm in the most minimal possible form. He stripped away all unimportant details—the exact shape of the symbols used in computation, the particular structure of the machine carrying it out—and kept only the minimum elements required for computation itself. As a result, Turing arrived at the following ideas.

- At each step of a computation, only a finite number of symbols are handled.
- The action taken at each step is determined solely by the symbols currently being handled and the current state of the machine.

Turing simplified these two points even further by limiting the machine to exactly one symbol and one state at a time. Any computation that handles several things simultaneously can be replaced by one that processes them one by one over multiple steps. Combining these ideas, he created the Turing machine. He then proved that this alone is enough to represent every computable algorithm. This is called the Church–Turing thesis.

## Structure of a Turing machine

A Turing machine’s computation consists of the following elements.

- A tape of infinite length and one-cell width, where each cell contains a symbol the machine can read and write
- A device that can read from and write to the tape
- The symbol currently written in the tape cell being observed
- A symbol representing the current state of the device
- The operating rules of the device (consisting of the current state, the symbol read from the tape, the symbol to write on the tape, the movement direction, and the new state)

This simple device computes by moving back and forth along the tape according to its operating rules, reading and writing the symbols on it. The exact number of tape symbols or state symbols, and what they mean, is not very important. It has been proved that adding more symbols does not change the essential power of a Turing machine.

To make this more concrete, let’s build a very simple Turing machine. Suppose it works like this: when it reads 1, it writes 1 and moves right; when it reads 2, it writes 2 and moves left. Also suppose the computation starts on a tape containing 1 and 2, with the machine initially pointing at the 1. Then the machine will move back and forth across the two cells, reading and writing 1 and 2 forever. The actual tape is infinitely long, of course, but for convenience only the two relevant cells are shown in the diagram.

![Simple Turing machine example](./simple-turing-machine.png)

More complex computations—such as deciding whether a given number is even, or performing arithmetic operations—can also be implemented with a Turing machine. As mentioned above, that follows naturally from the claim that every computation can be modeled by one. But since the goal here is not to implement things directly with Turing machines, I’ll stop at this level. The books in the references include more complex examples.

## Universal Turing machine

Given any computational algorithm, we can build a Turing machine that implements it. But Turing’s achievement did not stop there. He proved that a single Turing machine can simulate the computation of every Turing machine. In other words, the behavior of any Turing machine can be represented entirely by a tape and the symbols written on it, and then another Turing machine can read that representation and imitate the original machine’s behavior. After explicitly constructing such a machine, Turing called it a universal machine.

So how is this universal machine actually constructed? I’ll explain it based on Professor Kwangkeun Yi’s "컴퓨터과학이 여는 세계".

First, instead of using one tape, let us represent an arbitrary Turing machine using three tapes. Later, these will be merged into one.

On the first tape, place the tape that will be given to the Turing machine being simulated, along with an indication of the tape cell currently being pointed to. Let each tape symbol occupy two cells. We will place the symbol `*` to the left of a cell to indicate that it is the one currently being read.

On the second tape, store the machine’s current state. On the third tape, store the state transition table, using `X` as a separator. Since there are only finitely many state symbols and tape symbols, let us call them $S_0, S_1, \cdots, S_n$ and $T_0, T_1, \cdots, T_m$, respectively. Then we can construct the three tapes as follows.

![Representing a Turing machine with three tapes](./turing-machine-in-tape.png)

Since adding symbols does not change the power of a Turing machine, it does not matter what $n$ and $m$ are.

Now we know how to represent an arbitrary Turing machine on tapes. Then how do we construct a Turing machine that reads those tapes and simulates the behavior of the represented machine? It works like this.

1. Read the current machine state from tape 2.
2. Read the symbol currently being read on tape 1. This is possible by locating the `*` symbol and reading the cell immediately to its right.
3. Search tape 3 for the rule corresponding to the current machine state and the symbol just read.
4. Once the rule is found, write the appropriate tape symbol onto tape 1 as instructed, write the next machine state onto tape 2, and move the `*` symbol on tape 1 left or right according to the movement direction.
5. Repeat steps 1 through 4.

All we have to do is express this repeated procedure as a Turing machine rule table. The rule set will be long, since it needs to search for particular symbols and copy symbols around, but in principle it is possible. This machine is then a universal Turing machine capable of simulating any Turing machine.

But one problem still remains: we used three tapes to represent an arbitrary Turing machine. However, this can be expressed using only one tape by interleaving the symbols from the three tapes.

On a single tape, write "a symbol from tape 1, a symbol from tape 2, a symbol from tape 3" repeatedly in sequence. Each symbol still occupies two cells to account for `*`. The tape becomes much longer, but since it is infinite, that is not an issue. In this way, any Turing machine can be represented using only a single tape.

## Undecidable problems

Turing’s universal machine can represent every computable algorithm. But remember why Turing defined this universal machine in the first place: to prove that there are undecidable problems even for such a universal machine. So finally, let’s follow that argument. It too uses proof by contradiction and borrows the core idea of diagonalization.

First, suppose there exists an algorithm that can decide every proposition. Then there must of course be a Turing machine representing that algorithm; call it $A$. Using that, we can construct a Turing machine $H$ that makes the following decision:

> Given an algorithm and an input for that algorithm, does the computation eventually halt? (The Halting Problem)

Then $H$ works like this.

1. Represent the Turing machine corresponding to algorithm $A$ on the tape.
2. Use $A$ to decide whether the Turing machine representing the given algorithm halts on the given input.
3. If the given algorithm halts, write 1 on the tape and halt. Otherwise, write 0 on the tape and halt.

For example, the Turing machine we saw earlier that moves back and forth forever on a tape containing 1 and 2 will not halt. In that case, $H$ would write 1 and halt. On the other hand, it is easy to construct a Turing machine that simply points to a cell containing 1 forever without ever moving; in that case, $H$ would write 0 and halt.

But Turing proved, using diagonalization, that no machine like $H$ can exist.

As we saw earlier, every Turing machine can be represented on a single tape. And every possible symbolic tape representation can be mapped to a natural number. Just as in the incompleteness theorem, we can do this by assigning a specific integer to each symbol. So every Turing machine and every Turing machine input can be put into correspondence with a natural number. Then, for all Turing machines $M_1, M_2, M_3, \cdots$ and all possible inputs $I_1, I_2, I_3, \cdots$, $H$ could determine whether each computation eventually halts.

We can organize it as a table like this.

|  | $I_1$ | $I_2$ | $I_3$ | $I_4$ | $\cdots$ |
|---|---|---|---|---|---|
| $M_1$ | 1 | 1 | 0 | 1 | $\cdots$ |
| $M_2$ | 1 | 0 | 1 | 1 | $\cdots$ |
| $M_3$ | 0 | 1 | 0 | 1 | $\cdots$ |
| $M_4$ | 1 | 1 | 1 | 1 | $\cdots$ |
| $\vdots$ | $\vdots$ | $\vdots$ | $\vdots$ | $\vdots$ | $\ddots$ |

But then we can construct a Turing machine that behaves differently from every Turing machine in the list. Specifically, construct a Turing machine that writes 0 and halts if $M_i$ halts on $I_i$, and writes 1 and halts if $M_i$ does not halt on $I_i$. This is analogous to how, in the diagonal argument, we constructed a real number different from every $f(n)$.

That is a contradiction. A Turing machine that behaves differently from every Turing machine cannot itself exist among all Turing machines. Therefore, $H$ cannot exist. In summary, there is no algorithm that can determine the truth or falsity of every proposition.

There are many concepts derived from this, such as NP-hardness and the Busy Beaver function, which gives the maximum number of steps an $N$-state Turing machine can take before halting—something that naturally cannot be computed by a Turing machine, since no Turing machine can decide in general whether an arbitrary Turing machine halts. If you’re interested, those are worth exploring further. But since they are not directly tied to the development of computers, I’ll leave them aside here.

# Wrapping Up

So far, we’ve looked at how Turing’s universal machine can represent computable algorithms, and how undecidable problems can be constructed—problems that even such a machine cannot solve. This Turing machine became the theoretical foundation of the computer.

But implementing such a machine in a practical way is not easy. An infinitely long tape does not exist in the real world, and a machine that can read only one tape cell at a time is not very useful. The Turing machine was essentially a mathematical model.

Yet remarkably, this abstract model could be implemented as a real physical device. The foundation for that was the appearance of switches that could represent 0 and 1 as electrical signals, and Claude Shannon’s proof that logic circuits could be built from switches. As the implementation of these switches continued to improve, the computers we know became smaller and faster.

So in the next post of 'Computer Chronicle, One Step Further', I’ll probably trace the emergence and development of the switch—the device that brought the computer, once only a mathematical imagination, into the real world. And in the post after that, I hope to cover a more concrete implementation of a computer’s underlying structure using switches.

# References

Knowledge typically covered in standard undergraduate computer science courses was also very helpful.

Martin Davis, translated by Park Sang-min, "오늘날 우리는 컴퓨터라 부른다", Insight

Lee Kwang-keun, "컴퓨터과학이 여는 세계: 세상을 바꾼 컴퓨터, 소프트웨어의 원천 아이디어 그리고 미래", Insight

Apostolos Doxiadis, Christos H. Papadimitriou, art by Alecos Papadatos and Annie Di Donna, translated by Jeon Dae-ho, "로지코믹스", RH Korea

Wikipedia, Church–Turing thesis

https://en.wikipedia.org/wiki/Church%E2%80%93Turing_thesis

Wikipedia, Georg Cantor

https://en.wikipedia.org/wiki/Georg_Cantor

KIAS HORIZON, Turing and the halting problem: humans, mathematics, and computers

https://horizon.kias.re.kr/19364/

[^1]: Requoted from Martin Davis, translated by Park Sang-min, "오늘날 우리는 컴퓨터라 부른다", p. 212