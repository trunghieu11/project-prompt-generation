import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectPhase } from '../lib/types';
import { listSaves } from '@/lib/api';

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

interface StartFormProps {
    onStart: (idea: string, totalQuestions: number, selectedPhases: ProjectPhase[]) => void;
    onLoad: (id: string) => void;
    loading: boolean;
}

export default function StartForm({ onStart, onLoad, loading }: StartFormProps) {
    const router = useRouter();
    const [idea, setIdea] = useState('');
    const [totalQuestions, setTotalQuestions] = useState(20);
    const [selectedPhases, setSelectedPhases] = useState<ProjectPhase[]>(['Core Features']);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onStart(idea, totalQuestions, selectedPhases);
    };

    const handleManageProjects = () => {
        router.push('/projects');
    };

    console.log('StartForm Render:', { idea, loading, disabled: loading || !idea.trim(), phases: selectedPhases });

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center flex-1">
                    Project Prompt Generator
                </h1>
                <div className="flex space-x-4 text-sm">

                    <button
                        onClick={handleManageProjects}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        Project Manager
                    </button>
                </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-center text-lg">
                Refine your project idea into a perfect AI prompt through a guided interview.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="idea" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        What is your project idea?
                    </label>
                    <textarea
                        id="idea"
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none transition-colors"
                        placeholder="e.g., A mobile app for tracking personal finance with gamification elements..."
                        required
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Customize Questions
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                        {PHASES.map(phase => (
                            <label key={phase} className="flex items-center space-x-2 cursor-pointer bg-gray-50 dark:bg-gray-700/50 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                                <input
                                    type="checkbox"
                                    checked={selectedPhases.includes(phase)}
                                    onChange={() => {
                                        setSelectedPhases(prev =>
                                            prev.includes(phase)
                                                ? prev.filter(p => p !== phase)
                                                : [...prev, phase]
                                        );
                                    }}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300 select-none">{phase}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="questions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        How many questions?
                    </label>
                    <select
                        id="questions"
                        value={totalQuestions}
                        onChange={(e) => setTotalQuestions(Number(e.target.value))}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                        disabled={loading}
                    >
                        <option value={10}>10 Questions (Express)</option>
                        <option value={20}>20 Questions (Quick)</option>
                        <option value={30}>30 Questions (Standard)</option>
                        <option value={40}>40 Questions (Detailed)</option>
                        <option value={50}>50 Questions (Comprehensive)</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading || !idea.trim()}
                    title={!idea.trim() ? "Please enter a project idea" : ""}
                    className={`w-full py-4 px-6 rounded-lg text-white font-semibold text-lg transition-all ${loading || !idea.trim()
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                        }`}
                >
                    {loading ? 'Starting...' : 'Start Interview'}
                </button>

            </form>
        </div>
    );
}
