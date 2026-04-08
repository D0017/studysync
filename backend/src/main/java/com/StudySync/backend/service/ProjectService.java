package com.StudySync.backend.service;

import com.StudySync.backend.dto.ProjectMemberDto;
import com.StudySync.backend.dto.ProjectResponseDto;
import com.StudySync.backend.model.Project;
import com.StudySync.backend.model.ProjectGroup;
import com.StudySync.backend.model.User;
import com.StudySync.backend.repository.ProjectGroupRepository;
import com.StudySync.backend.repository.ProjectRepository;
import com.StudySync.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectGroupRepository projectGroupRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public ProjectResponseDto createProjectForGroup(Long groupId, String name, Long userId) {
        ProjectGroup group = getGroup(groupId);
        User requester = getUser(userId);

        validateGroupMember(group, requester);

        if (projectRepository.findByProjectGroup(group).isPresent()) {
            throw new RuntimeException("Project already exists for this group.");
        }

        Project project = new Project();
        project.setProjectGroup(group);
        project.setName((name == null || name.trim().isEmpty()) ? group.getGroupName() + " Project" : name.trim());

        return toProjectDto(projectRepository.save(project));
    }

    @Transactional(readOnly = true)
    public ProjectResponseDto getProjectForGroup(Long groupId, Long userId) {
        ProjectGroup group = getGroup(groupId);
        User requester = getUser(userId);

        validateGroupMember(group, requester);

        Project project = projectRepository.findByProjectGroup(group)
                .orElseThrow(() -> new RuntimeException("Project not found for this group."));

        return toProjectDto(project);
    }

    @Transactional(readOnly = true)
    public Project getProjectEntityById(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found."));
    }

    public void validateGroupMember(ProjectGroup group, User user) {
        boolean isMember = group.getCurrentMembers().stream()
                .anyMatch(member -> member.getId().equals(user.getId()));
        if (!isMember) {
            throw new RuntimeException("Only group members can access this project board.");
        }
    }

    public ProjectResponseDto toProjectDto(Project project) {
        ProjectGroup group = project.getProjectGroup();
        List<ProjectMemberDto> members = group.getCurrentMembers().stream()
                .sorted(Comparator.comparing(User::getFullName))
                .map(member -> new ProjectMemberDto(
                        member.getId(),
                        member.getFullName(),
                        member.getUniversityId()
                ))
                .collect(Collectors.toList());

        return new ProjectResponseDto(
                project.getId(),
                project.getName(),
                group.getId(),
                group.getGroupName(),
                project.getCreatedAt(),
                project.getUpdatedAt(),
                members
        );
    }

    public User getUser(Long userId) {
        if (userId == null) {
            throw new RuntimeException("User ID is required.");
        }
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));
    }

    public ProjectGroup getGroup(Long groupId) {
        return projectGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found."));
    }
}
