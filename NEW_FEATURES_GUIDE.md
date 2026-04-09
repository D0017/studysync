# Jira-Like Board Integration Guide

## 📋 Overview

This document explains the complete Jira-like board integration into the StudySync project management system. The system now has two complementary views:

1. **Simple Project Board** - Basic Kanban board with 4 columns
2. **Jira Board** - Advanced project management with analytics, filtering, and reporting

---

## 🏗️ Current System Flow

### Before Jira Integration

```
User Login
    ↓
Student Dashboard (View enrolled modules)
    ↓
Module Groups (Select/join a group)
    ↓
Group Project Board (Simple Kanban with 4 status columns)
    ├── Create Issue
    ├── Update Issue Status
    └── Assign Issue
```

### After Jira Integration

```
User Login
    ↓
Student Dashboard (View enrolled modules)
    ↓
Module Groups (Select/join a group)
    ↓
    ├── [Simple Project Board] ← Switch to Jira Board
    │   └── Basic Kanban (TODO, IN_PROGRESS, REVIEW, DONE)
    │
    └── [Jira Board] ← Enhanced Features
        ├── Advanced Filtering (Priority, Type, Assignee, Search)
        ├── Project Analytics Dashboard
        ├── Issue Statistics & Progress Tracking
        ├── Assignee Workload View
        ├── Overdue Issue Alerts
        ├── Status Breakdown
        └── Issue Management (Create, Update, Assign)
```

---

## 🎯 What Was Started & What's Continued

### ✅ What You Already Have
- **Backend**: ProjectController, IssueController with CRUD operations
- **Frontend**: GroupProjectBoard component with basic Kanban board
- **Models**: Issue, Project, ProjectGroup, User entities with relationships
- **Services**: projectService.js, issueService.js for API communication

### ✨ What's Been Added (Jira Integration)

#### **Frontend Components**
1. **JiraBoard.jsx** - New advanced board component with:
   - Real-time analytics dashboard
   - Advanced filtering (status, priority, type, assignee, search)
   - Progress tracking with visual indicators
   - Enhanced issue cards with priority badges
   - Story points support (ready for expansion)
   - Collapsible create issue form
   - Clear filters button

#### **Frontend Services**
2. **jiraBoardService.js** - API service layer for:
   - Project analytics endpoint
   - Filtered issues retrieval
   - Burndown chart data
   - Issues grouped by status
   - Assignee-specific queries
   - Overdue issues
   - Priority-based queries

#### **Backend Controller**
3. **JiraBoardController.java** - REST endpoints:
   - `/api/jira/projects/{projectId}/analytics` - Get comprehensive stats
   - `/api/jira/projects/{projectId}/issues/filtered` - Advanced filtering
   - `/api/jira/projects/{projectId}/burndown` - Burndown chart data
   - `/api/jira/projects/{projectId}/issues/grouped` - Status grouping
   - `/api/jira/projects/{projectId}/issues/assignee/{assigneeId}` - Workload view
   - `/api/jira/projects/{projectId}/issues/overdue` - Overdue tracking
   - `/api/jira/projects/{projectId}/issues/priority/{priority}` - Priority filtering

#### **Backend Service**
4. **JiraBoardService.java** - Business logic for:
   - Complex analytics calculations
   - Multi-criteria filtering
   - Workload distribution
   - Burndown tracking
   - Overdue detection

---

## 🔄 Navigation Flow

### Switching Between Boards

Both components have toggle buttons to switch between each other:

**Simple Board → Jira Board**
```
Button: "📊 Jira Board" (in GroupProjectBoard)
Route: /groups/:groupId/jira-board
```

**Jira Board → Simple Board**
```
Button: "Simple Board" (in JiraBoard)
Route: /groups/:groupId/project
```

---

## 📊 Feature Comparison

