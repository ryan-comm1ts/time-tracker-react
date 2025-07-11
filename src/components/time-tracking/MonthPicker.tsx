// components/MonthPicker.tsx
import { useState } from 'react';

interface MonthPickerProps {
    selectedMonth: number;
    selectedYear: number;
    onMonthChange: (month: number, year: number) => void;
}

const MonthPicker = ({ selectedMonth, selectedYear, onMonthChange }: MonthPickerProps) => {
    const [showPicker, setShowPicker] = useState(false);

    const currentMonthDisplay = new Date(selectedYear, selectedMonth).toLocaleDateString('en-GB', {
        month: 'long',
        year: 'numeric'
    });

    const handleMonthSelect = (month: number) => {
        onMonthChange(month, selectedYear);
        setShowPicker(false);
    };

    // Generate array of month names
    const months = Array.from({ length: 12 }, (_, index) => {
        return {
            index,
            name: new Date(2024, index).toLocaleDateString('en-GB', { month: 'short' })
        };
    });

    return (
        <div className="relative">
            <button
                onClick={() => setShowPicker(!showPicker)}
                className="px-2 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg font-medium text-gray-700 flex items-center gap-2 shadow-sm"
            >
                {currentMonthDisplay}
                <svg
                    className={`w-4 h-4 transition-transform ${showPicker ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {showPicker && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowPicker(false)}
                    />

                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-20 min-w-64">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Select Month</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {months.map(({ index, name }) => (
                                <button
                                    key={index}
                                    onClick={() => handleMonthSelect(index)}
                                    className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                                        selectedMonth === index
                                            ? 'bg-blue-500 text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default MonthPicker;