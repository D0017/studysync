package com.StudySync.backend.service;

import com.StudySync.backend.model.User;
import com.StudySync.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        // Check if any admin exists in the system
        if (userRepository.findAll().stream().noneMatch(u -> u.getRole() == User.Role.ADMIN)) {
            User admin = new User();
            admin.setFullName("System Administrator");
            admin.setEmail("admin@studysync.com");
            admin.setUniversityId("ADMIN001");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setRole(User.Role.ADMIN);

            userRepository.save(admin);
            System.out.println(">> Default Admin created: admin@studysync.com / Admin@123");
        }
    }
}