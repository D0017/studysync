package com.StudySync.backend.service;

import com.StudySync.backend.model.Resource;
import com.StudySync.backend.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;

    @Value("${file.upload-dir:uploads/resources}")
    private String uploadDir;

    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    public Resource upload(
            MultipartFile file,
            String title,
            String description,
            String module,
            String faculty,
            String year,
            String semester,
            String uploadedBy
    ) throws IOException {

        Files.createDirectories(Paths.get(uploadDir));

        String uniqueFileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir, uniqueFileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        Resource resource = new Resource();
        resource.setTitle(title);
        resource.setDescription(description);
        resource.setModule(module);
        resource.setFaculty(faculty);
        resource.setYear(year);
        resource.setSemester(semester);
        resource.setUploadedBy(uploadedBy);
        resource.setUploadDate(LocalDateTime.now());
        resource.setUpdatedDate(LocalDateTime.now());
        resource.setFileUrl(filePath.toString());
        resource.setOriginalFileName(file.getOriginalFilename());
        resource.setFileType(file.getContentType());

        return resourceRepository.save(resource);
    }

    public Resource update(
            Long id,
            MultipartFile file,
            String title,
            String description,
            String module,
            String faculty,
            String year,
            String semester,
            String uploadedBy
    ) throws IOException {

        Resource existing = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        existing.setTitle(title);
        existing.setDescription(description);
        existing.setModule(module);
        existing.setFaculty(faculty);
        existing.setYear(year);
        existing.setSemester(semester);
        existing.setUploadedBy(uploadedBy);
        existing.setUpdatedDate(LocalDateTime.now());

        if (file != null && !file.isEmpty()) {
            Files.createDirectories(Paths.get(uploadDir));

            String uniqueFileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, uniqueFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            existing.setFileUrl(filePath.toString());
            existing.setOriginalFileName(file.getOriginalFilename());
            existing.setFileType(file.getContentType());
        }

        return resourceRepository.save(existing);
    }

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public List<Resource> getByFacultyAndModule(String faculty, String module) {
        return resourceRepository.findByFacultyIgnoreCaseAndModuleIgnoreCase(faculty, module);
    }

    public Resource getById(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
    }

    public void delete(Long id) throws IOException {
        Resource resource = getById(id);

        if (resource.getFileUrl() != null) {
            Path path = Paths.get(resource.getFileUrl());
            Files.deleteIfExists(path);
        }

        resourceRepository.deleteById(id);
    }
}