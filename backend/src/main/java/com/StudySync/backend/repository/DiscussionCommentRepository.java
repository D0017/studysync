package com.StudySync.backend.repository;

import com.StudySync.backend.model.DiscussionComment;
import com.StudySync.backend.model.DiscussionPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DiscussionCommentRepository extends JpaRepository<DiscussionComment, Long> {

    List<DiscussionComment> findByPostOrderByPinnedDescCreatedAtAsc(DiscussionPost post);

    long countByPost(DiscussionPost post);
}