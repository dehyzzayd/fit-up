<?php
// index.php
session_start();

// Simple auth check
$isLoggedIn = isset($_SESSION['fitup_logged_in']) && $_SESSION['fitup_logged_in'] === true;

// Base path for building URLs (works whether dashboard is in / or /media-dashboard)
$basePath = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/');
if ($basePath === '/') {
    $basePath = '';
}

// Categories: key => human label
$categories = [
    'services' => 'Services / Campaign visuals',
    'logos'    => 'Logos & brand system',
    'other'    => 'Other images & raw shots',
];

// List images inside uploads/<category>
function list_images_for_category($category) {
    $dir = __DIR__ . '/uploads/' . $category;
    $files = [];
    if (!is_dir($dir)) {
        return $files;
    }
    $allowedExt = ['jpg','jpeg','png','gif','webp','svg'];
    foreach (scandir($dir) as $file) {
        if ($file === '.' || $file === '..') continue;
        $path = $dir . '/' . $file;
        if (!is_file($path)) continue;
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        if (in_array($ext, $allowedExt, true)) {
            $files[] = $file;
        }
    }
    sort($files);
    return $files;
}

// Preload images per category if logged in
$imagesByCategory = [];
if ($isLoggedIn) {
    foreach ($categories as $key => $label) {
        $imagesByCategory[$key] = list_images_for_category($key);
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>FITUP · Media Dashboard</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <link href="https://fonts.googleapis.com/css2?family=Teko:wght@300;400;500&display=swap" rel="stylesheet">

  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --icon-saturate: 4;
      --icon-brightness: 1.2;
      --icon-scale: 3.2;
      --icon-opacity: 0.25;
      --border-width: 3;
      --border-blur: 0;
      --border-saturate: 3.2;
      --border-brightness: 2.3;
      --border-contrast: 2.3;
    }

    body, html {
      font-family: "Helvetica Neue", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      background: #f5f5f8;
      color: #0f172a;
      min-height: 100vh;
    }

    body {
      position: relative;
      overflow-x: hidden;
    }

    body::before {
      --size: 45px;
      --line: rgba(15,23,42,0.05);
      content: '';
      height: 100vh;
      width: 100vw;
      position: fixed;
      background:
        linear-gradient(90deg, var(--line) 1px, transparent 1px var(--size)) calc(var(--size) * 0.36) 50% / var(--size) var(--size),
        linear-gradient(var(--line) 1px, transparent 1px var(--size)) 0% calc(var(--size) * 0.32) / var(--size) var(--size);
      mask: linear-gradient(-20deg, transparent 50%, white);
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 0;
    }

    .shell {
      max-width: 1200px;
      margin: 0 auto;
      padding: 16px 20px 40px;
      position: relative;
      z-index: 1;
    }

    /* NAVBAR */
    .top-nav {
      position: sticky;
      top: 0;
      z-index: 20;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 18px;
      margin-bottom: 20px;
      border-radius: 999px;
      background: rgba(255,255,255,0.96);
      border: 1px solid #e2e8f0;
      box-shadow: 0 14px 40px rgba(15,23,42,0.12);
      backdrop-filter: blur(16px);
    }

    .nav-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .nav-logo-img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
      border: 1px solid #0f172a10;
    }

    .nav-title {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }

    .nav-title-main {
      font-family: 'Teko', sans-serif;
      font-size: 22px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }

    .nav-title-sub {
      font-size: 11px;
      color: #6b7280;
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .nav-status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: #6b7280;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #22c55e;
      box-shadow: 0 0 0 3px rgba(34,197,94,0.22);
    }

    .btn-ghost {
      border-radius: 999px;
      border: 1px solid #e5e7eb;
      background: #f9fafb;
      padding: 5px 12px;
      font-size: 11px;
      cursor: pointer;
      color: #111827;
      transition: background 0.15s ease-out, border-color 0.15s ease-out,
                  box-shadow 0.15s ease-out, transform 0.15s ease-out;
    }

    .btn-ghost:hover {
      background: #eff6ff;
      border-color: #3b82f6;
      box-shadow: 0 6px 18px rgba(59,130,246,0.25);
      transform: translateY(-1px);
    }

    .btn-primary {
      border-radius: 999px;
      border: 1px solid #111827;
      background: #111827;
      color: #f9fafb;
      padding: 6px 14px;
      font-size: 12px;
      cursor: pointer;
      transition: background 0.15s ease-out, transform 0.15s ease-out, box-shadow 0.15s ease-out;
    }

    .btn-primary:hover {
      background: #020617;
      box-shadow: 0 8px 24px rgba(15,23,42,0.4);
      transform: translateY(-1px);
    }

    /* PANELS / LAYOUT */
    .panel {
      background: #ffffff;
      border-radius: 16px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 16px 40px rgba(15,23,42,0.08);
      padding: 18px 18px 20px;
      margin-bottom: 18px;
    }

    .small-muted {
      font-size: 11px;
      color: #9ca3af;
      margin-top: 4px;
    }

    .mono-badge {
      font-family: var(--mono, ui-monospace, Menlo, Consolas, "SF Mono", "Roboto Mono", monospace);
      font-size: 11px;
      padding: 1px 5px;
      border-radius: 999px;
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
      color: #374151;
    }

    .upload-card {
      border-radius: 14px;
      border: 1px dashed #cbd5f5;
      background: #f9fafb;
      padding: 14px 14px;
      font-size: 13px;
      color: #4b5563;
    }

    .upload-heading {
      font-weight: 600;
      margin-bottom: 4px;
    }

    .form-row {
      margin-top: 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 12px;
    }

    label {
      font-weight: 500;
      color: #374151;
    }

    select, input[type="file"], input[type="password"] {
      width: 100%;
      padding: 7px 9px;
      border-radius: 8px;
      border: 1px solid #d1d5db;
      font-size: 12px;
      outline: none;
      background: #ffffff;
      transition: border-color 0.15s ease-out, box-shadow 0.15s ease-out, background 0.15s ease-out;
    }

    select:focus,
    input[type="file"]:focus,
    input[type="password"]:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 1px rgba(59,130,246,0.5);
      background: #f9fafb;
    }

    .tag-row {
      margin-top: 6px;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      font-size: 11px;
    }

    .tag-pill {
      border-radius: 999px;
      border: 1px solid #e2e8f0;
      padding: 2px 7px;
      background: #ffffff;
      color: #4b5563;
    }

    .section-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: #9ca3af;
      margin: 16px 2px 10px;
    }

    .card-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
    }

    /* Card styles */
    .card {
      -webkit-tap-highlight-color: transparent;
      width: 260px;
      aspect-ratio: 4 / 3;
      outline: 2px solid #e5e7eb;
      background: #fdfdfd;
      position: relative;
      border-radius: 12px;
      cursor: pointer;
      transition: translate 0.12s cubic-bezier(.645, .045, .355, 1),
                  scale 0.12s cubic-bezier(.645, .045, .355, 1);
      overflow: hidden;
    }

    .card-inner {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      gap: 0.5rem;
      border-radius: 12px;
      overflow: hidden;
      text-align: center;
      padding: 0 10px;
    }

    .card:active {
      translate: 0 1px;
      scale: 0.985;
    }

    .card::after {
      content: '';
      position: absolute;
      pointer-events: none;
      inset: 0;
      border-radius: inherit;
      border: calc(var(--border-width) * 1px) solid transparent;
      backdrop-filter:
        blur(calc(var(--border-blur) * 1px))
        saturate(var(--border-saturate))
        brightness(var(--border-brightness))
        contrast(var(--border-contrast));
      mask: linear-gradient(#fff 0 100%) border-box, linear-gradient(#fff 0 100%) padding-box;
      mask-composite: exclude;
      z-index: 2;
      clip-path: inset(0 round 12px);
      transform: translateZ(0);
    }

    .card-main-img {
      width: 96px;
      height: 96px;
      border-radius: 20px;
      object-fit: cover;
      z-index: 3;
      position: relative;
      border: 1px solid #e5e7eb;
      background: #f9fafb;
      user-select: none;
      pointer-events: none; /* so click passes to .card */
    }

    .card-halo {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      transform: translateZ(0);
      filter: url(#blur) saturate(var(--icon-saturate)) brightness(var(--icon-brightness));
      translate: calc(var(--pointer-x, -10) * 40cqi) calc(var(--pointer-y, -10) * 40cqh);
      scale: var(--icon-scale);
      opacity: var(--icon-opacity);
      will-change: transform, filter;
    }

    .card-halo img {
      width: 110px;
      height: 110px;
      object-fit: contain;
      user-select: none;
      pointer-events: none;
    }

    .card h3 {
      z-index: 4;
      position: relative;
      font-size: 14px;
      margin: 6px 0 0;
      user-select: none;
      color: #111827;
    }

    .card-caption {
      font-size: 11px;
      color: #6b7280;
      margin-top: 2px;
    }

    .badge-file {
      display: inline-block;
      padding: 1px 5px;
      border-radius: 6px;
      background: #eef2ff;
      border: 1px solid #e0e7ff;
      color: #4f46e5;
      font-size: 10px;
      margin-top: 3px;
      word-break: break-all;
    }

    /* Login card */
    .login-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 80px);
    }

    .login-card {
      max-width: 360px;
      width: 100%;
      background: #ffffff;
      border-radius: 14px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 16px 40px rgba(15,23,42,0.08);
      padding: 22px 22px 20px;
    }

    .login-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .login-sub {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 14px;
    }

    .error {
      font-size: 12px;
      color: #b91c1c;
      margin-bottom: 8px;
    }

    /* Toast */
    .toast {
      position: fixed;
      right: 20px;
      bottom: 20px;
      background: #111827;
      color: #f9fafb;
      border-radius: 999px;
      padding: 8px 14px;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 12px 30px rgba(15,23,42,0.5);
      opacity: 0;
      pointer-events: none;
      transform: translateY(10px);
      transition: opacity 0.15s ease-out, transform 0.15s ease-out;
      z-index: 30;
    }

    .toast-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #22c55e;
    }

    .toast.show {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0);
    }

    @media (max-width: 600px) {
      .card {
        width: 100%;
      }
    }

  </style>
