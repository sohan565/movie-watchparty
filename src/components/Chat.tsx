'use client';

import { useState, useEffect, useRef } from 'react';
import { useRoom } from '@/contexts/RoomContext';
import { useAuth } from '@/contexts/AuthContext';
import { FiSend } from 'react-icons/fi';

export default function Chat() {
  const { messages, sendMessage } = useRoom();
  const { user } = useAuth();
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim() && user) {
      sendMessage(messageText);
      setMessageText('');
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-3 bg-indigo-600 dark:bg-indigo-800 text-white font-medium">
        Chat
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 italic">
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((message) => {
            const isCurrentUser = user && message.senderId === user.uid;
            
            return (
              <div
                key={message.id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-2 ${
                    isCurrentUser
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {!isCurrentUser && (
                    <div className="font-medium text-xs text-indigo-500 dark:text-indigo-400 mb-1">
                      {message.senderName}
                    </div>
                  )}
                  <p className="text-sm break-words">{message.text}</p>
                  <div
                    className={`text-xs mt-1 ${
                      isCurrentUser ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {formatTimestamp(message.timestamp)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            disabled={!user}
          />
          <button
            type="submit"
            disabled={!messageText.trim() || !user}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSend />
          </button>
        </div>
      </form>
    </div>
  );
}