-- StudySync Database - Sample Data Insert Script
-- Run this script to populate the database with test data

-- ============================================
-- 1. CREATE TEST USERS (10 total)
-- ============================================

-- Students (will be IDs 1-8)
INSERT INTO users (university_id, full_name, email, password, role, is_active) VALUES
('STU00001', 'Alice Johnson', 'alice.johnson@student.edu', '$2a$10$DowF2c8z7ezzjbnL.3EHiOlwJpobDHvS.XeFPX2oR9x/60T0XESEu', 'STUDENT', true),
('STU00002', 'Bob Wilson', 'bob.wilson@student.edu', '$2a$10$DowF2c8z7ezzjbnL.3EHiOlwJpobDHvS.XeFPX2oR9x/60T0XESEu', 'STUDENT', true),
('STU00003', 'Charlie Brown', 'charlie.brown@student.edu', '$2a$10$DowF2c8z7ezzjbnL.3EHiOlwJpobDHvS.XeFPX2oR9x/60T0XESEu', 'STUDENT', true),
('STU00004', 'Diana Prince', 'diana.prince@student.edu', '$2a$10$DowF2c8z7ezzjbnL.3EHiOlwJpobDHvS.XeFPX2oR9x/60T0XESEu', 'STUDENT', true),
('STU00005', 'Edward Norton', 'edward.norton@student.edu', '$2a$10$DowF2c8z7ezzjbnL.3EHiOlwJpobDHvS.XeFPX2oR9x/60T0XESEu', 'STUDENT', true),
('STU00006', 'Fiona Green', 'fiona.green@student.edu', '$2a$10$DowF2c8z7ezzjbnL.3EHiOlwJpobDHvS.XeFPX2oR9x/60T0XESEu', 'STUDENT', true),
('STU00007', 'George Miller', 'george.miller@student.edu', '$2a$10$DowF2c8z7ezzjbnL.3EHiOlwJpobDHvS.XeFPX2oR9x/60T0XESEu', 'STUDENT', true),
('STU00008', 'Hannah Lee', 'hannah.lee@student.edu', '$2a$10$DowF2c8z7ezzjbnL.3EHiOlwJpobDHvS.XeFPX2oR9x/60T0XESEu', 'STUDENT', true);

-- Lecturers (will be IDs 9-10)
INSERT INTO users (university_id, full_name, email, password, role, is_active) VALUES
('LEC00001', 'Dr. John Smith', 'john.smith@university.edu', '$2a$10$DowF2c8z7ezzjbnL.3EHiOlwJpobDHvS.XeFPX2oR9x/60T0XESEu', 'LECTURER', true),
('LEC00002', 'Prof. Sarah Johnson', 'sarah.johnson@university.edu', '$2a$10$DowF2c8z7ezzjbnL.3EHiOlwJpobDHvS.XeFPX2oR9x/60T0XESEu', 'LECTURER', true);

-- ============================================
-- 2. CREATE STUDY MODULES
-- ============================================

INSERT INTO modules (module_code, module_name, year, semester, enrollment_key) VALUES
('CS101', 'Introduction to Computer Science', 1, 1, 'CS101-2024-S1'),
('CS202', 'Data Structures and Algorithms', 2, 1, 'CS202-2024-S1'),
('CS305', 'Software Engineering', 3, 1, 'CS305-2024-S1'),
('MATH101', 'Calculus I', 1, 1, 'MATH101-2024-S1'),
('PHYSICS101', 'Physics I', 1, 1, 'PHYSICS101-2024-S1');

-- ============================================
-- 3. CREATE PROJECT GROUPS (with correct leader_id references)
-- ============================================

-- Groups for CS101 (leaders: Alice=1, Bob=2, Charlie=3)
INSERT INTO project_groups (group_name, module_id, max_capacity, leader_id) VALUES
('Team Alpha', 1, 5, 1),
('Team Beta', 1, 5, 2),
('Team Gamma', 1, 5, 3);

-- Groups for CS202 (leaders: Diana=4, Edward=5)
INSERT INTO project_groups (group_name, module_id, max_capacity, leader_id) VALUES
('Advanced Developers', 2, 5, 4),
('Code Masters', 2, 5, 5);

