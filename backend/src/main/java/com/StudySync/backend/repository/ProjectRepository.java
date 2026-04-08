package com.StudySync.backend.repository;

import com.StudySync.backend.model.Project;
import com.StudySync.backend.model.ProjectGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findByProjectGroup(ProjectGroup projectGroup);
}
