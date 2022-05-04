---
title: Switch open files quickly in Obsidian
date: 2022-04-21
description: Imagine a quick switcher with open files at the top.
tags:
- obsidian
- productivity
comments: true
---

## The problem

since I use the “Sliding Panes” plugin, there’s always a bunch of files open in my Obsidian. Sometimes I switch to Obsidian with a very clear goal of opening a specific file, so I press Command+O and type in the file name to find it. Because I don’t want to check whether the file is open or not (rather say there’s no way to check open files quickly), I always press Command+Enter to open the file in a new pane. As this process repeats, some files will have redundant panes, the panes are bloated and the workspace ends up being a mess.

[Quick Switcher++](https://github.com/darlal/obsidian-switcher-plus) is a very helpful tool, it allows me to search for open editors by typing a special prefix (`edt` by default) in the quick switcher. But after using it a while, I still feel it’s not very intuitive, I want the “search any file and open it” action and “search for existing open file and activate it” to be combined into one thing to use.

## The solution

I forked Quicker Switcher ++ and added a new setting item called “Include open files”. When it’s enabled, the switcher modal shows all the open files at the top with a different color style. If the open file is chosen, make that pane active; Other suggestions behave the same as the original, opening the file in the active pane.

{{<video src="https://i.imgur.com/bGLcQKl.mp4">}}

I’ll test this new feature in my workflow for a while to see if it’s actually useful. Meanwhile, I’d love to hear from the Obsidian community. What do you think about it? Do you have a better idea for my problem? Feel free to leave a message to me.
