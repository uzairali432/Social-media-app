import { useEffect, useState } from "react";
import CreatePost from "./CreatePost";
import PostCard from "../common/PostCard";
import { usePostContext } from "../../context/PostContext";
import axios from "axios";

const Feeds = () => {
  const { state: { post } } = usePostContext();
  const [pixabayPosts, setPixabayPosts] = useState([]);

  useEffect(() => {
    const fetchPixabayPosts = async () => {
      try {
        const response = await axios.get(
          `https://pixabay.com/api/?key=${import.meta.env.VITE_PIXABAY_API_KEY}&q=people&image_type=photo&per_page=8`
        );

        const data = response.data;
        // console.log(data)
        const formattedPosts = data.hits.map((item, index) => ({
          id: `pixabay-${index}`,
          createdBy: item.user || "Pixabay User",
          createdAt: new Date().toLocaleString(),
          postText: item.tags,
          files: [item.webformatURL],
        }));

        setPixabayPosts(formattedPosts);
      } catch (error) {
        console.error("Error fetching from Pixabay:", error);
      }
    };

    fetchPixabayPosts();
  }, []);

  const allPosts = [...post, ...pixabayPosts];

  return (
    <div>
      <CreatePost />
      {allPosts.map((currPost) => (
        <PostCard key={currPost.id} postData={currPost} />
      ))}
    </div>
  );
};

export default Feeds;
