package com.StudySync.backend.service;

import com.StudySync.backend.dto.IssueResponseDto;
import com.StudySync.backend.dto.ProjectMemberDto;
import com.StudySync.backend.model.*;
import com.StudySync.backend.repository.IssueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class JiraBoardService {

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private ProjectService projectService;

    /**
     * Get comprehensive project analytics
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getProjectAnalytics(Long projectId, Long userId) {
        Project project = projectService.getProjectEntityById(projectId);
        ProjectGroup group = project.getProjectGroup();
        User requester = projectService.getUser(userId);
        projectService.validateGroupMember(group, requester);

        List<Issue> allIssues = issueRepository.findByProjectOrderByIssueNumberAsc(project);

        Map<String, Object> analytics = new HashMap<>();

        // Basic stats
        analytics.put("totalIssues", allIssues.size());
        analytics.put("completedIssues", allIssues.stream().filter(i -> i.getStatus() == IssueStatus.DONE).count());
        analytics.put("inProgressIssues", allIssues.stream().filter(i -> i.getStatus() == IssueStatus.IN_PROGRESS).count());
        analytics.put("todoIssues", allIssues.stream().filter(i -> i.getStatus() == IssueStatus.TODO).count());
        analytics.put("reviewIssues", allIssues.stream().filter(i -> i.getStatus() == IssueStatus.REVIEW).count());

        // Progress percentage
        long completed = allIssues.stream().filter(i -> i.getStatus() == IssueStatus.DONE).count();
        int progressPercentage = allIssues.isEmpty() ? 0 : (int) ((completed / (double) allIssues.size()) * 100);
        analytics.put("progressPercentage", progressPercentage);

        // Priority breakdown
        Map<String, Long> priorityBreakdown = new HashMap<>();
        for (IssuePriority priority : IssuePriority.values()) {
            long count = allIssues.stream().filter(i -> i.getPriority() == priority).count();
            priorityBreakdown.put(priority.toString(), count);
        }
        analytics.put("priorityBreakdown", priorityBreakdown);

        // Type breakdown
        Map<String, Long> typeBreakdown = new HashMap<>();
        for (IssueType type : IssueType.values()) {
            long count = allIssues.stream().filter(i -> i.getType() == type).count();
            typeBreakdown.put(type.toString(), count);
        }
        analytics.put("typeBreakdown", typeBreakdown);

        // Assignee workload
        Map<String, Integer> assigneeWorkload = new HashMap<>();
        allIssues.stream()
                .filter(i -> i.getAssignee() != null)
                .collect(Collectors.groupingBy(
                        i -> i.getAssignee().getFullName(),
                        Collectors.collectingAndThen(
                                Collectors.counting(),
                                Long::intValue
                        )
                ))
                .forEach(assigneeWorkload::put);
        analytics.put("assigneeWorkload", assigneeWorkload);

        // Overdue count
        long overdueCount = allIssues.stream()
                .filter(i -> i.getDueDate() != null && 
                       i.getDueDate().isBefore(LocalDate.now()) && 
                       i.getStatus() != IssueStatus.DONE)
                .count();
        analytics.put("overdueCount", overdueCount);

        return analytics;
    }

    /**
     * Get filtered issues with multiple criteria
     */
    @Transactional(readOnly = true)
    public List<IssueResponseDto> getFilteredIssues(Long projectId, Long userId, 
                                                      String status, String priority, String type,
                                                      Long assigneeId, String searchQuery) {
        Project project = projectService.getProjectEntityById(projectId);
        ProjectGroup group = project.getProjectGroup();
        User requester = projectService.getUser(userId);
        projectService.validateGroupMember(group, requester);

        List<Issue> issues = issueRepository.findByProjectOrderByIssueNumberAsc(project);

        // Apply filters
        if (status != null && !status.isEmpty()) {
            IssueStatus issueStatus = IssueStatus.valueOf(status.toUpperCase());
            issues = issues.stream()
                    .filter(i -> i.getStatus() == issueStatus)
                    .collect(Collectors.toList());
        }

        if (priority != null && !priority.isEmpty()) {
            IssuePriority issuePriority = IssuePriority.valueOf(priority.toUpperCase());
            issues = issues.stream()
                    .filter(i -> i.getPriority() == issuePriority)
                    .collect(Collectors.toList());
        }

        if (type != null && !type.isEmpty()) {
            IssueType issueType = IssueType.valueOf(type.toUpperCase());
            issues = issues.stream()
                    .filter(i -> i.getType() == issueType)
                    .collect(Collectors.toList());
        }

        if (assigneeId != null) {
            issues = issues.stream()
                    .filter(i -> i.getAssignee() != null && i.getAssignee().getId().equals(assigneeId))
                    .collect(Collectors.toList());
        }

        if (searchQuery != null && !searchQuery.isEmpty()) {
            String query = searchQuery.toLowerCase();
            issues = issues.stream()
                    .filter(i -> i.getTitle().toLowerCase().contains(query) || 
                               i.getDescription() != null && i.getDescription().toLowerCase().contains(query) ||
                               i.getIssueKey().toLowerCase().contains(query))
                    .collect(Collectors.toList());
        }

        return issues.stream().map(this::toIssueDto).collect(Collectors.toList());
    }

    /**
     * Get burndown chart data
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getBurndownChartData(Long projectId, Long userId) {
        Project project = projectService.getProjectEntityById(projectId);
        ProjectGroup group = project.getProjectGroup();
        User requester = projectService.getUser(userId);
        projectService.validateGroupMember(group, requester);

        List<Issue> allIssues = issueRepository.findByProjectOrderByIssueNumberAsc(project);

        Map<String, Object> burndownData = new HashMap<>();
        
        // Get all issues with due dates, sorted by date
        List<Issue> issuesWithDueDate = allIssues.stream()
                .filter(i -> i.getDueDate() != null)
                .sorted(Comparator.comparing(Issue::getDueDate))
                .collect(Collectors.toList());

        burndownData.put("totalIssues", allIssues.size());
        burndownData.put("issuesWithDueDate", issuesWithDueDate.size());

        // Create timeline of completed issues
        Map<LocalDate, Integer> completionTimeline = new HashMap<>();
        int completedCount = 0;
        for (Issue issue : issuesWithDueDate) {
            if (issue.getStatus() == IssueStatus.DONE) {
                completedCount++;
                completionTimeline.put(issue.getUpdatedAt().toLocalDate(), completedCount);
            }
        }
        
        burndownData.put("completionTimeline", completionTimeline);
        burndownData.put("currentlyCompleted", completedCount);

        return burndownData;
    }

    /**
     * Get issues grouped by status
     */
    @Transactional(readOnly = true)
    public Map<String, List<IssueResponseDto>> getIssuesGroupedByStatus(Long projectId, Long userId) {
        Project project = projectService.getProjectEntityById(projectId);
        ProjectGroup group = project.getProjectGroup();
        User requester = projectService.getUser(userId);
        projectService.validateGroupMember(group, requester);

        List<Issue> allIssues = issueRepository.findByProjectOrderByIssueNumberAsc(project);

        Map<String, List<IssueResponseDto>> grouped = new HashMap<>();
        for (IssueStatus status : IssueStatus.values()) {
            grouped.put(status.toString(), 
                allIssues.stream()
                    .filter(i -> i.getStatus() == status)
                    .map(this::toIssueDto)
                    .collect(Collectors.toList())
            );
        }

        return grouped;
    }

    /**
     * Get issues assigned to specific user
     */
    @Transactional(readOnly = true)
    public List<IssueResponseDto> getIssuesByAssignee(Long projectId, Long userId, Long assigneeId) {
        Project project = projectService.getProjectEntityById(projectId);
        ProjectGroup group = project.getProjectGroup();
        User requester = projectService.getUser(userId);
        projectService.validateGroupMember(group, requester);

        List<Issue> issues = issueRepository.findByProjectOrderByIssueNumberAsc(project);
        return issues.stream()
                .filter(i -> i.getAssignee() != null && i.getAssignee().getId().equals(assigneeId))
                .map(this::toIssueDto)
                .collect(Collectors.toList());
    }

    /**
     * Get overdue issues
     */
    @Transactional(readOnly = true)
    public List<IssueResponseDto> getOverdueIssues(Long projectId, Long userId) {
        Project project = projectService.getProjectEntityById(projectId);
        ProjectGroup group = project.getProjectGroup();
        User requester = projectService.getUser(userId);
        projectService.validateGroupMember(group, requester);

        List<Issue> issues = issueRepository.findByProjectOrderByIssueNumberAsc(project);
        return issues.stream()
                .filter(i -> i.getDueDate() != null && 
                           i.getDueDate().isBefore(LocalDate.now()) && 
                           i.getStatus() != IssueStatus.DONE)
                .map(this::toIssueDto)
                .collect(Collectors.toList());
    }

    /**
     * Get issues by priority
     */
    @Transactional(readOnly = true)
    public List<IssueResponseDto> getIssuesByPriority(Long projectId, Long userId, String priorityStr) {
        Project project = projectService.getProjectEntityById(projectId);
        ProjectGroup group = project.getProjectGroup();
        User requester = projectService.getUser(userId);
        projectService.validateGroupMember(group, requester);

        IssuePriority priority = IssuePriority.valueOf(priorityStr.toUpperCase());
        List<Issue> issues = issueRepository.findByProjectOrderByIssueNumberAsc(project);
        
        return issues.stream()
                .filter(i -> i.getPriority() == priority)
                .map(this::toIssueDto)
                .collect(Collectors.toList());
    }

    private IssueResponseDto toIssueDto(Issue issue) {
        return new IssueResponseDto(
                issue.getId(),
                issue.getIssueNumber(),
                issue.getIssueKey(),
                issue.getTitle(),
                issue.getDescription(),
                issue.getStatus(),
                issue.getPriority(),
                issue.getType(),
                issue.getDueDate(),
                issue.getCreatedAt(),
                issue.getUpdatedAt(),
                issue.getProject().getId(),
                toMemberDto(issue.getAssignee()),
                toMemberDto(issue.getReporter())
        );
    }

    private ProjectMemberDto toMemberDto(User user) {
        if (user == null) {
            return null;
        }
        return new ProjectMemberDto(user.getId(), user.getFullName(), user.getUniversityId());
    }
}
