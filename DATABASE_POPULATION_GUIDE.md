# 🗄️ Database Population Guide - StudySync

## Overview

Your database is currently empty. This guide will help you populate it with test data so you can navigate beyond the `/student-dashboard` page.

## Database Configuration

Your backend is configured to use:
- **Database**: MySQL
- **Host**: localhost:3306
- **Database Name**: studysync_db
- **Username**: root
- **Password**: Malindu@2001

---

## Option 1: Using MySQL Command Line (Recommended)

### Step 1: Connect to MySQL
```bash
mysql -u root -p
```
When prompted, enter password: `Malindu@2001`

### Step 2: Select Database
```sql
USE studysync_db;
```

### Step 3: Copy and Paste the SQL Script

Run the entire SQL script from `sample-data.sql`:

```sql
-- ============================================
-- 1. CREATE TEST USERS
-- ============================================



-- Lecturer (creates modules and groups)
INSERT INTO users (university_id, full_name, email, password, role, is_active) VALUES
('LEC00001', 'Dr. John Smith', 'john.smith@university.edu', '$2a$10$DowF2c8z7ezzjbnL.3EHiOlwJpobDHvS.XeFPX2oR9x/60T0XESEu', 'LECTURER', true),
('LEC00002', 'Prof. Sarah Johnson', 'sarah.johnson@university.edu', '$2a$10$DowF2c8z7ezzjbnL.3EHiOlwJpobDHvS.XeFPX2oR9x/60T0XESEu', 'LECTURER', true);

-- Students
INSERT INTO users (university_id, full_name, email, password, role, is_active) VALUES
('STU00001', 'Alice Johnson', 'alice.johnson@student.edu', '$2a$10$DowF2c8z7ezzjbnL.3EHiOlwJpobDHvS.XeFPX2oR9x/60T0XESEu', 'STUDENT', true),
('STU00002', 'Bob Wilson', 'bob.wilson@student.edu', '$2a$10$DowF2c8z7ezzjbnL.3EHiOlwJpobDHvS.XeFPX2oR9x/60T0XESEu', 'STUDENT', true),
('STU00003', 'Charlie Brown', 'charlie.brown@student.edu', '$2a$10$DowF2c8z7ezzjbnL.3EHiOlwJpobDHvS.XeFPX2oR9x/60T0XESEu', 'STUDENT', true),
('STU00004', 'Diana Prince', 'diana.prince@student.edu', '$2a$10$DowF2c8z7ezzjbnL.3EHiOlwJpobDHvS.XeFPX2oR9x/60T0XESEu', 'STUDENT', true),
('STU00005', 'Edward Norton', 'edward.norton@student.edu', '$2a$10$DowF2c8z7ezzjbnL.3EHiOlwJpobDHvS.XeFPX2oR9x/60T0XESEu', 'STUDENT', true),
('STU00006', 'Fiona Green', 'fiona.green@student.edu', '$2a$10$DowF2c8z7ezzjbnL.3EHiOlwJpobDHvS.XeFPX2oR9x/60T0XESEu', 'STUDENT', true),
('STU00007', 'George Miller', 'george.miller@student.edu', '$2a$10$DowF2c8z7ezzjbnL.3EHiOlwJpobDHvS.XeFPX2oR9x/60T0XESEu', 'STUDENT', true),
('STU00008', 'Hannah Lee', 'hannah.lee@student.edu', '$2a$10$DowF2c8z7ezzjbnL.3EHiOlwJpobDHvS.XeFPX2oR9x/60T0XESEu', 'STUDENT', true);

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
-- 3. CREATE PROJECT GROUPS
-- ============================================

-- Groups for CS101
INSERT INTO project_groups (group_name, module_id, max_capacity, leader_id) VALUES
('Team Alpha', 1, 5, 3),
('Team Beta', 1, 5, 4),
('Team Gamma', 1, 5, 5);

-- Groups for CS202
INSERT INTO project_groups (group_name, module_id, max_capacity, leader_id) VALUES
('Advanced Developers', 2, 5, 6),
('Code Masters', 2, 5, 7);

-- Groups for CS305
INSERT INTO project_groups (group_name, module_id, max_capacity, leader_id) VALUES
('Project Innovators', 3, 5, 8);

-- Groups for MATH101
INSERT INTO project_groups (group_name, module_id, max_capacity, leader_id) VALUES
('Math Squad', 4, 5, 3);

-- Groups for PHYSICS101
INSERT INTO project_groups (group_name, module_id, max_capacity, leader_id) VALUES
('Physics Lab Group', 5, 5, 4);

-- ============================================
-- 4. ADD GROUP MEMBERS
-- ============================================

-- Team Alpha members (group_id = 1)
INSERT INTO group_members (group_id, user_id) VALUES
(1, 3), -- Leader: Dr. John Smith
(1, 9), -- Alice Johnson
(1, 10); -- Bob Wilson

-- Team Beta members (group_id = 2)
INSERT INTO group_members (group_id, user_id) VALUES
(2, 4), -- Leader: Charlie Brown
(2, 11); -- Diana Prince

-- Team Gamma members (group_id = 3)
INSERT INTO group_members (group_id, user_id) VALUES
(3, 5), -- Leader: Edward Norton
(3, 12), -- Fiona Green
(3, 13); -- George Miller

-- Advanced Developers members (group_id = 4)
INSERT INTO group_members (group_id, user_id) VALUES
(4, 6), -- Leader: Hannah Lee
(4, 9), -- Alice Johnson
(4, 10); -- Bob Wilson

-- Code Masters members (group_id = 5)
INSERT INTO group_members (group_id, user_id) VALUES
(5, 7), -- Leader
(5, 11), -- Diana Prince
(5, 12); -- Fiona Green

-- Project Innovators members (group_id = 6)
INSERT INTO group_members (group_id, user_id) VALUES
(6, 8), -- Leader
(6, 13), -- George Miller
(6, 14); -- Hannah Lee

-- Math Squad members (group_id = 7)
INSERT INTO group_members (group_id, user_id) VALUES
(7, 3), -- Leader
(7, 9), -- Alice Johnson
(7, 10), -- Bob Wilson
(7, 11); -- Diana Prince

-- Physics Lab Group members (group_id = 8)
INSERT INTO group_members (group_id, user_id) VALUES
(8, 4), -- Leader
(8, 12), -- Fiona Green
(8, 13), -- George Miller
(8, 14); -- Hannah Lee

-- ============================================
-- 5. CREATE PROJECTS
-- ============================================

INSERT INTO projects (group_id, project_name) VALUES
(1, 'Team Alpha Final Project'),
(2, 'Team Beta Semester Project'),
(3, 'Team Gamma Web App'),
(4, 'Advanced Data Structures'),
(5, 'Code Masters Challenge'),
(6, 'Software Engineering Capstone'),
(7, 'Calculus Problem Solving'),
(8, 'Physics Simulation Project');

-- ============================================
-- 6. CREATE ISSUES
-- ============================================

-- Issues for Team Alpha Project (project_id = 1)
INSERT INTO issues (issue_number, issue_key, title, description, status, priority, type, due_date, project_id, assignee_id, reporter_id, created_at, updated_at) VALUES
(1, 'GRP-1-1', 'Setup project repository', 'Initialize Git repository and set up project structure', 'DONE', 'HIGH', 'TASK', '2026-04-01', 1, 9, 3, NOW(), NOW()),
(2, 'GRP-1-2', 'Design database schema', 'Create ERD and finalize database design', 'IN_PROGRESS', 'HIGH', 'TASK', '2026-04-05', 1, 10, 3, NOW(), NOW()),
(3, 'GRP-1-3', 'Fix login bug', 'Users cannot login with special characters in password', 'TODO', 'URGENT', 'BUG', '2026-03-28', 1, 9, 3, NOW(), NOW()),
(4, 'GRP-1-4', 'Create user dashboard mockup', 'Design mockup for user dashboard UI', 'REVIEW', 'MEDIUM', 'TASK', '2026-04-08', 1, 10, 3, NOW(), NOW());

-- Issues for Team Beta Project (project_id = 2)
INSERT INTO issues (issue_number, issue_key, title, description, status, priority, type, due_date, project_id, assignee_id, reporter_id, created_at, updated_at) VALUES
(1, 'GRP-2-1', 'Implement authentication system', 'Add JWT-based authentication', 'IN_PROGRESS', 'HIGH', 'TASK', '2026-04-10', 2, 11, 4, NOW(), NOW()),
(2, 'GRP-2-2', 'API response time is slow', 'Database queries are taking too long', 'TODO', 'HIGH', 'BUG', '2026-03-30', 2, 11, 4, NOW(), NOW());

-- Issues for Team Gamma Project (project_id = 3)
INSERT INTO issues (issue_number, issue_key, title, description, status, priority, type, due_date, project_id, assignee_id, reporter_id, created_at, updated_at) VALUES
(1, 'GRP-3-1', 'Build responsive frontend', 'Create responsive web interface using React', 'IN_PROGRESS', 'HIGH', 'TASK', '2026-04-15', 3, 12, 5, NOW(), NOW()),
(2, 'GRP-3-2', 'Mobile optimization', 'Ensure app works well on mobile devices', 'TODO', 'MEDIUM', 'TASK', '2026-04-20', 3, 13, 5, NOW(), NOW()),
(3, 'GRP-3-3', 'CSS styling issues on Safari', 'Some CSS rules not working in Safari browser', 'REVIEW', 'MEDIUM', 'BUG', '2026-03-29', 3, 12, 5, NOW(), NOW());

-- Issues for Advanced Developers Project (project_id = 4)
INSERT INTO issues (issue_number, issue_key, title, description, status, priority, type, due_date, project_id, assignee_id, reporter_id, created_at, updated_at) VALUES
(1, 'GRP-4-1', 'Implement sorting algorithms', 'Add QuickSort, MergeSort, HeapSort implementations', 'DONE', 'HIGH', 'TASK', '2026-03-25', 4, 9, 6, NOW(), NOW()),
(2, 'GRP-4-2', 'Write unit tests for sorting', 'Create comprehensive unit tests', 'IN_PROGRESS', 'HIGH', 'TASK', '2026-04-01', 4, 10, 6, NOW(), NOW()),
(3, 'GRP-4-3', 'Performance benchmark', 'Run performance tests and optimize', 'TODO', 'MEDIUM', 'TASK', '2026-04-05', 4, NULL, 6, NOW(), NOW());

-- Issues for Code Masters Project (project_id = 5)
INSERT INTO issues (issue_number, issue_key, title, description, status, priority, type, due_date, project_id, assignee_id, reporter_id, created_at, updated_at) VALUES
(1, 'GRP-5-1', 'Optimize database queries', 'Add indexing and query optimization', 'DONE', 'HIGH', 'TASK', '2026-03-20', 5, 11, 7, NOW(), NOW()),
(2, 'GRP-5-2', 'Create API documentation', 'Document all REST endpoints', 'REVIEW', 'MEDIUM', 'TASK', '2026-03-27', 5, 12, 7, NOW(), NOW());

-- Issues for Project Innovators (project_id = 6)
INSERT INTO issues (issue_number, issue_key, title, description, status, priority, type, due_date, project_id, assignee_id, reporter_id, created_at, updated_at) VALUES
(1, 'GRP-6-1', 'Write project documentation', 'Complete project documentation', 'IN_PROGRESS', 'MEDIUM', 'TASK', '2026-04-12', 6, 8, 8, NOW(), NOW()),
(2, 'GRP-6-2', 'Setup CI/CD pipeline', 'Configure GitHub Actions for automated testing', 'TODO', 'HIGH', 'TASK', '2026-04-08', 6, 13, 8, NOW(), NOW()),
(3, 'GRP-6-3', 'Memory leak in production', 'Application memory usage keeps increasing', 'TODO', 'URGENT', 'BUG', '2026-03-26', 6, NULL, 8, NOW(), NOW());

-- Issues for Math Squad (project_id = 7)
INSERT INTO issues (issue_number, issue_key, title, description, status, priority, type, due_date, project_id, assignee_id, reporter_id, created_at, updated_at) VALUES
(1, 'GRP-7-1', 'Complete calculus assignments', 'Finish all chapter exercises', 'DONE', 'MEDIUM', 'TASK', '2026-03-22', 7, 9, 3, NOW(), NOW()),
(2, 'GRP-7-2', 'Prepare for midterm exam', 'Study limits and derivatives', 'IN_PROGRESS', 'HIGH', 'TASK', '2026-04-02', 7, 10, 3, NOW(), NOW()),
(3, 'GRP-7-3', 'Review integration techniques', 'Go through integration methods', 'TODO', 'MEDIUM', 'TASK', '2026-04-09', 7, 11, 3, NOW(), NOW());

-- Issues for Physics Lab Group (project_id = 8)
INSERT INTO issues (issue_number, issue_key, title, description, status, priority, type, due_date, project_id, assignee_id, reporter_id, created_at, updated_at) VALUES
(1, 'GRP-8-1', 'Conduct lab experiment 1', 'Complete mechanics experiment', 'DONE', 'HIGH', 'TASK', '2026-03-20', 8, 12, 4, NOW(), NOW()),
(2, 'GRP-8-2', 'Analyze experiment data', 'Process and analyze lab results', 'IN_PROGRESS', 'MEDIUM', 'TASK', '2026-03-28', 8, 13, 4, NOW(), NOW()),
(3, 'GRP-8-3', 'Write lab report', 'Complete formal lab report', 'REVIEW', 'HIGH', 'TASK', '2026-04-03', 8, 14, 4, NOW(), NOW());
```

