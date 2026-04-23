package com.StudySync.backend.controller;

import com.StudySync.backend.dto.IssueResponseDto;
import com.StudySync.backend.service.JiraBoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jira")
@CrossOrigin(origins = "http://localhost:5173")
public class JiraBoardController {

    @Autowired
    private JiraBoardService jiraBoardService;

    /**
     * Get project analytics and statistics
     */
    @GetMapping("/projects/{projectId}/analytics")
    public ResponseEntity<?> getProjectAnalytics(
            @PathVariable Long projectId,
            @RequestParam Long userId
    ) {
        try {
            Map<String, Object> analytics = jiraBoardService.getProjectAnalytics(projectId, userId);
            return ResponseEntity.ok(analytics);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Get issues with advanced filtering
     */
    @GetMapping("/projects/{projectId}/issues/filtered")
    public ResponseEntity<?> getFilteredIssues(
            @PathVariable Long projectId,
            @RequestParam Long userId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Long assigneeId,
            @RequestParam(required = false) String searchQuery
    ) {
        try {
            List<IssueResponseDto> issues = jiraBoardService.getFilteredIssues(
                    projectId, userId, status, priority, type, assigneeId, searchQuery
            );
            return ResponseEntity.ok(issues);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Get burndown chart data
     */
    @GetMapping("/projects/{projectId}/burndown")
    public ResponseEntity<?> getBurndownData(
            @PathVariable Long projectId,
            @RequestParam Long userId
    ) {
        try {
            Map<String, Object> burndownData = jiraBoardService.getBurndownChartData(projectId, userId);
            return ResponseEntity.ok(burndownData);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Get issues grouped by status
     */
    @GetMapping("/projects/{projectId}/issues/grouped")
    public ResponseEntity<?> getIssuesGroupedByStatus(
            @PathVariable Long projectId,
            @RequestParam Long userId
    ) {
        try {
            Map<String, List<IssueResponseDto>> groupedIssues = jiraBoardService.getIssuesGroupedByStatus(projectId, userId);
            return ResponseEntity.ok(groupedIssues);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Get issues assigned to a specific user
     */
    @GetMapping("/projects/{projectId}/issues/assignee/{assigneeId}")
    public ResponseEntity<?> getIssuesByAssignee(
            @PathVariable Long projectId,
            @PathVariable Long assigneeId,
            @RequestParam Long userId
    ) {
        try {
            List<IssueResponseDto> issues = jiraBoardService.getIssuesByAssignee(projectId, userId, assigneeId);
            return ResponseEntity.ok(issues);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Get overdue issues
     */
    @GetMapping("/projects/{projectId}/issues/overdue")
    public ResponseEntity<?> getOverdueIssues(
            @PathVariable Long projectId,
            @RequestParam Long userId
    ) {
        try {
            List<IssueResponseDto> overdueIssues = jiraBoardService.getOverdueIssues(projectId, userId);
            return ResponseEntity.ok(overdueIssues);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Get issues by priority
     */
    @GetMapping("/projects/{projectId}/issues/priority/{priority}")
    public ResponseEntity<?> getIssuesByPriority(
            @PathVariable Long projectId,
            @PathVariable String priority,
            @RequestParam Long userId
    ) {
        try {
            List<IssueResponseDto> issues = jiraBoardService.getIssuesByPriority(projectId, userId, priority);
            return ResponseEntity.ok(issues);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
