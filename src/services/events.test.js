import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { getAllEvents, getEventById, createEvent } from './events';
import { supabase } from '../lib/supabase';

// Mock the supabase client
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

global.localStorage = localStorageMock;

describe('Event Retrieval Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('getAllEvents', () => {
    it('should return all events ordered by created_at descending', async () => {
      const mockEvents = [
        {
          id: 'event-1',
          title: 'Event 1',
          host_id: 1,
          host_name: 'Host 1',
          date: 'Mon, Jan 1',
          time: '10:00 AM',
          location: 'Location 1',
          image: 'image1.jpg',
          tags: ['tag1'],
          description: 'Description 1',
          spots: 10,
          joined: 5,
          created_at: '2024-01-01T10:00:00Z',
        },
        {
          id: 'event-2',
          title: 'Event 2',
          host_id: 2,
          host_name: 'Host 2',
          date: 'Tue, Jan 2',
          time: '11:00 AM',
          location: 'Location 2',
          image: 'image2.jpg',
          tags: ['tag2'],
          description: 'Description 2',
          spots: 20,
          joined: 10,
          created_at: '2024-01-02T10:00:00Z',
        },
      ];

      const mockSelect = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockResolvedValue({ data: mockEvents, error: null });

      supabase.from.mockReturnValue({
        select: mockSelect,
        order: mockOrder,
      });

      mockSelect.mockReturnValue({
        order: mockOrder,
      });

      const result = await getAllEvents();

      expect(supabase.from).toHaveBeenCalledWith('events');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(result).toEqual(mockEvents);
    });

    it('should return empty array when no events exist', async () => {
      const mockSelect = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockResolvedValue({ data: [], error: null });

      supabase.from.mockReturnValue({
        select: mockSelect,
        order: mockOrder,
      });

      mockSelect.mockReturnValue({
        order: mockOrder,
      });

      const result = await getAllEvents();

      expect(result).toEqual([]);
    });

    it('should return empty array when database error occurs', async () => {
      const mockSelect = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockResolvedValue({ 
        data: null, 
        error: { message: 'Database error' } 
      });

      supabase.from.mockReturnValue({
        select: mockSelect,
        order: mockOrder,
      });

      mockSelect.mockReturnValue({
        order: mockOrder,
      });

      const result = await getAllEvents();

      expect(result).toEqual([]);
    });

    it('should return all required event fields', async () => {
      const mockEvent = {
        id: 'test-event',
        title: 'Test Event',
        host_id: 1,
        host_name: 'Test Host',
        date: 'Wed, Jan 3',
        time: '12:00 PM',
        location: 'Test Location',
        image: 'test.jpg',
        tags: ['test'],
        description: 'Test Description',
        spots: 15,
        joined: 3,
        created_at: '2024-01-03T12:00:00Z',
      };

      const mockSelect = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockResolvedValue({ data: [mockEvent], error: null });

      supabase.from.mockReturnValue({
        select: mockSelect,
        order: mockOrder,
      });

      mockSelect.mockReturnValue({
        order: mockOrder,
      });

      const result = await getAllEvents();

      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('title');
      expect(result[0]).toHaveProperty('host_id');
      expect(result[0]).toHaveProperty('host_name');
      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('time');
      expect(result[0]).toHaveProperty('location');
      expect(result[0]).toHaveProperty('image');
      expect(result[0]).toHaveProperty('tags');
      expect(result[0]).toHaveProperty('description');
      expect(result[0]).toHaveProperty('spots');
      expect(result[0]).toHaveProperty('joined');
      expect(result[0]).toHaveProperty('created_at');
    });
  });

  describe('getEventById', () => {
    it('should return event when valid ID is provided', async () => {
      const mockEvent = {
        id: 'test-event',
        title: 'Test Event',
        host_id: 1,
        host_name: 'Test Host',
        date: 'Wed, Jan 3',
        time: '12:00 PM',
        location: 'Test Location',
        image: 'test.jpg',
        tags: ['test'],
        description: 'Test Description',
        spots: 15,
        joined: 3,
        created_at: '2024-01-03T12:00:00Z',
      };

      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({ data: mockEvent, error: null });

      supabase.from.mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockReturnValue({
        eq: mockEq,
      });

      mockEq.mockReturnValue({
        single: mockSingle,
      });

      const result = await getEventById('test-event');

      expect(supabase.from).toHaveBeenCalledWith('events');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('id', 'test-event');
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(mockEvent);
    });

    it('should return null when event does not exist', async () => {
      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({ 
        data: null, 
        error: { message: 'No rows found' } 
      });

      supabase.from.mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockReturnValue({
        eq: mockEq,
      });

      mockEq.mockReturnValue({
        single: mockSingle,
      });

      const result = await getEventById('non-existent-event');

      expect(result).toBeNull();
    });

    it('should return null when database error occurs', async () => {
      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({ 
        data: null, 
        error: { message: 'Database error' } 
      });

      supabase.from.mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockReturnValue({
        eq: mockEq,
      });

      mockEq.mockReturnValue({
        single: mockSingle,
      });

      const result = await getEventById('test-event');

      expect(result).toBeNull();
    });

    it('should return event with all required fields', async () => {
      const mockEvent = {
        id: 'complete-event',
        title: 'Complete Event',
        host_id: 2,
        host_name: 'Complete Host',
        date: 'Thu, Jan 4',
        time: '1:00 PM',
        location: 'Complete Location',
        image: 'complete.jpg',
        tags: ['complete', 'test'],
        description: 'Complete Description',
        spots: 25,
        joined: 8,
        created_at: '2024-01-04T13:00:00Z',
      };

      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({ data: mockEvent, error: null });

      supabase.from.mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockReturnValue({
        eq: mockEq,
      });

      mockEq.mockReturnValue({
        single: mockSingle,
      });

      const result = await getEventById('complete-event');

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('host_id');
      expect(result).toHaveProperty('host_name');
      expect(result).toHaveProperty('date');
      expect(result).toHaveProperty('time');
      expect(result).toHaveProperty('location');
      expect(result).toHaveProperty('image');
      expect(result).toHaveProperty('tags');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('spots');
      expect(result).toHaveProperty('joined');
      expect(result).toHaveProperty('created_at');
    });
  });
});

  describe('createEvent', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      localStorage.clear();
      // Set up a mock user session
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        hosted: [],
        joined: [],
      }));
      localStorage.setItem('milo_current_user', JSON.stringify({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        hosted: [],
        joined: [],
      }));
    });

    it('should create event with unique kebab-case ID', async () => {
      const eventData = {
        title: 'Sunday Morning Brunch',
        date: 'Sun, Jan 15',
        time: '10:00 AM',
        location: 'C-Scheme, Jaipur',
        image: 'brunch.jpg',
        tags: ['Food', 'Brunches'],
        description: 'Join us for a delightful Sunday brunch',
        spots: 10,
      };

      const mockInsertedEvent = {
        id: 'sunday-morning-brunch-abc1',
        ...eventData,
        host_id: 1,
        host_name: 'Test User',
        joined: 0,
        created_at: '2024-01-15T10:00:00Z',
      };

      const mockInsert = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({ 
        data: mockInsertedEvent, 
        error: null 
      });

      const mockUserSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockUserSingle = vi.fn().mockResolvedValue({ 
        data: { hosted: [] }, 
        error: null 
      });

      const mockUpdate = vi.fn().mockReturnThis();
      const mockUpdateEq = vi.fn().mockResolvedValue({ error: null });

      supabase.from.mockImplementation((table) => {
        if (table === 'events') {
          return {
            insert: mockInsert,
            delete: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({ error: null }),
          };
        } else if (table === 'users') {
          return {
            select: mockUserSelect,
            update: mockUpdate,
          };
        }
      });

      mockInsert.mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockReturnValue({
        single: mockSingle,
      });

      mockUserSelect.mockReturnValue({
        eq: mockEq,
      });

      mockEq.mockReturnValue({
        single: mockUserSingle,
      });

      mockUpdate.mockReturnValue({
        eq: mockUpdateEq,
      });

      const result = await createEvent(eventData, 1, 'Test User');

      expect(result.success).toBe(true);
      expect(result.event).toBeDefined();
      expect(result.event.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(result.event.host_id).toBe(1);
      expect(result.event.host_name).toBe('Test User');
      expect(result.event.joined).toBe(0);
    });

    it('should initialize joined count to zero', async () => {
      const eventData = {
        title: 'Test Event',
        date: 'Mon, Jan 16',
        time: '2:00 PM',
        location: 'Test Location',
        image: 'test.jpg',
        tags: ['Test'],
        description: 'Test description',
        spots: 5,
      };

      const mockInsertedEvent = {
        id: 'test-event-xyz1',
        ...eventData,
        host_id: 1,
        host_name: 'Test User',
        joined: 0,
        created_at: '2024-01-16T14:00:00Z',
      };

      const mockInsert = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({ 
        data: mockInsertedEvent, 
        error: null 
      });

      const mockUserSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockUserSingle = vi.fn().mockResolvedValue({ 
        data: { hosted: [] }, 
        error: null 
      });

      const mockUpdate = vi.fn().mockReturnThis();
      const mockUpdateEq = vi.fn().mockResolvedValue({ error: null });

      supabase.from.mockImplementation((table) => {
        if (table === 'events') {
          return {
            insert: mockInsert,
            delete: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({ error: null }),
          };
        } else if (table === 'users') {
          return {
            select: mockUserSelect,
            update: mockUpdate,
          };
        }
      });

      mockInsert.mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockReturnValue({
        single: mockSingle,
      });

      mockUserSelect.mockReturnValue({
        eq: mockEq,
      });

      mockEq.mockReturnValue({
        single: mockUserSingle,
      });

      mockUpdate.mockReturnValue({
        eq: mockUpdateEq,
      });

      const result = await createEvent(eventData, 1, 'Test User');

      expect(result.success).toBe(true);
      expect(result.event.joined).toBe(0);
    });

    it('should update host user hosted array', async () => {
      const eventData = {
        title: 'Networking Event',
        date: 'Tue, Jan 17',
        time: '6:00 PM',
        location: 'Central Park, Jaipur',
        image: 'networking.jpg',
        tags: ['Networking'],
        description: 'Professional networking event',
        spots: 20,
      };

      const mockInsertedEvent = {
        id: 'networking-event-def2',
        ...eventData,
        host_id: 1,
        host_name: 'Test User',
        joined: 0,
        created_at: '2024-01-17T18:00:00Z',
      };

      const mockInsert = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({ 
        data: mockInsertedEvent, 
        error: null 
      });

      const mockUserSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockUserSingle = vi.fn().mockResolvedValue({ 
        data: { hosted: ['existing-event-1'] }, 
        error: null 
      });

      const mockUpdate = vi.fn().mockReturnThis();
      const mockUpdateEq = vi.fn().mockResolvedValue({ error: null });

      supabase.from.mockImplementation((table) => {
        if (table === 'events') {
          return {
            insert: mockInsert,
            delete: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({ error: null }),
          };
        } else if (table === 'users') {
          return {
            select: mockUserSelect,
            update: mockUpdate,
          };
        }
      });

      mockInsert.mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockReturnValue({
        single: mockSingle,
      });

      mockUserSelect.mockReturnValue({
        eq: mockEq,
      });

      mockEq.mockReturnValue({
        single: mockUserSingle,
      });

      mockUpdate.mockReturnValue({
        eq: mockUpdateEq,
      });

      const result = await createEvent(eventData, 1, 'Test User');

      expect(result.success).toBe(true);
      expect(mockUpdate).toHaveBeenCalledWith({ 
        hosted: ['existing-event-1', 'networking-event-def2'] 
      });
    });

    it('should update localStorage session with new hosted event', async () => {
      const eventData = {
        title: 'Art Workshop',
        date: 'Wed, Jan 18',
        time: '3:00 PM',
        location: 'Hawa Mahal Studios, Jaipur',
        image: 'art.jpg',
        tags: ['Art'],
        description: 'Creative art workshop',
        spots: 15,
      };

      const mockInsertedEvent = {
        id: 'art-workshop-ghi3',
        ...eventData,
        host_id: 1,
        host_name: 'Test User',
        joined: 0,
        created_at: '2024-01-18T15:00:00Z',
      };

      const mockInsert = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({ 
        data: mockInsertedEvent, 
        error: null 
      });

      const mockUserSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockUserSingle = vi.fn().mockResolvedValue({ 
        data: { hosted: [] }, 
        error: null 
      });

      const mockUpdate = vi.fn().mockReturnThis();
      const mockUpdateEq = vi.fn().mockResolvedValue({ error: null });

      supabase.from.mockImplementation((table) => {
        if (table === 'events') {
          return {
            insert: mockInsert,
            delete: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({ error: null }),
          };
        } else if (table === 'users') {
          return {
            select: mockUserSelect,
            update: mockUpdate,
          };
        }
      });

      mockInsert.mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockReturnValue({
        single: mockSingle,
      });

      mockUserSelect.mockReturnValue({
        eq: mockEq,
      });

      mockEq.mockReturnValue({
        single: mockUserSingle,
      });

      mockUpdate.mockReturnValue({
        eq: mockUpdateEq,
      });

      await createEvent(eventData, 1, 'Test User');

      const updatedUser = JSON.parse(localStorage.getItem('user'));
      const updatedCurrentUser = JSON.parse(localStorage.getItem('milo_current_user'));

      expect(updatedUser.hosted).toContain('art-workshop-ghi3');
      expect(updatedCurrentUser.hosted).toContain('art-workshop-ghi3');
    });

    it('should rollback event creation if user update fails', async () => {
      const eventData = {
        title: 'Failed Event',
        date: 'Thu, Jan 19',
        time: '4:00 PM',
        location: 'Test Location',
        image: 'failed.jpg',
        tags: ['Test'],
        description: 'This event should be rolled back',
        spots: 10,
      };

      const mockInsertedEvent = {
        id: 'failed-event-jkl4',
        ...eventData,
        host_id: 1,
        host_name: 'Test User',
        joined: 0,
        created_at: '2024-01-19T16:00:00Z',
      };

      const mockInsert = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({ 
        data: mockInsertedEvent, 
        error: null 
      });

      const mockUserSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockUserSingle = vi.fn().mockResolvedValue({ 
        data: { hosted: [] }, 
        error: null 
      });

      const mockUpdate = vi.fn().mockReturnThis();
      const mockUpdateEq = vi.fn().mockResolvedValue({ 
        error: { message: 'User update failed' } 
      });

      const mockDelete = vi.fn().mockReturnThis();
      const mockDeleteEq = vi.fn().mockResolvedValue({ error: null });

      supabase.from.mockImplementation((table) => {
        if (table === 'events') {
          return {
            insert: mockInsert,
            delete: mockDelete,
          };
        } else if (table === 'users') {
          return {
            select: mockUserSelect,
            update: mockUpdate,
          };
        }
      });

      mockInsert.mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockReturnValue({
        single: mockSingle,
      });

      mockUserSelect.mockReturnValue({
        eq: mockEq,
      });

      mockEq.mockReturnValue({
        single: mockUserSingle,
      });

      mockUpdate.mockReturnValue({
        eq: mockUpdateEq,
      });

      mockDelete.mockReturnValue({
        eq: mockDeleteEq,
      });

      const result = await createEvent(eventData, 1, 'Test User');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to update user');
      expect(mockDelete).toHaveBeenCalled();
      expect(mockDeleteEq).toHaveBeenCalledWith('id', 'failed-event-jkl4');
    });

    it('should return error if event insertion fails', async () => {
      const eventData = {
        title: 'Invalid Event',
        date: 'Fri, Jan 20',
        time: '5:00 PM',
        location: 'Test Location',
        image: 'invalid.jpg',
        tags: ['Test'],
        description: 'This event should fail to insert',
        spots: 10,
      };

      const mockInsert = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({ 
        data: null, 
        error: { message: 'Insert failed' } 
      });

      supabase.from.mockImplementation((table) => {
        if (table === 'events') {
          return {
            insert: mockInsert,
          };
        }
      });

      mockInsert.mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockReturnValue({
        single: mockSingle,
      });

      const result = await createEvent(eventData, 1, 'Test User');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Insert failed');
    });

    it('should rollback event creation if user fetch fails', async () => {
      const eventData = {
        title: 'User Fetch Failed Event',
        date: 'Sat, Jan 21',
        time: '11:00 AM',
        location: 'Test Location',
        image: 'userfetch.jpg',
        tags: ['Test'],
        description: 'This event should be rolled back due to user fetch failure',
        spots: 10,
      };

      const mockInsertedEvent = {
        id: 'user-fetch-failed-event-mno5',
        ...eventData,
        host_id: 1,
        host_name: 'Test User',
        joined: 0,
        created_at: '2024-01-21T11:00:00Z',
      };

      const mockInsert = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({ 
        data: mockInsertedEvent, 
        error: null 
      });

      const mockUserSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockUserSingle = vi.fn().mockResolvedValue({ 
        data: null, 
        error: { message: 'User not found' } 
      });

      const mockDelete = vi.fn().mockReturnThis();
      const mockDeleteEq = vi.fn().mockResolvedValue({ error: null });

      supabase.from.mockImplementation((table) => {
        if (table === 'events') {
          return {
            insert: mockInsert,
            delete: mockDelete,
          };
        } else if (table === 'users') {
          return {
            select: mockUserSelect,
          };
        }
      });

      mockInsert.mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockReturnValue({
        single: mockSingle,
      });

      mockUserSelect.mockReturnValue({
        eq: mockEq,
      });

      mockEq.mockReturnValue({
        single: mockUserSingle,
      });

      mockDelete.mockReturnValue({
        eq: mockDeleteEq,
      });

      const result = await createEvent(eventData, 1, 'Test User');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to update user');
      expect(mockDelete).toHaveBeenCalled();
      expect(mockDeleteEq).toHaveBeenCalledWith('id', 'user-fetch-failed-event-mno5');
    });
  });
});
