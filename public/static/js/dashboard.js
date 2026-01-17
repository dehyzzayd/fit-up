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
            No inquiries found
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
        document.getElementById('gmailEmail').value = settings.gmail_email || '';
        document.getElementById('emailActive').checked = settings.is_active === 1;
      }
    } catch (error) {
      console.error('Failed to load email settings:', error);
    }
  }

  // Load content for CMS
  async function loadContent(page = 'home') {
    try {
      const content = await api.get(`/content/${page}`);
      contentData[page] = content;
      renderContentEditor(page);
    } catch (error) {
      console.error('Failed to load content:', error);
    }
  }

  // Render content editor
  function renderContentEditor(page) {
    const form = document.getElementById('contentEditForm');
    if (!form) return;

    const content = contentData[page] || {};
    
    // Define editable sections for each page
    const sections = page === 'home' ? {
      hero: { title: 'Hero Section', fields: ['title', 'subtitle'] },
      about: { title: 'About Section', fields: ['stats_projects', 'stats_satisfaction', 'stats_years'] },
      services: { title: 'Services', fields: ['service1_title', 'service1_desc', 'service2_title', 'service2_desc'] },
      footer: { title: 'Footer', fields: ['email', 'phone', 'address'] }
    } : {
      header: { title: 'Page Header', fields: ['title', 'subtitle'] },
      footer: { title: 'Footer', fields: ['email', 'phone', 'address'] }
    };

    let html = '';
    for (const [sectionKey, sectionDef] of Object.entries(sections)) {
      html += `
        <div class="content-section">
          <h3 class="content-section-title">${sectionDef.title}</h3>
          ${sectionDef.fields.map(field => `
            <div class="content-field">
              <label for="content_${sectionKey}_${field}">
                ${field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                <small>(${sectionKey})</small>
              </label>
              <input 
                type="text" 
                id="content_${sectionKey}_${field}"
                data-page="${page}"
                data-section="${sectionKey}"
                data-key="${field}"
                value="${content[sectionKey]?.[field] || ''}"
                placeholder="Enter ${field.replace(/_/g, ' ')}"
              >
            </div>
          `).join('')}
        </div>
      `;
    }

    form.innerHTML = html;
  }

  // Save all content
  async function saveContent() {
    const inputs = document.querySelectorAll('#contentEditForm input');
    const items = [];

    inputs.forEach(input => {
      items.push({
        page: input.dataset.page,
        section: input.dataset.section,
        content_key: input.dataset.key,
        content_value: input.value,
        content_type: 'text'
      });
    });

    try {
      await api.post('/content/bulk', items);
      alert('Content saved successfully!');
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
        source: sourceFilter.value,
        search: searchInput.value
      });
    });
  }

  if (sourceFilter) {
    sourceFilter.addEventListener('change', () => {
      loadInquiries({
        status: statusFilter.value,
        source: sourceFilter.value,
        search: searchInput.value
      });
    });
  }

  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        loadInquiries({
          status: statusFilter.value,
          source: sourceFilter.value,
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

  // Email settings form
  document.getElementById('emailSettingsForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      gmail_email: document.getElementById('gmailEmail').value,
      gmail_client_id: document.getElementById('gmailClientId').value,
      gmail_client_secret: document.getElementById('gmailClientSecret').value,
      gmail_refresh_token: document.getElementById('gmailRefreshToken').value,
      is_active: document.getElementById('emailActive').checked
    };

    try {
      await api.put('/email-settings', data);
      alert('Email settings saved successfully!');
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
