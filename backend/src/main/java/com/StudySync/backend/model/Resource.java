package com.StudySync.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "resource")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "file_url")
    private String fileUrl;

    private String module;

    private String faculty;

    private String year;

    private String semester;

    @Column(name = "uploaded_by")
    private String uploadedBy;

    @Column(name = "upload_date")
    private LocalDateTime uploadDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @Column(name = "original_file_name")
    private String originalFileName;

    @Column(name = "file_type")
    private String fileType;
}