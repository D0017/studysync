const API_BASE = "http://localhost:8090/api/discussions";
const FOLLOWS_KEY = "studysync_discussion_follows";

const getStoredFollows = () => {
  try {
    return JSON.parse(localStorage.getItem(FOLLOWS_KEY)) || [];
  } catch {
    return [];
  }
};

const saveFollows = (follows) => {
  localStorage.setItem(FOLLOWS_KEY, JSON.stringify(follows));
};

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};

const getCurrentUserId = () => {
  const user = getCurrentUser();
  const rawId = user?.id;

  if (rawId === undefined || rawId === null || rawId === "") {
    throw new Error("Current user id is missing from localStorage user object.");
  }

  return Number(rawId);
};

const getCurrentUserIdentity = () => {
  const user = getCurrentUser();

  return String(
    user?.id ??
      user?.email ??
      user?.username ??
      user?.fullName ??
      "guest"
  );
};

const request = async (url, options = {}) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
};

const buildReactionArray = (count, active, currentUserIdentity, prefix) => {
  const safeCount = Number(count) || 0;
  const list = [];

  if (active && safeCount > 0) {
    list.push(String(currentUserIdentity));
  }

  while (list.length < safeCount) {
    list.push(`${prefix}-${list.length}`);
  }

  return list;
};

const mapAttachment = (attachment) => ({
  id: String(attachment.id),
  name: attachment.fileName || "Attachment",
  type: attachment.contentType || "application/octet-stream",
  url:
    attachment.downloadUrl ||
    `${API_BASE}/attachments/${attachment.id}/download`,
});

const mapComment = (comment) => ({
  id: String(comment?.id ?? crypto.randomUUID()),
  authorId: String(comment?.author?.id ?? ""),
  authorName: comment?.author?.fullName || "StudySync User",
  authorRole: comment?.author?.role || "STUDENT",
  authorItNumber: comment?.author?.universityId || "",
  content: comment?.content || "",
  createdAt: comment?.createdAt || new Date().toISOString(),
  pinned: Boolean(comment?.pinned),
});

const getAttachmentsByPost = async (postId) => {
  const data = await request(`${API_BASE}/posts/${postId}/attachments`);
  return Array.isArray(data) ? data.map(mapAttachment) : [];
};

const getCommentsByPost = async (postId) => {
  const data = await request(`${API_BASE}/posts/${postId}/comments`);
  return Array.isArray(data) ? data.map(mapComment) : [];
};

const getLikeCount = async (postId) => {
  const count = await request(`${API_BASE}/posts/${postId}/likes/count`);
  return Number(count) || 0;
};

const hasUserLiked = async (postId) => {
  const userId = getCurrentUserId();
  return request(`${API_BASE}/posts/${postId}/likes/check?userId=${userId}`);
};

const getReshareCount = async (postId) => {
  const count = await request(`${API_BASE}/posts/${postId}/reshares/count`);
  return Number(count) || 0;
};

const hasUserReshared = async (postId) => {
  const userId = getCurrentUserId();
  return request(`${API_BASE}/posts/${postId}/reshares/check?userId=${userId}`);
};

const createPost = async ({ content, files }) => {
  const formData = new FormData();
  formData.append("content", content.trim());
  formData.append("userId", String(getCurrentUserId()));

  (files || []).forEach((file) => {
    formData.append("files", file);
  });

  return request(`${API_BASE}/posts`, {
    method: "POST",
    body: formData,
  });
};

const getAllPosts = async () => {
  const rawPosts = await request(`${API_BASE}/posts`);
  const currentUserIdentity = getCurrentUserIdentity();

  const normalizedPosts = await Promise.all(
    (Array.isArray(rawPosts) ? rawPosts : []).map(async (post) => {
      const [attachments, comments, likeCount, likedByMe, reshareCount, resharedByMe] =
        await Promise.all([
          getAttachmentsByPost(post.id),
          getCommentsByPost(post.id),
          getLikeCount(post.id),
          hasUserLiked(post.id),
          getReshareCount(post.id),
          hasUserReshared(post.id),
        ]);

      const pinnedComment = comments.find((comment) => comment.pinned);

      return {
        id: String(post?.id),
        authorId: String(post?.author?.id ?? ""),
        authorName: post?.author?.fullName || "StudySync User",
        authorRole: post?.author?.role || "STUDENT",
        authorItNumber: post?.author?.universityId || "",
        content: post?.content || "",
        attachments,
        commentsEnabled:
          typeof post?.commentsEnabled === "boolean"
            ? post.commentsEnabled
            : true,
        pinnedCommentId: pinnedComment?.id || null,
        likes: buildReactionArray(
          likeCount,
          Boolean(likedByMe),
          currentUserIdentity,
          `like-${post?.id}`
        ),
        reshares: buildReactionArray(
          reshareCount,
          Boolean(resharedByMe),
          currentUserIdentity,
          `reshare-${post?.id}`
        ),
        comments,
        createdAt: post?.createdAt || new Date().toISOString(),
      };
    })
  );

  return normalizedPosts.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
};

const toggleLike = async (postId) => {
  const userId = getCurrentUserId();
  const liked = await hasUserLiked(postId);

  if (liked) {
    return request(`${API_BASE}/posts/${postId}/like?userId=${userId}`, {
      method: "DELETE",
    });
  }

  return request(`${API_BASE}/posts/${postId}/like?userId=${userId}`, {
    method: "POST",
  });
};

const toggleReshare = async (postId) => {
  const userId = getCurrentUserId();
  const reshared = await hasUserReshared(postId);

  if (reshared) {
    return request(`${API_BASE}/posts/${postId}/reshare?userId=${userId}`, {
      method: "DELETE",
    });
  }

  return request(`${API_BASE}/posts/${postId}/reshare?userId=${userId}`, {
    method: "POST",
  });
};

const addComment = async (postId, content) => {
  const formData = new FormData();
  formData.append("userId", String(getCurrentUserId()));
  formData.append("content", content.trim());

  return request(`${API_BASE}/posts/${postId}/comments`, {
    method: "POST",
    body: formData,
  });
};

const toggleComments = async (postId) => {
  return request(`${API_BASE}/posts/${postId}/toggle-comments`, {
    method: "PUT",
  });
};

const pinComment = async (_postId, commentId) => {
  return request(`${API_BASE}/comments/${commentId}/pin`, {
    method: "PUT",
  });
};

const deletePost = async (postId) => {
  return request(`${API_BASE}/posts/${postId}`, {
    method: "DELETE",
  });
};

const toggleFollow = (followedUserId) => {
  const currentUserIdentity = getCurrentUserIdentity();
  const follows = getStoredFollows();

  const key = `${currentUserIdentity}__${followedUserId}`;
  const exists = follows.includes(key);

  const updated = exists
    ? follows.filter((item) => item !== key)
    : [...follows, key];

  saveFollows(updated);
  return updated;
};

const isFollowing = (followedUserId) => {
  const currentUserIdentity = getCurrentUserIdentity();
  const follows = getStoredFollows();
  return follows.includes(`${currentUserIdentity}__${followedUserId}`);
};

const getFollowedCountForUser = (followedUserId) => {
  const follows = getStoredFollows();
  return follows.filter((item) => item.endsWith(`__${followedUserId}`)).length;
};

export default {
  createPost,
  getAllPosts,
  toggleLike,
  toggleReshare,
  addComment,
  toggleComments,
  pinComment,
  deletePost,
  toggleFollow,
  isFollowing,
  getFollowedCountForUser,
  getCurrentUser,
};