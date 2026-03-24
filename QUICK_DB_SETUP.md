# Quick Database Population

## Single Command to Populate Database

If you want to populate the database with a single command from your terminal:

```bash
mysql -u root -pMalindu@2001 studysync_db < backend/src/main/resources/sample-data.sql
```

Or with a space after `-p`:

```bash
mysql -u root -p Malindu@2001 studysync_db < backend/src/main/resources/sample-data.sql
```

**Note**: If the command doesn't work, try:
```bash
mysql -u root --password=Malindu@2001 studysync_db < backend/src/main/resources/sample-data.sql
```

## Verify Data Was Inserted

```bash
mysql -u root -pMalindu@2001 studysync_db -e "SELECT COUNT(*) as users FROM users;"
mysql -u root -pMalindu@2001 studysync_db -e "SELECT COUNT(*) as modules FROM modules;"
mysql -u root -pMalindu@2001 studysync_db -e "SELECT COUNT(*) as groups FROM project_groups;"
```

## Test Login

After populating:

1. Start backend: `cd backend && mvn spring-boot:run`
2. Start frontend: `cd frontend && npm run dev`
3. Go to http://localhost:5173/login
4. Login with:
   - **Email**: alice.johnson@student.edu
   - **Password**: Password123

## Data Summary

✅ 11 Users (1 admin, 2 lecturers, 8 students)
✅ 5 Modules (CS101, CS202, CS305, MATH101, PHYSICS101)
✅ 8 Groups (with members and leaders assigned)
✅ 8 Projects (one per group)
✅ 25 Issues (with various statuses and priorities)

Everything is ready to test the Jira board integration! 🚀
