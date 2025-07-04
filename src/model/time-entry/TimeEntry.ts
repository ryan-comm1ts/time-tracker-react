export interface TimeEntry {
    id: string;
    date: string;
    startTime: string;
    endTime: string | null;
    duration: number | null;
    isActive: boolean;
}