# TaskFlow - Task Management Web Application

A Task Management Web Application built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **MongoDB (Mongoose)**.

## Key Features

- **Workspaces & Tasks**:
  - Separate workspaces (e.g. **Personal**, **Work**, and custom workspaces).
  - Full CRUD operations for tasks (Title, Description, Priority [Low, Medium, High], Status [To Do, In Progress, Done], Due Date).
- **Search, Dual Filtering & Sorting**:
  - As-you-type live search across titles and descriptions.
  - Concurrent filtering by **Status** and **Priority**.
  - Sort by **Due Date** (soonest/latest), **Priority**, or creation time.
  - View modes: **Kanban Board (Drag & Drop)**, **List View**, and **Grid View**.
- **Recent Activity Log**:
  - Automatic logging of all user operations.
  - Sidebar drawer displaying the **last 5 actions** with relative timestamps.
- **Form Checks & Validation**:
  - Required field validations (Title & Workspace).
  - Due date validation preventing past date selection + quick date presets ("Today", "Tomorrow", "Next Week").
- **Data Persistence**:
  - REST API routes with Mongoose models (`/api/workspaces`, `/api/tasks`, `/api/activities`, `/api/seed`).
  - Seamless fallback to `localStorage` sync if local MongoDB is offline.
- **Bonus Features**:
  - **Drag-and-Drop** task card status updating between Kanban columns.
  - **Automated Unit Tests** using Vitest (10 tests passing across validation, filtering, and activity logger).

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Run unit tests
npm test

# 4. Build for production
npm run build
npm start
```
