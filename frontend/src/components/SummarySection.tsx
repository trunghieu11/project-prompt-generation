import React from 'react';
import { Answer } from '@/lib/types';
import ReactMarkdown from 'react-markdown';
import SaveButton from './SaveButton';

interface SummarySectionProps {
    idea: string;
    history: Answer[];
    onGenerate: () => void;
    loading: boolean;
    onSave: () => Promise<void>;
}

export default function SummarySection({ idea, history, onGenerate, loading, onSave }: SummarySectionProps) {
    return (
        <div className="w-full max-w-4xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl animate-fadeIn">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white border-b pb-4 border-gray-200 dark:border-gray-700">
                Project Summary
            </h2>

            <div className="mb-8">
                <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">Project Idea</h3>
                <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-600">
                    {idea}
                </p>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">Requirements Gathered</h3>
                <div className="space-y-4">
                    {history.map((item, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm relative pl-6">
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-500 rounded-l-lg"></div>
                            <p className="font-semibold text-gray-900 dark:text-white mb-1 text-sm text-opacity-80">
                                {item.question}
                            </p>
                            <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                                {item.selected_option}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center mt-8 gap-4">
                <SaveButton onSave={onSave} className="px-6 py-4" />
                <button
                    onClick={onGenerate}
                    disabled={loading}
                    className={`
            px-8 py-4 text-lg font-bold text-white rounded-full shadow-lg transform transition-all duration-200
            ${loading
                            ? 'bg-gray-400 cursor-not-allowed scale-95'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 active:scale-95'
                        }
          `}
                >
                    {loading ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating Final Prompt...
                        </span>
                    ) : (
                        'Generate Final Prompt 🚀'
                    )}
                </button>
            </div>
        </div>
    );
}