-- Groups for CS305 (leader: Fiona=6)
INSERT INTO project_groups (group_name, module_id, max_capacity, leader_id) VALUES
('Project Innovators', 3, 5, 6);

-- Groups for MATH101 (leader: George=7)
INSERT INTO project_groups (group_name, module_id, max_capacity, leader_id) VALUES
('Math Squad', 4, 5, 7);

-- Groups for PHYSICS101 (leader: Hannah=8)
INSERT INTO project_groups (group_name, module_id, max_capacity, leader_id) VALUES
('Physics Lab Group', 5, 5, 8);

-- ============================================
-- 4. ADD GROUP MEMBERS
-- ============================================

-- Team Alpha members (group_id = 1, leader = Alice=1)
INSERT INTO group_members (group_id, user_id) VALUES
(1, 1), -- Leader: Alice Johnson
(1, 2), -- Bob Wilson
(1, 9); -- Dr. John Smith

-- Team Beta members (group_id = 2, leader = Bob=2)
INSERT INTO group_members (group_id, user_id) VALUES
(2, 2), -- Leader: Bob Wilson
(2, 4); -- Diana Prince

-- Team Gamma members (group_id = 3, leader = Charlie=3)
INSERT INTO group_members (group_id, user_id) VALUES
(3, 3), -- Leader: Charlie Brown
(3, 6), -- Fiona Green
(3, 7); -- George Miller

-- Advanced Developers members (group_id = 4, leader = Diana=4)
INSERT INTO group_members (group_id, user_id) VALUES
(4, 4), -- Leader: Diana Prince
(4, 1), -- Alice Johnson
(4, 2); -- Bob Wilson

-- Code Masters members (group_id = 5, leader = Edward=5)
INSERT INTO group_members (group_id, user_id) VALUES
(5, 5), -- Leader: Edward Norton
(5, 4), -- Diana Prince
(5, 6); -- Fiona Green

-- Project Innovators members (group_id = 6, leader = Fiona=6)
INSERT INTO group_members (group_id, user_id) VALUES
(6, 6), -- Leader: Fiona Green
(6, 7), -- George Miller
(6, 8); -- Hannah Lee

-- Math Squad members (group_id = 7, leader = George=7)
INSERT INTO group_members (group_id, user_id) VALUES
(7, 7), -- Leader: George Miller
(7, 1), -- Alice Johnson
(7, 2), -- Bob Wilson
(7, 4); -- Diana Prince

-- Physics Lab Group members (group_id = 8, leader = Hannah=8)
INSERT INTO group_members (group_id, user_id) VALUES
(8, 8), -- Leader: Hannah Lee
(8, 6), -- Fiona Green
(8, 7), -- George Miller
(8, 9); -- Dr. John Smith

-- ============================================
-- 5. CREATE PROJECTS
-- ============================================

INSERT INTO projects (group_id, name, created_at, updated_at) VALUES
(1, 'Team Alpha Final Project', NOW(), NOW()),
(2, 'Team Beta Semester Project', NOW(), NOW()),
(3, 'Team Gamma Web App', NOW(), NOW()),
(4, 'Advanced Data Structures', NOW(), NOW()),
(5, 'Code Masters Challenge', NOW(), NOW()),
(6, 'Software Engineering Capstone', NOW(), NOW()),
(7, 'Calculus Problem Solving', NOW(), NOW()),
(8, 'Physics Simulation Project', NOW(), NOW());

-- ============================================
-- 6. CREATE ISSUES (with corrected user IDs: 1-8 are students, 9-10 are lecturers)
-- ============================================

