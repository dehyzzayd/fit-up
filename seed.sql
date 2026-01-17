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

-- Seed initial editable content with ALL fields including images
INSERT OR IGNORE INTO content (page, section, content_key, content_value, content_type)
VALUES 
  -- ========================================
  -- HOMEPAGE CONTENT
  -- ========================================
  
  -- Hero Section
  ('home', 'hero', 'tagline', 'Where Brands Win.', 'text'),
  
  -- Logo Scroll Section
  ('home', 'logo_scroll', 'title', 'Brands We''ve Worked With', 'text'),
  ('home', 'logo_scroll', 'logos', '[{"url":"https://fedaura.ma/cdn/shop/files/Untitled_design_10_5944d3f3-9115-4fd0-b1ed-58c69bbc602f.png?height=72&v=1756045971","name":"Fedaura","round":false},{"url":"https://instagram.fcmn3-1.fna.fbcdn.net/v/t51.2885-19/573221119_17946853287053011_813047376054832019_n.jpg","name":"Brand 2","round":true},{"url":"https://i.ibb.co/VWs7tk3q/605997942-17850007239614033-1994629091166485047-n.jpg","name":"fitup","round":true}]', 'json'),
  
  -- Custom CSS Section
  ('home', 'custom_css', 'enabled', 'false', 'checkbox'),
  ('home', 'custom_css', 'code', '/* Add your custom CSS here */\n\n/* Example:\n.hero-section {\n  background: linear-gradient(135deg, #000 0%, #333 100%);\n}\n*/', 'css'),
  
  -- Services Section
  ('home', 'services', 'title', 'Our Services', 'text'),
  ('home', 'services', 'service1_title', 'Strategic Consulting', 'text'),
  ('home', 'services', 'service1_subtitle', 'Personalized marketing analysis & strategy', 'text'),
  ('home', 'services', 'service1_image', 'https://i.ibb.co/3YdDVd9P/33aca89d-c4fe-43ff-a4ac-00e921a9213c.jpg', 'url'),
  ('home', 'services', 'service2_title', 'Media Buying', 'text'),
  ('home', 'services', 'service2_subtitle', 'Optimized advertising campaigns', 'text'),
  ('home', 'services', 'service2_image', 'https://i.ibb.co/8nvv5vM2/dee359e2-f702-4a59-8baa-87df5600a300.jpg', 'url'),
  ('home', 'services', 'service3_title', 'Video Production', 'text'),
  ('home', 'services', 'service3_subtitle', 'Professional shooting & editing', 'text'),
  ('home', 'services', 'service3_image', 'https://i.ibb.co/3PZvBNq/c23b0c50-f718-4df8-a5ec-ec1c9b337007.jpg', 'url'),
  ('home', 'services', 'service4_title', 'Social Media Management', 'text'),
  ('home', 'services', 'service4_subtitle', 'Expert community management', 'text'),
  ('home', 'services', 'service4_image', 'https://i.ibb.co/Q7vnL5tC/87a60201-0539-4235-b157-d1d482767c17.jpg', 'url'),
  ('home', 'services', 'service5_title', 'Graphic Design', 'text'),
  ('home', 'services', 'service5_subtitle', 'Visual identity & creations', 'text'),
  ('home', 'services', 'service5_image', 'https://i.ibb.co/G3FM7rqf/910362e8-26f4-4f29-b8c5-d81155a8fd59.jpg', 'url'),
  ('home', 'services', 'service6_title', 'Data Analytics', 'text'),
  ('home', 'services', 'service6_subtitle', 'Insights & detailed reports', 'text'),
  ('home', 'services', 'service6_image', 'https://i.ibb.co/DPczL7XT/83a4fbb4-fd83-44ef-9071-4193c8ddbc82.jpg', 'url'),
  
  -- About Section
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
  
  -- Social Media Links
  ('home', 'social', 'twitter_handle', '@fitup_ma', 'text'),
  ('home', 'social', 'twitter_url', 'https://twitter.com/fitup_ma', 'url'),
  ('home', 'social', 'instagram_handle', '@fitup.ma', 'text'),
  ('home', 'social', 'instagram_url', 'https://instagram.com/fitup.ma', 'url'),
  ('home', 'social', 'linkedin_url', 'https://linkedin.com/company/fitup', 'url'),
  
  -- Footer Section
  ('home', 'footer', 'description', 'Where brands win. We help businesses grow through strategic marketing, creative content, and data-driven decisions.', 'text'),
  ('home', 'footer', 'email', 'hello@fitup.ma', 'text'),
  ('home', 'footer', 'phone', '+212 6 00 00 00 00', 'text'),
  ('home', 'footer', 'location', 'Casablanca, Morocco', 'text'),
  
  -- Branding Section
  ('home', 'branding', 'main_logo', 'https://i.ibb.co/VWs7tk3q/605997942-17850007239614033-1994629091166485047-n.jpg', 'url'),
  ('home', 'branding', 'favicon', 'https://i.ibb.co/VWs7tk3q/605997942-17850007239614033-1994629091166485047-n.jpg', 'url'),
  
  -- ========================================
  -- CONTACT PAGE CONTENT
  -- ========================================
  ('contact', 'hero', 'title', 'Prenez rendez-vous', 'text'),
  ('contact', 'hero', 'subtitle', 'Choisissez un créneau qui vous convient', 'text'),
  ('contact', 'form', 'submit_button', 'Envoyer', 'text'),
  ('contact', 'form', 'success_message', 'Merci ! Votre demande a été envoyée avec succès.', 'text');
