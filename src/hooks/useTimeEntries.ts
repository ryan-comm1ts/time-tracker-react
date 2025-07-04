import { useState, useEffect } from 'react';
import type {TimeEntry} from '../model/time-entry/TimeEntry';

const STORAGE_KEY = 'timeEntries';

export const useTimeEntries = () => {
    const [entries, setEntries] = useState<TimeEntry[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load entries from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsedEntries = JSON.parse(stored);
                setEntries(parsedEntries);
            } catch (error) {
                console.error('Error loading time entries:', error);
                setEntries([]);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage whenever entries change (but only after initial load)
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
        }
    }, [entries, isLoaded]);

    const addEntry = (entry: TimeEntry) => {
        setEntries(prev => [...prev, entry]);
    };

    const updateEntry = (id: string, updates: Partial<TimeEntry>) => {
        setEntries(prev =>
            prev.map(entry =>
                entry.id === id ? { ...entry, ...updates } : entry
            )
        );
    };

    const deleteEntry = (id: string) => {
        setEntries(prev => prev.filter(entry => entry.id !== id));
    };

    const getActiveEntry = (): TimeEntry | null => {
        return entries.find(entry => entry.isActive) || null;
    };

    return {
        entries,
        addEntry,
        updateEntry,
        deleteEntry,
        getActiveEntry,
    };
};