// TimeCard.tsx
// TimeCard.tsx
import type {TimeEntry} from '../../model/time-entry/TimeEntry';
import { formatDate, formatDuration } from '../../utils/timeUtils';
import { Trash } from 'lucide-react'

interface TimeCardProps {
    entry: TimeEntry;
    onDelete: (id: string) => void;
}

const TimeCard = ({ entry, onDelete }: TimeCardProps) => {
    const startDate = new Date(entry.startTime);
    const startTime = startDate.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const endTime = entry.endTime
        ? new Date(entry.endTime).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
        })
        : null;

    return (
        <div className={`relative flex items-center justify-between p-4 rounded-2xl shadow ${
            entry.isActive ? 'bg-green-50 border border-green-200' : 'bg-white'
        }`}>
            <button
                onClick={() => onDelete(entry.id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded"
            >
                <Trash size={16} />
            </button>
            {/* Left side - Date and times */}
            <div className="flex flex-col">
                {/* Date */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {formatDate(startDate)}
                </h3>


                {/* Start and End times*/}
                <div className="flex flex-col space-y-1">
                    <div className="text-sm font-medium text-gray-700">
                        {startTime}
                    </div>
                    <div className="text-xs text-gray-500 ml-2">
                        {endTime ? `to ${endTime}` : 'Running...'}
                    </div>
                </div>
            </div>

            {/* Right side - Hours */}
            <div className="flex flex-col text-xl font-bold text-gray-900">

                <div>{entry.duration ? formatDuration(entry.duration) : '--'}</div>
            </div>
        </div>
    );
};

export default TimeCard;