# API Reference

Base URL: `http://localhost:8000`

## Core Endpoints

### `POST /generate-question`

Generates the next interview question based on the conversation history.

-   **Body**:
    ```json
    {
      "idea": "string",
      "history": [{"question": "string", "selected_option": "string"}],
      "total_questions": int,
      "current_phase": "string"
    }
    ```
-   **Response**:
    ```json
    {
      "text": "Question text...",
      "options": ["Option A", "Option B", "Agent's Choice", "Other"]
    }
    ```

### `POST /generate-prompt`

Generates the final comprehensive prompt.

-   **Body**:
    ```json
    {
      "idea": "string",
      "answers": [{"question": "string", "selected_option": "string"}],
      "selected_phases": ["string"]
    }
    ```
-   **Response**:
    ```json
    {
      "prompt": "Markdown formatted prompt..."
    }
    ```

### `POST /explain-question`

Provides a detailed explanation of why a question is being asked and what the options mean.

-   **Body**:
    ```json
    {
      "idea": "string",
      "question": "string",
      "options": ["string"]
    }
    ```

## Project Management Endpoints

### `POST /save-progress`

Saves the current session.

-   **Body**: Full `ProjectState` object.
-   **Response**: `{"message": "Progress saved", "id": "string"}`

### `GET /list-saves`

Lists all saved projects.

-   **Response**:
    ```json
    {
      "saves": [
        {
          "id": "string",
          "idea": "string",
          "timestamp": "ISO8601",
          "progress": "5/20"
        }
      ]
    }
    ```

### `GET /load-progress/{save_id}`

Loads a specific project state.

### `DELETE /delete-save/{save_id}`

Deletes a saved project.
