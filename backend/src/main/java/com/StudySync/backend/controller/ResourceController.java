package com.StudySync.backend.controller;

import com.StudySync.backend.model.Resource;
import com.StudySync.backend.service.ResourceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @PostMapping
    public Resource upload(@RequestBody Resource resource) {
        return resourceService.upload(resource);
    }

    @GetMapping
    public List<Resource> getAll() {
        return resourceService.getAllResources();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        resourceService.delete(id);
    }
}