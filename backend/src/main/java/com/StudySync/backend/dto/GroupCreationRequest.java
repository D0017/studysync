package com.StudySync.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GroupCreationRequest {
    private int numberOfGroups;
    private int maxCapacity;
}