// Supabase-based events management
import { supabase } from '../lib/supabase';
import { events as dummyEvents } from '../data/events';

const EVENTS_KEY = 'milo_events';
const EVENTS_INITIALIZED_KEY = 'milo_events_initialized';

// Helper to get all events from localStorage (legacy)
const getAllEventsFromStorage = () => {
  const events = localStorage.getItem(EVENTS_KEY);
  return events ? JSON.parse(events) : [];
};

// Helper to save events to localStorage (legacy)
const saveEventsToStorage = (events) => {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
};

// Initialize with dummy events if localStorage is empty (legacy)
const initializeEvents = () => {
  // Check if localStorage is available (not in test environment)
  if (typeof localStorage === 'undefined') {
    return;
  }
  
  const initialized = localStorage.getItem(EVENTS_INITIALIZED_KEY);
  if (!initialized) {
    // Add host_id and host_name to dummy events
    const eventsWithHostInfo = dummyEvents.map(event => ({
      ...event,
      host_id: 'dummy-host-' + event.id,
      host_name: event.host,
      created_at: new Date().toISOString(),
    }));
    saveEventsToStorage(eventsWithHostInfo);
    localStorage.setItem(EVENTS_INITIALIZED_KEY, 'true');
  }
};

// Initialize events on module load (legacy)
initializeEvents();

// Generate a simple UUID
const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Get all events from Supabase
export const getAllEvents = async () => {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Get all events error:', error);
      return [];
    }
    
    return events || [];
  } catch (error) {
    console.error('Get all events error:', error);
    return [];
  }
};

// Get event by ID from Supabase
export const getEventById = async (eventId) => {
  try {
    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();
    
    if (error) {
      console.error('Get event by ID error:', error);
      return null;
    }
    
    return event;
  } catch (error) {
    console.error('Get event by ID error:', error);
    return null;
  }
};

// Helper to generate kebab-case event ID
const generateKebabCaseId = (title) => {
  const kebabTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  const randomChars = Math.random().toString(36).substring(2, 6);
  return `${kebabTitle}-${randomChars}`;
};