</head>
<body>
<div class="shell">

  <div class="top-nav">
    <div class="nav-left">
      <img class="nav-logo-img"
           src="https://i.ibb.co/VWs7tk3q/605997942-17850007239614033-1994629091166485047-n.jpg"
           alt="FITUP">
      <div class="nav-title">
        <div class="nav-title-main">FITUP</div>
        <div class="nav-title-sub">Media Dashboard · Internal</div>
      </div>
    </div>
    <div class="nav-right">
      <?php if ($isLoggedIn): ?>
        <div class="nav-status">
          <span class="status-dot"></span>
          <span>Connected as admin</span>
        </div>
        <form action="logout.php" method="post" style="margin:0;">
          <button class="btn-ghost" type="submit">Log out</button>
        </form>
      <?php else: ?>
        <div class="nav-status">
          <span class="status-dot" style="background:#f97316;box-shadow:0 0 0 3px rgba(249,115,22,0.22);"></span>
          <span>Authentication required</span>
        </div>
      <?php endif; ?>
    </div>
  </div>

  <?php if (!$isLoggedIn): ?>
    <!-- LOGIN VIEW -->
    <div class="login-wrap">
      <div class="login-card">
        <div class="login-title">FITUP Media Access</div>
        <div class="login-sub">Enter your access code to open the dashboard.</div>

        <?php if (isset($_GET['error']) && $_GET['error'] === '1'): ?>
          <div class="error">Invalid access code.</div>
        <?php endif; ?>

        <form action="auth.php" method="post">
          <div class="form-row">
            <label for="access_code">Access Code</label>
            <input type="password" name="access_code" id="access_code" required placeholder="••••">
          </div>
          <button class="btn-primary" type="submit" style="margin-top:10px;">Enter dashboard</button>
        </form>

        <div class="small-muted" style="margin-top:12px;">
          Code is checked via SHA‑256 on the server (not stored in plain text).
        </div>
      </div>
    </div>

  <?php else: ?>
    <!-- DASHBOARD VIEW -->

    <!-- TOP: CATEGORY + UPLOAD ONLY -->
    <div class="panel">
      <div class="upload-card">
        <div class="upload-heading">Upload new media</div>
        <div style="font-size:12px;color:#6b7280;">
          Choose a category, select an image, and it will drop into that section below.
        </div>

        <form action="upload.php" method="post" enctype="multipart/form-data">
          <div class="form-row">
            <label for="category">Category</label>
            <select id="category" name="category">
              <option value="services">Services / Campaigns</option>
              <option value="logos">Logos &amp; Brand</option>
              <option value="other">Other Images</option>
            </select>
          </div>

          <div class="form-row">
            <label for="fileInput">Image file</label>
            <input type="file" id="fileInput" name="image" accept="image/*" required>
          </div>

          <div class="tag-row">
            <span class="tag-pill">Services</span>
            <span class="tag-pill">Logos</span>
            <span class="tag-pill">Gallery</span>
            <span class="tag-pill">Raw shots</span>
          </div>

          <button class="btn-primary" type="submit" style="margin-top:10px;">
            Upload to dashboard
          </button>
        </form>

        <div class="small-muted">
          Files are stored in <code>/uploads/services</code>, <code>/uploads/logos</code>, or <code>/uploads/other</code>.
        </div>
      </div>
    </div>

    <!-- SERVICES -->
    <div class="section-label"><?php echo htmlspecialchars($categories['services']); ?></div>
    <div class="panel">
      <div class="card-grid" id="servicesGrid">
        <?php foreach ($imagesByCategory['services'] as $file):
          $virtualPath = $basePath . '/uploads/services/' . rawurlencode($file);
        ?>
          <div class="card" data-src="<?php echo htmlspecialchars($virtualPath, ENT_QUOTES, 'UTF-8'); ?>">
            <div class="card-inner">
              <div class="card-halo">
                <img src="<?php echo htmlspecialchars($virtualPath, ENT_QUOTES, 'UTF-8'); ?>" alt="">
              </div>
              <img class="card-main-img"
                   src="<?php echo htmlspecialchars($virtualPath, ENT_QUOTES, 'UTF-8'); ?>"
                   alt="<?php echo htmlspecialchars($file, ENT_QUOTES, 'UTF-8'); ?>">
              <h3><?php echo htmlspecialchars($file, ENT_QUOTES, 'UTF-8'); ?></h3>
              <div class="card-caption">
                <div class="badge-file"><?php echo htmlspecialchars($virtualPath, ENT_QUOTES, 'UTF-8'); ?></div>
              </div>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    </div>

    <!-- LOGOS -->
    <div class="section-label"><?php echo htmlspecialchars($categories['logos']); ?></div>
    <div class="panel">
      <div class="card-grid" id="logosGrid">
        <?php foreach ($imagesByCategory['logos'] as $file):
          $virtualPath = $basePath . '/uploads/logos/' . rawurlencode($file);
        ?>
          <div class="card" data-src="<?php echo htmlspecialchars($virtualPath, ENT_QUOTES, 'UTF-8'); ?>">
            <div class="card-inner">
              <div class="card-halo">
                <img src="<?php echo htmlspecialchars($virtualPath, ENT_QUOTES, 'UTF-8'); ?>" alt="">
              </div>
              <img class="card-main-img"
                   src="<?php echo htmlspecialchars($virtualPath, ENT_QUOTES, 'UTF-8'); ?>"
                   alt="<?php echo htmlspecialchars($file, ENT_QUOTES, 'UTF-8'); ?>">
              <h3><?php echo htmlspecialchars($file, ENT_QUOTES, 'UTF-8'); ?></h3>
              <div class="card-caption">
                <div class="badge-file"><?php echo htmlspecialchars($virtualPath, ENT_QUOTES, 'UTF-8'); ?></div>
              </div>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    </div>

    <!-- OTHER -->
    <div class="section-label"><?php echo htmlspecialchars($categories['other']); ?></div>
    <div class="panel">
      <div class="card-grid" id="otherGrid">
        <?php foreach ($imagesByCategory['other'] as $file):
          $virtualPath = $basePath . '/uploads/other/' . rawurlencode($file);
        ?>
          <div class="card" data-src="<?php echo htmlspecialchars($virtualPath, ENT_QUOTES, 'UTF-8'); ?>">
            <div class="card-inner">
              <div class="card-halo">
                <img src="<?php echo htmlspecialchars($virtualPath, ENT_QUOTES, 'UTF-8'); ?>" alt="">
              </div>
              <img class="card-main-img"
                   src="<?php echo htmlspecialchars($virtualPath, ENT_QUOTES, 'UTF-8'); ?>"
                   alt="<?php echo htmlspecialchars($file, ENT_QUOTES, 'UTF-8'); ?>">
              <h3><?php echo htmlspecialchars($file, ENT_QUOTES, 'UTF-8'); ?></h3>
              <div class="card-caption">
                <div class="badge-file"><?php echo htmlspecialchars($virtualPath, ENT_QUOTES, 'UTF-8'); ?></div>
              </div>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    </div>

  <?php endif; ?>