| Feature | Simple Board | Jira Board |
|---------|-------------|-----------|
| Kanban View | ✅ | ✅ |
| Create Issues | ✅ | ✅ |
| Update Status | ✅ | ✅ |
| Assign Issues | ✅ | ✅ |
| **Advanced Filtering** | ❌ | ✅ |
| **Search** | ❌ | ✅ |
| **Analytics** | ❌ | ✅ |
| **Progress Tracking** | ❌ | ✅ |
| **Workload View** | ❌ | ✅ |
| **Overdue Alerts** | ❌ | ✅ |
| **Status Breakdown** | ❌ | ✅ |
| **Priority Badges** | ❌ | ✅ |
| **Story Points** | ❌ | ✅ (ready) |

---

## 🚀 How to Proceed & Extend

### Phase 1: Testing (Current)
1. ✅ Created JiraBoard component with UI
2. ✅ Created JiraBoardService with API calls
3. ✅ Created JiraBoardController with endpoints
4. ✅ Created JiraBoardService with business logic
5. **Next**: Test the integration by running the app

### Phase 2: Testing Steps
```bash
# Terminal 1: Start Backend
cd backend
mvn spring-boot:run

# Terminal 2: Start Frontend
cd frontend
npm run dev

# Then navigate to:
# 1. Login as a student
# 2. Select a module → Group
# 3. Open Simple Project Board → Click "📊 Jira Board"
```

### Phase 3: Future Enhancements

#### A. **Story Points Implementation**
```java
// Add to Issue.java model
@Column(nullable = true)
private Integer storyPoints;

// Update IssueResponseDto to include storyPoints
// Update CreateIssueRequest to accept storyPoints
```

#### B. **Sprint Management**
```java
// Create Sprint.java model
@Entity
public class Sprint {
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<Issue> issues;
    // Velocity tracking
}
```

#### C. **Advanced Reporting**
- Velocity charts
- Cumulative flow diagram
- Issue cycle time
- Team member performance

#### D. **Real-time Updates**
- WebSocket integration for live updates
- Real-time collaboration

#### E. **Export Features**
- Export to CSV/PDF
- Report generation

#### F. **Custom Workflows**
- Custom status columns
- Workflow automation

---

## 📁 File Structure

```
frontend/src/
├── components/
│   ├── ModuleGroups.jsx
│   ├── StudentDashboard.jsx
│   └── projectmanagement/
│       ├── GroupProjectBoard.jsx (Simple board)
│       └── JiraBoard.jsx (✨ NEW - Advanced board)
├── services/
│   ├── projectService.js
│   ├── issueService.js
│   └── jiraBoardService.js (✨ NEW)
└── App.jsx (Updated with JiraBoard route)

backend/src/main/java/com/StudySync/backend/
├── controller/
│   ├── ProjectController.java
│   ├── IssueController.java
│   └── JiraBoardController.java (✨ NEW)
├── service/
│   ├── ProjectService.java
│   ├── IssueService.java
│   └── JiraBoardService.java (✨ NEW)
├── model/
│   ├── Issue.java
│   ├── Project.java
│   ├── ProjectGroup.java
│   └── User.java
└── repository/
    └── IssueRepository.java
```

---

## 🔌 API Endpoints Summary

### Existing Endpoints (Unchanged)
- `POST /api/projects/groups/{groupId}` - Create project
- `GET /api/projects/groups/{groupId}` - Get project
- `POST /api/issues/projects/{projectId}` - Create issue
- `GET /api/issues/projects/{projectId}` - Get issues
- `PUT /api/issues/{issueId}/status` - Update status
- `PUT /api/issues/{issueId}/assign` - Assign issue

### New Jira Endpoints
- `GET /api/jira/projects/{projectId}/analytics` - Analytics data
- `GET /api/jira/projects/{projectId}/issues/filtered` - Filtered issues
- `GET /api/jira/projects/{projectId}/burndown` - Burndown data
- `GET /api/jira/projects/{projectId}/issues/grouped` - Grouped by status
- `GET /api/jira/projects/{projectId}/issues/assignee/{assigneeId}` - Assignee workload
- `GET /api/jira/projects/{projectId}/issues/overdue` - Overdue issues
- `GET /api/jira/projects/{projectId}/issues/priority/{priority}` - Priority filter

---

## 🎨 UI/UX Features

### Jira Board UI Elements

1. **Header Section**
   - Board title: "📊 Jira Board"
   - Toggle buttons: "Simple Board" | "Back"

