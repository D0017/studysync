package com.StudySync.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "University ID is required")
    @Pattern(regexp = "^[A-Za-z0-9]{8}$", message = "University ID must be exactly 8 alphanumeric characters")
    @Column(nullable = false, unique = true)
    private String universityId;

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    @Column(nullable = false)
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Column(nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Role is required")
    private Role role;

    private boolean isActive = true;

    public enum Role { ADMIN, LECTURER, STUDENT }

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_modules",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "module_id")
    )
    @JsonIgnore
    private Set<StudyModule> enrolledModules = new HashSet<>();

    @OneToMany(mappedBy = "lecturer", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<StudyModule> assignedModules = new HashSet<>();
}