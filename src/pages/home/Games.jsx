import React, { useEffect, useState } from "react";
import axios from "axios";
import { Play } from "lucide-react";
import LeftSidebar from "../../components/home/LeftSidebar";

const Games = () => {
  const [games, setGames] = useState([]);
  useEffect(() => {
    axios
      .get(`https://pixabay.com/api/?key=${import.meta.env.VITE_PIXABAY_API_KEY}&q=video+games&image_type=photo&per_page=12`)
      .then((response) => setGames(response.data.hits))
      .catch((error) => console.error("Error fetching games:", error));
  }, []);

  return (
    <div className="flex">
      <LeftSidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold mb-6">Recommended Games</h2>
        <div className="grid grid-cols-3 gap-5">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg overflow-hidden transition-all duration-300"
            >
              <img
                src={game.webformatURL}
                alt={game.tags}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 truncate">
                  {game.tags.split(",")[0] || "Game Title"}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {Math.floor(Math.random() * 20 + 5)}K players
                </p>
                <button className="flex items-center gap-2 mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  <Play size={16} /> Play Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Games;
