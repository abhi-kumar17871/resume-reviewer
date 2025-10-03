# Resume Review Platform

This is a full-stack application designed to help users get professional feedback on their resumes. Users can upload their resumes, which are then reviewed by designated administrators who provide scores and written feedback. The platform includes user authentication, file storage, a public leaderboard for high-scoring resumes, and email notifications.

---

## Table of Contents

-   [Tech Stack](#tech-stack)
-   [Getting Started](#getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Supabase Setup](#supabase-setup)
    -   [Local Development](#local-development)
-   [Key Features](#key-features)
-   [Future Improvements](#future-improvements)

---

## Tech Stack

This project is built with a modern, full-stack TypeScript setup:

* **Framework**: **Next.js (App Router)** - Used for its powerful full-stack capabilities, including Server Components, Server Actions, and file-based routing.
* **Backend & Database**: **Supabase** - Serves as the all-in-one backend for authentication, database storage, and file management (resumes).
* **Styling**: **Tailwind CSS** - A utility-first CSS framework used for rapidly building a modern and responsive user interface.
* **UI Components**: Primarily custom components, using **`lucide-react`** for icons.
* **File Uploads**: **`react-dropzone`** is used to provide a user-friendly drag-and-drop interface for uploading resumes.
* **Email Notifications**: **Nodemailer** is used on the backend to send email notifications to users when their resume status is updated/route.ts`].
* **Language**: **TypeScript** - Used across the entire project for type safety, better developer experience, and more maintainable code.

---

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

* Node.js (v18 or later)
* npm, yarn, or pnpm
* A Supabase account

### Supabase Setup

1.  **Create a Supabase Project**: Go to [supabase.com](https://supabase.com) and create a new project.
2.  **Database Schema**: You will need to set up your database tables. The primary table is `resumes`. You should also enable Row Level Security (RLS) policies to ensure users can only access their own data.
3.  **Authentication**: Enable **Email** as an authentication provider in your Supabase project settings.
4.  **Storage**: Create a new public storage bucket named `resumes` to store the uploaded PDF files.
5.  **Get API Keys**: From your Supabase project settings, find and copy the **Project URL**, **`anon` key**, and **`service_role` key**.

### Local Development

1.  **Clone the Repository**:
    ```bash
    git clone <your-repository-url>
    cd resume-review-platform
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Variables**:
    Create a new file named `.env.local` in the root of the project and add the following variables, replacing the placeholder values with your Supabase credentials and other settings:

    ```env
    # Supabase Configuration
    NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
    SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>

    # Email Server Configuration (using Gmail App Password)
    EMAIL_SERVER_USER=your-email@gmail.com
    EMAIL_SERVER_PASSWORD=your-gmail-app-password

    # Site URL
    NEXT_PUBLIC_SITE_URL=http://localhost:3000
    ```

4.  **Run the Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Admin Credentials
* Admin-Id: admin@gmail.com
* Admin-Password: 123456
---
## Key Features

* **User Dashboard**: A dedicated space for users to upload resumes and view the status and feedback of their latest submission.
* **Admin Panel**: A secure area for administrators to view all submissions and provide detailed reviews, including a score and notes.
* **Modal-Based Review**: Admins can review resumes directly within a modal on the submissions page, which includes a PDF preview.
* **Public Leaderboard**: A page showcasing the highest-scoring resumes to inspire users and add a competitive element.
* **Email Notifications**: Automatic emails are sent to users when an admin updates the status of their resume.
* **Notification Preferences**: Users can enable or disable email notifications from their settings page.

---

## Future Improvements

While the platform is functional, here are some potential areas for future development:

* **AI-Based Resume Summarizer**: Integrate a large language model (LLM) to automatically generate summaries and identify key skills from uploaded resumes, providing admins with a quick overview.
* **Advanced Admin Dashboard**: Implement a dashboard with analytics, such as submission volume over time, average scores, and reviewer performance.
* **Resume Versioning**: Allow users to upload new versions of the same resume and track feedback history over time.
