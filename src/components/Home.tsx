import {useEffect, useReducer} from 'react';
import {Calendar, Clock, Play, Square, TrendingUp} from 'lucide-react';
import { Link } from 'react-router-dom';
import {useTimeEntries} from '../hooks/useTimeEntries';
import type {TimeEntry} from '../model/time-entry/TimeEntry';
import {calculateDuration, formatDuration, generateID} from '../utils/timeUtils';
import Header from './Header';

const HomePage = () => {
    const {entries, addEntry, updateEntry, getActiveEntry} = useTimeEntries();

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
        const timer = setInterval(forceUpdate, 1000);
        return () => clearInterval(timer);
    }, []);

    const isRunning = getActiveEntry() !== null;

    const calculateStats = () => {
        const today = new Date().toISOString().split('T')[0];

        const thisWeekStart = new Date();
        thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());

        const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

        const todaysEntries = entries.filter(entry => entry.date === today);
        const thisWeekEntries = entries.filter(entry => new Date(entry.startTime) >= thisWeekStart);
        const thisMonthEntries = entries.filter(entry => new Date(entry.startTime) >= thisMonthStart);

        const calculateTotalTime = (entryList: TimeEntry[]): number => {
            return entryList.reduce((total, entry) => {
                return total + (entry.duration || 0);
            }, 0);
        };

        return {
            today: { time: calculateTotalTime(todaysEntries), count: todaysEntries.length },
            week: { time: calculateTotalTime(thisWeekEntries), count: thisWeekEntries.length },
            month: { time: calculateTotalTime(thisMonthEntries), count: thisMonthEntries.length },
        };
    };

    const stats = calculateStats();

    const getElapsedTime = () => {
        const activeEntry = getActiveEntry();
        if (!activeEntry) return null;

        const now = new Date();
        const elapsed = Math.floor((now.getTime() - new Date(activeEntry.startTime).getTime()) / 1000);

        // Prevent negative time display
        if (elapsed < 0) return "00:00:00";

        // Convert seconds to hours:minutes:seconds format
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;

        // Format with leading zeros (padStart ensures 2 digits)
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Handle start/stop timer functionality
    const handleTimerToggle = () => {
        const activeEntry = getActiveEntry();

        if (activeEntry) {
            // Stop the currently running timer
            const now = new Date();
            const endTimeString = now.toISOString();
            const duration = calculateDuration(activeEntry.startTime, endTimeString);

            updateEntry(activeEntry.id, {
                endTime: endTimeString,
                duration,
                isActive: false,
            });
        } else {
            // Start a new timer
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
        }
    };

    // Reusable component for displaying statistics
    const StatCard = ({
                          icon,
                          title,
                          value,
                          subtitle
                      }: {
        icon: React.ReactNode;
        title: string;
        value: string;
        subtitle?: string;
    }) => (
        <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center gap-3 mb-2">
                <div className="text-blue-500">{icon}</div>
                <h3 className="font-semibold text-gray-900">{title}</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Hero Section with Quick Timer */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        {isRunning ? 'Timer Running' : 'Ready to Track?'}
                    </h1>

                    {isRunning && (
                        <div className="text-3xl font-mono text-blue-600 mb-6">
                            {getElapsedTime()}
                        </div>
                    )}

                    {!isRunning && (
                        <p className="text-xl text-gray-600 mb-8">
                            Start tracking your time with one click
                        </p>
                    )}

                    {/* Quick Timer Button */}
                    <button
                        onClick={handleTimerToggle}
                        className={`px-8 py-4 rounded-lg font-semibold text-white transition-colors flex items-center gap-3 text-lg mx-auto ${
                            isRunning
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-green-500 hover:bg-green-600'
                        }`}
                    >
                        {isRunning ? (
                            <>
                                <Square size={24} />
                                Stop Timer
                            </>
                        ) : (
                            <>
                                <Play size={24} />
                                Start Timer
                            </>
                        )}
                    </button>
                </div>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        icon={<Clock size={20} />}
                        title="Today"
                        value={stats.today.time > 0 ? formatDuration(stats.today.time) : '0h 0m'}
                        subtitle={`${stats.today.count} session${stats.today.count !== 1 ? 's' : ''}`}
                    />
                    <StatCard
                        icon={<Calendar size={20} />}
                        title="This Week"
                        value={stats.week.time > 0 ? formatDuration(stats.week.time) : '0h 0m'}
                        subtitle={`${stats.week.count} session${stats.week.count !== 1 ? 's' : ''}`}
                    />
                    <StatCard
                        icon={<TrendingUp size={20} />}
                        title="This Month"
                        value={stats.month.time > 0 ? formatDuration(stats.month.time) : '0h 0m'}
                        subtitle={`${stats.month.count} session${stats.month.count !== 1 ? 's' : ''}`}
                    />
                </div>
                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <Link
                            to="/entries"
                            className="bg-white p-6 rounded-lg shadow border hover:shadow-md transition-shadow block"
                        ><div className="flex items-center gap-3 mb-3">
                            <Calendar className="text-blue-500" size={24} />
                            <h3 className="text-lg font-semibold text-gray-900">All Entries</h3>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Browse and filter your complete time tracking history
                        </p>
                        <div className="text-blue-500 font-medium">
                            {entries.length} total entries
                        </div></Link>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow border">
                        <div className="flex items-center gap-3 mb-3">
                            <TrendingUp className="text-green-500" size={24} />
                            <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total time:</span>
                                <span className="font-medium">
                  {entries.reduce((total, entry) => total + (entry.duration || 0), 0) > 0
                      ? formatDuration(entries.reduce((total, entry) => total + (entry.duration || 0), 0))
                      : '0h 0m'
                  }
                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total sessions:</span>
                                <span className="font-medium">{entries.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HomePage;

