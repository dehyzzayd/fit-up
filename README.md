# fitup - Unseen Media Agency Website

## Project Overview
- **Name**: fitup-webapp
- **Goal**: Full-stack web application for a marketing agency with CMS and admin dashboard
- **Features**: 
  - Pixel-perfect responsive main website with animations
  - Contact form with calendar scheduling
  - Admin dashboard with inquiry tracking
  - User management (Admin/Viewer roles)
  - Content Management System (CMS) for real-time website updates
  - Gmail OAuth email notification integration
  - KPI metrics and analytics

## URLs
- **Development**: https://3000-iv667010tr7hx26xrakql-c07dda5e.sandbox.novita.ai
- **Homepage**: `/`
- **Contact Page**: `/contact`
- **Admin Login**: `/admin`
- **Admin Dashboard**: `/admin/dashboard`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout and invalidate token
- `GET /api/auth/verify` - Verify session token

### Users (Admin only)
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Inquiries
- `GET /api/inquiries` - List all inquiries (with filters)
- `GET /api/inquiries/:id` - Get single inquiry
- `POST /api/inquiries` - Create inquiry (contact form)
- `PUT /api/inquiries/:id` - Update inquiry status
- `DELETE /api/inquiries/:id` - Delete inquiry
- `POST /api/inquiries/:id/read` - Mark as read

### Stats/KPI
- `GET /api/stats` - Get dashboard statistics

### Content (CMS)
- `GET /api/content` - List all content
- `GET /api/content/:page` - Get content for a page
- `PUT /api/content` - Update/create content item
- `POST /api/content/bulk` - Bulk update content

### Email Settings
- `GET /api/email-settings` - Get email configuration
- `PUT /api/email-settings` - Update email settings

## Data Architecture

### Data Models
- **Users**: id, email, password_hash, name, role (admin/viewer)
- **Sessions**: id, user_id, token, expires_at
- **Inquiries**: id, first_name, last_name, email, phone, company, job_title, budget, message, appointment_date, appointment_time, source, status, is_read
- **Content**: id, page, section, content_key, content_value, content_type
- **EmailSettings**: id, gmail_client_id, gmail_client_secret, gmail_refresh_token, gmail_email, is_active

### Storage Services
- **Cloudflare D1**: SQLite-based database for all data persistence

## User Guide

### Admin Login
1. Navigate to `/admin`
2. Login with default credentials:
   - **Email**: admin@fitup.ma
   - **Password**: admin123
3. You'll be redirected to the dashboard

### Dashboard Features
- **Inquiries**: View, filter, search, and manage contact form submissions
- **Content Editor**: Update website text without redeploying
- **Users**: Create/edit/delete admin and viewer accounts
- **Email Settings**: Configure Gmail OAuth for notifications

### Contact Form
1. Navigate to `/contact`
2. Select a date from the calendar
3. Choose a time slot
4. Fill in the form fields
5. Submit to create an inquiry

## Tech Stack
- **Framework**: Hono (lightweight edge runtime)
- **Frontend**: Vanilla JS with Tailwind CSS (CDN)
- **Backend**: Hono API routes
- **Database**: Cloudflare D1 (SQLite)
- **Animations**: GSAP + Three.js
- **Build**: Vite
- **Deploy**: Cloudflare Pages

## Development Setup

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
cd /home/user/webapp
npm install
```

### Database Setup
```bash
# Apply migrations
npm run db:migrate:local

# Seed with initial data
npm run db:seed

# Reset database (delete + migrate + seed)
npm run db:reset
```

### Development
```bash
# Build first
npm run build

# Start development server with PM2
pm2 start ecosystem.config.cjs

# Or start directly
npm run dev:sandbox
```

### Environment Variables
Create `.dev.vars` for local development:
```
# No secrets required for local development
# D1 database is handled automatically with --local flag
```

## Deployment

### Cloudflare Pages
```bash
# Login to Cloudflare
wrangler login

# Create D1 database
wrangler d1 create FITUP_DB

# Update wrangler.jsonc with database ID

# Apply migrations to production
npm run db:migrate:prod

# Deploy
npm run deploy:prod
```

## Project Structure
```
webapp/
├── src/
│   ├── index.tsx          # Main Hono app
│   ├── types.ts           # TypeScript types
│   ├── pages/             # HTML page generators
│   │   ├── home.ts        # Main website
│   │   ├── contact.ts     # Contact page
│   │   ├── dashboard.ts   # Admin dashboard
│   │   └── login.ts       # Login page
│   ├── routes/
│   │   └── api.ts         # All API routes
│   └── utils/
│       └── auth.ts        # Auth utilities
├── public/
│   └── static/
│       ├── js/            # Frontend JavaScript
│       └── styles/        # CSS files
├── migrations/            # D1 database migrations
├── seed.sql               # Initial data
├── wrangler.jsonc         # Cloudflare config
├── ecosystem.config.cjs   # PM2 config
└── package.json
```

## Security Notes
- Change default admin password immediately in production
- Use environment variables for OAuth credentials
- Sessions expire after 24 hours
- Passwords are hashed with SHA-256 + salt

## Status
- **Platform**: Cloudflare Pages
- **Status**: ✅ Active (Development)
- **Last Updated**: 2026-01-17
