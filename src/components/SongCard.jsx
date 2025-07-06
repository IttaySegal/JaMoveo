import React from "react";

export default function SongCard({ song, isSelected, isLoading, onSelect }) {
  const handleSelect = () => {
    if (!isLoading) {
      onSelect(song);
    }
  };

  return (
    <div
      className={`bg-white shadow-sm rounded-xl p-4 border transition hover:shadow-md ${
        isSelected ? "border-green-500" : "border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded overflow-hidden bg-gray-100">
            <img
              src={song.image}
              alt={`${song.name} by ${song.artist}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/default-album.png";
                e.target.onerror = null;
              }}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{song.name}</h3>
            <p className="text-sm text-gray-500">{song.artist}</p>
          </div>
        </div>
        <button
          onClick={handleSelect}
          disabled={isLoading}
          className={`px-4 py-2 rounded-md text-white text-sm font-medium transition ${
            isSelected
              ? "bg-green-500 hover:bg-green-600"
              : "bg-blue-500 hover:bg-blue-600"
          } ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {isLoading && isSelected
            ? "Loading..."
            : isSelected
            ? "Selected"
            : "Select"}
        </button>
      </div>
    </div>
  );
}
