import { useState, useMemo } from 'react';
import { Room, RoomStatus } from '../types/room.types';

export interface UseRoomFiltersResult {
  activeFilter: RoomStatus | 'all';
  searchQuery: string;
  setActiveFilter: (filter: RoomStatus | 'all') => void;
  setSearchQuery: (query: string) => void;
  filterRooms: (
    rooms: Room[],
    statuses: Map<string, { status: RoomStatus; nextChange?: string }>
  ) => Room[];
}

/**
 * Custom hook for room filtering
 */
export const useRoomFilters = (): UseRoomFiltersResult => {
  const [activeFilter, setActiveFilter] = useState<RoomStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterRooms = useMemo(
    () =>
      (
        rooms: Room[],
        statuses: Map<string, { status: RoomStatus; nextChange?: string }>
      ): Room[] => {
        let filtered = rooms;

        // Apply status filter
        if (activeFilter !== 'all') {
          filtered = filtered.filter((room) => {
            const roomStatus = statuses.get(room.id);
            return roomStatus?.status === activeFilter;
          });
        }

        // Apply search filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (room) =>
              room.name.toLowerCase().includes(query) ||
              room.location.toLowerCase().includes(query)
          );
        }

        return filtered;
      },
    [activeFilter, searchQuery]
  );

  return {
    activeFilter,
    searchQuery,
    setActiveFilter,
    setSearchQuery,
    filterRooms,
  };
};

