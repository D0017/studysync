package com.StudySync.backend.repository;

import com.StudySync.backend.model.DiscussionPost;
import com.StudySync.backend.model.DiscussionReshare;
import com.StudySync.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DiscussionReshareRepository extends JpaRepository<DiscussionReshare, Long> {

    Optional<DiscussionReshare> findByPostAndUser(DiscussionPost post, User user);

    boolean existsByPostAndUser(DiscussionPost post, User user);

    long countByPost(DiscussionPost post);

    void deleteByPostAndUser(DiscussionPost post, User user);

    void deleteByPost(DiscussionPost post);
}