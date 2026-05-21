# Requirements Document

## Introduction

This document specifies the functional and non-functional requirements for migrating the Milo event platform from localStorage-based data storage to Supabase PostgreSQL database. The migration maintains the existing authentication flow while moving all user and event data to a centralized, scalable database. The system will use Supabase exclusively for persistent data storage, with localStorage retained only for session management.

## Glossary

- **System**: The Milo event platform application
- **Supabase_Client**: The JavaScript client library that interfaces with the Supabase database
- **User_Service**: The service layer component responsible for user-related database operations
- **Event_Service**: The service layer component responsible for event-related database operations
- **Session**: The current logged-in user data stored in localStorage
- **Migration_Script**: The one-time script that transfers default data to Supabase
- **Database**: The Supabase PostgreSQL database instance
- **Authentication_Service**: The service layer component responsible for user authentication and registration

## Requirements

### Requirement 1: User Authentication

**User Story:** As a user, I want to authenticate using my email and password, so that I can access my personalized event data.

#### Acceptance Criteria

1. WHEN a user provides valid email and password credentials, THE Authentication_Service SHALL query the Database for a matching user record
2. WHEN the Database returns a user record with matching credentials, THE Authentication_Service SHALL store the user session in localStorage
3. WHEN a user provides invalid credentials, THE Authentication_Service SHALL return an error message without creating a session
4. WHEN authentication succeeds, THE System SHALL return the user object containing id, email, name, avatar, occupation, home, gender, relationship, interests, joined events, and hosted events
5. IF the Database connection fails during authentication, THEN THE Authentication_Service SHALL return a connection error without modifying localStorage

### Requirement 2: User Registration

**User Story:** As a new user, I want to register an account with my personal information, so that I can start using the platform.

#### Acceptance Criteria

1. WHEN a user submits registration data with all required fields, THE Authentication_Service SHALL validate the email format
2. WHEN the email is valid and unique, THE Authentication_Service SHALL create a new user record in the Database
3. WHEN a user attempts to register with an existing email, THE Authentication_Service SHALL return an error indicating the email is already registered
4. WHEN a new user record is created, THE System SHALL generate a unique avatar URL using the user's name
5. WHEN registration succeeds, THE Authentication_Service SHALL store the user session in localStorage
6. THE Authentication_Service SHALL initialize new users with empty joined and hosted event arrays

### Requirement 3: Session Management

**User Story:** As a user, I want my login session to persist across page refreshes, so that I don't have to log in repeatedly.

#### Acceptance Criteria

1. WHEN a user successfully authenticates, THE System SHALL store the session data in localStorage under the key "user"
2. WHEN the application loads, THE System SHALL check localStorage for an existing session
3. WHEN a valid session exists in localStorage, THE System SHALL restore the user's authenticated state
4. WHEN a user logs out, THE System SHALL clear all session data from localStorage
5. IF a session exists in localStorage but the user no longer exists in the Database, THEN THE System SHALL clear the session and redirect to login

### Requirement 4: Event Retrieval

**User Story:** As a user, I want to view all available events, so that I can discover activities to join.

#### Acceptance Criteria

1. WHEN the application requests all events, THE Event_Service SHALL query the Database for all event records
2. THE Event_Service SHALL return events ordered by creation date in descending order
3. WHEN no events exist in the Database, THE Event_Service SHALL return an empty array
4. THE System SHALL include all event fields in the response: id, title, host_id, host_name, date, time, location, image, tags, description, spots, joined count, and created_at timestamp
5. IF the Database connection fails during event retrieval, THEN THE Event_Service SHALL return a connection error

### Requirement 5: Event Creation

**User Story:** As a user, I want to create new events, so that I can host activities for others to join.

#### Acceptance Criteria

