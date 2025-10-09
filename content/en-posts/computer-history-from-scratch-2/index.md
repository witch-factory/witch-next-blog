---
title: Computer Chronicle 2. The Dream of Perfectly Explaining the World with Logic and Its Frustration
date: "2025-05-08T00:00:00Z"
description: "About those who sought to build a complete system through mathematics and logic. From Frege's concept notation to Cantor's infinity and the paradoxes that toppled them."
tags: ["history", "computer"]
---

![Thumbnail](./computer-history-from-scratch-2-thumbnail.png)

# List of Computer Chronicle Series

This series is planned to be published every two weeks. However, since it is a hobby project, the release schedule may be delayed or changed depending on circumstances.

| Series | Link |
| --- | --- |
| Computer Chronicle 0 - Introduction | [Link](/ko/posts/computer-history-from-scratch-0) |
| Computer Chronicle 1 - The First Step Towards Thinking Machines, Founders of Inference | [Link](/ko/posts/computer-history-from-scratch-1) |
| Computer Chronicle 2 - The Dream of Perfectly Explaining the World with Logic and Its Frustration | [Link](/ko/posts/computer-history-from-scratch-2) |

- I have made efforts in my research, but if you find any mistakes, please feel free to point them out through comments.

# Towards a Comprehensive System

Boole created a system that could express logic in symbols and laid the groundwork for handling logical relations with mathematics. He effectively opened a new field of mathematics that we still refer to today as Boolean algebra.

However, Boole's system was still structurally incomplete. There were logical expressions that could not be represented in his system. An example is the statement, "All students are either foolish or lazy."[^1] Even such a simple sentence could not be perfectly expressed using Boole's symbols.

Let’s try to express that statement using only Boole's symbols from the earlier discussion by defining $A$ and $B$ as follows:

- $A$: All students are foolish.
- $B$: All students are lazy.

Then we might write this statement as $A + B = 1$. However, this expression fails to include cases where some students are both foolish and lazy.

Thus, the logical system at that time was still far from the goal of expressing everything in the world as Leibniz dreamed. Let’s now learn about the people who tried to fill this gap and take it further. These attempts ultimately faced complete frustration, leaving a significant impact on the field of mathematics. The nature of this frustration may indicate just how far these individuals had progressed.

## Frege's Concept Notation - Completing Logical Expression

> Frege's greatest contribution to logic was the invention of quantification theory, which allows for the symbolization and precise representation of reasoning dependent on expressions such as "all" and "some". (...) It formalized reasoning theories in a more rigorous and general way than traditional Aristotelian syllogisms, which were considered the basis of logic until Kant's time.
>
> Written by Anthony Kenny, translated by Kim Young-geon et al., "A History of Western Philosophy", 2004, iJ Books, pp. 354-355.

In 1879, Gottlob Frege, a professor at the University of Jena,[^2] published a booklet titled "Concept Notation". In this booklet, he proposed a logical system that encompassed all deductive reasoning used in mathematics. This system includes quantifiers like $\forall$ and $\exists$ that are used in mathematics today.[^3]

Frege introduced the following symbols, which are still in use today.

| Symbol | Meaning |
| ---- | ---- |
| $\forall$ | every |
| $\exists$ | some |
| $\neg$ | not |
| $\land$ | and |
| $\lor$ | or |
| $\supset$ | if ... then ... |

Thus, the statement "All students are either foolish or lazy" can be expressed as follows:

$$
\forall x ((x \in \text{학생}) \supset (x \in \text{멍청하다} \lor x \in \text{게으르다}))
$$

Frege didn’t stop at merely symbolizing mathematical facts. While Boole used mathematical symbols in logical relationships, Frege sought to establish a solid logical system underlying all of mathematics. This meant that logic must exist at the very foundation of mathematics, and existing mathematics could not be used to build that logical system. Mathematics had to rest upon that logical framework.

