package com.StudySync.backend.dto;

import com.StudySync.backend.model.IssuePriority;
import com.StudySync.backend.model.IssueType;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateIssueRequest {
    private Long userId;
    private String title;
    private String description;
    private IssuePriority priority;
    private IssueType type;
    private LocalDate dueDate;
    private Long assigneeId;
}
