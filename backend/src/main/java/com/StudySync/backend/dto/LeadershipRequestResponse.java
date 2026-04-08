package com.StudySync.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LeadershipRequestResponse {
    private Long groupId;
    private String groupName;

    private Long moduleId;
    private String moduleCode;
    private String moduleName;

    private Long requesterId;
    private String requesterName;
    private String requesterUniversityId;

    private int currentMemberCount;
    private int maxCapacity;
}