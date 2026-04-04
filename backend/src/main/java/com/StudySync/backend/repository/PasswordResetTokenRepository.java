package com.StudySync.backend.repository;

import com.StudySync.backend.model.PasswordResetToken;
import com.StudySync.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByTokenHash(String tokenHash);
    void deleteByUser(User user);
}