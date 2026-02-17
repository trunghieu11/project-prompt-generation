'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import StartForm from '@/components/StartForm';
import QuestionCard from '@/components/QuestionCard';
import SummarySection from '@/components/SummarySection';
import ResultSection from '@/components/ResultSection';
import SaveButton from '@/components/SaveButton';
import { generateQuestion, generatePrompt, saveProgress, loadProgress } from '@/lib/api';
import { ProjectState, Question, Answer, ProjectPhase } from '@/lib/types';

const PHASES: ProjectPhase[] = [
    'Core Features',
    'Tech Stack',
    'UI/UX Design',
    'Data Strategy',
    'Security & Privacy',
    'Testing Strategy',
    'DevOps & Scalability',
    'Observability & Maintenance'
];

export default function Home() {
    const [state, setState] = useState<ProjectState>({
        id: undefined,
        idea: '',
        totalQuestions: 20,
        history: [],
        currentQuestion: null,
        loading: false,
        error: null,
        finalPrompt: null,
        selectedPhases: PHASES,
    });

    const getPhase = (currentQuestionIndex: number, total: number, selectedPhases: ProjectPhase[]): ProjectPhase => {
        if (selectedPhases.length === 0) return 'Core Features'; // Fallback

        const phaseIndex = Math.floor((currentQuestionIndex / total) * selectedPhases.length);
        // Ensure index is within bounds (handles 100% case)
        const safeIndex = Math.min(phaseIndex, selectedPhases.length - 1);
        return selectedPhases[safeIndex];
    };

    // Handle query param loading
    const searchParams = useSearchParams();
    const loadId = searchParams.get('load');

    useEffect(() => {
        if (loadId) {
            handleLoad(loadId);
            // Optional: Clear the param from URL to prevent reload loops or unclean URL
            window.history.replaceState(null, '', '/');
        }
    }, [loadId]);

    const handleLoad = async (id: string) => {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        try {
            const data = await loadProgress(id);
            setState({
                id: data.id,
                idea: data.idea,
                totalQuestions: data.total_questions,
                history: data.history,
                currentQuestion: null,
                loading: false,
                error: null,
                finalPrompt: data.final_prompt || null,
                selectedPhases: data.selected_phases || PHASES,
            });

            if (!data.final_prompt && data.history.length < data.total_questions) {
                const nextPhase = getPhase(data.history.length, data.total_questions, data.selected_phases || PHASES);
                const question = await generateQuestion(data.idea, data.history, data.total_questions, nextPhase);
                setState(prev => ({ ...prev, currentQuestion: question }));
            }

        } catch (err: any) {
            setState((prev) => ({
                ...prev,
                loading: false,
                error: err.message || 'Failed to load session',
            }));
        }
    };

    const handleSave = async () => {
        let saveId = state.id;
        if (!saveId) {
            saveId = Date.now().toString();
            setState(prev => ({ ...prev, id: saveId }));
        }

        const currentPhase = getPhase(state.history.length, state.totalQuestions, state.selectedPhases);

        const data = {
            id: saveId,
            idea: state.idea,
            total_questions: state.totalQuestions,
            history: state.history,
            current_phase: currentPhase,
            selected_phases: state.selectedPhases,
            final_prompt: state.finalPrompt || ""
        };

        try {
            await saveProgress(data);
        } catch (error) {
            console.error("Failed to save", error);
            // Optionally set error state here if you want UI feedback on save failure beyond the button's own state
        }
    };

    const handleStart = async (idea: string, totalQuestions: number, selectedPhases: ProjectPhase[]) => {
        // Fallback if user somehow deselects all (UI should prevent this, but safety first)
        const phasesToUse = selectedPhases.length > 0 ? selectedPhases : PHASES;

        setState((prev) => ({
            ...prev,
            loading: true,
            error: null,
            idea,
            totalQuestions,
            selectedPhases: phasesToUse
        }));

        try {
            const firstPhase = phasesToUse[0];
            const question = await generateQuestion(idea, [], totalQuestions, firstPhase);
            setState((prev) => ({
                ...prev,
                idea,
                totalQuestions,
                currentQuestion: question,
                loading: false,
                selectedPhases: phasesToUse,
            }));
        } catch (err: any) {
            setState((prev) => ({
                ...prev,
                loading: false,
                error: err.message || 'Failed to start interview',
            }));
        }
    };

    const handleAnswer = async (selectedOption: string) => {
        if (!state.currentQuestion) return;

        const newAnswer: Answer = {
            question: state.currentQuestion.text,
            selected_option: selectedOption,
        };

        const newHistory = [...state.history, newAnswer];
        setState((prev) => ({ ...prev, loading: true, error: null, history: newHistory }));

        try {
            if (newHistory.length >= state.totalQuestions) {
                // Determine completion - Show Summary
                setState((prev) => ({
                    ...prev,
                    loading: false,
                    currentQuestion: null,
                }));
            } else {
                // Next Question
                const nextPhase = getPhase(newHistory.length, state.totalQuestions, state.selectedPhases);
                const question = await generateQuestion(state.idea, newHistory, state.totalQuestions, nextPhase);
                setState((prev) => ({
                    ...prev,
                    loading: false,
                    currentQuestion: question,
                }));
            }
        } catch (err: any) {
            setState((prev) => ({
                ...prev,
                loading: false,
                error: err.message || 'Failed to get next step',
            }));
        }
    };

    const handleGeneratePrompFromSummary = async () => {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        try {
            const result = await generatePrompt(state.idea, state.history, state.selectedPhases);
            setState((prev) => ({
                ...prev,
                loading: false,
                finalPrompt: result.prompt,
            }));
        } catch (err: any) {
            setState((prev) => ({
                ...prev,
                loading: false,
                error: err.message || 'Failed to generate final prompt',
            }));
        }
    };

    const handleRestart = () => {
        setState({
            idea: '',
            totalQuestions: 20,
            history: [],
            currentQuestion: null,
            loading: false,
            error: null,
            finalPrompt: null,
            selectedPhases: PHASES,
        });
    };

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 font-sans">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {state.error && (
                    <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg z-50 animate-slideIn">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{state.error}</span>
                        <button onClick={() => setState(prev => ({ ...prev, error: null }))} className="absolute top-0 right-0 px-4 py-3">
                            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
                        </button>
                    </div>
                )}

                {!state.currentQuestion && !state.finalPrompt && state.history.length === 0 && (
                    <StartForm onStart={handleStart} onLoad={handleLoad} loading={state.loading} />
                )}

                {state.currentQuestion && (
                    <div className="container mx-auto px-4 py-8">
                        <div className="flex justify-between items-center mb-6">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Phase: <span className="font-semibold text-blue-600 dark:text-blue-400">
                                    {getPhase(state.history.length, state.totalQuestions, state.selectedPhases)}
                                </span>
                            </div>
                            <SaveButton onSave={handleSave} />
                        </div>
                        <QuestionCard
                            question={state.currentQuestion}
                            onAnswer={handleAnswer}
                            loading={state.loading}
                            questionNumber={state.history.length + 1}
                            totalQuestions={state.totalQuestions}
                            idea={state.idea}
                        />
                    </div>
                )}

                {!state.currentQuestion && state.history.length > 0 && !state.finalPrompt && (
                    <SummarySection
                        idea={state.idea}
                        history={state.history}
                        onGenerate={handleGeneratePrompFromSummary}
                        loading={state.loading}
                        onSave={handleSave}
                    />
                )}

                {state.finalPrompt && (
                    <div className="container mx-auto px-4 py-8">
                        <div className="flex justify-end mb-4">
                            <SaveButton onSave={handleSave} label="Save Project Artifacts" />
                        </div>
                        <ResultSection
                            prompt={state.finalPrompt}
                            onRestart={handleRestart}
                        />
                    </div>
                )}
            </div>
        </main>
    );
}
