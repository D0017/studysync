package com.StudySync.backend.repository;

import com.StudySync.backend.model.DiscussionAttachment;
import com.StudySync.backend.model.DiscussionPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DiscussionAttachmentRepository extends JpaRepository<DiscussionAttachment, Long> {

    Optional<DiscussionAttachment> findByPost(DiscussionPost post);

}