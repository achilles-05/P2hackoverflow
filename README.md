# ResiLink - Smart Hostel Issue Tracking System

ResiLink is a premium, full-stack web application designed to streamline maintenance requests and communication in student hostels. Built for HackOverflow.

Please use demo credentials to see the website features initially. 

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Glassmorphism
- **UI Library**: Shadcn/ui
- **Animations**: Framer Motion
- **Backend**: Supabase (Auth, Database)
- **Charts**: Recharts

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm

### 2. Installation
*Important: You must install dependencies first as they were not included in the zip to save space.*

```bash
npm install
```

### 3. Environment Setup
Ensure you have a `.env.local` file in the root directory with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Locally (Development)
To start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 5. Build for Production (Optional)
To build and start the optimized production version:

```bash
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## PLEASE USE FOLLOWING DEMO CREDENTIALS TO VIEW THE WEBSITE FEATURES BETTER 

Admin ID: admin@resilink.com
Admin Password: admin123

Student ID: student@resilink.com
Student Password: student123

## 📂 Project Structure

- `/src/app`: App Router pages and layouts.
- `/src/components`: UI components (Shadcn), forms, and charts.
- `/src/utils/supabase`: Supabase client/server utilities.

## ✨ Key Features

- **Admin Dashboard**: Analytics charts and issue management table.
- **Student Portal**: Issue reporting wizard with **Smart Duplicate Detection**.
- **Dark Mode**: Fully supported system-wide dark mode.


