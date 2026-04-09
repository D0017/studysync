import { useMemo, useState } from "react";
import discussionService from "./discussionService";

function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString();
}

export default function PostCard({ post, refreshPosts }) {
  const storedUser = discussionService.getCurrentUser();
  const currentUserId =
    storedUser?.email ||
    storedUser?.id ||
    storedUser?.username ||
    storedUser?.fullName ||
    "guest";

  const isStudent = storedUser?.role === "STUDENT";
  const isAuthor = currentUserId === post.authorId;

  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  const following = discussionService.isFollowing(post.authorId);

  const pinnedComment = useMemo(
    () => post.comments.find((c) => c.id === post.pinnedCommentId),
    [post.comments, post.pinnedCommentId]
  );

  const otherComments = useMemo(
    () => post.comments.filter((c) => c.id !== post.pinnedCommentId),
    [post.comments, post.pinnedCommentId]
  );

  const handleLike = () => {
    discussionService.toggleLike(post.id);
    refreshPosts();
  };

  const handleReshare = () => {
    discussionService.toggleReshare(post.id);
    refreshPosts();
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    discussionService.addComment(post.id, commentText);
    setCommentText("");
    refreshPosts();
    setShowComments(true);
  };

  const handleToggleComments = () => {
    discussionService.toggleComments(post.id);
    refreshPosts();
  };

  const handlePinComment = (commentId) => {
    discussionService.pinComment(post.id, commentId);
    refreshPosts();
  };

  const handleFollow = () => {
    discussionService.toggleFollow(post.authorId);
    refreshPosts();
  };

  const handleDelete = () => {
    const ok = window.confirm("Are you sure you want to delete this post?");
    if (!ok) return;
    discussionService.deletePost(post.id);
    refreshPosts();
  };

  return (
    <article className="rounded-[28px] border border-white/10 bg-[#1F1F23] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.28)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF6A00] text-sm font-bold text-white">
            {post.authorName?.slice(0, 1)?.toUpperCase() || "S"}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-white">{post.authorName}</h3>
              <span className="rounded-full border border-[#FF6A00]/30 bg-[#FF6A00]/10 px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-[#FF6A00]">
                {post.authorRole}
              </span>
              <span className="text-sm text-gray-400">{formatTime(post.createdAt)}</span>
            </div>

            <p className="mt-3 whitespace-pre-wrap text-[17px] leading-8 text-[#F4F4F6]">
              {post.content}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isAuthor && isStudent && (
            <button
              onClick={handleFollow}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                following
                  ? "border border-white/15 bg-white/5 text-gray-200"
                  : "bg-[#FF6A00] text-white hover:opacity-90"
              }`}
            >
              {following ? "Subscribed" : "Subscribe"}
            </button>
          )}

          {isAuthor && (
            <button
              onClick={handleDelete}
              className="rounded-full border border-red-400/30 bg-red-400/10 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-400/20"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {post.attachments?.length > 0 && (
        <div className={`mt-5 grid gap-3 ${post.attachments.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
          {post.attachments.map((file) => {
            const isImage = file.type?.startsWith("image/");
            const isVideo = file.type?.startsWith("video/");

            return (
              <div
                key={file.id}
                className="overflow-hidden rounded-[24px] border border-white/10 bg-black/30"
              >
                {isImage && (
                  <img
                    src={file.url}
                    alt={file.name}
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
                  <div className="flex min-h-[120px] items-center justify-center p-4 text-center text-sm text-gray-300">
                    {file.name}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/10 pt-4 text-sm text-gray-300">
        <button
          onClick={handleLike}
          className="rounded-full border border-white/10 bg-black/20 px-4 py-2 transition hover:border-[#FF6A00]/40 hover:text-[#FF6A00]"
        >
          ♥ {post.likes.length}
        </button>

        <button
          onClick={() => setShowComments((prev) => !prev)}
          className="rounded-full border border-white/10 bg-black/20 px-4 py-2 transition hover:border-[#FF6A00]/40 hover:text-[#FF6A00]"
        >
          💬 {post.comments.length}
        </button>

        <button
          onClick={handleReshare}
          className="rounded-full border border-white/10 bg-black/20 px-4 py-2 transition hover:border-[#FF6A00]/40 hover:text-[#FF6A00]"
        >
          🔁 {post.reshares.length}
        </button>

        {isAuthor && (
          <button
            onClick={handleToggleComments}
            className={`rounded-full px-4 py-2 font-medium transition ${
              post.commentsEnabled
                ? "border border-yellow-400/30 bg-yellow-400/10 text-yellow-300"
                : "border border-green-400/30 bg-green-400/10 text-green-300"
            }`}
          >
            {post.commentsEnabled ? "Close comments" : "Open comments"}
          </button>
        )}

        {!post.commentsEnabled && (
          <span className="rounded-full border border-red-400/20 bg-red-400/10 px-4 py-2 text-red-300">
            Comments are turned off
          </span>
        )}
      </div>

      {(showComments || pinnedComment) && (
        <div className="mt-6 rounded-[24px] border border-white/10 bg-black/20 p-4">
          {pinnedComment && (
            <div className="mb-4 rounded-[20px] border border-[#FF6A00]/30 bg-[#FF6A00]/10 p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{pinnedComment.authorName}</p>
                  <p className="text-xs text-gray-400">{formatTime(pinnedComment.createdAt)}</p>
                </div>
                <span className="rounded-full bg-[#FF6A00] px-3 py-1 text-xs font-semibold text-white">
                  Pinned answer
                </span>
              </div>
              <p className="text-[#F4F4F6]">{pinnedComment.content}</p>
            </div>
          )}

          {otherComments.length > 0 && (
            <div className="space-y-3">
              {otherComments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-[18px] border border-white/10 bg-[#1F1F23] p-4"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{comment.authorName}</p>
                      <p className="text-xs text-gray-400">
                        {formatTime(comment.createdAt)}
                      </p>
                    </div>

                    {isAuthor && (
                      <button
                        onClick={() => handlePinComment(comment.id)}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-200 transition hover:border-[#FF6A00]/40 hover:text-[#FF6A00]"
                      >
                        Pin
                      </button>
                    )}
                  </div>

                  <p className="text-[#F4F4F6]">{comment.content}</p>
                </div>
              ))}
            </div>
          )}

          {isStudent && post.commentsEnabled && (
            <form onSubmit={handleComment} className="mt-4">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a helpful comment..."
                rows={3}
                className="w-full rounded-[20px] border border-white/10 bg-[#0A0A0C] px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-[#FF6A00]"
              />
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  className="rounded-full bg-[#FF6A00] px-5 py-2.5 font-semibold text-white transition hover:opacity-90"
                >
                  Comment
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </article>
  );
}