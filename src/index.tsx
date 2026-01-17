import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-pages';
import api from './routes/api';
import { homePage } from './pages/home';
import { contactPage } from './pages/contact';
import { dashboardPage } from './pages/dashboard';
import { loginPage } from './pages/login';
import type { Env } from './types';

const app = new Hono<{ Bindings: Env }>();

// Serve static files
app.use('/static/*', serveStatic());

// API routes
app.route('/api', api);

// Frontend pages
app.get('/', async (c) => {
  // Fetch editable content from database
  let content: Record<string, Record<string, string>> = {};
  try {
    const { results } = await c.env.DB.prepare(
      "SELECT * FROM content WHERE page = 'home'"
    ).all<any>();
    
    for (const item of results || []) {
      if (!content[item.section]) {
        content[item.section] = {};
      }
      content[item.section][item.content_key] = item.content_value;
    }
  } catch (error) {
    console.error('Failed to fetch content:', error);
  }
  
  return c.html(homePage(content));
});

app.get('/contact', async (c) => {
  let content: Record<string, Record<string, string>> = {};
  try {
    const { results } = await c.env.DB.prepare(
      "SELECT * FROM content WHERE page = 'contact'"
    ).all<any>();
    
    for (const item of results || []) {
      if (!content[item.section]) {
        content[item.section] = {};
      }
      content[item.section][item.content_key] = item.content_value;
    }
  } catch (error) {
    console.error('Failed to fetch content:', error);
  }
  
  return c.html(contactPage(content));
});

app.get('/admin', (c) => {
  return c.html(loginPage());
});

app.get('/admin/dashboard', (c) => {
  return c.html(dashboardPage());
});

export default app;
