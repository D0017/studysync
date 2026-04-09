package com.StudySync.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProjectMemberDto {
    private Long id;
    private String fullName;
    private String universityId;
}
