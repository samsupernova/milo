# Activity Diagrams - Milo Event Platform

## 1. User Registration Activity Diagram

```mermaid
flowchart TD
    Start([User Visits Platform]) --> ViewHome[View Home Page]
    ViewHome --> ClickSignUp[Click Sign Up]
    ClickSignUp --> FillForm[Fill Registration Form]
    FillForm --> SubmitForm[Submit Form]
    SubmitForm --> ValidateEmail{Email Already<br/>Registered?}
    
    ValidateEmail -->|Yes| ShowError1[Show Error Message]
    ShowError1 --> FillForm
    
    ValidateEmail -->|No| ValidateData{All Fields<br/>Valid?}
    ValidateData -->|No| ShowError2[Show Validation Error]
    ShowError2 --> FillForm
    
    ValidateData -->|Yes| CreateUser[Create User Record in DB]
    CreateUser --> GenerateAvatar[Generate Avatar]
    GenerateAvatar --> StoreSession[Store Session in LocalStorage]
    StoreSession --> RedirectDashboard[Redirect to Dashboard]
    RedirectDashboard --> End([Registration Complete])
```

## 2. Event Creation Activity Diagram

```mermaid
flowchart TD
    Start([User Wants to Host Event]) --> CheckAuth{User<br/>Authenticated?}
    CheckAuth -->|No| RedirectLogin[Redirect to Login]
    RedirectLogin --> End1([Process Ends])
    
    CheckAuth -->|Yes| NavigateHost[Navigate to Host Page]
    NavigateHost --> FillEventForm[Fill Event Details Form]
    FillEventForm --> AddDetails[Add Title, Date, Time,<br/>Location, Description]
    AddDetails --> SelectTags[Select Event Tags]
    SelectTags --> UploadImage[Upload Event Image]
    UploadImage --> SetSpots[Set Available Spots]
    SetSpots --> SubmitEvent[Submit Event]
    
    SubmitEvent --> ValidateForm{Form Data<br/>Valid?}
    ValidateForm -->|No| ShowError[Show Validation Error]
    ShowError --> FillEventForm
    
    ValidateForm -->|Yes| GenerateID[Generate Kebab-Case Event ID]
    GenerateID --> CreateEventRecord[Create Event Record in DB]
    CreateEventRecord --> UpdateUserHosted[Update User's Hosted Array]
    UpdateUserHosted --> UpdateSession[Update LocalStorage Session]
    UpdateSession --> ShowSuccess[Show Success Message]
    ShowSuccess --> RedirectEvent[Redirect to Event Details]
    RedirectEvent --> End2([Event Created])
```

## 3. Join Event Activity Diagram

```mermaid
flowchart TD
    Start([User Views Event]) --> ViewDetails[View Event Details]
    ViewDetails --> CheckAuth{User<br/>Authenticated?}
    CheckAuth -->|No| RedirectLogin[Redirect to Login]
    RedirectLogin --> End1([Process Ends])
    
    CheckAuth -->|Yes| CheckHost{User is<br/>Host?}
    CheckHost -->|Yes| DisableJoin[Join Button Disabled]
    DisableJoin --> End2([Cannot Join Own Event])
    
    CheckHost -->|No| CheckJoined{Already<br/>Joined?}
    CheckJoined -->|Yes| ShowLeave[Show Leave Button]
    ShowLeave --> End3([Already Joined])
    
    CheckJoined -->|No| CheckSpots{Spots<br/>Available?}
    CheckSpots -->|No| ShowFull[Show Event Full Message]
    ShowFull --> End4([Cannot Join])
    
    CheckSpots -->|Yes| ClickJoin[Click Join Button]
    ClickJoin --> FetchUser[Fetch User Record]
    FetchUser --> UpdateUserJoined[Add Event to User's Joined Array]
    UpdateUserJoined --> IncrementCount[Increment Event Joined Count]
    IncrementCount --> UpdateSession[Update LocalStorage Session]
    UpdateSession --> ShowSuccess[Show Success Toast]
    ShowSuccess --> UpdateUI[Update UI - Show Leave Button]
    UpdateUI --> End5([Successfully Joined])
```

## 4. Event Discussion Activity Diagram

```mermaid
flowchart TD
    Start([User Wants to Discuss]) --> ViewEvent[View Event Details]
    ViewEvent --> ClickDiscussion[Click Discussion Tab]
    ClickDiscussion --> CheckAuth{User<br/>Authenticated?}
    CheckAuth -->|No| RedirectLogin[Redirect to Login]
    RedirectLogin --> End1([Process Ends])
    
    CheckAuth -->|Yes| CheckJoined{User Joined<br/>or Host?}
    CheckJoined -->|No| ShowRestricted[Show Restricted Access Message]
    ShowRestricted --> End2([Cannot Access])
    
    CheckJoined -->|Yes| LoadMessages[Load Messages from LocalStorage]
    LoadMessages --> DisplayMessages[Display Message Thread]
    DisplayMessages --> UserAction{User Action?}
    
    UserAction -->|Send Message| TypeMessage[Type Message]
    TypeMessage --> SubmitMessage[Submit Message]
    SubmitMessage --> ValidateMessage{Message<br/>Not Empty?}
    ValidateMessage -->|No| ShowError[Show Error]
    ShowError --> UserAction
    
    ValidateMessage -->|Yes| GenerateID[Generate Message ID]
    GenerateID --> CreateMessage[Create Message Object]
    CreateMessage --> SaveMessage[Save to LocalStorage]
    SaveMessage --> RefreshDisplay[Refresh Message Display]
    RefreshDisplay --> UserAction
    
    UserAction -->|Delete Message| CheckOwner{User is<br/>Message Owner?}
    CheckOwner -->|No| ShowError2[Show Permission Error]
    ShowError2 --> UserAction
    
    CheckOwner -->|Yes| ConfirmDelete[Confirm Deletion]
    ConfirmDelete --> RemoveMessage[Remove from LocalStorage]
    RemoveMessage --> RefreshDisplay
    
    UserAction -->|Leave| End3([Exit Discussion])
```

## 5. User Authentication Activity Diagram

```mermaid
flowchart TD
    Start([User Wants to Login]) --> NavigateLogin[Navigate to Login Page]
    NavigateLogin --> EnterCredentials[Enter Email and Password]
    EnterCredentials --> ClickSignIn[Click Sign In]
    ClickSignIn --> QueryDB[Query Users Table by Email]
    
    QueryDB --> CheckUser{User<br/>Found?}
    CheckUser -->|No| ShowError1[Show Invalid Credentials Error]
    ShowError1 --> EnterCredentials
    
    CheckUser -->|Yes| ComparePassword{Password<br/>Matches?}
    ComparePassword -->|No| ShowError2[Show Invalid Credentials Error]
    ShowError2 --> EnterCredentials
    
    ComparePassword -->|Yes| CreateSession[Create Session Object]
    CreateSession --> StoreLocal[Store in LocalStorage]
    StoreLocal --> LoadProfile[Load User Profile Data]
    LoadProfile --> ShowSuccess[Show Success Toast]
    ShowSuccess --> RedirectDashboard[Redirect to Dashboard]
    RedirectDashboard --> End([Login Complete])
```
