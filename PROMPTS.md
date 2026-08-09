# PROMPTS.md

# The Interview Agent
## AI-Assisted Development Prompt & Development Log

---

## Purpose

This document records the AI-assisted development process used while building **The Interview Agent**.

ChatGPT was used as an AI engineering copilot for requirements analysis, architecture, UI/UX, React, Tailwind CSS, Node.js, Express APIs, SQLite, authentication, candidate workflows, meetings, interview-room development, AI interview design, prompt engineering, debugging, deployment troubleshooting, and documentation.

The development process was iterative:

```text
Requirement
    ↓
Discuss with ChatGPT
    ↓
Plan implementation
    ↓
Generate or modify code
    ↓
Run application
    ↓
Test feature
    ↓
Inspect browser/server errors
    ↓
Provide error or screenshot to ChatGPT
    ↓
Debug
    ↓
Modify implementation
    ↓
Test again
    ↓
Commit changes
```

---

## Project Context

The project was created for an AI engineering hackathon.

The challenge was to build an AI Interview Agent capable of conducting a personalized technical interview based on a candidate's learning journey through an AI engineering cohort.

The cohort includes topics such as:

- Retrieval-Augmented Generation (RAG)
- Vector Databases
- Prompt Engineering
- Agentic AI
- Model Context Protocol (MCP)
- AI Deployment
- Production AI Systems

The interview agent is intended to conduct a realistic multi-turn technical interview rather than a fixed scripted questionnaire.

Required behavior includes:

- Assess completed concepts
- Adapt to candidate responses
- Ask intelligent follow-up questions
- Maintain conversation context
- Cover multiple curriculum areas
- Produce structured feedback

---

## Initial Problem Understanding

### Prompt

> I need to build an AI Interview Agent for an AI engineering cohort hackathon.
>
> The agent needs to conduct a realistic multi-turn technical interview based on a candidate's learning journey.
>
> It should:
> - assess concepts the candidate completed
> - adapt naturally during the conversation
> - ask intelligent follow-up questions
> - maintain context
> - provide actionable feedback
> - behave like a real technical interview rather than a scripted questionnaire

### Result

The requirements were broken into:

- Candidate Context
- Curriculum Context
- Interview Engine
- Conversation Context
- Adaptive Questioning
- Follow-up Questions
- Evaluation
- Reports
- Authentication
- Admin Workflow
- Employee Workflow
- Meetings
- Interview Room
- Deployment

---

## Requirement Breakdown

### Prompt

> Analyze the hackathon requirements and convert them into an implementation plan.
>
> The minimum interview requirements are:
> - conversational technical interview
> - minimum 8 questions
> - at least 4 different curriculum days
> - follow-up questions based on previous responses
> - conversation context
> - structured feedback
> - required HTTP endpoint

### Result

The interview architecture was planned around maintaining:

```text
Candidate
Curriculum
Completed Topics
Questions
Answers
Interview History
Covered Topics
Follow-up Questions
Evaluation Signals
Interview Progress
Final Evaluation
```

The interview should not simply select random questions. It should understand what has already been discussed and use candidate responses to determine what to ask next.

---

## Application Architecture

### Prompt

> Help me design a practical architecture for an AI Interview Agent.
>
> I need:
> - React frontend
> - backend API
> - database
> - authentication
> - admin workflow
> - employee workflow
> - candidate management
> - interview workflow
> - meetings
> - reports
>
> Keep it practical enough to build and deploy during a hackathon.

### Result

The project was structured around:

```text
React Frontend
       ↓
REST API
       ↓
Express Backend
       ↓
SQLite Database
       ↓
Interview / Evaluation Workflow
```

Technologies used included:

- React
- Tailwind CSS
- Lucide React
- React Router
- Node.js
- Express
- SQLite
- better-sqlite3
- JWT
- bcrypt

---

## Authentication

### Prompt

> Implement authentication using Express, SQLite, bcrypt, and JWT.
>
> There should be two roles:
> - admin
> - employee
>
> Users should log in and receive a JWT.
>
> The frontend should store the authenticated session and send the token with protected API requests.
>
> Protected backend routes should verify the JWT and enforce role permissions.

