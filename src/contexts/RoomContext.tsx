'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';
import md5 from 'md5';

type VideoState = {
  isPlaying: boolean;
  progress: number;
  duration: number;
  playbackRate: number;
};

type Participant = {
  id: string;
  displayName: string;
  isHost: boolean;
  status: 'connected' | 'buffering' | 'paused';
};

type Message = {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
};

type RoomContextType = {
  roomId: string | null;
  videoUrl: string | null;
  videoHash: string | null;
  participants: Participant[];
  messages: Message[];
  videoState: VideoState;
  isHost: boolean;
  loading: boolean;
  createRoom: (videoUrl: string) => Promise<string>;
  joinRoom: (roomId: string) => Promise<void>;
  leaveRoom: () => void;
  updateVideoState: (state: Partial<VideoState>) => void;
  sendMessage: (text: string) => void;
  kickParticipant: (participantId: string) => void;
  muteParticipant: (participantId: string) => void;
};

const defaultVideoState: VideoState = {
  isPlaying: false,
  progress: 0,
  duration: 0,
  playbackRate: 1,
};

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function useRoom() {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
}

export function RoomProvider({ children }: { children: ReactNode }) {
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();
  const router = useRouter();

  const [roomId, setRoomId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoHash, setVideoHash] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [videoState, setVideoState] = useState<VideoState>(defaultVideoState);
  const [isHost, setIsHost] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Room events
    socket.on('room:joined', (data) => {
      setRoomId(data.roomId);
      setVideoUrl(data.videoUrl);
      setVideoHash(data.videoHash);
      setParticipants(data.participants);
      setIsHost(data.isHost);
      setVideoState(data.videoState);
    });

    socket.on('room:participant_joined', (participant) => {
      setParticipants((prev) => [...prev, participant]);
    });

    socket.on('room:participant_left', (participantId) => {
      setParticipants((prev) => prev.filter((p) => p.id !== participantId));
    });

    socket.on('room:participant_status_changed', (data) => {
      setParticipants((prev) =>
        prev.map((p) => (p.id === data.participantId ? { ...p, status: data.status } : p))
      );
    });

    // Video sync events
    socket.on('video:state_update', (newState) => {
      setVideoState((prev) => ({ ...prev, ...newState }));
    });

    // Chat events
    socket.on('chat:message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Host control events
    socket.on('control:kicked', () => {
      leaveRoom();
      router.push('/');
    });

    return () => {
      socket.off('room:joined');
      socket.off('room:participant_joined');
      socket.off('room:participant_left');
      socket.off('room:participant_status_changed');
      socket.off('video:state_update');
      socket.off('chat:message');
      socket.off('control:kicked');
    };
  }, [socket, isConnected, router]);

  const createRoom = async (videoUrl: string): Promise<string> => {
    if (!socket || !isConnected || !user) {
      throw new Error('Cannot create room: not connected');
    }

    setLoading(true);
    return new Promise((resolve, reject) => {
      const videoHash = md5(videoUrl);
      socket.emit('room:create', { videoUrl, videoHash }, (response: { success: boolean; roomId?: string; error?: string }) => {
        setLoading(false);
        if (response.success && response.roomId) {
          setRoomId(response.roomId);
          setVideoUrl(videoUrl);
          setVideoHash(videoHash);
          setIsHost(true);
          resolve(response.roomId);
        } else {
          reject(new Error(response.error || 'Failed to create room'));
        }
      });
    });
  };

  const joinRoom = async (roomId: string): Promise<void> => {
    if (!socket || !isConnected || !user) {
      throw new Error('Cannot join room: not connected');
    }

    setLoading(true);
    return new Promise((resolve, reject) => {
      socket.emit('room:join', { roomId }, (response: { success: boolean; error?: string }) => {
        setLoading(false);
        if (response.success) {
          resolve();
        } else {
          reject(new Error(response.error || 'Failed to join room'));
        }
      });
    });
  };

  const leaveRoom = () => {
    if (!socket || !isConnected || !roomId) return;

    socket.emit('room:leave', { roomId });
    setRoomId(null);
    setVideoUrl(null);
    setVideoHash(null);
    setParticipants([]);
    setMessages([]);
    setVideoState(defaultVideoState);
    setIsHost(false);
  };

  const updateVideoState = (state: Partial<VideoState>) => {
    if (!socket || !isConnected || !roomId) return;

    socket.emit('video:update_state', { roomId, ...state });
    setVideoState((prev) => ({ ...prev, ...state }));
  };

  const sendMessage = (text: string) => {
    if (!socket || !isConnected || !roomId || !user) return;

    const message = {
      text,
      roomId,
    };

    socket.emit('chat:send_message', message);
  };

  const kickParticipant = (participantId: string) => {
    if (!socket || !isConnected || !roomId || !isHost) return;

    socket.emit('control:kick', { roomId, participantId });
  };

  const muteParticipant = (participantId: string) => {
    if (!socket || !isConnected || !roomId || !isHost) return;

    socket.emit('control:mute', { roomId, participantId });
  };

  return (
    <RoomContext.Provider
      value={{
        roomId,
        videoUrl,
        videoHash,
        participants,
        messages,
        videoState,
        isHost,
        loading,
        createRoom,
        joinRoom,
        leaveRoom,
        updateVideoState,
        sendMessage,
        kickParticipant,
        muteParticipant,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}