1. WHEN a user submits event data with all required fields, THE Event_Service SHALL generate a unique event ID in kebab-case format
2. WHEN the event ID is unique, THE Event_Service SHALL insert the new event record into the Database
3. WHEN an event is created, THE Event_Service SHALL update the host user's hosted array to include the new event ID
4. WHEN an event is created, THE System SHALL initialize the joined count to zero
5. IF the user update fails after event creation, THEN THE Event_Service SHALL delete the event record and return an error
6. WHEN event creation succeeds, THE System SHALL update the session data in localStorage to reflect the new hosted event

### Requirement 6: Event Joining

**User Story:** As a user, I want to join events that interest me, so that I can participate in activities.

#### Acceptance Criteria

1. WHEN a user attempts to join an event, THE Event_Service SHALL verify the user has not already joined that event
2. WHEN a user has not joined the event, THE Event_Service SHALL add the event ID to the user's joined array in the Database
3. WHEN the user's joined array is updated, THE Event_Service SHALL increment the event's joined count by one
4. WHEN a user attempts to join an event they have already joined, THE Event_Service SHALL return an error without modifying the Database
5. IF the event update fails after the user update succeeds, THEN THE Event_Service SHALL rollback the user update and return an error
6. WHEN event joining succeeds, THE System SHALL update the session data in localStorage to reflect the newly joined event

### Requirement 7: Event Leaving

**User Story:** As a user, I want to leave events I have joined, so that I can manage my commitments.

#### Acceptance Criteria

1. WHEN a user attempts to leave an event, THE Event_Service SHALL verify the user has joined that event
2. WHEN the user has joined the event, THE Event_Service SHALL remove the event ID from the user's joined array in the Database
3. WHEN the user's joined array is updated, THE Event_Service SHALL decrement the event's joined count by one
4. WHEN a user attempts to leave an event they have not joined, THE Event_Service SHALL return an error without modifying the Database
5. IF the event update fails after the user update succeeds, THEN THE Event_Service SHALL rollback the user update and return an error
6. WHEN event leaving succeeds, THE System SHALL update the session data in localStorage to reflect the removed event

### Requirement 8: Event Deletion

**User Story:** As an event host, I want to delete events I have created, so that I can cancel activities that are no longer happening.

#### Acceptance Criteria

1. WHEN a user attempts to delete an event, THE Event_Service SHALL verify the user is the host of that event
2. WHEN the user is the host, THE Event_Service SHALL delete the event record from the Database
3. WHEN an event is deleted, THE System SHALL remove the event ID from all users' joined arrays
4. WHEN an event is deleted, THE System SHALL remove the event ID from the host user's hosted array
5. WHEN a user attempts to delete an event they do not host, THE Event_Service SHALL return an error without modifying the Database
6. WHEN event deletion succeeds, THE System SHALL update the session data in localStorage to reflect the removed hosted event

### Requirement 9: Data Migration

**User Story:** As a system administrator, I want to migrate existing default data to Supabase, so that the application has initial content.

#### Acceptance Criteria

1. WHEN the Migration_Script executes, THE System SHALL check for existing user records before inserting default users
2. WHEN a default user does not exist in the Database, THE Migration_Script SHALL insert the user record with all fields
3. WHEN the Migration_Script executes, THE System SHALL check for existing event records before inserting default events
4. WHEN a default event does not exist in the Database, THE Migration_Script SHALL insert the event record with all fields
5. WHEN the Migration_Script runs multiple times, THE System SHALL not create duplicate records
6. WHEN inserting default events, THE Migration_Script SHALL resolve host names to host IDs from the users table

### Requirement 10: Database Schema

**User Story:** As a developer, I want a well-defined database schema, so that data is stored consistently and efficiently.

#### Acceptance Criteria

