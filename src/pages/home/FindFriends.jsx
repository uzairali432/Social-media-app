import { useState, useEffect } from "react";
import axios from "axios";
import LeftSidebar from "../../components/home/LeftSidebar";
import { EmptyState, ErrorState, ListSkeleton } from "../../components/common/UiStates";

const FindFriends = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setError("");
        const response = await axios.get(
          `https://pixabay.com/api/?key=${import.meta.env.VITE_PIXABAY_API_KEY}&q=portrait+people&image_type=photo&per_page=12`
        );

        const formatted = response.data.hits.map((item, index) => ({
          id: index + 1,
          name: item.user || `User ${index + 1}`,
          mutual: Math.floor(Math.random() * 15) + 1,
          image: item.webformatURL,
        }));

        setFriends(formatted);
      } catch (error) {
        console.error("Error fetching friends:", error);
        setError("We could not load friend suggestions right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  const handleDelete = (id) => {
    setFriends((prev) => prev.filter((f) => f.id !== id));
  };

  const handleAdd = (id) => {
    const addedFriend = friends.find((f) => f.id === id);
    if (addedFriend) {
      alert(`${addedFriend.name} is added to your friend list 🎉`);
      setFriends((prev) => prev.filter((f) => f.id !== id));
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex">
      <LeftSidebar/>
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">Friend requests</h1>
          <button className="text-blue-600 text-sm font-medium hover:underline">
            See all
          </button>
        </div>

        {loading && <ListSkeleton count={8} />}

        {!loading && error && friends.length === 0 && (
          <ErrorState title="Friend suggestions unavailable" description={error} onRetry={() => window.location.reload()} />
        )}

        {!loading && !error && friends.length === 0 && (
          <EmptyState title="No friend requests" description="You’re all caught up on pending suggestions." />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {!loading &&
            friends.map((friend) => (
              <div
                key={friend.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
              >
                <img
                  src={friend.image}
                  alt={friend.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-3">
                  <h2 className="font-semibold text-gray-800 text-sm">{friend.name}</h2>
                  <p className="text-gray-500 text-xs mb-3">
                    {friend.mutual} mutual friends
                  </p>
                  <div className="flex gap-2">
                    <button
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 rounded-md"
                      onClick={() => handleAdd(friend.id)}
                    >
                      Confirm
                    </button>
                    <button
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium py-1.5 rounded-md"
                      onClick={() => handleDelete(friend.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FindFriends;
