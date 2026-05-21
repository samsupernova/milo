# Auth Hanging Fix Bugfix Design

## Overview

This design addresses a critical authentication bug where both login and signup operations hang indefinitely at the Supabase authentication step. The bug manifests as authentication promises that neither resolve nor reject, causing timeout mechanisms to fail. The root cause appears to be improper Promise.race() implementation where the timeout promise rejects but doesn't actually cancel the ongoing Supabase authentication promise, leaving the UI in a perpetual loading state.

The fix will implement proper timeout handling using AbortController or alternative promise cancellation patterns, ensure proper error propagation, and add comprehensive logging to diagnose authentication flow issues. The approach is minimal and targeted: fix the timeout mechanism without altering the authentication flow logic or data handling.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when Supabase authentication operations (signIn or signUp) hang indefinitely without resolving or rejecting
- **Property (P)**: The desired behavior when authentication operations are invoked - they should complete (success or failure) within the timeout threshold and provide user feedback
- **Preservation**: Existing authentication success flows, error handling for invalid credentials, profile fetching, and session management that must remain unchanged by the fix
- **signIn**: The function in `src/services/auth.js` that authenticates existing users via Supabase
- **signUp**: The function in `src/services/auth.js` that creates new user accounts via Supabase
- **Promise.race()**: JavaScript pattern used to implement timeouts by racing an operation promise against a timeout promise
- **Supabase Auth Promise**: The promise returned by `supabase.auth.signInWithPassword()` or `supabase.auth.signUp()` that may hang indefinitely

## Bug Details

### Bug Condition

The bug manifests when a user attempts to authenticate (login or signup) and the Supabase authentication promise hangs indefinitely without resolving or rejecting. The `Promise.race()` timeout mechanism fails to provide user feedback because rejecting the timeout promise doesn't cancel the authentication promise, and the UI remains in loading state waiting for the authentication promise to settle.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type { operation: 'signIn' | 'signUp', email: string, password: string }
  OUTPUT: boolean
  
  RETURN (input.operation == 'signIn' OR input.operation == 'signUp')
         AND supabaseAuthPromise(input) hangs indefinitely
         AND NOT (authPromise resolves within timeout)
         AND NOT (authPromise rejects within timeout)
         AND timeoutPromise rejects but UI remains in loading state
