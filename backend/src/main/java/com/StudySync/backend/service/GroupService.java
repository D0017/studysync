package com.StudySync.backend.service;

import com.StudySync.backend.model.ProjectGroup;
import com.StudySync.backend.model.StudyModule;
import com.StudySync.backend.model.User;
import com.StudySync.backend.repository.ProjectGroupRepository;
import com.StudySync.backend.repository.StudyModuleRepository;
import com.StudySync.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GroupService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudyModuleRepository studyModuleRepository;

    @Autowired
    private ProjectGroupRepository projectGroupRepository;

    //  STUDENT ENROLLS IN MODULE

    @Transactional
    public String enrollInModule(Long studentId, String enrollmentKey) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found."));

        StudyModule module = studyModuleRepository.findByEnrollmentKey(enrollmentKey)
                .orElseThrow(() -> new RuntimeException("Invalid Enrollment Key."));

        student.getEnrolledModules().add(module);
        userRepository.save(student);

        return "Successfully enrolled in " + module.getModuleName();
    }

    //  STUDENT JOINS A PROJECT GROUP

    @Transactional
    public String joinGroup(Long studentId, Long groupId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found."));

        ProjectGroup group = projectGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found."));

        StudyModule module = group.getModule();

        //  Registration Check
        if (!student.getEnrolledModules().contains(module)) {
            throw new RuntimeException("Security Error: You are not enrolled in this module.");
        }

        // Duplicate Check
        if (projectGroupRepository.existsByModuleAndCurrentMembersContaining(module, student)) {
            throw new RuntimeException("You are already a member of a group in this module.");
        }

        // Capacity Check
        if (group.getCurrentMembers().size() >= group.getMaxCapacity()) {
            throw new RuntimeException("This group has reached its maximum capacity of " + group.getMaxCapacity() + ".");
        }

        group.getCurrentMembers().add(student);
        projectGroupRepository.save(group);

        return "Successfully joined " + group.getGroupName();
    }

    // STUDENT REQUESTS LEADERSHIP

    @Transactional
    public String requestLeadership(Long studentId, Long groupId) {
        ProjectGroup group = projectGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found."));

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found."));

        // Must be a member of the group to request leadership
        if (!group.getCurrentMembers().contains(student)) {
            throw new RuntimeException("You must join the group before requesting leadership.");
        }

        if (group.getLeader() != null) {
            throw new RuntimeException("This group already has an approved leader.");
        }

        group.setRequestedLeader(student);
        projectGroupRepository.save(group);

        return "Leadership request sent to admin.";
    }
}