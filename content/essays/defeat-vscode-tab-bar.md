---
title: Defeat VSCode Tab Bar
date: 2022-10-18T21:39:21+08:00
draft: false
tags:
  - english
  - development
  - tools
---

A while ago, I found my VSCode tab bar (or tool bar) UI was quite unstable. The reason was that extensions may add icons called "action button" on the right side of the tab bar according to the type of the file, so when switching back and forth between different kinds of files, these buttons will either show or hide, making the available spaces for tabs changing constantly. This may not be noticable when you just open a few tabs, but if you have tabs that are enough to take up the spaces of the tab bar, the whole tab bar will be a clown fiesta with the appearace and disappearance of the action buttons. Tabs are flickering due to their width change, the last one could even be pushed to the next line. It's just so eyes-hurting and annoying.

After realizing who was the culprit, I immediately started to search for a solution. Sadly, VSCode itself did not provide a way to customize the side bar, but I was luck to find an extension called [Customize UI](https://marketplace.visualstudio.com/items?itemName=iocave.customize-ui), which allows me to inject css into the application, so that hack the UI whatever I want. I installed the two extensions and add the following lines of code in `settings.json` and boom, the world was quiet again.

```json
{
    "customizeUI.stylesheet": {
        ".editor-actions": "display: none !important;",
    }
}
```

But this solution is not perfect, because Customize UI relies on the [Monkey Patch Extension](https://marketplace.visualstudio.com/items?itemName=iocave.monkey-patch) to achieve UI hacking, which always requires me to restart the VSCode immediately after I open it. That's fine, I told myself, as long as I can get ride of those tab bar icons.

Today, I updated VSCode and was surprised to find that VSCode finally implemented a feature called [Hide actions from tool bars](https://code.visualstudio.com/updates/v1_72#_hide-actions-from-tool-bars), it says:

> You can now hide actions from tool bars. Right-click on any action in a tool bar and select its hide command or any of the toggle commands. Hidden actions are moved to the ... More Actions menu and can be invoked from there.

This means I can hide those buttons without th need of using the clumsy extensions. I tried to right click on an action button and select "Hide …", it disappeared as expected. Then I uninstalled Customize UI and hide all the action buttons one by one. So yeah, this is the story of how I defeat the VSCode tab bar.