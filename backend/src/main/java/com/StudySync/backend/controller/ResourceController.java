package com.StudySync.backend.controller;

import com.StudySync.backend.model.Resource;
import com.StudySync.backend.service.ResourceService;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Resource upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("module") String module,
            @RequestParam("faculty") String faculty,
            @RequestParam("year") String year,
            @RequestParam("semester") String semester,
            @RequestParam("uploadedBy") String uploadedBy
    ) throws Exception {
        return resourceService.upload(file, title, description, module, faculty, year, semester, uploadedBy);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Resource update(
            @PathVariable Long id,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("module") String module,
            @RequestParam("faculty") String faculty,
            @RequestParam("year") String year,
            @RequestParam("semester") String semester,
            @RequestParam("uploadedBy") String uploadedBy
    ) throws Exception {
        return resourceService.update(id, file, title, description, module, faculty, year, semester, uploadedBy);
    }

    @GetMapping
    public List<Resource> getAll() {
        return resourceService.getAllResources();
    }

    @GetMapping("/faculty/{faculty}/module/{module}")
    public List<Resource> getByFacultyAndModule(
            @PathVariable String faculty,
            @PathVariable String module
    ) {
        return resourceService.getByFacultyAndModule(faculty, module);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<org.springframework.core.io.Resource> download(@PathVariable Long id) throws Exception {
        Resource resource = resourceService.getById(id);

        Path path = Paths.get(resource.getFileUrl());
        UrlResource fileResource = new UrlResource(path.toUri());

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(
                        resource.getFileType() != null ? resource.getFileType() : MediaType.APPLICATION_OCTET_STREAM_VALUE
                ))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + resource.getOriginalFileName() + "\"")
                .body(fileResource);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) throws Exception {
        resourceService.delete(id);
    }
}