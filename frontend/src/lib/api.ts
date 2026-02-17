import { Answer, Question, ProjectState } from './types';

const API_BASE_URL = 'http://localhost:8000';

export async function generateQuestion(
    idea: string,
    history: Answer[],
    totalQuestions: number,
    currentPhase: import('./types').ProjectPhase
): Promise<Question> {
    const response = await fetch(`${API_BASE_URL}/generate-question`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            idea,
            history,
            total_questions: totalQuestions,
            current_phase: currentPhase,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate question');
    }

    return response.json();
}

export async function generatePrompt(
    idea: string,
    answers: Answer[],
    selectedPhases: import('./types').ProjectPhase[]
): Promise<{ prompt: string }> {
    const response = await fetch(`${API_BASE_URL}/generate-prompt`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            idea,
            answers,
            selected_phases: selectedPhases,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate prompt');
    }

    return response.json();
}

export async function explainQuestion(
    idea: string,
    question: string,
    options: string[]
): Promise<import('./types').ExplainResponse> {
    const response = await fetch(`${API_BASE_URL}/explain-question`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            idea,
            question,
            options,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get explanation');
    }

    return response.json();
}

export async function saveProgress(data: any): Promise<{ message: string, id: string }> {
    const response = await fetch(`${API_BASE_URL}/save-progress`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to save progress');
    }

    return response.json();
}

export async function listSaves(): Promise<{ saves: any[] }> {
    const response = await fetch(`${API_BASE_URL}/list-saves`);
    if (!response.ok) {
        throw new Error('Failed to list saves');
    }
    return response.json();
}

export async function loadProgress(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/load-progress/${id}`);
    if (!response.ok) {
        throw new Error('Failed to load progress');
    }
    return response.json();
}
export async function deleteSave(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/delete-save/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Failed to delete save');
    }

    return response.json();
}
