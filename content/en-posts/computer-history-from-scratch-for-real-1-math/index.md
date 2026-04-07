---
title: A Step Further in the Computer Chronicle - 1. Turing Machine
date: "2025-07-06T00:00:00Z"
description: "From undecidability in mathematics to the birth of computer theory, from diagonalization to the Turing machine"
tags: ["history", "computer"]
---

# Getting Started

I’ve been telling stories from the history of computers through a series of posts. The stories of people I came across while researching were moving. But they were not enough to understand how computers could really be conceived in theory and then actually built. In fact, when I first started researching the history of computers, one question would not leave me alone.

**So how, exactly, is a computer made and structured?**

As I researched, I found at least part of the answer. So based on what I learned while preparing the computer history series, I decided to go one step deeper and write about whether a computer could really be constructed in theory. Unlike the history-focused posts, I did not aim for especially smooth narrative flow here. It’s better to think of this as a set of posts that dig further into individual topics such as the Turing machine and logic circuit implementation.

I think this will read more smoothly if you already know logic gates and circuit construction, basic mathematical proofs, and roughly the level of a second- or third-year undergraduate computer science student.

Of course, there are parts I left out even if they matter for real computers, especially optimization details. I’m not a developer who works on computer cores; if anything, I’m about as far from that as possible, just an ordinary frontend developer. So there are limits to how deeply I can go. If you want more detail, the books in the references section and the original papers by the relevant scholars are worth reading.

That’s enough disclaimers. In this post, I’ll look at how the "Turing machine," the theoretical origin of the computer, came to be formulated.

# Diagonalization

> No one shall expel us from the paradise that Cantor has created for us.
>
> David Hilbert, "Über das Unendliche(On the Infinite)", Mathematische Annalen 95, 1926

One of the major milestones on the path to the concept of the computer was Cantor’s diagonal argument. It began as a study of infinite sets and, at first glance, seems to have nothing to do with computers. But it later became the tool Alan Turing used to prove that there are problems undecidable even by a universal Turing machine. So let’s start with Cantor’s diagonal argument.

## Comparing the Size of Sets and Infinity

Suppose we define a "set" as a collection of objects satisfying some condition. Then how do we compare the sizes of two sets? For example, the sets $\{Red, Green, Blue\}$ and $\{1, 2, 3\}$ contain different elements, but both have size 3. How do we express that precisely in mathematics?

The answer is that there must exist a one-to-one correspondence between the elements of the two sets. If every element in one set can be matched with exactly one distinct element in the other, with nothing left over, then the two sets have the same size. For example, in the sets $\{Red, Green, Blue\}$ and $\{1, 2, 3\}$, we can match $1$ with $Red$, $2$ with $Green$, and $3$ with $Blue$, so the two sets have the same size.

This is intuitive enough. But what happens if we apply it to sets with infinitely many elements? Take the set of natural numbers and the set of even numbers. For any natural number $n$, we can match it with the even number $2n$, so there is a one-to-one correspondence between the natural numbers and the even numbers. Therefore the two sets have the same size. How does that feel? Is it still intuitive?

Logically, it is clearly correct, but it does not feel intuitive. If the natural numbers and the even numbers have the same size, then where did all the odd numbers go? Nineteenth-century mathematicians found this just as hard to accept. Since Euclid, it had been taken for granted that the "whole" is larger than its parts. So before Cantor, mathematicians tended to think that the size of an infinite set was not something consistent or countable.

## Cantor’s Courage

Georg Cantor, a German-Russian mathematician born in 1845, began his academic career as an unpaid lecturer at the University of Halle. At the time, many mathematicians started out as unpaid lecturers, so they had to find patrons or earn resources through their work.

Around then, Eduard Heine, a prominent mathematician who recognized Cantor’s talent, encouraged him to study trigonometric series, infinite series involving trigonometric functions. That led Cantor into the study of infinity.

As he worked on these problems, Cantor too ran into the counterintuitive properties of infinite sets mentioned earlier. The natural numbers and the even numbers having the same size? Earlier mathematicians who faced the same difficulty had simply given up on handling infinity rigorously.

