---
title: "How I built this portfolio in 1 day with Spec Driven Development and RAG"
date: 2026-07-01
excerpt: A practical walkthrough of building this site with Spec Driven Development, from the spec-driven process to a working RAG chat on Cloudflare's free tier.
lang: en
author: Diego Betancourt
---

The question I always asked myself was: why do projects deviate so much from the initial plan? After years of iterating on processes, I found a partial answer in what I call **Spec Driven Development (SDD)**. Then I turned the theory into a working feature: a RAG chat that answers questions about me directly on the site.

This article walks through both halves. First, the process that kept the build on track. Then, a concrete end-to-end example of that process applied to one feature — **how the RAG chat was specified, planned, tasked, and shipped with zero server cost**.

## What is Spec Driven Development?

SDD is not a new methodology. It's simply a commitment: **no code without spec, no spec without validation**. Every technical decision has a documented "why" and a verifiable acceptance criterion.

:::note
The core principle: every layer feeds into the next. The constitution defines non-negotiable principles. The spec answers "what". The plan answers "how". The tasks answer "when".
:::

```
┌─────────────────────────────────────────────────┐
│                  SDD FLOW                        │
├─────────────────────────────────────────────────┤
│                                                  │
│   ┌──────────────┐    ┌──────────────┐          │
│   │ Constitution │───▶│     Spec     │          │
│   └──────────────┘    └──────┬───────┘          │
│                               │                  │
│                               ▼                  │
│                        ┌──────────────┐          │
│                        │     Plan     │          │
│                        └──────┬───────┘          │
│                               │                  │
│                               ▼                  │
│                        ┌──────────────┐          │
│                        │    Tasks     │          │
│                        └──────┬───────┘          │
│                               │                  │
│                               ▼                  │
│                        ┌──────────────┐          │
│                        │    Code      │          │
│                        └──────────────┘          │
└─────────────────────────────────────────────────┘
```

## Step 1: The Constitution

Every methodology needs boundaries. A constitution defines what we **won't** do, what's non-negotiable. For this portfolio, I defined 6 principles:

:::tip
A constitution is not a wish list. It's a set of constraints that force better decisions. The fewer principles, the stronger they are.
:::

