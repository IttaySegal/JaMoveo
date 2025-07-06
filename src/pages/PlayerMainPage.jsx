import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';
import { useAuth } from '../context/AuthContext';

export default function PlayerMainPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const handleSongSelected = () => {
      navigate('/live');
    };

    const handleReconnect = () => {
      socket.emit('getCurrentSong');
    };

    socket.on('newSongSelected', handleSongSelected);
    socket.on('connect', handleReconnect);

    if (!socket.connected) {
      socket.connect();
    } else {
      socket.emit('getCurrentSong');
    }

    return () => {
      socket.off('newSongSelected', handleSongSelected);
      socket.off('connect', handleReconnect);
    };
  }, [navigate, user]);

  return (
    <div className="min-h-screen bg-indigo-50 flex flex-col items-center">
      {/* Header */}
      <header className="w-full bg-indigo-700 text-white px-6 py-4 shadow-md flex justify-between items-center fixed top-0 z-10">
        <div>
          <h2 className="text-xl font-bold">{user?.name}</h2>
          <p className="text-sm opacity-80">{user?.instrument}</p>
        </div>
        <button
          onClick={logout}
          className="bg-white text-indigo-700 hover:bg-gray-100 font-semibold py-1.5 px-4 rounded shadow transition"
        >
          Logout
        </button>
      </header>

      {/* Content */}
      <main className="pt-28 text-center px-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Waiting for the next song</h1>
        <p className="text-gray-600 mb-6">The conductor will select a song shortly</p>

        <div className="flex justify-center items-center h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
      </main>
    </div>
  );
}
