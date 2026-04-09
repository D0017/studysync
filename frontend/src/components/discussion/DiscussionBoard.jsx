import { useEffect, useMemo, useState } from "react";
import PostCard from "./PostCard";
import discussionService from "./discussionService";
import discussionBg from "../../assets/discussion-bg.jpg";

export default function DiscussionBoard() {
  const storedUser = discussionService.getCurrentUser();
  const isStudent = storedUser?.role === "STUDENT";

  const currentUserId =
    storedUser?.email ||
    storedUser?.id ||
    storedUser?.username ||
    storedUser?.fullName ||
    "guest";

  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sideFilter, setSideFilter] = useState("home");
  const [error, setError] = useState("");

  const refreshPosts = () => {
    setPosts(discussionService.getAllPosts());
  };

  useEffect(() => {
    refreshPosts();
  }, []);

  const focusCreateBox = () => {
    const box = document.querySelector("textarea");
    if (box) {
      box.focus();
      box.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

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

    if (sideFilter === "subscriptions") {
      data = data.filter((post) => discussionService.isFollowing(post.authorId));
    }

    if (sideFilter === "activity") {
      data = data.filter(
        (post) =>
          post.likes.length > 0 ||
          post.comments.length > 0 ||
          post.reshares.length > 0
      );
    }

    if (sideFilter === "profile") {
      data = data.filter((post) => post.authorId === currentUserId);
    }

    return data;
  }, [posts, search, activeTab, sideFilter, currentUserId]);

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
    setSideFilter("home");
    setActiveTab("all");
    refreshPosts();
  };

  const leftNavItems = [
    {
      key: "home",
      label: "Home",
      icon: "⌂",
      action: () => {
        setSideFilter("home");
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
    },
    {
      key: "subscriptions",
      label: "Subscriptions",
      icon: "▣",
      action: () => {
        setSideFilter("subscriptions");
      },
    },
    {
      key: "chat",
      label: "Chat",
      icon: "☰",
      action: () => {
        focusCreateBox();
      },
    },
    {
      key: "activity",
      label: "Activity",
      icon: "◔",
      action: () => {
        setSideFilter("activity");
      },
    },
    {
      key: "explore",
      label: "Explore",
      icon: "⌕",
      action: () => {
        setSideFilter("home");
        setSearch("");
        setActiveTab("all");
      },
    },
    {
      key: "profile",
      label: "Profile",
      icon: "◎",
      action: () => {
        setSideFilter("profile");
      },
    },
  ];

  const boardTitle =
    sideFilter === "subscriptions"
      ? "Subscribed Discussions"
      : sideFilter === "activity"
      ? "Recent Activity"
      : sideFilter === "profile"
      ? "My Posts"
      : "StudySync Discussions";

  const boardDescription =
    sideFilter === "subscriptions"
      ? "Posts from people you subscribed to."
      : sideFilter === "activity"
      ? "Posts with likes, comments, or reshares."
      : sideFilter === "profile"
      ? "Your own questions, posts, and updates."
      : "Ask questions, share ideas, pin the best answer, and keep the campus conversation alive.";

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat text-white"
      style={{
        backgroundImage: `url(${discussionBg})`,
      }}
    >
      <div className="min-h-screen bg-gradient-to-br from-black/90 via-black/80 to-[#0A0A0C]/92 backdrop-blur-[2px]">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[260px_minmax(0,1fr)_420px]">
          <aside className="hidden rounded-[32px] border border-[#FF6A00]/15 bg-gradient-to-b from-[#1F1F23]/92 to-[#111115]/92 p-6 shadow-[0_0_0_1px_rgba(255,106,0,0.05),0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md lg:block">
            <div className="mb-8 flex items-center gap-3">
              <div className="rounded-2xl bg-[#FF6A00] p-3 text-lg font-bold text-white shadow-[0_0_22px_rgba(255,106,0,0.45)]">
                S
              </div>
              <div>
                <h1 className="text-xl font-bold">StudySync</h1>
                <p className="text-sm text-gray-300">Discussion Board</p>
              </div>
            </div>

            <div className="mb-6 h-px bg-gradient-to-r from-transparent via-[#FF6A00]/40 to-transparent" />

            <nav className="space-y-2">
              {leftNavItems.map((item) => (
                <button
                  key={item.key}
                  onClick={item.action}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition duration-300 ${
                    sideFilter === item.key
                      ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,106,0,0.10)]"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            <button
              className="mt-8 w-full rounded-2xl bg-[#FF6A00] px-4 py-3 font-semibold text-white shadow-[0_0_28px_rgba(255,106,0,0.28)] transition duration-300 hover:-translate-y-0.5 hover:opacity-95 hover:shadow-[0_0_34px_rgba(255,106,0,0.4)]"
              onClick={focusCreateBox}
            >
              Create
            </button>
          </aside>

          <main>
            <div className="relative mb-6 overflow-hidden rounded-[32px] border border-[#FF6A00]/12 bg-gradient-to-br from-[#23232a]/95 via-[#1F1F23]/94 to-[#18181d]/94 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_16px_46px_rgba(0,0,0,0.42)] backdrop-blur-md transition duration-300 hover:shadow-[0_0_0_1px_rgba(255,106,0,0.10),0_18px_50px_rgba(0,0,0,0.5)]">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF6A00] to-transparent opacity-80" />
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#FF6A00]/10 blur-3xl" />
              <div className="pointer-events-none absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-[#FF6A00]/5 blur-3xl" />

              <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-white">
                    {boardTitle}
                  </h2>
                  <p className="mt-2 text-[17px] text-gray-300">
                    {boardDescription}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {["all", "open", "closed"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition duration-300 ${
                        activeTab === tab
                          ? "bg-[#FF6A00] text-white shadow-[0_0_20px_rgba(255,106,0,0.25)]"
                          : "border border-white/10 bg-black/20 text-gray-200 hover:border-[#FF6A00]/40 hover:text-white"
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
                  className="w-full rounded-[28px] border border-white/10 bg-[#0A0A0C]/95 px-5 py-4 text-[16px] text-white outline-none transition duration-300 placeholder:text-gray-500 focus:border-[#FF6A00] focus:shadow-[0_0_0_1px_rgba(255,106,0,0.20),0_0_24px_rgba(255,106,0,0.12)]"
                />

                <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="cursor-pointer rounded-full border border-white/10 bg-black/25 px-4 py-2 text-sm font-medium text-gray-200 transition duration-300 hover:border-[#FF6A00]/40 hover:text-[#FF6A00]">
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
                      <span className="text-sm text-gray-300">
                        {files.length} file(s) selected
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="rounded-full bg-[#FF6A00] px-6 py-3 font-semibold text-white shadow-[0_0_24px_rgba(255,106,0,0.22)] transition duration-300 hover:-translate-y-0.5 hover:opacity-95 hover:shadow-[0_0_30px_rgba(255,106,0,0.35)]"
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
                <div className="relative overflow-hidden rounded-[28px] border border-[#FF6A00]/10 bg-gradient-to-br from-[#23232a]/95 via-[#1F1F23]/94 to-[#18181d]/94 p-10 text-center text-gray-300 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgba(255,106,0,0.08),0_16px_46px_rgba(0,0,0,0.42)]">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF6A00]/70 to-transparent" />
                  {sideFilter === "subscriptions"
                    ? "No subscribed posts yet."
                    : sideFilter === "activity"
                    ? "No recent activity yet."
                    : sideFilter === "profile"
                    ? "You have not posted anything yet."
                    : "No posts yet. Start the first StudySync discussion."}
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="transition duration-300 hover:-translate-y-1"
                  >
                    <PostCard post={post} refreshPosts={refreshPosts} />
                  </div>
                ))
              )}
            </div>
          </main>

          <aside className="space-y-5">
            <div className="rounded-[28px] border border-[#FF6A00]/10 bg-gradient-to-br from-[#15151a]/94 via-[#111115]/94 to-[#0f0f13]/94 p-5 shadow-[0_12px_36px_rgba(0,0,0,0.36)] backdrop-blur-md transition duration-300 hover:shadow-[0_16px_42px_rgba(0,0,0,0.42)]">
              <div className="rounded-[22px] border border-white/10 bg-[#0A0A0C]/95 px-4 py-3 transition duration-300 focus-within:border-[#FF6A00]/40 focus-within:shadow-[0_0_20px_rgba(255,106,0,0.08)]">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search StudySync discussion"
                  className="w-full bg-transparent text-white outline-none placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-[#FF6A00]/10 bg-gradient-to-br from-[#15151a]/94 via-[#111115]/94 to-[#0f0f13]/94 p-6 shadow-[0_12px_36px_rgba(0,0,0,0.36)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_42px_rgba(0,0,0,0.42)]">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF6A00]/80 to-transparent" />
              <div className="mb-5 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF6A00] text-xl font-bold shadow-[0_0_22px_rgba(255,106,0,0.35)]">
                  S
                </div>
                <h3 className="text-2xl font-bold">StudySync Feed</h3>
                <p className="mt-2 text-gray-300">
                  A modern discussion space for students.
                </p>
              </div>

              <button
                className="mb-3 w-full rounded-2xl bg-[#FF6A00] px-4 py-3 font-semibold text-white shadow-[0_0_20px_rgba(255,106,0,0.24)] transition duration-300 hover:-translate-y-0.5 hover:opacity-95"
                onClick={() => {
                  setSideFilter("home");
                  setSearch("");
                  setActiveTab("all");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Open Board
              </button>

              <button
                className="w-full rounded-2xl bg-white/10 px-4 py-3 font-semibold text-gray-100 transition duration-300 hover:bg-white/15"
                onClick={() => setSideFilter("activity")}
              >
                View Activity
              </button>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-[#FF6A00]/10 bg-gradient-to-br from-[#15151a]/94 via-[#111115]/94 to-[#0f0f13]/94 p-6 shadow-[0_12px_36px_rgba(0,0,0,0.36)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_42px_rgba(0,0,0,0.42)]">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF6A00]/75 to-transparent" />
              <h4 className="mb-4 text-2xl font-bold">Suggested people</h4>

              <div className="space-y-4">
                {suggestedAuthors.length === 0 ? (
                  <p className="text-gray-300">No suggestions yet.</p>
                ) : (
                  suggestedAuthors.map((author) => {
                    const following = discussionService.isFollowing(author.id);

                    return (
                      <div
                        key={author.id}
                        className="rounded-2xl border border-white/10 bg-black/20 p-4 transition duration-300 hover:border-[#FF6A00]/20 hover:bg-black/25"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-white">{author.name}</p>
                            <p className="text-sm text-gray-300">
                              {author.role} · {author.followers} followers
                            </p>
                          </div>

                          {isStudent &&
                            author.id !== (storedUser?.email || storedUser?.fullName) && (
                              <button
                                onClick={() => {
                                  discussionService.toggleFollow(author.id);
                                  refreshPosts();
                                  setSideFilter("subscriptions");
                                }}
                                className={`rounded-full px-4 py-2 text-sm font-semibold transition duration-300 ${
                                  following
                                    ? "border border-white/10 bg-white/5 text-gray-100"
                                    : "bg-[#FF6A00] text-white shadow-[0_0_16px_rgba(255,106,0,0.16)]"
                                }`}
                              >
                                {following ? "Subscribed" : "Subscribe"}
                              </button>
                            )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}