### Result

Authentication was implemented using:

```text
bcrypt
JWT
Express middleware
Role-based authorization
Protected API routes
Frontend localStorage session
Login
Logout
```

The JWT contains:

```text
id
email
role
name
```

---

## JWT Middleware

### Prompt

> Create reusable Express authentication middleware.
>
> The middleware should:
> - read the Authorization header
> - require Bearer authentication
> - verify the JWT
> - attach the decoded user to req.user
> - return 401 for invalid authentication
>
> Also create requireRole(role) middleware that returns 403 when the authenticated user does not have the required role.

### Result

The backend authentication middleware was implemented around:

```text
authenticateToken()
requireRole()
```

Authentication flow:

```text
Authorization header
        ↓
Bearer token
        ↓
JWT verification
        ↓
req.user
        ↓
role validation
```

---

## Database Design

### Prompt

> Design a SQLite database for the application.
>
> I need tables for:
> - users
> - employee interview requests
> - meetings
> - interview reports
>
> Include fields for candidate information, resume information, meetings, interview evaluation, scores, recommendations, and timestamps.

### Result

The database contains four main tables.

### users

```text
id
name
email
password
role
created_at
updated_at
```

### employee_requests

```text
id
name
email
status
ai_score
resume_original_name
resume_filename
resume_path
resume_url
resume_size
resume_uploaded_at
created_at
updated_at
```

### meetings

```text
id
employee_request_id
employee_name
employee_email
title
description
scheduled_at
duration_minutes
status
meeting_url
created_by
created_at
updated_at
```

### interview_reports

```text
id
candidate_id
employee_request_id
candidate_name
candidate_email
meeting_id
summary
strengths
gaps
next_steps
technical_score
communication_score
problem_solving_score
overall_score
recommendation
created_at
updated_at
```

SQLite foreign keys were enabled.

---

## Employee Signup

### Prompt

> Implement employee signup.
>
> The employee should:
> - provide name
> - provide email
> - provide password
> - receive a JWT after signup
> - have role employee
>
> Also create the candidate/interview-request record so the employee appears in the admin candidate workflow.

### Result

Signup flow:

```text
Employee Signup
       ↓
Validate input
       ↓
Normalize email
       ↓
Check existing user
       ↓
Hash password
       ↓
Create user
       ↓
Create candidate request
       ↓
Create JWT
       ↓
Return user + token
```

---

## Employee Dashboard

### Prompt

> Create a complete EmployeeDashboard React component.
>
> The dashboard should allow an employee to:
> - view their profile
> - view interview request status
> - upload a resume
> - submit an interview request
> - access AI interview
> - access meetings
> - access reports
> - logout
>
> Include loading states, error states, empty states, and success messages.
>
> Make the UI look like a premium dark enterprise AI platform.

### Result

The employee dashboard includes:

```text
Employee profile
Interview request
Request status
Resume upload
AI Interview
My Meetings
My Results
Logout
```

---

## Resume Upload

### Prompt

> Add resume upload to the employee dashboard.
>
> Allow:
> - PDF
> - DOC
> - DOCX
>
> Maximum file size should be 5 MB.
>
> Display validation errors for unsupported file types or oversized files.
>
> Show the selected filename before submission.

### Result

Resume validation supports PDF, DOC, and DOCX with a 5 MB maximum.

---

## Admin Dashboard

### Prompt

> Create a complete AdminDashboard component.
>
> The admin should be able to:
> - view all employee requests
> - see request statistics
> - view candidate names
> - view candidate email
> - view AI score
> - view resume
> - accept requests
> - reject requests
> - schedule interviews
> - access meetings
> - access reports
> - refresh requests
> - logout
>
> Use a premium enterprise AI dashboard style.

### Result

The Admin Dashboard contains:

```text
Total Requests
Pending Review
Accepted
Rejected
```

Each request displays:

```text
Candidate
Email
Request Date
Status
AI Score
Resume
Workflow
```

Actions:

```text
Accept
Reject
Schedule Meeting
```

---

## Request Workflow

