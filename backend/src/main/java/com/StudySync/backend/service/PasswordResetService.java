package com.StudySync.backend.service;

import com.StudySync.backend.dto.ResetPasswordRequest;
import com.StudySync.backend.model.PasswordResetToken;
import com.StudySync.backend.model.User;
import com.StudySync.backend.repository.PasswordResetTokenRepository;
import com.StudySync.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

@Service
@Transactional
public class PasswordResetService {

    private static final int EXPIRY_MINUTES = 20;
    private static final int TOKEN_BYTES = 32;
    private static final String GENERIC_RESPONSE =
            "If an account exists for that email, a password reset link has been sent.";

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final TokenHasher tokenHasher;
    private final SecureRandom secureRandom = new SecureRandom();

    public PasswordResetService(
            UserRepository userRepository,
            PasswordResetTokenRepository passwordResetTokenRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService,
            TokenHasher tokenHasher
    ) {
        this.userRepository = userRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.tokenHasher = tokenHasher;
    }

    public String requestPasswordReset(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            return GENERIC_RESPONSE;
        }

        User user = optionalUser.get();

        if (!user.isActive()) {
            return GENERIC_RESPONSE;
        }

        passwordResetTokenRepository.deleteByUser(user);

        String rawToken = generateToken();
        String tokenHash = tokenHasher.hash(rawToken);

        PasswordResetToken token = new PasswordResetToken();
        token.setUser(user);
        token.setTokenHash(tokenHash);
        token.setExpiresAt(LocalDateTime.now().plusMinutes(EXPIRY_MINUTES));

        passwordResetTokenRepository.save(token);
        emailService.sendPasswordResetEmail(user.getEmail(), rawToken);

        return GENERIC_RESPONSE;
    }

    public String resetPassword(ResetPasswordRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match.");
        }

        String tokenHash = tokenHasher.hash(request.getToken());

        PasswordResetToken token = passwordResetTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset link."));

        if (token.getUsedAt() != null || token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Invalid or expired reset link.");
        }

        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        token.setUsedAt(LocalDateTime.now());
        passwordResetTokenRepository.save(token);

        return "Password has been reset successfully.";
    }

    private String generateToken() {
        byte[] bytes = new byte[TOKEN_BYTES];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}