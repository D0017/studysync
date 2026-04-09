const POSTS_KEY = "studysync_discussion_posts";
const FOLLOWS_KEY = "studysync_discussion_follows";

const getStoredPosts = () => {
  try {
    return JSON.parse(localStorage.getItem(POSTS_KEY)) || [];
  } catch {
    return [];
  }
};

const savePosts = (posts) => {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
};

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

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve({
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type,
        url: reader.result,
      });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const normalizeUser = (user) => {
  if (!user) {
    return {
      id: "guest",
      name: "Guest User",
      role: "GUEST",
    };
  }

  return {
    id: user.email || user.id || user.username || user.fullName || crypto.randomUUID(),
    name: user.fullName || user.name || "StudySync User",
    role: user.role || "STUDENT",
  };
};

const createPost = async ({ content, files }) => {
  const rawUser = getCurrentUser();
  const user = normalizeUser(rawUser);

  const attachments = await Promise.all((files || []).map(fileToDataUrl));

  const newPost = {
    id: crypto.randomUUID(),
    authorId: user.id,
    authorName: user.name,
    authorRole: user.role,
    content: content.trim(),
    attachments,
    commentsEnabled: true,
    pinnedCommentId: null,
    likes: [],
    reshares: [],
    comments: [],
    createdAt: new Date().toISOString(),
  };

  const posts = getStoredPosts();
  posts.unshift(newPost);
  savePosts(posts);

  return newPost;
};

const getAllPosts = () => {
  const posts = getStoredPosts();
  return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const updatePost = (updatedPost) => {
  const posts = getStoredPosts().map((post) =>
    post.id === updatedPost.id ? updatedPost : post
  );
  savePosts(posts);
  return updatedPost;
};

const toggleLike = (postId) => {
  const user = normalizeUser(getCurrentUser());
  const posts = getStoredPosts();

  const updated = posts.map((post) => {
    if (post.id !== postId) return post;

    const alreadyLiked = post.likes.includes(user.id);
    return {
      ...post,
      likes: alreadyLiked
        ? post.likes.filter((id) => id !== user.id)
        : [...post.likes, user.id],
    };
  });

  savePosts(updated);
  return getAllPosts();
};

const toggleReshare = (postId) => {
  const user = normalizeUser(getCurrentUser());
  const posts = getStoredPosts();

  const updated = posts.map((post) => {
    if (post.id !== postId) return post;

    const alreadyReshared = post.reshares.includes(user.id);
    return {
      ...post,
      reshares: alreadyReshared
        ? post.reshares.filter((id) => id !== user.id)
        : [...post.reshares, user.id],
    };
  });

  savePosts(updated);
  return getAllPosts();
};

const addComment = (postId, content) => {
  const user = normalizeUser(getCurrentUser());
  const posts = getStoredPosts();

  const updated = posts.map((post) => {
    if (post.id !== postId) return post;
    if (!post.commentsEnabled) return post;

    const newComment = {
      id: crypto.randomUUID(),
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    return {
      ...post,
      comments: [...post.comments, newComment],
    };
  });

  savePosts(updated);
  return getAllPosts();
};

const toggleComments = (postId) => {
  const user = normalizeUser(getCurrentUser());
  const posts = getStoredPosts();

  const updated = posts.map((post) => {
    if (post.id !== postId) return post;
    if (post.authorId !== user.id) return post;

    return {
      ...post,
      commentsEnabled: !post.commentsEnabled,
    };
  });

  savePosts(updated);
  return getAllPosts();
};

const pinComment = (postId, commentId) => {
  const user = normalizeUser(getCurrentUser());
  const posts = getStoredPosts();

  const updated = posts.map((post) => {
    if (post.id !== postId) return post;
    if (post.authorId !== user.id) return post;

    return {
      ...post,
      pinnedCommentId: post.pinnedCommentId === commentId ? null : commentId,
    };
  });

  savePosts(updated);
  return getAllPosts();
};

const deletePost = (postId) => {
  const user = normalizeUser(getCurrentUser());
  const posts = getStoredPosts();
  const filtered = posts.filter(
    (post) => !(post.id === postId && post.authorId === user.id)
  );
  savePosts(filtered);
  return getAllPosts();
};

const toggleFollow = (followedUserId) => {
  const user = normalizeUser(getCurrentUser());
  const follows = getStoredFollows();

  const key = `${user.id}__${followedUserId}`;
  const exists = follows.includes(key);

  const updated = exists
    ? follows.filter((item) => item !== key)
    : [...follows, key];

  saveFollows(updated);
  return updated;
};

const isFollowing = (followedUserId) => {
  const user = normalizeUser(getCurrentUser());
  const follows = getStoredFollows();
  return follows.includes(`${user.id}__${followedUserId}`);
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