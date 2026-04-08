package com.StudySync.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class ProjectResponseDto {
    private Long id;
    private String name;
    private Long groupId;
    private String groupName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ProjectMemberDto> members;
}
