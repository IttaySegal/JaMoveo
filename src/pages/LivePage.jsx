import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';
import ScrollToggle from '../components/ScrollToggle';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';

export default function LivePage() {
  const [song, setSong] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const onConnect = () => {
      setIsConnected(true);
      setError(null);
      socket.emit('getCurrentSong');
    };

    const onDisconnect = () => {
      setIsConnected(false);
      setError('Lost connection to server. Attempting to reconnect...');
    };

    const onConnectError = () => {
      setError('Failed to connect to server. Please check your internet connection.');
    };

    const handleSongUpdate = (selectedSong) => {
      setIsLoading(false);
      setSong(selectedSong);
      setError(null);
    };

    const handleQuit = () => {
      navigate(isAdmin ? '/admin' : '/player');
    };

    const handleError = (error) => {
      setError(`An error occurred: ${error.message}`);
      setIsLoading(false);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on('error', handleError);
    socket.on('newSongSelected', handleSongUpdate);
    socket.on('quitSession', handleQuit);

    if (!socket.connected) {
      socket.connect();
    } else {
      socket.emit('getCurrentSong');
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('error', handleError);
      socket.off('newSongSelected', handleSongUpdate);
      socket.off('quitSession', handleQuit);
    };
  }, [navigate, isAdmin, user]);

  const handleQuit = () => {
    socket.emit('quitSession');
    navigate(isAdmin ? '/admin' : '/player');
  };

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    if (!socket.connected) {
      socket.connect();
    } else {
      socket.emit('getCurrentSong');
    }
  };

  const wordsWithSpaces = (line) =>
    line.map((word, i) => ({
      ...word,
      lyrics: word.lyrics + (i < line.length - 1 ? ' ' : ''),
    }));

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-6">
      {/* Error */}
      {error && <ErrorMessage message={error} onRetry={handleRetry} />}

      {/* Header */}
      <header className="bg-gray-800 px-6 py-4 flex flex-col sm:flex-row justify-between items-center fixed top-0 left-0 right-0 z-50 shadow">
        <div className="text-center sm:text-left">
          {song ? (
            <>
              <h1 className="text-2xl font-bold">{song.name}</h1>
              <h2 className="text-sm text-gray-300">by {song.artist}</h2>
            </>
          ) : (
            <h1 className="text-xl font-semibold">Waiting for song...</h1>
          )}
        </div>

        {!isAdmin && (
          <div className="mt-2 sm:mt-0 text-right">
            <h3 className="text-lg font-semibold">{user?.name}</h3>
            <p className="text-sm text-gray-400">{user?.instrument}</p>
          </div>
        )}

        <div className="mt-4 sm:mt-0">
          {isAdmin ? (
            <button
              onClick={handleQuit}
              disabled={!isConnected}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 px-4 py-2 rounded text-sm font-medium"
            >
              End Session
            </button>
          ) : (
            <button
              onClick={logout}
              disabled={!isConnected}
              className="bg-gray-600 hover:bg-gray-700 disabled:opacity-50 px-4 py-2 rounded text-sm font-medium"
            >
              Logout
            </button>
          )}
        </div>
      </header>

      {/* Offset for fixed header */}
      <div className="pt-32" />

      {/* Song Content */}
      <main className="max-w-5xl mx-auto text-white">
        {isLoading ? (
          <div className="text-center mt-12">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm">Loading song...</p>
          </div>
        ) : song?.data?.length > 0 ? (
          song.data.map((line, index) => {
            const processedLine = wordsWithSpaces(line);
            return (
              <div key={index} className="mb-8">
                {/* Chords */}
                {user?.instrument !== 'vocals' && (
                  <div className="flex overflow-x-auto mb-1 whitespace-nowrap">
                    {processedLine.map((word, i) => (
                      <span
                        key={i}
                        className="inline-block text-xs font-semibold text-green-300"
                        style={{ width: `${word.lyrics.length}ch` }}
                      >
                        {word.chords || '\u00A0'}
                      </span>
                    ))}
                  </div>
                )}

                {/* Lyrics */}
                <div className="flex overflow-x-auto whitespace-nowrap">
                  {processedLine.map((word, i) => (
                    <span
                      key={i}
                      className="inline-block"
                      style={{ width: `${word.lyrics.length}ch` }}
                    >
                      {word.lyrics}
                    </span>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center mt-12 text-gray-400">
            Please wait while the admin selects a song...
          </p>
        )}
      </main>

      {/* Scroll Speed Toggle */}
      <ScrollToggle scrollSpeed={1} />
    </div>
  );
}
