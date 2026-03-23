package com.StudySync.backend.repository;

import com.StudySync.backend.model.ProjectGroup;
import com.StudySync.backend.model.StudyModule;
import com.StudySync.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectGroupRepository extends JpaRepository<ProjectGroup, Long> {

    boolean existsByModuleAndCurrentMembersContaining(StudyModule module, User student);

    List<ProjectGroup> findByRequestedLeaderIsNotNullAndLeaderIsNull();
}