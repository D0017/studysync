package com.StudySync.backend.repository;

import com.StudySync.backend.model.DiscussionLike;
import com.StudySync.backend.model.DiscussionPost;
import com.StudySync.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DiscussionLikeRepository extends JpaRepository<DiscussionLike, Long> {

    // check if user already liked a post
    Optional<DiscussionLike> findByPostAndUser(DiscussionPost post, User user);

    // count likes for a post
    long countByPost(DiscussionPost post);

    // delete like (unlike)
    void deleteByPostAndUser(DiscussionPost post, User user);
}