-- Issues for Team Alpha Project (project_id = 1, reporter: Alice=1, assignees: Bob=2, Dr. John=9)
INSERT INTO issues (issue_number, issue_key, title, description, status, priority, type, due_date, project_id, assignee_id, reporter_id, created_at, updated_at) VALUES
(1, 'GRP-1-1', 'Setup project repository', 'Initialize Git repository and set up project structure', 'DONE', 'HIGH', 'TASK', '2026-04-01', 1, 2, 1, NOW(), NOW()),
(2, 'GRP-1-2', 'Design database schema', 'Create ERD and finalize database design', 'IN_PROGRESS', 'HIGH', 'TASK', '2026-04-05', 1, 9, 1, NOW(), NOW()),
(3, 'GRP-1-3', 'Fix login bug', 'Users cannot login with special characters in password', 'TODO', 'URGENT', 'BUG', '2026-03-28', 1, 2, 1, NOW(), NOW()),
(4, 'GRP-1-4', 'Create user dashboard mockup', 'Design mockup for user dashboard UI', 'REVIEW', 'MEDIUM', 'TASK', '2026-04-08', 1, 9, 1, NOW(), NOW());

-- Issues for Team Beta Project (project_id = 2, reporter: Bob=2, assignees: Diana=4)
INSERT INTO issues (issue_number, issue_key, title, description, status, priority, type, due_date, project_id, assignee_id, reporter_id, created_at, updated_at) VALUES
(1, 'GRP-2-1', 'Implement authentication system', 'Add JWT-based authentication', 'IN_PROGRESS', 'HIGH', 'TASK', '2026-04-10', 2, 4, 2, NOW(), NOW()),
(2, 'GRP-2-2', 'API response time is slow', 'Database queries are taking too long', 'TODO', 'HIGH', 'BUG', '2026-03-30', 2, 4, 2, NOW(), NOW());

-- Issues for Team Gamma Project (project_id = 3, reporter: Charlie=3, assignees: Fiona=6, George=7)
INSERT INTO issues (issue_number, issue_key, title, description, status, priority, type, due_date, project_id, assignee_id, reporter_id, created_at, updated_at) VALUES
(1, 'GRP-3-1', 'Build responsive frontend', 'Create responsive web interface using React', 'IN_PROGRESS', 'HIGH', 'TASK', '2026-04-15', 3, 6, 3, NOW(), NOW()),
(2, 'GRP-3-2', 'Mobile optimization', 'Ensure app works well on mobile devices', 'TODO', 'MEDIUM', 'TASK', '2026-04-20', 3, 7, 3, NOW(), NOW()),
(3, 'GRP-3-3', 'CSS styling issues on Safari', 'Some CSS rules not working in Safari browser', 'REVIEW', 'MEDIUM', 'BUG', '2026-03-29', 3, 6, 3, NOW(), NOW());

-- Issues for Advanced Developers Project (project_id = 4, reporter: Diana=4, assignees: Alice=1, Bob=2)
INSERT INTO issues (issue_number, issue_key, title, description, status, priority, type, due_date, project_id, assignee_id, reporter_id, created_at, updated_at) VALUES
(1, 'GRP-4-1', 'Implement sorting algorithms', 'Add QuickSort, MergeSort, HeapSort implementations', 'DONE', 'HIGH', 'TASK', '2026-03-25', 4, 1, 4, NOW(), NOW()),
(2, 'GRP-4-2', 'Write unit tests for sorting', 'Create comprehensive unit tests', 'IN_PROGRESS', 'HIGH', 'TASK', '2026-04-01', 4, 2, 4, NOW(), NOW()),
(3, 'GRP-4-3', 'Performance benchmark', 'Run performance tests and optimize', 'TODO', 'MEDIUM', 'TASK', '2026-04-05', 4, NULL, 4, NOW(), NOW());

-- Issues for Code Masters Project (project_id = 5, reporter: Edward=5, assignees: Diana=4, Fiona=6)
INSERT INTO issues (issue_number, issue_key, title, description, status, priority, type, due_date, project_id, assignee_id, reporter_id, created_at, updated_at) VALUES
(1, 'GRP-5-1', 'Optimize database queries', 'Add indexing and query optimization', 'DONE', 'HIGH', 'TASK', '2026-03-20', 5, 4, 5, NOW(), NOW()),
(2, 'GRP-5-2', 'Create API documentation', 'Document all REST endpoints', 'REVIEW', 'MEDIUM', 'TASK', '2026-03-27', 5, 6, 5, NOW(), NOW());

