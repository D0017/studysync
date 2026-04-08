package com.StudySync.backend.service;

import com.StudySync.backend.model.Resource;
import com.StudySync.backend.repository.ResourceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    public Resource upload(Resource resource) {
        resource.setUploadDate(LocalDateTime.now());
        return resourceRepository.save(resource);
    }

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public void delete(Long id) {
        resourceRepository.deleteById(id);
    }

}