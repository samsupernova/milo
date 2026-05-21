# Data Flow Diagrams - Milo Event Platform

## DFD Level 0 (Context Diagram)

```mermaid
flowchart TB
    User[User/Guest]
    Host[Event Host]
    
    subgraph System["Milo Event Platform"]
        Core[Event Management System]
    end
    
    SupabaseDB[(Supabase Database)]
    LocalStorage[(Browser LocalStorage)]
    DiceBear[DiceBear Avatar API]
    
    User -->|Registration Details| Core
    User -->|Login Credentials| Core
    User -->|Event Search Query| Core
    User -->|Join/Leave Request| Core
    User -->|Discussion Messages| Core
    User -->|Profile Updates| Core
    
    Host -->|Event Details| Core
    Host -->|Event Updates| Core
    Host -->|Delete Event Request| Core
    
    Core -->|User Profile| User
    Core -->|Event List| User
    Core -->|Event Details| User
    Core -->|Discussion Thread| User
    Core -->|Success/Error Messages| User
    Core -->|Dashboard Data| User
    
    Core -->|Event Management| Host
    Core -->|Participant List| Host
    
    Core <-->|User Data| SupabaseDB
    Core <-->|Event Data| SupabaseDB
    Core <-->|Session Data| LocalStorage
    Core <-->|Message Data| LocalStorage
    Core -->|Avatar Request| DiceBear
    DiceBear -->|Avatar Image| Core
```

## DFD Level 1 (Main Processes)

```mermaid
flowchart TB
    User[User]
    Guest[Guest]
    Host[Event Host]
    
    subgraph "Milo Event Platform"
        P1[1.0<br/>Authentication<br/>Management]
        P2[2.0<br/>Event<br/>Management]
        P3[3.0<br/>User Profile<br/>Management]
        P4[4.0<br/>Event Discovery<br/>& Search]
        P5[5.0<br/>Event Participation<br/>Management]
        P6[6.0<br/>Discussion<br/>Management]
    end
    
    D1[(D1: Users Table<br/>Supabase)]
    D2[(D2: Events Table<br/>Supabase)]
    D3[(D3: Session Store<br/>LocalStorage)]
    D4[(D4: Messages Store<br/>LocalStorage)]
    
    Guest -->|Registration Data| P1
    User -->|Login Credentials| P1
    User -->|Logout Request| P1
    P1 -->|Authentication Status| User
    P1 -->|Session Token| User
    P1 <-->|User Credentials| D1
    P1 <-->|Session Data| D3
    
    Host -->|Event Details| P2
    Host -->|Update Request| P2
    Host -->|Delete Request| P2
    P2 -->|Event Created| Host
    P2 -->|Update Confirmation| Host
    P2 <-->|Event Records| D2
    P2 <-->|Host Info| D1
    
    User -->|Profile Update| P3
    P3 -->|Profile Data| User
    P3 <-->|User Data| D1
    P3 <-->|Session Update| D3
    
    User -->|Search Query| P4
    Guest -->|Browse Request| P4
    P4 -->|Event List| User
    P4 -->|Event List| Guest
    P4 -->|Event Details| User
    P4 <-->|Event Data| D2
    
    User -->|Join Request| P5
    User -->|Leave Request| P5
    P5 -->|Join Confirmation| User
    P5 -->|Leave Confirmation| User
    P5 <-->|Event Participation| D2
    P5 <-->|User Events| D1
    P5 <-->|Session Update| D3
    
    User -->|Message Content| P6
    User -->|Delete Message| P6
    P6 -->|Message Thread| User
    P6 <-->|Messages| D4
    P6 -->|Participant Check| D1
```

## DFD Level 2 - Authentication Management (Process 1.0)

```mermaid
flowchart TB
    User[User]
    
    subgraph "1.0 Authentication Management"
        P11[1.1<br/>User<br/>Registration]
        P12[1.2<br/>User<br/>Login]
        P13[1.3<br/>Session<br/>Management]
        P14[1.4<br/>User<br/>Logout]
    end
    
    D1[(D1: Users Table)]
    D3[(D3: Session Store)]
    Avatar[DiceBear API]
    
    User -->|Registration Form| P11
    P11 -->|Email Check Query| D1
    D1 -->|Existing User Status| P11
    P11 -->|Avatar Request| Avatar
    Avatar -->|Avatar URL| P11
    P11 -->|New User Record| D1
    P11 -->|Session Data| P13
    P11 -->|Registration Success| User
    
    User -->|Email & Password| P12
    P12 -->|Credential Query| D1
    D1 -->|User Record| P12
    P12 -->|Session Data| P13
    P12 -->|Login Success| User
    
    P13 <-->|Session CRUD| D3
    P13 -->|Session Token| User
    
    User -->|Logout Request| P14
    P14 -->|Clear Session| P13
    P14 -->|Logout Success| User
```

