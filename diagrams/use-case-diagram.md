# Use Case Diagram - Milo Event Platform

```mermaid
graph TB
    subgraph "Milo Event Platform"
        UC1[Sign Up]
        UC2[Sign In]
        UC3[Sign Out]
        UC4[Browse Events]
        UC5[Search Events]
        UC6[View Event Details]
        UC7[Join Event]
        UC8[Leave Event]
        UC9[Create Event]
        UC10[Update Event]
        UC11[Delete Event]
        UC12[View Dashboard]
        UC13[View Profile]
        UC14[Update Profile]
        UC15[View Upcoming Events]
        UC16[Send Message]
        UC17[View Discussion]
        UC18[Delete Message]
    end
    
    Guest[Guest User]
    User[Registered User]
    Host[Event Host]
    
    Guest --> UC1
    Guest --> UC2
    Guest --> UC4
    Guest --> UC6
    
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5
    User --> UC6
    User --> UC7
    User --> UC8
    User --> UC9
    User --> UC12
    User --> UC13
    User --> UC14
    User --> UC15
    User --> UC16
    User --> UC17
    User --> UC18
    
    Host --> UC10
    Host --> UC11
    
    UC9 -.->|extends| Host
    UC7 -.->|requires| UC6
    UC8 -.->|requires| UC6
    UC16 -.->|requires| UC7
    UC17 -.->|requires| UC6
```

## Actors

### Guest User
- Can browse events without authentication
- Can view event details
- Can sign up for an account
- Can sign in to existing account

### Registered User
- All Guest User capabilities
- Can join/leave events
- Can create new events (becomes Host)
- Can view personalized dashboard
- Can manage profile
- Can participate in event discussions
- Can view upcoming events they've joined

### Event Host
- All Registered User capabilities
- Can update their hosted events
- Can delete their hosted events
- Manages event participants

## Use Cases

1. **Sign Up**: Register a new account with personal details
2. **Sign In**: Authenticate with email and password
3. **Sign Out**: End current session
4. **Browse Events**: View all available events
5. **Search Events**: Filter events by tags, location, date
6. **View Event Details**: See complete event information
7. **Join Event**: Register for an event
8. **Leave Event**: Cancel event registration
9. **Create Event**: Host a new event
10. **Update Event**: Modify event details (host only)
11. **Delete Event**: Remove event (host only)
12. **View Dashboard**: See personalized event feed
13. **View Profile**: Access user profile information
14. **Update Profile**: Modify user details
15. **View Upcoming Events**: See joined events
16. **Send Message**: Post in event discussion
17. **View Discussion**: Read event messages
18. **Delete Message**: Remove own messages
