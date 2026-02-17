import React, { useState, useRef, useEffect } from 'react';
import { Question, ExplainResponse } from '@/lib/types';
import { explainQuestion } from '@/lib/api';
import ReactMarkdown from 'react-markdown';

interface QuestionCardProps {
    idea: string;
    question: Question;
    questionNumber: number;
    totalQuestions: number;
    onAnswer: (option: string) => void;
    loading: boolean;
}

export default function QuestionCard({
    idea,
    question,
    questionNumber,
    totalQuestions,
    onAnswer,
    loading
}: QuestionCardProps) {
    const [showOtherInput, setShowOtherInput] = useState(false);
    const [otherText, setOtherText] = useState('');

    // Explanation state
    const [showExplanation, setShowExplanation] = useState(false);
    const [explanationData, setExplanationData] = useState<ExplainResponse | null>(null);
    const [loadingExplanation, setLoadingExplanation] = useState(false);

    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        // Reset state when question changes
        setShowOtherInput(false);
        setOtherText('');
        setShowExplanation(false);
        setExplanationData(null);
        setLoadingExplanation(false);
    }, [question]);

    useEffect(() => {
        if (showOtherInput && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showOtherInput]);

    const handleOptionClick = (option: string) => {
        if (option === 'Other') {
            setShowOtherInput(true);
        } else {
            onAnswer(option);
        }
    };

    const handleOtherSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (otherText.trim()) {
            onAnswer(otherText.trim());
        }
    };

    const toggleExplanation = async () => {
        if (showExplanation) {
            setShowExplanation(false);
            return;
        }

        setShowExplanation(true);

        // Fetch if we don't have it yet
        if (!explanationData && !loadingExplanation) {
            setLoadingExplanation(true);
            try {
                const data = await explainQuestion(idea, question.text, question.options);
                setExplanationData(data);
            } catch (error) {
                console.error("Failed to fetch explanation", error);
            } finally {
                setLoadingExplanation(false);
            }
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="mb-6 flex justify-between items-center">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Question {questionNumber} of {totalQuestions}
                </span>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={toggleExplanation}
                        className="text-sm text-gray-500 hover:text-blue-600 transition-colors flex items-center"
                        title="Explain this question"
                        disabled={loadingExplanation}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 mr-1 ${loadingExplanation ? 'animate-spin' : ''}`}>
                            {loadingExplanation ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                            )}
                        </svg>
                        {loadingExplanation ? 'Loading...' : (showExplanation ? 'Hide Info' : 'Why ask this?')}
                    </button>
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white leading-tight">
                {question.text}
            </h2>

            {showExplanation && (
                <div className="mb-6 animate-fadeIn">
                    {loadingExplanation ? (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded animate-pulse text-sm text-gray-500">
                            Generating explanation...
                        </div>
                    ) : explanationData ? (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 text-gray-700 dark:text-gray-300 text-sm rounded-r">
                            <p className="font-semibold mb-2">Why this matters:</p>
                            <ReactMarkdown className="mb-3">{explanationData.question_explanation}</ReactMarkdown>
                        </div>
                    ) : null}
                </div>
            )}

            <div className="space-y-4 mt-8">
                {question.options.map((option, index) => {
                    if (option === 'Other' && showOtherInput) {
                        return (
                            <form key={index} onSubmit={handleOtherSubmit} className="space-y-3">
                                <textarea
                                    ref={inputRef}
                                    value={otherText}
                                    onChange={(e) => setOtherText(e.target.value)}
                                    placeholder="Type your answer here..."
                                    className="w-full p-4 rounded-lg border-2 border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-32"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleOtherSubmit(e);
                                        }
                                    }}
                                />
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowOtherInput(false)}
                                        className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!otherText.trim()}
                                        className={`px-6 py-2 rounded-lg font-medium text-white transition-colors ${otherText.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        );
                    }

                    const optionExplanation = explanationData?.option_explanations?.[option];

                    return (
                        <div key={index}>
                            <button
                                onClick={() => handleOptionClick(option)}
                                disabled={loading || (showOtherInput && option !== 'Other')}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 text-lg font-medium group ${showOtherInput && option !== 'Other'
                                        ? 'border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-200'
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="inline-block w-8 font-bold text-gray-400 group-hover:text-blue-500">
                                            {String.fromCharCode(65 + index)}.
                                        </span>
                                        {option}
                                    </div>
                                </div>
                            </button>
                            {showExplanation && optionExplanation && (
                                <div className="mt-1 ml-10 text-xs text-gray-500 dark:text-gray-400 italic">
                                    {optionExplanation}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {loading && (
                <div className="mt-4 text-center text-sm text-gray-500 animate-pulse">
                    Processing answer...
                </div>
            )}
        </div>
    );
}
