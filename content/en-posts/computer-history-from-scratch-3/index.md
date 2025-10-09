---
title: Computer Chronicle 3. Machines that Move Logic
date: "2025-05-19T00:00:00Z"
description: "The machines and devices needed before computers existed. From electricity and automation to telegraphy, telephony, and vacuum tubes."
tags: ["history", "computer"]
---

![Thumbnail](./thumbnail.png)

# List of the Computer Chronicle Series

| Series | Link |
| --- | --- |
| Computer Chronicle 0 - Introduction | [Link](/ko/posts/computer-history-from-scratch-0) |
| Computer Chronicle 1 - The First Steps Toward Thinking Machines | [Link](/ko/posts/computer-history-from-scratch-1) |
| Computer Chronicle 2 - The Dream and Failure to Perfectly Explain the World with Logic | [Link](/ko/posts/computer-history-from-scratch-2) |
| Computer Chronicle 3 - Machines that Move Logic | [Link](/ko/posts/computer-history-from-scratch-3) |

- I have made an effort to investigate, but if there are any mistakes, feedback through comments is welcome.

# Introduction

Today's computers are not just devices for calculation. They are systems that can process information, remember states, and control complexity. The theoretical starting point for this was Alan Turing's paper from 1936.

However, the theory of computers did not mean that computers appeared instantly. There was a gradual process of replacing calculations, control, and information transmission with mechanical means. In this process, the components needed to implement computers began to take shape. Let's explore how these pieces emerged.

# The Age of Electricity

The 19th century was truly the age of electricity. People learned to harness electricity, which was once considered a mysterious natural phenomenon. Starting with Alessandro Volta's invention of the first chemical battery in 1800, the arc lamp appeared in 1807, and the telegraph was introduced in 1844.

Understanding of electricity deepened as Hans Christian Ørsted and André-Marie Ampère provided the basis for the concept of electromagnetism. Scientists like Michael Faraday and James Clerk Maxwell established theories for unifying electromagnetism. These technologies would later propel the Second Industrial Revolution.

So, what does this have to do with computers? During the exploration of electricity and the emergence of related technologies, components necessary for computers began to appear.

Electricity was not merely a new power source. It became a new means for transmitting information and controlling machines. It was the key to enabling machines to respond on their own without human intervention. Previous tools, empowered by electricity, opened the door to making computers a reality.

# Machines that Read Patterns

Having electricity did not mean that computers would immediately appear. Devices capable of reading patterns, interpreting commands, and reacting based on conditions were necessary.

## Jacquard's Loom

In 1801, Joseph Marie Jacquard invented a fully automated loom that could weave patterns. Previously, weaving required two people: the master weaver operated the loom while an assistant manually controlled the threads based on instructions. Jacquard's loom replaced the assistant's role with a machine. By creating a pattern on a punched card, the machine could be operated repeatedly.

This loom could automatically repeat complex patterns using a bundle of connected punched cards. Previous automatic devices mainly relied on perforated paper tape, which was less stable. However, the punched card bundles could operate very reliably over long periods. Jacquard used 24,000 punched cards to create his own portrait. It is said that techniques like backing allowed primitive forms of loops, similar to modern programming.

Jacquard's loom and punched cards became the foundation of pattern-based control systems, influencing programming techniques for years to come.

## Charles Babbage

Frustrated by repeated errors in logarithmic tables used for complex calculations, Charles Babbage thought, "If only I could use a steam engine to perform numeric calculations!"

In the early 19th century, Babbage envisioned a difference engine that would calculate polynomial results by turning a crank and even devised a structure similar to modern computers called the Analytical Engine. This was a remarkable endeavor considering there were no standard components or computer-like structures at that time.

However, Babbage's attempts were too ahead of his time. His difference engine and Analytical Engine were never completed, and he was largely forgotten until rediscovered in the mid-20th century. His initiatives did not have a direct impact on the development of computers.

Still, he proposed and designed the first "programmable general-purpose calculator." Even though his groundbreaking but lonely efforts went unimplemented, their significance was not small.

Babbage reportedly expressed a desire to wake up 500 years later to see how the world had changed. Little did he know, within a century of his death, the world was filled with his Analytical Engines.

## Hollerith's Tabulator

Unlike Babbage, Herman Hollerith achieved many useful innovations that earned him considerable wealth and lasting fame. 

The U.S. Constitution mandates a census every ten years. As the population rapidly grew, the speed and accuracy of the census became pressing issues. In 1870, Charles W. Seaton created a machine to assist in data compilation, but improvements were slow.

The 1880 census, covering around 50 million people, took eight years to process. If this trend continued, the next census might take over ten years.