Therefore, he attempted to replace logical reasoning with the simple mechanical processing of symbolic patterns. By establishing rules for the relationships between symbols, regardless of their meanings, he believed that all mathematical systems could be built solely through the power of logic.

This was a dream to reduce all mathematical advancements to logic, and "Concept Notation" was his output toward that dream. Although the system had weaknesses, it represented a tremendous advancement compared to Boole's logical system, as it theoretically encompassed all reasoning in mathematics.

This perspective that all of mathematics can be reduced to logical axioms is called "logicism," influencing many great scholars, including Russell, Dedekind, and Wittgenstein.

However, despite Frege's monumental achievements in today's logical systems and philosophy, his dream did not come true. Bertrand Russell pointed out in 1902 that contradictions could arise in his logical system, a problem known as "Russell's Paradox."

Frege was unable to recover from this shock for the rest of his life. He believed his lifetime research was in vain and thereafter did not engage significantly with the fundamental study of mathematics. He also developed a hostile attitude towards social democracy and Catholicism, and fell into anti-Semitism.

Frege spent the remaining decades of his life in such extreme right-wing activities until he passed away in 1925. His death was largely ignored by the academic community.

## Cantor

> Proven facts and rigorous reasoning form the foundation of solid scientific knowledge. Emotions, opinions, and instinctive rejection of new ideas do not.
>
> Nils Al Baricelli, "Numerical Testing of Evolution Theories: Part II", 1963, p. 7[^4].

If Frege tried to establish mathematics on solid logic, Cantor sought to bring the concept of infinity into mathematics.

During Leibniz's time, mathematicians began to handle the concept we now call "limits." This concept shows what number a sequence approaches as it extends infinitely. Leibniz also dealt with such limits and discovered a converging infinite series like the following:

$$
\frac{\pi}{4} = 1 - \frac{1}{3} + \frac{1}{5} - \frac{1}{7} + \frac{1}{9} - \frac{1}{11} + \cdots
$$

Georg Cantor, a German-Russian mathematician born in 1845 to a wealthy businessman, also studied this when mathematician Eduard Heine recognized Cantor's mathematical talent and persuaded him to research problems involving infinite series. Cantor began studying the convergence of trigonometric series that included trigonometric functions, and naturally started to explore infinity in detail.

Until that point, mathematicians dealt with infinity only in intuitive terms. For instance, we can intuitively understand that given the sequence

$$
1,\;\frac{1}{2}, \;\frac{1}{3},\;\frac{1}{4},\;\cdots
$$

as the denominator increases infinitely, it will converge to 0 since the numerator remains the same and the denominator grows infinitely.

However, the proper handling of infinity, such as comparing infinities and performing operations between them, had been considered impossible. The concept of absolute infinity was thought to belong only to the domain of the divine, as it was believed that handling infinity would inevitably lead to non-intuitive results. At that time, infinity was understood merely as a way to grasp limits. Even great mathematicians like Gauss stated that infinity could not exist in mathematics and was merely a means of explaining limits.

Cantor challenged these notions. He attempted to rigorously explore infinity in mathematics, a realm no one had dared to enter.

Cantor sought to distinguish between different sizes of infinity. He demonstrated that sets of natural numbers, sets of even numbers, sets of rational numbers, and even sets of all algebraic numbers (those that can be expressed as roots of algebraic equations) all had the same size. He also proved that the set of real numbers is larger than the set of natural numbers.

To demonstrate that the set of real numbers is larger than that of natural numbers, Cantor used the diagonal argument. This idea of the diagonal method would later be utilized by Gödel and Turing. A thorough exploration of this will be covered in a different, theory-focused article.

In any case, it was a remarkably new and radical idea. The principle that a whole is greater than any of its parts had been one of the fundamental premises of mathematics since the time of Euclid. Cantor embarked on his exploration of the world of infinity together with the concept of sets. No one had previously taken this journey into the realm of infinity, and Cantor had no significant pre-existing mathematical theories to rely on for this research. Considering that many of his results still operate validly in the field of set theory today, this is truly impressive.

