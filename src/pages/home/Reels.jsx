import { useEffect, useState } from "react";
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal, RefreshCcw } from "lucide-react";
import userImage from "../../assets/user.png";
import LeftSidebar from "../../components/home/LeftSidebar";
import axios from "axios";

const Reels = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [like, setLike] = useState(false)

  const handleLike = () => {
    setLike(!like)
  }
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const randomPage = Math.floor(Math.random() * 5) + 1;

      const res = await axios.get(
        `https://pixabay.com/api/videos/?key=${import.meta.env.VITE_PIXABAY_API_KEY
        }&q=nature&page=${randomPage}&per_page=20`
      );
      setVideos(res.data.hits);
    } catch (err) {
      console.error("Error fetching videos:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchVideos();
  }, []);
  return (
    <div className="bg-gray-100 min-h-screen flex">
      <LeftSidebar />

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6 top-[70px] bg-gray-100 py-2 z-10">
          <h1 className="text-2xl font-bold text-gray-800">Videos</h1>
          <button
            onClick={fetchVideos}
            className="flex items-center gap-2 bg-blue-600 text-white text-sm px-6 py-2 rounded-full hover:bg-blue-700 transition-all duration-200"
          >
            <RefreshCcw size={16} /> See New Videos
          </button>
        </div>

        <div className="flex-1 ml-[100px] max-w-2xl mx-auto space-y-6">
          {loading ? (
            <p className="text-center text-gray-500">Fetching new videos...</p>
          ) : videos.length === 0 ? (
            <p className="text-center text-gray-500">No videos found.</p>
          ) : (
            videos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-transform hover:scale-[1.01]"
              >
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={userImage}
                      alt="user"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h2 className="font-semibold text-sm text-gray-800">
                        {video.user}
                      </h2>
                      <p className="text-xs text-gray-500">2 hrs ago</p>
                    </div>
                  </div>
                  <MoreHorizontal className="text-gray-500 cursor-pointer" />
                </div>
                <div className="px-3 pb-2">
                  <p className="text-sm text-gray-700">
                    Check out this awesome{" "}
                    <span className="font-medium text-blue-600">
                      #{video.tags.split(",")[0]}
                    </span>{" "}
                    video!
                  </p>
                </div>
                <video
                  src={video.videos.medium.url}
                  autoPlay
                  muted
                  loop
                  className="w-full h-[400px] object-cover"
                ></video>
                <div className="flex justify-between items-center px-3 py-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                   <ThumbsUp className="flex"/> 
                  <span>6.2k  </span>
                </div>
                  <span>45 Comments • 12 Shares</span>
                </div>
                <hr />
                <div className="flex justify-around py-2">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 font-medium text-sm ${like ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                      }`}
                  >
                    <ThumbsUp size={18} /> {like ? "Liked" : "Like"}
                  </button>

                  <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium text-sm">
                    <MessageCircle size={18} /> Comment
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium text-sm">
                    <Share2 size={18} /> Share
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reels;
