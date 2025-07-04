// TimeCard.tsx
// TimeCard.tsx
import type {TimeEntry} from '../../model/time-entry/TimeEntry';
import { formatDate, formatDuration } from '../../utils/timeUtils';


interface TimeCardProps {
    entry: TimeEntry;
}

const TimeCard = ({ entry }: TimeCardProps) => {
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
        <div className={`flex items-center justify-between mx-10 p-4 rounded-2xl shadow ${
            entry.isActive ? 'bg-green-50 border border-green-200' : 'bg-white'
        }`}>
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
            <div className="text-xl font-bold text-gray-900">
                {entry.duration ? formatDuration(entry.duration) : '--'}
            </div>
        </div>
    );
};

export default TimeCard;