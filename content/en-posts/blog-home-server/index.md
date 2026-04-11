---
title: Deploying a Blog on a Home Server - Initial Setup of Proxmox and pfSense
date: "2023-09-18T04:00:00Z"
description: "Let's set up a home server"
tags: ["blog"]
---

> This article was written with significant help from [Vulcan](https://vulcan.site/), who set up a server before me. It may have many shortcomings, so I would appreciate any corrections in the comments.

> If you are considering setting up a home server after reading this, please note that a basic understanding of networking is necessary, as I have omitted many details.

# 1. Introduction

Originally, this blog was deployed on Vercel. However, after interacting with [Vulcan](https://vulcan.site/), who set up his own home server, I was inspired to set up my own server for blog deployment.

I received recommendations for a cost-effective server and proceeded to set up a home server. I couldn't miss out on the opportunity, especially with someone experienced waiting to assist me. Thus, I found myself all in.

I will document this process on my blog, outlining the items I purchased:

I bought [Intel's N100 i226-V (AliExpress link)](https://ko.aliexpress.com/item/1005005892722060.html?spm=a2g0o.order_list.order_list_main.5.1818140fxGKlvQ&gatewayAdapt=glo2kor) from AliExpress for approximately 170,000 KRW.

![N100 i226-v image](./n100i226v.webp)

I purchased [SK Hynix GOLD P31 NVMe SSD 1TB (Coupang link)](https://www.coupang.com/vp/products/6091702345?vendorItemId=73680480457&sourceType=MyCoupang_my_orders_list_product_title&isAddedCart=) for about 100,000 KRW from Coupang.

I bought [Samsung Notebook DDR5-4800 (16GB)](https://prod.danawa.com/info/?pcode=17666249) for around 50,000 KRW from Danawa's lowest price comparison. I don’t remember exactly where I bought it as it was a common model that could be found anywhere.

Anyway, my server, which traveled a long way from China, has arrived. I removed the bottom cover with a screwdriver and installed the components.

![Server interior](./server-internal.jpeg)

Also, I encountered issues with my home router, which is quite old, such as not being able to disable DHCP settings. Thus, I purchased an ipTIME wired/wireless router, specifically the [ipTIME A2003NS-MU (Coupang link)](https://www.coupang.com/vp/products/7414788638?itemId=19220386254&vendorItemId=86771481707&q=iptime+%EA%B3%B5%EC%9C%A0%EA%B8%B0&itemsCount=36&searchId=2fdb4a1230f247e896ce44948cd8e58a&rank=0&isAddedCart=). The included manual indicated that there is an ipTIME installation assistant app, making installation straightforward.

# 2. Installing Proxmox

I will set up the server based on Proxmox and pfSense. First, let's install Proxmox.

## 2.1. What is Proxmox?

Typically, servers are based on Ubuntu. Hence, if you only use a web server, Ubuntu alone is sufficient. Many simple web servers run on Raspberry Pi with Ubuntu, for example, [Yun's blog](https://blog.yuni.dev/).

However, using just Ubuntu means you would be unable to do anything else besides running a web server. What if I want to run a Minecraft or Factorio server while also hosting my blog? If I only have Ubuntu installed, that's quite difficult.

One common option to address this is to use virtual machines, like VirtualBox. This involves running a hypervisor on the host OS and then multiple guest OS instances on top of it, allowing multiple operating systems to run on a single OS.

Typically, since one computer cannot be dedicated solely to running a server, using virtual machines is a reasonable solution for running multiple operating systems on one machine. However, since the hypervisor runs on top of the host OS and then layers additional guest OS instances, it naturally does not optimize well.

Docker is often compared to these virtual machines; it packages software into containers that execute in independent processes, allowing them to share kernel resources with the host OS.

Using kernel resources from the host OS makes it more efficient than using hypervisor-based virtual machines. However, because the kernel is based on the host OS, you cannot use completely different operating system kernels.

![VM and Docker](./vm-and-docker.jpeg)

Proxmox addresses these issues. The fundamental idea is:

```
If the goal is purely virtualization, should we not run the host OS alongside the hypervisor for virtualization?
```

Proxmox embodies this concept. It runs in a bare-metal format directly on top of the hardware, partially isolating the host OS kernel to create space for new OS instances. By using Proxmox, you can specify how much of that space you wish to allocate.

In the image representing the VM structure above, you can see that the hypervisor layer has been nearly eliminated. This makes running virtual machines more efficient and allows you to utilize distinct operating system kernels compared to Docker. Additionally, Proxmox offers a web UI to manage the virtual machines.

Since this is a simplified explanation for beginners in the field, more detailed information can be found in [What is Proxmox VE: An Open Source Virtualization OS](https://it-svr.com/proxmox-ve-opeunsoseu-gasanghwa-osran-mueosinga/), and [Red Hat's Hypervisor Documentation](https://www.redhat.com/ko/topics/virtualization/what-is-a-hypervisor) is also worth reading.

## 2.2. Burning USB

Download the ISO file from the [Proxmox official download page](https://www.proxmox.com/en/downloads). Next, you need to create a bootable USB drive. I used a Sandisk USB stick commonly found at stationery stores.

Before performing this task, remember to format the USB. I followed the instructions on [How to Format USB on macOS](https://100sang.net/143).

Next, I wanted to burn the ISO file to the USB, but since I'm using macOS, I cannot directly burn ISO files to USB. Fortunately, there’s a simple program called balenaEtcher that handles this seamlessly. Using it, I created a Proxmox boot USB easily.

I created the USB by referring to [Creating mac USB .iso, .img Boot Installation Files](https://tttap.tistory.com/223).

## 2.3. Installing Proxmox

With the USB prepared, let’s install it on the server. Insert the USB into the server and boot it up, and the Proxmox installation screen will appear. Since I would rarely need a monitor after this initial setup, I temporarily connected a spare monitor at home for the installation.

The installation process is very straightforward. [I followed a well-explained blog for guidance.](https://nad4.tistory.com/entry/Proxmox-%EC%84%A4%EC%B9%98-%EB%B0%8F-%EC%B4%88%EA%B8%B0-%ED%95%84%EC%88%98-%EC%84%A4%EC%A0%95)

After installation, Proxmox is up and running. You can now use Proxmox.

Once the installation is complete, you can access the Proxmox web UI. Note that the default username is `root`, and the password is the one set during the installation. I initially struggled because I didn't know the default username.

### 2.3.1. Troubleshooting

However, an issue arose. I tried accessing `192.168.219.154:8006` for the Proxmox web UI but couldn't connect.

I realized that the DHCP on my existing router was assigning IPs based on a `192.168.219.1` gateway, whereas the newly purchased ipTIME router had dynamic IP assignments based on a `192.168.0.1` gateway.

So, I needed to change the dynamically assigned address.

```bash
nano etc/network/interfaces
```

You can find the area labeled `address` and `gateway` in that file. Let’s edit it accordingly.

```bash
auto vmbr0
iface vmbr0 inet static
        address 192.168.219.154/24 -> 192.168.0.3/24
        gateway 192.168.219.1 -> 192.168.0.1
        bridge-ports enp1s0
        bridge-stp off
        bridge-fd 0
# Rest omitted
```

Next, input the following commands:

```bash
service networking restart
reboot
```

The networking will restart, and the server will reboot. The IP shown at the top of the screen may not change even after this. That happened to me too. If so, ignore the IP displayed at the top and connect using the IP obtained from `ip a` (in my case, it was `192.168.0.3:8006`), which will bring up a login prompt.

![Proxmox login screen](./proxmox-login.png)

Here, the username is `root` (though you can change it, the default is this), and you will enter the password set during installation. You will see a message saying, "You do not have a valid subscription for this server," but you can ignore it as a paid subscription is not mandatory; just click `OK`.

![Proxmox web UI](./proxmox-ui-first.png)

# 3. Proxmox Web UI Guide

I will briefly describe each menu.

## 3.1. Left Menu

![Left menu](./left-menu.png)

In the left menu, you will see Datacenter and below it, the node name.

Hardware-related sections are under Datacenter, where you can view all nodes collectively. The items below refer to nodes associated with the data center.

The node names appear under "witch," which is the name of the node I created. If you create more nodes, their names will appear here.

## 3.2. Datacenter Menu

This is where you configure hardware-related settings.

![Datacenter menu](./datacenter-menu.png)

In search, you can view information related to the node (my server) and hardware. If there are more servers, you can see all of their details here.

The summary provides brief information about hardware and memory usage.

Notes are similar to a memo, but I believe they aren't necessary.

Cluster and Ceph are used in clustering, but since I only have one server, I won't utilize them. If you navigate to the Ceph menu, you will see a message recommending installation, but avoid clicking there unless you want to deal with complicated configurations.

Options is literally the options window. Storage is where you manage storage devices. The `local-lvm` here refers to virtual machines. The hard capacity is handled automatically by `local` and `local-lvm`, so you don’t need to worry too much about it.

Backup settings are related to backups. Proxmox provides good backup features, such as automatic backups once a day.

Replication is a feature available if you have two or more servers, and permission refers to permission settings.

HA stands for High Availability, which is applicable when you have two or more servers.

ACME is related to ACME SSL certification features.

The Firewall here is for setting up firewalls between virtual machines, not for external access to the Proxmox server.

Metric server is used for monitoring tools like Grafana, but I currently don’t need it.

## 3.3. Node (witch) Menu

Under the server name in the left menu below `Datacenter`, you can perform several settings.

![Witch node menu](./witch-node-menu.png)

Here too, search, summary, and notes are the same as in the Datacenter menu, but summary provides more detailed information about the node.

Additionally, the shell allows you to interact with the internal shell of the server node.

In the system menu, various settings can be configured, but aside from the Network menu, there isn't much to modify in the default settings.

You can update packages in the Updates section, and Firewall settings are available for internal communication within nodes.

In the Disks menu, you can manage the disks within the node and monitor the status of the hard disk. Notably, there is an entry called `S.M.A.R.T.` here. If it doesn’t show as PASSED, that’s critical, and you need to back up immediately. Don’t turn off the server; prioritize backup. If there are errors in LVM, you should back up as well, as errors often accumulate.

Here too, Ceph and replication are unused since I'm not clustering and have only one server.

# 4. Proxmox Configuration

Now, let's move on to configuring Proxmox. Access System - Network from the node menu. The following screen will appear.

![Network initial view](./network-start.png)

You will see names like `enp1s0`, which refer to the actual Ethernet ports of the network device. Since I have four Ethernet ports, I see `enp1s0`, `enp2s0`, `enp3s0`, `enp4s0`.

Then, click the Create button at the top to create a Linux bridge. It will automatically be named `vmbr0`. A Linux bridge allows one physical port to be divided into multiple ports and decides which physical LAN port to send incoming packets to.

The first bridge I am creating, `vmbr0`, will be allocated to Proxmox, so I assign an internal IP for Proxmox here. I will allocate the first port, `enp1s0`, to Proxmox.

![Creating a bridge](./make-bridge.png)

Although my device has four Ethernet ports, using a Linux bridge has its advantages, as multiple containers can share the Ethernet port, plus I might end up running a few Factorio servers later, so it's wise to set this up.

Moreover, you can also set MTU when creating these bridges, which could be adjusted when building NAS, but leaving it as the default is fine here.

Next, I created two additional bridges for WAN and LAN, each connected to different Ethernet ports, achieving the following screen layout. Ensure you check VLAN aware when creating `vmbr1` and `vmbr2`.

This results in the following screen.

![Final view after creating bridges](./network-final.png)

## 4.2. Installing pfSense

You can download pfSense from the [official pfSense website](https://www.pfsense.org/download/).

Now, return to the Proxmox screen to create a new VM. Right-click on the node name and select `Create VM`.

![Create VM](./create-vm.png)

Enter a suitable ID (I chose 100) and a name, and upload the previously downloaded pfSense ISO file in the `OS` section. I named the VM pfSense from the beginning.

You can proceed with the rest by keeping the defaults.

Once the VM is set up, you will see that a VM with the ID and name I configured has been created in the bottom menu of the node. Click on this VM, and you can start the Console menu.

![VM Console](./vm-console-start.png)

## 4.3. Interface IP

You will need to specify the interface IP. In the console options, there’s an item `2) Set interface(s) IP address`, so press 2.

It will ask you whether to assign it to WAN or LAN. Press 2 to select LAN, and the following screen will appear.

![VM console](./vm-console-lan-ip.png)

For the IPv4 address, set it manually as I am not using DHCP. I configured it as `192.168.0.5`, but feel free to choose a different one. For IPv6, set it to DHCP.

Next, you will be prompted to define the client address range. You can allocate a range while avoiding the fixed addresses you plan to use; I set it from `192.168.0.32` to `192.168.0.250`.

![Console IP Specification 2nd](./vm-console-lan-ip2.png)

As I only want to use HTTPS, when asked, "Do you want to revert to HTTP as the webConfigurator protocol? [y|n]", press n to enforce HTTPS only.

Now the LAN IP configuration is completed.

![LAN IP configuration completed](./lan-ip-done.png)

You can now access the pfSense page using `192.168.0.5`. Remember to connect via HTTPS.

### 4.3.1. Start at Boot

A very important configuration you need to make is to go into the pfSense VM and find the `Options` item in the left menu. There, check the `Start at boot` option.

![Set start at boot](./start-at-boot.png)

This setting will automatically power on the VM during server reboots, which is crucial because you may need to connect to this server via VPN later. If you have to physically go to the server location to connect to the internal network every time you manage the server, it's quite tedious.

What happens if you need to reboot the server while you are managing it via VPN? If pfSense does not start again, you won't be able to manage it remotely until you physically restart the pfSense VM, which would be problematic. Therefore, enabling this option is very important for convenience.

# 5. ipTIME Configuration

Now, I need to adjust settings to have pfSense take over the functions that the ipTIME router used to perform.

## 5.1. Purpose

Previously, ipTIME was responsible for connecting external requests to the internal network. Now, pfSense will take over this role, functioning as a Layer 4 switch and managing DHCP as well. Once the initial settings are complete, ipTIME will solely provide Wi-Fi connectivity.

![pfSense before and after](./what-pfsense-for.png)

## 5.2. Configuration

To configure ipTIME, access it at `192.168.0.1`. Other routers will have different internal IP addresses assigned for configuration. However, the required steps are similar.

Navigate to the management tools and disable DHCP settings. Under Advanced Settings - Network Management - DHCP Server Configuration, stop the operation of the DHCP server and click apply. Don't forget to click apply!

![Configuration window](./iptime-config-1.png)

Then, under Advanced Settings - Network Management - Internal Network Settings, check the Hub/AP Mode Internal Gateway option. Remember to click apply here as well.

![Configuration window 2](./iptime-config-2.png)

Now, let's rearrange the Ethernet connections. The first Ethernet port is assigned to Proxmox, which is on the internal network, so I will connect it to the router. The second Ethernet port will be used for WAN, so I will connect the external internet line. The third Ethernet port will be used for LAN, also connecting to the router.

Be careful to connect only one Linux bridge to the WAN Ethernet port. While it's said that connecting more than one won't cause immediate issues, it's definitely not advisable.

I am using a device with four Ethernet ports and most home server setups usually have at least two Ethernet ports that you can use for one WAN and one LAN connection, so there's generally no need to assign another bridge for the WAN port.

Also, when connecting the router, ensure the cable for the WAN port does not connect to the internal network. The WAN port usually has a distinctive color or label, so avoid connecting to that.

![Server-router connection](./server-iptime-connection.jpeg)

In the provided image of the router, the yellow-marked port among the two unoccupied ports is the WAN port. If using this router for external network connection, that port should have been connected to the external internet line, but as you can see, there is nothing connected there.

# 6. pfSense

By accessing `192.168.0.5`, you will see the pfSense landing page, which presents the login screen.

![pfSense login screen](./pfsense-main.png)

By default, the username is `admin` and the password is `pfsense`. You should change it later, but for now, just log in. On the first access, you will be prompted to proceed with initial setup alongside a message welcoming you to pfSense software.

For initial setup guidance, [refer to the post on 2cpu](https://www.2cpu.co.kr/lec/4139). One of the steps includes changing the default password. The main difference in my setup is that I set the secondary DNS to `8.8.8.8` (Google DNS).

Once you complete this, you'll enter the pfSense dashboard with some configuration already done. At this point, simply check that the version in System Information is up to date.

![pfSense dashboard image](./pfsense-dashboard.png)

## 6.1. Installing Packages and VPN

From the top menu, go to System - Package Manager. In Available Packages, you can search for and install packages, such as acme, haproxy, and openVPN client export.

![Installed packages](./package-installed.png)

To set up the VPN, access VPN - OpenVPN from the top menu. Click on the Wizards menu to easily create an OpenVPN server. Afterward, go to VPN - OpenVPN - Client Export, scroll down, and you can download the OpenVPN client configuration file.

![Downloading OpenVPN client file](./openvpn-client-export.png)

When you select Most Clients under Inline Configurations, you'll download an `.ovpn` configuration file that can be used from any device, like a phone or laptop, to connect through the VPN.

To use it, I tested it on my MacBook outside of the server’s network environment.

Download and install the OpenVPN client for macOS from the [OpenVPN Connect for macOS](https://openvpn.net/client-connect-vpn-for-mac-os/) page. After installation, start the app, and upload the downloaded configuration file via the UPLOAD FILE menu (you can email it to yourself first). Then log in with the pfSense account you set up to connect to the VPN.

![OpenVPN Client](./vpn-with-dashboard.png)

In this state, you can connect to the earlier seen pfSense page using `192.168.0.5`.

OpenVPN also has a smartphone app that allows similar uploads of configuration files for managing pfSense or Proxmox settings from your phone.

It seems I've completed the initial configurations, so in the next article, I will deploy the blog.

# References

How to Format USB on macOS https://100sang.net/143

Creating mac USB .iso, .img Boot Installation Files https://tttap.tistory.com/223

What is Proxmox https://it-svr.com/proxmox-ve-opeunsoseu-gasanghwa-osran-mueosinga/

pfSense Installation https://www.2cpu.co.kr/lec/4139
