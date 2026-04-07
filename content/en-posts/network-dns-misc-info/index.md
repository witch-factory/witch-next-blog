---
title: DNS Exploration Part 3 - Miscellaneous Information About DNS
date: "2025-06-19T00:00:00Z"
description: "This post summarizes DNS history, security, and other features that I couldn't cover in the previous articles."
tags: ["CS", "network"]
---

My thanks to [Vulcan](https://vulcan.site/), an acquaintance who runs a home server blog, for greatly helping me fill gaps in my networking knowledge and identify the right keywords to research.

# DNS Exploration Series

- [DNS Exploration Part 1 - The Flow of a DNS Query from Domain Name to IP Address](/posts/network-how-dns-works)
- [DNS Exploration Part 2 - How Is DNS Structured?](/posts/network-how-dns-structured)
- [DNS Exploration Part 3 - Miscellaneous Information About DNS](/posts/network-dns-misc-info)

# Introduction

In this post, I included topics I came across while researching DNS but couldn't fit into the previous articles without breaking their natural flow. I'll cover a brief history of DNS, security considerations, other features, and where DNS fits in the OSI 7-layer model.

# Before DNS

Today's Internet is based on RFC 791, Internet Protocol, published in 1981. This RFC defined the 32-bit address format now known as IPv4 and the communication model built on top of it, forming the foundation of how the Internet protocol works today.

The problem was that addresses alone were hard to use for identifying targets. For example, the IPv4 address `163.239.1.1` is assigned to Sogang University. But just looking at that address, it is hard to associate it with Sogang University. That is why host names were introduced. A host name like `sogang.ac.kr` is much easier to remember and understand. Then how do we map that to an IP address? As ideas around that problem developed, DNS emerged.

## HOSTS.TXT

In the early Internet, everyone shared a single file that mapped host names to IP addresses. This file was called `HOSTS.TXT`, a name that had already been used in ARPANET, the predecessor of the Internet.

When it began to be used on the Internet as well, the file was managed by SRI-NIC (Stanford Research Institute Network Information Center), one of the institutions that had strongly influenced ARPANET. It was reportedly updated by sending email to `HOSTMASTER@SRI-NIC`.

Its exact management process and format are described in [RFC 952](https://www.rfc-editor.org/rfc/rfc952.txt). You can also browse historical [HOSTS.TXT files in the HOSTS.TXT archive](https://github.com/ttkzw/hosts.txt?tab=readme-ov-file). You can even find names that appear to be Korean hosts, such as `KOREA-EMH`.

So in the early Internet, host name to IP address mappings were managed manually. This approach is called the `HOSTS.TXT` method, and traces of it still remain today in many operating systems as the `/etc/hosts` file.

```bash
# 터미널에서 /etc/hosts 확인하기
$ cat /etc/hosts
127.0.0.1	localhost
255.255.255.255	broadcasthost
::1             localhost
# ...
```

## The Emergence of DNS

As the Internet grew, this approach naturally ran into limits. Preventing duplication and keeping the `HOSTS.TXT` file consistent made management increasingly expensive, but this was also a time when the idea of dedicating significant resources to such administration was not yet common. On top of that, centralized management did not fit the Internet's distributed architecture.

The role of the Internet also changed. In the past, the Internet was a single network connecting institutions that operated large time-sharing systems. But computers became something owned by individuals rather than institutional time-sharing systems. The Internet also evolved into a network of networks, connecting local networks built around these personal computers. To adapt to these changes, the way host names and IP addresses were managed also had to change.

That led John Postel and Paul Mockapetris, both part of the early Internet pioneer community, to propose DNS. DNS stands for Domain Name System, a distributed database system that maps host names to IP addresses. DNS was first defined in 1983 in RFC 882 and RFC 883, and later refined in RFC 1034 and RFC 1035. It began to see practical use around 1985.

# DNS and Security

Since DNS is both a server system and a network service, it can also be a target of attacks. Let's briefly look at some of those attacks and the techniques used to defend against them.

## DNS Reflection Attacks

Earlier, I mentioned that DNS servers handle delegation in the hierarchy through NS records. When one DNS server refers a query to another, it responds with both an NS record containing the delegated DNS server's host name and an A record containing the IP address of the server receiving the delegated query. This mechanism can be abused for attacks.

As mentioned before, DNS uses the UDP protocol. One issue with UDP is that it is vulnerable to IP spoofing. So if the source IP address is forged, a response to a DNS query sent from the attacker's DNS server can be redirected somewhere else. The attacker then amplifies the attack packet by making the DNS server return a response much larger than the original query.

For example, if a query is sent with the host name `.` and type NS, the victim can receive a response much larger than the size of the query. Quantitatively, a query of around 60 bytes can reportedly generate an attack packet of 512 bytes or more.[^1]

![DNS reflection attack](./dns-reflection.png)

The most basic way to prevent this kind of attack is to restrict which resolver IP addresses can access the DNS server. For example, if you configure a full resolver directly, you might set it to accept queries only from localhost.

However, public DNS resolvers or DNS servers that accept third-party queries use a variety of additional protections against DNS reflection attacks. They may deploy mechanisms to prevent IP spoofing, disable `ANY` requests that ask for the largest possible DNS response, or delay queries from specific resolvers or clients based on load patterns. For more details, see [America's Cyber Defense Agency's document on DNS amplification attacks](https://www.cisa.gov/news-events/alerts/2013/03/29/dns-amplification-attacks).

## DNSSEC(DNS Security Extensions)

Attackers can launch DDoS attacks against DNS servers or cause clients to query malicious DNS servers so that users receive malicious IP addresses in response. Techniques such as [DNS cache poisoning](https://www.cloudflare.com/ko-kr/learning/dns/dns-cache-poisoning/) are examples of this.

If such an attack succeeds, users may connect to a website served from a malicious IP address without noticing anything unusual. To prevent this, DNS provides an extension called DNSSEC(DNS Security Extensions).

DNSSEC is an extension for validating DNS responses. Specifically, it verifies whether they came from a legitimate source. DNSSEC introduces new DNS record types such as RRSIG, which contain cryptographic signatures, allowing clients to verify that a DNS record response came from the appropriate authoritative DNS server and was not altered in transit. It uses public-key cryptography.

The process works like this. Records with the same label and type are grouped into a resource record set (RRSet), and a digital signature is generated for that set and stored in an RRSIG record. The public key needed to verify that signature is stored in a DNSKEY record.

As you move through the DNS hierarchy described earlier, trust is established by having each upper layer verify that the lower layer's records have not been modified. This uses DS records, which store hashes of DNSKEY values.

Putting this together, DNSSEC verifies the origin and integrity of DNS responses by having the local DNS server validate RRSIG signatures with DNSKEY records and confirm through the parent DNS server's DS record that the child DNS server's records have not been altered.

This parent-verifies-child model has one obvious issue: there is no higher layer above the root DNS servers to validate root information. Therefore, the signature used to validate the root DNS servers is determined through the [root signing ceremony](https://www.cloudflare.com/ko-kr/learning/dns/dnssec/root-signing-ceremony/), in which 14 people selected from around the world gather to sign the root DNSKEY RRset.

This encryption and validation process is fairly complex, and it is not closely tied to the basic DNS behavior I originally had in mind, so I only covered it briefly here. For more details, see [How does DNSSEC work?](https://www.cloudflare.com/ko-kr/learning/dns/dnssec/how-dnssec-works/) and [What is DNSSEC and how does it work?](https://www.akamai.com/ko/blog/trends/dnssec-how-it-works-key-considerations).

# Other DNS Information

## DNS for Web Server Load Distribution

A DNS server can return multiple IP addresses in a response. For web servers with multiple IPs, this can be used as an attempt to distribute load across those servers.

Popular domains such as "google.com" have multiple IP addresses. A DNS server can rotate the order of those addresses when responding. For example, suppose "google.com" has three IP addresses. In that case, the DNS server could return them in the order `IP 1, IP 2, IP 3` for the first response, then `IP 2, IP 3, IP 1` for the second, and `IP 3, IP 1, IP 2` for the third.

```
First query response         Second query response      ....
+-----------------+    +-----------------+
| IP address 1    |    | IP address 2    |
+-----------------+    +-----------------+
| IP address 2    |    | IP address 3    |
+-----------------+    +-----------------+
| IP address 3    |    | IP address 1    |
+-----------------+    +-----------------+
```

When clients receive multiple IP addresses like this, they usually send the HTTP request to the first IP address in the list. That lets the operator distribute incoming request load across servers using DNS alone.

## DNS Is an Application Layer Protocol

When describing network architecture, the OSI 7-layer model is commonly used. So which layer does the DNS protocol belong to in that model?

From personal experience, I remember being asked this in an interview and struggling because I didn't know the answer. Now I do: DNS is a layer 7 protocol, part of the application layer.

The application layer is the layer closest to the user. What we usually think of as a network's function is exchanging data between different endpoints on the network, and the application layer defines the protocols for exchanging messages carrying that data between those endpoints. Typically, it defines things like the following:

- What kinds of messages are exchanged, such as request messages and response messages
- The syntax that structures different message types
- The meaning of each field in a message
- When and how a process sends messages and receives responses

The DNS protocol fits this application-layer definition very well. It defines how messages are exchanged between distinct network endpoints: the client and the DNS server.

Also, DNS messages use port 53 and are transmitted over UDP, which is a transport-layer protocol. That also supports the idea that DNS sits above the transport layer in the abstraction stack, making it an application-layer protocol. Of course, in the OSI 7-layer model there are the session and presentation layers between the transport layer and the application layer, but in practice the distinction between layers 5, 6, and 7 is often unclear. In this context, the socket serves as the interface between the application layer and the transport layer.

DNS is not directly tied to user-facing applications in the same way as HTTP or SMTP for email. Instead, DNS hides the complexity of the Internet's structure from network users and lets them conveniently use host names. Still, if you look at how it works, it clearly shows the characteristics of an application-layer protocol.

# References

[Paul V. Mockapetris, Kevin J. Dunlap, Development of the Domain Name System](https://www.cs.cornell.edu/people/egs/615/mockapetris.pdf)

James F. Kurose, Keith W. Ross, translated by Choi Jong-won, Kang Hyun-guk, Kim Ki-tae, and 5 others, Computer Networking A Top-Down Approach, 8th edition

Gijutsu-Hyoronsha Editorial Department, edited, translated by Jin Myeong-jo, Textbook for Infrastructure Engineers, System Construction and Management Edition, Chapter 5, "The Latest DNS Textbook"

cloudflare, How does DNSSEC work?

https://www.cloudflare.com/ko-kr/learning/dns/dnssec/how-dnssec-works/

cloudflare, DNSSEC Root Signing Ceremony

https://www.cloudflare.com/ko-kr/learning/dns/dnssec/root-signing-ceremony/

IBM Technology, "What is DNSSEC (Domain Name System Security Extensions)?"

https://www.youtube.com/watch?v=Fk2oejzgSVQ

What is a DNS DDoS attack?

https://www.akamai.com/ko/glossary/what-is-a-dns-ddos-attack

[^1]: Gijutsu-Hyoronsha Editorial Department, edited, translated by Jin Myeong-jo, Textbook for Infrastructure Engineers, System Construction and Management Edition, p. 271