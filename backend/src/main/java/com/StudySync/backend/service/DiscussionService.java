package com.StudySync.backend.service;

import com.StudySync.backend.model.DiscussionAttachment;
import com.StudySync.backend.model.DiscussionComment;
import com.StudySync.backend.model.DiscussionLike;
import com.StudySync.backend.model.DiscussionPost;
import com.StudySync.backend.model.DiscussionReshare;
import com.StudySync.backend.model.User;
import com.StudySync.backend.repository.DiscussionAttachmentRepository;
import com.StudySync.backend.repository.DiscussionCommentRepository;
import com.StudySync.backend.repository.DiscussionLikeRepository;
import com.StudySync.backend.repository.DiscussionPostRepository;
import com.StudySync.backend.repository.DiscussionReshareRepository;
import com.StudySync.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DiscussionService {

    private final DiscussionPostRepository postRepository;
    private final DiscussionAttachmentRepository attachmentRepository;
    private final UserRepository userRepository;
    private final DiscussionLikeRepository likeRepository;
    private final DiscussionCommentRepository commentRepository;
    private final DiscussionReshareRepository reshareRepository;

    // CREATE POST
    public DiscussionPost createPost(String content, Long userId, MultipartFile[] files) throws IOException {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        DiscussionPost post = new DiscussionPost();
        post.setContent(content);
        post.setAuthor(user);

        DiscussionPost savedPost = postRepository.save(post);

        if (files != null) {
            for (MultipartFile file : files) {
                if (file != null && !file.isEmpty()) {
                    DiscussionAttachment attachment = new DiscussionAttachment();
                    attachment.setFileName(file.getOriginalFilename());
                    attachment.setContentType(file.getContentType());
                    attachment.setFileSize(file.getSize());
                    attachment.setData(file.getBytes());
                    attachment.setPost(savedPost);

                    attachmentRepository.save(attachment);
                }
            }
        }

        return savedPost;
    }

    // GET ALL POSTS
    public List<DiscussionPost> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    // GET ATTACHMENTS OF A POST
    public List<DiscussionAttachment> getAttachmentsByPostId(Long postId) {
        return attachmentRepository.findByPostIdOrderByIdAsc(postId);
    }

    // GET ATTACHMENT BY ID
    public DiscussionAttachment getAttachmentById(Long attachmentId) {
        return attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new RuntimeException("Attachment not found"));
    }

    // UPDATE POST
    public DiscussionPost updatePost(Long postId, String content) {

        DiscussionPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        post.setContent(content);

        return postRepository.save(post);
    }

    // DELETE POST
    public void deletePost(Long postId) {

        DiscussionPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        attachmentRepository.deleteByPost(post);
        likeRepository.deleteByPost(post);
        reshareRepository.deleteByPost(post);
        commentRepository.deleteByPost(post);

        postRepository.delete(post);
    }

    // LIKE POST
    public String likePost(Long postId, Long userId) {

        DiscussionPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean alreadyLiked = likeRepository.existsByPostAndUser(post, user);

        if (alreadyLiked) {
            return "User already liked this post";
        }

        DiscussionLike like = new DiscussionLike();
        like.setPost(post);
        like.setUser(user);

        likeRepository.save(like);

        return "Post liked successfully";
    }

    // UNLIKE POST
    public String unlikePost(Long postId, Long userId) {

        DiscussionPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        DiscussionLike like = likeRepository.findByPostAndUser(post, user)
                .orElseThrow(() -> new RuntimeException("Like not found"));

        likeRepository.delete(like);

        return "Post unliked successfully";
    }

    // GET LIKE COUNT
    public long getLikeCount(Long postId) {

        DiscussionPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        return likeRepository.countByPost(post);
    }

    // CHECK IF USER LIKED
    public boolean hasUserLiked(Long postId, Long userId) {
        DiscussionPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return likeRepository.existsByPostAndUser(post, user);
    }

    // RESHARE POST
    public String resharePost(Long postId, Long userId) {

        DiscussionPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean alreadyReshared = reshareRepository.existsByPostAndUser(post, user);

        if (alreadyReshared) {
            return "User already reshared this post";
        }

        DiscussionReshare reshare = new DiscussionReshare();
        reshare.setPost(post);
        reshare.setUser(user);

        reshareRepository.save(reshare);

        return "Post reshared successfully";
    }

    // UNRESHARE POST
    public String unresharePost(Long postId, Long userId) {

        DiscussionPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        DiscussionReshare reshare = reshareRepository.findByPostAndUser(post, user)
                .orElseThrow(() -> new RuntimeException("Reshare not found"));

        reshareRepository.delete(reshare);

        return "Post unreshared successfully";
    }

    // GET RESHARE COUNT
    public long getReshareCount(Long postId) {

        DiscussionPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        return reshareRepository.countByPost(post);
    }

    // CHECK IF USER RESHARED
    public boolean hasUserReshared(Long postId, Long userId) {
        DiscussionPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return reshareRepository.existsByPostAndUser(post, user);
    }

    // ADD COMMENT
    public DiscussionComment addComment(Long postId, Long userId, String content) {

        DiscussionPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.isCommentsEnabled()) {
            throw new RuntimeException("Comments are closed for this post");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        DiscussionComment comment = new DiscussionComment();
        comment.setContent(content);
        comment.setPost(post);
        comment.setAuthor(user);

        return commentRepository.save(comment);
    }

    // GET COMMENTS OF A POST
    public List<DiscussionComment> getCommentsByPost(Long postId) {

        DiscussionPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        return commentRepository.findByPostOrderByPinnedDescCreatedAtAsc(post);
    }

    // GET COMMENT COUNT
    public long getCommentCount(Long postId) {

        DiscussionPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        return commentRepository.countByPost(post);
    }

    // TOGGLE COMMENTS
    public DiscussionPost toggleComments(Long postId) {

        DiscussionPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        post.setCommentsEnabled(!post.isCommentsEnabled());

        return postRepository.save(post);
    }

    // PIN COMMENT
    public DiscussionComment pinComment(Long commentId) {

        DiscussionComment selectedComment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        DiscussionPost post = selectedComment.getPost();

        List<DiscussionComment> comments = commentRepository.findByPostOrderByPinnedDescCreatedAtAsc(post);

        for (DiscussionComment comment : comments) {
            if (comment.isPinned()) {
                comment.setPinned(false);
                commentRepository.save(comment);
            }
        }

        selectedComment.setPinned(true);
        return commentRepository.save(selectedComment);
    }
}