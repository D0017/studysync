package com.StudySync.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private String fileUrl;

    private String module;

    private String faculty;

    private String year;

    private String uploadedBy;

    private LocalDateTime uploadDate;

    private LocalDateTime updatedDate;
}