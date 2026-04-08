package com.StudySync.backend.dto;

import com.StudySync.backend.model.IssueStatus;
import lombok.Data;

@Data
public class UpdateIssueStatusRequest {
    private Long userId;
    private IssueStatus status;
}
