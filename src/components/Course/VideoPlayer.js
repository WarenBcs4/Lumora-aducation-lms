import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, Volume2, VolumeX, Maximize, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const VideoPlayer = ({ 
  episodes, 
  currentEpisode = 0, 
  courseId, 
  purchasedEpisodes = [], 
  onPurchaseClick 
}) => {
  const { currentUser } = useAuth();
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);

  const episode = episodes[currentEpisode];
  const isFirstEpisode = currentEpisode === 0;
  const isPurchased = purchasedEpisodes.includes(episode?.id) || isFirstEpisode;

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleProgress = (state) => {
    if (!seeking) {
      setPlayed(state.played);
    }
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = (e) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e) => {
    setSeeking(false);
    // Seek to the new position
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  if (!episode) {
    return (
      <div className="bg-gray-900 aspect-video flex items-center justify-center">
        <p className="text-white">No episode selected</p>
      </div>
    );
  }

  if (!isPurchased) {
    return (
      <div className="bg-gray-900 aspect-video flex flex-col items-center justify-center text-white">
        <Lock className="h-16 w-16 mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold mb-2">Premium Episode</h3>
        <p className="text-gray-300 text-center mb-4 max-w-md">
          This episode requires purchase. The first episode is always free!
        </p>
        <button
          onClick={() => onPurchaseClick?.(episode)}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Purchase Episode - $3.00
        </button>
      </div>
    );
  }

  return (
    <div className="bg-black rounded-lg overflow-hidden">
      <div className="relative aspect-video">
        <ReactPlayer
          url={episode.videoUrl}
          width="100%"
          height="100%"
          playing={playing}
          volume={volume}
          muted={muted}
          onProgress={handleProgress}
          onDuration={handleDuration}
          controls={false}
          className="react-player"
        />
        
        {/* Custom Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <input
              type="range"
              min={0}
              max={0.999999}
              step="any"
              value={played}
              onMouseDown={handleSeekMouseDown}
              onChange={handleSeekChange}
              onMouseUp={handleSeekMouseUp}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          
          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePlayPause}
                className="text-white hover:text-blue-400 transition-colors"
              >
                {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </button>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setMuted(!muted)}
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step="any"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div className="text-white text-sm">
                {formatTime(duration * played)} / {formatTime(duration)}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {!isFirstEpisode && (
                <span className="text-green-400 text-sm font-medium">Purchased</span>
              )}
              {isFirstEpisode && (
                <span className="text-blue-400 text-sm font-medium">Free Episode</span>
              )}
              <button className="text-white hover:text-blue-400 transition-colors">
                <Maximize className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Episode Info */}
      <div className="p-4 bg-gray-900 text-white">
        <h3 className="text-lg font-semibold mb-1">{episode.title}</h3>
        <p className="text-gray-300 text-sm">{episode.description}</p>
        <div className="flex items-center justify-between mt-2 text-sm text-gray-400">
          <span>Episode {currentEpisode + 1} of {episodes.length}</span>
          <span>Duration: {episode.duration || 'Unknown'}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;