// Create new event
export const createEvent = async (eventData, userId, userName) => {
  try {
    // Step 1: Generate unique kebab-case event ID
    const eventId = generateKebabCaseId(eventData.title);
    
    // Step 2: Create event record
    const newEvent = {
      id: eventId,
      title: eventData.title,
      host_id: userId,
      host_name: userName,
      date: eventData.date,
      time: eventData.time,
      location: eventData.location,
      image: eventData.image,
      tags: eventData.tags || [],
      description: eventData.description,
      spots: eventData.spots,
      joined: 0,
    };
    
    // Step 3: Insert event record into Supabase
    const { data: insertedEvent, error: insertError } = await supabase
      .from('events')
      .insert(newEvent)
      .select()
      .single();
    
    if (insertError || !insertedEvent) {
      console.error('Create event error:', insertError);
      return {
        success: false,
        error: insertError?.message || 'Failed to create event',
      };
    }
    
    // Step 4: Update host user's hosted array
    const { data: user, error: getUserError } = await supabase
      .from('users')
      .select('hosted')
      .eq('id', userId)
      .single();
    
    if (getUserError) {
      // Rollback: delete the event we just created
      await supabase.from('events').delete().eq('id', eventId);
      console.error('Get user error:', getUserError);
      return {
        success: false,
        error: 'Failed to update user',
      };
    }
    
    const hosted = user?.hosted || [];
    
    const { error: updateUserError } = await supabase
      .from('users')
      .update({ hosted: [...hosted, eventId] })
      .eq('id', userId);
    
    if (updateUserError) {
      // Rollback: delete the event we just created
      await supabase.from('events').delete().eq('id', eventId);
      console.error('Update user error:', updateUserError);
      return {
        success: false,
        error: 'Failed to update user',
      };
    }
    
    // Step 5: Update localStorage session with new hosted event
    const sessionUser = JSON.parse(localStorage.getItem('user') || '{}');
    sessionUser.hosted = [...hosted, eventId];
    localStorage.setItem('user', JSON.stringify(sessionUser));
    localStorage.setItem('milo_current_user', JSON.stringify(sessionUser));

    return {
      success: true,
      event: insertedEvent,
    };
  } catch (error) {
    console.error('Create event error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Update event
export const updateEvent = async (eventId, updates) => {
  try {
    const events = getAllEventsFromStorage();
    const eventIndex = events.findIndex(e => e.id === eventId);
    
    if (eventIndex === -1) {
      return {
        success: false,
        error: 'Event not found',
      };
    }

    events[eventIndex] = { ...events[eventIndex], ...updates };
    saveEventsToStorage(events);

    return {
      success: true,
      event: events[eventIndex],
    };
  } catch (error) {
    console.error('Update event error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Delete event
export const deleteEvent = async (eventId, userId) => {
  try {
    // Step 1: Verify user is the host
    const { data: event, error: getEventError } = await supabase
      .from('events')
      .select('host_id')
      .eq('id', eventId)
      .single();
    
    if (getEventError || !event) {
      console.error('Get event error:', getEventError);
      return {
        success: false,
        error: 'Event not found',
      };
    }
    
    if (event.host_id !== userId) {
      return {
        success: false,
        error: 'You are not the host of this event',
      };
    }
    
    // Step 2: Delete event record (CASCADE will handle foreign keys)
    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);
    
    if (deleteError) {
      console.error('Delete event error:', deleteError);
      return {
        success: false,
        error: 'Failed to delete event',
      };
    }
    
    // Step 3: Remove event ID from all users' joined arrays
    // Get all users who joined this event
    const { data: users, error: getUsersError } = await supabase
      .from('users')
      .select('id, joined')
      .contains('joined', [eventId]);
    
    if (!getUsersError && users) {
      for (const user of users) {
        const updatedJoined = (user.joined || []).filter(id => id !== eventId);
        await supabase
          .from('users')
          .update({ joined: updatedJoined })
          .eq('id', user.id);
      }
    }
    
    // Step 4: Remove event ID from host user's hosted array
    const { data: hostUser, error: getHostError } = await supabase
      .from('users')
      .select('hosted')
      .eq('id', userId)
      .single();
    
    if (!getHostError && hostUser) {
      const updatedHosted = (hostUser.hosted || []).filter(id => id !== eventId);
      await supabase
        .from('users')
        .update({ hosted: updatedHosted })
        .eq('id', userId);
      
      // Step 5: Update localStorage session
      const sessionUser = JSON.parse(localStorage.getItem('user') || '{}');
      sessionUser.hosted = updatedHosted;
      localStorage.setItem('user', JSON.stringify(sessionUser));
      localStorage.setItem('milo_current_user', JSON.stringify(sessionUser));
    }

    return { success: true };
  } catch (error) {
    console.error('Delete event error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Join event
export const joinEvent = async (eventId, userId) => {
  try {
    // Step 1: Fetch user record
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('joined')
      .eq('id', userId)
      .single();
    
    if (userError || !user) {
      console.error('Get user error:', userError);
      return {
        success: false,
        error: 'User not found',
      };
    }
    
    // Step 2: Check if already joined
    const joined = user.joined || [];
    if (joined.includes(eventId)) {
      return {
        success: false,
        error: 'Already joined this event',
      };
    }
    
    // Step 3: Update user's joined array
    const { error: updateUserError } = await supabase
      .from('users')
      .update({ joined: [...joined, eventId] })
      .eq('id', userId);
    
    if (updateUserError) {
      console.error('Update user error:', updateUserError);
      return {
        success: false,
        error: 'Failed to join event',
      };
    }
    
    // Step 4: Increment event's joined count
    const { error: updateEventError } = await supabase
      .rpc('increment_event_joined', { event_id: eventId });
    
    if (updateEventError) {
      // Rollback user update
      await supabase
        .from('users')
        .update({ joined })
        .eq('id', userId);
      console.error('Update event error:', updateEventError);
      return {
        success: false,
        error: 'Failed to update event',
      };
    }
    
    // Step 5: Update localStorage session
    const sessionUser = JSON.parse(localStorage.getItem('user') || '{}');
    sessionUser.joined = [...joined, eventId];
    localStorage.setItem('user', JSON.stringify(sessionUser));
    localStorage.setItem('milo_current_user', JSON.stringify(sessionUser));
    
    return { success: true };
  } catch (error) {
    console.error('Join event error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Leave event
export const leaveEvent = async (eventId, userId) => {
  try {
    // Step 1: Fetch user record
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('joined')
      .eq('id', userId)
      .single();
    
    if (userError || !user) {
      console.error('Get user error:', userError);
      return {
        success: false,
        error: 'User not found',
      };
    }
    
    // Step 2: Check if user has joined the event
    const joined = user.joined || [];
    if (!joined.includes(eventId)) {
      return {
        success: false,
        error: 'You have not joined this event',
      };
    }
    
    // Step 3: Remove event ID from user's joined array
    const updatedJoined = joined.filter(id => id !== eventId);
    const { error: updateUserError } = await supabase
      .from('users')
      .update({ joined: updatedJoined })
      .eq('id', userId);
    
    if (updateUserError) {
      console.error('Update user error:', updateUserError);
      return {
        success: false,
        error: 'Failed to leave event',
      };
    }
    
    // Step 4: Decrement event's joined count
    const { error: updateEventError } = await supabase
      .rpc('decrement_event_joined', { event_id: eventId });
    
    if (updateEventError) {
      // Rollback user update
      await supabase
        .from('users')
        .update({ joined })
        .eq('id', userId);
      console.error('Update event error:', updateEventError);
      return {
        success: false,
        error: 'Failed to update event',
      };
    }
    
    // Step 5: Update localStorage session
    const sessionUser = JSON.parse(localStorage.getItem('user') || '{}');
    sessionUser.joined = updatedJoined;
    localStorage.setItem('user', JSON.stringify(sessionUser));
    localStorage.setItem('milo_current_user', JSON.stringify(sessionUser));
    
    return { success: true };
  } catch (error) {
    console.error('Leave event error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get event participants
export const getEventParticipants = async (eventId) => {
  try {
    const { data: event, error } = await supabase
      .from('events')
      .select('joined')
      .eq('id', eventId)
      .single();
    
    if (error || !event) {
      console.error('Get event participants error:', error);
      return [];
    }
    
    // Return an array with length equal to joined count
    // This maintains compatibility with existing code that checks participants.length
    const joinedCount = event.joined || 0;
    return Array(joinedCount).fill(null);
  } catch (error) {
    console.error('Get event participants error:', error);
    return [];
  }
};

// Check if user is host
export const isUserHost = async (eventId, userId) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('hosted')
      .eq('id', userId)
      .single();
    
    if (error || !user) {
      return false;
    }
    
    return (user.hosted || []).includes(eventId);
  } catch (error) {
    console.error('Check if user is host error:', error);
    return false;
  }
};

// Check if user joined event
export const hasUserJoined = async (eventId, userId) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('joined')
      .eq('id', userId)
      .single();
    
    if (error || !user) {
      return false;
    }
    
    return (user.joined || []).includes(eventId);
  } catch (error) {
    console.error('Check if user joined error:', error);
    return false;
  }
};
