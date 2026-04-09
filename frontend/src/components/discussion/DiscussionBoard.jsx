import { useCallback, useEffect, useState } from "react";
import discussionService from "./discussionService";
import bg from "../../assets/substack.jpg";

function formatDateTime(dateString) {
  try {
    return new Date(dateString).toLocaleString();
  } catch {
    return dateString || "";
  }
}

export default function DiscussionBoard() {
  const storedUser = discussionService.getCurrentUser?.() || null;

  const currentUserId =
    storedUser?.email ||
    storedUser?.id ||
    storedUser?.username ||
    storedUser?.fullName ||
    "guest";

  const currentUserItNumber =
    storedUser?.itNumber ||
    storedUser?.studentId ||
    storedUser?.registrationNumber ||
    storedUser?.userId ||
    "";

  const isStudent = storedUser?.role === "STUDENT";

  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [panelFilter, setPanelFilter] = useState("home");
  const [activityFilter, setActivityFilter] = useState("liked");
  const [error, setError] = useState("");
  const [openComments, setOpenComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  const loadPosts = useCallback(() => {
    try {
      const rawPosts = discussionService.getAllPosts?.() || [];

      const safePosts = rawPosts.map((post, index) => ({
        id: post?.id || `post-${index}`,
        authorId: post?.authorId || "unknown",
        authorName: post?.authorName || "StudySync User",
        authorRole: post?.authorRole || "STUDENT",
        authorItNumber:
          post?.authorItNumber ||
          post?.itNumber ||
          post?.authorStudentId ||
          post?.authorRegistrationNumber ||
          "",
        content: post?.content || "",
        attachments: Array.isArray(post?.attachments) ? post.attachments : [],
        commentsEnabled:
          typeof post?.commentsEnabled === "boolean" ? post.commentsEnabled : true,
        pinnedCommentId: post?.pinnedCommentId || null,
        likes: Array.isArray(post?.likes) ? post.likes : [],
        reshares: Array.isArray(post?.reshares) ? post.reshares : [],
        comments: Array.isArray(post?.comments) ? post.comments : [],
        createdAt: post?.createdAt || new Date().toISOString(),
      }));

      setPosts(safePosts);
    } catch (err) {
      console.error("Failed to load discussion posts:", err);
      setPosts([]);
      setError("Could not load discussion posts.");
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadPosts();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadPosts]);

  const handleFilesChange = (e) => {
    const selected = Array.from(e.target.files || []);

    const valid = selected.filter((file) => {
      const validType =
        file.type.startsWith("image/") || file.type.startsWith("video/");
      const validSize = file.size <= 2 * 1024 * 1024;
      return validType && validSize;
    });

    if (selected.length !== valid.length) {
      setError("Only image/video files under 2MB are allowed.");
    } else {
      setError("");
    }

    setFiles(valid);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!isStudent) {
      setError("Only students can create posts.");
      return;
    }

    if (!content.trim()) {
      setError("Write something before publishing.");
      return;
    }

    try {
      setError("");

      await discussionService.createPost?.({
        content,
        files,
        authorItNumber: currentUserItNumber,
      });

      setContent("");
      setFiles([]);
      setPanelFilter("home");
      setTab("all");
      loadPosts();
    } catch (err) {
      console.error("Publish failed:", err);
      setError("Could not publish. Try a smaller image or fewer files.");
    }
  };

  const focusCreateBox = () => {
    const box = document.querySelector("textarea");
    if (box) {
      box.focus();
      box.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const isAuthor = (post) => post.authorId === currentUserId;
  const isResharedByMe = (post) => (post.reshares || []).includes(currentUserId);
  const isLikedByMe = (post) => (post.likes || []).includes(currentUserId);
  const isCommentedByMe = (post) =>
    (post.comments || []).some((comment) => comment.authorId === currentUserId);

  const filteredPosts = (() => {
    let data = [...posts];

    if (tab === "open") {
      data = data.filter((post) => post.commentsEnabled);
    }

    if (tab === "closed") {
      data = data.filter((post) => !post.commentsEnabled);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (post) =>
          (post.content || "").toLowerCase().includes(q) ||
          (post.authorName || "").toLowerCase().includes(q) ||
          (post.authorItNumber || "").toLowerCase().includes(q)
      );
    }

    if (panelFilter === "profile") {
      data = data.filter((post) => post.authorId === currentUserId);
    }

    if (panelFilter === "liked") {
      data = data.filter((post) => isLikedByMe(post));
    }

    if (panelFilter === "activity") {
      if (activityFilter === "liked") {
        data = data.filter((post) => isLikedByMe(post));
      }

      if (activityFilter === "reposted") {
        data = data.filter((post) => isResharedByMe(post));
      }

      if (activityFilter === "commented") {
        data = data.filter((post) => isCommentedByMe(post));
      }
    }

    return data;
  })();

  const suggestedPeople = (() => {
    const seen = new Map();

    posts.forEach((post) => {
      if (!seen.has(post.authorId) && post.authorId !== currentUserId) {
        seen.set(post.authorId, {
          id: post.authorId,
          name: post.authorName,
          itNumber: post.authorItNumber,
          followers: discussionService.getFollowedCountForUser?.(post.authorId) || 0,
        });
      }
    });

    return Array.from(seen.values()).slice(0, 4);
  })();

  const navButtonClass = (key) =>
    `group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl px-4 py-3.5 text-left transition-all duration-300 ${
      panelFilter === key
        ? "border border-[#FF6A00]/30 bg-gradient-to-r from-[#FF6A00]/18 via-[#FF6A00]/10 to-transparent text-white shadow-[0_10px_24px_rgba(255,106,0,0.16)]"
        : "border border-transparent text-gray-300 hover:border-white/10 hover:bg-white/[0.06] hover:text-white"
    }`;

  const toggleCommentsPanel = (postId) => {
    setOpenComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleLike = (postId) => {
    try {
      discussionService.toggleLike?.(postId);
      loadPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReshare = (postId) => {
    try {
      discussionService.toggleReshare?.(postId);
      loadPosts();
      setPanelFilter("activity");
      setActivityFilter("reposted");
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentInput = (postId, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  const handleAddComment = (postId) => {
    const text = commentInputs[postId] || "";
    if (!text.trim()) return;

    try {
      discussionService.addComment?.(postId, text);
      setCommentInputs((prev) => ({
        ...prev,
        [postId]: "",
      }));
      setOpenComments((prev) => ({
        ...prev,
        [postId]: true,
      }));
      loadPosts();
      setPanelFilter("activity");
      setActivityFilter("commented");
    } catch (err) {
      console.error(err);
      setError("Could not add comment.");
    }
  };

  const handleToggleCommentSection = (postId, ownerCheck) => {
    if (!ownerCheck) return;

    try {
      discussionService.toggleComments?.(postId);
      loadPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = (postId, ownerCheck) => {
    if (!ownerCheck) return;

    const ok = window.confirm("Are you sure you want to delete this post?");
    if (!ok) return;

    try {
      discussionService.deletePost?.(postId);
      loadPosts();
    } catch (err) {
      console.error(err);
      setError("Could not delete post.");
    }
  };

  const handlePinComment = (postId, commentId, ownerCheck) => {
    if (!ownerCheck) return;

    try {
      discussionService.pinComment?.(postId, commentId);
      loadPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const showComposer = panelFilter === "home";

  return (
    <div
      className="min-h-screen text-white"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="min-h-screen bg-black/80 backdrop-blur-[2px]">
        <div className="mx-auto grid max-w-400 grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[260px_minmax(0,1fr)_360px]">
          <aside className="hidden lg:block">
            <div className="sticky top-6 overflow-hidden rounded-[30px] border border-white/10 bg-linear-to-b from-[#1d1d22]/95 via-[#15151a]/95 to-[#101014]/95 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-0.75 bg-gradient-to-r from-transparent via-[#FF6A00] to-transparent opacity-90" />
              <div className="pointer-events-none absolute -left-10 top-10 h-28 w-28 rounded-full bg-[#FF6A00]/10 blur-3xl" />

              <div className="relative p-5">
                <div className="mb-6 flex items-center gap-3 rounded-[24px] border border-white/8 bg-white/[0.03] px-4 py-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF7A00] to-[#FF5A00] text-xl font-extrabold text-white shadow-[0_10px_30px_rgba(255,106,0,0.30)]">
                    S
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate text-xl font-bold tracking-tight text-white">
                      StudySync
                    </h2>
                    <p className="text-sm text-gray-400">Discussion Board</p>
                  </div>
                </div>

                <button
                  onClick={() => (window.location.href = "/student-dashboard")}
                  className="mb-5 flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-[#FF6A00]/30 hover:bg-white/[0.08] hover:shadow-[0_10px_25px_rgba(255,255,255,0.05)]"
                >
                  ← Back to Student Dashboard
                </button>

                <div className="mb-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div className="space-y-2">
                  <button
                    className={navButtonClass("home")}
                    onClick={() => {
                      setPanelFilter("home");
                      setSearch("");
                      setTab("all");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-base transition-all duration-300 ${
                        panelFilter === "home"
                          ? "bg-[#FF6A00] text-white shadow-[0_8px_20px_rgba(255,106,0,0.28)]"
                          : "bg-white/[0.05] text-gray-300 group-hover:bg-white/[0.08] group-hover:text-white"
                      }`}
                    >
                      ⌂
                    </span>
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                      <span className="font-medium">Home</span>
                      {panelFilter === "home" && (
                        <span className="h-2.5 w-2.5 rounded-full bg-[#FF6A00]" />
                      )}
                    </div>
                  </button>

                  <button
                    className={navButtonClass("liked")}
                    onClick={() => {
                      setPanelFilter("liked");
                      setSearch("");
                      setTab("all");
                    }}
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-base transition-all duration-300 ${
                        panelFilter === "liked"
                          ? "bg-[#FF6A00] text-white shadow-[0_8px_20px_rgba(255,106,0,0.28)]"
                          : "bg-white/[0.05] text-gray-300 group-hover:bg-white/[0.08] group-hover:text-white"
                      }`}
                    >
                      ♥
                    </span>
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                      <span className="font-medium">Liked Posts</span>
                      {panelFilter === "liked" && (
                        <span className="h-2.5 w-2.5 rounded-full bg-[#FF6A00]" />
                      )}
                    </div>
                  </button>

                  <button
                    className={navButtonClass("activity")}
                    onClick={() => {
                      setPanelFilter("activity");
                      setActivityFilter("liked");
                      setSearch("");
                      setTab("all");
                    }}
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-base transition-all duration-300 ${
                        panelFilter === "activity"
                          ? "bg-[#FF6A00] text-white shadow-[0_8px_20px_rgba(255,106,0,0.28)]"
                          : "bg-white/[0.05] text-gray-300 group-hover:bg-white/[0.08] group-hover:text-white"
                      }`}
                    >
                      ◔
                    </span>
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                      <span className="font-medium">Activity</span>
                      {panelFilter === "activity" && (
                        <span className="h-2.5 w-2.5 rounded-full bg-[#FF6A00]" />
                      )}
                    </div>
                  </button>

                  <button
                    className={navButtonClass("profile")}
                    onClick={() => {
                      setPanelFilter("profile");
                      setSearch("");
                      setTab("all");
                    }}
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-base transition-all duration-300 ${
                        panelFilter === "profile"
                          ? "bg-[#FF6A00] text-white shadow-[0_8px_20px_rgba(255,106,0,0.28)]"
                          : "bg-white/[0.05] text-gray-300 group-hover:bg-white/[0.08] group-hover:text-white"
                      }`}
                    >
                      ◎
                    </span>
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                      <span className="font-medium">Profile</span>
                      {panelFilter === "profile" && (
                        <span className="h-2.5 w-2.5 rounded-full bg-[#FF6A00]" />
                      )}
                    </div>
                  </button>
                </div>

                {showComposer && (
                  <div className="mt-6 rounded-[24px] border border-[#FF6A00]/15 bg-gradient-to-br from-[#FF6A00]/10 to-transparent p-3">
                    <button
                      className="w-full rounded-2xl bg-gradient-to-r from-[#FF7A00] to-[#FF5A00] px-4 py-3.5 font-semibold text-white shadow-[0_14px_30px_rgba(255,106,0,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_35px_rgba(255,106,0,0.35)]"
                      onClick={focusCreateBox}
                    >
                      Create
                    </button>
                  </div>
                )}
              </div>
            </div>
          </aside>

          <main>
            {showComposer && (
              <div className="relative mb-6 overflow-hidden rounded-[32px] border border-[#FF6A00]/12 bg-gradient-to-br from-[#23232a]/95 via-[#1F1F23]/94 to-[#18181d]/94 p-6 shadow-[0_16px_46px_rgba(0,0,0,0.42)] backdrop-blur-md">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF6A00] to-transparent opacity-80" />
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#FF6A00]/10 blur-3xl" />

                <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold">StudySync Discussions</h1>
                    <p className="mt-2 text-[17px] text-gray-300">
                      Ask questions, share ideas, pin the best answer, and keep the campus conversation alive.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {["all", "open", "closed"].map((item) => (
                      <button
                        key={item}
                        onClick={() => setTab(item)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
                          tab === item
                            ? "bg-[#FF6A00] text-white shadow-[0_0_20px_rgba(255,106,0,0.25)]"
                            : "border border-white/10 bg-black/20 text-gray-200 hover:border-[#FF6A00]/40"
                        }`}
                      >
                        {item}
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
                    className="w-full rounded-[28px] border border-white/10 bg-[#0A0A0C]/95 px-5 py-4 text-[16px] text-white outline-none transition placeholder:text-gray-500 focus:border-[#FF6A00] focus:shadow-[0_0_24px_rgba(255,106,0,0.12)]"
                  />

                  <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="cursor-pointer rounded-full border border-white/10 bg-black/25 px-4 py-2 text-sm font-medium text-gray-200 transition hover:border-[#FF6A00]/40 hover:text-[#FF6A00]">
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
                      className="rounded-full bg-[#FF6A00] px-6 py-3 font-semibold text-white shadow-[0_0_24px_rgba(255,106,0,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(255,106,0,0.35)]"
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
            )}

            {panelFilter === "activity" && (
              <div className="mb-6 rounded-[32px] border border-[#FF6A00]/12 bg-gradient-to-br from-[#23232a]/95 via-[#1F1F23]/94 to-[#18181d]/94 p-6 shadow-[0_16px_46px_rgba(0,0,0,0.42)] backdrop-blur-md">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setActivityFilter("liked")}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      activityFilter === "liked"
                        ? "bg-[#FF6A00] text-white shadow-[0_0_20px_rgba(255,106,0,0.25)]"
                        : "border border-white/10 bg-black/20 text-gray-200"
                    }`}
                  >
                    Liked
                  </button>

                  <button
                    onClick={() => setActivityFilter("reposted")}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      activityFilter === "reposted"
                        ? "bg-[#FF6A00] text-white shadow-[0_0_20px_rgba(255,106,0,0.25)]"
                        : "border border-white/10 bg-black/20 text-gray-200"
                    }`}
                  >
                    Reposted
                  </button>

                  <button
                    onClick={() => setActivityFilter("commented")}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      activityFilter === "commented"
                        ? "bg-[#FF6A00] text-white shadow-[0_0_20px_rgba(255,106,0,0.25)]"
                        : "border border-white/10 bg-black/20 text-gray-200"
                    }`}
                  >
                    Commented
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-5">
              {filteredPosts.length === 0 ? (
                <div className="rounded-[28px] border border-[#FF6A00]/10 bg-gradient-to-br from-[#23232a]/95 via-[#1F1F23]/94 to-[#18181d]/94 p-10 text-center text-gray-300 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
                  No posts found for this section.
                </div>
              ) : (
                filteredPosts.map((post) => {
                  const owner = isAuthor(post);
                  const resharedByMe = isResharedByMe(post);

                  const pinnedComment = post.comments.find(
                    (comment) => comment.id === post.pinnedCommentId
                  );
                  const normalComments = post.comments.filter(
                    (comment) => comment.id !== post.pinnedCommentId
                  );

                  return (
                    <div
                      key={post.id}
                      className="rounded-[28px] border border-[#FF6A00]/10 bg-gradient-to-br from-[#23232a]/95 via-[#1F1F23]/94 to-[#18181d]/94 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_46px_rgba(0,0,0,0.42)]"
                    >
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {post.authorName}
                          </h3>

                          <p className="text-sm text-gray-400">
                            {[post.authorItNumber, formatDateTime(post.createdAt)]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>

                          {activityFilter === "reposted" &&
                            resharedByMe &&
                            !owner &&
                            panelFilter === "activity" && (
                              <span className="mt-2 inline-block rounded-full border border-[#FF6A00]/20 bg-[#FF6A00]/10 px-3 py-1 text-xs font-semibold text-[#FFB066]">
                                Reposted by you
                              </span>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {!post.commentsEnabled && (
                            <span className="rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1 text-xs font-semibold text-red-300">
                              Comments closed
                            </span>
                          )}

                          {owner && (
                            <>
                              <button
                                onClick={() => handleToggleCommentSection(post.id, owner)}
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  post.commentsEnabled
                                    ? "border border-yellow-400/20 bg-yellow-400/10 text-yellow-300"
                                    : "border border-green-400/20 bg-green-400/10 text-green-300"
                                }`}
                              >
                                {post.commentsEnabled ? "Close comments" : "Open comments"}
                              </button>

                              <button
                                onClick={() => handleDeletePost(post.id, owner)}
                                className="rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1 text-xs font-semibold text-red-300"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      <p className="whitespace-pre-wrap text-[16px] leading-7 text-gray-100">
                        {post.content}
                      </p>

                      {post.attachments.length > 0 && (
                        <div
                          className={`mt-5 grid gap-3 ${
                            post.attachments.length > 1 ? "grid-cols-2" : "grid-cols-1"
                          }`}
                        >
                          {post.attachments.map((file) => {
                            const isImage = file?.type?.startsWith("image/");
                            const isVideo = file?.type?.startsWith("video/");

                            return (
                              <div
                                key={file.id || file.url}
                                className="overflow-hidden rounded-[22px] border border-white/10 bg-black/20"
                              >
                                {isImage && (
                                  <img
                                    src={file.url}
                                    alt={file.name || "attachment"}
                                    className="h-[320px] w-full object-cover"
                                  />
                                )}

                                {isVideo && (
                                  <video
                                    src={file.url}
                                    controls
                                    className="h-[320px] w-full object-cover"
                                  />
                                )}

                                {!isImage && !isVideo && (
                                  <div className="p-4 text-sm text-gray-300">
                                    {file.name || "Attachment"}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`rounded-full border px-4 py-2 text-sm transition ${
                            isLikedByMe(post)
                              ? "border-[#FF6A00]/40 bg-[#FF6A00]/10 text-[#FFB066]"
                              : "border-white/10 bg-black/20 text-gray-200 hover:border-[#FF6A00]/40 hover:text-white"
                          }`}
                        >
                          ♥ {post.likes.length}
                        </button>

                        <button
                          onClick={() => toggleCommentsPanel(post.id)}
                          className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-gray-200 transition hover:border-[#FF6A00]/40 hover:text-white"
                        >
                          💬 {post.comments.length}
                        </button>

                        <button
                          onClick={() => handleReshare(post.id)}
                          className={`rounded-full border px-4 py-2 text-sm transition ${
                            resharedByMe
                              ? "border-[#FF6A00]/40 bg-[#FF6A00]/10 text-[#FFB066]"
                              : "border-white/10 bg-black/20 text-gray-200 hover:border-[#FF6A00]/40 hover:text-white"
                          }`}
                        >
                          🔁 {post.reshares.length}
                        </button>
                      </div>

                      {openComments[post.id] && (
                        <div className="mt-5 rounded-[24px] border border-white/10 bg-black/20 p-4">
                          {pinnedComment && (
                            <div className="mb-4 rounded-[18px] border border-[#FF6A00]/25 bg-[#FF6A00]/10 p-4">
                              <div className="mb-2 flex items-center justify-between gap-3">
                                <div>
                                  <p className="font-semibold text-white">
                                    {pinnedComment.authorName}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {formatDateTime(pinnedComment.createdAt)}
                                  </p>
                                </div>
                                <span className="rounded-full bg-[#FF6A00] px-3 py-1 text-xs font-semibold text-white">
                                  Pinned answer
                                </span>
                              </div>
                              <p className="text-gray-100">{pinnedComment.content}</p>
                            </div>
                          )}

                          {normalComments.length > 0 ? (
                            <div className="space-y-3">
                              {normalComments.map((comment) => (
                                <div
                                  key={comment.id}
                                  className="rounded-[18px] border border-white/10 bg-[#1A1A20] p-4"
                                >
                                  <div className="mb-2 flex items-center justify-between gap-3">
                                    <div>
                                      <p className="font-medium text-white">
                                        {comment.authorName}
                                      </p>
                                      <p className="text-xs text-gray-400">
                                        {formatDateTime(comment.createdAt)}
                                      </p>
                                    </div>

                                    {owner && (
                                      <button
                                        onClick={() =>
                                          handlePinComment(post.id, comment.id, owner)
                                        }
                                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-200 transition hover:border-[#FF6A00]/40 hover:text-[#FF6A00]"
                                      >
                                        Pin
                                      </button>
                                    )}
                                  </div>

                                  <p className="text-gray-100">{comment.content}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-400">No comments yet.</p>
                          )}

                          {post.commentsEnabled && (
                            <div className="mt-4">
                              <textarea
                                value={commentInputs[post.id] || ""}
                                onChange={(e) =>
                                  handleCommentInput(post.id, e.target.value)
                                }
                                placeholder="Write a comment..."
                                rows={3}
                                className="w-full rounded-[18px] border border-white/10 bg-[#0A0A0C]/95 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-[#FF6A00]"
                              />

                              <div className="mt-3 flex justify-end">
                                <button
                                  onClick={() => handleAddComment(post.id)}
                                  className="rounded-full bg-[#FF6A00] px-5 py-2.5 font-semibold text-white"
                                >
                                  Comment
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </main>

          <aside className="space-y-5">
            <div className="rounded-[28px] border border-[#FF6A00]/10 bg-gradient-to-br from-[#15151a]/94 via-[#111115]/94 to-[#0f0f13]/94 p-5 shadow-[0_12px_36px_rgba(0,0,0,0.36)]">
              <div className="rounded-[22px] border border-white/10 bg-[#0A0A0C]/95 px-4 py-3">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search StudySync discussion"
                  className="w-full bg-transparent text-white outline-none placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="rounded-[28px] border border-[#FF6A00]/10 bg-gradient-to-br from-[#15151a]/94 via-[#111115]/94 to-[#0f0f13]/94 p-6 shadow-[0_12px_36px_rgba(0,0,0,0.36)]">
              <div className="mb-5 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF6A00] text-xl font-bold shadow-[0_0_22px_rgba(255,106,0,0.35)]">
                  S
                </div>
                <h4 className="text-2xl font-bold">StudySync Feed</h4>
                <p className="mt-2 text-gray-300">
                  A modern discussion space for students.
                </p>
              </div>

              <button
                className="mb-3 w-full rounded-2xl bg-[#FF6A00] px-4 py-3 font-semibold text-white"
                onClick={() => {
                  setPanelFilter("home");
                  setSearch("");
                  setTab("all");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Open Board
              </button>

              <button
                className="w-full rounded-2xl bg-white/10 px-4 py-3 font-semibold text-gray-100"
                onClick={() => {
                  setPanelFilter("activity");
                  setActivityFilter("liked");
                }}
              >
                View Activity
              </button>
            </div>

            <div className="rounded-[28px] border border-[#FF6A00]/10 bg-gradient-to-br from-[#15151a]/94 via-[#111115]/94 to-[#0f0f13]/94 p-6 shadow-[0_12px_36px_rgba(0,0,0,0.36)]">
              <h4 className="mb-4 text-2xl font-bold">Suggested people</h4>

              <div className="space-y-4">
                {suggestedPeople.length === 0 ? (
                  <p className="text-gray-300">No suggestions yet.</p>
                ) : (
                  suggestedPeople.map((person) => (
                    <div
                      key={person.id}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-white">
                          {person.name}
                        </p>
                        <p className="text-sm text-gray-300">
                          {[person.itNumber, `${person.followers} followers`]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}