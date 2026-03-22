package com.StudySync.backend.controller;

import com.StudySync.backend.dto.ModuleCreationRequest;
import com.StudySync.backend.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private GroupService groupService;

    @PostMapping("/modules/create")
    public ResponseEntity<?> createModule(@RequestBody ModuleCreationRequest request) {
        try {
            String result = groupService.createModuleWithGroups(request.getModule(), request.getNumberOfGroups());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating module: " + e.getMessage());
        }
    }
}