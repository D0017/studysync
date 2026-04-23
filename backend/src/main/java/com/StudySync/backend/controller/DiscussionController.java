package com.StudySync.backend.controller;

import com.StudySync.backend.dto.DiscussionAttachmentResponse;
import com.StudySync.backend.model.DiscussionAttachment;
import com.StudySync.backend.model.DiscussionComment;
import com.StudySync.backend.model.DiscussionPost;
import com.StudySync.backend.service.DiscussionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/discussions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class DiscussionController {

    private final DiscussionService discussionService;

    // CREATE POST
    @PostMapping(value = "/posts", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DiscussionPost> createPost(
            @RequestParam("content") String content,
            @RequestParam("userId") Long userId,
            @RequestParam(value = "files", required = false) MultipartFile[] files
    ) throws IOException {
        DiscussionPost savedPost = discussionService.createPost(content, userId, files);
        return ResponseEntity.ok(savedPost);
    }

    // GET ALL POSTS
    @GetMapping("/posts")
    public ResponseEntity<List<DiscussionPost>> getAllPosts() {
        return ResponseEntity.ok(discussionService.getAllPosts());
    }

    // GET ATTACHMENTS OF POST
    @GetMapping("/posts/{postId}/attachments")
    public ResponseEntity<List<DiscussionAttachmentResponse>> getAttachments(@PathVariable Long postId) {
        List<DiscussionAttachmentResponse> response = discussionService.getAttachmentsByPostId(postId)
                .stream()
                .map(attachment -> new DiscussionAttachmentResponse(
                        attachment.getId(),
                        attachment.getFileName(),
                        attachment.getContentType(),
                        attachment.getFileSize(),
                        ServletUriComponentsBuilder.fromCurrentContextPath()
                                .path("/api/discussions/attachments/")
                                .path(String.valueOf(attachment.getId()))
                                .path("/download")
                                .toUriString()
                ))
                .toList();

        return ResponseEntity.ok(response);
    }

    // DOWNLOAD ATTACHMENT
    @GetMapping("/attachments/{attachmentId}/download")
    public ResponseEntity<byte[]> downloadAttachment(@PathVariable Long attachmentId) {
        DiscussionAttachment attachment = discussionService.getAttachmentById(attachmentId);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + attachment.getFileName() + "\""
                )
                .contentType(MediaType.parseMediaType(attachment.getContentType()))
                .body(attachment.getData());
    }

    // UPDATE POST
    @PutMapping("/posts/{postId}")
    public ResponseEntity<DiscussionPost> updatePost(
            @PathVariable Long postId,
            @RequestParam("content") String content
    ) {
        return ResponseEntity.ok(discussionService.updatePost(postId, content));
    }

    // DELETE POST
    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<String> deletePost(@PathVariable Long postId) {
        discussionService.deletePost(postId);
        return ResponseEntity.ok("Post deleted successfully");
    }

    // LIKE POST
    @PostMapping("/posts/{postId}/like")
    public ResponseEntity<String> likePost(
            @PathVariable Long postId,
            @RequestParam("userId") Long userId
    ) {
        return ResponseEntity.ok(discussionService.likePost(postId, userId));
    }

    // UNLIKE POST
    @DeleteMapping("/posts/{postId}/like")
    public ResponseEntity<String> unlikePost(
            @PathVariable Long postId,
            @RequestParam("userId") Long userId
    ) {
        return ResponseEntity.ok(discussionService.unlikePost(postId, userId));
    }

    // GET LIKE COUNT
    @GetMapping("/posts/{postId}/likes/count")
    public ResponseEntity<Long> getLikeCount(@PathVariable Long postId) {
        return ResponseEntity.ok(discussionService.getLikeCount(postId));
    }

    // CHECK IF USER LIKED
    @GetMapping("/posts/{postId}/likes/check")
    public ResponseEntity<Boolean> hasUserLiked(
            @PathVariable Long postId,
            @RequestParam("userId") Long userId
    ) {
        return ResponseEntity.ok(discussionService.hasUserLiked(postId, userId));
    }

    // RESHARE POST
    @PostMapping("/posts/{postId}/reshare")
    public ResponseEntity<String> resharePost(
            @PathVariable Long postId,
            @RequestParam("userId") Long userId
    ) {
        return ResponseEntity.ok(discussionService.resharePost(postId, userId));
    }

    // UNRESHARE POST
    @DeleteMapping("/posts/{postId}/reshare")
    public ResponseEntity<String> unresharePost(
            @PathVariable Long postId,
            @RequestParam("userId") Long userId
    ) {
        return ResponseEntity.ok(discussionService.unresharePost(postId, userId));
    }

    // GET RESHARE COUNT
    @GetMapping("/posts/{postId}/reshares/count")
    public ResponseEntity<Long> getReshareCount(@PathVariable Long postId) {
        return ResponseEntity.ok(discussionService.getReshareCount(postId));
    }

    // CHECK IF USER RESHARED
    @GetMapping("/posts/{postId}/reshares/check")
    public ResponseEntity<Boolean> hasUserReshared(
            @PathVariable Long postId,
            @RequestParam("userId") Long userId
    ) {
        return ResponseEntity.ok(discussionService.hasUserReshared(postId, userId));
    }

    // ADD COMMENT
    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<DiscussionComment> addComment(
            @PathVariable Long postId,
            @RequestParam("userId") Long userId,
            @RequestParam("content") String content
    ) {
        return ResponseEntity.ok(
                discussionService.addComment(postId, userId, content)
        );
    }

    // GET COMMENTS OF POST
    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<List<DiscussionComment>> getCommentsByPost(
            @PathVariable Long postId
    ) {
        return ResponseEntity.ok(
                discussionService.getCommentsByPost(postId)
        );
    }

    // GET COMMENT COUNT
    @GetMapping("/posts/{postId}/comments/count")
    public ResponseEntity<Long> getCommentCount(
            @PathVariable Long postId
    ) {
        return ResponseEntity.ok(
                discussionService.getCommentCount(postId)
        );
    }

    // TOGGLE COMMENTS
    @PutMapping("/posts/{postId}/toggle-comments")
    public ResponseEntity<DiscussionPost> toggleComments(@PathVariable Long postId) {
        return ResponseEntity.ok(discussionService.toggleComments(postId));
    }

    // PIN COMMENT
    @PutMapping("/comments/{commentId}/pin")
    public ResponseEntity<DiscussionComment> pinComment(@PathVariable Long commentId) {
        return ResponseEntity.ok(discussionService.pinComment(commentId));
    }
}