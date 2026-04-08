# 🧪 Complete Testing & Verification Checklist

## Phase 1: Database Setup ✅

- [ ] MySQL server is running on localhost:3306
- [ ] Database `studysync_db` exists
- [ ] User `root` with password `Malindu@2001` can connect
- [ ] Run sample-data.sql script
- [ ] Verify data insertion (see commands in QUICK_DB_SETUP.md)

**Verification**:
```bash
mysql -u root -pMalindu@2001 studysync_db -e "SELECT * FROM users LIMIT 5;"
```

---

## Phase 2: Backend Setup ✅

- [ ] Java/JDK 11+ installed
- [ ] Maven 3.6+ installed
- [ ] Backend code compiles: `mvn clean install`
- [ ] No compilation errors
- [ ] application.properties has correct database URL

**Start Backend**:
```bash
cd backend
mvn spring-boot:run
```

Expected output:
```
Started BackendApplication in X seconds
```

---

## Phase 3: Frontend Setup ✅

- [ ] Node.js 16+ installed
- [ ] npm packages installed: `npm install`
- [ ] No dependency errors
- [ ] Frontend compiles: `npm run build`

**Start Frontend**:
```bash
cd frontend
npm run dev
```

Expected output:
```
  VITE v4.x.x  ready in XXX ms
```

---

## Phase 4: Login Flow Testing ✅

### Test 1: Student Login
- [ ] Navigate to http://localhost:5173/login
- [ ] Enter email: `alice.johnson@student.edu`
- [ ] Enter password: `Password123`
- [ ] Click Login button
- [ ] Should redirect to `/student-dashboard`
- [ ] No error messages in console

**Expected Result**: Arrive at Student Dashboard with modules listed

### Test 2: Admin Login
- [ ] Go back to login page
- [ ] Enter email: `admin@studysync.com`
- [ ] Enter password: `Password123`
- [ ] Click Login button
- [ ] Should redirect to `/admin-dashboard`

**Expected Result**: Arrive at Admin Dashboard

### Test 3: Lecturer Login
- [ ] Go back to login page
- [ ] Enter email: `john.smith@university.edu`
- [ ] Enter password: `Password123`
- [ ] Click Login button
- [ ] Should redirect to appropriate dashboard

**Expected Result**: Arrive at Lecturer Dashboard

---

## Phase 5: Student Dashboard Navigation ✅

### Test 4: View Modules
- [ ] Login as student (STU00001)
- [ ] Should see list of modules
- [ ] Modules should include:
  - [ ] CS101 - Introduction to Computer Science
  - [ ] CS202 - Data Structures and Algorithms
  - [ ] CS305 - Software Engineering
  - [ ] MATH101 - Calculus I
  - [ ] PHYSICS101 - Physics I

**Data Check**:
```sql
SELECT module_name FROM modules;
```

### Test 5: Click on a Module
- [ ] Click on "CS101" module
- [ ] Should navigate to `/student/modules/1`
- [ ] Should see list of groups in that module
- [ ] Groups should include:
  - [ ] Team Alpha
  - [ ] Team Beta
  - [ ] Team Gamma

**Expected**: Module Groups page loads with 3 groups

### Test 6: Join/View Group
- [ ] Click "Join Group" or "Open Project Board"
- [ ] Should navigate to group details
- [ ] Should see group members
- [ ] Should see option to "Open Project Board"

**Expected**: Can see group members and actions

---

## Phase 6: Simple Project Board Testing ✅

### Test 7: View Simple Board
- [ ] Click "Open Project Board"
- [ ] Should navigate to `/groups/:groupId/project`
- [ ] Should see simple Kanban board with 4 columns:
  - [ ] To Do
  - [ ] In Progress
  - [ ] Review
  - [ ] Done

**Expected**: Simple board loads with issues

### Test 8: View Issues
- [ ] Should see issues distributed across columns
- [ ] Each issue should show:
  - [ ] Issue key (e.g., GRP-1-1)
  - [ ] Issue title
  - [ ] Issue type and priority
  - [ ] Assignee (if assigned)

**Data Check**:
```sql
SELECT COUNT(*) FROM issues WHERE project_id = 1;
```

