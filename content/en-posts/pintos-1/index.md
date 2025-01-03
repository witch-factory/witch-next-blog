---
title: Sogang University Pintos - project 0
date: "2022-11-11T00:00:00Z"
description: "Let’s run Pintos"
tags: ["CS"]
---

# 1. Starting Pintos

The Operating System course assigned Pintos as a project. Project 0 involves installing Pintos and executing simple commands. Follow the instructions provided in the accompanying PPT.

QEMU and other necessary tools for running Pintos are provided by cspro, so there is no need for separate installation. Begin by downloading the provided pintos_modified.tar.gz file and extracting it.

```
tar -xvzf pintos_modified.tar.gz
```

You need to add environment variables using the .bashrc file. The .bashrc file is located in the ~/ directory, so open it with `vi ~/.bashrc` and add the following line.

```
export PATH=/sogang/under/cseXXXXXXXX/pintos/src/utils:$PATH
```

Here, `cseXXXXXXXX` represents your student ID. The `pintos/src/utils` directory contains the scripts needed to run Pintos. After adding the line, execute `source ~/.bashrc` to apply the changes.

Next, navigate to the directory with `cd ~/pintos/src/threads` and run `make` to compile the thread portion of Pintos.

Then, move to `src/threads` and execute the following command.

```
pintos -v -- -q run alarm-multiple
```

Pintos will execute and the `alarm-multiple` command will run.

At this point, you can provide several options to the simulator running Pintos, which must be separated from the commands passed to the Pintos kernel. This separation is handled by `--`. Thus, the command format becomes `pintos Pintos simulator options -- Pintos kernel argument ...`. Possible options can be viewed with the `pintos` command. For example, -v is an option to disable the VGA display.

Among the commands above, -q appears after `--`, so it is an argument passed to the Pintos kernel, indicating that Pintos should terminate after output completes.