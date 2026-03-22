package com.StudySync.backend.service;

import com.StudySync.backend.model.User;
import com.StudySync.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Register a new user
    public User registerUser(User user) {

        Optional<User> existingEmail = userRepository.findByEmail(user.getEmail());
        Optional<User> existingId = userRepository.findByUniversityId(user.getUniversityId());

        if (existingEmail.isPresent()) {
            throw new RuntimeException("A user with this email already exists.");
        }
        if (existingId.isPresent()) {
            throw new RuntimeException("A user with this University ID already exists.");
        }

        return userRepository.save(user);
    }

    // Fetch all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}