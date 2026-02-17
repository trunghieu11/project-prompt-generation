import React, { useState } from 'react';

interface SaveButtonProps {
    onSave: () => Promise<void>;
    label?: string;
    className?: string;
}

export default function SaveButton({ onSave, label = "Save Progress", className = "" }: SaveButtonProps) {
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleClick = async () => {
        setSaving(true);
        try {
            await onSave();
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (error) {
            console.error("Save failed", error);
            alert("Failed to save progress");
        } finally {
            setSaving(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={saving}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${saved
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-white/10 hover:bg-white/20 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700'
                } ${className}`}
        >
            {saving ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : saved ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
            )}
            <span>{saved ? "Saved!" : label}</span>
        </button>
    );
}