Cantor, however, chose the path that went against intuition. He argued that if two sets admit a one-to-one correspondence, then they have the same size even when they are infinite, and therefore the natural numbers and the even numbers have the same size.

He then went on to prove one-to-one correspondences between the natural numbers and several other number sets. There is a one-to-one correspondence between the natural numbers and the integers, the rational numbers, and the algebraic numbers (numbers that are solutions to algebraic equations). In other words, all of these sets have the same size. For the details and rigor of those proofs, see pages 86–87 of "오늘날 우리는 컴퓨터라 부른다" and the [Schröder–Bernstein theorem](https://en.wikipedia.org/wiki/Schr%C3%B6der%E2%80%93Bernstein_theorem).

Naturally, Cantor then turned to the set of real numbers. Does there also exist a one-to-one correspondence between the natural numbers and the real numbers? It turns out there does not, and the method Cantor used to prove this is the diagonal argument.

## The Idea of the Diagonal Argument

So how do we show that one set is larger than another? We prove that no matter how we try to match the elements of the two sets, no one-to-one correspondence exists. For example, if we match every element of a set $A$ with an element of a set $B$, and there are still elements left over in $B$, then $B$ is larger than $A$.

Cantor used this to prove that the set of real numbers is larger than the set of natural numbers. To do so, he proved that the real numbers in the interval $(0,1)$ cannot be put into one-to-one correspondence with the natural numbers.

This works because $(0,1)$ itself can be put into one-to-one correspondence with the full set of real numbers $\mathbb{R}$. We can see this by defining the function $f : (0, 1) \to \mathbb{R}$ as follows:

$$
f(x) = \tan\left(\pi x - \frac{\pi}{2}\right)
$$

Now suppose there exists a function $f: \mathbb{N} \to (0, 1)$ that matches the natural numbers one-to-one with the real numbers in $(0,1)$. Then for each $n$, $f(n)$ can be written as follows, where each $a_{ij}$ is an integer from 0 to 9.

$f(1) = 0.a_{11}a_{12}a_{13}a_{14}\cdots$

$f(2) = 0.a_{21}a_{22}a_{23}a_{24}\cdots$

$f(3) = 0.a_{31}a_{32}a_{33}a_{34}\cdots$

$\vdots$

$f(n) = 0.a_{n1}a_{n2}a_{n3}a_{n4}\cdots$

$\vdots$

Then we can define a real number $x$ as follows: let it differ from each $f(n)$ in the $n$th digit after the decimal point. There are several ways to construct such a number, but let’s define its $n$th digit after the decimal point to be $(a_{nn} + 1) \mod 10$. For example, 1 becomes 2, 2 becomes 3, ..., and 9 becomes 0. If we denote the $i$th digit after the decimal point by $d_i$, we can write this as follows.

|       | $d_1$      | $d_2$      | $d_3$      | $d_4$      | $d_5$      | $\cdots$      |
|-------|--------|--------|--------|--------|--------|--------|
| $f(1)$  | $\textcolor{red}{a_{11}}$   | $a_{12}$    | $a_{13}$    | $a_{14}$    | $a_{15}$    | $\cdots$       |
| $f(2)$  | $a_{21}$    | $\textcolor{red}{a_{22}}$  | $a_{23}$    | $a_{24}$    | $a_{25}$    | $\cdots$       |
| $f(3)$  | $a_{31}$    | $a_{32}$    | $\textcolor{red}{a_{33}}$    | $a_{34}$    | $a_{35}$    | $\cdots$       |
| $f(4)$  | $a_{41}$    | $a_{42}$    | $a_{43}$    | $\textcolor{red}{a_{44}}$    | $a_{45}$    | $\cdots$       |
| $f(5)$  | $a_{51}$    | $a_{52}$    | $a_{53}$    | $a_{54}$    | $\textcolor{red}{a_{55}}$    | $\cdots$       |
| $\vdots$     | $\vdots$      | $\vdots$      | $\vdots$      | $\vdots$      | $\vdots$      | $\ddots$      |
| $x$     | $(a_{11}+1) \% 10$ | $(a_{22}+1) \% 10$ | $(a_{33}+1) \% 10$ | $(a_{44}+1) \% 10$ | $(a_{55}+1) \% 10$ | $\cdots$ |

Then this $x$ differs from $f(n)$ in the $n$th digit after the decimal point for every natural number $n$. We assumed there was a one-to-one correspondence between the natural numbers and the real numbers in $(0,1)$, so $x$ must be equal to $f(m)$ for some natural number $m$—but it is not. This is a contradiction. Therefore, no one-to-one correspondence exists between the real numbers in $(0,1)$ and the natural numbers.

So the set of real numbers in the interval $(0,1)$ is larger than the set of natural numbers, and since the real numbers in $(0,1)$ are in one-to-one correspondence with the full set of real numbers, the set of real numbers is larger than the set of natural numbers.

There is one minor issue here. Some rational numbers can be represented in two different ways. For example, $0.10000\cdots$ and $0.09999\cdots$ both represent the same rational number $1/10$. But this can be handled using the fact that the set of all rational numbers also has a one-to-one correspondence with the natural numbers.

# Incompleteness Theorem

> Young man, in mathematics you don't understand things. You just get used to them.
>
> [John von Neumann](https://www.mathrecreation.com/2010/01/most-loved-and-hated-theorem.html?utm_source=chatgpt.com)

## The Mathematicians’ Dream

In the early twentieth century, Hilbert and others hoped to establish mathematics as a complete system in itself. They wanted mathematics to be expressed in a well-defined symbolic language: a system in which every inference step is clear when viewed from within the language as mathematics, but from outside the language can be handled entirely as mere manipulation of formulas and symbols, and handled that way without contradiction.

Here is a simple example of what it means for such a system to work purely through symbol manipulation.

Suppose the proposition $A \implies B$ is true. And suppose I learn that $A$ is true. Then I can conclude that $B$ is also true. This does not depend on what $A$ and $B$ actually mean.

Later I may find out that $A$ meant "$x$ is even" and $B$ meant "$x$ is divisible by 2." I concluded that $B$, namely "$x$ is divisible by 2," is true because $A$ is true and $A \implies B$. But I did not need to know the meanings of $A$ and $B$ to make that inference. I could derive it purely by manipulating symbols according to rules.

Inside mathematics, these are propositions with meaning, but from the outside they can be used to infer new facts through pure symbolic manipulation. The same is true no matter what meanings $A$ and $B$ have. Even if $A$ were the axiom of choice and $B$ were the Banach–Tarski paradox (the famous counterintuitive result that a sphere can be cut into finitely many pieces and reassembled into two spheres of the same size; the mathematical details do not matter here), then as long as I know that $A$ is true and $A \implies B$, I can conclude that $B$ is true without knowing what either of them means.

The dream mathematicians had was to build mathematics as a system in which every part of mathematics could be represented in this way and manipulated consistently without contradiction. Systems such as Whitehead and Russell’s *Principia Mathematica* and Peano arithmetic came out of this effort. At the 1928 International Congress of Mathematicians, Hilbert called for a proof of the completeness of Peano arithmetic.

## Gödel’s Proof

Two years later, in 1931, Kurt Gödel published the paper "On Formally Undecidable Propositions of Principia Mathematica and Related Systems," and settled the issue—though not in the way Hilbert wanted. Gödel’s paper shook Hilbert’s entire dream. Setting aside that shock, let’s look at how Gödel’s proof worked, since it was the final step before the Turing machine.

Gödel used somewhat different techniques, such as mapping symbols to integers using the uniqueness of prime factorization rather than the decimal-style encoding used later in this post. If needed, you can look up [Gödel numbering](https://en.wikipedia.org/wiki/G%C3%B6del_numbering). But following Gödel’s original proof exactly is not the goal here, so I will explain it based on the presentation in Martin Davis’s "오늘날 우리는 컴퓨터라 부른다," which unpacks it more accessibly.

Attempts to formalize mathematics as a logical system aimed to represent every mathematical object using a finite number of symbols. Then they defined rules for manipulating those symbols so that, from outside the system, mathematics could be handled purely through symbol manipulation under those rules.

For example, Peano Arithmetic (PA) consists of just the following 16 symbols. (Different documents may use different symbols, but that is not important in this context.)

$$
\begin{align*}
\supset \; \neg \; \land \; \lor \; \forall \; \exists \; 1 \; \oplus \; \times \; x \; y \; z \; ( \; ) \; ` \; =
\end{align*}
$$

Now we can prove that this system is incomplete. Let’s begin.

Most strings formed from these symbols are meaningless. For example, $\exists + \neg$ means nothing. But some strings can be interpreted as propositions that are either true or false. For example, $\forall x \exists y (x \oplus y = 1)$ can be interpreted as meaning "for every $x$, there exists a $y$ such that adding $x$ and $y$ gives 1." If 1 were the identity element, then this would be a proposition about the existence of inverses.

There are also strings called unary strings that define sets of natural numbers. They define a set by specifying a property of the symbol $x$. For example, the string defining the even numbers is:

$$
(\exists y)(x=((1 \oplus 1) \times y))
$$

Written out more explicitly, this is:

$$
\{x \in \mathbb{N}\,|\,\exists y \in \mathbb{N}\;such\;that\;x = 2y\}
$$

Now think carefully about the form of a unary string. If we substitute a specific number for the symbol it describes (in the example above, $x$), the string becomes a proposition about that specific number. For example, if we substitute $x=2$ into the unary string above, we get $\exists y ((1 \oplus 1) = (1 \oplus 1) \times y)$, which is the proposition "2 is even."

So now we can define $[A:n]$ for a unary string $A$. This means the proposition obtained by replacing the variable $x$ in $A$ with $n$. For example, if $A$ is the unary string meaning "all $x$ are even," then $[A:2]$ becomes the proposition "2 is even."

Gödel’s idea is this. What matters is not what these symbols look like. If they carry the same meaning, then in principle it makes no difference if we represent them by integers. For example, let $\supset$ be 1, $\neg$ be 2, $\land$ be 3, ..., and $=$ be 16. From outside the system, integers are also just symbols without inherent meaning, so there is no essential difference between $\supset$ and 1. Of course, the specific numbers are just examples; writing $\supset$ as 2394 would mean the same thing.

And with this, we can construct a proposition that can never be proved within the system.

Suppose we encode all unary strings as integers. Outside the system, these encodings mean nothing, but inside the system they are integers, so we can sort all unary strings by the size of their integer encodings.

Since all unary strings can be encoded as integers, the set of unary strings is in one-to-one correspondence with the natural numbers. So we can name the unary strings ordered by increasing encoding size as $A_1, A_2, A_3, \cdots$. Here, $A_n$ is the unary string with the $n$th smallest encoding.

Then for each $A_n\;(n\in\mathbb{N})$, we can define $[A_n:n]$, the proposition obtained by replacing the variable $x$ in $A_n$ with $n$. Since $A_n$ is a unary string, $[A_n:n]$ is a proposition about some natural number. Then, following a pattern similar to the diagonal argument, where we formed something new by changing each $f(n)$ at position $n$, let $K$ be the set of all $n$ such that $[A_n:n]$ cannot be proved within the system.

$$
K = \{n \in \mathbb{N}\,|\,\text{$[A_n:n]$는 PA에서 증명할 수 없는 명제이다}\}
$$

Here, "can be proved" means that it can be derived from the axioms using only the rules of the system.

Regardless of how many elements $K$ has, the set $K$ exists. This is because within PA, even statements describing proofs of propositions can be expressed using PA’s symbols, so we can define something like $P(x, y)$ to mean that $y$ is the encoding of a sentence describing a proof of the proposition whose encoding is $x$. Then an element $n$ of $K$ would look like $n=\neg \exist xP(n,x)$.

In any case, we have now defined the set $K$. Then there must also be a unary string that defines $K$, and since it too is a unary string, it must be one of $A_1, A_2, A_3, \cdots$. Let us call the unary string defining $K$ specifically $A_k$. Then for any $q\in\mathbb{N}$, $[A_k:q]$ means "$[A_q:q]$ is a proposition unprovable in PA." Therefore, $[A_k:k]$ means "$[A_k:k]$ is a proposition unprovable in PA."

So $[A_k:k]$ is precisely the proposition that says it cannot prove itself. And it is true. Because if $[A_k:k]$ were false, then $[A_k:k]$ itself would be a proposition provable in PA, and therefore true, which is a contradiction. In other words, $[A_k:k]$ is certainly true from outside PA, but it is unprovable within PA itself.

## Some Additional Points

Hilbert proposed three conditions that a complete mathematical system should satisfy.

- Consistency: It must contain no contradictions. A proposition and its negation cannot both be proved.
- Completeness: Every proposition must be provably either true or false within the system.
- Decidability: There must be a general procedure for proving propositions.

But Gödel’s proof above made completeness impossible. And the following line of reasoning shows that consistency is impossible as well.

The proposition $[A_k:k]$ we constructed was true but not provable in PA. Now consider its negation. For convenience, let $B=[A_k:k]$, so the negation is $\neg B$. Given the original meaning of $B$, $\neg B$ is the proposition that it can prove itself. And since $B$ was true, $\neg B$ is false by the law of excluded middle.

So the proposition that $\neg B$ can be proved is false, and therefore $\neg B$ is also unprovable. Since $B$ is unprovable and $\neg B$ is also unprovable, consistency also becomes impossible.

# Up to Turing’s Universal Machine

> If the basic principle of a machine to solve differential equations is the same as that of a machine to issue department store receipts, I would regard it as the most amazing coincidence I have ever encountered.
>
> Howard Aiken[^1]

Gödel’s incompleteness theorem, discussed above, denied the completeness and consistency of mathematics. But decidability still remained. Is there a general algorithm that, after a finite amount of computation, can determine whether any given proposition is true or false? This question was called Hilbert’s Entscheidungsproblem, or decision problem. Turing invented the Turing machine in order to prove that no such algorithm exists.

Turing first tried to express computable algorithms in the most minimal form possible. He ignored all irrelevant details, such as the exact shapes of symbols used in computation or the physical structure of the machine performing it, and kept only the minimum required elements. As a result, Turing arrived at the following ideas.

- At each step of computation, only a finite number of symbols are involved.
- The action taken at each step is determined only by the symbols currently being handled and the current state of the machine.

Turing simplified this even further by restricting both the symbol being handled and the machine state to just one at a time. Computations that involve multiple things at once can be replaced by computations that process them one by one over multiple steps. Combining these ideas, he built the Turing machine. And he proved that this alone is enough to express every computable algorithm. This is known as the Church–Turing thesis.

## Structure of a Turing Machine

A Turing machine computation consists of the following elements.

- A tape of infinite length and one-cell width, where each cell contains a symbol the machine can read and write
- A device that can read from and write to the tape
- The symbol currently written in the tape cell being observed
- A symbol representing the state of the device
- The machine’s transition rules, each consisting of the current machine state, the symbol read from the tape, the symbol to write to the tape, the direction of movement, and the new machine state

This simple device performs computation by moving back and forth along the tape according to its rules, reading and writing symbols on the tape. The exact number and meaning of the tape symbols and machine states are not especially important. It has been proved that adding more symbols does not change the essential power of a Turing machine.

To make this easier to picture, let’s define a very simple Turing machine. This machine reads a 1, writes a 1, and moves right; when it reads a 2, it writes a 2 and moves left. The machine starts on a tape containing 1 and 2, with the head pointing at the 1. Then it will move back and forth between the two cells forever, repeatedly reading and writing 1 and 2. The actual tape is infinitely long, but for convenience only the two relevant cells are shown.

![A simple Turing machine example](./simple-turing-machine.png)

More complex computations can also be implemented using Turing machines, such as deciding whether a given number is even or performing the four basic arithmetic operations. As mentioned earlier, that follows naturally from the fact that all computation can be modeled this way. But since the goal here is not to implement things directly with Turing machines, we will stop at this level. The books in the references section include more complex examples.

## Universal Turing Machine

If there is some computational algorithm, then we can build a Turing machine that implements it. But Turing’s achievement does not stop there. He proved that the computation of every Turing machine can itself be simulated by a single Turing machine. In other words, the behavior of any Turing machine can be represented entirely using tape and symbols written on it, and then another Turing machine can read that representation and simulate the original machine’s behavior. After explicitly constructing such a machine, Turing called it a universal machine.

So how is this universal machine constructed? I’ll explain based on Professor Kwangkeun Yi’s "컴퓨터과학이 여는 세계."

First, instead of using one tape, let us represent an arbitrary Turing machine using three tapes. Later we will combine them into one.

On the first tape, we store the tape that will be given to the Turing machine, along with the tape cell currently being pointed to by the machine. Each tape symbol will occupy two cells. This is because we will use the symbol `*` on the left side of a cell to indicate that it is the cell currently being read.

On the second tape, we store the machine’s state. On the third tape, we store the machine’s transition table, with state rules separated by `X`. Since the symbols representing the machine’s states and the tape symbols are both finite in number, let us call them $S_0, S_1, \cdots, S_n$ and $T_0, T_1, \cdots, T_m$ respectively. Then we can build the three tapes as follows.

![Representing a Turing machine with three tapes](./turing-machine-in-tape.png)

Since adding symbols does not change the power of a Turing machine, it does not matter what values $n$ and $m$ have.

Now we know how to represent an arbitrary Turing machine as tapes. Then how do we construct a Turing machine that reads those tapes and simulates the behavior of the represented machine? It works as follows.

1. Read the current machine state from tape 2.
2. Read the current tape symbol from tape 1. This can be done by finding the `*` symbol and reading the cell immediately to its right.
3. Search tape 3 for the rule corresponding to the current machine state and the symbol just read.
4. When the matching rule is found, write to tape 1 the symbol specified by the rule, write the next machine state to tape 2, and move the `*` symbol on tape 1 left or right according to the movement direction.
5. Repeat steps 1 through 4.

We can express this repeated procedure as a Turing machine transition table. It would certainly be a long set of rules, since it has to search for symbols and copy symbols around, but it is possible nonetheless. This machine becomes a universal Turing machine capable of simulating any Turing machine.

But one problem still remains: this representation of an arbitrary Turing machine uses three tapes. We can express this with a single tape by interleaving the symbols from the three tapes.

On one tape, we alternately write "symbol from tape 1, symbol from tape 2, symbol from tape 3." Each symbol still takes up two cells to account for `*`. The tape becomes much longer, but since the tape is infinite, that does not matter. In this way, an arbitrary Turing machine can be implemented using just a single tape.

## Undecidable Problems

Turing’s universal machine can express every computational algorithm. But remember why Turing defined this universal machine in the first place: to prove that there are problems undecidable even by such a universal machine. So finally, let’s follow that argument. This too uses proof by contradiction and borrows the core idea of diagonalization.

First, suppose there exists an algorithm that can decide every proposition. Then naturally there is a Turing machine that expresses this algorithm; let us call it $A$. Then we can build a Turing machine $H$ that makes the following decision.

> Given an algorithm and an input to that algorithm, does the computation eventually halt?(The Halting Problem)

Then $H$ works as follows.

1. Represent the Turing machine $A$ on the tape.
2. Use $A$ to decide whether the Turing machine representing the given algorithm halts on the given input.
3. If the given algorithm halts, write 1 on the tape and halt. Otherwise, write 0 on the tape and halt.

For example, the Turing machine above that endlessly moves back and forth on a tape containing 1 and 2 will not halt. In that case, $H$ would write 1 and halt. On the other hand, it is also easy to construct a Turing machine that points forever at the same position on a tape containing 1 and never halts; for that case, $H$ would write 0 and halt.

But Turing proved, using diagonalization, that no machine like $H$ can exist.

As we saw earlier, every Turing machine can be represented on a single tape. And every possible symbolic tape representation can be put into correspondence with a natural number, because we can encode symbols as integers in the same way we did earlier in the discussion of the incompleteness theorem. Therefore, every Turing machine and every Turing machine input can be put into correspondence with natural numbers. Then, using $H$, we could decide for every Turing machine $M_1, M_2, M_3, \cdots$ whether it eventually halts on every possible input $I_1, I_2, I_3, \cdots$.

We could organize the results in a table like this.

|  | $I_1$ | $I_2$ | $I_3$ | $I_4$ | $\cdots$ |
|---|---|---|---|---|---|
| $M_1$ | 1 | 1 | 0 | 1 | $\cdots$ |
| $M_2$ | 1 | 0 | 1 | 1 | $\cdots$ |
| $M_3$ | 0 | 1 | 0 | 1 | $\cdots$ |
| $M_4$ | 1 | 1 | 1 | 1 | $\cdots$ |
| $\vdots$ | $\vdots$ | $\vdots$ | $\vdots$ | $\vdots$ | $\ddots$ |

But then we could construct a Turing machine whose behavior differs from that of every Turing machine in the list. Specifically, we define a Turing machine that writes 0 and halts if $M_i$ halts on $I_i$, and writes 1 and halts if it does not halt. This mirrors the way we constructed a real number different from every $f(n)$ in the diagonal argument.

This is a contradiction. A Turing machine that behaves differently from every Turing machine cannot exist. Therefore, $H$ cannot exist. In short, there is no algorithm that can decide the truth or falsehood of every proposition.

Many concepts branch out from this point. Examples include NP-hardness and the Busy Beaver function, which gives the maximum number of steps an $N$-state Turing machine can execute before halting—and of course it cannot be computed by a Turing machine, because a Turing machine cannot determine in general whether an arbitrary Turing machine will halt. If you are interested, those topics are worth exploring. But since they are not directly related to the development of the computer itself, I will leave them out here.

# Wrapping Up

So far, we have seen how Turing’s universal machine can express computable algorithms, and how undecidable problems can be constructed that even such a machine cannot solve. This Turing machine became the theoretical foundation of the computer.

But implementing such a machine in a practical way is not easy. Infinite tape does not exist in the real world, and a machine that can read only one tape cell at a time is not very useful. The Turing machine was, in essence, only a mathematical model.

And yet, remarkably, this abstract model could be realized as an actual physical device. That became possible through the arrival of switches that could represent 0 and 1 as electrical signals, and through Claude Shannon’s proof that logical circuits could be built from such switches. As the implementation of those switches improved, the computers we know became smaller and faster.

So in the next post in the "A Step Further in the Computer Chronicle" series, I will probably look at the emergence and development of the switch, the technology that brought the computer out of pure mathematical imagination and into the real world. And in the post after that, I hope to cover a more concrete implementation of the computer’s skeleton using switches.

# References

Knowledge commonly covered in undergraduate computer science courses was also very helpful.

Martin Davis, translated by Park Sang-min, "오늘날 우리는 컴퓨터라 부른다", Insight

Kwangkeun Yi, "컴퓨터과학이 여는 세계: 세상을 바꾼 컴퓨터, 소프트웨어의 원천 아이디어 그리고 미래", Insight

Apostolos Doxiadis, Christos H. Papadimitriou, art by Alecos Papadatos and Annie Di Donna, translated by Jeon Dae-ho, "로지코믹스", RH Korea

Wikipedia, Church–Turing thesis

https://en.wikipedia.org/wiki/Church%E2%80%93Turing_thesis

Wikipedia, Georg Cantor

https://en.wikipedia.org/wiki/Georg_Cantor

KIAS HORIZON, Turing and the Halting Problem: Humans, Mathematics, Computers

https://horizon.kias.re.kr/19364/

[^1]: Requoted from Martin Davis, translated by Park Sang-min, "오늘날 우리는 컴퓨터라 부른다", p. 212