2. **Analytics Dashboard** (4-column grid)
   - Project name and group
   - Total issues count
   - Progress percentage with progress bar
   - Status breakdown (To Do, In Progress, Review, Done)

3. **Advanced Filters** (5-column grid)
   - Search issues text input
   - Priority dropdown filter
   - Type dropdown filter
   - Assignee dropdown filter
   - Clear filters button

4. **Issue Creation Section**
   - Collapsible form (toggle with "Create Issue" button)
   - Form fields:
     - Title (required)
     - Description
     - Type (Task/Bug/Story)
     - Priority (Low/Medium/High/Urgent)
     - Due Date
     - Story Points (optional)
     - Assignee (optional)

5. **Kanban Board**
   - 4 columns: To Do, In Progress, Review, Done
   - Color-coded column headers
   - Issue count badges
   - Issue cards with:
     - Issue key (e.g., GRP-1-1)
     - Priority badge with color
     - Title and description preview
     - Type and points badges
     - Due date display
     - Status dropdown
     - Assignee dropdown
     - Assignee name display

---

## 💡 Key Design Decisions

### 1. **Dual Board System**
- Keep simple board for basic users
- Jira board for power users who need advanced features
- Users can switch easily without disruption

### 2. **Shared Data Model**
- Both boards use the same backend Issue/Project models
- Changes in one board immediately reflect in the other
- No data duplication

### 3. **Non-Breaking Changes**
- All existing endpoints remain unchanged
- New Jira endpoints are purely additive
- Backward compatible with existing clients

### 4. **Performance Optimizations**
- Read-only transactions for analytics queries
- Lazy loading for relationships
- Stream API for efficient filtering

### 5. **User Validation**
- Group membership validation on all requests
- Authorization checks at service layer
- Consistent error handling

---

## ✅ Testing Checklist

- [ ] Backend compiles without errors
- [ ] Frontend runs without errors
- [ ] Navigate to group project board
- [ ] Click "📊 Jira Board" button
- [ ] Jira board loads successfully
- [ ] Analytics dashboard shows correct numbers
- [ ] Create issue works and appears on board
- [ ] Filtering by priority works
- [ ] Filtering by type works
- [ ] Filtering by assignee works
- [ ] Search functionality works
- [ ] Clear filters button resets all filters
- [ ] Status change updates correctly
- [ ] Assignee change updates correctly
- [ ] Switch back to simple board works
- [ ] Create issue form collapse/expand works

---

## 🔐 Security Notes

- All endpoints validate user ID and group membership
- Users can only access projects/issues from their groups
- No cross-group data leakage
- Authorization happens at service layer

---

## 📝 Code Examples

### Using Jira Board Service (Frontend)

```javascript
import { getProjectAnalytics, getFilteredIssues } from '../services/jiraBoardService';

// Get analytics
const analytics = await getProjectAnalytics(projectId, userId);
console.log(`Progress: ${analytics.progressPercentage}%`);
console.log(`Total Issues: ${analytics.totalIssues}`);

// Get filtered issues
const filteredIssues = await getFilteredIssues(projectId, userId, {
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    assigneeId: 5,
    searchQuery: 'urgent'
});
```

### Using Jira Board Service (Backend)

```java
@Autowired
private JiraBoardService jiraBoardService;

// Get analytics
Map<String, Object> analytics = jiraBoardService.getProjectAnalytics(projectId, userId);

// Get filtered issues
List<IssueResponseDto> issues = jiraBoardService.getFilteredIssues(
    projectId, userId, "HIGH", "TASK", null, null, "search term"
);
```

---

## 🎯 Next Steps

1. **Immediate**: Run the application and test the basic Jira board functionality
2. **Short-term**: Add database migration for story points column
3. **Medium-term**: Implement sprint management
4. **Long-term**: Add advanced reporting and custom workflows

---

## 📞 Support

For any issues or questions:
1. Check the backend logs for JiraBoardController errors
2. Check browser console for frontend errors
3. Verify API endpoints are returning expected data
4. Ensure user is logged in and has group membership

---

**Status**: ✅ Ready for testing
**Created**: March 25, 2026
**Version**: 1.0
