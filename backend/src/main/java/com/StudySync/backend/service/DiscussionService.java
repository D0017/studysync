package com.StudySync.backend.service;

import com.StudySync.backend.model.DiscussionAttachment;
import com.StudySync.backend.model.DiscussionPost;
import com.StudySync.backend.model.User;
import com.StudySync.backend.repository.DiscussionAttachmentRepository;
import com.StudySync.backend.repository.DiscussionPostRepository;
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

    // CREATE POST
    public DiscussionPost createPost(String content, Long userId, MultipartFile file) throws IOException {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        DiscussionPost post = new DiscussionPost();
        post.setContent(content);
        post.setAuthor(user);

        DiscussionPost savedPost = postRepository.save(post);

        // If file exists → save attachment
        if (file != null && !file.isEmpty()) {
            DiscussionAttachment attachment = new DiscussionAttachment();
            attachment.setFileName(file.getOriginalFilename());
            attachment.setContentType(file.getContentType());
            attachment.setFileSize(file.getSize());
            attachment.setData(file.getBytes());
            attachment.setPost(savedPost);

            attachmentRepository.save(attachment);
        }

        return savedPost;
    }

    // GET ALL POSTS
    public List<DiscussionPost> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    // GET ATTACHMENT BY POST
    public DiscussionAttachment getAttachmentByPostId(Long postId) {

        DiscussionPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        return attachmentRepository.findByPost(post)
                .orElseThrow(() -> new RuntimeException("Attachment not found"));
    }
}