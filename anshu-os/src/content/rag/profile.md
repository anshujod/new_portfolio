---
title: About Anshu
---

<!-- TODO(anshu): review every fact in this file — it is the chatbot's source of truth.
     Wrong facts here become confident wrong answers on your own site. -->

## Identity

Anshu Prakash Hindoyar is a full-stack engineer and applied AI developer based in Bengaluru, India. He was born on 11 October 2003 (date of birth 11 October 2003), and his age is 22 — he is 22 years old. Contact: anshuprakash55@gmail.com.

## Education

Anshu's place of study is Ramaiah Institute of Technology (RIT), an engineering college in Bengaluru. He is studying for a Bachelor of Engineering (BE) degree in Electronics and Communication Engineering (ECE), which he started in 2022. His education is a BE in ECE from Ramaiah Institute of Technology in Bengaluru. He has also completed the LLM Engineering course (Ed Donner's "LLM Engineering: Master AI and Large Language Models" on Udemy) — an eight-week hands-on program covering frontier model APIs and multimodality, open-source LLMs with Hugging Face and Ollama, retrieval-augmented generation, QLoRA fine-tuning, and building agentic AI systems.

## Current work

Anshu's recent work experience: he interned at Azilora Technologies as a full-stack engineer (January–April 2026), working on production software with 200+ active users, where he shipped and maintained 20+ features. He is going deep on LLMs, agents, and retrieval systems, and has shipped a World Cup 2026 prediction engine — a stacked ML ensemble (Poisson, XGBoost, LightGBM, Elo with a logistic meta-learner and Platt calibration) run through 10,000-tournament Monte Carlo simulation, backtested on three prior World Cups.

## Computer vision at Tata Steel

His strongest applied-AI credential: a people detection and counting system for Tata Steel, running on live plant CCTV inside an operating steel facility. Built on YOLOv10 for detection and ByteTrack for tracking. He curated and annotated a 15,000-image custom dataset, iterating through failure-harvesting cycles — most of the accuracy gains came from dataset work, not model changes. Lessons: hard frames are worth more than easy frames, night-shift IR footage is its own distribution, and trackers fix counting rather than detection.

## Products shipped

Chatify is a real-time messaging app: Socket.IO over websockets, JWT-authenticated socket handshakes, Zustand state, MongoDB history, and Arcjet IP rate limiting. AI ThumbnailGen turns prompts into thumbnail candidates for creators, with a credit system as a cost circuit-breaker and server-side prompt assembly. The MERN Auth System is a production-grade authentication layer — access plus refresh token rotation with family tracking, httpOnly cookies, email verification, password reset — reused as the auth seed in his later projects. Quiz App is a cross-platform quiz platform — a React web client, a React Native (Expo) mobile app, and an Express + Supabase backend — with role-based auth, timed gameplay, leaderboards, image and video questions, and web-push notifications.

## Skills and tech stack

Anshu's complete tech stack — the technologies, languages, and frameworks he is good at and has worked with. Languages: JavaScript, TypeScript, Python, C++. Frontend and mobile: React, React Native, Expo, SvelteKit, Vite, Tailwind CSS, and PWAs. Backend: Node.js, Express, Socket.IO and WebSockets, REST APIs, and JWT authentication. Machine learning and computer vision: PyTorch, scikit-learn, XGBoost, LightGBM, YOLOv10, ByteTrack, OpenCV, Elo ratings, Poisson models, Monte Carlo simulation, and SHAP. LLMs and AI engineering: retrieval-augmented generation (RAG), embeddings, BM25, Cloudflare Workers AI, frontier model APIs (OpenAI, Anthropic Claude, Google Gemini), Hugging Face transformers, open-source models with Ollama, LangChain, Chroma vector database, Gradio, LoRA/QLoRA fine-tuning, and agentic AI (multi-agent pipelines with tool use). Databases and storage: MongoDB and Supabase (Postgres, auth, storage). Cloud and infrastructure: Cloudflare Pages and Workers, Vercel, Streamlit, and Arcjet for rate limiting. He is currently going deeper on LLM engineering, agents, and retrieval systems.

## Problem solving and achievements

500+ data-structures-and-algorithms problems solved; LeetCode rating 1657. Achievements include 3rd place in a CTF competition and 1st place at AAVISHKAAR. He has held roles in IEEE and E-Cell student organizations.

## Is he good at football analytics yet?

Getting there, and now with evidence. The World Cup 2026 prediction engine is a stacked ensemble — Poisson, XGBoost, LightGBM and Elo, combined by a logistic meta-learner with Platt calibration — run through 10,000-tournament Monte Carlo simulation. It is backtested on the 2014, 2018 and 2022 World Cups: on that 192-match holdout the calibrated ensemble scores 55.7% accuracy and a 0.216 RPS skill score over a uniform baseline. It is deployed on a Streamlit dashboard and ships as a mission on this site. The honest caveat: it has not been validated against the 2026 tournament yet, because that tournament is the test set no one has.

## This website

The portfolio itself (ANSHU.OS) is a SvelteKit site on Cloudflare Pages, styled as a personal operating system — boot sequence, command palette terminal, and this chatbot, which is a RAG system over his resume, case studies, and blog posts. The chatbot answers only from indexed content and says so when it doesn't know.