1. **Minimal stack**: Astro + Tailwind CSS only
2. **Spec first**: Every feature requires spec before code
3. **Spec and code always synchronized**
4. **Minimal E2E tests** (constitution #4)
5. **English in code**
6. **Zero unnecessary runtime dependencies**

## Step 2: The Spec

Here's where it gets interesting. A spec isn't a 40-page document. It's the answer to: **what do we want to build and how do we know it's done?**

### Functional Requirements (FRs)

Each requirement uses EARS notation to eliminate ambiguity:

```text
FR-1: Navigation sidebar
  WHEN the user is on desktop (≥768px)
  THE sidebar remains visible on the left side
  AND contains links to all sections
  AND the active section highlights dynamically (scroll spy)
```

:::note
EARS syntax forces you to think about:
- **WHEN**: activation condition
- **THE**: expected behavior
- **AND**: additional conditions
:::

### The "Done When" Criterion

Each task has a verifiable criterion:

```text
T-4: Create Navigation component with sidebar (desktop)
  FRs: FR-1
  Done when: Sidebar visible on desktop (≥768px) 
             with links to all sections
```

:::warning
Without a "done when" criterion, you're guessing when a task is complete. This is where scope creep begins.
:::

## Step 3: The Plan

The plan translates the spec into code structure. It maps requirements to modules and defines the implementation order:

```text
src/
├── components/       # Reusable components
├── content/          # Static data (JSON/MD)
├── i18n/             # Translations
├── layouts/          # Base layout
└── pages/            # Routes
```

:::tip
The plan should never contain code. It contains decisions, structure, and validation strategy. Code comes after.
:::

## Step 4: The Tasks

Here theory becomes executable practice. Each task references specific FRs and has a verifiable completion criterion:

- **Setup** (T-1, T-2) — Foundation and design tokens
- **Layout & Navigation** (T-3 to T-6) — Structural shell
- **i18n System** (T-7, T-8) — Language support
- **Sections Content** (T-9 to T-13) — Core content
- **Blog** (T-14 to T-17) — Articles and reading
- **Main Page Assembly** (T-18) — Integration
- **Testing** (T-19 to T-22) — Verification

:::prompt
Ask yourself before every task: "Which FR does this serve?" If you can't answer, the task shouldn't exist.
:::

## The Result

In 1 day we had:

- Main page with 5 sections
- Blog with articles (ES + EN)
- Navigation with scroll spy
- Working language selector
- A RAG chat answering questions about Diego
- Verified static build

## Case Study: the RAG chat, end to end

SDD sounds abstract until you watch it crunch through a real feature. The **chat** — a RAG assistant that answers questions about me from a single source document — is the best example because its spec was written separately and the whole thing shipped on Cloudflare's **free tier**.

### Step 2 applied: the Spec

The chat spec (see `specs/002-portfolio-IA-deploy/spec.md`) answered *what* we were building before any code:

- The chat sits right after **Projects**, before the CV.
- Q&A is limited to **10 questions per session**, tracked in **Cloudflare KV** with a 24-hour TTL.
- The answer streams into the browser in the **active portfolio language** (ES/EN), regardless of the question's language.
- Out-of-scope questions return a fixed bilingual message and point you to Contact.

Notably, the spec *justified why not to over-engineer*: with a single source document, a managed vector database (Vectorize) or AutoRAG added cost and a dependency with zero benefit. That restraint is SDD doing its job — free infrastructure, one file.

### Step 3 applied: the Plan

The plan (see `specs/002-portfolio-IA-deploy/plan.md`) made two key architecture decisions:

1. **100% server-side pipeline in a single Cloudflare Pages Function.** No embeddings or vector search in the browser — keeps the visitor from downloading heavy models.
2. **Build-time indexing.** A Node script runs on every build, reads the one source file, splits it into overlapping chunks, generates embeddings via Workers AI, and writes them to a static JSON.

The generation model was deferred in the plan (the Workers AI catalog changes often) and resolved at implementation time with **`@cf/baai/bge-m3`** for embeddings (multilingual, 100+ languages, so no per-language index) and **`@cf/zai-org/glm-4.7-flash`** for streaming answers.

### Step 4 applied: the Tasks

The tasks turned the plan into concrete, verifiable steps. Here's the workflow they defined:

- A **build script** (`scripts/build-rag-index.ts`) reads the source, chunks it (`300 words/chunk`, `40-word overlap`), embeds it, and writes `rag-index.json`.
- A **Cloudflare Worker endpoint** `POST /api/chat` that rate-limits, embeds the question, retrieves the top-K chunks by cosine similarity, builds the prompt, and streams the answer.
- Reusable RAG modules (`src/lib/rag/`): cosine retrieval, prompt building with an out-of-scope marker, streaming with marker detection, and KV-based rate limiting.

Each step carried a "done when" criterion, so "the chat is done" meant something specific rather than a guess.

### The RAG pipeline at a glance

```text
┌───────────── BUILD TIME ─────────────┐   ┌────────────── RUNTIME ──────────────┐
│                                      │   │                                      │
│  rag-source.md                       │   │  POST /api/chat                      │
│      │                               │   │      │                              │
│      ▼                               │   │      ▼                              │
│  chunk (300 words, 40 overlap)       │   │  check rate limit (KV, 10/session)  │
│      │                               │   │      │                              │
│      ▼                               │   │      ▼                              │
│  embed @cf/baai/bge-m3               │   │  embed the question (bge-m3)        │
│      │                               │   │      │                              │
│      ▼                               │   │      ▼                              │
│  rag-index.json (static) ────────────┼──▶│  cosine similarity, top-K = 3       │
│                                       │      │                                  │
│                                       │      ▼                                  │
│                                       │  build prompt (context + question)     │
│                                       │      │                                  │
│                                       │      ▼                                  │
│                                       │  stream glm-4.7-flash answer ──▶       │
└───────────────────────────────────────┘   └─────────────────────────────────────┘
```

Every step is designed to stay free: a single document means retrieval is a trivial cosine scan, not a distributed search; and Workers AI's stable daily quota (rather than AutoRAG's beta billing) keeps the cost at zero.

:::note
The retrieval itself is deliberately simple. Because the corpus is one file, we load the precomputed index into memory and scan all chunks — there is nothing to index, shard, or tune. Choosing *not* to add a vector database was the architectural decision that mattered.
:::

This feature also mattered to my portfolio because it embodies the same principle as SDD: a single source of truth (the document and the spec) driving everything downstream.

## Why Does It Work?

SDD doesn't eliminate complexity. It makes it **explicit before writing code**.

```text
WITHOUT SDD                      WITH SDD
"I implemented something"         "I implemented FR-3 per spec"
"I think it's done"             "Done when: section visible"
"Was this in the plan?"        "Spec says X, code does X"
```

The RAG chat is a living proof of this. Its spec documented *what*, its plan *how*, and its tasks *when* — so when we hit edge cases (a vetted out-of-scope message, a rate limit, a model that must stream), each had a pre-written requirement and an acceptance criterion. Nothing was designed on the fly.

:::note
The goal isn't to follow the process blindly. The goal is to have a process you can **inspect and improve**. SDD gives you the artifacts to do that — and the RAG chat is an artifact you can literally have a conversation with.
:::

If you're curious about any piece — the chunking strategy, the cosine retrieval, the streaming tricks, or the spec-to-code mapping — ask the chat on the homepage. It knows this article better than I summarized it.
