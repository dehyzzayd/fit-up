// Contact Page - Exact pixel-perfect reproduction of Contact.html with full navigation
export function contactPage(content: Record<string, Record<string, string>> = {}): string {
  const getContent = (section: string, key: string, fallback: string): string => {
    return content[section]?.[key] || fallback;
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
  
  // Generate menu HTML for contact page (prefix anchors with / for home page)
  const menuItems = getMenuItems();
  const sideMenuLinksHTML = menuItems.map(item => {
    const url = item.type === 'anchor' ? '/' + item.url : item.url;
    const isActive = item.url === '/contact' ? ' active' : '';
    return `<a href="${url}" class="side-menu-link${isActive}">${item.label}</a>`;
  }).join('\n      ');

  // Helper to get form fields
  interface FormField {
    id: number;
    name: string;
    label: string;
    type: string;
    required: boolean;
    order: number;
    placeholder?: string;
    options?: string[];
  }
  
  const getFormFields = (): FormField[] => {
    const fieldsStr = content['form']?.['fields'];
    if (fieldsStr) {
      try {
        const parsed = typeof fieldsStr === 'string' ? JSON.parse(fieldsStr) : fieldsStr;
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.sort((a, b) => (a.order || 0) - (b.order || 0));
        }
      } catch (e) {
        // Fall through to defaults
      }
    }
    // Default form fields
    return [
      { id: 1, name: 'first_name', label: 'Prénom', type: 'text', required: true, order: 1, placeholder: 'Votre prénom' },
      { id: 2, name: 'last_name', label: 'Nom', type: 'text', required: true, order: 2, placeholder: 'Votre nom' },
      { id: 3, name: 'email', label: 'Email', type: 'email', required: true, order: 3, placeholder: 'votre@email.com' },
      { id: 4, name: 'phone', label: 'Téléphone', type: 'tel', required: false, order: 4, placeholder: '+212 6XX XXX XXX' },
      { id: 5, name: 'company', label: 'Entreprise', type: 'text', required: false, order: 5, placeholder: 'Votre entreprise' },
      { id: 6, name: 'message', label: 'Message', type: 'textarea', required: true, order: 6, placeholder: 'Décrivez votre projet...' }
    ];
  };
  
  // Generate form fields HTML
  const formFields = getFormFields();
  
  const generateFieldHTML = (field: FormField): string => {
    const requiredAttr = field.required ? ' required' : '';
    const requiredMark = field.required ? ' *' : '';
    const placeholder = field.placeholder || '';
    
    if (field.type === 'textarea') {
      return `
        <div class="form-group full-width">
          <label for="${field.name}">${field.label}${requiredMark}</label>
          <textarea id="${field.name}" name="${field.name}" rows="4" placeholder="${placeholder}"${requiredAttr}></textarea>
        </div>`;
    } else if (field.type === 'select') {
      const options = field.options || ['Option 1', 'Option 2', 'Option 3'];
      return `
        <div class="form-group full-width">
          <label for="${field.name}">${field.label}${requiredMark}</label>
          <select id="${field.name}" name="${field.name}"${requiredAttr}>
            <option value="">Select...</option>
            ${options.map(opt => `<option value="${opt}">${opt}</option>`).join('\n            ')}
          </select>
        </div>`;
    } else {
      return `
        <div class="form-group">
          <label for="${field.name}">${field.label}${requiredMark}</label>
          <input type="${field.type}" id="${field.name}" name="${field.name}" placeholder="${placeholder}"${requiredAttr}>
        </div>`;
    }
  };
  
  // Group fields into rows (2 per row for non-full-width fields)
  const generateFormHTML = (): string => {
    let html = '';
    let rowFields: FormField[] = [];
    
    for (const field of formFields) {
      if (field.type === 'textarea' || field.type === 'select') {
        // Close any open row first
        if (rowFields.length > 0) {
          html += `<div class="form-row">${rowFields.map(f => generateFieldHTML(f)).join('')}</div>`;
          rowFields = [];
        }
        // Full width field
        html += generateFieldHTML(field);
      } else {
        rowFields.push(field);
        if (rowFields.length === 2) {
          html += `<div class="form-row">${rowFields.map(f => generateFieldHTML(f)).join('')}</div>`;
          rowFields = [];
        }
      }
    }
    
    // Handle remaining fields
    if (rowFields.length > 0) {
      html += `<div class="form-row">${rowFields.map(f => generateFieldHTML(f)).join('')}</div>`;
    }
    
    return html;
  };
  
  const formFieldsHTML = generateFormHTML();
  const submitButtonText = getContent('form', 'submit_button', 'Confirmer le rendez-vous');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>fitup · Contact</title>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/static/styles/contact.css">
</head>
<body>

  <!-- Side Menu Overlay -->
  <div class="side-menu-overlay" id="sideMenuOverlay"></div>

  <!-- Side Menu (Same as main site) -->
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
      <a href="/" class="nav-logo">
        <img src="https://i.ibb.co/VWs7tk3q/605997942-17850007239614033-1994629091166485047-n.jpg" alt="fitup" class="nav-logo-img">
        <span>© fitup</span>
      </a>
    </div>
    
    <div class="nav-center-left">
      <a href="/" class="nav-menu-item">Accueil</a>
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

  <!-- Main Content -->
  <main class="main-content">
    <h1 class="page-title" data-content="hero.title">${getContent('hero', 'title', 'Prenez rendez-vous')}</h1>
    <p class="page-subtitle" data-content="hero.subtitle">${getContent('hero', 'subtitle', 'Choisissez un créneau qui vous convient')}</p>

    <!-- Calendar Section -->
    <div class="calendar-section">
      <h2 class="section-title">Sélectionnez une date</h2>
      
      <!-- Month Navigation -->
      <div class="calendar-nav">
        <button class="cal-nav-btn" id="prevMonth">← Précédent</button>
        <span class="cal-month-label" id="monthLabel">Janvier 2026</span>
        <button class="cal-nav-btn" id="nextMonth">Suivant →</button>
      </div>
      
      <!-- Calendar Grid -->
      <div class="calendar-grid" id="calendarGrid">
        <!-- Days will be generated by JS -->
      </div>
      
      <!-- Time Slots -->
      <div class="time-slots-container" id="timeSlotsContainer" style="display: none;">
        <h3 class="time-slots-title">Créneaux disponibles</h3>
        <div class="time-slots" id="timeSlots">
          <!-- Slots generated by JS -->
        </div>
      </div>
    </div>

    <!-- Form Section (Hidden until slot selected) -->
    <div id="_builder-form" class="builder-form" style="display: none;">
      <h2 class="section-title">Vos informations</h2>
      <p class="selected-slot-info" id="selectedSlotInfo"></p>
      
      <form id="contactForm">
        ${formFieldsHTML}
        
        <button type="submit" class="submit-btn">${submitButtonText}</button>
      </form>
    </div>
    
    <!-- Success Message -->
    <div id="successMessage" class="success-message" style="display: none;">
      <div class="success-icon">✓</div>
      <h2>Rendez-vous confirmé!</h2>
      <p>Nous vous contacterons très bientôt.</p>
      <a href="/" class="back-home-btn">Retour à l'accueil</a>
    </div>
  </main>

  <script src="/static/js/contact.js"></script>
</body>
</html>`;
}
