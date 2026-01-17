// Login Page for Admin Dashboard
export function loginPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>fitup · Admin Login</title>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body, html {
      font-family: 'Roboto', 'Helvetica Neue', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: #000;
      min-height: 100vh;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .login-container {
      width: 100%;
      max-width: 400px;
      padding: 40px;
    }

    .login-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 40px;
    }

    .login-logo img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
    }

    .login-logo span {
      font-size: 18px;
      font-weight: 500;
      letter-spacing: 0.05em;
    }

    .login-title {
      font-size: 24px;
      font-weight: 300;
      text-align: center;
      margin-bottom: 8px;
    }

    .login-subtitle {
      text-align: center;
      color: rgba(255,255,255,0.5);
      font-size: 14px;
      margin-bottom: 40px;
    }

    .form-group {
      margin-bottom: 24px;
    }

    .form-group label {
      display: block;
      font-size: 11px;
      color: rgba(255,255,255,0.5);
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .form-group input {
      width: 100%;
      background: transparent;
      border: none;
      border-bottom: 1px solid rgba(255,255,255,0.2);
      padding: 12px 0;
      color: white;
      font-size: 16px;
      font-family: inherit;
      transition: all 0.3s ease;
    }

    .form-group input:focus {
      outline: none;
      border-bottom-color: #B8FF5C;
    }

    .form-group input::placeholder {
      color: rgba(255,255,255,0.3);
    }

    .login-btn {
      width: 100%;
      padding: 16px;
      background: #B8FF5C;
      color: #000;
      border: none;
      font-size: 14px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-top: 20px;
    }

    .login-btn:hover {
      background: #c9ff7d;
      transform: translateY(-2px);
      box-shadow: 0 10px 40px rgba(184, 255, 92, 0.2);
    }

    .login-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    .error-message {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #ef4444;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      margin-bottom: 20px;
      display: none;
    }

    .error-message.show {
      display: block;
    }

    .back-link {
      display: block;
      text-align: center;
      margin-top: 30px;
      color: rgba(255,255,255,0.5);
      font-size: 14px;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .back-link:hover {
      color: #B8FF5C;
    }
  </style>
</head>
<body>
  <div class="login-container">
    <div class="login-logo">
      <img src="https://i.ibb.co/VWs7tk3q/605997942-17850007239614033-1994629091166485047-n.jpg" alt="fitup">
      <span>fitup</span>
    </div>
    
    <h1 class="login-title">Admin Dashboard</h1>
    <p class="login-subtitle">Sign in to manage your inquiries</p>
    
    <div id="errorMessage" class="error-message"></div>
    
    <form id="loginForm">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" placeholder="admin@fitup.ma" required>
      </div>
      
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" placeholder="Enter your password" required>
      </div>
      
      <button type="submit" class="login-btn" id="loginBtn">Sign In</button>
    </form>
    
    <a href="/" class="back-link">← Back to website</a>
  </div>

  <script>
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const errorMessage = document.getElementById('errorMessage');
      const loginBtn = document.getElementById('loginBtn');
      
      errorMessage.classList.remove('show');
      loginBtn.disabled = true;
      loginBtn.textContent = 'Signing in...';
      
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Store token and redirect
          localStorage.setItem('fitup_token', data.token);
          localStorage.setItem('fitup_user', JSON.stringify(data.user));
          window.location.href = '/admin/dashboard';
        } else {
          errorMessage.textContent = data.error || 'Invalid credentials';
          errorMessage.classList.add('show');
        }
      } catch (error) {
        errorMessage.textContent = 'An error occurred. Please try again.';
        errorMessage.classList.add('show');
      } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Sign In';
      }
    });
    
    // Check if already logged in
    const token = localStorage.getItem('fitup_token');
    if (token) {
      fetch('/api/auth/verify', {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      }).then(res => {
        if (res.ok) {
          window.location.href = '/admin/dashboard';
        } else {
          localStorage.removeItem('fitup_token');
          localStorage.removeItem('fitup_user');
        }
      });
    }
  </script>
</body>
</html>`;
}
