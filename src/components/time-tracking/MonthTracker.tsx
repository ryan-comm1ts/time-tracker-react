import {useTimeEntries} from "../../hooks/useTimeEntries";
import type {TimeEntry} from "../../model/time-entry/TimeEntry";
import {calculateDuration, generateID} from "../../utils/timeUtils";
import TimeCard from "./TimeCard";
import {Timer, Square} from 'lucide-react';
import {useEffect, useState} from "react";
import Header from "../Header";
import MonthPicker from "./MonthPicker";


const MonthTracker = () => {
    const {entries, addEntry, updateEntry, getActiveEntry} = useTimeEntries();
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Current month
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Current year
    const isRunning = getActiveEntry() !== null;
    const [, forceUpdate] = useState({});

    useEffect(() => {
        const timer = setInterval(() => {
            forceUpdate({}); // New object forces re-render
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const filteredEntries = entries.filter(entry => {
        const entryDate = new Date(entry.startTime);
        return entryDate.getMonth() === selectedMonth &&
            entryDate.getFullYear() === selectedYear;
    });

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
        <div className="min-h-screen bg-gray-50">
            <Header/>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-end mb-6">
                    <MonthPicker
                        selectedMonth={selectedMonth}
                        selectedYear={selectedYear}
                        onMonthChange={(month, year) => {
                            setSelectedMonth(month);
                            setSelectedYear(year);
                        }}
                    />
                    <button
                        onClick={handleTimerToggle}
                        className={` flex items-center ml-1 px-4 py-2 rounded-lg font-semibold text-white transition-colors ${
                            isRunning
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-green-500 hover:bg-green-600'
                        }`}
                    >
                        {isRunning ? (
                            <>
                                <Square size={25}
                                        className="mr-2"/>
                                {getElapsedTime()}
                            </>
                        ) : (
                            <>
                                <Timer size={23}
                                       className="mr-2"/>
                                Track
                            </>
                        )}
                    </button>
                </div>
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Time Entries ({filteredEntries.length})
                    </h2>

                    {filteredEntries.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                            No time entries yet. Start tracking!
                        </p>
                    ) : (
                        <div className="space-y-2 max-h-[78vh] overflow-auto scrollbar-hide snap-y snap-mandatory">
                            {filteredEntries.map(entry => (<div key={entry.id} className="snap-always snap-end"><TimeCard
                                    entry={entry}/></div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MonthTracker;