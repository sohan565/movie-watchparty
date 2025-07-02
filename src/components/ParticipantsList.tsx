'use client';

import { useRoom } from '@/contexts/RoomContext';
import { useAuth } from '@/contexts/AuthContext';
import { FiMic, FiMicOff, FiX } from 'react-icons/fi';
import { GiCrown } from 'react-icons/gi';

export default function ParticipantsList() {
  const { participants, isHost, kickParticipant, muteParticipant } = useRoom();
  const { user } = useAuth();

  const getStatusColor = (status: 'connected' | 'buffering' | 'paused') => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'buffering':
        return 'bg-yellow-500';
      case 'paused':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: 'connected' | 'buffering' | 'paused') => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'buffering':
        return 'Buffering';
      case 'paused':
        return 'Paused';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-3 bg-indigo-600 dark:bg-indigo-800 text-white font-medium">
        Participants ({participants.length})
      </div>
      <div className="p-4">
        {participants.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 italic">
            No participants yet
          </p>
        ) : (
          <ul className="space-y-3">
            {participants.map((participant) => {
              const isCurrentUser = user && participant.id === user.uid;
              
              return (
                <li
                  key={participant.id}
                  className={`flex items-center justify-between p-2 rounded-md ${isCurrentUser ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''}`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(participant.status)}`} />
                    <span className="font-medium">
                      {participant.displayName || 'Anonymous'}
                      {isCurrentUser && ' (You)'}
                    </span>
                    {participant.isHost && (
                      <GiCrown className="text-yellow-500" title="Host" />
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {getStatusText(participant.status)}
                    </span>
                  </div>
                  
                  {isHost && !isCurrentUser && (
                    <div className="flex space-x-1">
                      <button
                        onClick={() => muteParticipant(participant.id)}
                        className="p-1 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                        title="Mute participant"
                      >
                        <FiMicOff className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => kickParticipant(participant.id)}
                        className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                        title="Kick participant"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}