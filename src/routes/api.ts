import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { hashPassword, verifyPassword, generateToken, getTokenExpiry, isTokenExpired } from '../utils/auth';
import type { Env, User, Inquiry, Content, KPIStats } from '../types';

const api = new Hono<{ Bindings: Env }>();

// Enable CORS
api.use('/*', cors());

// ==================== AUTH ROUTES ====================

// Login
api.post('/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const user = await c.env.DB.prepare(
      'SELECT * FROM users WHERE email = ?'
    ).bind(email).first<User>();

    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // Create session token
    const token = generateToken();
    const expiresAt = getTokenExpiry();

    await c.env.DB.prepare(
      'INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)'
    ).bind(user.id, token, expiresAt).run();

    return c.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Login failed' }, 500);
  }
});

// Logout
api.post('/auth/logout', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ success: true });
    }

    const token = authHeader.substring(7);
    await c.env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
    
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Logout failed' }, 500);
  }
});

// Verify token
api.get('/auth/verify', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'No token provided' }, 401);
    }

    const token = authHeader.substring(7);
    const session = await c.env.DB.prepare(
      'SELECT s.*, u.email, u.name, u.role FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.token = ?'
    ).bind(token).first<any>();

    if (!session || isTokenExpired(session.expires_at)) {
      return c.json({ error: 'Invalid or expired token' }, 401);
    }

    return c.json({
      user: {
        id: session.user_id,
        email: session.email,
        name: session.name,
        role: session.role
      }
    });
  } catch (error) {
    return c.json({ error: 'Verification failed' }, 500);
  }
});

// ==================== USER MANAGEMENT ROUTES ====================

// Get all users (admin only)
api.get('/users', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC'
    ).all<User>();
    
    return c.json(results);
  } catch (error) {
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

// Create user (admin only)
api.post('/users', async (c) => {
  try {
    const { email, password, name, role } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    const passwordHash = await hashPassword(password);
    const userRole = role === 'admin' ? 'admin' : 'viewer';

    const result = await c.env.DB.prepare(
      'INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)'
    ).bind(email, passwordHash, name, userRole).run();

    return c.json({ id: result.meta.last_row_id, email, name, role: userRole }, 201);
  } catch (error: any) {
    if (error.message?.includes('UNIQUE constraint failed')) {
      return c.json({ error: 'Email already exists' }, 400);
    }
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// Update user
api.put('/users/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const { email, password, name, role } = await c.req.json();

    let query = 'UPDATE users SET ';
    const params: any[] = [];
    const updates: string[] = [];

    if (email) {
      updates.push('email = ?');
      params.push(email);
    }
    if (password) {
      updates.push('password_hash = ?');
      params.push(await hashPassword(password));
    }
    if (name) {
      updates.push('name = ?');
      params.push(name);
    }
    if (role) {
      updates.push('role = ?');
      params.push(role);
    }

    if (updates.length === 0) {
      return c.json({ error: 'No fields to update' }, 400);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    query += updates.join(', ') + ' WHERE id = ?';
    params.push(id);

    await c.env.DB.prepare(query).bind(...params).run();
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to update user' }, 500);
  }
});

// Delete user
api.delete('/users/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await c.env.DB.prepare('DELETE FROM users WHERE id = ?').bind(id).run();
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to delete user' }, 500);
  }
});

// ==================== INQUIRY ROUTES ====================

// Get all inquiries
api.get('/inquiries', async (c) => {
  try {
    const status = c.req.query('status');
    const source = c.req.query('source');
    const search = c.req.query('search');

    let query = 'SELECT * FROM inquiries WHERE 1=1';
    const params: any[] = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (source) {
      query += ' AND source = ?';
      params.push(source);
    }
    if (search) {
      query += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR message LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    query += ' ORDER BY created_at DESC';

    const { results } = await c.env.DB.prepare(query).bind(...params).all<Inquiry>();
    return c.json(results);
  } catch (error) {
    return c.json({ error: 'Failed to fetch inquiries' }, 500);
  }
});

// Get single inquiry
api.get('/inquiries/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const inquiry = await c.env.DB.prepare(
      'SELECT * FROM inquiries WHERE id = ?'
    ).bind(id).first<Inquiry>();

    if (!inquiry) {
      return c.json({ error: 'Inquiry not found' }, 404);
    }

    return c.json(inquiry);
  } catch (error) {
    return c.json({ error: 'Failed to fetch inquiry' }, 500);
  }
});

