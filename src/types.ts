// Type definitions for the application

export interface Env {
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;  // Add this line

}

export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  role: 'admin' | 'viewer';
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: number;
  user_id: number;
  token: string;
  expires_at: string;
  created_at: string;
}

export interface Inquiry {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  job_title?: string;
  budget?: string;
  message?: string;
  appointment_date?: string;
  appointment_time?: string;
  source: 'website' | 'instagram' | 'twitter' | 'referral';
  status: 'new' | 'contacted' | 'converted' | 'closed';
  is_read: number;
  created_at: string;
  updated_at: string;
}

export interface Content {
  id: number;
  page: string;
  section: string;
  content_key: string;
  content_value: string;
  content_type: 'text' | 'image' | 'html';
  created_at: string;
  updated_at: string;
}

export interface EmailSettings {
  id: number;
  gmail_client_id?: string;
  gmail_client_secret?: string;
  gmail_refresh_token?: string;
  gmail_email?: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface KPIStats {
  totalInquiries: number;
  newThisWeek: number;
  contacted: number;
  converted: number;
  lastInquiryTimestamp: string | null;
  inquiriesPerDay: { date: string; count: number }[];
  inquiriesPerWeek: { week: string; count: number }[];
  inquiriesPerMonth: { month: string; count: number }[];
}
