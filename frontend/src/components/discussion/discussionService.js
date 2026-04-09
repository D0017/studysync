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
  try {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  } catch (error) {
    console.error("Failed to save posts:", error);
    throw new Error("Storage limit reached");
  }
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

const normalizeUser = (user) => {
  if (!user) {
    return {
      id: "guest",
      name: "Guest User",
      role: "GUEST",
      itNumber: "",
    };
  }

  return {
    id: user.email || user.id || user.username || user.fullName || crypto.randomUUID(),
    name: user.fullName || user.name || "StudySync User",
    role: user.role || "STUDENT",
    itNumber:
      user.itNumber ||
      user.studentId ||
      user.registrationNumber ||
      user.userId ||
      "",
  };
};

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    if (file.type.startsWith("image/")) {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (event) => {
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxWidth = 1200;
          const scale = Math.min(1, maxWidth / img.width);

          canvas.width = img.width * scale;
          canvas.height = img.height * scale;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const compressed = canvas.toDataURL("image/jpeg", 0.75);

          resolve({
            id: crypto.randomUUID(),
            name: file.name,
            type: "image/jpeg",
            url: compressed,
          });
        };

        img.onerror = reject;
        img.src = event.target.result;
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    } else {
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
    }
  });

const createPost = async ({ content, files, authorItNumber }) => {
  const rawUser = getCurrentUser();
  const user = normalizeUser(rawUser);

  const attachments = await Promise.all((files || []).map(fileToDataUrl));

  const newPost = {
    id: crypto.randomUUID(),
    authorId: user.id,
    authorName: user.name,
    authorRole: user.role,
    authorItNumber: authorItNumber || user.itNumber || "",
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

const toggleLike = (postId) => {
  const user = normalizeUser(getCurrentUser());
  const posts = getStoredPosts();

  const updated = posts.map((post) => {
    if (post.id !== postId) return post;

    const likes = Array.isArray(post.likes) ? post.likes : [];
    const alreadyLiked = likes.includes(user.id);

    return {
      ...post,
      likes: alreadyLiked
        ? likes.filter((id) => id !== user.id)
        : [...likes, user.id],
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

    const reshares = Array.isArray(post.reshares) ? post.reshares : [];
    const alreadyReshared = reshares.includes(user.id);

    return {
      ...post,
      reshares: alreadyReshared
        ? reshares.filter((id) => id !== user.id)
        : [...reshares, user.id],
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

    const comments = Array.isArray(post.comments) ? post.comments : [];

    const newComment = {
      id: crypto.randomUUID(),
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      authorItNumber: user.itNumber || "",
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    return {
      ...post,
      comments: [...comments, newComment],
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