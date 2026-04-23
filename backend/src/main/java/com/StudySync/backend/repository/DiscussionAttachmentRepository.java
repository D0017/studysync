package com.StudySync.backend.repository;

import com.StudySync.backend.model.DiscussionAttachment;
import com.StudySync.backend.model.DiscussionPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DiscussionAttachmentRepository extends JpaRepository<DiscussionAttachment, Long> {

    List<DiscussionAttachment> findByPostOrderByIdAsc(DiscussionPost post);

    List<DiscussionAttachment> findByPostIdOrderByIdAsc(Long postId);

    void deleteByPost(DiscussionPost post);
}