import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-pages';
import api from './routes/api';
import { homePage } from './pages/home';
import { contactPage } from './pages/contact';
import { dashboardPage } from './pages/dashboard';
import { loginPage } from './pages/login';
import { blogListPage, blogPostPage, BlogPost } from './pages/blog';
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
    // Fetch contact page content AND menu items from home page
    const { results } = await c.env.DB.prepare(
      "SELECT * FROM content WHERE page = 'contact' OR (page = 'home' AND section = 'menu')"
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

// Blog routes
app.get('/blog', async (c) => {
  let posts: BlogPost[] = [];
  try {
    const { results } = await c.env.DB.prepare(
      "SELECT * FROM blog_posts WHERE published = 1 ORDER BY created_at DESC"
    ).all<any>();
    posts = results || [];
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
  }
  
  return c.html(blogListPage(posts));
});

app.get('/blog/:slug', async (c) => {
  const slug = c.req.param('slug');
  try {
    const post = await c.env.DB.prepare(
      "SELECT * FROM blog_posts WHERE slug = ? AND published = 1"
    ).bind(slug).first<BlogPost>();
    
    if (!post) {
      return c.text('Post not found', 404);
    }
    
    return c.html(blogPostPage(post));
  } catch (error) {
    console.error('Failed to fetch blog post:', error);
    return c.text('Error loading post', 500);
  }
});

export default app;
