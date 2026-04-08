package com.StudySync.backend.service;

import com.StudySync.backend.dto.CreateIssueRequest;
import com.StudySync.backend.dto.IssueResponseDto;
import com.StudySync.backend.dto.ProjectMemberDto;
import com.StudySync.backend.model.*;
import com.StudySync.backend.repository.IssueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class IssueService {

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private ProjectService projectService;

    @Transactional
    public IssueResponseDto createIssue(Long projectId, CreateIssueRequest request) {
        Project project = projectService.getProjectEntityById(projectId);
        ProjectGroup group = project.getProjectGroup();
        User reporter = projectService.getUser(request.getUserId());
        projectService.validateGroupMember(group, reporter);

        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new RuntimeException("Issue title is required.");
        }

        Issue issue = new Issue();
        issue.setProject(project);
        issue.setTitle(request.getTitle().trim());
        issue.setDescription(request.getDescription());
        issue.setStatus(IssueStatus.TODO);
        issue.setPriority(request.getPriority() == null ? IssuePriority.MEDIUM : request.getPriority());
        issue.setType(request.getType() == null ? IssueType.TASK : request.getType());
        issue.setDueDate(request.getDueDate());
        issue.setReporter(reporter);

        if (request.getAssigneeId() != null) {
            User assignee = projectService.getUser(request.getAssigneeId());
            validateAssignee(group, assignee);
            issue.setAssignee(assignee);
        }

        long nextIssueNumber = issueRepository.findTopByProjectOrderByIssueNumberDesc(project)
                .map(existing -> existing.getIssueNumber() + 1)
                .orElse(1L);

        issue.setIssueNumber(nextIssueNumber);
        issue.setIssueKey("GRP-" + group.getId() + "-" + nextIssueNumber);

        return toIssueDto(issueRepository.save(issue));
    }

    @Transactional(readOnly = true)
    public List<IssueResponseDto> getIssuesByProject(Long projectId, Long userId) {
        Project project = projectService.getProjectEntityById(projectId);
        ProjectGroup group = project.getProjectGroup();
        User requester = projectService.getUser(userId);
        projectService.validateGroupMember(group, requester);

        return issueRepository.findByProjectOrderByIssueNumberAsc(project).stream()
                .map(this::toIssueDto)
                .toList();
    }

    @Transactional
    public IssueResponseDto updateIssueStatus(Long issueId, Long userId, IssueStatus newStatus) {
        if (newStatus == null) {
            throw new RuntimeException("Issue status is required.");
        }

        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found."));

        User requester = projectService.getUser(userId);
        ProjectGroup group = issue.getProject().getProjectGroup();
        projectService.validateGroupMember(group, requester);

        issue.setStatus(newStatus);
        return toIssueDto(issueRepository.save(issue));
    }

    @Transactional
    public IssueResponseDto assignIssue(Long issueId, Long userId, Long assigneeId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found."));

        User requester = projectService.getUser(userId);
        ProjectGroup group = issue.getProject().getProjectGroup();
        projectService.validateGroupMember(group, requester);

        if (assigneeId == null) {
            issue.setAssignee(null);
            return toIssueDto(issueRepository.save(issue));
        }

        User assignee = projectService.getUser(assigneeId);
        validateAssignee(group, assignee);

        issue.setAssignee(assignee);
        return toIssueDto(issueRepository.save(issue));
    }

    @Transactional
    public void deleteIssue(Long issueId, Long userId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found with ID: " + issueId));

        User requester = projectService.getUser(userId);
        ProjectGroup group = issue.getProject().getProjectGroup();
        projectService.validateGroupMember(group, requester);

        issueRepository.delete(issue);
    }

    private void validateAssignee(ProjectGroup group, User assignee) {
        boolean isMember = group.getCurrentMembers().stream()
                .anyMatch(member -> member.getId().equals(assignee.getId()));
        if (!isMember) {
            throw new RuntimeException("Assignee must be a member of the same project group.");
        }
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
