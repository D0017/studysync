package com.StudySync.backend.controller;

import com.StudySync.backend.model.DiscussionAttachment;
import com.StudySync.backend.model.DiscussionPost;
import com.StudySync.backend.service.DiscussionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/discussions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class DiscussionController {

    private final DiscussionService discussionService;

    @PostMapping(value = "/posts", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DiscussionPost> createPost(
            @RequestParam("content") String content,
            @RequestParam("userId") Long userId,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) throws IOException {
        DiscussionPost savedPost = discussionService.createPost(content, userId, file);
        return ResponseEntity.ok(savedPost);
    }

    @GetMapping("/posts")
    public ResponseEntity<List<DiscussionPost>> getAllPosts() {
        return ResponseEntity.ok(discussionService.getAllPosts());
    }

    @GetMapping("/posts/{postId}/attachment")
    public ResponseEntity<byte[]> downloadAttachment(@PathVariable Long postId) {
        DiscussionAttachment attachment = discussionService.getAttachmentByPostId(postId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + attachment.getFileName() + "\"")
                .contentType(MediaType.parseMediaType(attachment.getContentType()))
                .body(attachment.getData());
    }

    @PutMapping("/posts/{postId}")
    public ResponseEntity<DiscussionPost> updatePost(
            @PathVariable Long postId,
            @RequestParam("content") String content
    ) {
        return ResponseEntity.ok(discussionService.updatePost(postId, content));
    }

    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<String> deletePost(@PathVariable Long postId) {
        discussionService.deletePost(postId);
        return ResponseEntity.ok("Post deleted successfully");
    }

    @PostMapping("/posts/{postId}/like")
    public ResponseEntity<String> likePost(
            @PathVariable Long postId,
            @RequestParam("userId") Long userId
    ) {
        return ResponseEntity.ok(discussionService.likePost(postId, userId));
    }

    @DeleteMapping("/posts/{postId}/like")
    public ResponseEntity<String> unlikePost(
            @PathVariable Long postId,
            @RequestParam("userId") Long userId
    ) {
        return ResponseEntity.ok(discussionService.unlikePost(postId, userId));
    }

    @GetMapping("/posts/{postId}/likes/count")
    public ResponseEntity<Long> getLikeCount(@PathVariable Long postId) {
        return ResponseEntity.ok(discussionService.getLikeCount(postId));
    }
}