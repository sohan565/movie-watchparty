import { db, auth } from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { User } from 'firebase/auth';

// User profile utilities
export const createUserProfile = async (user: User, additionalData: Record<string, any> = {}) => {
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { displayName, email, photoURL } = user;
    const createdAt = serverTimestamp();

    try {
      await setDoc(userRef, {
        displayName,
        email,
        photoURL,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.error('Error creating user profile', error);
    }
  }

  return userRef;
};

export const getUserProfile = async (userId: string) => {
  if (!userId) return null;

  try {
    const userRef = doc(db, 'users', userId);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile', error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, data: Record<string, any>) => {
  if (!userId) return;

  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating user profile', error);
  }
};

// Room utilities
export const createRoom = async (hostId: string, roomData: Record<string, any>) => {
  try {
    const roomsRef = collection(db, 'rooms');
    const roomRef = doc(roomsRef);
    
    await setDoc(roomRef, {
      ...roomData,
      hostId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      active: true,
    });

    return roomRef.id;
  } catch (error) {
    console.error('Error creating room', error);
    return null;
  }
};

export const getRoom = async (roomId: string) => {
  if (!roomId) return null;

  try {
    const roomRef = doc(db, 'rooms', roomId);
    const snapshot = await getDoc(roomRef);

    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting room', error);
    return null;
  }
};

export const updateRoom = async (roomId: string, data: Record<string, any>) => {
  if (!roomId) return;

  try {
    const roomRef = doc(db, 'rooms', roomId);
    await updateDoc(roomRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating room', error);
  }
};

export const deleteRoom = async (roomId: string) => {
  if (!roomId) return;

  try {
    const roomRef = doc(db, 'rooms', roomId);
    await deleteDoc(roomRef);
  } catch (error) {
    console.error('Error deleting room', error);
  }
};

export const getUserRooms = async (userId: string) => {
  if (!userId) return [];

  try {
    const roomsRef = collection(db, 'rooms');
    const q = query(
      roomsRef,
      where('hostId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting user rooms', error);
    return [];
  }
};

// Helper to convert Firestore timestamps to Date objects
export const convertTimestamps = (data: any): any => {
  if (!data) return data;
  
  if (data instanceof Timestamp) {
    return data.toDate();
  }
  
  if (data instanceof Array) {
    return data.map(item => convertTimestamps(item));
  }
  
  if (data instanceof Object) {
    const result: Record<string, any> = {};
    Object.keys(data).forEach(key => {
      result[key] = convertTimestamps(data[key]);
    });
    return result;
  }
  
  return data;
};

// Helper to format document snapshots
export const formatDoc = (doc: QueryDocumentSnapshot<DocumentData>) => {
  return {
    id: doc.id,
    ...convertTimestamps(doc.data()),
  };
};