{{- $issueno := sub (len (os.ReadDir "content/makers-daily")) 2 -}}
---
title:
issueno: "00{{ $issueno }}"
slug: 00{{ $issueno }}-
date: {{ .Date }}
description:
draft: false
ShowToc: false
tags:
---