Herman Hollerith emerged at this time. He invented a machine that organized census information using punched cards and automatically classified data through electrical reading. Each card represented a person, with holes indicating specific information.

Metal pins would touch the card to complete circuits, prompting the machine to categorize the cards appropriately. For example, if a specific hole indicated a male, that card would be classified as representing a male. Because criteria could change, it was also possible to program the machine to choose cards based on hole positions.

This idea was inspired by train tickets, where certain attributes were indicated by holes for inspectors to identify. It is also believed that Hollerith's work benefited from Jacquard's loom, as his brother-in-law operated a loom.

Hollerith patented this technology, enabling a much faster census process. Initially, programming relied on wiring panels but evolved to use punched cards.

Hollerith founded the Tabulating Machine Company based on this machine, which won contracts to use his devices in other countries' censuses. His technology was later expanded for applications in agriculture statistics and railroad data.

The Tabulating Machine Company was later acquired by Charles Ranlett Flint, who merged it with several other companies to form the Computing-Tabulating-Recording Company, widely known as CTR. Hollerith served as a consultant there.

In 1924, CTR changed its name to what we now know as IBM (International Business Machines), which would dominate the computer market for years.

# Transmitting Signals Electrically

## Birth of the Telegraph

Human beings have an innate desire for discovery and innovation. Long before Faraday and Maxwell revealed the natural laws of electromagnetism, people had been experimenting with electricity for communication.

In 1746, Jean Antoine Nollet, a French priest, conducted an experiment sending signals using electricity. He had 200 priests hold a brass rod connected over a mile, sending electricity through them.

The priests experienced electric shocks, causing paralysis. Nollet concluded that electricity travels at infinite speed, a reasonable notion at the time without an understanding of light speed. This was an experiment to recognize the potential of electric communication.

Years later, the story begins with Samuel Morse, an artist who faced personal tragedy. While a successful portrait painter, Morse frequently traveled for work, leaving home often.

Tragically, during one of his absences, his wife passed away. In that era, there was no rapid means to convey such news, so Morse only learned of her death after the funeral.

While returning from a trip to Europe for an exhibition, Morse overheard discussions about electric communication. Inspired by his recent loss, he decided to create a device that used electric signals for communication. After years of research and collaboration, he successfully invented the telegraph in 1837.

The telegraph network between Washington and Baltimore launched in 1844, rapidly expanding nationwide. Within just a decade, the telegraph spanned over 40,000 miles across the U.S.

Morse also developed a code system for telegraph communication, known as Morse Code, which encodes letters using a series of short and long signals. This concise method is still in use today.

## Switch for Transferring Signals - Relay

Relays are vital devices. They are switches controlled by electrical current instead of manual operation. With relays, amazing things can be accomplished, even creating remarkable devices like computers.

The principle of the telegraph is straightforward. When electricity flows through a wire at the sending end, it is transmitted to the receiving end. The electric current activates an electromagnet, attracting a recording tool that writes out Morse code.

While this method of recording Morse code directly is inefficient, it showcased a method for sending information using electricity. Other electric communication methods existed, but Morse's system proved to be the most reliable.

However, Morse's system had its limitations. Wires have resistance, so if they are too long, the signal weakens, making it difficult to transmit effectively. How could this be resolved?

A common solution for long-distance transmission is to place relay stations along the route. For instance, imagine sending a telegraph from Seoul to Busan. A small telegraph office in Daegu could receive the message and send it onward, relaying the signal.

But was it necessary to have a staff member at each relay? By using electromagnets to activate a switch at relay stations, signals could be transmitted without human intervention.

This device came to be known as a relay. It signified sending signals in a "relay" fashion. Morse utilized relays to address the challenges of long-distance communication, significantly extending the distance over which his technology could operate.

Joseph Henry, the director of the Smithsonian Institution, is credited with inventing the relay and informing Morse of its concept.

However, the relay's significance extended beyond just signal transmission. It became a control device, allowing switch operation through current and enabling the implementation of circuits. This served as the physical foundation for logical operations like AND, OR, and NOT that form today’s computers.

While this article won't explore this deeply, it’s worth noting that early computers like Konrad Zuse's Z3 and Harvard University's Mark I were built using relays. In theory, a modern computer could also be constructed solely with relays, though it would require an impractically large number of components.

So, theoretically, a computer could be realized entirely with relays. However, the practical issues were significant: relays were slow and bulky. The method of using electromagnets to pull switches was much slower, and metal contacts were subject to wear.

To create more practical computers, faster and smaller switches were needed. The vacuum tube solved this problem.

