package com.StudySync.backend.repository;

import com.StudySync.backend.model.StudyModule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudyModuleRepository extends JpaRepository<StudyModule, Long> {

    Optional<StudyModule> findByEnrollmentKey(String enrollmentKey);

    boolean existsByModuleCodeIgnoreCase(String moduleCode);

    boolean existsByEnrollmentKeyIgnoreCase(String enrollmentKey);

    List<StudyModule> findByLecturer_Id(Long lecturerId);
}