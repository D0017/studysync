package com.StudySync.backend.controller;

import com.StudySync.backend.dto.GroupCreationRequest;
import com.StudySync.backend.dto.LeadershipRequestResponse;
import com.StudySync.backend.model.StudyModule;
import com.StudySync.backend.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private GroupService groupService;

    @PostMapping("/modules")
    public ResponseEntity<?> createModule(@RequestBody StudyModule moduleRequest) {
        try {
            StudyModule savedModule = groupService.createModule(moduleRequest);
            return ResponseEntity.ok(savedModule);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/modules/{moduleId}/groups")
    public ResponseEntity<?> createGroupsForModule(
            @PathVariable Long moduleId,
            @RequestBody GroupCreationRequest request
    ) {
        try {
            String result = groupService.createGroupsForModule(
                    moduleId,
                    request.getNumberOfGroups(),
                    request.getMaxCapacity()
            );
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/modules")
    public ResponseEntity<?> getAllModules() {
        try {
            List<StudyModule> modules = groupService.getAllModules();
            return ResponseEntity.ok(modules);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/leadership-requests")
    public ResponseEntity<?> getPendingLeadershipRequests() {
        try {
            List<LeadershipRequestResponse> requests = groupService.getPendingLeadershipRequests();
            return ResponseEntity.ok(requests);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/leadership-requests/{groupId}/approve")
    public ResponseEntity<?> approveLeadershipRequest(@PathVariable Long groupId) {
        try {
            String result = groupService.approveLeadershipRequest(groupId);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}