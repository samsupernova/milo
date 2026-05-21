# Implementation Plan: Supabase Data Migration

## Overview

This implementation plan migrates the Milo event platform from localStorage-based data storage to Supabase PostgreSQL database. The migration maintains the existing authentication flow while moving all user and event data to a centralized, scalable database. The implementation follows a phased approach: (1) database schema setup, (2) Supabase client initialization, (3) service layer implementation, (4) data migration script, and (5) comprehensive testing.

## Tasks

- [x] 1. Set up Supabase database schema and configuration
  - Create users table with all required columns and constraints
  - Create events table with foreign key relationships
  - Add database indexes for performance optimization
  - Create database function for incrementing event joined count
  - Initialize Supabase client in `src/lib/supabase.js`
  - Configure environment variables for Supabase credentials
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 15.5_

- [x] 2. Implement authentication service with Supabase
  - [x] 2.1 Implement user authentication (signIn)
    - Query Supabase users table by email
    - Compare password credentials
    - Store session in localStorage on success
    - Return user object with all required fields
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  
  - [ ]* 2.2 Write property test for authentication integrity
    - **Property 1: Authentication Integrity**
    - **Validates: Requirements 1.1, 1.3**
    - Test that authentication succeeds if and only if matching credentials exist
  
  - [x] 2.3 Implement user registration (signUp)
    - Validate email format and uniqueness
    - Create new user record in Supabase
    - Generate avatar URL using user's name
    - Initialize empty joined and hosted arrays
    - Store session in localStorage on success
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_
  
  - [ ]* 2.4 Write property test for email uniqueness
    - **Property 2: Email Uniqueness**
    - **Validates: Requirements 2.3, 10.3**
    - Test that no two users can have the same email address
  
  - [ ]* 2.5 Write property test for new user initialization
    - **Property 9: New User Initialization**
    - **Validates: Requirements 2.6**
    - Test that newly registered users have empty joined and hosted arrays
  
  - [x] 2.6 Implement session management functions
    - Implement getCurrentUser to fetch from localStorage and verify against database
    - Implement getSession to retrieve session from localStorage
    - Implement signOut to clear localStorage session
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [ ]* 2.7 Write property test for successful authentication session creation
    - **Property 8: Successful Authentication Creates Session**
    - **Validates: Requirements 1.2, 1.4, 2.5**
    - Test that successful authentication/registration creates localStorage session

- [x] 3. Checkpoint - Verify authentication service
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implement event service with Supabase
  - [x] 4.1 Implement event retrieval functions
    - Implement getAllEvents to query all events ordered by created_at
    - Implement getEventById to query single event by ID
    - Return all required event fields in responses
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [ ]* 4.2 Write property test for event response completeness
    - **Property 10: Event Response Completeness**
    - **Validates: Requirements 4.4**
    - Test that event responses include all required fields
  
  - [x] 4.3 Implement event creation (createEvent)
    - Generate unique kebab-case event ID
    - Insert event record into Supabase events table
    - Update host user's hosted array
    - Initialize joined count to zero
    - Rollback event creation if user update fails
    - Update localStorage session with new hosted event
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  
  - [ ]* 4.4 Write property test for event creation initialization
    - **Property 13: Event Creation Initialization**
    - **Validates: Requirements 5.4**
    - Test that newly created events have joined count of zero
  
  - [ ]* 4.5 Write property test for host-event relationship
    - **Property 5: Host-Event Relationship**
    - **Validates: Requirements 5.3, 10.4**
    - Test that event's host_id references valid user and user's hosted array contains event ID
  
  - [x] 4.6 Implement event joining (joinEvent)
    - Verify user has not already joined the event
    - Add event ID to user's joined array in database
    - Increment event's joined count by one
    - Rollback user update if event update fails
    - Update localStorage session with newly joined event
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_
  
  - [ ]* 4.7 Write property test for event join idempotency
    - **Property 3: Event Join Idempotency**
    - **Validates: Requirements 6.1, 6.4**
    - Test that joining same event multiple times results in event ID appearing exactly once
  
  - [ ]* 4.8 Write property test for join operation updates
    - **Property 11: Join Operation Updates**
    - **Validates: Requirements 6.2, 6.3**
    - Test that successful join adds event ID to user's joined array and increments event's joined count by one
  
  - [x] 4.9 Implement event leaving (leaveEvent)
    - Verify user has joined the event
    - Remove event ID from user's joined array in database
    - Decrement event's joined count by one
    - Rollback user update if event update fails
    - Update localStorage session with removed event
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_
  
  - [ ]* 4.10 Write property test for leave operation updates
    - **Property 12: Leave Operation Updates**
    - **Validates: Requirements 7.2, 7.3**
    - Test that successful leave removes event ID from user's joined array and decrements event's joined count by one
  
  - [x] 4.11 Implement event deletion (deleteEvent)
    - Verify user is the host of the event
    - Delete event record from database
    - Remove event ID from all users' joined arrays
    - Remove event ID from host user's hosted array
    - Update localStorage session with removed hosted event
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_
  
  - [ ]* 4.12 Write property test for event deletion cascade
    - **Property 7: Event Deletion Cascade**
    - **Validates: Requirements 8.3, 8.4**
    - Test that deleted event ID is removed from all users' joined and hosted arrays
  
  - [x] 4.13 Implement helper functions
    - Implement getEventParticipants to return joined count
    - Implement isUserHost to check if user hosts event
    - Implement hasUserJoined to check if user joined event
    - _Requirements: 4.1, 6.1, 8.1_