### Test 9: Create Issue
- [ ] Click "Create Issue" button
- [ ] Fill in form:
  - [ ] Title: "Test Issue"
  - [ ] Description: "This is a test"
  - [ ] Type: TASK
  - [ ] Priority: HIGH
- [ ] Click Submit
- [ ] New issue should appear on board in "To Do" column

**Expected**: Issue created successfully

### Test 10: Update Issue Status
- [ ] Click issue status dropdown
- [ ] Change status from "To Do" to "In Progress"
- [ ] Issue should move to "In Progress" column

**Expected**: Status update works

### Test 11: Assign Issue
- [ ] Click assignee dropdown on an issue
- [ ] Select a team member
- [ ] Assignee should display on issue card

**Expected**: Issue assignment works

---

## Phase 7: Jira Board Testing ✅

### Test 12: Navigate to Jira Board
- [ ] Click "📊 Jira Board" button on Simple Board
- [ ] Should navigate to `/groups/:groupId/jira-board`
- [ ] Should see:
  - [ ] "Jira Board" header
  - [ ] Analytics dashboard with 4 stat cards
  - [ ] Filter section
  - [ ] Kanban board columns

**Expected**: Jira board loads successfully

### Test 13: Analytics Dashboard
- [ ] Should display 4 stat cards:
  - [ ] Project name
  - [ ] Total issues count
  - [ ] Progress percentage
  - [ ] Status breakdown

- [ ] Check analytics are correct:
  - [ ] Total issues matches actual count
  - [ ] Progress % is calculated correctly
  - [ ] Status breakdown totals match

**Expected**: Analytics display correct data

### Test 14: Advanced Filtering
- [ ] Filter by Priority:
  - [ ] Select "HIGH"
  - [ ] Should show only high priority issues
  
- [ ] Filter by Type:
  - [ ] Select "BUG"
  - [ ] Should show only bug issues
  
- [ ] Filter by Assignee:
  - [ ] Select a team member
  - [ ] Should show only issues assigned to that person

- [ ] Search:
  - [ ] Type "Setup" in search
  - [ ] Should show issues matching the search term

- [ ] Clear Filters:
  - [ ] Click "Clear Filters"
  - [ ] All filters should reset
  - [ ] All issues should display again

**Expected**: All filters work correctly

### Test 15: Create Issue in Jira Board
- [ ] Click "+ Create Issue" button
- [ ] Form should expand
- [ ] Fill in:
  - [ ] Title
  - [ ] Description
  - [ ] Type
  - [ ] Priority
  - [ ] Due Date
  - [ ] Story Points (optional)
  - [ ] Assignee
- [ ] Click "Create Issue"
- [ ] Issue should appear on board

**Expected**: Issue creation works with all fields

### Test 16: Collapse/Expand Create Form
- [ ] Click "+ Create Issue"
- [ ] Form should show
- [ ] Click "Cancel" or "✕ Cancel"
- [ ] Form should collapse

**Expected**: Form toggle works

### Test 17: Switch Back to Simple Board
- [ ] Click "Simple Board" button
- [ ] Should navigate back to `/groups/:groupId/project`
- [ ] Should see simple board view

**Expected**: Can switch between boards freely

---

## Phase 8: Data Verification ✅

### Test 18: Verify User Data
```sql
SELECT * FROM users LIMIT 3;
```
- [ ] Admin user exists
- [ ] Lecturer users exist
- [ ] Student users exist
- [ ] All have role set correctly

### Test 19: Verify Module Data
```sql
SELECT * FROM modules;
```
- [ ] 5 modules exist
- [ ] All have module codes and names
- [ ] All have enrollment keys

### Test 20: Verify Group Data
```sql
SELECT pg.group_name, m.module_name, COUNT(gm.user_id) as members 
FROM project_groups pg
JOIN modules m ON pg.module_id = m.id
LEFT JOIN group_members gm ON pg.id = gm.group_id
GROUP BY pg.id;
```
- [ ] 8 groups exist
- [ ] Groups are distributed across modules
- [ ] Groups have members

### Test 21: Verify Project Data
```sql
SELECT p.project_name, pg.group_name, COUNT(i.id) as issues
FROM projects p
JOIN project_groups pg ON p.group_id = pg.id
LEFT JOIN issues i ON p.id = i.project_id
GROUP BY p.id;
```
- [ ] 8 projects exist
- [ ] Each group has a project
- [ ] Projects have issues

