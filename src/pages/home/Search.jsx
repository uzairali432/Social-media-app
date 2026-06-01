import { useState, useEffect } from "react";
import LeftSidebar from "../../components/home/LeftSidebar";
import { EmptyState, ListSkeleton } from "../../components/common/UiStates";
import { usersAPI, postsAPI } from "../../services/api";

const Search = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.trim().length === 0) {
      setUsers([]);
      setPosts([]);
      setLoading(false);
      return;
    }

    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const [uRes, pRes] = await Promise.all([
          usersAPI.searchUsers(query),
          postsAPI.searchPosts(query),
        ]);

        setUsers(uRes.data || []);
        setPosts(pRes.data || []);
      } catch (err) {
        console.error("Search error", err);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(t);
  }, [query]);

  return (
    <div className="bg-gray-50 min-h-screen flex">
      <LeftSidebar />
      <div className="flex-1 p-6">
        <div className="mb-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users or posts"
            className="w-full p-3 rounded-md border border-gray-200"
          />
        </div>

        {loading && <ListSkeleton count={4} />}

        {!loading && !query && (
          <EmptyState title="Start searching" description="Type a name or keyword to find users and posts." />
        )}

        {!loading && query && users.length === 0 && posts.length === 0 && (
          <EmptyState title="No results" description={`No matches for "${query}"`} />
        )}

        {!loading && users.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Users</h2>
            <div className="space-y-2">
              {users.map((u) => (
                <div key={u._id} className="flex items-center gap-3 bg-white p-3 rounded-md shadow-sm">
                  <img src={u.profilePicture || '/icons/default-avatar.png'} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="font-medium">{u.firstName} {u.surName}</div>
                    <div className="text-xs text-gray-500">{u.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Posts</h2>
            <div className="space-y-4">
              {posts.map((p) => (
                <div key={p._id} className="bg-white p-4 rounded-md shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <img src={p.author?.profilePicture || '/icons/default-avatar.png'} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                    <div className="text-sm font-medium">{p.author?.firstName} {p.author?.surName}</div>
                  </div>
                  <div className="text-sm text-gray-800">{p.content}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
