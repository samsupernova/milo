/**
 * Unit Tests for Authentication Service
 * 
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5**
 * 
 * Tests the signIn and signUp functions with Supabase integration
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { signIn, signUp, getCurrentUser, updateProfile } from './auth.js';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

global.localStorage = localStorageMock;

// Mock the supabase module
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          limit: vi.fn(() => ({
            then: vi.fn(),
          })),
          single: vi.fn(() => ({
            then: vi.fn(),
          })),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            then: vi.fn(),
          })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          then: vi.fn(),
        })),
      })),
    })),
  },
}));

import { supabase } from '../lib/supabase';

describe('Authentication Service - signIn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should successfully sign in with valid credentials', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      avatar: 'https://example.com/avatar.png',
      occupation: 'Developer',
      home: { country: 'USA', state: 'CA', city: 'SF' },
      gender: 'male',
      relationship: 'Single',
      interests: ['coding'],
      joined: [],
      hosted: [],
    };

    // Mock Supabase query chain
    const mockLimit = vi.fn().mockResolvedValue({
      data: [mockUser],
      error: null,
    });
    const mockEq = vi.fn().mockReturnValue({ limit: mockLimit });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    supabase.from.mockReturnValue({ select: mockSelect });

    const result = await signIn('test@example.com', 'password123');

    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe('test@example.com');
    expect(result.user.name).toBe('Test User');
    
    // Verify session stored in localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    expect(storedUser).toBeDefined();
    expect(storedUser.email).toBe('test@example.com');
  });

  it('should fail with invalid email', async () => {
    // Mock Supabase to return no users
    const mockLimit = vi.fn().mockResolvedValue({
      data: [],
      error: null,
    });
    const mockEq = vi.fn().mockReturnValue({ limit: mockLimit });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    supabase.from.mockReturnValue({ select: mockSelect });

    const result = await signIn('nonexistent@example.com', 'password123');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid email or password');
    
    // Verify no session stored
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('should fail with incorrect password', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'correctpassword',
      name: 'Test User',
    };

    const mockLimit = vi.fn().mockResolvedValue({
      data: [mockUser],
      error: null,
    });
    const mockEq = vi.fn().mockReturnValue({ limit: mockLimit });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    supabase.from.mockReturnValue({ select: mockSelect });

    const result = await signIn('test@example.com', 'wrongpassword');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid email or password');
    
    // Verify no session stored
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('should handle database errors gracefully', async () => {
    // Mock Supabase to return an error
    const mockLimit = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'Database connection failed' },
    });
    const mockEq = vi.fn().mockReturnValue({ limit: mockLimit });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    supabase.from.mockReturnValue({ select: mockSelect });

    const result = await signIn('test@example.com', 'password123');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Login failed. Please try again.');
  });

  it('should store all required user fields in session', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      avatar: 'https://example.com/avatar.png',
      occupation: 'Developer',
      home: { country: 'USA', state: 'CA', city: 'SF' },
      gender: 'male',
      relationship: 'Single',
      interests: ['coding', 'reading'],
      joined: ['event1', 'event2'],
      hosted: ['event3'],
    };

    const mockLimit = vi.fn().mockResolvedValue({
      data: [mockUser],
      error: null,
    });
    const mockEq = vi.fn().mockReturnValue({ limit: mockLimit });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    supabase.from.mockReturnValue({ select: mockSelect });

    const result = await signIn('test@example.com', 'password123');

    expect(result.success).toBe(true);
    expect(result.user).toMatchObject({
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      avatar: 'https://example.com/avatar.png',
      occupation: 'Developer',
      home: { country: 'USA', state: 'CA', city: 'SF' },
      gender: 'male',
      relationship: 'Single',
      interests: ['coding', 'reading'],
      joined: ['event1', 'event2'],
      hosted: ['event3'],
    });
    
    // Verify password is not included in session
    expect(result.user.password).toBeUndefined();
  });
});

describe('Authentication Service - signUp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should successfully register a new user', async () => {
    const userData = {
      email: 'newuser@example.com',
      password: 'password123',
      name: 'New User',
      dob: '1990-01-01',
      occupation: 'Designer',
      country: 'USA',
      state: 'CA',
      city: 'SF',
      gender: 'female',
      relationship: 'Single',
      interests: ['art', 'music'],
    };

    // Mock email check - no existing user
    const mockCheckLimit = vi.fn().mockResolvedValue({
      data: [],
      error: null,
    });
    const mockCheckEq = vi.fn().mockReturnValue({ limit: mockCheckLimit });
    const mockCheckSelect = vi.fn().mockReturnValue({ eq: mockCheckEq });

    // Mock insert
    const mockInsertedUser = {
      id: 1,
      ...userData,
      home: { country: 'USA', state: 'CA', city: 'SF' },
      joined: [],
      hosted: [],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name)}`,
    };
    const mockSingle = vi.fn().mockResolvedValue({
      data: mockInsertedUser,
      error: null,
    });
    const mockInsertSelect = vi.fn().mockReturnValue({ single: mockSingle });
    const mockInsert = vi.fn().mockReturnValue({ select: mockInsertSelect });

    supabase.from.mockReturnValueOnce({ select: mockCheckSelect })
      .mockReturnValueOnce({ insert: mockInsert });

    const result = await signUp(userData);

    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe('newuser@example.com');
    expect(result.user.name).toBe('New User');
    
    // Verify session stored
    const storedUser = JSON.parse(localStorage.getItem('user'));
    expect(storedUser).toBeDefined();
    expect(storedUser.email).toBe('newuser@example.com');
  });

  it('should fail when email already exists', async () => {
    const userData = {
      email: 'existing@example.com',
      password: 'password123',
      name: 'Test User',
      dob: '1990-01-01',
      occupation: 'Developer',
      country: 'USA',
      state: 'CA',
      city: 'SF',
      gender: 'male',
      relationship: 'Single',
      interests: ['coding'],
    };

    // Mock email check - user exists
    const mockCheckLimit = vi.fn().mockResolvedValue({
      data: [{ id: 1 }],
      error: null,
    });
    const mockCheckEq = vi.fn().mockReturnValue({ limit: mockCheckLimit });
    const mockCheckSelect = vi.fn().mockReturnValue({ eq: mockCheckEq });
    supabase.from.mockReturnValue({ select: mockCheckSelect });

    const result = await signUp(userData);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Email already registered');
    
    // Verify no session stored
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('should initialize new users with empty joined and hosted arrays', async () => {
    const userData = {
      email: 'newuser@example.com',
      password: 'password123',
      name: 'New User',
      dob: '1990-01-01',
      occupation: 'Designer',
      country: 'USA',
      state: 'CA',
      city: 'SF',
      gender: 'female',
      relationship: 'Single',
      interests: ['art'],
    };

    const mockCheckLimit = vi.fn().mockResolvedValue({
      data: [],
      error: null,
    });
    const mockCheckEq = vi.fn().mockReturnValue({ limit: mockCheckLimit });
    const mockCheckSelect = vi.fn().mockReturnValue({ eq: mockCheckEq });

    const mockInsertedUser = {
      id: 1,
      ...userData,
      home: { country: 'USA', state: 'CA', city: 'SF' },
      joined: [],
      hosted: [],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name)}`,
    };
    const mockSingle = vi.fn().mockResolvedValue({
      data: mockInsertedUser,
      error: null,
    });
    const mockInsertSelect = vi.fn().mockReturnValue({ single: mockSingle });
    const mockInsert = vi.fn().mockReturnValue({ select: mockInsertSelect });

    supabase.from.mockReturnValueOnce({ select: mockCheckSelect })
      .mockReturnValueOnce({ insert: mockInsert });

    const result = await signUp(userData);

    expect(result.success).toBe(true);
    expect(result.user.joined).toEqual([]);
    expect(result.user.hosted).toEqual([]);
  });
});
