package com.StudySync.backend.dto;

import com.StudySync.backend.model.StudyModule;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ModuleCreationRequest {
    private StudyModule module;
    private int numberOfGroups;
}