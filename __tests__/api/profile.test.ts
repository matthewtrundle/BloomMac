import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/profile/save';
import { createClient } from '@supabase/supabase-js';

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(() => ({
      insert: jest.fn(),
      update: jest.fn(),
    })),
  })),
}));

describe('/api/profile/save', () => {
  let mockSupabase: any;

  beforeEach(() => {
    mockSupabase = createClient('', '');
    jest.clearAllMocks();
  });

  const validProfileData = {
    firstName: 'Test',
    lastName: 'User',
    childrenCount: 2,
    isExpecting: false,
    phone: '5551234567',
  };

  test('should save valid profile data', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: 'sb-access-token=valid-token',
      },
      body: validProfileData,
    });

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null,
    });

    mockSupabase.from().insert.mockResolvedValue({
      data: [{ id: 1, ...validProfileData }],
      error: null,
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      success: true,
      profile: expect.objectContaining(validProfileData),
    });
  });

  test('should handle special characters in names', async () => {
    const specialCharData = {
      ...validProfileData,
      firstName: "Jean-François",
      lastName: "O'Connor-Smith",
    };

    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: 'sb-access-token=valid-token',
      },
      body: specialCharData,
    });

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null,
    });

    mockSupabase.from().insert.mockResolvedValue({
      data: [{ id: 1, ...specialCharData }],
      error: null,
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(mockSupabase.from().insert).toHaveBeenCalledWith(
      expect.objectContaining({
        first_name: "Jean-François",
        last_name: "O'Connor-Smith",
      })
    );
  });

  test('should validate required fields', async () => {
    const invalidData = {
      firstName: '', // Empty required field
      lastName: 'User',
      childrenCount: 1,
      phone: '5551234567',
    };

    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: 'sb-access-token=valid-token',
      },
      body: invalidData,
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'First name is required',
    });
  });

  test('should handle expecting mothers with 0 children', async () => {
    const expectingData = {
      ...validProfileData,
      childrenCount: 0,
      isExpecting: true,
      dueDate: '2024-06-01',
    };

    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: 'sb-access-token=valid-token',
      },
      body: expectingData,
    });

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null,
    });

    mockSupabase.from().insert.mockResolvedValue({
      data: [{ id: 1, ...expectingData }],
      error: null,
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(mockSupabase.from().insert).toHaveBeenCalledWith(
      expect.objectContaining({
        children_count: 0,
        is_expecting: true,
        due_date: '2024-06-01',
      })
    );
  });

  test('should handle missing authentication', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        // No auth cookie
      },
      body: validProfileData,
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Authentication required',
    });
  });

  test('should handle session expired', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: 'sb-access-token=expired-token',
      },
      body: validProfileData,
    });

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'Token expired' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Session expired',
    });
  });

  test('should validate phone number format', async () => {
    const testCases = [
      { phone: '123', valid: false },
      { phone: 'abc-def-ghij', valid: false },
      { phone: '5551234567', valid: true },
      { phone: '555-123-4567', valid: true },
      { phone: '(555) 123-4567', valid: true },
      { phone: '+1 555 123 4567', valid: true },
    ];

    for (const testCase of testCases) {
      const data = { ...validProfileData, phone: testCase.phone };
      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          cookie: 'sb-access-token=valid-token',
        },
        body: data,
      });

      if (testCase.valid) {
        mockSupabase.auth.getUser.mockResolvedValue({
          data: { user: { id: 'user-123' } },
          error: null,
        });

        mockSupabase.from().insert.mockResolvedValue({
          data: [{ id: 1, ...data }],
          error: null,
        });
      }

      await handler(req, res);

      if (testCase.valid) {
        expect(res._getStatusCode()).toBe(200);
      } else {
        expect(res._getStatusCode()).toBe(400);
        expect(JSON.parse(res._getData())).toEqual({
          error: 'Invalid phone number format',
        });
      }
    }
  });

  test('should handle database errors gracefully', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: 'sb-access-token=valid-token',
      },
      body: validProfileData,
    });

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null,
    });

    mockSupabase.from().insert.mockResolvedValue({
      data: null,
      error: { message: 'Database connection failed' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Failed to save profile',
    });
  });

  test('should sanitize XSS attempts', async () => {
    const xssData = {
      ...validProfileData,
      firstName: '<script>alert("xss")</script>',
      lastName: 'User<img src=x onerror=alert(1)>',
    };

    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: 'sb-access-token=valid-token',
      },
      body: xssData,
    });

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null,
    });

    mockSupabase.from().insert.mockResolvedValue({
      data: [{ id: 1, first_name: 'scriptalertxssscript', last_name: 'Userimg srcx onerroralert1' }],
      error: null,
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(mockSupabase.from().insert).toHaveBeenCalledWith(
      expect.objectContaining({
        first_name: expect.not.stringContaining('<script>'),
        last_name: expect.not.stringContaining('<img'),
      })
    );
  });
});