package com.StudySync.backend.service;

import com.StudySync.backend.model.User;
import com.StudySync.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already registered.");
        }
        if (userRepository.findByUniversityId(user.getUniversityId()).isPresent()) {
            throw new RuntimeException("University ID is already registered.");
        }
        return userRepository.save(user);
    }
}