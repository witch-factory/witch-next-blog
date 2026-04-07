---
title: What Is NAT, What Problems Does It Solve, and What Problems Does It Create?
date: "2025-07-20T00:00:00Z"
description: "What exactly is NAT, what problem does it solve, what problems does it cause, and what complements it?"
tags: ["CS", "network"]
---

While doing a network study, I ended up researching NAT, and this post combines what I learned there with some additional research.

I referenced many of the [posts about NAT](https://www.netmanias.com/ko/?m=search&tag=248) written by Changmo Yoo on Netmanias, and I list the individual links in the references section.

# What Is NAT?

## Definition of NAT

NAT (Network Address Translation) is a technique that translates addresses so that hosts in a private network can connect to an external public network. NAT is usually handled by a router or firewall that connects a LAN to the Internet.

In general, NAT includes both Basic NAT, which maps a private IP to a public IP in a 1:1 relationship, and NAPT (Network Address Port Translation), which translates IP addresses along with port numbers. In practice, NAT devices usually support both, and RFC 3022 refers to them together as Traditional NAT, so I will not distinguish them separately in this post.

## How NAT Works

So how does NAT work in practice? Let's assume we are using NAPT (Network Address Port Translation), which also translates port numbers. In that case, the NAT router performs these translations:

- When sending data outward: (private IP address of the sending device, port number) -> (public IP address of the NAT router, port number)
- When receiving data from outside: (public IP address of the NAT router, port number) -> (private IP address of the receiving device, port number)

Let's walk through an example of sending data. Suppose a device with private IP `192.168.0.10:8080` sends data to `128.119.40.186:80`. The device's private IP may be statically assigned or dynamically assigned through DHCP, but that detail is not important here. Assume the NAT router in the middle has the public IP address `203.0.113.25`. The sending process looks like this.

First, the device at `192.168.0.10:8080` in the private network sends a datagram whose destination address is `128.119.40.186:80`. This datagram first reaches the router that uses NAT. The router also has private IP addresses within the private network, not just a public IP address. In the figures, those IPs are marked in blue.

![Translation process 1](./nat-translation-1.png)

The router has a table used by NAT that maps a private IP address + port number to a public IP address + port number. It uses that table to translate the source address of the datagram and then sends the datagram out to the external network.

The table used for IP address mapping is updated by the router when needed whenever it detects traffic going from inside to outside. If the `(private IP, port number)` included in the datagram is not in the table, the router allocates a new external port, creates a mapping, and stores it in the table for a certain period of time. This mapping is bidirectional, so it can also be used when a datagram arrives from outside, but updates happen only when data goes from inside to outside.

Here, I drew the figure assuming the mapping already exists in the table.

![Translation process 2](./nat-translation-2.png)

The translated datagram then passes through routers on the Internet and, assuming no network errors occur, reaches its final destination at `128.119.40.186:80`.

The response reaches the destination inside the private network in the reverse order. When the router receives the datagram containing the response, it looks up the mapping table, translates the destination address into a private IP address + port number, and forwards the datagram to the destination inside the private network.

![Translation process 3](./nat-translation-3.png)

The private IP address used here belongs to one of the following ranges: `10.0.0.0/8` (class A), `172.16.0.0/12` (class B), or `192.168.0.0/16` (class C). IP addresses in these ranges are reserved by IANA for private IP use, so they cannot be routed over the Internet.

The port numbers used here are also somewhat standardized. The destination port number is either 0-1023 (well-known port) or 1024-49151 (registered port). The source port number, meaning the port used by the address inside the private network, is assigned arbitrarily by the router. This differs by operating system, but in practice ports roughly between 30000 and 60000 are commonly used.

## Benefits of Using NAT

NAT also has some advantages. These benefits come from the fact that the externally visible IP address is different from the internal IP addresses, and from the outside the entire private network appears to have only a single public IP.

- Saves IPv4 addresses because all devices in a private network share one public IP address
- Allows changes to network configuration inside the LAN, such as changing device addresses, without affecting external communication
- Allows the public IP address to change without changing the private IP addresses of devices inside the private network
- NAT prevents direct access from outside to internal IPs, which improves security

# External Access and Port Forwarding

## The Problem with NAT

We looked at how NAT works above. But there was one important sentence in the middle.

> The table used for IP address mapping is updated by the router when needed whenever it detects traffic going from inside to outside.

This means that for a mapping between `(private IP address of the sending device, port number) <-> (public IP address of the NAT router, port number)` to be registered in the NAT table, there must first have been outgoing data from a device inside the private network through the router. Of course, inbound traffic can also update the NAT table in some cases[^1], but in most situations the NAT table is refreshed only when there is outgoing traffic.

This creates a problem. NAT cannot properly handle cases where an external client needs to connect to a specific device inside the private network and exchange data with it. This can be a security advantage, but it becomes a problem when you need to run many services behind a private network.

A simple example is hosting a site on a deployment server inside a private network. The deployment server usually does not send data to users first, so there is often no NAT table mapping. Then how can an external client access the deployed site?

![Illustration of the problem](./port-forwarding-need.png)

One way to solve this is port forwarding.

## Port Forwarding

The simplest way to allow external clients to connect to the appropriate host inside a private network is port forwarding. This means explicitly specifying which address inside the private network a request arriving on a specific external port should be sent to. It is useful when the mapping is static, as in "requests arriving on this external port should go to this host in the private network."

For example, you can configure all requests arriving on port 8080 of the router's public IP to be forwarded to `192.168.0.10:3000` inside the private network. This can be configured using tools such as nginx or Apache.

In diagram form, it looks like this. These mappings are configured statically. In other words, every time you need a mapping for a specific host inside the private network, you have to configure it on the router.

![Example port forwarding setup](./port-forwarding-structure.png)

## Universal Plug and Play (UPnP)

However, manually configuring port forwarding every time external connectivity is needed is inconvenient. A private network may contain many devices such as printers, game consoles, and IoT devices, and manually setting up port forwarding for each one whenever it needs outside connectivity is inefficient.

To solve this problem, Universal Plug and Play (UPnP, defined in [RFC 6970](https://datatracker.ietf.org/doc/html/rfc6970)) was introduced. It allows devices on the network to automatically discover each other and communicate through port forwarding requests.

There are also many other technologies such as NAT-PMP and SOCKS, but automatic port mapping is not the main focus of this article, so I will only cover UPnP here. If needed, refer to the RFC documents for those technologies.

A router that supports UPnP can automatically configure port forwarding when a host inside the private network sends a request. If an application such as a torrent client or a game asks, "Open external port 12345 for me," the router updates the NAT table accordingly and forwards requests arriving on external port 12345 to that host.

In this way, UPnP allows a variety of devices on the same LAN, such as printers and gaming consoles like an Xbox, to automatically discover and connect to one another.

This means the router can adapt automatically even if devices or ports change. As a result, users do not need to manually intervene in router settings, and even non-experts can easily use apps that require port forwarding.

However, UPnP also has security weaknesses, so it should be used carefully. UPnP was designed for use within a LAN, so it does not provide authentication or access control by default. That means any device on the same network can freely send port forwarding requests and open ports.

As a result, if a malicious user gains access to a network managed by a UPnP-enabled router, they can send port forwarding requests to any device on that network and open arbitrary ports to create a path for accepting malicious requests from the outside. Some routers have even been configured to accept UPnP requests from outside the network, making it possible to remotely change router settings.

Because of these weaknesses, [some recommend disabling UPnP](https://nordvpn.com/ko/blog/what-is-upnp/). In practice, it is common for UPnP or port forwarding to be disallowed in enterprise networks or in public Wi-Fi environments where security is important.

Then under all of these constraints, how do different devices establish direct connections, whether they are in the same private network or not? The set of techniques used in these situations is called NAT Traversal.

# NAT Traversal

In practice, the real problem NAT creates for external access is P2P (peer-to-peer) communication. For example, imagine two users who need to have a video call. Their computers need to establish a direct connection and exchange data with each other.

But in general, personal computers are behind private networks such as home Wi-Fi or a company LAN. In other words, both machines use addresses inside a private network through NAT, and neither has an address that an external peer can directly target for a connection. In this situation, if the two hosts want to establish a direct connection, they need a way to get through NAT. The technologies that solve this problem and allow direct connections between the two hosts are called NAT Traversal.

Several techniques, including the UPnP approach described above, implement NAT Traversal through communication between applications and NAT devices. There are also many requirements and implementation types for NAT Traversal techniques, so if you want more detail, refer to [Changmo Yoo's posts on Netmanias, especially this one](https://www.netmanias.com/ko/?m=view&id=blog&no=5854).

However, there are too many kinds of these technologies and too many implementation variations to cover here, so I will only briefly explain well-known approaches where the application implements NAT Traversal without directly modifying the NAT device. These methods are described in detail in [RFC 5128](https://datatracker.ietf.org/doc/html/rfc5128). I also left several related links in the references section if you want to read further.

## Relay

The core issue with current NAT devices is that they were ultimately designed around the client-server paradigm, where one side sends data and the other side receives it at a publicly reachable address. P2P communication, on the other hand, requires both sides to be able to send and receive data, which is why NAT causes problems.

So what if both sides communicate through another public server in the middle? Then P2P communication between the two devices can effectively behave like two client-server communications.

![How relay works](./relay.png)

When A sends data to B, A first sends the data to the relay server and includes B's address in the payload. The relay server receives the data and forwards it to B. The same applies when B sends data, just in the opposite direction.

This method is called Relay. Both hosts use a public relay server that they both know about, called a Rendezvous Server in RFC 5128, and exchange data through it. This is the most reliable method and can handle all NAT behaviors.

Its drawbacks are exactly what you would expect from the structure. It increases the load on the relay server and consumes more network bandwidth, and it can introduce communication latency. For that reason, if efficient P2P communication matters, other methods should be considered first. The TURN protocol (Traversal Using Relays around NAT) defines a more concrete way to implement this Relay approach.

## Connection Reversal

A better NAT Traversal method is Connection Reversal. This method can be used only if one of the two hosts in the P2P communication has a public IP address.

Suppose A is behind a NAT device and B has a public IP address. Then A can send data to B without any problem, because it can send to B's public address. But how can B send data to A? This is where Connection Reversal comes in. The goal is ultimately to generate outbound traffic from A to B so that a mapping is created in the NAT table of the router responsible for A.

The process works like this. First, A, which is behind the NAT, establishes a connection with the relay server. The relay server then has the information needed to communicate with A. Next, when B wants to establish a connection with A, B first sends its own information and a message like "I want to send data to A" to the relay server in the payload.

![Connection reversal 1](./connection-reversal-1.png)

The relay server then sends A the information that "B requested a connection." This is delivered to A through the NAT that manages A's network. The payload here includes B's public IP address and port number.

![Connection reversal 2](./connection-reversal-2.png)

A receives this information and attempts to connect to B's public address. During this process, the NAT device registers A's private IP address and port number in its mapping table.

![Connection reversal 3](./connection-reversal-3.png)

From that point on, if B sends data to A's public address and the appropriate port, the NAT device can forward the data to A's private IP address. In other words, A and B can now establish a direct connection.

Once the connection has been established, A and B can exchange data directly without going through the relay server. Naturally, this is more efficient than Relay. The limitation is that one of the two hosts must have a public IP address.

## UDP Hole Punching

In reality, it is common for both hosts in a P2P communication to be behind NAT. In that case, Connection Reversal cannot be used. Relay is inefficient. A technique that still makes P2P connections possible in this situation is UDP Hole Punching.

This relies on the behavior of EIM-NAT (Endpoint Independent Mapping NAT). EIM-NAT has the property that traffic sent from the same internal address + port uses the same public address + port even if the destination changes. That is why it is called endpoint-independent mapping.

Skipping the deeper details and edge cases, the basic idea works like this. Suppose hosts A and B want to establish a P2P connection. A and B each connect to a public relay server S. Naturally, these connections go through NAT, and the payload of each connection request includes the host's own private IP address and port number.

![UDP Hole Punching 1](./hole-punching-1.png)

The relay server now knows the public IP address and port number of both A and B, as well as their private-network IP addresses and port numbers. Then, when A wants to communicate with B, A first sends the relay server a request to connect to B. The payload at that point includes the public IP address and port number of the NAT router responsible for B.

![UDP Hole Punching 2](./hole-punching-2.png)

When the relay server receives this request, it sends A the private-network IP address and port number of B that it already knows. At the same time, it sends B A's public IP address + port and private IP address + port number.

![UDP Hole Punching 3](./hole-punching-3.png)

The reason private-network addresses are also exchanged is that A and B might actually be on networks connected to the same NAT device. In that case, they connect using private IP addresses without NAT address translation. This process is called hairpinning, but not all NATs support it, and it is outside the core topic here, so I will skip the details. If needed, refer to RFC 5128.

Now the connection begins to form. A and B simultaneously attempt to connect to each other's public endpoints. Assume A tries first. When A sends a packet to B's public endpoint, NAT A creates a new mapping for it. At first, B may still block packets coming from A because A's endpoint has not yet been registered in NAT B's mapping table.

But B also soon attempts to connect to A, and at that moment B's NAT device registers A's endpoint in its mapping table. From then on, NAT B allows packets coming from A. Because of the EIM-NAT behavior, once there is an outbound connection attempt to that endpoint, you can think of it as punching a hole for that endpoint, which is why the process is called Hole Punching.

In other words, if both sides try at the same time, the appropriate mappings are quickly created in both NAT devices. That allows A and B to communicate directly. That is UDP Hole Punching. Of course, it only works on NAT devices that support EIM-NAT.

A similar technique can also be used with the more familiar TCP, but it is more complex than with UDP. TCP uses the well-known 3-way handshake, so the connection setup process is more complicated. Also, many NAT devices do not support TCP Hole Punching. For that reason, UDP Hole Punching is often considered first, so I will omit the detailed TCP Hole Punching process in this post.

# Additional Notes

Real-world NAT involves many more issues than I could cover here.

There are issues with NAT itself, including firewalls and security, and for opening external ports there are many more technologies besides the briefly mentioned UPnP. Also, in real P2P communication, it is common to combine multiple NAT Traversal techniques to ensure stable connectivity across a wide range of network environments. A common strategy is to try UDP Hole Punching, then Connection Reversal, then Relay in that order.

There is also a protocol designed to find the best path that allows two hosts to establish a direct connection and communicate. It is ICE (Interactive Connectivity Establishment), defined in [RFC 8445](https://datatracker.ietf.org/doc/html/rfc8445). Today, it is one of the most widely used NAT Traversal-related protocols in P2P communication.

This post covered NAT briefly. Still, I think it covers most of what is needed for typical web development interviews. If you want to go deeper, the references below provide more detailed material on how NAT works and on the many related issues. You can also learn more about NAT Traversal techniques in detail through the RFC documents.

# References

Masahiro Kihashi, translated by Moses Kim, "Understanding Server Basics Easily Through Diagrams and Operating Principles"

Network NAT, NAPT, Port Forwarding

https://8iggy.tistory.com/249

Going Beyond NAT for P2P Communication

https://velog.io/@sharlotte_04/P2P-NAT

Introduction to NAT (Network Address Translation) (RFC 3022/2663)

https://www.netmanias.com/ko/?m=view&id=blog&no=5826

This Is How NAT Devices Should Be Built... (RFC 4787) - Part 1, Mapping Behavior

https://www.netmanias.com/ko/?m=view&id=blog&no=5833

What is UPnP and why you should disable it immediately

https://nordvpn.com/ko/blog/what-is-upnp/

What Is UPnP and Why Is It a Security Risk?

https://securityscorecard.com/blog/what-is-upnp-and-why-is-it-a-security-risk/

What is UPnP? Yes, It's Still Dangerous in 2025

https://www.upguard.com/blog/what-is-upnp

RFC 5128 - State of Peer-to-Peer (P2P) Communication across Network Address Translators (NATs)

https://datatracker.ietf.org/doc/html/rfc5128

P2P and NAT, Introduction to NAT Traversal Techniques (RFC 5128) - Part 1, Relaying & Connection Reversal

https://www.netmanias.com/ko/?m=view&id=blog&no=6264

P2P and NAT, Introduction to NAT Traversal Techniques (RFC 5128) - Part 2, UDP Hole Punching

https://www.netmanias.com/ko/?m=view&id=blog&no=6263

Chapter 30. Understanding ICE

https://brunch.co.kr/@linecard/156

How NAT traversal works — Figuring out firewalls

https://blog.apnic.net/2022/04/12/how-nat-traversal-works-figuring-out-firewalls/

How NAT traversal works — The nature of NATs

https://blog.apnic.net/2022/04/19/how-nat-traversal-works-the-nature-of-nats/

How NAT traversal works — NAT notes for nerds

https://blog.apnic.net/2022/04/26/how-nat-traversal-works-nat-notes-for-nerds/

[^1]: More precisely, this is about Mapping Refresh Behavior, meaning the rule for when the timer that determines how long a mapping is stored gets refreshed. If "NAT Inbound refresh behavior" is True, the mapping is refreshed whenever there is an incoming datagram from outside.