### Step 4: Verify Data
After running the script, verify the data was inserted:

```sql
-- Check users
SELECT COUNT(*) as total_users FROM users;

-- Check modules
SELECT COUNT(*) as total_modules FROM modules;

-- Check groups
SELECT COUNT(*) as total_groups FROM project_groups;

-- Check projects
SELECT COUNT(*) as total_projects FROM projects;

-- Check issues
SELECT COUNT(*) as total_issues FROM issues;
```

Expected results:
- 11 users (1 admin, 2 lecturers, 8 students)
- 5 modules
- 8 groups
- 8 projects
- 25 issues

---

## Option 2: Using MySQL Workbench

### Step 1: Open MySQL Workbench
1. Open MySQL Workbench application
2. Click on your local connection (localhost:3306)

### Step 2: Create/Select Database
```sql
USE studysync_db;
```

### Step 3: Execute SQL Script
1. Go to `File` → `Open SQL Script`
2. Navigate to `/backend/src/main/resources/sample-data.sql`
3. Click "Execute" or press `Ctrl+Shift+Enter`

---

## Option 3: Using Terminal/Command Line

### Step 1: Save the SQL Script
The script is already saved at:
```
/backend/src/main/resources/sample-data.sql
```

### Step 2: Execute via MySQL
```bash
mysql -u root -p studysync_db < /path/to/sample-data.sql
```