```text
Employee
   ↓
Submit Interview Request
   ↓
Pending
   ↓
Admin Review
   ↓
 ┌───────────────┐
 ↓               ↓
Accepted       Rejected
 ↓
Schedule Meeting
 ↓
Interview
 ↓
Report
```

---

## Meeting Scheduling

### Prompt

> Add meeting scheduling to the admin dashboard.
>
> When a request is accepted, the admin should be able to schedule a meeting.
>
> The modal should allow:
> - meeting title
> - description
> - date/time
> - duration
>
> Use the employee request data automatically.

### Result

A scheduling modal was added with:

```text
Meeting title
Description
Date & time
Duration
```

Duration options:

```text
15 minutes
30 minutes
45 minutes
60 minutes
90 minutes
```

---

## Meetings Page

### Prompt

> Create a complete Meetings React component.
>
> For admins:
> - show all meetings
> - show meeting statistics
> - create meetings
> - delete meetings
>
> For employees:
> - show their meetings
> - allow them to open meetings
>
> Include:
> - loading
> - refresh
> - error
> - empty states
> - status
> - responsive design

### Result

The Meetings page supports both roles.

Statistics include:

```text
Total
Scheduled
Completed
Cancelled
```

---

## Meeting Room

### Prompt

> Create a MeetingRoom React component.
>
> The meeting room should:
> - load the meeting by ID
> - display meeting title
> - display employee
> - display employee email
> - display scheduled time
> - display duration
> - display status
> - provide a join action
>
> If meeting_url exists, open it externally.
>
> If meeting_url does not exist, route into the internal AI interview.

### Result

The MeetingRoom became the transition between scheduled meetings and the interview.

```text
Meetings
   ↓
Meeting Room
   ↓
External Meeting
OR
Internal AI Interview
```

---

## AI Interview Architecture

### Prompt

> Design an AI interviewer that conducts a realistic multi-turn technical interview based on:
> - candidate profile
> - completed curriculum
> - learning signals
> - previous answers
> - previous questions
>
> The interviewer should:
> - maintain context
> - ask intelligent follow-ups
> - adapt difficulty
> - cover multiple curriculum topics
> - evaluate answers
> - provide final feedback

### Result

The interview architecture was designed around contextual state:

```text
Candidate Context
Curriculum Context
Interview History
Questions Asked
Answers Received
Covered Topics
Evaluation Signals
Current Difficulty
Interview Progress
```

---

## Conversational Interview

### Prompt

> Make the interview conversational.
>
> Do not use a fixed questionnaire.
>
> Each new question should consider the previous candidate response.

### Result

Conversation loop:

```text
Question
   ↓
Candidate Answer
   ↓
Evaluate Answer
   ↓
Update Context
   ↓
Generate Next Question
```

---

## Follow-Up Questions

### Prompt

> Create a follow-up question strategy.
>
> If the candidate gives a strong answer:
> - ask a deeper technical question
>
> If the answer is incomplete:
> - ask a clarification question
>
> If the answer is weak:
> - probe fundamentals
>
> The follow-up must be based on the previous answer.

### Result

Adaptive branching:

```text
Strong
 ↓
Deeper implementation/architecture

Partial
 ↓
Clarification

Weak
 ↓
Fundamentals
```

---

## Curriculum Coverage

### Prompt

> The hackathon requires at least 8 questions covering at least 4 different curriculum days. Design the interview planner so it tracks curriculum coverage and does not accidentally spend the entire interview on one topic.

### Result

The interview planner tracks:

```text
Curriculum Day
Module
Topic
Question
Difficulty
Follow-up
Coverage
```

Minimum target:

```text
At least 8 questions
At least 4 curriculum days
```

---

## Adaptive Difficulty

### Prompt

> Design an adaptive difficulty system.
>
> When the candidate demonstrates strong understanding, increase technical depth.
>
> When the candidate struggles, probe fundamentals or clarify the concept.
>
> The interview should feel dynamic rather than predetermined.

### Result

```text
Strong Answer
      ↓
Deeper Question

Partial Answer
      ↓
Clarifying Question

Weak Answer
      ↓
Fundamental Question
```

---

