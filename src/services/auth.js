// Authentication using Supabase
import { supabase } from '../lib/supabase';

// Sign up new user
export const signUp = async ({ email, password, name, dob, occupation, country, state, city, gender, relationship, interests }) => {
  try {
    console.log('Starting signup for:', email);
    console.log('Signup data:', { email, name, dob, occupation, country, state, city, gender, relationship, interests: interests?.length });
    
    // Check if email already exists
    const { data: existing, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .limit(1);
    
    if (checkError) {
      console.error('Error checking email:', checkError);
      return {
        success: false,
        error: `Database error: ${checkError.message}`,
      };
    }
    
    if (existing && existing.length > 0) {
      console.log('Email already exists');
      return {
        success: false,
        error: 'Email already registered',
      };
    }
    
    // Create new user record
    const newUser = {
      email,
      password, // TODO: Hash in production
      name,
      dob,
      occupation,
      home: {
        country,
        state,
        city,
      },
      gender,
      relationship,
      interests,
      joined: [],
      hosted: [],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    };
    
    console.log('Attempting to insert user:', { ...newUser, password: '***' });
    
    const { data: insertedUser, error: insertError } = await supabase
      .from('users')
      .insert(newUser)
      .select()
      .single();
    
    if (insertError) {
      console.error('Error inserting user - Full error:', insertError);
      console.error('Error details:', {
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        code: insertError.code
      });
      return {
        success: false,
        error: `Registration failed: ${insertError.message}`,
      };
    }
    
    if (!insertedUser) {
      console.error('No user returned after insert');
      return {
        success: false,
        error: 'Registration failed: No user data returned',
      };
    }
    
    console.log('User inserted successfully:', insertedUser.id);
    
    // Store session in localStorage
    const sessionUser = {
      id: insertedUser.id,
      email: insertedUser.email,
      name: insertedUser.name,
      avatar: insertedUser.avatar,
      occupation: insertedUser.occupation,
      home: insertedUser.home,
      gender: insertedUser.gender,
      relationship: insertedUser.relationship,
      interests: insertedUser.interests,
      joined: insertedUser.joined || [],
      hosted: insertedUser.hosted || [],
    };
    
    localStorage.setItem('user', JSON.stringify(sessionUser));
    localStorage.setItem('milo_current_user', JSON.stringify(sessionUser));
    
    console.log('Signup complete!');
    return { success: true, user: sessionUser };
  } catch (error) {
    console.error('Sign up exception:', error);
    console.error('Exception stack:', error.stack);
    return {
      success: false,
      error: error.message || 'Signup failed. Please try again.',
    };
  }
};

// Sign in user
export const signIn = async (email, password) => {
  try {
    console.log('Attempting sign in for:', email);
    
    // Query user by email
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1);
    
    if (error) {
      console.error('Database error:', error);
      return {
        success: false,
        error: 'Login failed. Please try again.',
      };
    }
    
    if (!users || users.length === 0) {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }
    
    const user = users[0];
    
    // Compare password (plain text for now)
    if (user.password !== password) {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }
    
    // Store session in localStorage
    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      occupation: user.occupation,
      home: user.home,
      gender: user.gender,
      relationship: user.relationship,
      interests: user.interests,
      joined: user.joined || [],
      hosted: user.hosted || [],
    };
    
    localStorage.setItem('user', JSON.stringify(sessionUser));
    localStorage.setItem('milo_current_user', JSON.stringify(sessionUser));
    
    console.log('Sign in complete!');
    return { success: true, user: sessionUser };
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      error: error.message || 'Login failed. Please try again.',
    };
  }
};

// Sign out user
export const signOut = async () => {
  try {
    localStorage.removeItem('milo_current_user');
    localStorage.removeItem('user');
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get current session
export const getSession = async () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
};

// Get current user with profile
export const getCurrentUser = async () => {
  try {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      return null;
    }
    
    const user = JSON.parse(storedUser);
    
    // Verify user still exists in database
    if (user.id) {
      const { data: dbUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error || !dbUser) {
        // User no longer exists, clear session
        localStorage.removeItem('user');
        localStorage.removeItem('milo_current_user');
        return null;
      }
      
      // Return fresh data from database
      return {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        avatar: dbUser.avatar,
        occupation: dbUser.occupation,
        home: dbUser.home,
        gender: dbUser.gender,
        relationship: dbUser.relationship,
        interests: dbUser.interests,
        joined: dbUser.joined || [],
        hosted: dbUser.hosted || [],
      };
    }
    
    return user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

// Update user profile
export const updateProfile = async (userId, updates) => {
  try {
    // Update in database
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId);
    
    if (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: 'Failed to update profile',
      };
    }
    
    // Update localStorage session
    const user = localStorage.getItem('user');
    if (user) {
      const currentUser = JSON.parse(user);
      if (currentUser.id === userId) {
        const updatedUser = { ...currentUser, ...updates };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('milo_current_user', JSON.stringify(updatedUser));
        return { success: true };
      }
    }
    
    return {
      success: false,
      error: 'User not found',
    };
  } catch (error) {
    console.error('Update profile error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