However, his work was not welcomed by his contemporaries. It was considered unintuitive and implausible for finite humans to deal with infinity. Even his mentor Kronecker disagreed with his ideas.

As a result, Cantor suffered from depression for much of his later life. He fell into conspiracy theories, believing that the true author of Shakespeare's works was Francis Bacon or that Joseph of Arimathea was the biological father of Jesus, and passed away in a mental institution in 1918.

Despite his lonely later years, his attempts, along with Frege's, revealed to mathematicians that cracks existed at the foundation of mathematics. This was due to the various paradoxes that emerged when attempting to apply logic to infinity. Among them was the aforementioned "Russell's Paradox."

## Russell's Paradox

> This statement is false.
>
> Liar Paradox

So, what exactly was this Russell's Paradox that disheartened the attempts of Frege and Cantor? From the early 1900s until about the 1930s, several paradoxes capable of shaking the foundations of mathematics arose, along with attempts to rebuild mathematics on solid ground[^5]. One of these significantly influential paradoxes was Russell's Paradox.

It is a self-referential paradox, essentially like saying, "This statement is false." If the statement "This statement is false" is true, then it is false; if it is false, then it is true. Frege recognized that this seemingly playful paradox caused a contradiction within his system, leading to despair.

The precise explanation of Russell's Paradox is as follows. First, let us define "a set that includes itself as an element" as a special set. In the logical systems of Frege and Cantor, such sets are permitted. Sets that are not special are called ordinary sets. Now, consider the collection of all ordinary sets, $\epsilon$.

Is $\epsilon$ an ordinary set or a special set? Either way, there is a contradiction. If $\epsilon$ is an ordinary set, then it must include itself, thus becoming a special set. If $\epsilon$ is a special set, it must include itself; hence, according to its definition, $\epsilon$ must be an ordinary set.

Frege and Cantor used the concept of the collection of all sets when defining natural numbers and their operations. However, as we have seen, the concept of the collection of all sets leads to these contradictions. Therefore, this set theory is not a coherent, complete system by itself, and cannot serve as a solid ground for a perfect foundation for mathematics.

The dream of constructing mathematics perfectly on the logical system presented by Frege and on Cantor's set theory thus came to an end. Many mathematicians continued their research, setting aside this setback. However, for those scholars dealing with the foundations of mathematics, such paradoxes were fatal.

During this time of instability in the foundations of mathematics, a new era emerged where efforts were made to solidify the essence of mathematics. Many fields related to mathematics still stand upon the systems established during this period. While enduring this tumultuous time, mathematicians unknowingly began to advance towards the theory of computers.

Now, let’s look at the scholars who sought to establish a new foundation in this new era and the events that overturned their efforts.

# Other Attempts Toward a Complete System

Like Frege, who aimed to build mathematics on a foundation of logic, and Cantor, who sought to systematize sets and infinity, there were numerous attempts to create a more robust and inclusive mathematical system. As noted earlier, during this period, the mathematicians dealing with the foundations of mathematics saw the mathematical framework as crumbling, prompting them to fill the gaps in any way possible.

These efforts continued until Gödel proved his incompleteness theorem, shattering all of these attempts. Here are a few that are judged to have relevance to other content.

While attempts by prominent scholars such as von Neumann and Wittgenstein, along with the ZFC axiomatic system, which still forms the basis of mathematics today, are under this influence, discussing them might veer too far from the narrative of computers, so they are omitted. If needed, searching those keywords would be beneficial.[^6]

## Russell

> "Let’s take a look at Leibniz’s portrait! I too dreamed the same dream. The dream of discovering a completely logical method for solving all problems, from those of logic to those of human affairs!"
>
> Apostolos Doxiadis, "Logicomix", p. 299.

Russell's paradox brought down the empires of the systems that Frege and Cantor tried to build. However, Bertrand Russell himself was also one among those who sought to uphold mathematics using logic free of paradoxes.

