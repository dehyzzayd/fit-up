// Homepage - Exact pixel-perfect reproduction of Fitup-main.html
export function homePage(content: Record<string, Record<string, string>> = {}): string {
  // Helper to get content with fallback
  const getContent = (section: string, key: string, fallback: string): string => {
    return content[section]?.[key] || fallback;
  };
  
  // Helper to get logos array
  const getLogos = (): Array<{url: string, name: string, round: boolean}> => {
    const logosStr = content['logo_scroll']?.['logos'];
    if (logosStr) {
      try {
        const parsed = typeof logosStr === 'string' ? JSON.parse(logosStr) : logosStr;
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        // Fall through to defaults
      }
    }
    // Default logos
    return [
      { url: 'https://fedaura.ma/cdn/shop/files/Untitled_design_10_5944d3f3-9115-4fd0-b1ed-58c69bbc602f.png?height=72&v=1756045971', name: 'Fedaura', round: false },
      { url: 'https://instagram.fcmn3-1.fna.fbcdn.net/v/t51.2885-19/573221119_17946853287053011_813047376054832019_n.jpg', name: 'Brand', round: true },
      { url: 'https://i.ibb.co/VWs7tk3q/605997942-17850007239614033-1994629091166485047-n.jpg', name: 'fitup', round: true }
    ];
  };
  
  // Get custom CSS
  const getCustomCSS = (): string => {
    const enabled = content['custom_css']?.['enabled'];
    const code = content['custom_css']?.['code'];
    if ((enabled === 'true' || enabled === true) && code) {
      return `<style id="custom-css">\n/* Custom CSS */\n${code}\n</style>`;
    }
    return '';
  };
  
  // Helper to get menu items
  const getMenuItems = (): Array<{label: string, url: string, type: string}> => {
    const menuStr = content['menu']?.['items'];
    if (menuStr) {
      try {
        const parsed = typeof menuStr === 'string' ? JSON.parse(menuStr) : menuStr;
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        // Fall through to defaults
      }
    }
    // Default menu items
    return [
      { label: 'Home', url: '/', type: 'internal' },
      { label: 'Services', url: '#services', type: 'anchor' },
      { label: 'Get 20% Off', url: '#discount', type: 'anchor' },
      { label: 'Contact', url: '/contact', type: 'internal' }
    ];
  };
  
  // Generate menu HTML
  const menuItems = getMenuItems();
  const sideMenuLinksHTML = menuItems.map(item => 
    `<a href="${item.url}" class="side-menu-link">${item.label}</a>`
  ).join('\n      ');
  
  // Generate logo items HTML - duplicate for infinite seamless scroll
  const logos = getLogos();
  const logoItemsHTML = logos.map(logo => `
    <div class="logo-item${logo.round ? ' round' : ''}">
      <img src="${logo.url}" alt="${logo.name || 'Brand'}" loading="lazy">
    </div>
  `).join('');
  // For seamless infinite scroll, we need exactly 2 copies of logos
  // The animation will scroll through the first copy, then reset (showing the second copy which looks identical)
  // This creates the illusion of infinite scrolling
  const repeatedLogosHTML = logoItemsHTML + logoItemsHTML;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>fitup · Unseen Media Agency</title>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@500&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Rubik+Mono+One&display=swap" rel="stylesheet">
  
 <script type="importmap">
    {
      "imports": {
        "three": "https://cdn.jsdelivr.net/npm/three@0.182.0/build/three.module.js",
        "jsm/": "https://cdn.jsdelivr.net/npm/three@0.182.0/examples/jsm/"
      }
    }
  </script>
  
  <link rel="stylesheet" href="/static/styles/main.css">
  ${getCustomCSS()}
</head>
<body>

  <!-- Side Menu Overlay -->
  <div class="side-menu-overlay" id="sideMenuOverlay"></div>

  <!-- Side Menu -->
  <aside class="side-menu" id="sideMenu">
    <div class="side-menu-header">
      <div class="side-menu-logo">
        <img src="https://i.ibb.co/VWs7tk3q/605997942-17850007239614033-1994629091166485047-n.jpg" alt="fitup">
        <span>fitup</span>
      </div>
      <button class="side-menu-close" id="sideMenuClose">
        <span></span>
        <span></span>
      </button>
    </div>
    <nav class="side-menu-nav">
      ${sideMenuLinksHTML}
    </nav>
    <div class="side-menu-footer">
      <div class="side-menu-social">
        <a href="#">Instagram</a>
        <a href="#">LinkedIn</a>
        <a href="#">Twitter</a>
      </div>
      <div class="side-menu-email">
        <a href="mailto:${getContent('footer', 'email', 'hello@fitup.ma')}">${getContent('footer', 'email', 'hello@fitup.ma')}</a>
      </div>
    </div>
  </aside>



  <!-- Top Navigation -->
  <nav class="top-nav" id="topNav">
    <div class="nav-left">
      <a href="#" class="nav-logo">
        <img src="https://i.ibb.co/VWs7tk3q/605997942-17850007239614033-1994629091166485047-n.jpg" alt="fitup" class="nav-logo-img">
        <span>© fitup</span>
      </a>
    </div>
    
    <div class="nav-center-left">
      <a href="/contact" class="nav-menu-item">Contact Us</a>
      <a href="/gallerie" class="nav-menu-item">Gallerie</a>
    </div>
    
    <div class="nav-center">
      <div class="nav-stripe-cluster">
        ${Array(30).fill('<div class="stripe"></div>').join('')}
      </div>
    </div>
    
    <div class="nav-center-right">
      <!-- Language toggle removed -->
    </div>
    
    <div class="nav-right">
      <button class="nav-menu-btn" id="menuBtn">
        <span class="menu-text">Menu</span>
        <span class="menu-icon">
          <span class="menu-line menu-line-h"></span>
          <span class="menu-line menu-line-v"></span>
        </span>
      </button>
    </div>
  </nav>

  <!-- Preloader -->
  <div id="preloader" class="preloader">
    <div class="preloader-content">
      <div class="ghost-loader">
        <svg class="ghost-svg" height="80" viewBox="0 0 512 512" width="80" xmlns="http://www.w3.org/2000/svg">
          <!-- Ghost body - white -->
          <path class="ghost-body" d="m508.374 432.802s-46.6-39.038-79.495-275.781c-8.833-87.68-82.856-156.139-172.879-156.139-90.015 0-164.046 68.458-172.879 156.138-32.895 236.743-79.495 275.782-79.495 275.782-15.107 25.181 20.733 28.178 38.699 27.94 35.254-.478 35.254 40.294 70.516 40.294 35.254 0 35.254-35.261 70.508-35.261s37.396 45.343 72.65 45.343 37.389-45.343 72.651-45.343c35.254 0 35.254 35.261 70.508 35.261s35.27-40.772 70.524-40.294c17.959.238 53.798-2.76 38.692-27.94z" fill="white" />
          <!-- Left eye - green -->
          <circle class="ghost-eye left-eye" cx="208" cy="225" r="22" fill="#00ff80" />
          <!-- Right eye - green -->
          <circle class="ghost-eye right-eye" cx="297" cy="225" r="22" fill="#00ff80" />
        </svg>
      </div>
      <div class="loading-text">Summoning spirits</div>
      <div class="loading-progress">
        <div class="progress-bar"></div>
      </div>
    </div>
  </div>

  <!-- Hero 3D Canvas -->
  <canvas class="webgl"></canvas>
  
  <!-- Black Fade Overlay -->
  <div id="blackFadeOverlay"></div>

  <!-- Hero Section -->
  <section id="s1" class="hero-section">
    <div id="main-content" class="hero">
      <div class="hero-text-container">
        <h1 class="hero-slogan">
          <span>Audience Juste</span>
          <span>Messages Forts</span>
          <span>ROI Maximal</span>
        </h1>
      </div>
    </div>
    <!-- Contact Us Button -->
    <a href="/contact" class="hero-cta-btn">
      <span class="btn-text">Contact Us</span>
      <span class="btn-arrow">→</span>
    </a>
  </section>

  <!-- Logo Scroll Section -->
  <section class="logo-scroll-section">
    <p class="logo-scroll-title" data-content="logo_scroll.title">${getContent('logo_scroll', 'title', 'Brands We\'ve Worked With')}</p>
    <div class="logo-scroll-container">
      <div class="logo-scroll-track">
        ${repeatedLogosHTML}
      </div>
    </div>
  </section>

  <!-- Services Section - Expanding Cards -->
  <section class="services-section" id="services">
    <p class="services-title" data-content="services.title">${getContent('services', 'title', 'Our Services')}</p>
    <div class="options">
      <div class="option active">
        <img class="option-image" src="https://i.ibb.co/3YdDVd9P/33aca89d-c4fe-43ff-a4ac-00e921a9213c.jpg" alt="Strategic Consulting">
        <div class="shadow"></div>
        <div class="label">
          <div class="icon">
            <img src="https://i.ibb.co/VWs7tk3q/605997942-17850007239614033-1994629091166485047-n.jpg" alt="fitup">
          </div>
          <div class="info">
            <div class="main" data-content="services.service1_title">${getContent('services', 'service1_title', 'Strategic Consulting')}</div>
            <div class="sub" data-content="services.service1_subtitle">${getContent('services', 'service1_subtitle', 'Personalized marketing analysis & strategy')}</div>
          </div>
        </div>
      </div>
      <div class="option">
        <img class="option-image" src="https://i.ibb.co/8nvv5vM2/dee359e2-f702-4a59-8baa-87df5600a300.jpg" alt="Media Buying">
        <div class="shadow"></div>
        <div class="label">
          <div class="icon">
            <img src="https://i.ibb.co/VWs7tk3q/605997942-17850007239614033-1994629091166485047-n.jpg" alt="fitup">
          </div>
          <div class="info">
            <div class="main" data-content="services.service2_title">${getContent('services', 'service2_title', 'Media Buying')}</div>
            <div class="sub" data-content="services.service2_subtitle">${getContent('services', 'service2_subtitle', 'Optimized advertising campaigns')}</div>
          </div>
        </div>
      </div>
      <div class="option">
        <img class="option-image" src="https://i.ibb.co/3PZvBNq/c23b0c50-f718-4df8-a5ec-ec1c9b337007.jpg">
        <div class="shadow"></div>
        <div class="label">
          <div class="icon">
            <img src="https://i.ibb.co/VWs7tk3q/605997942-17850007239614033-1994629091166485047-n.jpg" alt="fitup">
          </div>
          <div class="info">
            <div class="main" data-content="services.service3_title">${getContent('services', 'service3_title', 'Video Production')}</div>
            <div class="sub" data-content="services.service3_subtitle">${getContent('services', 'service3_subtitle', 'Professional shooting & editing')}</div>
          </div>
        </div>
      </div>
      <div class="option">
        <img class="option-image" src="https://i.ibb.co/Q7vnL5tC/87a60201-0539-4235-b157-d1d482767c17.jpg">
        <div class="shadow"></div>
        <div class="label">
          <div class="icon">
            <img src="https://i.ibb.co/VWs7tk3q/605997942-17850007239614033-1994629091166485047-n.jpg" alt="fitup">
          </div>
          <div class="info">
            <div class="main" data-content="services.service4_title">${getContent('services', 'service4_title', 'Social Media Management')}</div>
            <div class="sub" data-content="services.service4_subtitle">${getContent('services', 'service4_subtitle', 'Expert community management')}</div>
          </div>
        </div>
      </div>
      <div class="option">
        <img class="option-image" src="https://i.ibb.co/G3FM7rqf/910362e8-26f4-4f29-b8c5-d81155a8fd59.jpg" alt="Graphic Design">
        <div class="shadow"></div>
        <div class="label">
          <div class="icon">
            <img src="https://i.ibb.co/VWs7tk3q/605997942-17850007239614033-1994629091166485047-n.jpg" alt="fitup">
          </div>
          <div class="info">
            <div class="main" data-content="services.service5_title">${getContent('services', 'service5_title', 'Graphic Design')}</div>
            <div class="sub" data-content="services.service5_subtitle">${getContent('services', 'service5_subtitle', 'Visual identity & creations')}</div>
          </div>
        </div>
      </div>
      <div class="option">
        <img class="option-image" src="https://i.ibb.co/DPczL7XT/83a4fbb4-fd83-44ef-9071-4193c8ddbc82.jpg" alt="Data Analytics">
        <div class="shadow"></div>
        <div class="label">
          <div class="icon">
            <img src="https://i.ibb.co/VWs7tk3q/605997942-17850007239614033-1994629091166485047-n.jpg" alt="fitup">
          </div>
          <div class="info">
            <div class="main" data-content="services.service6_title">${getContent('services', 'service6_title', 'Data Analytics')}</div>
            <div class="sub" data-content="services.service6_subtitle">${getContent('services', 'service6_subtitle', 'Insights & detailed reports')}</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Game Section -->
  <section class="game-section" id="discount">
    <div class="game-container">
      <div class="game-left">
        <svg class="game-svg" id="gameSvg" viewBox="0 0 320 320">
          <g class="slots"></g>
          <g class="tiles"></g>
        </svg>
      </div>

      <div class="game-right">
        <div class="animation-stage">
          <div class="animation-bg"></div>
          <div class="animation-word">20% OFF</div>
        </div>
        
        <div class="game-initial-message" id="gameInitialMessage">
          <p class="game-cta-text">Click to claim 20% off</p>
          <p class="game-cta-subtext">Tap the letters to reveal your discount</p>
        </div>

        <div class="game-win-message" id="winMessage">
          <div class="game-win-title">Congratulations!</div>
          <div class="game-win-subtitle">You've unlocked 20% off your first project</div>
          <a href="/contact" class="claim-btn">Claim Your Discount</a>
        </div>
      </div>
    </div>
  </section>

  <!-- About Us Transition Section -->
  <section class="about-transition-section" id="about">
    <!-- SVG Curve -->
    <div class="curve-container">
      <svg viewBox="0 0 1440 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M0,300 L0,80 
             C200,60 400,40 600,50 
             C800,60 1000,120 1150,180 
             Q1300,240 1440,200 
             L1440,300 Z" 
          fill="#ffffff"
        />
      </svg>
    </div>

    <!-- About Content -->
    <div class="about-content">
      <div class="about-grid">
        <!-- Left Column - Heading -->
        <div class="about-left">
          <h2 class="about-heading">
            <span data-content="about.heading_line1">${getContent('about', 'heading_line1', 'About')}</span>
            <span data-content="about.heading_line2">${getContent('about', 'heading_line2', 'Us')}</span>
          </h2>
          <!-- Stats -->
          <div class="about-stats">
            <div class="stat-item">
              <div class="stat-number" data-content="about.stat1_number">${getContent('about', 'stat1_number', '50+')}</div>
              <div class="stat-label" data-content="about.stat1_label">${getContent('about', 'stat1_label', 'Projects Delivered')}</div>
            </div>
            <div class="stat-item">
              <div class="stat-number" data-content="about.stat2_number">${getContent('about', 'stat2_number', '98%')}</div>
              <div class="stat-label" data-content="about.stat2_label">${getContent('about', 'stat2_label', 'Client Satisfaction')}</div>
            </div>
            <div class="stat-item">
              <div class="stat-number" data-content="about.stat3_number">${getContent('about', 'stat3_number', '5+')}</div>
              <div class="stat-label" data-content="about.stat3_label">${getContent('about', 'stat3_label', 'Years Experience')}</div>
            </div>
          </div>
        </div>

        <!-- Right Column - Text -->
        <div class="about-text">
          <p data-content="about.paragraph1">${getContent('about', 'paragraph1', 'At fitup, we believe that every brand has a unique story waiting to be told. We\'re not just a marketing agency—we\'re your strategic partners in growth, dedicated to transforming your vision into measurable success.')}</p>
          <p data-content="about.paragraph2">${getContent('about', 'paragraph2', 'Our team combines creative excellence with data-driven insights to craft campaigns that resonate with your audience and drive real results. From strategic consulting to full-scale media production, we handle every aspect of your brand\'s digital presence.')}</p>
          <p data-content="about.paragraph3">${getContent('about', 'paragraph3', 'Based in Casablanca, Morocco, we\'ve helped businesses across industries elevate their brand, connect with their audience, and achieve sustainable growth. Whether you\'re a startup looking to make your mark or an established brand seeking fresh perspectives, we\'re here to help you win.')}</p>
        </div>
      </div>
    </div>
  </section>
  
  <!-- Social Section -->
  <section class="social-section" id="social">
    <div class="social-wrapper">
      <!-- Twitter Side -->
      <div class="social-item">
        <div class="social-text-content">
          <p class="social-label">Find Us On</p>
          <p class="social-title twitter">Twitter</p>
          <p class="social-handle"><a href="https://twitter.com/fitup_ma" target="_blank">@fitup_ma</a></p>
        </div>

        <div data-slide="twitter-slide" class="social-slide">
          <div class="social-slide-items">
            <img src="https://i.ibb.co/B2FL7VNC/Screenshot-2.png" alt="fitup Twitter 1">
            <img src="https://i.ibb.co/B2FL7VNC/Screenshot-2.png" alt="fitup Twitter 2">
            <img src="https://i.ibb.co/B2FL7VNC/Screenshot-2.png" alt="fitup Twitter 3">
          </div>

          <nav class="social-slide-nav">
            <div class="social-slide-thumb"></div>
            <button class="social-slide-prev">Previous</button>
            <button class="social-slide-next">Next</button>
          </nav>
        </div>
      </div>

      <!-- Instagram Side -->
      <div class="social-item reverse">
        <div class="social-text-content">
          <p class="social-label">Find Us On</p>
          <p class="social-title instagram">Instagram</p>
          <p class="social-handle"><a href="https://instagram.com/fitup.ma" target="_blank">@fitup.ma</a></p>
        </div>

        <div data-slide="instagram-slide" class="social-slide">
          <div class="social-slide-items">
            <img src="https://i.ibb.co/Nd3wmtRt/Screenshot-1.png" alt="fitup Story 1">
            <img src="https://i.ibb.co/Nd3wmtRt/Screenshot-1.png" alt="fitup Story 2">
            <img src="https://i.ibb.co/Nd3wmtRt/Screenshot-1.png" alt="fitup Story 3">
          </div>

          <nav class="social-slide-nav">
            <div class="social-slide-thumb"></div>
            <button class="social-slide-prev">Previous</button>
            <button class="social-slide-next">Next</button>
          </nav>
        </div>
      </div>
    </div>
  </section>
  
  <!-- FAQ Section -->
  <section class="faq-section" id="faq">
    <div class="faq-container">
      <!-- Left Side - Title -->
      <div class="faq-header">
        <p class="faq-label">/FAQ</p>
        <h2 class="faq-title">Questions<br>que vous<br>pourriez<br>poser</h2>
      </div>

      <!-- Right Side - Questions -->
      <div class="faq-list">
        <!-- Question 1 -->
        <div class="faq-item">
          <div class="faq-item-header">
            <span class="faq-number">/01</span>
            <h3 class="faq-question">C'est pour les petites entreprises ?</h3>
            <div class="faq-icon">
              <svg viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div class="faq-answer">
            <p class="faq-answer-text">
              Absolument. Nous travaillons avec des entreprises de toutes tailles, des startups aux grandes marques. Nos stratégies sont adaptées à votre budget et à vos objectifs spécifiques.
            </p>
          </div>
        </div>

        <!-- Question 2 -->
        <div class="faq-item active">
          <div class="faq-item-header">
            <span class="faq-number">/02</span>
            <h3 class="faq-question">J'ai déjà essayé le marketing et ça n'a pas marché. Pourquoi ce serait différent ?</h3>
            <div class="faq-icon">
              <svg viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div class="faq-answer">
            <p class="faq-answer-text">
              On entend ça souvent. Notre première étape est un audit — nous identifions pourquoi les choses ont échoué et ce qui doit changer. L'objectif n'est pas de "poster plus", mais de construire un système qui fonctionne.
            </p>
          </div>
        </div>

        <!-- Question 3 -->
        <div class="faq-item">
          <div class="faq-item-header">
            <span class="faq-number">/03</span>
            <h3 class="faq-question">Combien de temps avant de voir des résultats ?</h3>
            <div class="faq-icon">
              <svg viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div class="faq-answer">
            <p class="faq-answer-text">
              Les premiers résultats sont généralement visibles dans les 2-4 premières semaines. Des résultats significatifs et durables prennent généralement 2-3 mois de travail constant et d'optimisation.
            </p>
          </div>
        </div>

        <!-- Question 4 -->
        <div class="faq-item">
          <div class="faq-item-header">
            <span class="faq-number">/04</span>
            <h3 class="faq-question">Peut-on travailler à distance ? Je ne suis pas de votre ville</h3>
            <div class="faq-icon">
              <svg viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div class="faq-answer">
            <p class="faq-answer-text">
              Bien sûr ! La majorité de nos clients travaillent avec nous à distance. Nous utilisons des outils de collaboration modernes et organisons des appels réguliers pour rester alignés sur vos objectifs.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer" id="s2">
    <div class="footer-content">
      <div class="footer-brand">
        <div class="footer-logo">
          <img src="https://i.ibb.co/VWs7tk3q/605997942-17850007239614033-1994629091166485047-n.jpg" alt="fitup">
          <span>fitup</span>
        </div>
        <p class="footer-description" data-content="footer.description">${getContent('footer', 'description', 'Where brands win. We help businesses grow through strategic marketing, creative content, and data-driven decisions.')}</p>
      </div>
      
      <div class="footer-column">
        <h4>Navigation</h4>
        <ul class="footer-links">
          ${menuItems.map(item => `<li><a href="${item.url}">${item.label}</a></li>`).join('\n          ')}
        </ul>
      </div>
      
      <div class="footer-column">
        <h4>Services</h4>
        <ul class="footer-links">
          <li><a href="#">Strategic Consulting</a></li>
          <li><a href="#">Media Buying</a></li>
          <li><a href="#">Video Production</a></li>
          <li><a href="#">Social Media</a></li>
        </ul>
      </div>
      
      <div class="footer-column">
        <h4>Contact</h4>
        <ul class="footer-links">
          <li><a href="mailto:${getContent('footer', 'email', 'hello@fitup.ma')}" data-content="footer.email">${getContent('footer', 'email', 'hello@fitup.ma')}</a></li>
          <li><a href="tel:${getContent('footer', 'phone', '+212 6 00 00 00 00').replace(/\\s/g, '')}" data-content="footer.phone">${getContent('footer', 'phone', '+212 6 00 00 00 00')}</a></li>
          <li><a href="#" data-content="footer.location">${getContent('footer', 'location', 'Casablanca, Morocco')}</a></li>
        </ul>
      </div>
    </div>
    
    <div class="footer-bottom">
      <p class="footer-copyright">© 2026 fitup. All rights reserved.</p>
      <div class="footer-social">
        <a href="#">Instagram</a>
        <a href="#">LinkedIn</a>
        <a href="#">Twitter</a>
        <a href="#">Behance</a>
      </div>
    </div>
  </footer>

  <!-- Let's Talk Floating Button & Chat Widget -->
  <div class="lets-talk-widget">
    <a href="https://wa.me/212770259572" target="_blank" rel="noopener noreferrer" class="whatsapp-floating-btn" title="Chat on WhatsApp">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="white" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
    <button class="lets-talk-btn" id="letsTalkBtn">
      <svg class="chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <svg class="close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
      <span>Let's Talk</span>
    </button>
    
    <div class="lets-talk-dialog" id="letsTalkDialog">
      <div class="dialog-header">
        <h3>Let's Talk</h3>
        <p>Send us a quick message</p>
      </div>
      <form class="dialog-form" id="letsTalkForm">
        <div class="dialog-field">
          <input type="text" id="ltName" name="name" placeholder="Your full name *" required>
        </div>
        <div class="dialog-field">
          <input type="tel" id="ltPhone" name="phone" placeholder="Phone number *" required>
        </div>
        <div class="dialog-field">
          <textarea id="ltMessage" name="message" placeholder="How can we help? (optional)" rows="3"></textarea>
        </div>
        <button type="submit" class="dialog-submit">
          <span>Send Message</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </form>
      <div class="dialog-success" id="letsTalkSuccess" style="display:none;">
        <div class="success-icon">✓</div>
        <h4>Message Sent!</h4>
        <p>We'll get back to you soon.</p>
      </div>
    </div>
  </div>

<!-- GSAP - Must load BEFORE hero.js -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
  
  <!-- Hero animation - loads after GSAP -->
  <script type="module" src="/static/js/hero.js"></script>
  
  <!-- Main JS -->
  <script src="/static/js/main.js"></script>
</body>
</html>`;
}