## Technical Depth

### Prompt

> Technical interview questions should test:
> - understanding
> - implementation
> - architecture
> - tradeoffs
> - failure modes
> - practical reasoning
>
> Avoid relying only on definitions.

### Result

Question progression:

```text
Concept
  ↓
Implementation
  ↓
Architecture
  ↓
Tradeoffs
  ↓
Failure Modes
  ↓
Production
```

---

## Candidate Learning Signals

### Prompt

> Candidate profiles contain:
> - completed missions
> - attempts
> - skipped topics
> - learning signals
>
> Use these signals to personalize interview question selection.

### Result

Learning signals were treated as inputs to question selection.

---

## Conversation Memory

### Prompt

> Maintain complete interview context.
>
> The interviewer should remember:
> - what questions were asked
> - what answers were given
> - what topics were covered
> - what concepts were weak
> - what follow-ups were already asked

### Result

The conversation state was designed around interview history.

---

## Final Interview Evaluation

### Prompt

> Create a structured technical interview evaluation.
>
> Include:
> - summary
> - strengths
> - gaps
> - next steps
> - technical score
> - communication score
> - problem solving score
> - overall score
> - recommendation

### Result

The report schema stores structured feedback.

---

## Actionable Feedback

### Prompt

> The report should be actionable.
>
> Do not only provide a score.
>
> Explain:
> - what the candidate understood
> - what they did well
> - where they struggled
> - what concepts they should study
> - what engineering skills they should improve

### Result

The report emphasizes:

```text
Strengths
Gaps
Next Steps
Recommendation
```

---

## Production API Debugging

### Prompt

> The deployed frontend is returning API errors.
>
> Check whether:
> - the frontend endpoint is incorrect
> - the backend route is missing
> - the API URL is wrong
> - the production deployment is stale
> - the frontend and backend route contracts do not match
>
> Tell me exactly where to change the code.

### Result

Production debugging focused on:

```text
Browser Request
      ↓
Request URL
      ↓
HTTP Status
      ↓
Backend Route
      ↓
Express Router
      ↓
Database
```

---

## 404 Debugging

### Observed Problem

Browser API requests returned:

```text
404 Not Found
```

### Prompt

> The browser console shows a 404 error from the production backend.
>
> The frontend says the API endpoint does not exist.
>
> Check the frontend fetch URL against the backend Express route and tell me exactly what needs to change.
>
> Give me the complete file so I can copy and paste it.

### Result

The debugging process checked:

```text
Frontend endpoint
Backend route
Router registration
API base URL
Production deployment
```

---

## Login Debugging

### Observed Problem

The browser returned:

```text
POST /api/auth/login
401 Unauthorized
```

The UI displayed:

```text
Authentication failed
Invalid email or password.
```

### Prompt

> Check this login error.
>
> The employee login is returning HTTP 401 from the backend.
>
> The frontend is sending the employee credentials but the backend says invalid email or password.
>
> Tell me exactly what is wrong and give me the complete code to replace.

### Result

The debugging process examined:

```text
User existence
Email normalization
Password hash
bcrypt comparison
Database
Demo account initialization
```

---

## Full File Replacement Workflow

### Prompt

> Give me the full updated file every time.
>
> Do not provide only a small snippet.
>
> I want to copy and paste the complete file.

### Result

Complete file replacements were used during rapid development of major frontend and backend files.

---

## UI Refinement

### Prompt

> Improve the UI so it looks like a polished enterprise AI product rather than a basic CRUD dashboard.
>
> Use:
> - strong typography
> - dark background
> - subtle borders
> - restrained gradients
> - blue AI accents
> - professional spacing
> - responsive layouts
> - hover effects
> - loading states
> - empty states

### Result

The UI was progressively refined toward a consistent enterprise AI aesthetic.

---

## Error Handling

### Prompt

> Every API-driven page should have:
> - loading state
> - error state
> - empty state
> - success state where appropriate
>
> Never leave the user looking at a blank page when an API fails.

### Result

API-driven screens were updated to display meaningful states.

---

## Refresh Behavior

### Prompt