// Create inquiry (from contact form)
api.post('/inquiries', async (c) => {
  try {
    const data = await c.req.json();
    const {
      first_name, last_name, email, phone, company, job_title,
      budget, message, appointment_date, appointment_time, source
    } = data;

    if (!first_name || !last_name || !email) {
      return c.json({ error: 'First name, last name, and email are required' }, 400);
    }

    const result = await c.env.DB.prepare(`
      INSERT INTO inquiries (first_name, last_name, email, phone, company, job_title, budget, message, appointment_date, appointment_time, source)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      first_name, last_name, email, phone || null, company || null,
      job_title || null, budget || null, message || null,
      appointment_date || null, appointment_time || null, source || 'website'
    ).run();

    // TODO: Send email notification here if Gmail is configured

    return c.json({ id: result.meta.last_row_id, success: true }, 201);
  } catch (error) {
    console.error('Create inquiry error:', error);
    return c.json({ error: 'Failed to create inquiry' }, 500);
  }
});

// Update inquiry
api.put('/inquiries/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const { status, is_read } = await c.req.json();

    let query = 'UPDATE inquiries SET updated_at = CURRENT_TIMESTAMP';
    const params: any[] = [];

    if (status !== undefined) {
      query += ', status = ?';
      params.push(status);
    }
    if (is_read !== undefined) {
      query += ', is_read = ?';
      params.push(is_read ? 1 : 0);
    }

    query += ' WHERE id = ?';
    params.push(id);

    await c.env.DB.prepare(query).bind(...params).run();
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to update inquiry' }, 500);
  }
});

// Delete inquiry
api.delete('/inquiries/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await c.env.DB.prepare('DELETE FROM inquiries WHERE id = ?').bind(id).run();
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to delete inquiry' }, 500);
  }
});

// Mark inquiry as read
api.post('/inquiries/:id/read', async (c) => {
  try {
    const id = c.req.param('id');
    await c.env.DB.prepare(
      'UPDATE inquiries SET is_read = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(id).run();
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to mark as read' }, 500);
  }
});

// ==================== KPI/STATS ROUTES ====================

api.get('/stats', async (c) => {
  try {
    // Total inquiries
    const totalResult = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM inquiries'
    ).first<{ count: number }>();

    // New this week
    const weekResult = await c.env.DB.prepare(`
      SELECT COUNT(*) as count FROM inquiries 
      WHERE created_at >= datetime('now', '-7 days')
    `).first<{ count: number }>();

    // Contacted count
    const contactedResult = await c.env.DB.prepare(
      "SELECT COUNT(*) as count FROM inquiries WHERE status = 'contacted'"
    ).first<{ count: number }>();

    // Converted count
    const convertedResult = await c.env.DB.prepare(
      "SELECT COUNT(*) as count FROM inquiries WHERE status = 'converted'"
    ).first<{ count: number }>();

    // Last inquiry timestamp
    const lastInquiry = await c.env.DB.prepare(
      'SELECT created_at FROM inquiries ORDER BY created_at DESC LIMIT 1'
    ).first<{ created_at: string }>();

    // Inquiries per day (last 7 days)
    const { results: perDay } = await c.env.DB.prepare(`
      SELECT DATE(created_at) as date, COUNT(*) as count 
      FROM inquiries 
      WHERE created_at >= datetime('now', '-7 days')
      GROUP BY DATE(created_at)
      ORDER BY date
    `).all<{ date: string; count: number }>();

    // Inquiries per week (last 4 weeks)
    const { results: perWeek } = await c.env.DB.prepare(`
      SELECT strftime('%Y-W%W', created_at) as week, COUNT(*) as count 
      FROM inquiries 
      WHERE created_at >= datetime('now', '-28 days')
      GROUP BY strftime('%Y-W%W', created_at)
      ORDER BY week
    `).all<{ week: string; count: number }>();

    // Inquiries per month (last 6 months)
    const { results: perMonth } = await c.env.DB.prepare(`
      SELECT strftime('%Y-%m', created_at) as month, COUNT(*) as count 
      FROM inquiries 
      WHERE created_at >= datetime('now', '-6 months')
      GROUP BY strftime('%Y-%m', created_at)
      ORDER BY month
    `).all<{ month: string; count: number }>();

    const stats: KPIStats = {
      totalInquiries: totalResult?.count || 0,
      newThisWeek: weekResult?.count || 0,
      contacted: contactedResult?.count || 0,
      converted: convertedResult?.count || 0,
      lastInquiryTimestamp: lastInquiry?.created_at || null,
      inquiriesPerDay: perDay || [],
      inquiriesPerWeek: perWeek || [],
      inquiriesPerMonth: perMonth || []
    };

    return c.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    return c.json({ error: 'Failed to fetch stats' }, 500);
  }
});

// ==================== CONTENT (CMS) ROUTES ====================

// Get all content for a page
api.get('/content', async (c) => {
  try {
    const page = c.req.query('page');
    
    let query = 'SELECT * FROM content';
    const params: any[] = [];

    if (page) {
      query += ' WHERE page = ?';
      params.push(page);
    }

    query += ' ORDER BY page, section, content_key';

    const { results } = await c.env.DB.prepare(query).bind(...params).all<Content>();
    return c.json(results);
  } catch (error) {
    return c.json({ error: 'Failed to fetch content' }, 500);
  }
});

// Get content as a structured object for a page
api.get('/content/:page', async (c) => {
  try {
    const page = c.req.param('page');
    
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM content WHERE page = ?'
    ).bind(page).all<Content>();

    // Structure the content as nested object
    const structured: Record<string, Record<string, string>> = {};
    for (const item of results || []) {
      if (!structured[item.section]) {
        structured[item.section] = {};
      }
      structured[item.section][item.content_key] = item.content_value;
    }

    return c.json(structured);
  } catch (error) {
    return c.json({ error: 'Failed to fetch content' }, 500);
  }
});

// Update or create content
api.put('/content', async (c) => {
  try {
    const { page, section, content_key, content_value, content_type } = await c.req.json();

    if (!page || !section || !content_key || content_value === undefined) {
      return c.json({ error: 'Page, section, content_key, and content_value are required' }, 400);
    }

    await c.env.DB.prepare(`
      INSERT INTO content (page, section, content_key, content_value, content_type)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(page, section, content_key) 
      DO UPDATE SET content_value = ?, content_type = ?, updated_at = CURRENT_TIMESTAMP
    `).bind(
      page, section, content_key, content_value, content_type || 'text',
      content_value, content_type || 'text'
    ).run();

    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to update content' }, 500);
  }
});

// Bulk update content
api.post('/content/bulk', async (c) => {
  try {
    const items = await c.req.json();

    if (!Array.isArray(items)) {
      return c.json({ error: 'Expected an array of content items' }, 400);
    }

    for (const item of items) {
      const { page, section, content_key, content_value, content_type } = item;
      
      if (!page || !section || !content_key || content_value === undefined) {
        continue;
      }

      await c.env.DB.prepare(`
        INSERT INTO content (page, section, content_key, content_value, content_type)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(page, section, content_key) 
        DO UPDATE SET content_value = ?, content_type = ?, updated_at = CURRENT_TIMESTAMP
      `).bind(
        page, section, content_key, content_value, content_type || 'text',
        content_value, content_type || 'text'
      ).run();
    }

    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to update content' }, 500);
  }
});

// Delete content
api.delete('/content/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await c.env.DB.prepare('DELETE FROM content WHERE id = ?').bind(id).run();
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to delete content' }, 500);
  }
});

// ==================== EMAIL SETTINGS ROUTES ====================

// Get email settings
api.get('/email-settings', async (c) => {
  try {
    const settings = await c.env.DB.prepare(
      'SELECT id, gmail_email, is_active, created_at FROM email_settings ORDER BY id DESC LIMIT 1'
    ).first();

    return c.json(settings || { is_active: false });
  } catch (error) {
    return c.json({ error: 'Failed to fetch email settings' }, 500);
  }
});

// ==================== BLOG ROUTES ====================

// Get all blog posts
api.get('/blog', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM blog_posts ORDER BY created_at DESC'
    ).all();
    return c.json({ posts: results || [] });
  } catch (error) {
    return c.json({ posts: [] });
  }
});

// Get single blog post
api.get('/blog/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const post = await c.env.DB.prepare(
      'SELECT * FROM blog_posts WHERE id = ?'
    ).bind(id).first();
    
    if (!post) {
      return c.json({ error: 'Post not found' }, 404);
    }
    return c.json(post);
  } catch (error) {
    return c.json({ error: 'Failed to fetch post' }, 500);
  }
});

// Create blog post
api.post('/blog', async (c) => {
  try {
    const { title, content, excerpt, image, published } = await c.req.json();
    
    // Generate slug from title
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const result = await c.env.DB.prepare(`
      INSERT INTO blog_posts (title, slug, content, excerpt, image, published)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(title, slug, content, excerpt, image, published ? 1 : 0).run();
    
    return c.json({ success: true, id: result.meta.last_row_id });
  } catch (error) {
    return c.json({ error: 'Failed to create post' }, 500);
  }
});

// Update blog post
api.put('/blog/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const { title, content, excerpt, image, published } = await c.req.json();
    
    // Generate slug from title
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    await c.env.DB.prepare(`
      UPDATE blog_posts SET 
        title = ?, slug = ?, content = ?, excerpt = ?, image = ?, 
        published = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(title, slug, content, excerpt, image, published ? 1 : 0, id).run();
    
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to update post' }, 500);
  }
});

// Delete blog post
api.delete('/blog/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await c.env.DB.prepare('DELETE FROM blog_posts WHERE id = ?').bind(id).run();
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to delete post' }, 500);
  }
});

export default api;