END FUNCTION
```

### Examples

- **Login Hang**: User enters valid credentials and clicks "Log in" → Console shows "Attempting sign in for: user@example.com" → UI shows "Logging in..." indefinitely → No error message appears → User cannot access the application
- **Signup Hang**: User completes onboarding form and submits → Console shows "Starting signup for: user@example.com" → UI shows loading state indefinitely → User account is never created → No feedback provided
- **Timeout Failure**: Authentication operation exceeds 10s (login) or 15s (signup) → Timeout promise rejects → Error is not caught or displayed → UI remains in loading state instead of showing timeout error
- **Edge Case - Network Delay**: Slow network causes authentication to take 8 seconds → Should complete successfully and redirect → Currently may hang if promise doesn't settle properly

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Successful authentication with valid credentials must continue to fetch user profile, interests, and events before redirecting
- Invalid credentials must continue to display "Invalid email or password" error message
- Network errors during authentication must continue to be caught and display appropriate error messages
- Successful authentication must continue to set user context via `setUser()` and maintain session state
- Signup success must continue to create user profile in `users` table, add interests to `user_interests` table, and return complete user data
- Console logging for authentication flow steps must continue to work (e.g., "Attempting sign in for:", "Auth successful, fetching profile...")

**Scope:**
All authentication operations that complete successfully (within timeout) or fail with proper error responses (invalid credentials, network errors) should be completely unaffected by this fix. This includes:
- Successful login/signup flows that complete quickly
- Authentication failures due to wrong password or non-existent user
- Profile fetching and event data loading after successful authentication
- Session management and auth state changes handled by AuthContext

## Hypothesized Root Cause

Based on the bug description and code analysis, the most likely issues are:

1. **Promise.race() Limitation**: The current implementation uses `Promise.race([authPromise, timeoutPromise])` where the timeout promise rejects after a delay. However, when the timeout promise wins the race and rejects, the authentication promise continues running in the background. If the authentication promise never settles, the error from the timeout rejection may not be properly caught or the UI state may not update correctly.

2. **Error Handling Gap**: The try-catch block may not be properly catching the timeout rejection, or the error state is not being set correctly when the timeout fires. The `setIsLoading(false)` and `setError()` calls may not execute if the promise rejection isn't handled properly.

3. **Async State Management**: The component's loading state (`isLoading`) may not be properly reset when the timeout fires because the authentication promise is still pending. React's state updates may be queued or batched in a way that prevents the UI from updating.

4. **Supabase Client Configuration**: The Supabase client may not have proper timeout or retry configuration, causing requests to hang indefinitely at the network level. The default Supabase client configuration may not include request timeouts.

## Correctness Properties

Property 1: Bug Condition - Authentication Operations Complete Within Timeout

_For any_ authentication operation (signIn or signUp) where the Supabase authentication promise hangs or takes longer than the timeout threshold (10s for login, 15s for signup), the fixed function SHALL reject with a timeout error, exit the loading state, and display a clear error message to the user within the timeout period.

**Validates: Requirements 2.3, 2.4**

Property 2: Preservation - Successful Authentication Flow

_For any_ authentication operation that completes successfully within the timeout threshold, the fixed code SHALL produce exactly the same behavior as the original code, preserving profile fetching, event data loading, user context setting, and navigation to dashboard.

**Validates: Requirements 3.1, 3.4, 3.5**

Property 3: Preservation - Authentication Error Handling

_For any_ authentication operation that fails due to invalid credentials or network errors (not timeout), the fixed code SHALL produce exactly the same error messages and UI behavior as the original code, preserving the existing error handling logic.

**Validates: Requirements 3.2, 3.3**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct (Promise.race() limitation and error handling gaps):

**File**: `src/services/auth.js`

**Function**: `signIn` and `signUp`

**Specific Changes**:

1. **Replace Promise.race() with Proper Timeout Wrapper**: Create a utility function that wraps the authentication promise with a timeout that properly handles cleanup and ensures the error is thrown even if the original promise never settles.
   - Implement `withTimeout(promise, timeoutMs, errorMessage)` utility function
   - This function should create a timeout that rejects AND ensures the wrapper promise settles
   - Use this wrapper for both `supabase.auth.signInWithPassword()` and `supabase.auth.signUp()` calls

2. **Ensure Error Propagation**: Modify the try-catch blocks to guarantee that timeout errors are caught and properly set the error state.
   - Ensure `setIsLoading(false)` is called in all error paths
   - Ensure `setError()` is called with the timeout error message
   - Add explicit error logging for timeout scenarios

3. **Add Supabase Client Timeout Configuration**: Configure the Supabase client with request-level timeouts to prevent network-level hangs.
   - Check `src/lib/supabase.js` for client configuration
   - Add `fetch` options with timeout if not present
   - Consider using `AbortController` for request cancellation

4. **Improve Error Messages**: Update timeout error messages to be more user-friendly and actionable.
   - Change "Request timeout - please check your internet connection" to more specific guidance
   - Add different messages for login vs signup timeouts
   - Include troubleshooting hints (e.g., "This may indicate a server issue. Please try again in a few moments.")

5. **Add Defensive State Management**: Ensure the UI loading state is always reset, even if errors occur during error handling.
   - Wrap state updates in try-finally blocks where appropriate
   - Consider using a cleanup function that always runs

### Example Implementation Pattern

```javascript
// Utility function for timeout handling
const withTimeout = (promise, timeoutMs, errorMessage) => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(errorMessage));
    }, timeoutMs);
    
    promise
      .then((result) => {
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
};

// Updated signIn function
export const signIn = async (email, password) => {
  try {
    console.log('Attempting sign in for:', email);
    
    const { data, error } = await withTimeout(
      supabase.auth.signInWithPassword({ email, password }),
      10000,
      'Login is taking longer than expected. Please check your connection and try again.'
    );

    if (error) {
      console.error('Auth sign in error:', error);
      throw error;
    }
    
    // ... rest of the function remains unchanged
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      error: error.message || 'Login failed. Please try again.',
    };
  }
};
```

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code by simulating hanging authentication promises, then verify the fix works correctly with proper timeout handling and preserves existing authentication success and error flows.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis by simulating hanging Supabase authentication promises. If we refute, we will need to re-hypothesize.

**Test Plan**: Write tests that mock the Supabase client to return promises that never settle (hang indefinitely). Run these tests on the UNFIXED code to observe that timeouts don't trigger and the UI remains in loading state. This will confirm the Promise.race() limitation hypothesis.

**Test Cases**:
1. **Login Hang Test**: Mock `supabase.auth.signInWithPassword()` to return a never-settling promise → Call `signIn()` → Assert that after 10+ seconds, the function still hasn't returned and no error is thrown (will fail on unfixed code - function hangs)
2. **Signup Hang Test**: Mock `supabase.auth.signUp()` to return a never-settling promise → Call `signUp()` → Assert that after 15+ seconds, the function still hasn't returned and no error is thrown (will fail on unfixed code - function hangs)
3. **Timeout Promise Rejection Test**: Mock authentication to hang → Verify that the timeout promise rejects but the overall Promise.race() doesn't properly propagate the error (will fail on unfixed code - error not caught)
4. **UI Loading State Test**: Simulate hanging authentication in the Login component → Assert that `isLoading` remains `true` indefinitely and no error message is displayed (will fail on unfixed code - UI stuck in loading)

**Expected Counterexamples**:
- Authentication functions hang indefinitely when Supabase promises don't settle
- Timeout promises reject but errors are not caught or displayed
- UI remains in loading state with no user feedback
- Possible causes: Promise.race() doesn't cancel the losing promise, error handling gaps, state management issues

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds (authentication hangs), the fixed function produces the expected behavior (timeout error within threshold).

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := authFunction_fixed(input)
  ASSERT result completes within timeout threshold
  ASSERT result.success == false
  ASSERT result.error contains timeout message
  ASSERT UI loading state is reset
END FOR
```