> Add refresh controls to API-driven pages.
>
> Initial loading and refresh loading should be handled separately so the UI does not unnecessarily disappear during a refresh.

### Result

The application distinguishes initial loading from silent refresh.

---

## 401 Handling

### Prompt

> If an authenticated API request returns HTTP 401:
> - remove token
> - remove user
> - redirect to login
>
> For other errors, display a useful error message.

### Result

Frontend API flows were updated to handle expired or invalid sessions.

---

## Interview Experience

### Prompt

> The interview should feel like a real technical interview.
>
> Avoid:
> - obvious scripted questionnaires
> - random unrelated questions
> - repeated questions
> - questions that ignore the candidate's previous response
>
> Prefer:
> - contextual follow-ups
> - clarification
> - deeper implementation questions
> - architecture questions
> - tradeoffs
> - failure modes

### Result

The interview design was centered around conversation rather than static question lists.

---

## Curriculum-Based Interviewing

### Prompt

> Use the candidate's completed curriculum and learning journey to personalize the interview.
>
> Prioritize topics the candidate actually encountered.
>
> Do not assume mastery just because a topic appears in the curriculum.

### Result

Candidate curriculum context became an input to interview planning.

---

## Question Quality

### Prompt

> Create technical interview questions that test understanding rather than memorization.
>
> Questions should encourage the candidate to explain:
> - why
> - how
> - tradeoffs
> - implementation
> - architecture
> - failure modes
> - real-world examples

### Result

Question design emphasized engineering reasoning.

---

## Git Development Strategy

### Prompt

> I want the Git history to show incremental development rather than one giant final commit.
>
> Help me organize meaningful commits for:
> - setup
> - authentication
> - database
> - employee workflow
> - admin workflow
> - meetings
> - interview
> - reports
> - deployment fixes
> - documentation

### Result

Logical development categories include:

```text
Project setup
Authentication
Database
Employee workflow
Admin dashboard
Meetings
Meeting room
Interview
Reports
Deployment
Bug fixes
Documentation
```

---

## Browser Debugging

Actual browser errors and screenshots were used to identify issues, including:

```text
404 Not Found
401 Unauthorized
Invalid email or password
API endpoint not found
Candidate loading error
Report loading error
```

Debugging loop:

```text
Browser
   ↓
Actual Error
   ↓
Screenshot
   ↓
ChatGPT
   ↓
Diagnosis
   ↓
Code Change
   ↓
Deployment
   ↓
Retest
```

---

## API Contract Review

### Prompt

> Compare the frontend fetch requests against the backend Express routes.
>
> For every API request verify:
> - HTTP method
> - URL
> - authentication
> - request body
> - response shape
> - error handling

### Result

API debugging was treated as a contract between frontend and backend.

---

## Interview State Model

The conceptual interview state contains:

```text
candidate
candidateProfile
curriculum
completedTopics
questionsAsked
answers
coveredDays
coveredTopics
evaluationSignals
currentQuestion
currentDifficulty
questionCount
interviewHistory
```

---

## Interview Completion

### Prompt

> The interview should know when it has completed enough coverage.
>
> Do not stop simply because a fixed number of messages occurred.
>
> Completion should consider:
> - minimum question count
> - curriculum coverage
> - enough evaluation evidence
> - conversation quality

### Result

Completion was designed around both quantity and coverage.

Minimum requirement:

```text
8 questions
4 curriculum days
```

---

## Structured Evaluation

The final evaluation is designed to include:

```text
Summary
Strengths
Knowledge Gaps
Next Steps
Technical Score
Communication Score
Problem Solving Score
Overall Score
Recommendation
```

---

## Final System Workflow

```text
Employee
   ↓
Signup / Login
   ↓
Employee Dashboard
   ↓
Resume / Interview Request
   ↓
Admin Review
   ↓
Accept
   ↓
Schedule Interview
   ↓
Meeting
   ↓
Meeting Room
   ↓
AI Interview
   ↓
Adaptive Multi-Turn Conversation
   ↓
Interview Evaluation
   ↓
Structured Report
   ↓
Candidate Feedback
```

---

## Admin Workflow

