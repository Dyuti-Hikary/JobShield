JOBSHIELD
Fake Job Post Detection & Verification Platform

Project Overview
----------------
JobShield is a web-based platform designed to help job seekers identify
and avoid fraudulent or suspicious job postings.

The system analyzes job information and provides a risk level to help
users understand whether a job posting appears trustworthy or potentially
fraudulent.

Main Features
-------------
1. User Login
2. Job Browsing
3. Job Search
4. Job Details
5. Fraud Risk Detection
6. Risk Level Display
7. Company Verification
8. Fraud Indicators
9. Report Suspicious Jobs
10. Admin Management

Project Structure
-----------------
frontend/
    Contains the user interface of JobShield.
    HTML, CSS and JavaScript files are stored here.

backend/
    Contains the server-side application.

backend/server.js
    Main backend server file.

backend/services/
    Contains the fraud detection logic.

backend/data/
    Contains JSON files used as temporary project data.

    users.json
    jobs.json
    companies.json
    reports.json

Technologies Used
-----------------
Frontend:
- HTML
- CSS
- JavaScript

Backend:
- Node.js
- Express.js
- JavaScript

Data:
- JSON

Database:
- SQL database structure is prepared separately for future integration.

Fraud Detection
---------------
JobShield uses rule-based fraud detection to analyze job postings.

Possible indicators include:
- Suspicious email addresses
- Unverified companies
- Missing company information
- Suspicious job descriptions
- Unrealistic salary information
- Other unusual job-posting patterns

The system generates a risk level such as:
- LOW
- MEDIUM
- HIGH

Purpose
-------
The main purpose of JobShield is to improve trust in online job
advertisements and help job seekers identify potentially fraudulent
job postings before applying.

Future Improvements
-------------------
- MySQL database integration
- JWT-based authentication
- Password encryption
- Machine Learning based fraud detection
- Advanced company verification
- Admin dashboard
- Real-time notifications
- Advanced reporting system

Project Status
--------------
This project is developed as a university Software Engineering project
and currently uses JSON-based data storage for demonstration and testing.
A SQL database can be integrated in the future.
