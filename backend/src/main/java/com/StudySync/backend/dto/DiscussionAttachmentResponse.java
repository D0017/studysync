package com.StudySync.backend.dto;

public record DiscussionAttachmentResponse(
        Long id,
        String fileName,
        String contentType,
        Long fileSize,
        String downloadUrl
) {
}