# Evolution of Switches

## The Rise of Vacuum Tubes

In 1882, Thomas Edison, known as the "Wizard of Menlo Park," was experimenting with issues related to carbon particles in light bulb filaments. With advice from his scientific consultant, Francis Upton, Edison tested placing a copper plate over the filament.

Unexpectedly, Edison discovered that when a positive voltage was applied to the copper plate, current flowed from the filament to the plate. The bulb was in a vacuum, where current was believed not to flow, making this a groundbreaking discovery.

However, Edison showed little interest in this newfound phenomenon, partially due to a lack of understanding of electricity at the time. Since the electron had not yet been discovered, no one could provide a clear explanation for it. Edison simply patented the device and moved on to other experiments.

This experiment result was known to few, one of whom was John Ambrose Fleming, a technical advisor for Edison-GE in the UK. Fleming later experimented with the filament, finding that an alternating current could generate direct current in the copper plate, a process known today as rectification.

As time passed, the need for reliable wireless telegraph systems across the Atlantic arose in the early 1900s. However, existing signal detectors lacked the required sensitivity. Fleming recalled his past experimentation with rectification and set out to create a new device.

In 1904, Fleming invented the two-electrode vacuum tube, capable of rectifying signals. It could detect weak alternating signals, enabling long-distance wireless telegraph communication.

In 1906, Lee De Forest invented the three-electrode vacuum tube, enhancing Fleming’s design with a grid electrode. By applying voltage to the grid, one could control the current flowing between the cathode and anode, acting as an amplifier.

Three-electrode vacuum tubes could also function as switches since voltage applied to the grid could turn the current on or off. It had drawbacks: it was expensive, consumed a lot of power, generated heat, and had a short lifespan. But it was smaller than relays and operated over 1000 times faster.

## Voice Crossing Continents

In 1876, Alexander Graham Bell filed a patent for the telephone. Based on this patent, he and his father-in-law, Gardiner Hubbard, established the Bell Telephone Company, which grew into a massive enterprise known as AT&T by 1907.

However, as telephone patents expired and many competitors entered the market, AT&T began losing significant market share. To differentiate itself, the company decided to build a large-scale telephone network connecting the entire U.S.

To do this, AT&T faced challenges similar to those encountered by the telegraph. Signals weaken over long distances due to wire resistance. An engineer at AT&T's subsidiary, Western Electric, proposed using De Forest's three-electrode vacuum tube to amplify signals.

AT&T purchased the three-electrode vacuum tube patent for just $50,000, and this design functioned exceptionally well. Telecommunication services were extended nationwide utilizing these tubes.

In 1914, AT&T held a ceremony to inaugurate a transcontinental telephone line from New York to San Francisco, inviting the now-elderly Bell to communicate with Watson on the other side of the continent. Bell echoed, "Watson, come here, I need you," words he had first spoken decades earlier.

Afterward, AT&T heavily invested in the three-electrode vacuum tube, leading to rapid growth in related businesses. Soon, various attempts greatly improved the tubes, allowing voices and music to flow through the air, marking the advent of radio.

## Radio and RCA from Vacuum Tubes

The introduction of three-electrode vacuum tubes dramatically expanded communication possibilities. Radio waves could travel farther, and even the faintest signals could now be amplified and controlled. Edwin H. Armstrong developed a method to transmit voice signals via electromagnetic waves using three-electrode vacuum tubes, leading companies like GE and AT&T to start developing radios.

The technology advanced rapidly due to military needs. The U.S. Navy, heavily utilizing radio technology, recognized it as a security asset and pursued new ways to control civilian technology.

Thus, RCA (Radio Corporation of America) was established in 1919 through investments from GE, AT&T, and Westinghouse, with the Navy retaining some control over national security matters.

RCA was not merely a manufacturer. It integrated diverse technologies, patents, and communications networks, operating almost as a monopoly under U.S. government support. RCA made significant contributions to building a media empire, creating broadcasting networks and actively acquiring competitors, establishing a wireless communication framework centered around the U.S.

The advancement of vacuum tubes through AT&T's telephone systems and RCA's radio industry led to continuous improvements and lower costs for vacuum tubes. They became the heart of a new media environment rather than merely physical devices. This influence peaked in the 1930s, with RCA's vacuum tube catalog becoming a must-have for electronics enthusiasts.

# Turing Sees Computers in Vacuum Tubes

In 1943, Alan Turing, returning from a months-long visit to the U.S., was seen holding an RCA catalog. Through interactions with Claude Shannon at Bell Labs, he learned that vacuum tubes could be used to implement logical circuits.