1. THE Database SHALL have a users table with columns: id (auto-increment primary key), email (unique, not null), password (not null), name (not null), dob, occupation, home (JSONB), gender, relationship, interests (array), joined (array), hosted (array), avatar, and created_at (timestamp)
2. THE Database SHALL have an events table with columns: id (text primary key), title (not null), host_id (foreign key to users.id), host_name (not null), date, time, location, image, tags (array), description, spots (integer), joined (integer), and created_at (timestamp)
3. THE Database SHALL enforce email uniqueness constraint on the users table
4. THE Database SHALL enforce foreign key constraint on events.host_id referencing users.id with CASCADE delete
5. THE Database SHALL have an index on users.email for fast authentication lookups
6. THE Database SHALL have an index on events.host_id for host-based queries
7. THE Database SHALL have an index on events.created_at for chronological ordering

### Requirement 11: Data Validation

**User Story:** As a developer, I want input validation on all data operations, so that invalid data does not corrupt the database.

#### Acceptance Criteria

1. WHEN a user submits an email, THE System SHALL validate the email format before querying the Database
2. WHEN a user submits a password, THE System SHALL validate the password is at least 6 characters long
3. WHEN creating an event, THE System SHALL validate all required fields are present: title, date, time, location, spots
4. WHEN creating an event, THE System SHALL validate spots is a positive integer
5. WHEN updating event joined count, THE System SHALL validate the joined count does not exceed the spots capacity
6. WHEN updating event joined count, THE System SHALL validate the joined count is non-negative

### Requirement 12: Error Handling and Recovery

**User Story:** As a user, I want the system to handle errors gracefully, so that I understand what went wrong and can recover.

#### Acceptance Criteria

1. WHEN a Database operation fails, THE System SHALL return a descriptive error message to the user
2. WHEN a transaction involves multiple Database updates, THE System SHALL rollback all changes if any update fails
3. IF a rollback operation fails, THEN THE System SHALL log a critical error and notify the user to refresh the page
4. WHEN the Database connection is unavailable, THE System SHALL return a connection error without attempting further operations
5. WHEN an error occurs during authentication, THE System SHALL not modify localStorage
6. WHEN an error occurs during event operations, THE System SHALL maintain consistency between the Database and localStorage session

### Requirement 13: Session-Database Consistency

**User Story:** As a user, I want my session data to stay synchronized with the database, so that I see accurate information about my joined and hosted events.

#### Acceptance Criteria

1. WHEN a user joins an event, THE System SHALL update both the Database and the localStorage session
2. WHEN a user leaves an event, THE System SHALL update both the Database and the localStorage session
3. WHEN a user creates an event, THE System SHALL update both the Database and the localStorage session
4. WHEN a user deletes an event, THE System SHALL update both the Database and the localStorage session
5. WHEN the application loads with an existing session, THE System SHALL verify the session user ID exists in the Database
6. IF the session data becomes inconsistent with the Database, THEN THE System SHALL refresh the session from the Database

### Requirement 14: Performance Optimization

**User Story:** As a user, I want the application to respond quickly, so that I have a smooth experience.

#### Acceptance Criteria

1. WHEN authenticating a user, THE System SHALL complete the Database query in less than 100 milliseconds under normal conditions
2. WHEN retrieving all events, THE System SHALL complete the Database query in less than 200 milliseconds for up to 100 events
3. WHEN joining or leaving an event, THE System SHALL complete all Database updates in less than 300 milliseconds
4. WHEN creating an event, THE System SHALL complete all Database operations in less than 400 milliseconds
5. THE System SHALL use Database indexes to optimize query performance for email lookups, host queries, and chronological ordering
6. THE System SHALL fetch only required fields in Database queries to minimize data transfer

### Requirement 15: Security

**User Story:** As a user, I want my data to be secure, so that my personal information is protected.

#### Acceptance Criteria

1. THE System SHALL store passwords in the Database (note: plain text in current implementation, hashing required for production)
2. THE System SHALL never return password fields in API responses to the client
3. THE System SHALL validate and sanitize all user input before Database operations
4. THE System SHALL use parameterized queries through the Supabase_Client to prevent SQL injection
5. THE System SHALL store Supabase credentials in environment variables, not in source code
6. WHERE the application is deployed to production, THE System SHALL implement password hashing using bcrypt or argon2