Together with Alfred North Whitehead, he engaged in a long-term effort to lay the groundwork for mathematics. After ten years of work, they published "Principia Mathematica," a three-volume work. This thoroughly extensive proof, requiring 362 pages to demonstrate that 1+1=2, was considered a serious contribution to the foundations of mathematics.

However, it seems this research was not widely welcomed at the time. Russell and Whitehead published their book privately because no publisher would agree to publish "Principia Mathematica," and a joke claimed that the only people who read it, aside from the authors, were Kurt Gödel and no one else.

Nonetheless, the obsessive attempt to write three thick volumes for what intuitively seemed obvious facts was one of the most serious efforts for the foundations of mathematics at that time. It was significant that such an endeavor was made in an era when many mathematicians were still relying on intuition.

Furthermore, Gödel's proof of incompleteness was also based on "Principia Mathematica," indicating that its contribution was not insignificant. He also proposed various theories in an effort to overcome his namesake Russell's paradox, which significantly impacted computer science. Concepts such as formal language emerged from these attempts.

## Alonzo Church

> It is reassuring to design a programming language based on Lambda Calculus since its expressiveness is complete.
>
> Lee Kwang-geun, SNU 4190.310 Programming Languages Lecture Notes, p. 125.

Alonzo Church, a professor at Princeton University, suggested a new language called Lambda Calculus to establish the foundations of mathematics. This approach attempted to build mathematics using functions. Church believed this would enable a much simpler and paradox-free way of formalizing mathematics compared to existing set-based methods.

Church’s Lambda Calculus treated functions as if they were symbols themselves. For example, let there be a function $f(x)=x+1$, which takes $x$ and adds 1. It could be expressed as $f=\lambda x.x+1$. Here, $\lambda$ denotes the definition of the function, and $x$, which is the function's parameter, can be replaced with different symbols. By handling functions this way, all elements of mathematics could be expressed.