### Test 22: Verify Issue Data
```sql
SELECT status, COUNT(*) FROM issues GROUP BY status;
```
- [ ] Issues are distributed across statuses
- [ ] Some are DONE, IN_PROGRESS, REVIEW, TODO

---

## Phase 9: Browser Console Testing ✅

### Test 23: Check Console for Errors
- [ ] Open browser DevTools (F12)
- [ ] Go to Console tab
- [ ] Login and navigate through pages
- [ ] Check for red errors ❌

**Expected**: No errors, only info/warnings

### Test 24: Check Network Tab
- [ ] Open Network tab in DevTools
- [ ] Load Jira board
- [ ] Check all API calls return 200/201:
  - [ ] `/api/projects/groups/{groupId}`
  - [ ] `/api/issues/projects/{projectId}`
  - [ ] `/api/jira/projects/{projectId}/analytics`
  - [ ] `/api/jira/projects/{projectId}/issues/filtered`

**Expected**: All API calls successful

---

## Phase 10: Backend Logs Testing ✅

### Test 25: Check Backend Console
- [ ] Look at backend terminal output
- [ ] Should see log messages for:
  - [ ] Database connections
  - [ ] API requests
  - [ ] No stack traces or errors

**Expected**: Clean backend logs

---

## Phase 11: Performance Testing ✅

### Test 26: Load Time
- [ ] Time how long pages take to load
- [ ] Simple Board: < 2 seconds
- [ ] Jira Board: < 2 seconds
- [ ] Analytics: < 1 second

**Expected**: Pages load quickly

### Test 27: Issue Creation
- [ ] Create 5 new issues
- [ ] Should complete within 1 second each

**Expected**: Issue creation is fast

---

## Phase 12: Final Verification ✅

### Checklist Summary
- [ ] Database populated with 11 users
- [ ] Database populated with 5 modules
- [ ] Database populated with 8 groups
- [ ] Database populated with 8 projects
- [ ] Database populated with 25 issues
- [ ] Backend compiles and runs
- [ ] Frontend compiles and runs
- [ ] Student can login
- [ ] Can navigate to modules
- [ ] Can navigate to groups
- [ ] Can open simple project board
- [ ] Can open Jira board
- [ ] Can create issues
- [ ] Can update issue status
- [ ] Can assign issues
- [ ] Can filter issues on Jira board
- [ ] Can search issues
- [ ] Can switch between boards
- [ ] No console errors
- [ ] All API calls successful

---

## Troubleshooting Guide

### Issue: Can't connect to database
```
Error: Access denied for user 'root'@'localhost'
```
**Solution**: 
- Check MySQL is running: `mysql -u root -pMalindu@2001`
- Verify password in application.properties
- Check database name is `studysync_db`

### Issue: No modules showing in dashboard
```
SELECT COUNT(*) FROM modules;
```
**Solution**:
- Run sample-data.sql script
- Verify modules table has data
- Restart backend server

### Issue: Can't see groups in module
```
SELECT COUNT(*) FROM project_groups WHERE module_id = 1;
```
**Solution**:
- Verify groups exist in database
- Check group_members table has data
- Ensure student is a member of group

### Issue: Issues not showing on board
```
SELECT COUNT(*) FROM issues WHERE project_id = 1;
```
**Solution**:
- Verify issues exist in database
- Check project exists
- Verify assignee_id references valid user

### Issue: Jira board not loading
- Check browser console for errors (F12)
- Verify backend API is running
- Check network tab for failed requests
- Restart backend server

---

## Success Criteria

✅ You know you're successful when:
1. ✅ Can login with test credentials
2. ✅ Can see 5 modules on dashboard
3. ✅ Can see groups in modules
4. ✅ Can open project boards
5. ✅ Can see issues on boards
6. ✅ Can create new issues
7. ✅ Can update issue status
8. ✅ Can filter and search issues
9. ✅ Can switch between simple and Jira boards
10. ✅ No errors in console

---

**Last Updated**: March 25, 2026
**Status**: Complete ✅
