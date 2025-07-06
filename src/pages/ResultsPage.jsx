import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import socket from "../socket";
import heyJude from "../data/hey_jude.json";
import veechShelo from "../data/veech_shelo.json";
import SongCard from "../components/SongCard";

const SONGS = [
  {
    id: "hey_jude",
    name: "Hey Jude",
    artist: "The Beatles",
    data: heyJude,
    image: "https://i.ytimg.com/vi/Z5TQqiObrwo/maxresdefault.jpg"
  },
  {
    id: "veech_shelo",
    name: "Veech Shelo",
    artist: "Ishay Ribo",
    data: veechShelo,
    image: "https://i.ytimg.com/vi/Z5TQqiObrwo/maxresdefault.jpg"
  }
];

export default function ResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedSongId, setSelectedSongId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const query = searchParams.get("q")?.toLowerCase() || "";

  const filteredSongs = useMemo(() => {
    return SONGS.filter(song =>
      song.name.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query)
    );
  }, [query]);

  const handleSelectSong = async (song) => {
    try {
      setIsLoading(true);
      setSelectedSongId(song.id);

      socket.emit("selectSong", {
        id: song.id,
        name: song.name,
        artist: song.artist,
        data: song.data
      });

      await new Promise(resolve => setTimeout(resolve, 500));
      navigate("/live");
    } catch (err) {
      console.error("Error selecting song:", err);
      setError("Failed to select song. Please try again.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (!query) {
      navigate("/admin");
    }
  }, [query, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Search Results for "{query}"
          </h2>
          <button
            onClick={() => navigate("/admin")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
          >
            New Search
          </button>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 border border-red-400 p-3 rounded">
            {error}
          </div>
        )}

        {filteredSongs.length === 0 ? (
          <p className="text-center text-gray-500">No songs found matching "{query}"</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredSongs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                isSelected={selectedSongId === song.id}
                isLoading={isLoading && selectedSongId === song.id}
                onSelect={handleSelectSong}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