- [ ] 5. Checkpoint - Verify event service
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement data validation and error handling
  - [ ] 6.1 Add input validation to authentication service
    - Validate email format before database queries
    - Validate password length (minimum 6 characters)
    - Return descriptive error messages for validation failures
    - _Requirements: 11.1, 11.2_
  
  - [ ] 6.2 Add input validation to event service
    - Validate all required event fields are present
    - Validate spots is a positive integer
    - Validate joined count does not exceed spots capacity
    - Validate joined count is non-negative
    - _Requirements: 11.3, 11.4, 11.5, 11.6_
  
  - [ ]* 6.3 Write property test for event capacity constraint
    - **Property 4: Event Capacity Constraint**
    - **Validates: Requirements 11.5, 11.6**
    - Test that event's joined count is always non-negative and never exceeds capacity
  
  - [ ] 6.4 Implement error handling and rollback logic
    - Add try-catch blocks to all database operations
    - Implement rollback for multi-step transactions
    - Return descriptive error messages to users
    - Log critical errors for debugging
    - Prevent localStorage modifications on errors
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

- [ ] 7. Implement session-database consistency
  - [ ] 7.1 Add session synchronization to all operations
    - Update localStorage after successful join operations
    - Update localStorage after successful leave operations
    - Update localStorage after successful event creation
    - Update localStorage after successful event deletion
    - Verify session user exists in database on app load
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6_
  
  - [ ]* 7.2 Write property test for session-database consistency
    - **Property 6: Session-Database Consistency**
    - **Validates: Requirements 13.1, 13.2, 13.3, 13.4, 13.5**
    - Test that session data in localStorage matches database values for joined and hosted arrays

- [x] 8. Implement data migration script
  - [x] 8.1 Create migration script for default users
    - Check for existing user records before insertion
    - Insert default users with all fields from `src/data/users.js`
    - Preserve user IDs from default data
    - Handle duplicate detection to prevent re-insertion
    - _Requirements: 9.1, 9.2, 9.5_
  
  - [x] 8.2 Create migration script for default events
    - Check for existing event records before insertion
    - Resolve host names to host IDs from users table
    - Insert default events with all fields from `src/data/events.js`
    - Handle duplicate detection to prevent re-insertion
    - _Requirements: 9.3, 9.4, 9.5, 9.6_
  
  - [x] 8.3 Create runFullMigration function
    - Execute user migration first
    - Execute event migration second
    - Log migration progress and results
    - Handle migration errors gracefully
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_
  
  - [ ]* 8.4 Write unit tests for migration script
    - Test duplicate detection logic
    - Test host name to host ID resolution
    - Test error handling for missing dependencies
    - _Requirements: 9.5, 9.6_

- [ ] 9. Checkpoint - Verify migration script
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Update existing components to use new services
  - [ ] 10.1 Update AuthContext to use new auth service
    - Replace localStorage-based auth with Supabase auth service
    - Update signIn, signUp, signOut functions
    - Update getCurrentUser to verify against database
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4_
  
  - [ ] 10.2 Update event components to use new event service
    - Update Explore page to use getAllEvents from Supabase
    - Update EventDetails page to use getEventById, joinEvent, leaveEvent
    - Update Host page to use createEvent
    - Update Dashboard to use user's joined and hosted events
    - _Requirements: 4.1, 4.2, 5.1, 6.1, 7.1, 8.1_
  
  - [ ] 10.3 Remove old localStorage-based data management
    - Remove direct localStorage manipulation from components
    - Remove old data/users.js helper functions (keep default data)
    - Remove old data/events.js helper functions (keep default data)
    - Ensure all data operations go through service layer
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

- [ ] 11. Integration testing and verification
  - [ ]* 11.1 Write integration tests for authentication flow
    - Test complete sign up, sign in, sign out flow
    - Test session persistence across page refreshes
    - Test error handling for invalid credentials
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3_
  
  - [ ]* 11.2 Write integration tests for event operations
    - Test complete event creation, join, leave, delete flow
    - Test event capacity constraints
    - Test host permissions for event deletion
    - Test session synchronization after operations
    - _Requirements: 5.1, 6.1, 7.1, 8.1, 11.5, 13.1, 13.2, 13.3, 13.4_
  
  - [ ]* 11.3 Write integration tests for data migration
    - Test migration script with empty database
    - Test migration script with existing data (idempotency)
    - Test foreign key relationships after migration
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [ ] 12. Final checkpoint - Complete system verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- Integration tests validate end-to-end workflows
- The implementation uses JavaScript (not TypeScript) to match the existing codebase
- Supabase client library (@supabase/supabase-js) is already installed
- Vitest and fast-check are configured for testing
- All database operations use parameterized queries through Supabase client for security
- Error handling includes rollback logic for multi-step transactions
- Session management maintains consistency between localStorage and database

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1", "4.1"] },
    { "id": 2, "tasks": ["2.2", "2.3", "4.2", "4.3"] },
    { "id": 3, "tasks": ["2.4", "2.5", "2.6", "4.4", "4.5", "4.6"] },
    { "id": 4, "tasks": ["2.7", "4.7", "4.8", "4.9"] },
    { "id": 5, "tasks": ["4.10", "4.11", "4.13"] },
    { "id": 6, "tasks": ["4.12", "6.1", "6.2"] },
    { "id": 7, "tasks": ["6.3", "6.4", "7.1"] },
    { "id": 8, "tasks": ["7.2", "8.1"] },
    { "id": 9, "tasks": ["8.2"] },
    { "id": 10, "tasks": ["8.3", "8.4"] },
    { "id": 11, "tasks": ["10.1", "10.2"] },
    { "id": 12, "tasks": ["10.3", "11.1"] },
    { "id": 13, "tasks": ["11.2", "11.3"] }
  ]
}
```
