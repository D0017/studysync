package com.StudySync.backend.controller;

import com.StudySync.backend.dto.AssignIssueRequest;
import com.StudySync.backend.dto.CreateIssueRequest;
import com.StudySync.backend.dto.IssueResponseDto;
import com.StudySync.backend.dto.UpdateIssueStatusRequest;
import com.StudySync.backend.service.IssueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@CrossOrigin(origins = "http://localhost:5173")
public class IssueController {

    @Autowired
    private IssueService issueService;

    @PostMapping("/projects/{projectId}")
    public ResponseEntity<?> createIssue(
            @PathVariable Long projectId,
            @RequestBody CreateIssueRequest request
    ) {
        try {
            IssueResponseDto response = issueService.createIssue(projectId, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/projects/{projectId}")
    public ResponseEntity<?> getIssuesByProject(
            @PathVariable Long projectId,
            @RequestParam Long userId
    ) {
        try {
            List<IssueResponseDto> response = issueService.getIssuesByProject(projectId, userId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{issueId}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long issueId,
            @RequestBody UpdateIssueStatusRequest request
    ) {
        try {
            IssueResponseDto response = issueService.updateIssueStatus(issueId, request.getUserId(), request.getStatus());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{issueId}/assign")
    public ResponseEntity<?> assignIssue(
            @PathVariable Long issueId,
            @RequestBody AssignIssueRequest request
    ) {
        try {
            IssueResponseDto response = issueService.assignIssue(issueId, request.getUserId(), request.getAssigneeId());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
