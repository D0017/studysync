package com.StudySync.backend.repository;

import com.StudySync.backend.model.DiscussionLike;
import com.StudySync.backend.model.DiscussionPost;
import com.StudySync.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DiscussionLikeRepository extends JpaRepository<DiscussionLike, Long> {

    Optional<DiscussionLike> findByPostAndUser(DiscussionPost post, User user);

    boolean existsByPostAndUser(DiscussionPost post, User user);

    long countByPost(DiscussionPost post);

    void deleteByPostAndUser(DiscussionPost post, User user);

    void deleteByPost(DiscussionPost post);
}