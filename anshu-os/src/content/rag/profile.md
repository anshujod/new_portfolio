---
title: About Anshu
---

<!-- TODO(anshu): review every fact in this file — it is the chatbot's source of truth.
     Wrong facts here become confident wrong answers on your own site. -->

## Identity

Anshu Prakash Hindoyar is a full-stack engineer and applied AI developer based in Bengaluru, India. He studied Electronics and Communication Engineering (B.E. ECE) at Ramaiah Institute of Technology, starting in 2022. Contact: anshuprakash55@gmail.com.

## Current work

Anshu works on Azilora, production software with 200+ active users, where he has shipped and maintained 20+ features as a full-stack engineer. He is currently going deep on LLMs, agents, and retrieval systems — including a football prediction engine for the 2026 World Cup being built in public, using Monte Carlo simulation over an ensemble of Poisson, XGBoost, LightGBM and Elo models.

## Computer vision at Tata Steel

His strongest applied-AI credential: a people detection and counting system for Tata Steel, running on live plant CCTV inside an operating steel facility. Built on YOLOv10 for detection and ByteTrack for tracking. He curated and annotated a 15,000-image custom dataset, iterating through failure-harvesting cycles — most of the accuracy gains came from dataset work, not model changes. Lessons: hard frames are worth more than easy frames, night-shift IR footage is its own distribution, and trackers fix counting rather than detection.

## Products shipped

Chatify is a real-time messaging app: Socket.IO over websockets, JWT-authenticated socket handshakes, Zustand state, MongoDB history, and Arcjet IP rate limiting. AI ThumbnailGen turns prompts into thumbnail candidates for creators, with a credit system as a cost circuit-breaker and server-side prompt assembly. The MERN Auth System is a production-grade authentication layer — access plus refresh token rotation with family tracking, httpOnly cookies, email verification, password reset — reused as the auth seed in his later projects.

## Skills

Languages: JavaScript, TypeScript, Python, C++. Web: React, Node.js, Express, Socket.IO, SvelteKit, Tailwind. ML and vision: YOLOv10, ByteTrack, OpenCV, PyTorch; currently learning LLM engineering and RAG. Data: MongoDB. Infra: Cloudflare Pages and Workers, Arcjet.

## Problem solving and achievements

500+ data-structures-and-algorithms problems solved; LeetCode rating 1657. Achievements include 3rd place in a CTF competition and 1st place at AAVISHKAAR. He has held roles in IEEE and E-Cell student organizations.

## Is he good at football analytics yet?

Honestly: in progress. The World Cup prediction engine is active research — the models run (10,000-tournament Monte Carlo simulations with an ensemble of Poisson, XGBoost, LightGBM and Elo), but it has not been validated against a real tournament yet. That is why it lives in the lab and not on the missions page.

## This website

The portfolio itself (ANSHU.OS) is a SvelteKit site on Cloudflare Pages, styled as a personal operating system — boot sequence, command palette terminal, and this chatbot, which is a RAG system over his resume, case studies, and blog posts. The chatbot answers only from indexed content and says so when it doesn't know.
