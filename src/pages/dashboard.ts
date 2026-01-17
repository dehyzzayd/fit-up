// Dashboard Page - Exact pixel-perfect reproduction of admin-dash.html
export function dashboardPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>fitup · Internal Dashboard</title>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/static/styles/dashboard.css">
</head>
<body>

  <!-- Sidebar -->
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-header">
      <a href="/" class="sidebar-logo">
        <img src="https://i.ibb.co/VWs7tk3q/605997942-17850007239614033-1994629091166485047-n.jpg" alt="fitup">
        <div class="sidebar-logo-text">
          <span class="sidebar-logo-name">fitup</span>
          <span class="sidebar-logo-label">Dashboard</span>
        </div>
      </a>
    </div>

    <nav class="sidebar-nav">
      <div class="nav-section">
        <div class="nav-section-title">Overview</div>
        <a href="#" class="nav-link active" data-page="dashboard">
          <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Dashboard
        </a>
        <a href="#" class="nav-link" data-page="inquiries">
          <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Inquiries
          <span class="badge" id="inquiryBadge">0</span>
        </a>
      </div>

      <div class="nav-section">
        <div class="nav-section-title">Manage</div>
        <a href="#" class="nav-link" data-page="content">
          <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Content Editor
        </a>
        <a href="#" class="nav-link" data-page="menu">
          <svg viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          Menu Editor
        </a>
        <a href="#" class="nav-link" data-page="blog">
          <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          Blog Posts
        </a>
        <a href="#" class="nav-link" data-page="forms">
          <svg viewBox="0 0 24 24"><path d="M9 11H3v10h6V11z"/><path d="M21 3h-6v18h6V3z"/><path d="M15 15H9v6h6v-6z"/><path d="M15 3H9v6h6V3z"/></svg>
          Form Fields
        </a>
        <a href="#" class="nav-link" data-page="users">
          <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Users
        </a>
      </div>

      <div class="nav-section">
        <div class="nav-section-title">Account</div>
        <a href="#" class="nav-link" id="logoutBtn">
          <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Logout
        </a>
      </div>
    </nav>

    <div class="sidebar-footer">
      <div class="user-info">
        <div class="user-avatar" id="userAvatar">AD</div>
        <div class="user-details">
          <div class="user-name" id="userName">Admin</div>
          <div class="user-role" id="userRole">Admin</div>
        </div>
      </div>
    </div>
  </aside>

  <!-- Main Content -->
  <main class="main-content">
    <!-- Mobile Header -->
    <div class="mobile-header">
      <button class="mobile-menu-btn" id="mobileMenuBtn">
        <svg viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <img src="https://i.ibb.co/VWs7tk3q/605997942-17850007239614033-1994629091166485047-n.jpg" alt="fitup" style="width: 32px; height: 32px; border-radius: 50%;">
    </div>

    <!-- Dashboard Page -->
    <div id="dashboardPage" class="page-content active">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Contact Inquiries</h1>
          <p class="page-subtitle">Track and manage incoming contact form submissions</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary" id="exportBtn">
            <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export
          </button>
          <button class="btn btn-primary" id="refreshBtn">
            <svg viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            Refresh
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-card-header">
            <div class="stat-icon green">
              <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <span class="stat-trend up" id="totalTrend">+0%</span>
          </div>
          <div class="stat-value" id="totalInquiries">0</div>
          <div class="stat-label">Total Inquiries</div>
        </div>

        <div class="stat-card">
          <div class="stat-card-header">
            <div class="stat-icon orange">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <span class="stat-trend up" id="weekTrend">+0</span>
          </div>
          <div class="stat-value" id="newThisWeek">0</div>
          <div class="stat-label">New This Week</div>
        </div>

        <div class="stat-card">
          <div class="stat-card-header">
            <div class="stat-icon blue">
              <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <span class="stat-trend up" id="contactedTrend">+0%</span>
          </div>
          <div class="stat-value" id="contactedCount">0</div>
          <div class="stat-label">Contacted</div>
        </div>

        <div class="stat-card">
          <div class="stat-card-header">
            <div class="stat-icon purple">
              <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <span class="stat-trend up" id="convertedTrend">+0%</span>
          </div>
          <div class="stat-value" id="convertedCount">0</div>
          <div class="stat-label">Converted</div>
        </div>
      </div>

      <!-- Inquiries Table -->
      <div class="table-container">
        <div class="table-header">
          <h2 class="table-title">Recent Inquiries</h2>
          <div class="table-filters">
            <select class="filter-select" id="statusFilter">
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
              <option value="closed">Closed</option>
            </select>
            <select class="filter-select" id="sourceFilter">
              <option value="">All Sources</option>
              <option value="website">Website</option>
              <option value="instagram">Instagram</option>
              <option value="twitter">Twitter</option>
              <option value="referral">Referral</option>
            </select>
            <input type="text" class="search-input" placeholder="Search inquiries..." id="searchInput">
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Contact</th>
              <th>Message</th>
              <th>Source</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="inquiriesTableBody">
            <!-- Loading state -->
            <tr>
              <td colspan="6" style="text-align: center; padding: 40px; color: #86868b;">
                Loading inquiries...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Inquiries Page (full inquiries view) -->
    <div id="inquiriesPage" class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">All Inquiries</h1>
          <p class="page-subtitle">View and manage all contact form submissions</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary" id="exportBtn2">
            <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export CSV
          </button>
          <button class="btn btn-primary" id="addInquiryBtn">
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Inquiry
          </button>
        </div>
      </div>

      <div class="table-container">
        <div class="table-header">
          <h2 class="table-title">All Inquiries</h2>
          <div class="table-filters">
            <select class="filter-select" id="statusFilter2">
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
              <option value="closed">Closed</option>
            </select>
            <select class="filter-select" id="sourceFilter2">
              <option value="">All Sources</option>
              <option value="website">Website</option>
              <option value="instagram">Instagram</option>
              <option value="twitter">Twitter</option>
              <option value="referral">Referral</option>
              <option value="dashboard">Dashboard</option>
            </select>
            <input type="text" class="search-input" placeholder="Search..." id="searchInput2">
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Contact</th>
              <th>Message</th>
              <th>Source</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="inquiriesTableBody2">
            <!-- Will be populated by JS - same data as main table -->
          </tbody>
        </table>
      </div>
    </div>

    <!-- Content Editor Page -->
    <div id="contentPage" class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">Content Editor</h1>
          <p class="page-subtitle">Edit ALL website text, images, logos, and links - changes reflect instantly</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" id="saveContentBtn">
            <svg viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Save All Changes
          </button>
        </div>
      </div>

      <div class="content-editor-container">
        <div class="content-sidebar">
          <h3>Pages</h3>
          <ul class="content-page-list">
            <li class="active" data-page="home">Homepage</li>
            <li data-page="contact">Contact Page</li>
          </ul>
        </div>

        <div class="content-main">
          <div id="contentEditForm">
            <!-- Content fields will be loaded here -->
          </div>
        </div>
      </div>
    </div>

    <!-- Users Page -->
    <div id="usersPage" class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">User Management</h1>
          <p class="page-subtitle">Manage admin and viewer accounts</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" id="addUserBtn">
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add User
          </button>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="usersTableBody">
            <!-- Users will be populated by JavaScript -->
          </tbody>
        </table>
      </div>
    </div>

    <!-- Menu Editor Page -->
    <div id="menuPage" class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">Menu Editor</h1>
          <p class="page-subtitle">Manage navigation menu items for your website</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" id="addMenuItemBtn">
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Menu Item
          </button>
        </div>
      </div>

      <div class="settings-card">
        <h3>Main Navigation</h3>
        <p class="settings-description">Drag to reorder. These items appear in the top navigation and side menu.</p>
        
        <div id="menuItemsList" class="menu-items-list">
          <!-- Menu items will be populated by JavaScript -->
        </div>
        
        <button class="btn btn-primary" id="saveMenuBtn" style="margin-top: 20px;">Save Menu</button>
      </div>
    </div>

    <!-- Blog Posts Page -->
    <div id="blogPage" class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">Blog Posts</h1>
          <p class="page-subtitle">Create and manage blog articles</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" id="addBlogPostBtn">
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Post
          </button>
        </div>
      </div>

      <div class="settings-card">
        <h3>All Posts</h3>
        <div id="blogPostsList" class="blog-posts-list">
          <!-- Blog posts will be populated by JavaScript -->
        </div>
      </div>
    </div>

    <!-- Form Fields Page -->
    <div id="formsPage" class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">Contact Form Fields</h1>
          <p class="page-subtitle">Customize the fields on your contact form</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" id="addFormFieldBtn">
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Field
          </button>
        </div>
      </div>

      <div class="settings-card">
        <h3>Form Fields</h3>
        <p class="settings-description">Configure the fields that appear on your contact form. Drag to reorder.</p>
        
        <div id="formFieldsList" class="form-fields-list">
          <!-- Form fields will be populated by JavaScript -->
        </div>
        
        <button class="btn btn-primary" id="saveFormFieldsBtn" style="margin-top: 20px;">Save Fields</button>
      </div>
    </div>
  </main>

  <!-- Inquiry Detail Modal -->
  <div class="modal-overlay" id="detailModal">
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">Inquiry Details</h3>
        <button class="modal-close" id="modalClose">
          <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body" id="modalBody">
        <!-- Content populated by JS -->
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="modalCloseBtn">Close</button>
        <button class="btn btn-primary" id="updateStatusBtn">Update Status</button>
      </div>
    </div>
  </div>

  <!-- Add Inquiry Modal -->
  <div class="modal-overlay" id="inquiryModal">
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">Add New Inquiry</h3>
        <button class="modal-close" id="inquiryModalClose">
          <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <form id="inquiryForm">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-group">
              <label for="inquiryFirstName">First Name *</label>
              <input type="text" id="inquiryFirstName" name="first_name" placeholder="First name" required>
            </div>
            <div class="form-group">
              <label for="inquiryLastName">Last Name *</label>
              <input type="text" id="inquiryLastName" name="last_name" placeholder="Last name" required>
            </div>
          </div>
          <div class="form-group">
            <label for="inquiryEmail">Email *</label>
            <input type="email" id="inquiryEmail" name="email" placeholder="email@example.com" required>
          </div>
          <div class="form-group">
            <label for="inquiryPhone">Phone</label>
            <input type="tel" id="inquiryPhone" name="phone" placeholder="+212 6 00 00 00 00">
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-group">
              <label for="inquiryCompany">Company</label>
              <input type="text" id="inquiryCompany" name="company" placeholder="Company name">
            </div>
            <div class="form-group">
              <label for="inquiryJobTitle">Job Title</label>
              <input type="text" id="inquiryJobTitle" name="job_title" placeholder="Position">
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-group">
              <label for="inquiryBudget">Budget</label>
              <select id="inquiryBudget" name="budget">
                <option value="">Select budget</option>
                <option value="10000-25000">10,000 - 25,000 MAD</option>
                <option value="25000-50000">25,000 - 50,000 MAD</option>
                <option value="50000+">50,000+ MAD</option>
              </select>
            </div>
            <div class="form-group">
              <label for="inquirySource">Source</label>
              <select id="inquirySource" name="source">
                <option value="dashboard">Dashboard</option>
                <option value="website">Website</option>
                <option value="instagram">Instagram</option>
                <option value="twitter">Twitter</option>
                <option value="referral">Referral</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="inquiryMessage">Message</label>
            <textarea id="inquiryMessage" name="message" rows="4" placeholder="Enter inquiry message or notes..."></textarea>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="inquiryModalCloseBtn">Cancel</button>
        <button class="btn btn-primary" id="saveInquiryBtn">Add Inquiry</button>
      </div>
    </div>
  </div>

  <!-- Add User Modal -->
  <div class="modal-overlay" id="userModal">
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title" id="userModalTitle">Add User</h3>
        <button class="modal-close" id="userModalClose">
          <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <form id="userForm">
          <div class="form-group">
            <label for="userEmail">Email</label>
            <input type="email" id="userEmail" name="email" placeholder="user@email.com" required>
          </div>
          <div class="form-group">
            <label for="userPassword">Password</label>
            <input type="password" id="userPassword" name="password" placeholder="Enter password" required>
          </div>
          <div class="form-group">
            <label for="userNameInput">Name</label>
            <input type="text" id="userNameInput" name="name" placeholder="User name" required>
          </div>
          <div class="form-group">
            <label for="userRoleSelect">Role</label>
            <select id="userRoleSelect" name="role">
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="userModalCloseBtn">Cancel</button>
        <button class="btn btn-primary" id="saveUserBtn">Save User</button>
      </div>
    </div>
  </div>

  <script src="/static/js/dashboard.js"></script>
</body>
</html>`;
}
