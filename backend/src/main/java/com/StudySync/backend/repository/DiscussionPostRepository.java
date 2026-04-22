package com.StudySync.backend.repository;

import com.StudySync.backend.model.DiscussionPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DiscussionPostRepository extends JpaRepository<DiscussionPost, Long> {

    List<DiscussionPost> findAllByOrderByCreatedAtDesc();

}