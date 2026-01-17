# fitup - Internal Dashboard & Website

A fully-featured web application for fitup media agency, built with Hono and deployed to Cloudflare Pages.

## Project Overview

- **Name**: fitup-webapp
- **Goal**: Convert static HTML files into a fully functional web application with CMS capabilities
- **Features**: Main website, Contact form, Admin Dashboard, Content Management System

## URLs

- **Development**: https://3000-iv667010tr7hx26xrakql-c07dda5e.sandbox.novita.ai
- **Main Website**: `/`
- **Contact Page**: `/contact`
- **Admin Login**: `/admin`
- **Admin Dashboard**: `/admin/dashboard`

## Data Architecture

### Database Schema (Cloudflare D1)

- **users**: User accounts with roles (admin/viewer)
- **sessions**: JWT session tokens
- **inquiries**: Contact form submissions
- **content**: CMS editable content
- **email_settings**: Gmail OAuth configuration

### Storage Services
- **Cloudflare D1**: SQLite-based database for all data

## Features

### Main Website
- Pixel-perfect reproduction of the original design
- Three.js 3D hero animation
- Interactive service cards
- FITUP letter game (20% discount game)
- Social media sliders
- FAQ accordion
- Responsive design

### Contact Page
- Calendar-based appointment booking
- Time slot selection
- Form validation
- Data stored in D1 database
- Success confirmation

### Admin Dashboard
- **Inquiry Management**: View, filter, search, update status, delete
- **KPI Metrics**: Total inquiries, weekly stats, conversion tracking
- **Content Editor (CMS)**: Edit website text without redeploying
- **User Management**: Create, edit, delete users with roles
- **Email Settings**: Gmail OAuth configuration for notifications

## User Guide

### Admin Login
1. Navigate to `/admin`
2. Login with credentials:
   - Email: `admin@fitup.ma`
   - Password: `admin123`

### Managing Inquiries
1. Dashboard shows all contact form submissions
2. Filter by status (new, contacted, converted, closed)
3. Filter by source (website, instagram, twitter, referral)
4. Search by name, email, or message
5. Click eye icon to view details
6. Update status from the detail modal
7. Delete inquiries with the trash icon

### Content Editor (CMS)
1. Navigate to "Content Editor" in sidebar
2. Select a page (Homepage, Contact)
3. Edit text fields directly
4. Click "Save All Changes" to update

### User Management (Admin only)
1. Navigate to "Users" in sidebar
2. Click "Add User" to create new users
3. Assign role (Admin or Viewer)
4. Delete users with the trash icon

### Email Notifications
1. Navigate to "Email Settings" in sidebar
2. Enter Gmail OAuth credentials
3. Enable notifications checkbox
4. Save settings

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/verify` - Verify token

### Users
- `GET /api/users` - List all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Inquiries
- `GET /api/inquiries` - List inquiries (with filters)
- `GET /api/inquiries/:id` - Get single inquiry
- `POST /api/inquiries` - Create inquiry
- `PUT /api/inquiries/:id` - Update inquiry
- `DELETE /api/inquiries/:id` - Delete inquiry

### Stats
- `GET /api/stats` - Get KPI metrics

### Content (CMS)
- `GET /api/content` - List all content
- `GET /api/content/:page` - Get page content
- `PUT /api/content` - Update content
- `POST /api/content/bulk` - Bulk update content

### Email Settings
- `GET /api/email-settings` - Get settings
- `PUT /api/email-settings` - Update settings

## Deployment

### Local Development
```bash
# Install dependencies
npm install

# Run database migrations
npm run db:migrate:local

# Seed sample data
npm run db:seed

# Build and start dev server
npm run build
pm2 start ecosystem.config.cjs
```

### Production Deployment (Cloudflare Pages)
```bash
# Build
npm run build

# Deploy
npm run deploy:prod
```

## Tech Stack

- **Framework**: Hono
- **Runtime**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **Frontend**: Vanilla JS, CSS, Three.js, GSAP
- **Build**: Vite

## Environment Variables

For production, set these as Cloudflare secrets:
- No external API keys required for base functionality
- Gmail OAuth tokens for email notifications (optional)

## Project Structure

```
webapp/
├── src/
│   ├── index.tsx         # Main app entry
│   ├── types.ts          # TypeScript types
│   ├── pages/            # HTML page templates
│   ├── routes/           # API routes
│   └── utils/            # Utilities (auth)
├── public/
│   └── static/
│       ├── styles/       # CSS files
│       └── js/           # JavaScript files
├── migrations/           # D1 database migrations
├── seed.sql              # Sample data
├── wrangler.jsonc        # Cloudflare config
└── package.json
```

## Last Updated
2026-01-17
