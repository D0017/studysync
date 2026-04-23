package com.StudySync.backend.dto;

import lombok.Data;

@Data
public class CreateProjectRequest {
    private String name;
    private Long userId;
}