```text
Admin Login
     ↓
Admin Dashboard
     ↓
View Candidate Requests
     ↓
Review Candidate
     ↓
View Resume
     ↓
Accept / Reject
     ↓
Schedule Meeting
     ↓
Manage Meetings
     ↓
Open Interview
     ↓
Review Report
```

---

## Employee Workflow

```text
Employee Signup
     ↓
Employee Login
     ↓
Employee Dashboard
     ↓
Upload Resume
     ↓
Submit Request
     ↓
Wait for Review
     ↓
Accepted
     ↓
Meeting Scheduled
     ↓
My Meetings
     ↓
Meeting Room
     ↓
Start AI Interview
     ↓
Complete Interview
     ↓
View Results
```

---

## AI Interview Workflow

```text
Candidate Context
        ↓
Curriculum Context
        ↓
Interview Planner
        ↓
Technical Question
        ↓
Candidate Answer
        ↓
Answer Evaluation
        ↓
Context Update
        ↓
Curriculum Coverage Update
        ↓
Follow-up / New Topic
        ↓
Candidate Answer
        ↓
Repeat
        ↓
Interview Completion
        ↓
Structured Evaluation
        ↓
Feedback
```

---

## Minimum Challenge Compliance

The interview architecture was designed around the published minimum requirements:

```text
Conversational interview
At least 8 questions
At least 4 curriculum days
Follow-up questions
Conversation context
Structured feedback
Required HTTP API
```

These requirements should be verified against the final deployed implementation before submission.

---

## Production Testing Checklist

### Authentication

```text
[ ] Admin login
[ ] Employee signup
[ ] Employee login
[ ] Logout
[ ] Invalid credentials
[ ] Missing token
[ ] Expired token
```

### Employee

```text
[ ] Dashboard loads
[ ] Request loads
[ ] Resume upload
[ ] Request submission
[ ] Request status
[ ] Meetings
[ ] Interview
[ ] Report
```

### Admin

```text
[ ] Dashboard loads
[ ] Requests load
[ ] Request statistics
[ ] Resume link
[ ] Accept request
[ ] Reject request
[ ] Schedule meeting
[ ] Meetings
[ ] Delete meeting
[ ] Reports
```

### Meetings

```text
[ ] Meeting creation
[ ] Meeting listing
[ ] Employee meeting listing
[ ] Meeting details
[ ] External meeting
[ ] Internal interview
[ ] Delete meeting
```

### Interview

```text
[ ] Candidate context
[ ] Curriculum context
[ ] Multi-turn conversation
[ ] 8+ questions
[ ] 4+ curriculum days
[ ] Follow-ups
[ ] Context retention
[ ] Completion
[ ] Evaluation
```

### Reports

```text
[ ] Summary
[ ] Strengths
[ ] Gaps
[ ] Next steps
[ ] Technical score
[ ] Communication score
[ ] Problem solving score
[ ] Overall score
[ ] Recommendation
```

### Production

```text
[ ] Frontend URL works
[ ] Backend URL works
[ ] API URL configured
[ ] CORS verified
[ ] Authentication verified
[ ] No critical 404 errors
[ ] No critical 401 errors
[ ] Full workflow tested
```

---

## AI Development Summary

The Interview Agent was developed using an iterative AI-assisted software engineering workflow.

ChatGPT was used as an engineering copilot for:

```text
Planning
Implementation
Debugging
Refactoring
Design
Documentation
```

The development process was:

```text
Prompt
  ↓
Code
  ↓
Run
  ↓
Test
  ↓
Error
  ↓
Debug with AI
  ↓
Code correction
  ↓
Retest
  ↓
Commit
```

---

## Authenticity Statement

This file is an AI-assisted development record.

It contains reconstructed summaries of major prompts, decisions, debugging sessions, and development patterns used during the project.

Some entries are summaries rather than verbatim copies of historical ChatGPT messages.

The purpose is to transparently describe how AI assistance was used during development.

The final implementation was tested and iterated through actual application execution, browser testing, API requests, debugging, and deployment.

No claim is made that every historical ChatGPT message is reproduced word-for-word.

---

# End of PROMPTS.md