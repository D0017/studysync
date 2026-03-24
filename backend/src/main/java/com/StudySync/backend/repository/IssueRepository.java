package com.StudySync.backend.repository;

import com.StudySync.backend.model.Issue;
import com.StudySync.backend.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IssueRepository extends JpaRepository<Issue, Long> {
    List<Issue> findByProjectOrderByIssueNumberAsc(Project project);
    Optional<Issue> findTopByProjectOrderByIssueNumberDesc(Project project);
}
