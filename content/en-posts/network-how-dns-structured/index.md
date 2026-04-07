---
title: Exploring DNS Part 2 - How DNS Is Structured
date: "2025-06-19T00:00:00Z"
description: "Let’s take a closer look at how DNS is actually structured. How do servers store information, what format do they use to exchange messages, and how do they reduce load?"
tags: ["CS", "network"]
---

I got a lot of help from an acquaintance, [Vulcan](https://vulcan.site/), who runs a home server blog, both in filling gaps in my networking knowledge and in identifying the right keywords to research.

# DNS Exploration Series

- [DNS Exploration Part 1 - The flow of DNS requests that turn domain names into IP addresses](/posts/network-how-dns-works)
- [DNS Exploration Part 2 - How DNS is structured](/posts/network-how-dns-structured)
- [DNS Exploration Part 3 - Miscellaneous information about DNS](/posts/network-dns-misc-info)

# Getting started

In the [previous post](/posts/network-how-dns-works), I looked at how DNS handles our requests, including the resolver that sends messages to DNS servers and the processing performed by DNS servers.

In this post, let’s take a closer look at how DNS is actually structured—how it stores information, what format it uses to exchange messages, and how it reduces load.

# DNS server structure

DNS consists of two components: DNS servers and resolvers. A DNS server acts as a repository that stores information and responds to queries based on the data it holds. A resolver acts as the interface for user programs and implements the algorithm that locates the right server and sends queries to it.

But I already explained in detail in Part 1 how a resolver finds the appropriate DNS server and sends queries. So in this post, let’s focus on the structure of DNS servers and how they store information.

## DNS name hierarchy

Every hostname must be unique across the entire Internet. It would be a problem if multiple sites had the domain name `witch.work`.

To guarantee this uniqueness, DNS organizes its internal name space as a tree with variable depth. Each node in the tree has a label, and each label is limited to 63 characters or fewer.

A node’s hostname is formed by joining the labels from the root of the tree down to that node with dots (`.`). For example, `witch.work` is the hostname of the `witch` node under the `work` TLD (Top Level Domain). This ensures that every node’s hostname is unique across the Internet.

![DNS name hierarchy](./namespace-tree.png)

However, a unique hostname does not mean there is only one record with that hostname on a DNS server. As we’ll see in the next section, a single hostname can map to multiple pieces of information within DNS.

## Delegation of administration

In the previous post, I said that DNS is hierarchical. So who manages each level?

First, the root DNS servers are managed by IANA (Internet Assigned Numbers Authority), which is part of ICANN (Internet Corporation for Assigned Names and Numbers).

As you would expect from a distributed database, there is not just one central root DNS server. The root DNS system consists of 13 servers operated by 12 different organizations, with more than 1,000 instances (copies) distributed around the world.

The TLD DNS servers directly below them were originally managed by SRI-NIC. Today, however, management has been delegated to various organizations in different countries. For example, the `.com` TLD is managed by VeriSign in the United States, and the `.kr` TLD is managed by KRNIC under the Korea Internet & Security Agency.

This is how DNS delegates management of lower levels to other organizations. The unit of delegation is called a zone, which you can think of as a subtree in the hierarchy shown above. An organization that is delegated a zone can define its own policies for managing that zone. For example, the organization managing the `.gov` TLD restricts its use to U.S. government agencies.

# How DNS servers store information

Now we know that DNS servers are organized hierarchically. But what information do they store, and how?

## Resource records

DNS servers map hostnames to various kinds of information. Sometimes that is an IP address. Sometimes it is the hostname of the authoritative DNS server for that hostname. Sometimes it is an alias hostname. So how is all of this stored?

The DNS protocol does not strictly limit the kinds of data that can be associated with a hostname. But for queries and responses between clients and servers to work properly, some minimal data format is necessary. This is called a Resource Record (RR).

A DNS server stores values in a type-specific format using hostname, type, and class as the key. When a query arrives, the server looks up the corresponding information for that key and returns it in the response. That key-value pair is a resource record. Even the hostname-to-IP-address mapping that happens every time we access a site in a browser is done through resource records.

A resource record has the following format.

```
<Name> <TTL> <Class> <Type> <Value>
```

The meanings of `<Name>` and `<Value>` depend on `<Type>`. The most commonly used record types, and the meanings of Name and Value for each, are as follows. For more record types, see [Cloudflare’s overview of DNS records](https://www.cloudflare.com/ko-kr/learning/dns/dns-records/).

- A: Name is a hostname, Value is an IPv4 address
- AAAA: Name is a hostname, Value is an IPv6 address
- NS: Name is a domain, Value is the hostname of the DNS server that has the IP address for hosts in that domain
- CNAME: Short for Canonical Name. Name is an alias hostname, Value is the original hostname
- MX: Name is a domain, Value is the canonical hostname of the mail server for which `Name` is an alias

`<TTL>` stands for Time To Live and indicates how long the record remains valid. In other words, it is how long the record can remain in cache before being removed.

If a DNS server is authoritative for hostname X, then it includes an A or AAAA record for X. To find the authoritative DNS server for a hostname, DNS uses NS records.

Inserting new records into DNS is handled by registrars accredited by ICANN. You can find the list here: [ICANN, List of Accredited Registrars](https://www.icann.org/en/contracted-parties/accredited-registrars/list-of-accredited-registrars).

I registered the `witch.work` domain through Cloudflare, which is also on that list.

## Looking up resource records

To inspect the resource records stored on a DNS server, you can use the `nslookup` command. It sends a query to a DNS server and prints the response in a readable format. For example, to check the A record for `witch.work`, run the following command.

```bash
nslookup -type=A witch.work

# 응답
Name:	witch.work
Address: 104.21.32.1 # Cloudflare의 IP 주소이다
# 다른 IP 주소가 있을 수도 있다
```

If you want more information, you can use the `dig` command. It stands for Domain Information Groper and sends a query to a DNS server, then prints a detailed response. It is installed by default on MacOS, and on other operating systems you can install it separately. Besides simple lookups, it can also specify DNS servers, trace resolution paths, and more. See [Using the dig command for DNS lookup and diagnostics](https://www.daleseo.com/dig/) for details.

With `dig`, you can see the DNS header, query contents, and response in detail as shown below. In practice, it also shows things like query time and which servers were involved, but I’ve omitted that here to keep it short. You can see that a query made up of hostname, type, and class is sent to the DNS server, and the DNS server responds with the matching resource record.

```bash
$ dig witch.work

; <<>> DiG 9.10.6 <<>> witch.work
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 11209
;; flags: qr rd ra; QUERY: 1, ANSWER: 7, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
;; QUESTION SECTION:
;witch.work.			IN	A

;; ANSWER SECTION:
witch.work.		300	IN	A	104.21.80.1
# ...
```

## The class field

There is one field in resource records that I haven’t mentioned yet: `<Class>`. In most cases, the `IN` class is used, and in ordinary situations you will rarely see anything else. Still, it is worth covering the basics.

This field indicates what kind of network protocol or instance the resource record applies to. The `IN` class we normally see means Internet. What about the others? The classes defined in [RFC 1035](https://www.rfc-editor.org/rfc/rfc1035.txt) are as follows.

> 3.2.4. CLASS values
> 
> CLASS fields appear in resource records. The following CLASS mnemonics and values are defined:
> 
> IN              1 the Internet
> 
> CS              2 the CSNET class (Obsolete - used only for examples in some obsolete RFCs)
> 
> CH              3 the CHAOS class
> 
> HS              4 Hesiod [Dyer 87]

In addition to the familiar `IN`, there are other classes. They are rarely used today, but remain for historical reasons. Here is a brief summary of each along with references.

- CS was the class used for the CSNET network. CSNET was built for institutions that could not connect directly to ARPANET, and later became part of the transition through NSFNET to the Internet. See the [Wikipedia article on CSNET](https://ko.wikipedia.org/wiki/CSNET).
- CH is the class for Chaosnet, a local network designed for Lisp Machines to use the Lisp language more efficiently. See [A Short History of Chaosnet](https://twobithistory.org/2018/09/30/chaosnet.html).
- HS refers to the name service used in Project Athena, a distributed computing project developed at MIT. See the [Wikipedia article on Project Athena](https://en.wikipedia.org/wiki/Project_Athena) and the [Wikipedia article on Hesiod](https://en.wikipedia.org/wiki/Hesiod_(name_service)).

## NS records and delegation

Earlier, I said that DNS is managed through hierarchy and delegation. That delegation is also implemented through resource records in the database, specifically records of type NS. An NS record maps a hostname to the hostname of the authoritative DNS server for that hostname. In other words, it is used to find the DNS server responsible for a zone.

For example, root servers store delegation information for TLD servers, so they contain NS records like these.

```
work.			172800	IN	NS	a.nic.work.
work.			172800	IN	NS	b.nic.work.
work.			172800	IN	NS	c.nic.work.
work.			172800	IN	NS	x.nic.work.
work.			172800	IN	NS	y.nic.work.
work.			172800	IN	NS	z.nic.work.
```

The next step is to find the IP address of the TLD DNS server. But to find the IP address of the `work.` TLD DNS server, you need to look up `a.nic.work.` (or `b.nic.work.` or another value), and to do that you would already need to know the address of the `work.` TLD DNS server. That creates a contradiction.

To solve this, when a DNS server responds, it also includes A records for addresses like `a.nic.work.`. Also, specifically to prevent this kind of contradiction in NS information, name indirection through CNAME records is not allowed. So in principle, the actual response from a root server would look something like this.

```bash
work.			172800	IN	NS	a.nic.work.
# 기타 NS 레코드들...
a.nic.work.		172800	IN	A  37.209.192.10
# 기타 A 레코드들...
```

# DNS messages

In [DNS Series Part 1](/ko/posts/network-how-dns-works), I said that DNS request messages use UDP and are sent over port 53. We also just looked at how DNS servers store information. So what exact format is used to exchange that information?

## DNS message format

First, the data exchanged between DNS servers and clients is in binary format and consists of a DNS header, query information, and lookup results. Each of these contains multiple fields, but let’s first look at the overall structure.

![DNS message structure](./dns-message-structure.png)

Some of this should look familiar. The query information and lookup results are exactly what I described earlier. Since a DNS server uses hostname, type, and class as the key, those become the query information, and the lookup results are the resource records.

That leaves the DNS header.

## DNS header fields

As shown above, the DNS header contains a lot of information. Among these, the ones most worth highlighting are the RD and AA fields.

The RD field indicates whether this DNS message is a recursive query. A recursive query means asking another server to obtain the information needed.

For example, a stub resolver does not query DNS servers directly to obtain the IP address for the hostname it needs. Instead, it queries a full resolver. That is a recursive query, so the RD bit in a DNS message from a stub resolver to a full resolver is 1. On the other hand, a full resolver queries DNS servers itself, so it performs iterative queries, and in that case the RD bit is 0.

The AA field stands for Authoritative Answer and indicates whether the server sending the response is the authoritative DNS server with administrative authority over the queried hostname. If it is 1, that means the responding DNS server is authoritative for that hostname. While making recursive queries to DNS servers, a full resolver may receive a response from a server with the AA bit set to 1—that is, from an authoritative server. It can cache that response and return it to the stub resolver.

If you need the other header fields, you can refer to the diagram below.

![DNS header fields](./dns-header-structure.png)

# How DNS servers reduce load

Almost no one types in IP addresses directly to access websites. Most people use hostnames like `google.com`. Since DNS lookups happen every time someone accesses a site by hostname, DNS servers have to handle an enormous volume of requests. To process those requests more efficiently and reduce the cost of the long request-response chain described above, DNS servers use several optimization techniques.

## Caching

First, caching is used at multiple levels. Modern web browsers cache DNS records for a set period of time. When a user queries a DNS record, the browser checks its cache first. In Chrome, you can inspect cached DNS records at `chrome://net-internals/#dns`.

Stub resolvers and full resolvers also cache records. The TTL (Time To Live) value in a resource record indicates how long the cache remains valid. Until that value expires, if another query for the same hostname comes in, the cached response is returned immediately. In fact, the requirement that full resolvers implement local caching is explicitly defined in [RFC 1123](https://www.rfc-editor.org/rfc/rfc1123.html).

> (A) Full-Service Resolver
>
> -  The resolver MUST implement a local caching function to avoid repeated remote access for identical requests, and MUST time out information in the cache.
>
> RFC 1123, Section 6.1.3.1  Resolver Implementation

Caching resource record values is not the only way DNS servers reduce load. By caching information about other DNS servers, they can also avoid sending queries to higher-level DNS servers in the hierarchy and reduce the load on those servers as well.

For example, when a DNS server receives a query for a particular hostname, it may not have a cached A record, but it may have a cached NS record for that hostname. In that case, it can query the nameserver in the NS record directly without repeating the recursive query steps. Or if it has cached the IP address of a TLD DNS server, it can avoid querying the root DNS server altogether.

## DNS server redundancy

The simplest way to reduce the load on each server is to increase the number of servers. This also has the advantage that if one server goes down, the others can continue providing the service. DNS uses this approach as well, in the form of Primary/Secondary DNS.

In this setup, the records for a zone managed by the Primary DNS server are also replicated and stored on Secondary DNS servers. By default, they use [round-robin DNS](https://www.cloudflare.com/ko-kr/learning/dns/glossary/round-robin-dns/) so that each DNS server responds to queries in turn. If the Primary DNS server goes down, a Secondary DNS server can answer queries instead.

The issue this raises is how to synchronize data across these replicated DNS servers. The original approach was for the Secondary DNS server to periodically query the Primary DNS server to check whether anything had changed. Protocols called AXFR and IXFR are used for this, along with the SOA (Start of Authority) record.

An SOA record stores information about the DNS zone managed by a server, including a sort of serial number. When the DNS zone changes, this serial number is updated. When a Secondary DNS server queries the Primary DNS server, if the serial numbers for the zone differ between the two servers, the Secondary DNS server requests a data transfer from the Primary DNS server to synchronize.

When the Primary DNS sends zone information in this way, it is called a zone transfer, and TCP is used for reliability.

However, with this synchronization model, the delay depends on how often the Secondary DNS server checks for changes. To reduce that delay, there is a mechanism called NOTIFY, where the Primary DNS server sends a notification to Secondary DNS servers when changes occur. After receiving a NOTIFY message, a Secondary DNS server can decide whether to query the Primary DNS server.

# References

Much more detailed information about DNS is collected in [RFC 9499](https://www.rfc-editor.org/rfc/rfc9499).

[Paul V. Mockapetris, Kevin J. Dunlap, Development of the Domain Name System](https://www.cs.cornell.edu/people/egs/615/mockapetris.pdf)

Written by James F. Kurose and Keith W. Ross, translated by Choi Jong-won, Kang Hyeon-guk, Kim Gi-tae, and five others, *Computer Networking A Top-Down Approach*, 8th edition

Edited by the Gijutsu-Hyoron editorial department, translated by Jin Myeong-jo, *The Infrastructure Engineer’s Textbook, System Construction and Management Edition*, Chapter 5, “The Modern DNS Textbook”

Gabia Library, DNS Components – ② Domain Name Server

https://library.gabia.com/contents/domain/4146/

Using the dig command for DNS lookup and diagnostics

https://www.daleseo.com/dig/

Akamai, What is recursive DNS?

https://www.akamai.com/ko/glossary/what-is-recursive-dns

cloudflare, What is DNS? | How DNS works

https://www.cloudflare.com/ko-kr/learning/dns/what-is-dns/

IBM Technology, "What are DNS Zones And Records?"

https://www.youtube.com/watch?v=U-i_UDDYLxY

IBM Technology, "Primary and Secondary DNS: A Complete Guide"

https://www.youtube.com/watch?v=qhiyTH5B21A