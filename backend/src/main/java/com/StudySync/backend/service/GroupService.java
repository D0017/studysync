package com.StudySync.backend.service;

import com.StudySync.backend.dto.LeadershipRequestResponse;
import com.StudySync.backend.model.ProjectGroup;
import com.StudySync.backend.model.StudyModule;
import com.StudySync.backend.model.User;
import com.StudySync.backend.repository.ProjectGroupRepository;
import com.StudySync.backend.repository.StudyModuleRepository;
import com.StudySync.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GroupService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudyModuleRepository studyModuleRepository;

    @Autowired
    private ProjectGroupRepository projectGroupRepository;

    // CREATE MODULE
    @Transactional
    public StudyModule createModule(StudyModule moduleRequest) {
        if (moduleRequest.getModuleCode() == null || moduleRequest.getModuleCode().trim().isEmpty()) {
            throw new RuntimeException("Module code is required.");
        }

        if (moduleRequest.getModuleName() == null || moduleRequest.getModuleName().trim().isEmpty()) {
            throw new RuntimeException("Module name is required.");
        }

        if (moduleRequest.getEnrollmentKey() == null || moduleRequest.getEnrollmentKey().trim().isEmpty()) {
            throw new RuntimeException("Enrollment key is required.");
        }

        String moduleCode = moduleRequest.getModuleCode().trim();
        String moduleName = moduleRequest.getModuleName().trim();
        String enrollmentKey = moduleRequest.getEnrollmentKey().trim();

        if (studyModuleRepository.existsByModuleCodeIgnoreCase(moduleCode)) {
            throw new RuntimeException("Module code already exists.");
        }

        if (studyModuleRepository.existsByEnrollmentKeyIgnoreCase(enrollmentKey)) {
            throw new RuntimeException("Enrollment key already exists.");
        }

        moduleRequest.setModuleCode(moduleCode);
        moduleRequest.setModuleName(moduleName);
        moduleRequest.setEnrollmentKey(enrollmentKey);

        return studyModuleRepository.save(moduleRequest);
    }

    // GET SINGLE MODULE
    @Transactional(readOnly = true)
    public StudyModule getModuleById(Long moduleId) {
        return studyModuleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module not found."));
    }

    // CREATE EMPTY GROUPS FOR A MODULE
    @Transactional
    public String createGroupsForModule(Long moduleId, int numberOfGroups, int maxCapacity) {
        if (numberOfGroups <= 0) {
            throw new RuntimeException("Number of groups must be greater than 0.");
        }

        if (maxCapacity <= 0) {
            throw new RuntimeException("Max capacity must be greater than 0.");
        }

        StudyModule module = studyModuleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module not found."));

        int existingGroupCount = module.getProjectGroups() != null ? module.getProjectGroups().size() : 0;

        for (int i = 1; i <= numberOfGroups; i++) {
            ProjectGroup group = new ProjectGroup();

            int nextGroupNumber = existingGroupCount + i;
            String formattedNumber = String.format("%02d", nextGroupNumber);

            group.setGroupName(module.getModuleCode() + "_Group_" + formattedNumber);
            group.setModule(module);
            group.setMaxCapacity(maxCapacity);

            projectGroupRepository.save(group);
        }

        return "Successfully created " + numberOfGroups + " groups for module " + module.getModuleCode() + ".";
    }

    // ADMIN: GET ALL MODULES
    @Transactional(readOnly = true)
    public List<StudyModule> getAllModules() {
        return studyModuleRepository.findAll();
    }

    // ADMIN: GET ACTIVE LECTURERS
    @Transactional(readOnly = true)
    public List<User> getActiveLecturers() {
        return userRepository.findByRoleAndIsActiveTrue(User.Role.LECTURER);
    }

    // ADMIN: ASSIGN / CHANGE / REMOVE LECTURER
    @Transactional
    public StudyModule assignLecturerToModule(Long moduleId, Long lecturerId) {
        StudyModule module = studyModuleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module not found."));

        // allow unassign
        if (lecturerId == null) {
            module.setLecturer(null);
            return studyModuleRepository.save(module);
        }

        User lecturer = userRepository.findById(lecturerId)
                .orElseThrow(() -> new RuntimeException("Lecturer not found."));

        if (!lecturer.isActive()) {
            throw new RuntimeException("Selected lecturer is inactive.");
        }

        if (lecturer.getRole() != User.Role.LECTURER) {
            throw new RuntimeException("Selected user is not a lecturer.");
        }

        module.setLecturer(lecturer);
        return studyModuleRepository.save(module);
    }

    // LECTURER: GET ASSIGNED MODULES
    @Transactional(readOnly = true)
    public List<StudyModule> getModulesByLecturer(Long lecturerId) {
        User lecturer = userRepository.findById(lecturerId)
                .orElseThrow(() -> new RuntimeException("Lecturer not found."));

        if (lecturer.getRole() != User.Role.LECTURER) {
            throw new RuntimeException("This user is not a lecturer.");
        }

        return studyModuleRepository.findByLecturer_Id(lecturerId);
    }

    // STUDENT: ENROLL IN MODULE
    @Transactional
    public String enrollInModule(Long studentId, String enrollmentKey) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found."));

        if (!student.isActive()) {
            throw new RuntimeException("Your account is inactive.");
        }

        if (student.getRole() != User.Role.STUDENT) {
            throw new RuntimeException("Only students can enroll in modules.");
        }

        if (enrollmentKey == null || enrollmentKey.trim().isEmpty()) {
            throw new RuntimeException("Enrollment key is required.");
        }

        StudyModule module = studyModuleRepository.findByEnrollmentKey(enrollmentKey.trim())
                .orElseThrow(() -> new RuntimeException("Invalid enrollment key."));

        if (student.getEnrolledModules().contains(module)) {
            throw new RuntimeException("You are already enrolled in this module.");
        }

        student.getEnrolledModules().add(module);
        userRepository.save(student);

        return "Successfully enrolled in " + module.getModuleName() + ".";
    }

    // GET ENROLLED MODULES
    @Transactional(readOnly = true)
    public List<StudyModule> getStudentModules(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found."));

        if (student.getRole() != User.Role.STUDENT) {
            throw new RuntimeException("Only students can view enrolled modules.");
        }

        return student.getEnrolledModules().stream().toList();
    }

    // GET GROUPS OF A MODULE
    @Transactional(readOnly = true)
    public List<ProjectGroup> getGroupsByModule(Long moduleId) {
        StudyModule module = studyModuleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module not found."));

        return module.getProjectGroups();
    }

    // STUDENT: JOIN GROUP
    @Transactional
    public String joinGroup(Long studentId, Long groupId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found."));

        if (!student.isActive()) {
            throw new RuntimeException("Your account is inactive.");
        }

        if (student.getRole() != User.Role.STUDENT) {
            throw new RuntimeException("Only students can join groups.");
        }

        ProjectGroup group = projectGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found."));

        StudyModule module = group.getModule();

        if (!student.getEnrolledModules().contains(module)) {
            throw new RuntimeException("You are not enrolled in this module.");
        }

        if (group.getCurrentMembers().contains(student)) {
            throw new RuntimeException("You are already a member of this group.");
        }

        if (projectGroupRepository.existsByModuleAndCurrentMembersContaining(module, student)) {
            throw new RuntimeException("You are already a member of another group in this module.");
        }

        if (group.getCurrentMembers().size() >= group.getMaxCapacity()) {
            throw new RuntimeException("This group is already full.");
        }

        group.getCurrentMembers().add(student);
        projectGroupRepository.save(group);

        return "Successfully joined " + group.getGroupName() + ".";
    }

    // REQUEST LEADERSHIP
    @Transactional
    public String requestLeadership(Long studentId, Long groupId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found."));

        if (!student.isActive()) {
            throw new RuntimeException("Your account is inactive.");
        }

        if (student.getRole() != User.Role.STUDENT) {
            throw new RuntimeException("Only students can request leadership.");
        }

        ProjectGroup group = projectGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found."));

        if (!group.getCurrentMembers().contains(student)) {
            throw new RuntimeException("You must join the group before requesting leadership.");
        }

        if (group.getLeader() != null) {
            throw new RuntimeException("This group already has an approved leader.");
        }

        if (group.getRequestedLeader() != null) {
            if (group.getRequestedLeader().getId().equals(student.getId())) {
                throw new RuntimeException("You have already requested leadership for this group.");
            }
            throw new RuntimeException("Another leadership request is already pending for this group.");
        }

        group.setRequestedLeader(student);
        projectGroupRepository.save(group);

        return "Leadership request sent successfully.";
    }

    @Transactional(readOnly = true)
    public List<LeadershipRequestResponse> getPendingLeadershipRequests() {
        List<ProjectGroup> pendingGroups = projectGroupRepository.findByRequestedLeaderIsNotNullAndLeaderIsNull();

        return pendingGroups.stream()
                .map(group -> new LeadershipRequestResponse(
                        group.getId(),
                        group.getGroupName(),
                        group.getModule().getId(),
                        group.getModule().getModuleCode(),
                        group.getModule().getModuleName(),
                        group.getRequestedLeader().getId(),
                        group.getRequestedLeader().getFullName(),
                        group.getRequestedLeader().getUniversityId(),
                        group.getCurrentMembers().size(),
                        group.getMaxCapacity()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public String approveLeadershipRequest(Long groupId) {
        ProjectGroup group = projectGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found."));

        if (group.getLeader() != null) {
            throw new RuntimeException("This group already has an approved leader.");
        }

        if (group.getRequestedLeader() == null) {
            throw new RuntimeException("No pending leadership request found for this group.");
        }

        User requestedStudent = group.getRequestedLeader();

        if (!group.getCurrentMembers().contains(requestedStudent)) {
            throw new RuntimeException("Requested student is not a member of this group.");
        }

        group.setLeader(requestedStudent);
        group.setRequestedLeader(null);
        projectGroupRepository.save(group);

        return requestedStudent.getFullName() + " has been approved as leader of " + group.getGroupName() + ".";
    }
}