When prompted, enter password: `Malindu@2001`

---

## Test Credentials After Population

### 📚 For Testing Student Features
**University ID**: STU00001
**Email**: alice.johnson@student.edu
**Password**: Password123

**University ID**: STU00002
**Email**: bob.wilson@student.edu
**Password**: Password123

### 👨‍💼 For Testing Admin/Lecturer Features
**University ID**: ADM00001
**Email**: admin@studysync.com
**Password**: Password123

**University ID**: LEC00001
**Email**: john.smith@university.edu
**Password**: Password123

---

## What Data Was Created

### 1. Users (11 total)
- 1 Admin
- 2 Lecturers
- 8 Students

### 2. Modules (5 total)
- CS101: Introduction to Computer Science
- CS202: Data Structures and Algorithms
- CS305: Software Engineering
- MATH101: Calculus I
- PHYSICS101: Physics I

### 3. Project Groups (8 total)
- 3 groups in CS101
- 2 groups in CS202
- 1 group in CS305
- 1 group in MATH101
- 1 group in PHYSICS101

### 4. Projects (8 total)
- One project per group

### 5. Issues (25 total)
- Various issues in each project
- Different statuses: TODO, IN_PROGRESS, REVIEW, DONE
- Different priorities: LOW, MEDIUM, HIGH, URGENT
- Different types: TASK, BUG, STORY
- Some assigned, some unassigned