Since we are not delving deeply into Lambda Calculus here, we’ll stop at this point. If needed, feel free to refer to [my previous article for a brief introduction to Lambda Calculus](https://witch.work/ko/posts/javascript-closure-deep-dive-history#%EB%9E%8C%EB%8B%A4-%EA%B3%84%EC%82%B0%EB%B2%95%EC%97%90-%EB%8C%80%ED%95%B4%EC%84%9C).

In any case, Church used this Lambda Calculus to construct a logical system concerning the foundations of mathematics.

However, his students, Kleene and Rosser, later revealed that Lambda Calculus also harbored logical flaws, preventing it from constructing mathematics completely and perfectly in itself. Nonetheless, Church did not give up; instead, he simplified and modified Lambda Calculus and established a consistent computational framework using functions.

The system that Church established ultimately became the robust foundation for theories regarding functions. It also served as a theoretical basis for functional programming languages, such as Lisp.

## Hilbert

> In 1928, the year Mickey Mouse made his debut, a bold dream was spreading throughout the European mathematical community. It was a dream encouraged by David Hilbert, who led the mathematics of the time. (...) With just a few rules of inference, could mathematicians not fluidly discover the propositions to be proved?
>
> Lee Kwang-geun, "The World Opened by Computer Science: The Ideas that Changed the World through Computers and Software and the Future", p. 28.

David Hilbert was also a mathematician who dreamed of absolute stability in mathematics. He believed that it would be possible to overcome paradoxes and construct mathematics completely using only a few axioms.

As part of this work, Hilbert demonstrated several axioms to fill gaps in Euclid's classical geometry. He proved that his axiomatic system was consistent. He also showed that if there were contradictions in his axioms, contradictions would necessarily arise in the axioms of arithmetic as well.

All it required now was to demonstrate the consistency of the axioms of arithmetic to complete the picture. Hilbert presented 23 problems at the 1900 International Congress of Mathematicians, with the second being precisely this one: demonstrating the consistency of the arithmetic axioms.

He aimed to construct mathematics as a perfect system unto itself and proposed three conditions that any mathematical system must satisfy:

- Consistency: There must be no contradictions. A proposition and its negation cannot be proven simultaneously.
- Completeness: Every proposition must be provable as true or false within the system.
- Decidability: There must be a general procedure to prove propositions.

He hoped to discover a structure that fulfilled all three conditions. However, Hilbert's great dream did not last long. The mathematician Kurt Gödel, who was known for being the only individual to read "Principia Mathematica" entirely, had a keen interest in the foundations of mathematics and ultimately shattered Hilbert's dream.

# All Dreams End

And Gödel and Turing completely crushed all these dreams.

## Gödel's Incompleteness Theorem

> If there is a system that can simultaneously prove X is true and X is false, then that system can prove any statement. What does that make us mathematicians?
>
> Written by Paul Hoffman, translated by Shin Hyun-yong, "We Mathematicians Are All a Little Crazy", p. 298.

Kurt Gödel was born in 1906 in Brünn, then part of the Austro-Hungarian Empire. He later enrolled at the University of Vienna, where he studied physics. Eventually, after attending a course on number theory, he became captivated by mathematics and came to believe it was his calling.

After submitting a brilliant doctoral dissertation,[^7] Gödel continued his mathematical research and published a paper in 1931 titled "On Formally Undecidable Propositions of Principia Mathematica and Related Systems". In this paper, he proved the famous "Incompleteness Theorem," showing that attempts to establish a foundation for mathematics are essentially doomed to fail.

At that time, attempts to solidify the foundation of mathematics aimed to demonstrate that mathematics was complete in itself. This means that every proposition within the system could be proven within that system. Therefore, finding a solution without circular reasoning was crucial.

However, Gödel's paper demonstrated that this was impossible. He showed that in any logical system, there are propositions that are true but cannot be proven using the rules of that system.

This will be explored in more detail in other pieces, but it can be illustrated through the following logic. Consider the proposition defined within the system as follows. To be provable means that it can be derived from the axioms of the system, thus it is assumed to be true.

> $U$: $U$ is a proposition that cannot be proven within the system.

$U$ is always true. Suppose we assume $U$ is false. Then, asserting that $U$ is unprovable would be false, and hence $U$ must be provable. This leads to a contradiction, implying that $U$ must be true. This means $U$ cannot be proven within the system, indicating that there exists a proposition that is true when viewed externally but is unprovable within the system, contradicting the idea of completeness.

Now, consider the negation of $U$, $\neg U$. $\neg U$ refers to the proposition that $\neg U$ can be proven. However, we previously established that $U$ is true, so $\neg U$ must be false. Therefore, the proposition asserting that $\neg U$ can be proven is false, and hence $\neg U$ is also unprovable.

Since both $U$ and $\neg U$ are unprovable, consistency becomes impossible. Gödel also proved that if a logical system is consistent, then a proposition like $U$ must exist, effectively blocking the escape routes for logicists. Thus, the dream of making mathematics a complete closed world in itself came to an end. We cannot articulate every truth within the systems we create.

## Turing Machines Born from the Cracks of Mathematics

> The Turing Machine can, in principle, solve all mathematical problems presented in symbolic form. That British author successfully replicated the internal states of the human mind and the capacity for symbol manipulation—albeit on paper.
>
> Written by Benjamin Labatut, translated by Song Yesul, "Maniac", p. 188.

Gödel's incompleteness theorem completely overturned the mathematical landscape of the time. The atmosphere in academia was filled with the verification and propagation of Gödel's proof. This was similarly true during a lecture held in 1935 at Cambridge University led by Professor Max Newman, which discussed Gödel's proof. A young Alan Turing, who had just graduated from Cambridge, was in attendance.

Listening to Newman, Turing thought it was possible to reprove and also reinforce Gödel's incompleteness theorem. This was because the undecidability related to Hilbert's three conditions had not yet been demonstrated.

This undecidability referred to whether a calculable procedure exists that allows one to determine the truth or falsehood of a conclusion given a set of premises, all presented in proper form. More specifically, it referred to whether an algorithm exists that can determine the truth of propositions represented by regular expressions in first-order logic after a limited number of calculations.[^8]

This meant whether one could discover a mechanical algorithm that could substitute all inference! This was known as Hilbert's Entscheidungsproblem (decision problem). Following Gödel's proof, it was hard to believe such an algorithm existed. Nonetheless, the absence of proof that such an algorithm does not exist still remained.

In 1936, Turing published the paper "On Computable Numbers, with an Application to the Entscheidungsproblem," which established that no general algorithm could exist to solve Hilbert's decision problem.

## Concept of Turing Machines

> This specially designed theoretical computing machine can be proven to perform any task. In fact, it can replicate the operation of any machine. We might call this special machine a "universal machine."
>
> Alan Turing, in a 1947 speech at the London Mathematical Society.

In the aforementioned paper, Turing introduced the concept of the "Turing Machine," which would become the theoretical prototype of the computers we use today.

Turing first defined simple machine components and demonstrated that these could mimic all processes of human beings writing symbols on paper and calculating. The components of Turing's Turing Machine are as follows:

- An infinitely long tape: This tape contains symbols (of a finite type) that can move back and forth one square at a time.
- A device that reads or writes on the tape.
- A symbol indicating the current state of the device (of a finite type).
- A table of operation rules for the machine: This defines the next state, the symbol to write, and the tape's movement direction based on the current state and read symbol (defined in a 5-tuple format).

The defined machine operates according to the rules in the operation rule table. It reads the given tape, moves according to the operation rules, writes symbols, and changes its state. Turing claimed that this alone suffices to describe every computational process!

Moreover, the astonishing insight was that one universal Turing machine could perform all operations of any Turing machine. This universal Turing machine reads the tape describing the operations of any Turing machine and simulates that Turing machine's operation. This means that the activities of all Turing machines could be described merely by writing a finite number of types of symbols on the tape.

In other words, the symbols written on the Turing machine can be likened to a programming language. The universal Turing machine interprets the symbols on the tape and can perform specific actions. Turing further proved his original intention of re-proving and reinforcing Gödel's incompleteness theorem. He demonstrated that there always exist unsolvable problems, even with a machine capable of carrying out all computational actions.

This unsolvable problem is known as the "Halting Problem," which essentially asks whether there exists an algorithm that can determine whether a given Turing machine halts on a specified input. Turing utilized Cantor's diagonal argument to prove that no Turing machine could exist that could solve this problem.

Turing machines can describe all algorithms, but since they cannot solve the halting problem, there is no general procedure to solve every mathematical problem. Some problems are structurally insolvable. Thus, Hilbert's final dream also crumbled.

As a footnote, Church, mentioned earlier, also had shown that there are unsolvable problems via algorithms, using his own system called Lambda Calculus. Later, Turing and Church showed that Lambda Calculus and Turing Machines were equivalent and essentially arrived at the same proofs. This is now called the Church-Turing Thesis.

# On the Path to Computers

Frege attempted to establish mathematics through logic. Cantor sought to draw infinity into the fold of mathematics. Russell and Whitehead aimed to overcome paradoxes and reduce all of mathematics to provable axioms. Church sought another path but failed. Hilbert dreamed of making mathematics perfectly complete in itself. Then Gödel shattered all these dreams.

In the aftermath of the collapse of the mathematical dream, Turing demonstrated that all computational actions of humans could be reduced to the operations of simple machines. Although the system was imperfect and could never be made perfect, it encapsulated everything that humans had done in computation within a single simple machine.

Of course, people had dreamed of calculating machines long before Turing and had realized some aspects of them. However, prior to Turing, they believed that these machines consisted of three distinct elements: the machine itself, the program, and the data. The earliest machine referred to as a computer, ENIAC, performed calculations by altering cable connections to modify the machine's configuration.

Turing finally eliminated this distinction. All of these could be unified. In the Turing machine, the actions of the machine, the program, and the input data all existed on a tape made up of symbols. Just as we store code itself in files today, programs became data, and data could also become a program.

This unification formed the theoretical foundation for computers. However, all of this remained theoretical. Infinite-length tapes do not exist in reality. A machine that can only store a single state is of little significance.

The challenge of creating computers from theory intertwines with the developments of mechanical devices and historical necessities. New tools were needed. So now, let's delve into the necessary discussions that arose to bring Turing's theoretical concepts into reality.

# References

General knowledge covered in typical computer science courses greatly helped in understanding the researched content.

## Books

Martin Davis, translated by Park Sang-min, "Today We Call Them Computers", Insight

Lee Kwang-geun, "The World Opened by Computer Science: The Ideas that Changed the World through Computers and Software and the Future", Insight

Kawazoe Ai, translated by Lee Young-hee, "How Was the Computer Made?", Roadbook

Apostolos Doxiadis, Christos H. Papadimitriou, illustrated by Alekos Papadatos and Annie Di Donato, translated by Jeon Dae-ho, "Logicomix", RH Korea

Dermont Turing, translated by Kim Ui-seok, "How Did Computers Become Intelligent?", Hanbit Media

Alexander R. Galaway, translated by Lee Na-won, "Uncomputable: Play and Politics in the Long Digital Age", Rose and Camellia

Anthony Kenny, translated by Kim Young-geon et al., "A History of Western Philosophy", iJ Books

## Wikipedia Articles

- [Logicism](https://en.wikipedia.org/wiki/Logicism)
- [NP-hardness](https://en.wikipedia.org/wiki/NP-hardness)
- [Russell's Paradox](https://en.wikipedia.org/wiki/Russell%27s_paradox)

## Other Material

Hobby Science Episode 14 Mathematics, Is 1+1 Really 2? (feat. Professor Kim Sang-hyun)

https://www.youtube.com/watch?v=Qpi5Q6VgssI

Jeffrey Kaplan YouTube, Russell's Paradox - a Simple Explanation of a Profound Problem

https://www.youtube.com/watch?v=ymGt7I4Yn3k

Contemporary Logic Part 1: Frege’s Revolution

https://www.youtube.com/watch?v=9WvIc4AwL6o

Contemporary Logic Part 2: Current Systems and Methods

https://www.youtube.com/watch?v=pQO1t2Y627Y

Stanford Encyclopedia of Philosophy, Frege’s Logic

https://plato.stanford.edu/entries/frege-logic/

Stanford Encyclopedia of Philosophy, Russell's Paradox

https://plato.stanford.edu/entries/russell-paradox/

[^1]: Martin Davis, translated by Park Sang-min, "Today We Call Them Computers", p. 50.
[^2]: Frege remained an associate professor until his retirement, never promoted to full professor due to his colleagues not recognizing the value of his research.
[^3]: The symbols used in this article may not be shaped the same as those Frege introduced. While Frege presented symbols with the same meaning, the symbols commonly used today are of Italian logician Giuseppe Peano. Peano's notation was easier to type, and Bertrand Russell popularized its use. The exact shape of the symbols is not crucial, so this article employs widely-used Peano notation.
[^4]: Requoted from Alexander R. Galaway, translated by Lee Na-won, "Uncomputable: Play and Politics in the Long Digital Age", Rose and Camellia, p. 193.
[^5]: If you're interested, you might want to explore Cantor's paradox, Burali-Forti paradox, and Kleene-Rosser paradox.
[^6]: You may refer to the Stanford Encyclopedia of Philosophy's "Russell's Paradox" article or explore the history of mathematics regarding Zermelo-Fraenkel set theory and ZFC axiomatic systems.
[^7]: The content Gödel proved in his doctoral dissertation is called the "Completeness Theorem."
[^8]: Refer to Martin Davis, translated by Park Sang-min, "Today We Call Them Computers", pp. 144-146, 219-221.