# Project Prompt Generation Tool

A full-stack application that uses AI to interview you about your project idea, refining it into a perfect, detailed prompt for other LLMs.

![Project Screenshot](https://via.placeholder.com/800x400?text=Project+Prompt+Generator+Screenshot)

## Features

-   **Interactive Interview**: An AI agent asks you clarifying questions about your project idea.
-   **Adaptive Phases**: Questions cover Core Features, Tech Stack, UI/UX, Security, and more.
-   **Project Manager**: Save, resume, separate, and manage multiple project ideas.
-   **Final Prompt Generation**: transforming your answers into a high-quality, comprehensive prompt.
-   **Customizable**: Choose how many questions and which topics to focus on.

## Tech Stack

-   **Frontend**: Next.js (React), TypeScript, Tailwind CSS.
-   **Backend**: Python, FastAPI.
-   **AI**: Google Gemini (via `google-genai` / `google-generativeai`).

## Setup & Installation

### Prerequisites

-   Node.js & npm
-   Python 3.9+
-   A Google Gemini API Key

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Create a virtual environment:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Create a `.env` file and add your API key:
    ```env
    GEMINI_API_KEY=your_api_key_here
    ```
5.  Start the server:
    ```bash
    ./restart.sh
    # OR
    uvicorn main:app --reload --port 8000
    ```

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    ./restart.sh
    # OR
    npm run dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1.  Click **"Project Manager"** to see your saved sessions or start a **"+ New Project"**.
2.  Enter your raw project idea.
3.  Select the phases you want to discuss (e.g., Tech Stack, UI/UX).
4.  Answer the AI's questions. You can let the agent decide options for you.
5.  Once finished, review the **Summary** and generate your **Final Prompt**.
6.  Copy the prompt and use it to kickstart your development!

## License

MIT
