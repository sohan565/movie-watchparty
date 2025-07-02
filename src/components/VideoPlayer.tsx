'use client';

import { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { useRoom } from '@/contexts/RoomContext';
import { FiPlay, FiPause, FiVolume2, FiVolumeX } from 'react-icons/fi';

export default function VideoPlayer() {
  const {
    videoUrl,
    videoState,
    updateVideoState,
    isHost,
  } = useRoom();

  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [buffering, setBuffering] = useState(false);
  const [ready, setReady] = useState(false);

  const seekingRef = useRef(false);
  const lastProgressRef = useRef(0);
  const syncTolerance = 2;

  // @ts-expect-error ReactPlayer is a value, not a type
  const playerRef = useRef<ReactPlayer>(null);

  const handleReady = () => {
    setReady(true);
    if (isHost && playerRef.current) {
      updateVideoState({
        duration: playerRef.current.getDuration() || 0,
      });
    }
  };

  const handlePlayPause = () => {
    if (isHost) {
      updateVideoState({
        isPlaying: !videoState.isPlaying,
      });
    }
  };

  const handleProgress = (state: any) => {
    if (!isHost || seekingRef.current) return;

    if (Math.abs(state.playedSeconds - lastProgressRef.current) > 1) {
      lastProgressRef.current = state.playedSeconds;
      updateVideoState({
        progress: state.playedSeconds,
      });
    }
  };

  const handleSeekStart = () => {
    seekingRef.current = true;
  };

  const handleSeekEnd = () => {
    seekingRef.current = false;
    if (isHost && playerRef.current) {
      updateVideoState({
        progress: playerRef.current.getCurrentTime() || 0,
      });
    }
  };

  const handleBuffer = () => setBuffering(true);
  const handleBufferEnd = () => setBuffering(false);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleMuteToggle = () => setIsMuted(!isMuted);

  useEffect(() => {
    if (!playerRef.current || !ready) return;

    const internalPlayer = playerRef.current.getInternalPlayer() as HTMLVideoElement;
    if (!internalPlayer) return;

    const shouldBePlaying = videoState.isPlaying;
    const isActuallyPaused = internalPlayer.paused;

    if (shouldBePlaying && isActuallyPaused) {
      internalPlayer.play().catch((err) => console.warn('Play error:', err));
    } else if (!shouldBePlaying && !isActuallyPaused) {
      internalPlayer.pause();
    }

    const currentTime = playerRef.current.getCurrentTime() || 0;
    if (Math.abs(currentTime - videoState.progress) > syncTolerance) {
      playerRef.current.seekTo(videoState.progress, 'seconds');
    }

    if (internalPlayer.playbackRate !== videoState.playbackRate) {
      internalPlayer.playbackRate = videoState.playbackRate;
    }
  }, [videoState, ready]);

  if (!videoUrl) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No video loaded</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg">
      <div className="relative pt-[56.25%] bg-black">
        <div className="absolute top-0 left-0 w-full h-full">
          <ReactPlayer
            ref={playerRef}
            playing={videoState.isPlaying}
            volume={volume}
            muted={isMuted}
            playbackRate={videoState.playbackRate}
            onReady={handleReady}
            onPlay={() => isHost && updateVideoState({ isPlaying: true })}
            onPause={() => isHost && updateVideoState({ isPlaying: false })}
            onProgress={handleProgress}
            onBuffer={handleBuffer}
            onBufferEnd={handleBufferEnd}
            onError={(e) => console.error('Player error:', e)}
            controls
            width="100%"
            height="100%"
            url={videoUrl}
            {...{} as unknown as any} // ✅ Fixes prop-type error
          />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePlayPause}
              className="text-white hover:text-indigo-400 focus:outline-none"
              disabled={!isHost}
            >
              {videoState.isPlaying ? (
                <FiPause className="w-6 h-6" />
              ) : (
                <FiPlay className="w-6 h-6" />
              )}
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleMuteToggle}
                className="text-white hover:text-indigo-400 focus:outline-none"
              >
                {isMuted ? (
                  <FiVolumeX className="w-5 h-5" />
                ) : (
                  <FiVolume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 accent-indigo-500"
              />
            </div>
          </div>

          {buffering && (
            <div className="text-white text-sm">
              <span className="text-yellow-400">Buffering...</span>
            </div>
          )}
        </div>

        <div className="mt-2">
          <input
            type="range"
            min="0"
            max={videoState.duration || 100}
            step="0.01"
            value={videoState.progress || 0}
            onChange={(e) => {
              if (isHost && playerRef.current) {
                const newTime = parseFloat(e.target.value);
                playerRef.current.seekTo(newTime, 'seconds');
                updateVideoState({ progress: newTime });
              }
            }}
            onMouseDown={handleSeekStart}
            onMouseUp={handleSeekEnd}
            onTouchStart={handleSeekStart}
            onTouchEnd={handleSeekEnd}
            disabled={!isHost}
            className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer accent-indigo-500 disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  );
}
