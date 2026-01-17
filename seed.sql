-- Seed initial admin user (password: admin123)
-- In production, change this password immediately!
INSERT OR IGNORE INTO users (email, password_hash, name, role)
VALUES ('admin@fitup.ma', 'a681bd13b6b352b5ec8030dba14c40b5bfc7995eae2f533129455f853c9ace75', 'Admin', 'admin');

-- Seed some sample inquiries for testing
INSERT OR IGNORE INTO inquiries (first_name, last_name, email, phone, company, job_title, budget, message, source, status, created_at)
VALUES 
  ('Ahmed', 'Benjelloun', 'ahmed.b@example.com', '+212 6 12 34 56 78', 'Restaurant Chain', 'Owner', '50000+', 'Hi, I''m interested in your social media management services for my restaurant chain. We have 5 locations across Casablanca and need a comprehensive digital strategy.', 'website', 'new', datetime('now', '-1 day')),
  ('Fatima', 'Zahrae', 'fatima.z@startup.ma', '+212 6 98 76 54 32', 'E-commerce Brand', 'CEO', '25000-50000', 'We''re launching a new e-commerce brand and need help with branding, media buying, and content creation. Budget is around 50,000 MAD/month.', 'instagram', 'contacted', datetime('now', '-2 days')),
  ('Omar', 'Tazi', 'omar@tazi-group.com', '+212 6 55 44 33 22', 'Tazi Group', 'Marketing Director', '25000-50000', 'Looking for video production services for our corporate event next month. Need highlight reels and promotional content.', 'referral', 'converted', datetime('now', '-3 days')),
  ('Sarah', 'Miller', 'sarah.m@techco.com', '+1 555 123 4567', 'TechCo International', 'VP Marketing', '50000+', 'International company expanding to Morocco. Need local marketing expertise and data analytics setup.', 'website', 'contacted', datetime('now', '-4 days')),
  ('Youssef', 'El Amrani', 'youssef@elamrani.ma', '+212 6 11 22 33 44', 'El Amrani Family Business', 'Director', '10000-25000', 'Need a complete rebrand for our family business. Looking for logo design, brand guidelines, and website redesign.', 'twitter', 'new', datetime('now', '-5 days')),
  ('Nadia', 'Benali', 'nadia.benali@fashion.ma', '+212 6 77 88 99 00', 'Fashion Brand', 'Founder', '25000-50000', 'Fashion brand looking for influencer marketing campaign management and Instagram growth strategy.', 'instagram', 'closed', datetime('now', '-6 days')),
  ('Karim', 'Alaoui', 'k.alaoui@realestate.ma', '+212 6 22 33 44 55', 'Real Estate Agency', 'Manager', '10000-25000', 'Real estate agency needing Facebook and Google ads management. Monthly budget 30,000 MAD.', 'website', 'new', datetime('now', '-7 days'));

-- Seed initial editable content
INSERT OR IGNORE INTO content (page, section, content_key, content_value, content_type)
VALUES 
  -- Homepage content
  ('home', 'hero', 'tagline', 'Where Brands Win.', 'text'),
  ('home', 'logo_scroll', 'title', 'Brands We''ve Worked With', 'text'),
  ('home', 'services', 'title', 'Our Services', 'text'),
  ('home', 'about', 'heading_line1', 'About', 'text'),
  ('home', 'about', 'heading_line2', 'Us', 'text'),
  ('home', 'about', 'paragraph1', 'At fitup, we believe that every brand has a unique story waiting to be told. We''re not just a marketing agency—we''re your strategic partners in growth, dedicated to transforming your vision into measurable success.', 'text'),
  ('home', 'about', 'paragraph2', 'Our team combines creative excellence with data-driven insights to craft campaigns that resonate with your audience and drive real results. From strategic consulting to full-scale media production, we handle every aspect of your brand''s digital presence.', 'text'),
  ('home', 'about', 'paragraph3', 'Based in Casablanca, Morocco, we''ve helped businesses across industries elevate their brand, connect with their audience, and achieve sustainable growth. Whether you''re a startup looking to make your mark or an established brand seeking fresh perspectives, we''re here to help you win.', 'text'),
  ('home', 'about', 'stat1_number', '50+', 'text'),
  ('home', 'about', 'stat1_label', 'Projects Delivered', 'text'),
  ('home', 'about', 'stat2_number', '98%', 'text'),
  ('home', 'about', 'stat2_label', 'Client Satisfaction', 'text'),
  ('home', 'about', 'stat3_number', '5+', 'text'),
  ('home', 'about', 'stat3_label', 'Years Experience', 'text'),
  ('home', 'footer', 'description', 'Where brands win. We help businesses grow through strategic marketing, creative content, and data-driven decisions.', 'text'),
  ('home', 'footer', 'email', 'hello@fitup.ma', 'text'),
  ('home', 'footer', 'phone', '+212 6 00 00 00 00', 'text'),
  ('home', 'footer', 'location', 'Casablanca, Morocco', 'text'),
  
  -- Contact page content
  ('contact', 'hero', 'title', 'Prenez rendez-vous', 'text'),
  ('contact', 'hero', 'subtitle', 'Choisissez un créneau qui vous convient', 'text'),
  
  -- Services
  ('home', 'services', 'service1_title', 'Strategic Consulting', 'text'),
  ('home', 'services', 'service1_subtitle', 'Personalized marketing analysis & strategy', 'text'),
  ('home', 'services', 'service2_title', 'Media Buying', 'text'),
  ('home', 'services', 'service2_subtitle', 'Optimized advertising campaigns', 'text'),
  ('home', 'services', 'service3_title', 'Video Production', 'text'),
  ('home', 'services', 'service3_subtitle', 'Professional shooting & editing', 'text'),
  ('home', 'services', 'service4_title', 'Social Media Management', 'text'),
  ('home', 'services', 'service4_subtitle', 'Expert community management', 'text'),
  ('home', 'services', 'service5_title', 'Graphic Design', 'text'),
  ('home', 'services', 'service5_subtitle', 'Visual identity & creations', 'text'),
  ('home', 'services', 'service6_title', 'Data Analytics', 'text'),
  ('home', 'services', 'service6_subtitle', 'Insights & detailed reports', 'text');
