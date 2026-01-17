// Blog Page
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image: string;
  published: boolean;
  created_at: string;
}

export function blogListPage(posts: BlogPost[], content: Record<string, Record<string, string>> = {}): string {
  const getContent = (section: string, key: string, fallback: string): string => {
    return content[section]?.[key] || fallback;
  };
  
  const postsHTML = posts.length > 0 ? posts.map(post => `
    <article class="blog-card">
      ${post.image ? `<div class="blog-card-image"><img src="${post.image}" alt="${post.title}"></div>` : ''}
      <div class="blog-card-content">
        <h2 class="blog-card-title">
          <a href="/blog/${post.slug}">${post.title}</a>
        </h2>
        <p class="blog-card-excerpt">${post.excerpt || ''}</p>
        <div class="blog-card-meta">
          <span class="blog-card-date">${new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <a href="/blog/${post.slug}" class="blog-card-link">Read more →</a>
      </div>
    </article>
  `).join('') : '<p class="blog-empty">No blog posts yet. Check back soon!</p>';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Blog · fitup</title>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/static/styles/main.css">
  <style>
    .blog-page {
      min-height: 100vh;
      background: #000;
      padding: 120px 20px 80px;
    }
    .blog-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .blog-header {
      text-align: center;
      margin-bottom: 60px;
    }
    .blog-header h1 {
      font-size: 48px;
      font-weight: 600;
      color: #fff;
      margin-bottom: 16px;
    }
    .blog-header p {
      font-size: 18px;
      color: rgba(255,255,255,0.6);
    }
    .blog-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 32px;
    }
    .blog-card {
      background: #111;
      border-radius: 16px;
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .blog-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    }
    .blog-card-image {
      width: 100%;
      height: 200px;
      overflow: hidden;
    }
    .blog-card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    .blog-card:hover .blog-card-image img {
      transform: scale(1.05);
    }
    .blog-card-content {
      padding: 24px;
    }
    .blog-card-title {
      font-size: 22px;
      font-weight: 600;
      margin-bottom: 12px;
    }
    .blog-card-title a {
      color: #fff;
      text-decoration: none;
      transition: color 0.2s ease;
    }
    .blog-card-title a:hover {
      color: #B8FF5C;
    }
    .blog-card-excerpt {
      font-size: 15px;
      color: rgba(255,255,255,0.6);
      line-height: 1.6;
      margin-bottom: 16px;
    }
    .blog-card-meta {
      font-size: 13px;
      color: rgba(255,255,255,0.4);
      margin-bottom: 16px;
    }
    .blog-card-link {
      display: inline-block;
      color: #B8FF5C;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: transform 0.2s ease;
    }
    .blog-card-link:hover {
      transform: translateX(4px);
    }
    .blog-empty {
      text-align: center;
      color: rgba(255,255,255,0.5);
      font-size: 18px;
      padding: 60px 20px;
    }
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: rgba(255,255,255,0.6);
      text-decoration: none;
      font-size: 14px;
      margin-bottom: 30px;
      transition: color 0.2s ease;
    }
    .back-link:hover {
      color: #B8FF5C;
    }
    @media (max-width: 768px) {
      .blog-header h1 {
        font-size: 32px;
      }
      .blog-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <!-- Top Navigation -->
  <nav class="top-nav" id="topNav">
    <div class="nav-left">
      <a href="/" class="nav-logo">
        <img src="https://i.ibb.co/VWs7tk3q/605997942-17850007239614033-1994629091166485047-n.jpg" alt="fitup" class="nav-logo-img">
        <span>© fitup</span>
      </a>
    </div>
    
    <div class="nav-center-left">
      <a href="/contact" class="nav-menu-item">Contact Us</a>
    </div>
    
    <div class="nav-center">
      <div class="nav-stripe-cluster">
        ${Array(30).fill('<div class="stripe"></div>').join('')}
      </div>
    </div>
    
    <div class="nav-center-right"></div>
    
    <div class="nav-right">
      <a href="/" class="nav-menu-item">Home</a>
    </div>
  </nav>

  <main class="blog-page">
    <div class="blog-container">
      <a href="/" class="back-link">← Back to Home</a>
      
      <div class="blog-header">
        <h1>Blog</h1>
        <p>Insights, tips, and stories from the fitup team</p>
      </div>
      
      <div class="blog-grid">
        ${postsHTML}
      </div>
    </div>
  </main>

  <script>
    // Add scrolled class to nav on scroll
    window.addEventListener('scroll', () => {
      const nav = document.getElementById('topNav');
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  </script>
</body>
</html>`;
}

export function blogPostPage(post: BlogPost, content: Record<string, Record<string, string>> = {}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${post.title} · fitup Blog</title>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/static/styles/main.css">
  <style>
    .blog-post-page {
      min-height: 100vh;
      background: #000;
      padding: 120px 20px 80px;
    }
    .blog-post-container {
      max-width: 800px;
      margin: 0 auto;
    }
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: rgba(255,255,255,0.6);
      text-decoration: none;
      font-size: 14px;
      margin-bottom: 30px;
      transition: color 0.2s ease;
    }
    .back-link:hover {
      color: #B8FF5C;
    }
    .blog-post-header {
      margin-bottom: 40px;
    }
    .blog-post-title {
      font-size: 42px;
      font-weight: 600;
      color: #fff;
      line-height: 1.2;
      margin-bottom: 16px;
    }
    .blog-post-meta {
      font-size: 14px;
      color: rgba(255,255,255,0.5);
    }
    .blog-post-image {
      width: 100%;
      border-radius: 16px;
      margin-bottom: 40px;
      overflow: hidden;
    }
    .blog-post-image img {
      width: 100%;
      height: auto;
      display: block;
    }
    .blog-post-content {
      color: rgba(255,255,255,0.85);
      font-size: 17px;
      line-height: 1.8;
    }
    .blog-post-content p {
      margin-bottom: 24px;
    }
    .blog-post-content h2 {
      font-size: 28px;
      font-weight: 600;
      color: #fff;
      margin: 40px 0 20px;
    }
    .blog-post-content h3 {
      font-size: 22px;
      font-weight: 600;
      color: #fff;
      margin: 32px 0 16px;
    }
    .blog-post-content ul, .blog-post-content ol {
      margin: 20px 0;
      padding-left: 24px;
    }
    .blog-post-content li {
      margin-bottom: 12px;
    }
    .blog-post-content a {
      color: #B8FF5C;
      text-decoration: none;
    }
    .blog-post-content a:hover {
      text-decoration: underline;
    }
    @media (max-width: 768px) {
      .blog-post-title {
        font-size: 28px;
      }
      .blog-post-content {
        font-size: 16px;
      }
    }
  </style>
</head>
<body>
  <!-- Top Navigation -->
  <nav class="top-nav" id="topNav">
    <div class="nav-left">
      <a href="/" class="nav-logo">
        <img src="https://i.ibb.co/VWs7tk3q/605997942-17850007239614033-1994629091166485047-n.jpg" alt="fitup" class="nav-logo-img">
        <span>© fitup</span>
      </a>
    </div>
    
    <div class="nav-center-left">
      <a href="/contact" class="nav-menu-item">Contact Us</a>
    </div>
    
    <div class="nav-center">
      <div class="nav-stripe-cluster">
        ${Array(30).fill('<div class="stripe"></div>').join('')}
      </div>
    </div>
    
    <div class="nav-center-right"></div>
    
    <div class="nav-right">
      <a href="/" class="nav-menu-item">Home</a>
    </div>
  </nav>

  <main class="blog-post-page">
    <div class="blog-post-container">
      <a href="/blog" class="back-link">← Back to Blog</a>
      
      <article>
        <header class="blog-post-header">
          <h1 class="blog-post-title">${post.title}</h1>
          <div class="blog-post-meta">
            ${new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>
        
        ${post.image ? `<div class="blog-post-image"><img src="${post.image}" alt="${post.title}"></div>` : ''}
        
        <div class="blog-post-content">
          ${post.content ? post.content.split('\n').map(p => p.trim() ? `<p>${p}</p>` : '').join('') : ''}
        </div>
      </article>
    </div>
  </main>

  <script>
    // Add scrolled class to nav on scroll
    window.addEventListener('scroll', () => {
      const nav = document.getElementById('topNav');
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  </script>
</body>
</html>`;
}
