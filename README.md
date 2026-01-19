# fitup · Unseen Agency

A full-stack web application for a digital marketing agency with admin dashboard, CMS, and contact form management.

## Admin Credentials

- **Email**: admin@fitup.ma
- **Password**: 

## Features

### Main Website 
- ✅ 3D hero animation with rotating torus (Three.js)
- ✅ Animated logo carousel
- ✅ Interactive expanding service cards
- ✅ FITUP letter game (drag-and-drop for 20% discount)
- ✅ About section with animated SVG curve
- ✅ Social media phone sliders (Twitter/Instagram)
- ✅ FAQ accordion
- ✅ Full responsive design
- ✅ Side menu navigation

### Contact Page
- ✅ **Full navigation menu** - Same as main site with side menu
- ✅ Interactive calendar with month navigation
- ✅ Time slot selection
- ✅ Multi-field form with validation
- ✅ Database storage for submissions
- ✅ Success message display

### Admin Dashboard
- ✅ **Mobile-responsive design** - Works on all device sizes
- ✅ **Real inquiry data** - Populated from database
- ✅ KPI metrics (Total, This Week, Contacted, Converted)
- ✅ Inquiry management (view, filter, status update, delete)
- ✅ Export to CSV functionality
- ✅ Search and filter by status/source

### Content Editor (CMS)
- ✅ **Edit ALL website content** without redeploy:
  - Text and headings
  - Images and logos (via URL)
  - Social media links
  - Footer information
  - Service descriptions
  - About section stats
- ✅ **Pre-filled with existing content**
- ✅ Instant live updates
- ✅ Multi-page support (Homepage, Contact)

### User Management
- ✅ Admin and Viewer roles
- ✅ Create, edit, delete users
- ✅ Secure password hashing
- ✅ JWT-like token authentication

### Email Settings
- ✅ **One-click Gmail OAuth button** (UI ready)
- ✅ Gmail connection status display
- ✅ Notification email configuration
- ✅ Enable/disable notifications toggle

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript, Three.js, GSAP
- **Backend**: Hono (TypeScript)
- **Platform**: Cloudflare Workers/Pages
- **Database**: Cloudflare D1 (SQLite)
- **Build**: Vite
- **Process Manager**: PM2

## Project Structure

```
webapp/
├── src/
│   ├── index.tsx          # Main Hono app entry
│   ├── types.ts           # TypeScript types
│   ├── routes/
│   │   └── api.ts         # All API routes
│   ├── pages/
│   │   ├── home.ts        # Homepage template
│   │   ├── contact.ts     # Contact page template
│   │   ├── login.ts       # Admin login page
│   │   └── dashboard.ts   # Admin dashboard page
│   └── utils/
│       └── auth.ts        # Authentication utilities
├── public/
│   └── static/
│       ├── styles/
│       │   ├── main.css      # Homepage styles
│       │   ├── contact.css   # Contact page styles
│       │   └── dashboard.css # Dashboard styles (mobile responsive)
│       └── js/
│           ├── hero.js       # Three.js hero animation
│           ├── main.js       # Main site interactions
│           ├── contact.js    # Contact page with menu
│           └── dashboard.js  # Dashboard with enhanced CMS
├── migrations/
│   └── 0001_initial_schema.sql
├── seed.sql
├── ecosystem.config.cjs
├── wrangler.jsonc
├── vite.config.ts
└── package.json
```

## Database Schema

### Users
- id, email, password_hash, name, role (admin/viewer), timestamps

### Sessions
- id, user_id, token, expires_at, timestamps

### Inquiries
- id, first_name, last_name, email, phone, company, job_title
- budget, message, appointment_date, appointment_time
- source, status (new/contacted/converted/closed), is_read
- timestamps

### Content
- id, page, section, content_key, content_value, content_type
- timestamps

### Email Settings
- id, gmail_client_id, gmail_client_secret, gmail_refresh_token
- gmail_email, is_active, timestamps

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/verify` - Verify token

### Inquiries
- `GET /api/inquiries` - List all (with filters)
- `GET /api/inquiries/:id` - Get single
- `POST /api/inquiries` - Create new
- `PUT /api/inquiries/:id` - Update
- `DELETE /api/inquiries/:id` - Delete
- `POST /api/inquiries/:id/read` - Mark as read

### Content (CMS)
- `GET /api/content` - All content
- `GET /api/content/:page` - Content by page
- `PUT /api/content` - Update single
- `POST /api/content/bulk` - Update multiple

### Users
- `GET /api/users` - List all
- `POST /api/users` - Create
- `PUT /api/users/:id` - Update
- `DELETE /api/users/:id` - Delete

### Stats
- `GET /api/stats` - Dashboard KPIs

### Email
- `GET /api/email-settings` - Get settings
- `PUT /api/email-settings` - Update settings

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Start dev server
npm run dev:sandbox

# Or with PM2
pm2 start ecosystem.config.cjs

# Database operations
npm run db:migrate:local
npm run db:seed
npm run db:reset
```

## Recent Updates

1. **Contact Page Navigation** - Added full side menu matching main site
2. **Mobile Dashboard** - Improved responsiveness for all screen sizes
3. **Real Data Population** - Dashboard shows 7 sample inquiries from database
4. **Enhanced CMS Editor** - Edit ALL text, images, logos, links with pre-fill
5. **Gmail OAuth UI** - One-click connect button with status display

## Deployment Status

- **Platform**: Cloudflare Pages (ready)
- **Database**: D1 configured
- **Status**: ✅ Active (sandbox)
- **Last Updated**: 2026-01-17