---

## Navigation Flow After Population

```
1. Login with STU00001 / Password123
   ↓
2. Click on any module (e.g., CS101)
   ↓
3. See available groups
   ↓
4. Click "Open Project Board" or "Join Group"
   ↓
5. View the Simple Board or Jira Board
   ↓
6. Create/update/manage issues
```

---

## Troubleshooting

### Error: "Table already exists"
- This is normal if you're re-inserting. Clear data first:
```sql
TRUNCATE TABLE group_members;
DELETE FROM issues;
DELETE FROM projects;
DELETE FROM project_groups;
DELETE FROM modules;
DELETE FROM users;
```

### Error: "Foreign key constraint fails"
- Make sure tables are created in the right order
- Users must exist before creating groups with leader_id references

### Password doesn't work
- All test users have password: `Password123`
- Make sure password encoding is bcrypt in your application

---

## Security Note

⚠️ **These are test credentials only!** 
- Never use these in production
- The password hash shown is for demonstration purposes
- Always use strong, unique passwords in production

---

## Next Steps After Populating

1. ✅ Database is populated
2. ✅ Restart backend server (`mvn spring-boot:run`)
3. ✅ Login with test credentials
4. ✅ Navigate to modules and groups
5. ✅ View project boards (Simple & Jira)
6. ✅ Create and manage issues
7. ✅ Test filtering and search on Jira board

---

**Status**: Ready to use ✅
**Created**: March 25, 2026
