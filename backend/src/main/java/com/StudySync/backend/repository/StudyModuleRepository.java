package com.StudySync.backend.repository;

import com.StudySync.backend.model.StudyModule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StudyModuleRepository extends JpaRepository<StudyModule, Long> {
    Optional<StudyModule> findByEnrollmentKey(String enrollmentKey);
}