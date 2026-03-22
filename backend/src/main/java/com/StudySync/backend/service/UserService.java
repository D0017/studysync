package com.StudySync.backend.service;

import com.StudySync.backend.model.User;
import com.StudySync.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.StudySync.backend.dto.LoginRequest;
import com.StudySync.backend.dto.AuthResponse;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already registered.");
        }
        if (userRepository.findByUniversityId(user.getUniversityId()).isPresent()) {
            throw new RuntimeException("University ID already exists.");
        }

        // hash password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }
    public AuthResponse loginUser(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with this email."));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password.");
        }

        return new AuthResponse(
                user.getFullName(),
                user.getEmail(),
                user.getRole().name(),
                user.getUniversityId()
        );
    }
}