package com.StudySync.backend.dto;

import lombok.Data;

@Data
public class AssignIssueRequest {
    private Long userId;
    private Long assigneeId;
}