Always contemplating the realization of a universal machine, Turing quickly became convinced that he could create the universal machine he envisioned using vacuum tubes. The RCA catalog was not just a tedious listing of components but a specification for bringing a theoretical universal machine to life.

Experiments rooted in electricity began to converge into a single line. Seemingly unrelated discoveries paved the way for machine memory and control, ultimately leading to what we now recognize as Turing machines and computers. In the next article, we will finally explore the stories of the first computers that emerged in reality and the wars and individuals connected to their birth.

# References

Knowledge from general computer science courses significantly aided the understanding of this article. In particular, classes on digital circuits and computer architecture were immensely helpful.

## Books

Joel Shurkin, translated by Science Generation, "The Heroes Who Made Computers," 1992, Pulbit.

Martin Davis, translated by Park Sang-min, "Today We Call It a Computer," Insight.

Der-Muth Turing, translated by Kim Ui-seok, "How Calculators Became Artificial Intelligence," 2019, Hanbit Media.

Alexander R. Galloway, translated by Lee Na-won, "Uncomputable: Play and Politics in the Long Digital Age," 2023, Camellia and Dongbaek.

Doran Swade, translated by Lee Jai-beom, "Gear Computers," 2016, Knowledge Space.

Charles Petzold, translated by Kim Hyun-kyu, "CODE 2nd Edition," 2023, Insight.

Lee Kwang-geun, "The World Opened by Computer Science: The Computer That Changed the World, the Source Ideas of Software, and the Future," Insight.

Derek Cheung and Eric Brack, translated by Hong Seong-wan, "Conquering Electronics," 2015, Knowledge's Wing.

Choi Rino, "One Book to Finish Understanding Semiconductors,"

T. R. Reed, translated by Kim Ui-dong, "Chips: Rulers of the Digital World," 2003, Bada Publishing.

## Wikipedia Articles

- [Relay](https://en.wikipedia.org/wiki/Relay)
- [Thermionic emission](https://en.wikipedia.org/wiki/Thermionic_emission)
- [Joseph Marie Jacquard](https://en.wikipedia.org/wiki/Joseph_Marie_Jacquard)
- [History of computing hardware](https://en.wikipedia.org/wiki/History_of_computing_hardware)
- [Tabulating machine](https://en.wikipedia.org/wiki/Tabulating_machine)
- [1880 United States census](https://en.wikipedia.org/wiki/1880_United_States_census)
- [Punched card](https://en.wikipedia.org/wiki/Punched_card)
- [Herman Hollerith](https://en.wikipedia.org/wiki/Herman_Hollerith)
- [Charles Ranlett Flint](https://en.wikipedia.org/wiki/Charles_Ranlett_Flint)
- [Computing-Tabulating-Recording Company](https://en.wikipedia.org/wiki/Computing-Tabulating-Recording_Company)
- [Electricity](https://ko.wikipedia.org/wiki/%EC%A0%84%EA%B8%B0)
- [Harvard Mark I](https://en.wikipedia.org/wiki/Harvard_Mark_I)
- [Flip-flop (electronics)](https://en.wikipedia.org/wiki/Flip-flop_(electronics)) 

## Other Sources

Napoleon and Computers... Herman Hollerith 

https://www.sedaily.com/NewsView/1KSO8TYTRJ 

Professor Choi Rino's Understanding Semiconductors Series 

https://news.skhynix.co.kr/series/choirino-column/ 

What is the difference between a Latch and a Flip-Flop? 

https://www.reddit.com/r/AskElectronics/comments/cm0fs2/what_is_the_difference_between_a_latch_and_a/ 

[^1]: The term 'computer' originally referred to a person performing calculations, not the machines we think of today. This concept, especially about 20th-century female computers, is well documented in works like "Hidden Figures." Historical accounts about human computers can also be found in the referenced books.

[^2]: Jacquard did not create something entirely new from scratch, but rather rediscovered and combined existing technologies, as outlined in the Wikipedia article "History of computing hardware" and Alexander R. Galloway's "Uncomputable."

[^3]: If time permits, this will be addressed in an appendix. For reference, Joel Shurkin's "The Heroes Who Made Computers" and Doran Swade's "Gear Computers" can provide further insights.

[^4]: For a detailed discussion on this operation, see Joel Shurkin's "The Heroes Who Made Computers."

[^5]: For additional information, refer to Charles Petzold's "CODE."

[^6]: It is generally agreed that Bell was not the first to invent the telephone. A long story exists around this, but it does not pertain to the flow of this article. For interest, Seth Shulman's "The Greatest Science Hoax" can provide additional context.