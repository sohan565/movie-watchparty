import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  createRoom,
  getRoom,
  updateRoom,
  deleteRoom,
  getUserRooms,
} from '@/lib/firebase-utils';

export function useFirestore() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // User profile operations
  const createProfile = async (additionalData: Record<string, any> = {}) => {
    if (!user) {
      setError('No authenticated user');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const userRef = await createUserProfile(user, additionalData);
      setLoading(false);
      return userRef;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  };

  const getProfile = async (userId?: string) => {
    const uid = userId || user?.uid;
    
    if (!uid) {
      setError('No user ID provided');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const profile = await getUserProfile(uid);
      setLoading(false);
      return profile;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  };

  const updateProfile = async (data: Record<string, any>) => {
    if (!user) {
      setError('No authenticated user');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await updateUserProfile(user.uid, data);
      setLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  };

  // Room operations
  const createNewRoom = async (roomData: Record<string, any>) => {
    if (!user) {
      setError('No authenticated user');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const roomId = await createRoom(user.uid, roomData);
      setLoading(false);
      return roomId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  };

  const getRoomData = async (roomId: string) => {
    if (!roomId) {
      setError('No room ID provided');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const room = await getRoom(roomId);
      setLoading(false);
      return room;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  };

  const updateRoomData = async (roomId: string, data: Record<string, any>) => {
    if (!roomId) {
      setError('No room ID provided');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await updateRoom(roomId, data);
      setLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  };

  const deleteRoomData = async (roomId: string) => {
    if (!roomId) {
      setError('No room ID provided');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await deleteRoom(roomId);
      setLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  };

  const getUserRoomsData = async () => {
    if (!user) {
      setError('No authenticated user');
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const rooms = await getUserRooms(user.uid);
      setLoading(false);
      return rooms;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setLoading(false);
      return [];
    }
  };

  return {
    loading,
    error,
    // User profile methods
    createProfile,
    getProfile,
    updateProfile,
    // Room methods
    createRoom: createNewRoom,
    getRoom: getRoomData,
    updateRoom: updateRoomData,
    deleteRoom: deleteRoomData,
    getUserRooms: getUserRoomsData,
  };
}