// Dashboard JavaScript - fitup Admin Dashboard
document.addEventListener('DOMContentLoaded', () => {
  // Helper function to escape HTML - MUST be at top for hoisting
  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // State
  let currentUser = null;
  let inquiries = [];
  let users = [];
  let contentData = {};
  let selectedContentPage = 'home';
  let currentInquiry = null;
  let editingUserId = null;
  let menuItems = [];
  let blogPosts = [];
  let formFields = [];

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
      loadMenuItems(),
      loadBlogPosts(),
      loadFormFields()
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

  // ==================== MENU EDITOR ====================
  
  // Default menu items
  const defaultMenuItems = [
    { id: 1, label: 'Home', url: '/', type: 'internal', order: 1 },
    { id: 2, label: 'Services', url: '#services', type: 'anchor', order: 2 },
    { id: 3, label: 'About', url: '#about', type: 'anchor', order: 3 },
    { id: 4, label: 'Blog', url: '/blog', type: 'internal', order: 4 },
    { id: 5, label: 'Contact', url: '/contact', type: 'internal', order: 5 }
  ];

  async function loadMenuItems() {
    try {
      const content = await api.get('/content/home');
      const menuStr = content?.menu?.items;
      if (menuStr) {
        menuItems = typeof menuStr === 'string' ? JSON.parse(menuStr) : menuStr;
      } else {
        menuItems = [...defaultMenuItems];
      }
    } catch (error) {
      menuItems = [...defaultMenuItems];
    }
    renderMenuItems();
  }

  function renderMenuItems() {
    const container = document.getElementById('menuItemsList');
    if (!container) return;
    
    if (menuItems.length === 0) {
      container.innerHTML = '<p class="blog-empty">No menu items. Click "Add Menu Item" to create one.</p>';
      return;
    }
    
    container.innerHTML = menuItems.map((item, index) => `
      <div class="menu-item-card" data-index="${index}">
        <div class="menu-item-drag">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/>
            <circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>
          </svg>
        </div>
        <div class="menu-item-inputs">
          <input type="text" class="menu-label" value="${escapeHtml(item.label)}" placeholder="Label">
          <input type="text" class="menu-url" value="${escapeHtml(item.url)}" placeholder="URL (e.g., /page or #section)">
          <select class="menu-type">
            <option value="internal" ${item.type === 'internal' ? 'selected' : ''}>Page</option>
            <option value="anchor" ${item.type === 'anchor' ? 'selected' : ''}>Section</option>
            <option value="external" ${item.type === 'external' ? 'selected' : ''}>External</option>
          </select>
        </div>
        <button class="menu-item-delete" title="Delete">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    `).join('');
    
    initMenuItemListeners();
  }

  function initMenuItemListeners() {
    document.querySelectorAll('.menu-item-card').forEach(card => {
      const index = parseInt(card.dataset.index);
      
      card.querySelector('.menu-label').oninput = (e) => {
        menuItems[index].label = e.target.value;
      };
      
      card.querySelector('.menu-url').oninput = (e) => {
        menuItems[index].url = e.target.value;
      };
      
      card.querySelector('.menu-type').onchange = (e) => {
        menuItems[index].type = e.target.value;
      };
      
      card.querySelector('.menu-item-delete').onclick = () => {
        menuItems.splice(index, 1);
        renderMenuItems();
      };
    });
  }

  async function saveMenu() {
    try {
      await api.post('/content/bulk', [{
        page: 'home',
        section: 'menu',
        content_key: 'items',
        content_value: JSON.stringify(menuItems),
        content_type: 'json'
      }]);
      alert('Menu saved successfully!');
    } catch (error) {
      alert('Failed to save menu');
    }
  }

  // ==================== BLOG POSTS ====================

  const defaultBlogPosts = [];

  async function loadBlogPosts() {
    try {
      const result = await api.get('/blog');
      blogPosts = result.posts || [];
    } catch (error) {
      blogPosts = [];
    }
    renderBlogPosts();
  }

  function renderBlogPosts() {
    const container = document.getElementById('blogPostsList');
    if (!container) return;
    
    if (blogPosts.length === 0) {
      container.innerHTML = '<p class="blog-empty">No blog posts yet. Click "New Post" to create your first article.</p>';
      return;
    }
    
    container.innerHTML = blogPosts.map(post => `
      <div class="blog-post-card" data-id="${post.id}">
        <div class="blog-post-image">
          ${post.image ? `<img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}">` : ''}
        </div>
        <div class="blog-post-content">
          <h4 class="blog-post-title">${escapeHtml(post.title)}</h4>
          <p class="blog-post-excerpt">${escapeHtml(post.excerpt || '')}</p>
          <div class="blog-post-meta">
            ${post.published ? '✓ Published' : '○ Draft'} · ${new Date(post.created_at).toLocaleDateString()}
          </div>
        </div>
        <div class="blog-post-actions">
          <button class="btn btn-secondary btn-sm edit-blog-btn">Edit</button>
          <button class="btn btn-secondary btn-sm delete-blog-btn" style="color: #dc3545;">Delete</button>
        </div>
      </div>
    `).join('');
    
    initBlogListeners();
  }

  function initBlogListeners() {
    document.querySelectorAll('.edit-blog-btn').forEach(btn => {
      btn.onclick = () => {
        const id = btn.closest('.blog-post-card').dataset.id;
        openBlogEditor(id);
      };
    });
    
    document.querySelectorAll('.delete-blog-btn').forEach(btn => {
      btn.onclick = async () => {
        const id = btn.closest('.blog-post-card').dataset.id;
        if (confirm('Delete this blog post?')) {
          await api.delete(`/blog/${id}`);
          loadBlogPosts();
        }
      };
    });
  }

  function openBlogEditor(id = null) {
    const post = id ? blogPosts.find(p => p.id == id) : { title: '', content: '', excerpt: '', image: '', published: false };
    
    const modal = document.getElementById('detailModal');
    const modalBody = document.getElementById('modalBody');
    const modalTitle = document.querySelector('.modal-title');
    
    modalTitle.textContent = id ? 'Edit Blog Post' : 'New Blog Post';
    modalBody.innerHTML = `
      <form id="blogEditForm">
        <div class="form-group">
          <label>Title</label>
          <input type="text" id="blogTitle" value="${escapeHtml(post.title || '')}" required>
        </div>
        <div class="form-group">
          <label>Excerpt (short description)</label>
          <textarea id="blogExcerpt" rows="2">${escapeHtml(post.excerpt || '')}</textarea>
        </div>
        <div class="form-group">
          <label>Featured Image URL</label>
          <input type="url" id="blogImage" value="${escapeHtml(post.image || '')}" placeholder="https://...">
        </div>
        <div class="form-group">
          <label>Content</label>
          <textarea id="blogContent" rows="10" style="font-family: inherit;">${escapeHtml(post.content || '')}</textarea>
        </div>
        <div class="form-group checkbox-group">
          <label>
            <input type="checkbox" id="blogPublished" ${post.published ? 'checked' : ''}>
            Publish this post
          </label>
        </div>
        <input type="hidden" id="blogId" value="${id || ''}">
      </form>
    `;
    
    // Update modal footer
    const modalFooter = document.querySelector('.modal-footer');
    modalFooter.innerHTML = `
      <button class="btn btn-secondary" id="modalCloseBtn">Cancel</button>
      <button class="btn btn-primary" id="saveBlogBtn">Save Post</button>
    `;
    
    document.getElementById('modalCloseBtn').onclick = () => modal.classList.remove('active');
    document.getElementById('saveBlogBtn').onclick = saveBlogPost;
    
    modal.classList.add('active');
  }

  async function saveBlogPost() {
    const id = document.getElementById('blogId').value;
    const data = {
      title: document.getElementById('blogTitle').value,
      excerpt: document.getElementById('blogExcerpt').value,
      image: document.getElementById('blogImage').value,
      content: document.getElementById('blogContent').value,
      published: document.getElementById('blogPublished').checked
    };
    
    try {
      if (id) {
        await api.put(`/blog/${id}`, data);
      } else {
        await api.post('/blog', data);
      }
      document.getElementById('detailModal').classList.remove('active');
      loadBlogPosts();
      alert('Blog post saved!');
    } catch (error) {
      alert('Failed to save blog post');
    }
  }

  // ==================== FORM FIELDS ====================

  const defaultFormFields = [
    { id: 1, name: 'first_name', label: 'First Name', type: 'text', required: true, order: 1 },
    { id: 2, name: 'last_name', label: 'Last Name', type: 'text', required: true, order: 2 },
    { id: 3, name: 'email', label: 'Email', type: 'email', required: true, order: 3 },
    { id: 4, name: 'phone', label: 'Phone', type: 'tel', required: false, order: 4 },
    { id: 5, name: 'company', label: 'Company', type: 'text', required: false, order: 5 },
    { id: 6, name: 'message', label: 'Message', type: 'textarea', required: true, order: 6 }
  ];

  async function loadFormFields() {
    try {
      const content = await api.get('/content/contact');
      const fieldsStr = content?.form?.fields;
      if (fieldsStr) {
        formFields = typeof fieldsStr === 'string' ? JSON.parse(fieldsStr) : fieldsStr;
      } else {
        formFields = [...defaultFormFields];
      }
    } catch (error) {
      formFields = [...defaultFormFields];
    }
    renderFormFields();
  }

  function renderFormFields() {
    const container = document.getElementById('formFieldsList');
    if (!container) return;
    
    container.innerHTML = formFields.map((field, index) => `
      <div class="form-field-card" data-index="${index}">
        <div class="form-field-drag">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/>
            <circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>
          </svg>
        </div>
        <div class="form-field-inputs">
          <input type="text" class="field-label" value="${escapeHtml(field.label)}" placeholder="Field Label">
          <input type="text" class="field-name" value="${escapeHtml(field.name)}" placeholder="field_name">
          <select class="field-type">
            <option value="text" ${field.type === 'text' ? 'selected' : ''}>Text</option>
            <option value="email" ${field.type === 'email' ? 'selected' : ''}>Email</option>
            <option value="tel" ${field.type === 'tel' ? 'selected' : ''}>Phone</option>
            <option value="textarea" ${field.type === 'textarea' ? 'selected' : ''}>Text Area</option>
            <option value="select" ${field.type === 'select' ? 'selected' : ''}>Dropdown</option>
          </select>
          <label>
            <input type="checkbox" class="field-required" ${field.required ? 'checked' : ''}>
            Required
          </label>
        </div>
        <button class="form-field-delete" title="Delete">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    `).join('');
    
    initFormFieldListeners();
  }

  function initFormFieldListeners() {
    document.querySelectorAll('.form-field-card').forEach(card => {
      const index = parseInt(card.dataset.index);
      
      card.querySelector('.field-label').oninput = (e) => {
        formFields[index].label = e.target.value;
        // Auto-generate name from label
        formFields[index].name = e.target.value.toLowerCase().replace(/\\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        card.querySelector('.field-name').value = formFields[index].name;
      };
      
      card.querySelector('.field-name').oninput = (e) => {
        formFields[index].name = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
      };
      
      card.querySelector('.field-type').onchange = (e) => {
        formFields[index].type = e.target.value;
      };
      
      card.querySelector('.field-required').onchange = (e) => {
        formFields[index].required = e.target.checked;
      };
      
      card.querySelector('.form-field-delete').onclick = () => {
        formFields.splice(index, 1);
        renderFormFields();
      };
    });
  }

  async function saveFormFields() {
    try {
      await api.post('/content/bulk', [{
        page: 'contact',
        section: 'form',
        content_key: 'fields',
        content_value: JSON.stringify(formFields),
        content_type: 'json'
      }]);
      alert('Form fields saved successfully!');
    } catch (error) {
      alert('Failed to save form fields');
    }
  }

  // ==================== CMS CONTENT EDITOR ====================

  // Define ALL editable sections - COMPREHENSIVE with defaults from HTML
  const contentSections = {
    home: {
      hero: { 
        title: 'Hero Section', 
        fields: [
          { key: 'tagline', label: 'Tagline', type: 'text', default: 'Where Brands Win.' }
        ]
      },
      logo_scroll: {
        title: 'Logo Scroll Section',
        fields: [
          { key: 'title', label: 'Section Title', type: 'text', default: 'Brands We\'ve Worked With' }
        ],
        dynamicField: {
          key: 'logos',
          label: 'Brand Logos',
          type: 'logo_list',
          default: [
            { url: 'https://fedaura.ma/cdn/shop/files/Untitled_design_10_5944d3f3-9115-4fd0-b1ed-58c69bbc602f.png?height=72&v=1756045971', name: 'Fedaura', round: false },
            { url: 'https://instagram.fcmn3-1.fna.fbcdn.net/v/t51.2885-19/573221119_17946853287053011_813047376054832019_n.jpg', name: 'Brand 2', round: true },
            { url: 'https://i.ibb.co/VWs7tk3q/605997942-17850007239614033-1994629091166485047-n.jpg', name: 'fitup', round: true }
          ]
        }
      },
      custom_css: {
        title: 'Custom CSS',
        fields: [
          { key: 'enabled', label: 'Enable Custom CSS', type: 'checkbox', default: false },
          { key: 'code', label: 'Custom CSS Code', type: 'css', default: '/* Add your custom CSS here */\n\n/* Example:\n.hero-section {\n  background: linear-gradient(135deg, #000 0%, #333 100%);\n}\n*/' }
        ]
      },
      services: {
        title: 'Services Section',
        fields: [
          { key: 'title', label: 'Section Title', type: 'text', default: 'Our Services' },
          { key: 'service1_title', label: 'Service 1 Title', type: 'text', default: 'Strategic Consulting' },
          { key: 'service1_subtitle', label: 'Service 1 Description', type: 'text', default: 'Personalized marketing analysis & strategy' },
          { key: 'service1_image', label: 'Service 1 Image (URL)', type: 'url', default: 'https://i.ibb.co/3YdDVd9P/33aca89d-c4fe-43ff-a4ac-00e921a9213c.jpg' },
          { key: 'service2_title', label: 'Service 2 Title', type: 'text', default: 'Media Buying' },
          { key: 'service2_subtitle', label: 'Service 2 Description', type: 'text', default: 'Optimized advertising campaigns' },
          { key: 'service2_image', label: 'Service 2 Image (URL)', type: 'url', default: 'https://i.ibb.co/8nvv5vM2/dee359e2-f702-4a59-8baa-87df5600a300.jpg' },
          { key: 'service3_title', label: 'Service 3 Title', type: 'text', default: 'Video Production' },
          { key: 'service3_subtitle', label: 'Service 3 Description', type: 'text', default: 'Professional shooting & editing' },
          { key: 'service3_image', label: 'Service 3 Image (URL)', type: 'url', default: 'https://i.ibb.co/3PZvBNq/c23b0c50-f718-4df8-a5ec-ec1c9b337007.jpg' },
          { key: 'service4_title', label: 'Service 4 Title', type: 'text', default: 'Social Media Management' },
          { key: 'service4_subtitle', label: 'Service 4 Description', type: 'text', default: 'Expert community management' },
          { key: 'service4_image', label: 'Service 4 Image (URL)', type: 'url', default: 'https://i.ibb.co/Q7vnL5tC/87a60201-0539-4235-b157-d1d482767c17.jpg' },
          { key: 'service5_title', label: 'Service 5 Title', type: 'text', default: 'Graphic Design' },
          { key: 'service5_subtitle', label: 'Service 5 Description', type: 'text', default: 'Visual identity & creations' },
          { key: 'service5_image', label: 'Service 5 Image (URL)', type: 'url', default: 'https://i.ibb.co/G3FM7rqf/910362e8-26f4-4f29-b8c5-d81155a8fd59.jpg' },
          { key: 'service6_title', label: 'Service 6 Title', type: 'text', default: 'Data Analytics' },
          { key: 'service6_subtitle', label: 'Service 6 Description', type: 'text', default: 'Insights & detailed reports' },
          { key: 'service6_image', label: 'Service 6 Image (URL)', type: 'url', default: 'https://i.ibb.co/DPczL7XT/83a4fbb4-fd83-44ef-9071-4193c8ddbc82.jpg' }
        ]
      },
      about: {
        title: 'About Section',
        fields: [
          { key: 'heading_line1', label: 'Heading Line 1', type: 'text', default: 'About' },
          { key: 'heading_line2', label: 'Heading Line 2', type: 'text', default: 'Us' },
          { key: 'paragraph1', label: 'Paragraph 1', type: 'textarea', default: 'At fitup, we believe that every brand has a unique story waiting to be told. We\'re not just a marketing agency—we\'re your strategic partners in growth, dedicated to transforming your vision into measurable success.' },
          { key: 'paragraph2', label: 'Paragraph 2', type: 'textarea', default: 'Our team combines creative excellence with data-driven insights to craft campaigns that resonate with your audience and drive real results. From strategic consulting to full-scale media production, we handle every aspect of your brand\'s digital presence.' },
          { key: 'paragraph3', label: 'Paragraph 3', type: 'textarea', default: 'Based in Casablanca, Morocco, we\'ve helped businesses across industries elevate their brand, connect with their audience, and achieve sustainable growth. Whether you\'re a startup looking to make your mark or an established brand seeking fresh perspectives, we\'re here to help you win.' },
          { key: 'stat1_number', label: 'Stat 1 Number', type: 'text', default: '50+' },
          { key: 'stat1_label', label: 'Stat 1 Label', type: 'text', default: 'Projects Delivered' },
          { key: 'stat2_number', label: 'Stat 2 Number', type: 'text', default: '98%' },
          { key: 'stat2_label', label: 'Stat 2 Label', type: 'text', default: 'Client Satisfaction' },
          { key: 'stat3_number', label: 'Stat 3 Number', type: 'text', default: '5+' },
          { key: 'stat3_label', label: 'Stat 3 Label', type: 'text', default: 'Years Experience' }
        ]
      },
      social: {
        title: 'Social Media Links',
        fields: [
          { key: 'twitter_handle', label: 'Twitter Handle', type: 'text', default: '@fitup_ma' },
          { key: 'twitter_url', label: 'Twitter URL', type: 'url', default: 'https://twitter.com/fitup_ma' },
          { key: 'instagram_handle', label: 'Instagram Handle', type: 'text', default: '@fitup.ma' },
          { key: 'instagram_url', label: 'Instagram URL', type: 'url', default: 'https://instagram.com/fitup.ma' },
          { key: 'linkedin_url', label: 'LinkedIn URL', type: 'url', default: 'https://linkedin.com/company/fitup' }
        ]
      },
      footer: {
        title: 'Footer Section',
        fields: [
          { key: 'description', label: 'Company Description', type: 'textarea', default: 'Where brands win. We help businesses grow through strategic marketing, creative content, and data-driven decisions.' },
          { key: 'email', label: 'Contact Email', type: 'text', default: 'hello@fitup.ma' },
          { key: 'phone', label: 'Phone Number', type: 'text', default: '+212 6 00 00 00 00' },
          { key: 'location', label: 'Location', type: 'text', default: 'Casablanca, Morocco' }
        ]
      },
    branding: {
      title: 'Branding & Logos',
      fields: [
        { key: 'main_logo', label: 'Main Logo (URL)', type: 'url', default: 'https://i.ibb.co/VWs7tk3q/605997942-17850007239614033-1994629091166485047-n.jpg' },
        { key: 'favicon', label: 'Favicon (URL)', type: 'url', default: 'https://i.ibb.co/VWs7tk3q/605997942-17850007239614033-1994629091166485047-n.jpg' }
      ]
    }
  },
  contact: {
    hero: {
      title: 'Page Header',
      fields: [
        { key: 'title', label: 'Page Title', type: 'text', default: 'Prenez rendez-vous' },
        { key: 'subtitle', label: 'Page Subtitle', type: 'text', default: 'Choisissez un créneau qui vous convient' }
      ]
    },
    form: {
      title: 'Form Labels',
      fields: [
        { key: 'submit_button', label: 'Submit Button Text', type: 'text', default: 'Envoyer' },
        { key: 'success_message', label: 'Success Message', type: 'text', default: 'Merci ! Votre demande a été envoyée avec succès.' }
      ]
    }
  },
  gallerie: {
    header: {
      title: 'Gallery Header',
      fields: [
        { key: 'title', label: 'Page Title', type: 'text', default: 'moments captured' },
        { key: 'subtitle', label: 'Page Subtitle', type: 'textarea', default: 'A visual journey through style, culture, and timeless elegance. Each frame tells a story of authenticity and creative expression.' }
      ]
    },
    gallery: {
      title: 'Gallery Settings',
      fields: [
        { key: 'row1_label', label: 'Row 1 Label', type: 'text', default: 'Featured Collection' },
        { key: 'row2_label', label: 'Row 2 Label', type: 'text', default: 'L7erfa Collection' }
      ],
      dynamicField: {
        key: 'featured',
        label: 'Featured Gallery Items',
        type: 'gallery_list',
        default: [
          { id: 1, number: '01', image: 'https://fitup.ma/Mediafitup/uploads/services/20260121_181607_L7erfa.21-04-2024.jpg', tag: 'Culture', title: "L7erfa Day", description: 'April 21st, 2024. A day when culture met creativity in perfect harmony.', link: '#' },
          { id: 2, number: '02', image: 'https://fitup.ma/Mediafitup/uploads/services/20260121_181634_L7erfa_3.0...._morocco.jpg', tag: 'Style', title: 'Morocco 3.0', description: 'The next chapter of Moroccan style. Bold, authentic, and unapologetically unique.', link: '#' },
          { id: 3, number: '03', image: 'https://fitup.ma/Mediafitup/uploads/services/20260121_181607_L7erfa.21-04-2024.jpg', tag: 'Heritage', title: 'Tribal Roots', description: 'Ancient traditions meet modern expression. Where heritage becomes innovation.', link: '#' }
        ]
      }
    },
    board: {
      title: 'LED Board',
      fields: [
        { key: 'text', label: 'Board Text', type: 'text', default: "FITUP's Gallery" }
      ]
    }
  }
};

  // Load content for CMS
  async function loadContent(page = 'home') {
    try {
      const content = await api.get(`/content/${page}`);
      contentData[page] = content;
      renderContentEditor(page);
    } catch (error) {
      console.error('Failed to load content:', error);
      // Still render with defaults
      contentData[page] = {};
      renderContentEditor(page);
    }
  }

  // Render content editor with ALL editable fields and defaults
  function renderContentEditor(page) {
    const form = document.getElementById('contentEditForm');
    if (!form) return;

    const content = contentData[page] || {};
    const sections = contentSections[page] || {};

    let html = '';
    for (const [sectionKey, sectionDef] of Object.entries(sections)) {
      html += `
        <div class="content-section">
          <h3 class="content-section-title">${sectionDef.title}</h3>
          ${sectionDef.fields.map(field => renderField(page, sectionKey, field, content)).join('')}
          ${sectionDef.dynamicField ? renderDynamicField(page, sectionKey, sectionDef.dynamicField, content) : ''}
        </div>
      `;
    }

    form.innerHTML = html;
    
    // Add live preview for URL inputs
    form.querySelectorAll('input[type="url"]').forEach(input => {
      input.addEventListener('input', (e) => {
        const preview = e.target.parentElement.querySelector('.url-preview');
        if (preview) {
          const url = e.target.value;
          if (url) {
            preview.innerHTML = `<img src="${escapeHtml(url)}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentElement.innerHTML='<span style=\\'color:#999;font-size:10px;\\'>Invalid</span>'">`;
          } else {
            preview.innerHTML = '<span style="color:#999;font-size:10px;">No img</span>';
          }
        }
      });
    });
    
    // Initialize logo list functionality
    initLogoListHandlers();
  }
  
  // Render a single field
  function renderField(page, sectionKey, field, content) {
    const value = content[sectionKey]?.[field.key] ?? field.default ?? '';
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
          >${escapeHtml(value)}</textarea>
        </div>
      `;
    } else if (inputType === 'url') {
      return `
        <div class="content-field">
          <label for="content_${sectionKey}_${field.key}">
            ${field.label}
            <small>(${sectionKey})</small>
          </label>
          <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
            <input 
              type="url" 
              id="content_${sectionKey}_${field.key}"
              data-page="${page}"
              data-section="${sectionKey}"
              data-key="${field.key}"
              data-type="${inputType}"
              value="${escapeHtml(value)}"
              placeholder="https://..."
              style="flex: 1; min-width: 200px;"
            >
            <div class="url-preview" style="width: 50px; height: 50px; border-radius: 4px; overflow: hidden; background: #f0f0f0; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              ${value ? `<img src="${escapeHtml(value)}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentElement.innerHTML='<span style=\\'color:#999;font-size:10px;\\'>No img</span>'">` : '<span style="color:#999;font-size:10px;">No img</span>'}
            </div>
          </div>
        </div>
      `;
    } else if (inputType === 'checkbox') {
      const checked = value === true || value === 'true' || value === '1';
      return `
        <div class="content-field">
          <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
            <input 
              type="checkbox" 
              id="content_${sectionKey}_${field.key}"
              data-page="${page}"
              data-section="${sectionKey}"
              data-key="${field.key}"
              data-type="${inputType}"
              ${checked ? 'checked' : ''}
              style="width: 18px; height: 18px; cursor: pointer;"
            >
            ${field.label}
            <small>(${sectionKey})</small>
          </label>
        </div>
      `;
    } else if (inputType === 'css') {
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
            data-type="css"
            placeholder="/* Your custom CSS */"
            rows="12"
            style="font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; font-size: 13px; background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 6px; border: 1px solid #333; line-height: 1.5;"
          >${escapeHtml(value)}</textarea>
          <small style="color: #666; display: block; margin-top: 8px;">
            💡 Tip: Your custom CSS will be applied to the website. Use browser DevTools to inspect elements and find class names.
          </small>
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
            value="${escapeHtml(value)}"
            placeholder="Enter ${field.label.toLowerCase()}"
          >
        </div>
      `;
    }
  }
  
  // Render dynamic field (logo list)
  function renderDynamicField(page, sectionKey, dynamicField, content) {
    if (dynamicField.type === 'logo_list') {
      // Get logos from content or use defaults
      let logos = [];
      try {
        const logosStr = content[sectionKey]?.[dynamicField.key];
        if (logosStr) {
          logos = typeof logosStr === 'string' ? JSON.parse(logosStr) : logosStr;
        }
        if (!Array.isArray(logos) || logos.length === 0) {
          logos = dynamicField.default;
        }
      } catch (e) {
        logos = dynamicField.default;
      }
      
      return `
        <div class="content-field logo-list-container">
          <label>${dynamicField.label}</label>
          <div id="logoList" data-page="${page}" data-section="${sectionKey}" data-key="${dynamicField.key}">
            ${logos.map((logo, index) => renderLogoItem(logo, index)).join('')}
          </div>
          <button type="button" id="addLogoBtn" class="btn btn-secondary" style="margin-top: 12px;">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="margin-right: 6px;">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>
            Add Logo
          </button>
          <input type="hidden" 
            id="content_${sectionKey}_${dynamicField.key}"
            data-page="${page}"
            data-section="${sectionKey}"
            data-key="${dynamicField.key}"
            data-type="json"
            value='${escapeHtml(JSON.stringify(logos))}'>
        </div>
      `;
    }
    return '';
  }
  
  // Render a single logo item
  function renderLogoItem(logo, index) {
    return `
      <div class="logo-item-editor" data-index="${index}" style="display: flex; gap: 12px; align-items: center; padding: 12px; background: #f8f9fa; border-radius: 8px; margin-bottom: 10px; flex-wrap: wrap;">
        <div class="logo-preview" style="width: 60px; height: 60px; border-radius: ${logo.round ? '50%' : '8px'}; overflow: hidden; background: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid #ddd;">
          ${logo.url ? `<img src="${escapeHtml(logo.url)}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentElement.innerHTML='<span style=\\'color:#999;font-size:10px;\\'>No img</span>'">` : '<span style="color:#999;font-size:10px;">No img</span>'}
        </div>
        <div style="flex: 1; min-width: 200px;">
          <input type="url" class="logo-url-input" value="${escapeHtml(logo.url || '')}" placeholder="Logo URL (https://...)" style="width: 100%; margin-bottom: 6px; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
          <div style="display: flex; gap: 8px; align-items: center;">
            <input type="text" class="logo-name-input" value="${escapeHtml(logo.name || '')}" placeholder="Logo name" style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            <label style="display: flex; align-items: center; gap: 4px; cursor: pointer; white-space: nowrap;">
              <input type="checkbox" class="logo-round-input" ${logo.round ? 'checked' : ''} style="width: 16px; height: 16px;">
              Round
            </label>
          </div>
        </div>
        <button type="button" class="remove-logo-btn" style="background: #dc3545; color: white; border: none; border-radius: 4px; width: 32px; height: 32px; cursor: pointer; display: flex; align-items: center; justify-content: center;" title="Remove logo">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>
      </div>
    `;
  }
  
  // Initialize logo list handlers
  function initLogoListHandlers() {
    const addLogoBtn = document.getElementById('addLogoBtn');
    const logoList = document.getElementById('logoList');
    
    if (addLogoBtn && logoList) {
      // Add logo button
      addLogoBtn.addEventListener('click', () => {
        const newLogo = { url: '', name: '', round: false };
        const index = logoList.querySelectorAll('.logo-item-editor').length;
        logoList.insertAdjacentHTML('beforeend', renderLogoItem(newLogo, index));
        updateLogosHiddenInput();
        initLogoItemListeners();
      });
      
      // Initialize listeners for existing items
      initLogoItemListeners();
    }
  }
  
  // Initialize listeners for logo items
  function initLogoItemListeners() {
    const logoList = document.getElementById('logoList');
    if (!logoList) return;
    
    // Remove logo buttons
    logoList.querySelectorAll('.remove-logo-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.target.closest('.logo-item-editor').remove();
        updateLogosHiddenInput();
      };
    });
    
    // URL input change - update preview
    logoList.querySelectorAll('.logo-url-input').forEach(input => {
      input.oninput = (e) => {
        const preview = e.target.closest('.logo-item-editor').querySelector('.logo-preview');
        const url = e.target.value;
        if (preview) {
          if (url) {
            preview.innerHTML = `<img src="${escapeHtml(url)}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentElement.innerHTML='<span style=\\'color:#999;font-size:10px;\\'>Invalid</span>'">`;
          } else {
            preview.innerHTML = '<span style="color:#999;font-size:10px;">No img</span>';
          }
        }
        updateLogosHiddenInput();
      };
    });
    
    // Name input change
    logoList.querySelectorAll('.logo-name-input').forEach(input => {
      input.oninput = () => updateLogosHiddenInput();
    });
    
    // Round checkbox change - update preview border-radius
    logoList.querySelectorAll('.logo-round-input').forEach(input => {
      input.onchange = (e) => {
        const preview = e.target.closest('.logo-item-editor').querySelector('.logo-preview');
        if (preview) {
          preview.style.borderRadius = e.target.checked ? '50%' : '8px';
        }
        updateLogosHiddenInput();
      };
    });
  }
  
  // Update the hidden input with current logos data
  function updateLogosHiddenInput() {
    const logoList = document.getElementById('logoList');
    if (!logoList) return;
    
    const logos = [];
    logoList.querySelectorAll('.logo-item-editor').forEach(item => {
      logos.push({
        url: item.querySelector('.logo-url-input')?.value || '',
        name: item.querySelector('.logo-name-input')?.value || '',
        round: item.querySelector('.logo-round-input')?.checked || false
      });
    });
    
    const hiddenInput = document.querySelector(`#content_${logoList.dataset.section}_${logoList.dataset.key}`);
    if (hiddenInput) {
      hiddenInput.value = JSON.stringify(logos);
    }
  }

  // Save all content
  async function saveContent() {
    const inputs = document.querySelectorAll('#contentEditForm input, #contentEditForm textarea');
    const items = [];

    inputs.forEach(input => {
      // Skip inputs without data attributes
      if (!input.dataset.page || !input.dataset.section || !input.dataset.key) return;
      
      // Skip logo item inputs (they're handled by the hidden input)
      if (input.classList.contains('logo-url-input') || 
          input.classList.contains('logo-name-input') || 
          input.classList.contains('logo-round-input')) return;
      
      let value;
      const inputType = input.dataset.type || 'text';
      
      if (input.type === 'checkbox') {
        value = input.checked ? 'true' : 'false';
      } else if (inputType === 'json') {
        value = input.value; // Already JSON string
      } else {
        value = input.tagName === 'TEXTAREA' ? input.value : input.value;
      }
      
      items.push({
        page: input.dataset.page,
        section: input.dataset.section,
        content_key: input.dataset.key,
        content_value: value,
        content_type: inputType
      });
    });

    if (items.length === 0) {
      alert('No content to save');
      return;
    }

    try {
      const result = await api.post('/content/bulk', items);
      if (result.success) {
        alert('Content saved successfully! Changes will reflect on the live site immediately.');
        // Reload content to confirm save
        loadContent(selectedContentPage);
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      console.error('Failed to save content:', error);
      alert('Failed to save content. Please try again.');
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

  // Export button - CSV export
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      if (inquiries.length === 0) {
        alert('No inquiries to export');
        return;
      }
      
      const csvContent = [
        ['Name', 'Email', 'Phone', 'Company', 'Job Title', 'Budget', 'Message', 'Source', 'Status', 'Date'].join(','),
        ...inquiries.map(i => [
          `"${(i.first_name + ' ' + i.last_name).replace(/"/g, '""')}"`,
          `"${(i.email || '').replace(/"/g, '""')}"`,
          `"${(i.phone || '').replace(/"/g, '""')}"`,
          `"${(i.company || '').replace(/"/g, '""')}"`,
          `"${(i.job_title || '').replace(/"/g, '""')}"`,
          `"${(i.budget || '').replace(/"/g, '""')}"`,
          `"${(i.message || '').replace(/"/g, '""')}"`,
          `"${(i.source || 'website').replace(/"/g, '""')}"`,
          `"${(i.status || 'new').replace(/"/g, '""')}"`,
          `"${i.created_at || ''}"`
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inquiries_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
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

  // ==================== NEW INQUIRY FORM ====================
  
  // Add inquiry button
  document.getElementById('addInquiryBtn')?.addEventListener('click', () => {
    document.getElementById('inquiryForm')?.reset();
    document.getElementById('inquiryModal')?.classList.add('active');
  });

  // Inquiry modal close
  document.getElementById('inquiryModalClose')?.addEventListener('click', () => {
    document.getElementById('inquiryModal')?.classList.remove('active');
  });

  document.getElementById('inquiryModalCloseBtn')?.addEventListener('click', () => {
    document.getElementById('inquiryModal')?.classList.remove('active');
  });

  // Save new inquiry
  document.getElementById('saveInquiryBtn')?.addEventListener('click', async () => {
    const firstName = document.getElementById('inquiryFirstName')?.value;
    const lastName = document.getElementById('inquiryLastName')?.value;
    const email = document.getElementById('inquiryEmail')?.value;
    const phone = document.getElementById('inquiryPhone')?.value;
    const company = document.getElementById('inquiryCompany')?.value;
    const jobTitle = document.getElementById('inquiryJobTitle')?.value;
    const budget = document.getElementById('inquiryBudget')?.value;
    const message = document.getElementById('inquiryMessage')?.value;
    const source = document.getElementById('inquirySource')?.value;

    if (!firstName || !lastName || !email) {
      alert('First name, last name, and email are required');
      return;
    }

    try {
      const result = await api.post('/inquiries', {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        company,
        job_title: jobTitle,
        budget,
        message,
        source: source || 'dashboard'
      });

      if (result.success || result.id) {
        document.getElementById('inquiryModal')?.classList.remove('active');
        loadInquiries();
        loadStats();
        alert('Inquiry added successfully!');
      } else {
        throw new Error('Failed to create inquiry');
      }
    } catch (error) {
      console.error('Failed to create inquiry:', error);
      alert('Failed to add inquiry. Please try again.');
    }
  });

  // ==================== USER MANAGEMENT ====================

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

  // Menu Editor buttons
  document.getElementById('addMenuItemBtn')?.addEventListener('click', () => {
    const newItem = {
      id: Date.now(),
      label: 'New Item',
      url: '/',
      type: 'internal',
      order: menuItems.length + 1
    };
    menuItems.push(newItem);
    renderMenuItems();
  });
  
  document.getElementById('saveMenuBtn')?.addEventListener('click', saveMenu);

  // Blog buttons
  document.getElementById('addBlogPostBtn')?.addEventListener('click', () => {
    openBlogEditor();
  });

  // Form Fields buttons
  document.getElementById('addFormFieldBtn')?.addEventListener('click', () => {
    const newField = {
      id: Date.now(),
      name: 'new_field',
      label: 'New Field',
      type: 'text',
      required: false,
      order: formFields.length + 1
    };
    formFields.push(newField);
    renderFormFields();
  });
  
  document.getElementById('saveFormFieldsBtn')?.addEventListener('click', saveFormFields);

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