## DFD Level 2 - Event Management (Process 2.0)

```mermaid
flowchart TB
    Host[Event Host]
    
    subgraph "2.0 Event Management"
        P21[2.1<br/>Create<br/>Event]
        P22[2.2<br/>Update<br/>Event]
        P23[2.3<br/>Delete<br/>Event]
        P24[2.4<br/>Event ID<br/>Generator]
    end
    
    D1[(D1: Users Table)]
    D2[(D2: Events Table)]
    D3[(D3: Session Store)]
    
    Host -->|Event Details| P21
    P21 -->|Title| P24
    P24 -->|Kebab-Case ID| P21
    P21 -->|Host Info Query| D1
    D1 -->|Host Data| P21
    P21 -->|Event Record| D2
    P21 -->|Update Hosted Array| D1
    P21 -->|Session Update| D3
    P21 -->|Event Created| Host
    
    Host -->|Event ID & Updates| P22
    P22 -->|Ownership Check| D2
    D2 -->|Event Data| P22
    P22 -->|Updated Record| D2
    P22 -->|Update Success| Host
    
    Host -->|Event ID| P23
    P23 -->|Ownership Check| D2
    D2 -->|Event Data| P23
    P23 -->|Delete Record| D2
    P23 -->|Update User Arrays| D1
    P23 -->|Session Update| D3
    P23 -->|Delete Success| Host
```

## DFD Level 2 - Event Participation (Process 5.0)

```mermaid
flowchart TB
    User[User]
    
    subgraph "5.0 Event Participation Management"
        P51[5.1<br/>Join<br/>Event]
        P52[5.2<br/>Leave<br/>Event]
        P53[5.3<br/>Check<br/>Eligibility]
        P54[5.4<br/>Update<br/>Counters]
    end
    
    D1[(D1: Users Table)]
    D2[(D2: Events Table)]
    D3[(D3: Session Store)]
    
    User -->|Join Request + Event ID| P51
    P51 -->|Check Request| P53
    P53 -->|User Data Query| D1
    D1 -->|User Joined/Hosted| P53
    P53 -->|Event Data Query| D2
    D2 -->|Event Spots| P53
    P53 -->|Eligibility Status| P51
    P51 -->|Update Joined Array| D1
    P51 -->|Increment Request| P54
    P54 -->|Update Joined Count| D2
    P51 -->|Session Update| D3
    P51 -->|Join Success| User
    
    User -->|Leave Request + Event ID| P52
    P52 -->|User Data Query| D1
    D1 -->|User Joined Array| P52
    P52 -->|Update Joined Array| D1
    P52 -->|Decrement Request| P54
    P54 -->|Update Joined Count| D2
    P52 -->|Session Update| D3
    P52 -->|Leave Success| User
```

## Data Stores Description

### D1: Users Table (Supabase)
- **Purpose**: Store user account information and relationships
- **Data**: id, email, password, name, dob, occupation, home, gender, relationship, interests, joined[], hosted[], avatar, created_at
- **Access**: Read/Write by Authentication, Profile, Event, and Participation processes

### D2: Events Table (Supabase)
- **Purpose**: Store event information and metadata
- **Data**: id, title, host_id, host_name, date, time, location, image, tags[], description, spots, joined, created_at
- **Access**: Read/Write by Event Management, Discovery, and Participation processes

### D3: Session Store (LocalStorage)
- **Purpose**: Maintain user session state in browser
- **Data**: user object (id, email, name, avatar, occupation, home, gender, relationship, interests, joined[], hosted[])
- **Access**: Read/Write by Authentication and Session Management processes

### D4: Messages Store (LocalStorage)
- **Purpose**: Store event discussion messages
- **Data**: id, event_id, user_id, user_name, user_avatar, message, is_bot, created_at
- **Access**: Read/Write by Discussion Management process
