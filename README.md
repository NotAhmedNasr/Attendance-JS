# Attendance-JS
 Attendance client side app

## Basic Usage
### Authorization
- Registration for **new** users
- Login for only **approved** users to Profile
- Login for **admin** to Adminstration
- Only **Sub-Admin** can go to Attendance from Profile

### Registeration
- Applicant **must** fill all fields correctly
- Applicant **can't** use an already registered email
- After submit an email will be sent to Adminstration
- User can go to login page from registration if he already has an account

### Login
- User **must** provide a valid, approved username
- User **must** provide a valid password
- Username and Password are unique for each user and are sent to them via email
- Admin can log to Adminstration using the same login form
- User can go to registration to make new account

### Profile
- Shows basic info of the user
- Has a reports' section that he can use to view his attendance
- Daily reports show the time off arrival on a specific day
- Monthly reports show the number of attendance, late, absence in a specific month
- Only Sub-Admin will have the ability to go to attendance page

### Attendance
- The system is designed to open at 8:00 AM and close at 10:00 AM
- There is a timer that shows the time remaining until system shutsdown
- At the time of shutdown all the employees that haven't recorded attendance will be considered absent
- Just before the system shutdown all data will be saved automatically
- Attendance can't be taken to the same employee twice in the same day
- After taking attendance confirmation will be shown with emploee's name and time of attendance recorded
- An employee's attendace can be assigned as excuse

### Admin
- Only Admin can access Adminstration
- Admin can assign an Attendance official by his username
- Only one official can be assigned at a time
- Admin can view incoming requests
- If approved, a random username and password will be generated for the applicant and sent to him via email
- If rejected, the request will be removed from the requests list
- Admin can view all employees info but not their passwords
- Admin can view monthly attendance reports of all employees

## Trying the functionality
- To try attendance:
- the times of opening and closing of the system can be changed at helpers.js
- System-open and close must be given int values from 0 to 23
- The attendance logic will only appear during opening period
- Opening and closing are set by default to 8, 10 respectively