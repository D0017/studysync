package com.StudySync.backend.service;

import com.StudySync.backend.dto.AuthResponse;
import com.StudySync.backend.dto.LoginRequest;
import com.StudySync.backend.model.User;
import com.StudySync.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

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

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    public AuthResponse loginUser(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with this email."));

        if (!user.isActive()) {
            throw new RuntimeException("Your account is inactive. Please contact admin.");
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password.");
        }

        return new AuthResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name(),
                user.getUniversityId()
        );
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUserRole(Long id, User.Role newRole) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if (user.getRole() == User.Role.ADMIN
                && newRole != User.Role.ADMIN
                && user.isActive()
                && userRepository.countByRoleAndIsActiveTrue(User.Role.ADMIN) <= 1) {
            throw new RuntimeException("Cannot change role of the last active admin.");
        }

        user.setRole(newRole);
        return userRepository.save(user);
    }

    public User updateUserStatus(Long id, boolean active) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if (user.getRole() == User.Role.ADMIN
                && user.isActive()
                && !active
                && userRepository.countByRoleAndIsActiveTrue(User.Role.ADMIN) <= 1) {
            throw new RuntimeException("Cannot deactivate the last active admin.");
        }

        user.setActive(active);
        return userRepository.save(user);
    }
}