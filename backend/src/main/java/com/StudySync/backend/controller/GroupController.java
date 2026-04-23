package com.StudySync.backend.controller;

import com.StudySync.backend.model.ProjectGroup;
import com.StudySync.backend.model.StudyModule;
import com.StudySync.backend.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "http://localhost:5173")
public class GroupController {

    @Autowired
    private GroupService groupService;

    @PostMapping("/modules/enroll")
    public ResponseEntity<?> enrollInModule(
            @RequestParam Long studentId,
            @RequestParam String enrollmentKey
    ) {
        try {
            String result = groupService.enrollInModule(studentId, enrollmentKey);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/modules/student/{studentId}")
    public ResponseEntity<?> getStudentModules(@PathVariable Long studentId) {
        try {
            List<StudyModule> modules = groupService.getStudentModules(studentId);
            return ResponseEntity.ok(modules);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/modules/{moduleId}/all")
    public ResponseEntity<?> getGroupsByModule(@PathVariable Long moduleId) {
        try {
            List<ProjectGroup> groups = groupService.getGroupsByModule(moduleId);
            return ResponseEntity.ok(groups);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{groupId}/join")
    public ResponseEntity<?> joinGroup(
            @PathVariable Long groupId,
            @RequestParam Long studentId
    ) {
        try {
            String result = groupService.joinGroup(studentId, groupId);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{groupId}/request-leader")
    public ResponseEntity<?> requestLeadership(
            @PathVariable Long groupId,
            @RequestParam Long studentId
    ) {
        try {
            String result = groupService.requestLeadership(studentId, groupId);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}