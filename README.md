# StackNext

A modern Stack Overflow-inspired community platform built with Next.js, TypeScript, MongoDB, and AI-powered experiences.

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/MongoDB-7-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/AI-powered-412991?style=for-the-badge&logo=openai&logoColor=white" alt="AI powered" />
</div>

## Overview

StackNext is a full-stack developer Q&A app inspired by Stack Overflow, designed to help users ask questions, share answers, discover relevant topics, and participate in a growing developer community.

The project combines a polished, responsive interface with practical features such as user authentication, question management, voting, bookmarking, tag-based discovery, job listings, and AI-assisted answer generation.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- MongoDB
- Mongoose
- NextAuth + custom auth flow
- Clerk integration
- OpenAI/AI SDK
- ShadCN UI
- Zod validation

## Core Features

- Secure authentication and user profiles
- Ask, edit, and delete questions
- Rich answer posting and voting system
- Search, filters, and pagination for discussions
- Tag-based browsing and discovery
- Bookmarking and saved collections
- Community user directory
- Job discovery pages
- AI-generated answer suggestions
- Responsive dashboard-style layout
- Light/dark theme support

## Project Structure

```bash
.
├── app/
├── components/
├── context/
├── database/
├── lib/
├── public/
├── types/
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js 18+
- npm or pnpm
- MongoDB instance
- API keys for AI and third-party services

### Clone the repository

```bash
git clone https://github.com/vishalsolanki-v/stackNext.git
cd stackNext
```

### Install dependencies

```bash
npm install
```

### Environment variables

Create a `.env.local` file in the project root and add variables like:

```env
MONGODB_URI=
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
NEXT_PUBLIC_RAPID_API_KEY=
NEXT_PUBLIC_TINYMCE_API_KEY=
OPENAI_API_KEY=
NEXT_CLERK_WEBHOOK_SECRET=
AUTH_SECRET=
NODE_ENV=development
```

Update the values with your own credentials before running the app.

### Run locally

```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Notes

This project is a personal build focused on creating a polished developer community experience inspired by modern Q&A platforms.

It is designed for learning, experimentation, and feature development in a production-style full-stack Next.js setup.


