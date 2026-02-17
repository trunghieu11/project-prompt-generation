import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface ResultSectionProps {
    prompt: string;
    onRestart: () => void;
}

export default function ResultSection({ prompt, onRestart }: ResultSectionProps) {
    const [copied, setCopied] = useState(false);

    // Function to strip markdown code blocks if the LLM wrapped the whole thing
    const cleanPrompt = (text: string) => {
        const trimmed = text.trim();
        if (trimmed.startsWith('```markdown') && trimmed.endsWith('```')) {
            return trimmed.slice(11, -3).trim();
        }
        if (trimmed.startsWith('```') && trimmed.endsWith('```')) {
            return trimmed.slice(3, -3).trim();
        }
        return text;
    };

    const displayPrompt = cleanPrompt(prompt);

    const handleCopy = () => {
        navigator.clipboard.writeText(displayPrompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg my-8 animate-fadeIn">
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Your Optimized Project Prompt
                </h2>
                <div className="flex space-x-4">
                    <button
                        onClick={onRestart}
                        className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-500 border border-gray-300 dark:border-gray-600 rounded-lg"
                    >
                        Start Over
                    </button>
                    <button
                        onClick={handleCopy}
                        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${copied
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5 shadow-md'
                            }`}
                    >
                        {copied ? (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Copied!
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                                Copy to Clipboard
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none bg-gray-50 dark:bg-gray-900 p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner overflow-x-auto">
                <ReactMarkdown>{displayPrompt}</ReactMarkdown>
            </div>
        </div>
    );
}