-- Issues for Project Innovators (project_id = 6, reporter: Fiona=6, assignees: George=7, Hannah=8)
INSERT INTO issues (issue_number, issue_key, title, description, status, priority, type, due_date, project_id, assignee_id, reporter_id, created_at, updated_at) VALUES
(1, 'GRP-6-1', 'Write project documentation', 'Complete project documentation', 'IN_PROGRESS', 'MEDIUM', 'TASK', '2026-04-12', 6, 6, 6, NOW(), NOW()),
(2, 'GRP-6-2', 'Setup CI/CD pipeline', 'Configure GitHub Actions for automated testing', 'TODO', 'HIGH', 'TASK', '2026-04-08', 6, 7, 6, NOW(), NOW()),
(3, 'GRP-6-3', 'Memory leak in production', 'Application memory usage keeps increasing', 'TODO', 'URGENT', 'BUG', '2026-03-26', 6, NULL, 6, NOW(), NOW());

-- Issues for Math Squad (project_id = 7, reporter: George=7, assignees: Alice=1, Bob=2, Diana=4)
INSERT INTO issues (issue_number, issue_key, title, description, status, priority, type, due_date, project_id, assignee_id, reporter_id, created_at, updated_at) VALUES
(1, 'GRP-7-1', 'Complete calculus assignments', 'Finish all chapter exercises', 'DONE', 'MEDIUM', 'TASK', '2026-03-22', 7, 1, 7, NOW(), NOW()),
(2, 'GRP-7-2', 'Prepare for midterm exam', 'Study limits and derivatives', 'IN_PROGRESS', 'HIGH', 'TASK', '2026-04-02', 7, 2, 7, NOW(), NOW()),
(3, 'GRP-7-3', 'Review integration techniques', 'Go through integration methods', 'TODO', 'MEDIUM', 'TASK', '2026-04-09', 7, 4, 7, NOW(), NOW());

-- Issues for Physics Lab Group (project_id = 8, reporter: Hannah=8, assignees: Fiona=6, George=7, Dr. John=9)
INSERT INTO issues (issue_number, issue_key, title, description, status, priority, type, due_date, project_id, assignee_id, reporter_id, created_at, updated_at) VALUES
(1, 'GRP-8-1', 'Conduct lab experiment 1', 'Complete mechanics experiment', 'DONE', 'HIGH', 'TASK', '2026-03-20', 8, 6, 8, NOW(), NOW()),
(2, 'GRP-8-2', 'Analyze experiment data', 'Process and analyze lab results', 'IN_PROGRESS', 'MEDIUM', 'TASK', '2026-03-28', 8, 7, 8, NOW(), NOW()),
(3, 'GRP-8-3', 'Write lab report', 'Complete formal lab report', 'REVIEW', 'HIGH', 'TASK', '2026-04-03', 8, 9, 8, NOW(), NOW());

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
-- All sample data has been inserted successfully!
-- 
-- Login Credentials:
-- ==================
-- Student: STU00001 (Alice Johnson) / alice.johnson@student.edu
-- Password: Password123 (all users have same password)
--
-- Student: STU00002 (Bob Wilson) / bob.wilson@student.edu
-- Lecturer: LEC00001 (Dr. John Smith) / john.smith@university.edu
--
-- Notes:
-- - All passwords are hashed with bcrypt: $2a$10$DowF2c8z7ezzjbnL.3EHiOlwJpobDHvS.XeFPX2oR9x/60T0XESEu
-- - The plain password is: Password123
-- - All users are active (is_active = true)
-- - All modules have enrollment keys for students to join
-- - All groups have leaders and members already assigned
-- - All projects have issues with various statuses and priorities
--
-- Student: STU00002 (Bob Wilson) / bob.wilson@student.edu
-- Admin: ADM00001 (Admin User) / admin@studysync.com
-- Lecturer: LEC00001 (Dr. John Smith) / john.smith@university.edu
--
-- Notes:
-- - All passwords are hashed with bcrypt: $2a$10$DowF2c8z7ezzjbnL.3EHiOlwJpobDHvS.XeFPX2oR9x/60T0XESEu
-- - The plain password is: Password123
-- - All users are active (is_active = true)
-- - All modules have enrollment keys for students to join
-- - All groups have leaders and members already assigned
-- - All projects have issues with various statuses and priorities
