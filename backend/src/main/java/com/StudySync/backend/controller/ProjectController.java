package com.StudySync.backend.controller;

import com.StudySync.backend.dto.CreateProjectRequest;
import com.StudySync.backend.dto.ProjectResponseDto;
import com.StudySync.backend.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:5173")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping("/groups/{groupId}")
    public ResponseEntity<?> createProjectForGroup(
            @PathVariable Long groupId,
            @RequestBody CreateProjectRequest request
    ) {
        try {
            ProjectResponseDto response = projectService.createProjectForGroup(
                    groupId,
                    request.getName(),
                    request.getUserId()
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/groups/{groupId}")
    public ResponseEntity<?> getProjectByGroup(
            @PathVariable Long groupId,
            @RequestParam Long userId
    ) {
        try {
            ProjectResponseDto response = projectService.getProjectForGroup(groupId, userId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
