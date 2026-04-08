package com.StudySync.backend.repository;

import com.StudySync.backend.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResourceRepository extends JpaRepository<Resource, Long> {

    List<Resource> findByModule(String module);

    List<Resource> findByYear(String year);

}