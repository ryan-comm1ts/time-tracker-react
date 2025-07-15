import { beforeEach, describe, expect, it, vi } from 'vitest'
import {useTimeEntries} from "./useTimeEntries.ts";
import {act, renderHook} from "@testing-library/react";
import type {TimeEntry} from "../model/time-entry/TimeEntry.ts";

const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
})

Object.defineProperty(window, 'crypto', {
    value: {
        randomUUID: vi.fn(() => 'test-uuid-01')
    }
})

describe('useTimeEntries', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorageMock.getItem.mockReturnValue(null);
    });

    it('should initialise with empty entries', () => {
        const{result} = renderHook(() => useTimeEntries());

        expect(result.current.entries).toEqual([]);
        expect(result.current.getActiveEntry()).toBe(null);
    })
    it('should add a new entry', () => {
        const { result } = renderHook(() => useTimeEntries())

        const newEntry: TimeEntry = {
            id: 'test-id',
            date: '2025-01-15',
            startTime: '2025-01-15T09:00:00.000Z',
            endTime: null,
            duration: null,
            isActive: true,
        }

        act(() => {
            result.current.addEntry(newEntry)
        })

        expect(result.current.entries).toHaveLength(1)
        expect(result.current.entries[0]).toEqual(newEntry)
    })

    it('should update an existing entry', () => {
        const { result } = renderHook(() => useTimeEntries())

        const entry: TimeEntry = {
            id: 'test-id',
            date: '2025-01-15',
            startTime: '2025-01-15T09:00:00.000Z',
            endTime: null,
            duration: null,
            isActive: true,
        }

        act(() => {
            result.current.addEntry(entry)
        })

        act(() => {
            result.current.updateEntry('test-id', {
                endTime: '2025-01-15T10:00:00.000Z',
                duration: 3600,
                isActive: false,
            })
        })

        expect(result.current.entries[0].endTime).toBe('2025-01-15T10:00:00.000Z')
        expect(result.current.entries[0].duration).toBe(3600)
        expect(result.current.entries[0].isActive).toBe(false)
    })

    it('should delete an entry', () => {
        const { result } = renderHook(() => useTimeEntries())

        const entry: TimeEntry = {
            id: 'test-id',
            date: '2025-01-15',
            startTime: '2025-01-15T09:00:00.000Z',
            endTime: null,
            duration: null,
            isActive: true,
        }

        act(() => {
            result.current.addEntry(entry)
        })

        expect(result.current.entries).toHaveLength(1)

        act(() => {
            result.current.deleteEntry('test-id')
        })

        expect(result.current.entries).toHaveLength(0)
    })

    it('should return active entry', () => {
        const { result } = renderHook(() => useTimeEntries())

        const activeEntry: TimeEntry = {
            id: 'active-id',
            date: '2025-01-15',
            startTime: '2025-01-15T09:00:00.000Z',
            endTime: null,
            duration: null,
            isActive: true,
        }

        const inactiveEntry: TimeEntry = {
            id: 'inactive-id',
            date: '2025-01-15',
            startTime: '2025-01-15T08:00:00.000Z',
            endTime: '2025-01-15T08:30:00.000Z',
            duration: 1800,
            isActive: false,
        }

        act(() => {
            result.current.addEntry(inactiveEntry)
            result.current.addEntry(activeEntry)
        })

        expect(result.current.getActiveEntry()).toEqual(activeEntry)
    })

    it('should load entries from localStorage', () => {
        const storedEntries = [
            {
                id: 'stored-id',
                date: '2025-01-15',
                startTime: '2025-01-15T09:00:00.000Z',
                endTime: '2025-01-15T10:00:00.000Z',
                duration: 3600,
                isActive: false,
            }
        ]

        localStorageMock.getItem.mockReturnValue(JSON.stringify(storedEntries))

        const { result } = renderHook(() => useTimeEntries())

        expect(result.current.entries).toEqual(storedEntries)
    })

    it('should save entries to localStorage', () => {
        const { result } = renderHook(() => useTimeEntries())

        const newEntry: TimeEntry = {
            id: 'test-id',
            date: '2025-01-15',
            startTime: '2025-01-15T09:00:00.000Z',
            endTime: null,
            duration: null,
            isActive: true,
        }

        act(() => {
            result.current.addEntry(newEntry)
        })

        // Should save to localStorage (after initial load)
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            'timeEntries',
            JSON.stringify([newEntry])
        )
    })

})