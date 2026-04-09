package com.StudySync.backend.dto;

import com.StudySync.backend.model.IssuePriority;
import com.StudySync.backend.model.IssueStatus;
import com.StudySync.backend.model.IssueType;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class IssueResponseDto {
    private Long id;
    private Long issueNumber;
    private String issueKey;
    private String title;
    private String description;
    private IssueStatus status;
    private IssuePriority priority;
    private IssueType type;
    private LocalDate dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long projectId;
    private ProjectMemberDto assignee;
    private ProjectMemberDto reporter;
}
