# Hiro – Project Management Dashboard

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

## Overview

Hiro is a modern SaaS-style project management dashboard built for design, software development, and product teams. It centralizes project planning, task management, team collaboration, and progress tracking into a clean, responsive, and interactive workspace inspired by products like Linear, Notion, and Stripe.

The application offers multiple project views, smooth drag-and-drop interactions, persistent local storage, and goal tracking to help teams stay organized and deliver projects efficiently.

---

## Features

### Dashboard
- Workspace overview
- Project progress analytics
- Urgent task highlights
- Recent team activity
- Favorite workspaces

### Task Management
- Create, edit, and delete tasks
- Rich task details
- Multiple assignees
- Categories and labels
- Priority levels
- Due dates
- Cover images
- Attachments
- Comments
- Checklists
- Like / Upvote system

### Kanban Board
- Drag-and-drop task management
- Four workflow stages:
  - To Do
  - In Progress
  - QA
  - Done
- Confetti celebration when tasks are completed

### List View
- Interactive task table
- Inline task creation
- Quick status updates
- Sorting and filtering
- Fast editing

### Calendar View
- Monthly calendar
- Due date visualization
- Previous / Next month navigation
- Today shortcut
- Create tasks directly from calendar cells

### Goals & OKRs
- Goal tracking
- Progress indicators
- Owner assignment
- Status monitoring
- Milestone management

### Team Management
- Member directory
- Roles
- Departments
- Email information
- Active workload overview

### Collaboration
- Notifications
- Team chat panel
- Workspace switching
- Project sharing
- Permission management

### Customization
- Light Mode
- Dark Mode
- Favorite projects
- Demo data reset

### Search & Filters
- Global search
- Category filter
- Priority filter
- "Only Mine" filter
- Custom sorting

---

## Tech Stack

- React 19
- TypeScript
- Vite 8
- Tailwind CSS v4
- dnd-kit
- Motion
- Canvas Confetti
- Lucide React
- Local Storage

---

## Data Persistence

All application data is stored locally in the browser using Local Storage.

Storage keys:

- `hiro_tasks_v2`
- `hiro_projects_v2`
- `hiro_members_v2`

Data remains available even after refreshing the page.

---

## Responsive Design

Designed for every screen size:

- Mobile
- Tablet
- Laptop
- Desktop
- Ultra-wide monitors

---

## UI Principles

- Clean and modern interface
- Minimal visual clutter
- Fast interactions
- Smooth animations
- Responsive layout
- Accessible typography
- Consistent spacing
- Dark mode support

---

## Project Structure

```text
src/
├── components/
├── pages/
├── hooks/
├── contexts/
├── layouts/
├── data/
├── utils/
├── types/
├── assets/
└── App.tsx
```

---

## Installation

```bash
git clone https://github.com/yourusername/hiro-dashboard.git

cd hiro-dashboard

npm install

npm run dev
```

---

## Build

```bash
npm run build
```

---

## Preview

```bash
npm run preview
```

---

## Main Highlights

- Modern SaaS dashboard
- Smooth drag-and-drop Kanban
- Multiple project workspaces
- Calendar & List views
- Goal and OKR tracking
- Rich task management
- Team collaboration
- Persistent local storage
- Mobile-first responsive design
- Light & Dark themes
- Fast performance with Vite
- Built with React 19 + TypeScript

---

## License

This project is licensed under the MIT License.
