package com.StudySync.backend.controller;

import com.StudySync.backend.dto.LoginRequest;
import com.StudySync.backend.dto.UserStatusUpdateRequest;
import com.StudySync.backend.model.User;
import com.StudySync.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user) {
        try {
            return ResponseEntity.ok(userService.registerUser(user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            return ResponseEntity.ok(userService.loginUser(loginRequest));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody String newRole) {
        try {
            String roleStr = newRole.replace("\"", "");
            return ResponseEntity.ok(userService.updateUserRole(id, User.Role.valueOf(roleStr)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    e.getMessage() != null ? e.getMessage() : "Invalid role or user ID."
            );
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateUserStatus(
            @PathVariable Long id,
            @RequestBody UserStatusUpdateRequest request
    ) {
        try {
            return ResponseEntity.ok(userService.updateUserStatus(id, request.isActive()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}