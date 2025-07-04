import {useTimeEntries} from "../hooks/useTimeEntries";
import type {TimeEntry} from "../model/time-entry/TimeEntry";
import {calculateDuration, generateID} from "../utils/timeUtils";
import TimeCard from "./time-tracking/TimeCard";
import { Play, Square } from 'lucide-react';
import {useEffect, useState} from "react";


const Home = () => {
    const {entries, addEntry, updateEntry, getActiveEntry} = useTimeEntries();
    const isRunning = getActiveEntry() !== null;
    const [, forceUpdate] = useState({});

    useEffect(() => {
        const timer = setInterval(() => {
            forceUpdate({}); // New object forces re-render
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const getElapsedTime = () => {
        const activeEntry = getActiveEntry();
        if (!activeEntry) return null;

        const now = new Date();
        const elapsed = Math.floor((now.getTime() - new Date(activeEntry.startTime).getTime()) / 1000);

        if (elapsed < 0) return "00:00:00";

        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleTimerToggle = () => {
        const activeEntry = getActiveEntry();
        if (activeEntry) {
            handleStop(activeEntry);
        } else {
            handleStart();
        }
    }

    const handleStop = (activeEntry: TimeEntry) => {
        const now = new Date();
        const endTimeString = now.toISOString();
        const duration = calculateDuration(activeEntry.startTime, endTimeString);

        updateEntry(activeEntry.id, {
            endTime: endTimeString,
            duration,
            isActive: false,
        });

    }
    const handleStart = () => {
        const now = new Date();
        const newEntry: TimeEntry = {
            id: generateID(),
            date: now.toISOString().split('T')[0],
            startTime: now.toISOString(),
            endTime: null,
            duration: null,
            isActive: true,
        };

        addEntry(newEntry);
    };


    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Hustle Tracker
            </h1>

            <div className="flex justify-center mb-6">
                <button
                    onClick={handleTimerToggle}
                    className={` flex items-center px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
                        isRunning
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-green-500 hover:bg-green-600'
                    }`}
                >
                    {isRunning ? (
                        <>
                            <Square size={25} className="mr-2" />
                            {getElapsedTime()}
                        </>
                    ) : (
                        <>
                            <Play size={25} className="mr-2" />
                            Start Timer
                        </>
                    )}
                </button>
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">
                    Time Entries ({entries.length})
                </h2>

                {entries.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                        No time entries yet. Start tracking!
                    </p>
                ) : (
                    <div className="space-y-2">
                        {entries.map(entry => (<TimeCard key={entry.id} entry={entry} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;