package com.StudySync.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String fullName;
    private String email;
    private String role;
    private String universityId;
}