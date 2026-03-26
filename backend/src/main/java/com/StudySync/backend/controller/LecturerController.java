package com.StudySync.backend.controller;

import com.StudySync.backend.model.StudyModule;
import com.StudySync.backend.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lecturer")
@CrossOrigin(origins = "http://localhost:5173")
public class LecturerController {

    @Autowired
    private GroupService groupService;

    @GetMapping("/modules/{lecturerId}")
    public ResponseEntity<?> getAssignedModules(@PathVariable Long lecturerId) {
        try {
            List<StudyModule> modules = groupService.getModulesByLecturer(lecturerId);
            return ResponseEntity.ok(modules);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}