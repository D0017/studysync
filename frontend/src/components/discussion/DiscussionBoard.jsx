import { useEffect, useMemo, useState } from "react";
import PostCard from "./PostCard";
import discussionService from "./discussionService";

export default function DiscussionBoard() {
  const storedUser = discussionService.getCurrentUser();
  const isStudent = storedUser?.role === "STUDENT";

  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [error, setError] = useState("");

  const refreshPosts = () => {
    setPosts(discussionService.getAllPosts());
  };

  useEffect(() => {
    refreshPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    let data = [...posts];

    if (activeTab === "open") {
      data = data.filter((post) => post.commentsEnabled);
    }

    if (activeTab === "closed") {
      data = data.filter((post) => !post.commentsEnabled);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (post) =>
          post.content.toLowerCase().includes(q) ||
          post.authorName.toLowerCase().includes(q)
      );
    }

    return data;
  }, [posts, search, activeTab]);

  const suggestedAuthors = useMemo(() => {
    const map = new Map();

    posts.forEach((post) => {
      if (!map.has(post.authorId)) {
        map.set(post.authorId, {
          id: post.authorId,
          name: post.authorName,
          role: post.authorRole,
          followers: discussionService.getFollowedCountForUser(post.authorId),
        });
      }
    });

    return Array.from(map.values()).slice(0, 4);
  }, [posts]);

  const handleFilesChange = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!isStudent) {
      setError("Only students can create discussion posts.");
      return;
    }

    if (!content.trim()) {
      setError("Post content is required.");
      return;
    }

    setError("");

    await discussionService.createPost({
      content,
      files,
    });

    setContent("");
    setFiles([]);
    refreshPosts();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[260px_minmax(0,1fr)_420px]">
        <aside className="hidden rounded-[32px] border border-white/10 bg-[#111115] p-6 lg:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-2xl bg-[#FF6A00] p-3 text-lg font-bold text-white">
              S
            </div>
            <div>
              <h1 className="text-xl font-bold">StudySync</h1>
              <p className="text-sm text-gray-400">Discussion Board</p>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              "Home",
              "Subscriptions",
              "Chat",
              "Activity",
              "Explore",
              "Profile",
            ].map((item, index) => (
              <button
                key={item}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                  index === 0
                    ? "bg-white/8 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="text-lg">
                  {["⌂", "▣", "☰", "◔", "⌕", "◎"][index]}
                </span>
                <span className="font-medium">{item}</span>
              </button>
            ))}
          </nav>

          <button className="mt-8 w-full rounded-2xl bg-[#FF6A00] px-4 py-3 font-semibold text-white transition hover:opacity-90">
            Create
          </button>
        </aside>

        <main>
          <div className="mb-6 rounded-[32px] border border-white/10 bg-[#1F1F23] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.28)]">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold">StudySync Discussions</h2>
                <p className="mt-2 text-gray-400">
                  Ask questions, share ideas, pin the best answer, and keep the campus conversation alive.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {["all", "open", "closed"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
                      activeTab === tab
                        ? "bg-[#FF6A00] text-white"
                        : "border border-white/10 bg-black/20 text-gray-300 hover:border-[#FF6A00]/40"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreatePost}>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Ask your question, share notes, or start a university discussion..."
                rows={5}
                className="w-full rounded-[28px] border border-white/10 bg-[#0A0A0C] px-5 py-4 text-[16px] text-white outline-none transition placeholder:text-gray-500 focus:border-[#FF6A00]"
              />

              <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <label className="cursor-pointer rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm font-medium text-gray-300 transition hover:border-[#FF6A00]/40 hover:text-[#FF6A00]">
                    Add image / video
                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      className="hidden"
                      onChange={handleFilesChange}
                    />
                  </label>

                  {files.length > 0 && (
                    <span className="text-sm text-gray-400">
                      {files.length} file(s) selected
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="rounded-full bg-[#FF6A00] px-6 py-3 font-semibold text-white transition hover:opacity-90"
                >
                  Publish Post
                </button>
              </div>

              {error && (
                <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}
            </form>
          </div>

          <div className="space-y-5">
            {filteredPosts.length === 0 ? (
              <div className="rounded-[28px] border border-white/10 bg-[#1F1F23] p-10 text-center text-gray-400">
                No posts yet. Start the first StudySync discussion.
              </div>
            ) : (
              filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} refreshPosts={refreshPosts} />
              ))
            )}
          </div>
        </main>

        <aside className="space-y-5">
          <div className="rounded-[28px] border border-white/10 bg-[#111115] p-5">
            <div className="rounded-[22px] border border-white/10 bg-[#0A0A0C] px-4 py-3">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search StudySync discussion"
                className="w-full bg-transparent text-white outline-none placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#111115] p-6">
            <div className="mb-5 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF6A00] text-xl font-bold">
                S
              </div>
              <h3 className="text-2xl font-bold">StudySync Feed</h3>
              <p className="mt-2 text-gray-400">
                A modern discussion space for students.
              </p>
            </div>

            <button className="mb-3 w-full rounded-2xl bg-[#FF6A00] px-4 py-3 font-semibold text-white transition hover:opacity-90">
              Open Board
            </button>

            <button className="w-full rounded-2xl bg-white/10 px-4 py-3 font-semibold text-gray-200 transition hover:bg-white/15">
              View Activity
            </button>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#111115] p-6">
            <h4 className="mb-4 text-2xl font-bold">Suggested people</h4>

            <div className="space-y-4">
              {suggestedAuthors.length === 0 ? (
                <p className="text-gray-400">No suggestions yet.</p>
              ) : (
                suggestedAuthors.map((author) => {
                  const following = discussionService.isFollowing(author.id);

                  return (
                    <div
                      key={author.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 p-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-white">{author.name}</p>
                        <p className="text-sm text-gray-400">
                          {author.role} · {author.followers} followers
                        </p>
                      </div>

                      {isStudent && author.id !== (storedUser?.email || storedUser?.fullName) && (
                        <button
                          onClick={() => {
                            discussionService.toggleFollow(author.id);
                            refreshPosts();
                          }}
                          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                            following
                              ? "border border-white/10 bg-white/5 text-gray-200"
                              : "bg-[#FF6A00] text-white"
                          }`}
                        >
                          {following ? "Subscribed" : "Subscribe"}
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}