</div>

<!-- Blur filter for halo effect -->
<svg class="sr-only" style="position:absolute;width:0;height:0;overflow:visible" xmlns="http://www.w3.org/2000/svg">
  <filter id="blur" width="500%" height="500%">
    <feGaussianBlur in="SourceGraphic" stdDeviation="22" />
  </filter>
</svg>

<!-- Toast -->
<div class="toast" id="toast">
  <span class="toast-dot"></span>
  <span id="toastText">Copied</span>
</div>

<script>
  const FITUP_BASE_URL = 'https://fitup.ma';
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toastText');

  function showToast(message) {
    toastText.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  }

  // Pointer-driven halo motion
  document.addEventListener('pointermove', (event) => {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const relativeX = event.clientX - centerX;
      const relativeY = event.clientY - centerY;

      const x = relativeX / (rect.width / 2);
      const y = relativeY / (rect.height / 2);

      card.style.setProperty('--pointer-x', x.toFixed(3));
      card.style.setProperty('--pointer-y', y.toFixed(3));
    });
  });

  // Click card to copy URL (works for all cards, including newly uploaded ones after reload)
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;

    let rawPath = card.dataset.src || '';
    if (!rawPath) {
      showToast('No URL to copy.');
      return;
    }

    let fullUrl;
    if (/^https?:\/\//i.test(rawPath)) {
      fullUrl = rawPath;
    } else if (rawPath.startsWith('/')) {
      fullUrl = FITUP_BASE_URL + rawPath;
    } else {
      fullUrl = FITUP_BASE_URL + '/' + rawPath.replace(/^\/+/, '');
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullUrl)
        .then(() => showToast('Copied: ' + fullUrl))
        .catch(() => showToast('Could not copy URL'));
    } else {
      showToast('Copy not supported in this browser');
    }
  });
</script>
</body>
</html>