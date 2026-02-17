'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { listSaves, deleteSave } from '@/lib/api';

export default function ProjectsPage() {
    const router = useRouter();
    const [saves, setSaves] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSaves();
    }, []);

    const fetchSaves = async () => {
        try {
            const data = await listSaves();
            setSaves(data.saves);
        } catch (err) {
            setError('Failed to load projects');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;

        try {
            await deleteSave(id);
            setSaves(prev => prev.filter(s => s.id !== id));
        } catch (err) {
            alert('Failed to delete project');
        }
    };

    const handleContinue = (id: string) => {
        router.push(`/?load=${id}`);
    };

    const handleCreateNew = () => {
        router.push('/');
    };

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-6 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Project Manager</h1>
                    <button
                        onClick={handleCreateNew}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                    >
                        + New Project
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading projects...</div>
                ) : error ? (
                    <div className="text-center py-12 text-red-500">{error}</div>
                ) : saves.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-500 mb-4">No saved projects found.</p>
                        <button
                            onClick={handleCreateNew}
                            className="text-blue-600 hover:underline"
                        >
                            Start your first project
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {saves.map((save) => (
                            <div
                                key={save.id}
                                onClick={() => handleContinue(save.id)}
                                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer group flex justify-between items-center"
                            >
                                <div className="flex-1 min-w-0 pr-4">
                                    <h3 className="text-xl font-semibold mb-2 line-clamp-2 text-gray-900 dark:text-white" title={save.idea}>
                                        {save.idea || "Untitled Project"}
                                    </h3>
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                                        <span>{new Date(save.timestamp).toLocaleString()}</span>
                                        <span className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                                            <span>Progress:</span>
                                            <span className="font-medium text-gray-900 dark:text-gray-200">{save.progress}</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => handleDelete(e, save.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                        title="Delete Project"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                    <svg className="w-6 h-6 text-gray-300 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
