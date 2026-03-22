package com.StudySync.backend.controller;

import com.StudySync.backend.dto.ModuleCreationRequest;
import com.StudySync.backend.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class GroupController {

    @Autowired
    private GroupService groupService;

    @PostMapping("/create-module-groups")
    public ResponseEntity<?> createModuleWithGroups(@RequestBody ModuleCreationRequest request) {
        try {
            String status = groupService.createModuleWithGroups(request.getModule(), request.getNumberOfGroups());
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}