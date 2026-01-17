// Dashboard JavaScript - fitup Admin Dashboard
document.addEventListener('DOMContentLoaded', () => {
  // State
  let currentUser = null;
  let inquiries = [];
  let users = [];
  let contentData = {};
  let selectedContentPage = 'home';
  let currentInquiry = null;
  let editingUserId = null;

  // Get token from localStorage
  const getToken = () => localStorage.getItem('fitup_token');

  // API helpers
  const api = {
    async get(endpoint) {
      const response = await fetch(`/api${endpoint}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (!response.ok) throw new Error('API Error');
      return response.json();
    },
    async post(endpoint, data) {
      const response = await fetch(`/api${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(data)
      });
      return response.json();
    },
    async put(endpoint, data) {
      const response = await fetch(`/api${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(data)
      });
      return response.json();
    },
    async delete(endpoint) {
      const response = await fetch(`/api${endpoint}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      return response.json();
    }
  };

  // Check authentication
  async function checkAuth() {
    const token = getToken();
    if (!token) {
      window.location.href = '/admin';
      return;
    }

    try {
      const result = await api.get('/auth/verify');
      if (result.user) {
        currentUser = result.user;
        updateUserInfo();
        loadDashboard();
      } else {
        window.location.href = '/admin';
      }
    } catch (error) {
      window.location.href = '/admin';
    }
  }

  // Update user info in sidebar
  function updateUserInfo() {
    const userName = document.getElementById('userName');
    const userRole = document.getElementById('userRole');
    const userAvatar = document.getElementById('userAvatar');

    if (userName) userName.textContent = currentUser.name;
    if (userRole) userRole.textContent = currentUser.role === 'admin' ? 'Admin' : 'Viewer';
    if (userAvatar) userAvatar.textContent = currentUser.name.substring(0, 2).toUpperCase();
  }

  // Load dashboard data
  async function loadDashboard() {
    await Promise.all([
      loadStats(),
      loadInquiries(),
      loadUsers(),
      loadEmailSettings()
    ]);
  }

  // Load stats
  async function loadStats() {
    try {
      const stats = await api.get('/stats');

      document.getElementById('totalInquiries').textContent = stats.totalInquiries || 0;
      document.getElementById('newThisWeek').textContent = stats.newThisWeek || 0;
      document.getElementById('contactedCount').textContent = stats.contacted || 0;
      document.getElementById('convertedCount').textContent = stats.converted || 0;

      // Update badge
      const badge = document.getElementById('inquiryBadge');
      if (badge) badge.textContent = stats.totalInquiries || 0;

      // Calculate trends (simple percentage change)
      if (stats.totalInquiries > 0) {
        const conversionRate = ((stats.converted / stats.totalInquiries) * 100).toFixed(0);
        document.getElementById('convertedTrend').textContent = `${conversionRate}%`;
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }

  // Load inquiries
  async function loadInquiries(filters = {}) {
    try {
      let queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.source) queryParams.append('source', filters.source);
      if (filters.search) queryParams.append('search', filters.search);

      const endpoint = queryParams.toString() ? `/inquiries?${queryParams}` : '/inquiries';
      inquiries = await api.get(endpoint);
      renderInquiriesTable();
    } catch (error) {
      console.error('Failed to load inquiries:', error);
      // Show error state
      const tbody = document.getElementById('inquiriesTableBody');
      if (tbody) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align: center; padding: 40px; color: #ef4444;">
              Failed to load inquiries. Please refresh the page.
            </td>
          </tr>
        `;
      }
    }
  }

  // Render inquiries table
  function renderInquiriesTable() {
    const tbody = document.getElementById('inquiriesTableBody');
    if (!tbody) return;

    if (inquiries.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 40px; color: #86868b;">
            No inquiries found. New contact form submissions will appear here.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = inquiries.map(inquiry => `
      <tr data-id="${inquiry.id}" class="${inquiry.is_read ? '' : 'unread'}">
        <td>
          <div class="inquiry-name">${inquiry.first_name} ${inquiry.last_name}</div>
          <div class="inquiry-email">${inquiry.email}</div>
        </td>
        <td>
          <div class="inquiry-message">${inquiry.message || 'No message'}</div>
        </td>
        <td>
          <span class="source-badge source-${inquiry.source || 'website'}">${inquiry.source || 'website'}</span>
        </td>
        <td>
          <span class="status-badge status-${inquiry.status || 'new'}">${inquiry.status || 'new'}</span>
        </td>
        <td>${formatDate(inquiry.created_at)}</td>
        <td class="actions-cell">
          <button class="action-btn view-btn" title="View Details" data-id="${inquiry.id}">
            <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          ${currentUser?.role === 'admin' ? `
            <button class="action-btn danger delete-btn" title="Delete" data-id="${inquiry.id}">
              <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          ` : ''}
        </td>
      </tr>
    `).join('');

    // Add event listeners
    tbody.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => viewInquiry(parseInt(btn.dataset.id)));
    });

    tbody.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteInquiry(parseInt(btn.dataset.id)));
    });
  }

  // Format date
  function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // View inquiry details
  async function viewInquiry(id) {
    currentInquiry = inquiries.find(i => i.id === id);
    if (!currentInquiry) return;

    // Mark as read
    if (!currentInquiry.is_read) {
      await api.post(`/inquiries/${id}/read`);
      currentInquiry.is_read = 1;
      loadInquiries();
    }

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
      <div class="detail-row">
        <span class="detail-label">Name</span>
        <span class="detail-value">${currentInquiry.first_name} ${currentInquiry.last_name}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Email</span>
        <span class="detail-value"><a href="mailto:${currentInquiry.email}">${currentInquiry.email}</a></span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Phone</span>
        <span class="detail-value">${currentInquiry.phone || 'Not provided'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Company</span>
        <span class="detail-value">${currentInquiry.company || 'Not provided'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Job Title</span>
        <span class="detail-value">${currentInquiry.job_title || 'Not provided'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Budget</span>
        <span class="detail-value">${currentInquiry.budget || 'Not provided'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Appointment</span>
        <span class="detail-value">${currentInquiry.appointment_date ? `${currentInquiry.appointment_date} at ${currentInquiry.appointment_time}` : 'Not scheduled'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Source</span>
        <span class="detail-value"><span class="source-badge source-${currentInquiry.source}">${currentInquiry.source}</span></span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Status</span>
        <span class="detail-value">
          <select id="inquiryStatusSelect" class="filter-select" style="min-width: 150px;">
            <option value="new" ${currentInquiry.status === 'new' ? 'selected' : ''}>New</option>
            <option value="contacted" ${currentInquiry.status === 'contacted' ? 'selected' : ''}>Contacted</option>
            <option value="converted" ${currentInquiry.status === 'converted' ? 'selected' : ''}>Converted</option>
            <option value="closed" ${currentInquiry.status === 'closed' ? 'selected' : ''}>Closed</option>
          </select>
        </span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Date</span>
        <span class="detail-value">${formatDate(currentInquiry.created_at)}</span>
      </div>
      <div class="detail-message">
        <div class="detail-label">Message</div>
        <div class="detail-value">${currentInquiry.message || 'No message provided'}</div>
      </div>
    `;

    document.getElementById('detailModal').classList.add('active');
  }

  // Delete inquiry
  async function deleteInquiry(id) {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;

    try {
      await api.delete(`/inquiries/${id}`);
      loadInquiries();
      loadStats();
    } catch (error) {
      alert('Failed to delete inquiry');
    }
  }

  // Load users
  async function loadUsers() {
    if (currentUser?.role !== 'admin') return;

    try {
      users = await api.get('/users');
      renderUsersTable();
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  }

  // Render users table
  function renderUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    tbody.innerHTML = users.map(user => `
      <tr>
        <td>
          <div class="inquiry-name">${user.name}</div>
          <div class="inquiry-email">${user.email}</div>
        </td>
        <td>
          <span class="status-badge ${user.role === 'admin' ? 'status-converted' : 'status-contacted'}">${user.role}</span>
        </td>
        <td>${formatDate(user.created_at)}</td>
        <td class="actions-cell">
          <button class="action-btn edit-user-btn" title="Edit" data-id="${user.id}">
            <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          ${user.id !== currentUser.id ? `
            <button class="action-btn danger delete-user-btn" title="Delete" data-id="${user.id}">
              <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          ` : ''}
        </td>
      </tr>
    `).join('');

    // Add event listeners
    tbody.querySelectorAll('.edit-user-btn').forEach(btn => {
      btn.addEventListener('click', () => editUser(parseInt(btn.dataset.id)));
    });

    tbody.querySelectorAll('.delete-user-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteUser(parseInt(btn.dataset.id)));
    });
  }

  // Edit user
  function editUser(id) {
    const user = users.find(u => u.id === id);
    if (!user) return;

    editingUserId = id;
    document.getElementById('userModalTitle').textContent = 'Edit User';
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userPassword').value = '';
    document.getElementById('userPassword').required = false;
    document.getElementById('userNameInput').value = user.name;
    document.getElementById('userRoleSelect').value = user.role;

    document.getElementById('userModal').classList.add('active');
  }

  // Delete user
  async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.delete(`/users/${id}`);
      loadUsers();
    } catch (error) {
      alert('Failed to delete user');
    }
  }

  // Load email settings
  async function loadEmailSettings() {
    try {
      const settings = await api.get('/email-settings');
      if (settings) {
        const notificationEmail = document.getElementById('notificationEmail');
        if (notificationEmail) notificationEmail.value = settings.gmail_email || '';
        
        const emailActive = document.getElementById('emailActive');
        if (emailActive) emailActive.checked = settings.is_active === 1;
        
        // Show connected state if Gmail is configured
        if (settings.gmail_email && settings.is_active) {
          showGmailConnected(settings.gmail_email);
        }
      }
    } catch (error) {
      console.error('Failed to load email settings:', error);
    }
  }
  
  // Gmail OAuth connection
  function showGmailConnected(email) {
    const notConnected = document.getElementById('gmailNotConnected');
    const connected = document.getElementById('gmailConnected');
    const connectedEmail = document.getElementById('connectedEmail');
    
    if (notConnected) notConnected.style.display = 'none';
    if (connected) connected.style.display = 'block';
    if (connectedEmail) connectedEmail.textContent = email;
  }
  
  function showGmailNotConnected() {
    const notConnected = document.getElementById('gmailNotConnected');
    const connected = document.getElementById('gmailConnected');
    
    if (notConnected) notConnected.style.display = 'block';
    if (connected) connected.style.display = 'none';
  }

  // Load content for CMS - ENHANCED VERSION
  async function loadContent(page = 'home') {
    try {
      const content = await api.get(`/content/${page}`);
      contentData[page] = content;
      renderContentEditor(page);
    } catch (error) {
      console.error('Failed to load content:', error);
    }
  }

  // ENHANCED: Render content editor with ALL editable fields
  function renderContentEditor(page) {
    const form = document.getElementById('contentEditForm');
    if (!form) return;

    const content = contentData[page] || {};
    
    // Define ALL editable sections for each page - comprehensive list
    const sections = page === 'home' ? {
      hero: { 
        title: 'Hero Section', 
        fields: [
          { key: 'tagline', label: 'Tagline', type: 'text' }
        ]
      },
      logo_scroll: {
        title: 'Logo Scroll Section',
        fields: [
          { key: 'title', label: 'Section Title', type: 'text' },
          { key: 'logo1_url', label: 'Brand Logo 1 (URL)', type: 'url' },
          { key: 'logo2_url', label: 'Brand Logo 2 (URL)', type: 'url' },
          { key: 'logo3_url', label: 'Brand Logo 3 (URL)', type: 'url' }
        ]
      },
      services: {
        title: 'Services Section',
        fields: [
          { key: 'title', label: 'Section Title', type: 'text' },
          { key: 'service1_title', label: 'Service 1 Title', type: 'text' },
          { key: 'service1_subtitle', label: 'Service 1 Description', type: 'text' },
          { key: 'service1_image', label: 'Service 1 Image (URL)', type: 'url' },
          { key: 'service2_title', label: 'Service 2 Title', type: 'text' },
          { key: 'service2_subtitle', label: 'Service 2 Description', type: 'text' },
          { key: 'service2_image', label: 'Service 2 Image (URL)', type: 'url' },
          { key: 'service3_title', label: 'Service 3 Title', type: 'text' },
          { key: 'service3_subtitle', label: 'Service 3 Description', type: 'text' },
          { key: 'service3_image', label: 'Service 3 Image (URL)', type: 'url' },
          { key: 'service4_title', label: 'Service 4 Title', type: 'text' },
          { key: 'service4_subtitle', label: 'Service 4 Description', type: 'text' },
          { key: 'service4_image', label: 'Service 4 Image (URL)', type: 'url' },
          { key: 'service5_title', label: 'Service 5 Title', type: 'text' },
          { key: 'service5_subtitle', label: 'Service 5 Description', type: 'text' },
          { key: 'service5_image', label: 'Service 5 Image (URL)', type: 'url' },
          { key: 'service6_title', label: 'Service 6 Title', type: 'text' },
          { key: 'service6_subtitle', label: 'Service 6 Description', type: 'text' },
          { key: 'service6_image', label: 'Service 6 Image (URL)', type: 'url' }
        ]
      },
      about: {
        title: 'About Section',
        fields: [
          { key: 'heading_line1', label: 'Heading Line 1', type: 'text' },
          { key: 'heading_line2', label: 'Heading Line 2', type: 'text' },
          { key: 'paragraph1', label: 'Paragraph 1', type: 'textarea' },
          { key: 'paragraph2', label: 'Paragraph 2', type: 'textarea' },
          { key: 'paragraph3', label: 'Paragraph 3', type: 'textarea' },
          { key: 'stat1_number', label: 'Stat 1 Number', type: 'text' },
          { key: 'stat1_label', label: 'Stat 1 Label', type: 'text' },
          { key: 'stat2_number', label: 'Stat 2 Number', type: 'text' },
          { key: 'stat2_label', label: 'Stat 2 Label', type: 'text' },
          { key: 'stat3_number', label: 'Stat 3 Number', type: 'text' },
          { key: 'stat3_label', label: 'Stat 3 Label', type: 'text' }
        ]
      },
      social: {
        title: 'Social Media Links',
        fields: [
          { key: 'twitter_handle', label: 'Twitter Handle', type: 'text' },
          { key: 'twitter_url', label: 'Twitter URL', type: 'url' },
          { key: 'instagram_handle', label: 'Instagram Handle', type: 'text' },
          { key: 'instagram_url', label: 'Instagram URL', type: 'url' },
          { key: 'linkedin_url', label: 'LinkedIn URL', type: 'url' }
        ]
      },
      footer: {
        title: 'Footer Section',
        fields: [
          { key: 'description', label: 'Company Description', type: 'textarea' },
          { key: 'email', label: 'Contact Email', type: 'text' },
          { key: 'phone', label: 'Phone Number', type: 'text' },
          { key: 'location', label: 'Location', type: 'text' }
        ]
      },
      branding: {
        title: 'Branding & Logos',
        fields: [
          { key: 'main_logo', label: 'Main Logo (URL)', type: 'url' },
          { key: 'favicon', label: 'Favicon (URL)', type: 'url' }
        ]
      }
    } : {
      hero: {
        title: 'Page Header',
        fields: [
          { key: 'title', label: 'Page Title', type: 'text' },
          { key: 'subtitle', label: 'Page Subtitle', type: 'text' }
        ]
      },
      form: {
        title: 'Form Labels',
        fields: [
          { key: 'submit_button', label: 'Submit Button Text', type: 'text' },
          { key: 'success_message', label: 'Success Message', type: 'text' }
        ]
      }
    };

    let html = '';
    for (const [sectionKey, sectionDef] of Object.entries(sections)) {
      html += `
        <div class="content-section">
          <h3 class="content-section-title">${sectionDef.title}</h3>
          ${sectionDef.fields.map(field => {
            const value = content[sectionKey]?.[field.key] || '';
            const inputType = field.type || 'text';
            
            if (inputType === 'textarea') {
              return `
                <div class="content-field">
                  <label for="content_${sectionKey}_${field.key}">
                    ${field.label}
                    <small>(${sectionKey})</small>
                  </label>
                  <textarea 
                    id="content_${sectionKey}_${field.key}"
                    data-page="${page}"
                    data-section="${sectionKey}"
                    data-key="${field.key}"
                    data-type="${inputType}"
                    placeholder="Enter ${field.label.toLowerCase()}"
                    rows="3"
                  >${value}</textarea>
                </div>
              `;
            } else if (inputType === 'url') {
              return `
                <div class="content-field">
                  <label for="content_${sectionKey}_${field.key}">
                    ${field.label}
                    <small>(${sectionKey})</small>
                  </label>
                  <div style="display: flex; gap: 8px; align-items: center;">
                    <input 
                      type="url" 
                      id="content_${sectionKey}_${field.key}"
                      data-page="${page}"
                      data-section="${sectionKey}"
                      data-key="${field.key}"
                      data-type="${inputType}"
                      value="${value}"
                      placeholder="https://..."
                      style="flex: 1;"
                    >
                    ${value ? `<img src="${value}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;" onerror="this.style.display='none'">` : ''}
                  </div>
                </div>
              `;
            } else {
              return `
                <div class="content-field">
                  <label for="content_${sectionKey}_${field.key}">
                    ${field.label}
                    <small>(${sectionKey})</small>
                  </label>
                  <input 
                    type="text" 
                    id="content_${sectionKey}_${field.key}"
                    data-page="${page}"
                    data-section="${sectionKey}"
                    data-key="${field.key}"
                    data-type="${inputType}"
                    value="${value}"
                    placeholder="Enter ${field.label.toLowerCase()}"
                  >
                </div>
              `;
            }
          }).join('')}
        </div>
      `;
    }

    form.innerHTML = html;
  }

  // Save all content
  async function saveContent() {
    const inputs = document.querySelectorAll('#contentEditForm input, #contentEditForm textarea');
    const items = [];

    inputs.forEach(input => {
      const value = input.tagName === 'TEXTAREA' ? input.value : input.value;
      items.push({
        page: input.dataset.page,
        section: input.dataset.section,
        content_key: input.dataset.key,
        content_value: value,
        content_type: input.dataset.type || 'text'
      });
    });

    try {
      await api.post('/content/bulk', items);
      alert('Content saved successfully! Changes will reflect on the live site immediately.');
    } catch (error) {
      alert('Failed to save content');
    }
  }

  // Navigation
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      
      // Update active nav link
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Show corresponding page
      document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
      const pageEl = document.getElementById(`${page}Page`);
      if (pageEl) pageEl.classList.add('active');

      // Load content for content editor page
      if (page === 'content') {
        loadContent(selectedContentPage);
      }
      
      // Close mobile sidebar
      document.getElementById('sidebar')?.classList.remove('active');
    });
  });

  // Content page selection
  document.querySelectorAll('.content-page-list li').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.content-page-list li').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      selectedContentPage = item.dataset.page;
      loadContent(selectedContentPage);
    });
  });

  // Filters
  const statusFilter = document.getElementById('statusFilter');
  const sourceFilter = document.getElementById('sourceFilter');
  const searchInput = document.getElementById('searchInput');

  if (statusFilter) {
    statusFilter.addEventListener('change', () => {
      loadInquiries({
        status: statusFilter.value,
        source: sourceFilter?.value,
        search: searchInput?.value
      });
    });
  }

  if (sourceFilter) {
    sourceFilter.addEventListener('change', () => {
      loadInquiries({
        status: statusFilter?.value,
        source: sourceFilter.value,
        search: searchInput?.value
      });
    });
  }

  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        loadInquiries({
          status: statusFilter?.value,
          source: sourceFilter?.value,
          search: searchInput.value
        });
      }, 300);
    });
  }

  // Refresh button
  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      loadDashboard();
    });
  }

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const csvContent = [
        ['Name', 'Email', 'Phone', 'Company', 'Job Title', 'Budget', 'Message', 'Source', 'Status', 'Date'].join(','),
        ...inquiries.map(i => [
          `"${i.first_name} ${i.last_name}"`,
          i.email,
          i.phone || '',
          `"${i.company || ''}"`,
          `"${i.job_title || ''}"`,
          i.budget || '',
          `"${(i.message || '').replace(/"/g, '""')}"`,
          i.source,
          i.status,
          i.created_at
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inquiries_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // Modal close buttons
  document.getElementById('modalClose')?.addEventListener('click', () => {
    document.getElementById('detailModal').classList.remove('active');
  });

  document.getElementById('modalCloseBtn')?.addEventListener('click', () => {
    document.getElementById('detailModal').classList.remove('active');
  });

  // Update status button
  document.getElementById('updateStatusBtn')?.addEventListener('click', async () => {
    if (!currentInquiry) return;

    const newStatus = document.getElementById('inquiryStatusSelect').value;
    try {
      await api.put(`/inquiries/${currentInquiry.id}`, { status: newStatus });
      document.getElementById('detailModal').classList.remove('active');
      loadInquiries();
      loadStats();
    } catch (error) {
      alert('Failed to update status');
    }
  });

  // Add user button
  document.getElementById('addUserBtn')?.addEventListener('click', () => {
    editingUserId = null;
    document.getElementById('userModalTitle').textContent = 'Add User';
    document.getElementById('userForm').reset();
    document.getElementById('userPassword').required = true;
    document.getElementById('userModal').classList.add('active');
  });

  // User modal close
  document.getElementById('userModalClose')?.addEventListener('click', () => {
    document.getElementById('userModal').classList.remove('active');
  });

  document.getElementById('userModalCloseBtn')?.addEventListener('click', () => {
    document.getElementById('userModal').classList.remove('active');
  });

  // Save user
  document.getElementById('saveUserBtn')?.addEventListener('click', async () => {
    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;
    const name = document.getElementById('userNameInput').value;
    const role = document.getElementById('userRoleSelect').value;

    if (!email || !name) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editingUserId) {
        const data = { email, name, role };
        if (password) data.password = password;
        await api.put(`/users/${editingUserId}`, data);
      } else {
        if (!password) {
          alert('Password is required for new users');
          return;
        }
        await api.post('/users', { email, password, name, role });
      }

      document.getElementById('userModal').classList.remove('active');
      loadUsers();
    } catch (error) {
      alert('Failed to save user');
    }
  });

  // Save content button
  document.getElementById('saveContentBtn')?.addEventListener('click', saveContent);

  // Gmail Connect Button - One-Click OAuth
  document.getElementById('gmailConnectBtn')?.addEventListener('click', () => {
    // Open Google OAuth in a popup
    const clientId = ''; // Would be configured in production
    const redirectUri = encodeURIComponent(window.location.origin + '/api/gmail/callback');
    const scope = encodeURIComponent('https://www.googleapis.com/auth/gmail.send');
    
    // For demo purposes, show a message about OAuth setup
    alert('Gmail OAuth Setup Required:\n\n1. Go to Google Cloud Console\n2. Create OAuth 2.0 credentials\n3. Add the Client ID and Secret to your Cloudflare environment variables\n4. The redirect URI will be: ' + window.location.origin + '/api/gmail/callback\n\nOnce configured, clicking this button will open Google sign-in.');
    
    // In production, this would open the OAuth popup:
    // const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
    // window.open(oauthUrl, 'gmail-oauth', 'width=500,height=600');
  });
  
  // Gmail Disconnect Button
  document.getElementById('gmailDisconnectBtn')?.addEventListener('click', async () => {
    if (!confirm('Are you sure you want to disconnect Gmail?')) return;
    
    try {
      await api.put('/email-settings', { is_active: false, gmail_email: '' });
      showGmailNotConnected();
    } catch (error) {
      alert('Failed to disconnect Gmail');
    }
  });

  // Email settings form
  document.getElementById('emailSettingsForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      gmail_email: document.getElementById('notificationEmail')?.value || '',
      is_active: document.getElementById('emailActive')?.checked || false
    };

    try {
      await api.put('/email-settings', data);
      alert('Email settings saved successfully!');
      
      if (data.gmail_email && data.is_active) {
        showGmailConnected(data.gmail_email);
      }
    } catch (error) {
      alert('Failed to save email settings');
    }
  });

  // Logout
  document.getElementById('logoutBtn')?.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Ignore errors
    }
    localStorage.removeItem('fitup_token');
    localStorage.removeItem('fitup_user');
    window.location.href = '/admin';
  });

  // Mobile menu
  document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('active');
  });

  // Close sidebar on click outside (mobile)
  document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('sidebar');
    const mobileBtn = document.getElementById('mobileMenuBtn');
    if (sidebar && mobileBtn && window.innerWidth <= 1024) {
      if (!sidebar.contains(e.target) && !mobileBtn.contains(e.target)) {
        sidebar.classList.remove('active');
      }
    }
  });

  // Initialize
  checkAuth();

  console.log('fitup dashboard loaded');
});