**Test Cases**:
1. **Login Timeout Triggers**: Mock hanging authentication → Call fixed `signIn()` → Assert function returns within 10s with timeout error
2. **Signup Timeout Triggers**: Mock hanging authentication → Call fixed `signUp()` → Assert function returns within 15s with timeout error
3. **Error Message Displayed**: Simulate timeout in Login component → Assert error message is displayed and loading state is false
4. **Multiple Timeout Attempts**: Trigger timeout, then retry authentication → Assert each attempt properly times out independently

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold (authentication completes normally), the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT authFunction_original(input) = authFunction_fixed(input)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain (valid credentials, invalid credentials, network errors)
- It catches edge cases that manual unit tests might miss (special characters in passwords, various error types)
- It provides strong guarantees that behavior is unchanged for all non-hanging authentication scenarios

**Test Plan**: Observe behavior on UNFIXED code first for successful authentication and various error scenarios, then write property-based tests capturing that behavior. Verify the fixed code produces identical results.

**Test Cases**:
1. **Successful Login Preservation**: Mock successful authentication with valid credentials → Verify fixed code fetches profile, events, and returns same user data structure as original
2. **Invalid Credentials Preservation**: Mock authentication failure with wrong password → Verify fixed code returns same error message as original
3. **Network Error Preservation**: Mock network failure during authentication → Verify fixed code handles error identically to original
4. **Profile Fetch Preservation**: Mock successful auth followed by profile fetch → Verify fixed code executes same database queries and returns same data structure
5. **Signup Flow Preservation**: Mock successful signup → Verify fixed code creates profile, adds interests, and returns same user data as original

### Unit Tests

- Test `withTimeout()` utility function with promises that resolve quickly, reject quickly, and hang indefinitely
- Test `signIn()` with mocked hanging authentication promise (should timeout)
- Test `signIn()` with mocked successful authentication (should complete normally)
- Test `signIn()` with mocked authentication error (should return error)
- Test `signUp()` with mocked hanging authentication promise (should timeout)
- Test `signUp()` with mocked successful signup (should complete normally)
- Test error message formatting for timeout scenarios
- Test that loading state is always reset in Login component after timeout

### Property-Based Tests

- Generate random valid credentials and verify successful authentication flow is preserved (profile fetch, event loading, user data structure)
- Generate random invalid credentials and verify error handling is preserved (error messages, loading state reset)
- Generate random network error scenarios and verify error handling is preserved
- Generate random timeout scenarios (authentication hangs at different stages) and verify timeout triggers correctly
- Test that all authentication operations complete within timeout threshold or return error

### Integration Tests

- Test full login flow with real Supabase client (if possible in test environment) to verify timeout doesn't interfere with normal operation
- Test full signup flow with profile creation and interest addition to verify preservation of multi-step process
- Test rapid successive authentication attempts to verify timeout cleanup doesn't cause race conditions
- Test authentication timeout followed by successful retry to verify state is properly reset
- Test that AuthContext properly handles timeout errors and doesn't set user state
