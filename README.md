# Vellum

Vellum is a comprehensive productivity system designed to help you plan, execute, and analyze your work. It is built for students, researchers, and professionals who need more than a simple to-do list.

The name Vellum refers to the high-quality parchment used for historical manuscripts. This choice reflects the application's purpose: to serve as a premium, durable workspace for your most significant projects.

## Overview

Traditional productivity tools often fail because they treat all tasks as equal and ignore the user's energy levels. Vellum addresses this by introducing an intelligent layer between your task list and your calendar. It understands that productivity is limited not just by time, but by mental energy.

The system helps you by:

1.  **Breaking down large goals** into manageable steps using artificial intelligence.
2.  **Scheduling tasks automatically** based on when you are most productive.
3.  **Tracking your focus** to provide insights into your work habits.

## Key Features

### Intelligent Task Management

When you add a complex task, Vellum can automatically analyze it and break it down into smaller, actionable sub-tasks. It estimates the difficulty and time required for each step, allowing you to start working immediately without being overwhelmed by the scale of the project.

### Smart Scheduling

The application takes your list of tasks and automatically arranges them into your daily schedule. It respects your defined working hours and avoids scheduling conflicting appointments. The interface supports drag-and-drop adjustments, giving you full control over the final plan.

### Focus and Execution

Vellum includes a built-in focus timer that tracks your work sessions. This eliminates the need for external time-tracking tools and ensures that your productivity data is captured accurately within the system.

### Performance Analytics

The application provides detailed insights into your work patterns:

- **Focus Distribution**: Visualizes how much time you spend on different types of tasks.
- **Velocity Tracking**: Monitors your completion rate to help you predict future performance.
- **Energy Mapping**: identifies your peak productivity hours based on historical data.

## deeply Integrated Scheduler

The core innovation in Vellum is its scheduling engine, which automates the planning process. This system follows a specific logic to ensure your day is balanced and productive.

### 1. Prioritization

Before scheduling begins, the engine ranks every active task. It considers the deadline and the priority level (High, Medium, or Low) you have assigned. Tasks that are urgent or high-priority are placed at the front of the queue to ensure they are scheduled first.

### 2. Energy Profiling

Vellum does not simply fill empty time slots. It analyzes your past work sessions to build an "Energy Profile." This profile identifies the times of day when you are historically most focused and productive.

### 3. Adaptive Placement

The scheduler uses your Energy Profile to make intelligent decisions:

- **High-Difficulty Tasks**: These are placed during your peak energy hours.
- **Routine Tasks**: These are scheduled during your lower-energy periods.
  This ensures that you are doing the right work at the right time.

### 4. Workload Balancing

To prevent burnout, the system enforces spacing between intensive tasks. It avoids placing too many difficult tasks back-to-back and ensures that your schedule includes necessary buffers. If a task cannot fit into the current day without violating these rules, it is automatically moved to the next available slot.

## Technical Technology Stack

### Frontend Application

- **React 19**: The core framework for the user interface.
- **TypeScript**: Ensures code safety and reliability.
- **Tailwind CSS**: Provides a custom, responsive design system.
- **Framer Motion**: Handles smooth transitions and interactions.
- **Recharts**: Renders the analytics and data visualizations.

### Backend Services

- **NestJS**: A progressive Node.js framework for building efficient server-side applications.
- **Supabase**: Provides the PostgreSQL database and authentication services.
- **OpenAI & Llama 3**: Powers the artificial intelligence features for task analysis and breakdown.

## Getting Started

### Prerequisites

To run Vellum locally, you will need:

- Node.js (version 18 or higher)
- A Supabase account and project
- An OpenAI API key

### Installation Instructions

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/emanalytic/vellum.git
    cd vellum
    ```

2.  **Backend Configuration**
    Navigate to the backend directory and install the required dependencies:

    ```bash
    cd backend
    npm install
    # Create a .env file with your credentials (PORT, SUPABASE_URL, etc.)
    npm run start:dev
    ```

3.  **Frontend Configuration**
    Open a new terminal window, navigate to the frontend directory, and install dependencies:
    ```bash
    cd ../frontend
    npm install
    # Create a .env file with your credentials (VITE_SUPABASE_URL, etc.)
    npm run dev
    ```

The application will be accessible at `http://localhost:5173`.

---

Author: Eman Nisar ([@emanalytic](https://github.com/emanalytic))
