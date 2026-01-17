// Home page - Pixel-perfect reproduction of Fitup-main.html
export function homePage(content: Record<string, Record<string, string>> = {}): string {
  // Helper to get content with fallback
  const getContent = (section: string, key: string, fallback: string): string => {
    return content[section]?.[key] || fallback;
  };

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
      padding: 0;
    }

    body, html {
      font-family: 'Helvetica Neue', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: #000;
      overflow-x: hidden;
      color: white;
    }

    /* Side Menu Overlay */
    .side-menu-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.4s ease, visibility 0.4s ease;
    }

    .side-menu-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    /* Side Menu */
    .side-menu {
      position: fixed;
      top: 0;
      right: 0;
      width: 400px;
      max-width: 90vw;
      height: 100%;
      background: #0a0a0a;
      z-index: 1001;
      transform: translateX(100%);
      transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
      display: flex;
      flex-direction: column;
    }

    .side-menu.active {
      transform: translateX(0);
    }

    .side-menu-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 32px 40px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .side-menu-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
      font-weight: 400;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: white;
    }

    .side-menu-logo img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    .side-menu-close {
      background: none;
      border: none;
      cursor: pointer;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .side-menu-close span {
      position: absolute;
      width: 24px;
      height: 1px;
      background: white;
      transition: opacity 0.3s ease;
    }

    .side-menu-close span:first-child {
      transform: rotate(45deg);
    }

    .side-menu-close span:last-child {
      transform: rotate(-45deg);
    }

    .side-menu-close:hover span {
      opacity: 0.6;
    }

    .side-menu-nav {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 40px;
    }

    .side-menu-link {
      font-size: 32px;
      font-weight: 300;
      color: white;
      text-decoration: none;
      padding: 20px 0;
      display: block;
      transition: all 0.3s ease;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }

    .side-menu-link:hover {
      color: #B8FF5C;
      padding-left: 20px;
    }

    .side-menu-footer {
      padding: 40px;
      border-top: 1px solid rgba(255,255,255,0.1);
    }

    .side-menu-social {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }

    .side-menu-social a {
      color: rgba(255,255,255,0.5);
      text-decoration: none;
      font-size: 14px;
      transition: color 0.3s ease;
    }

    .side-menu-social a:hover {
      color: #B8FF5C;
    }

    .side-menu-email {
      color: rgba(255,255,255,0.5);
      font-size: 14px;
    }

    .side-menu-email a {
      color: white;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .side-menu-email a:hover {
      color: #B8FF5C;
    }

    /* Hero Canvas */
    .webgl {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      z-index: 1;
    }

    #blackFadeOverlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #000;
      z-index: 2;
      opacity: 0;
      pointer-events: none;
    }

    .hero-section {
      position: relative;
      width: 100%;
      min-height: 100vh;
      overflow: hidden;
      z-index: 1;
    }

    .hero {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 0 20px;
      position: relative;
      z-index: 10;
      pointer-events: none;
    }

    /* Logo Scroll Section */
    .logo-scroll-section {
      position: relative;
      width: 100%;
      background: #000;
      padding: 60px 0;
      z-index: 10;
      overflow: hidden;
    }

    .logo-scroll-title {
      text-align: center;
      font-size: 14px;
      font-weight: 400;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.5);
      margin-bottom: 40px;
    }

    .logo-scroll-container {
      width: 100%;
      overflow: hidden;
      position: relative;
    }

    .logo-scroll-track {
      display: flex;
      align-items: center;
      gap: 80px;
      animation: scrollLogos 20s linear infinite;
      width: max-content;
    }

    .logo-scroll-track:hover {
      animation-play-state: paused;
    }

    @keyframes scrollLogos {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }

    .logo-item {
      flex-shrink: 0;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.7;
      transition: opacity 0.3s ease;
      filter: grayscale(100%) brightness(2);
    }

    .logo-item:hover {
      opacity: 1;
      filter: grayscale(0%) brightness(1);
    }

    .logo-item img {
      height: 100%;
      width: auto;
      object-fit: contain;
    }

    .logo-item.round img {
      border-radius: 50%;
      height: 50px;
      width: 50px;
      object-fit: cover;
    }

    /* Services Section - Expanding Cards */
    .services-section {
      position: relative;
      width: 100%;
      min-height: 100vh;
      background: #000;
      z-index: 10;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 80px 0;
    }

    .services-title {
      text-align: center;
      font-size: 14px;
      font-weight: 400;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.5);
      margin-bottom: 60px;
    }

    .options {
      display: flex;
      flex-direction: row;
      align-items: stretch;
      overflow: hidden;
      width: 100%;
      max-width: 1600px;
      padding: 0 20px;
      height: 500px;
    }

    .option {
      position: relative;
      overflow: hidden;
      min-width: 60px;
      margin: 10px;
      background-color: #111;
      cursor: pointer;
      border-radius: 20px;
      flex-grow: 1;
      transition: flex-grow 0.6s cubic-bezier(0.23, 1, 0.32, 1),
                  min-width 0.6s cubic-bezier(0.23, 1, 0.32, 1),
                  margin 0.6s cubic-bezier(0.23, 1, 0.32, 1),
                  border-radius 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    }

    .option-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1),
                  opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    }

    .option:nth-child(1) { --defaultBackground: #B8FF5C; }
    .option:nth-child(2) { --defaultBackground: #40E0D0; }
    .option:nth-child(3) { --defaultBackground: #0a0e27; }
    .option:nth-child(4) { --defaultBackground: #B8FF5C; }
    .option:nth-child(5) { --defaultBackground: #40E0D0; }
    .option:nth-child(6) { --defaultBackground: #0a0e27; }

    .option.active {
      flex-grow: 10000;
      min-width: 300px;
      margin: 0px;
      border-radius: 40px;
    }

    .option.active .option-image {
      transform: scale(1);
    }

    .option.active .shadow {
      opacity: 1;
    }

    .option.active .label {
      bottom: 30px;
      left: 30px;
      opacity: 1;
    }

    .option.active .label .info > div {
      transform: translateX(0);
      opacity: 1;
    }

    .option:not(.active) {
      flex-grow: 1;
      border-radius: 20px;
    }

    .option:not(.active) .option-image {
      transform: scale(1.1);
    }

    .option:not(.active) .shadow {
      opacity: 0.7;
    }

    .option:not(.active) .label {
      bottom: 15px;
      left: 15px;
      opacity: 1;
    }

    .option:not(.active) .label .info > div {
      transform: translateX(20px);
      opacity: 0;
    }

    .option .shadow {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 100%;
      background: linear-gradient(
        to top,
        rgba(0, 0, 0, 1) 0%,
        rgba(0, 0, 0, 0.95) 10%,
        rgba(0, 0, 0, 0.8) 25%,
        rgba(0, 0, 0, 0.4) 50%,
        rgba(0, 0, 0, 0) 100%
      );
      transition: opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1);
      pointer-events: none;
      z-index: 1;
    }

    .option .label {
      display: flex;
      position: absolute;
      right: 0;
      z-index: 2;
      transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    }

    .option .label .icon {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      min-width: 45px;
      max-width: 45px;
      height: 45px;
      border-radius: 50%;
      overflow: hidden;
      transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    }

    .option .label .icon img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .option:hover .label .icon {
      transform: scale(1.1);
    }

    .option .label .info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 15px;
      color: white;
      white-space: nowrap;
      overflow: hidden;
    }

    .option .label .info > div {
      transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1),
                  opacity 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    }

    .option .label .info .main {
      font-weight: 700;
      font-size: 1.3rem;
      font-family: 'Roboto', sans-serif;
      text-shadow: 0 2px 10px rgba(0,0,0,0.5);
    }

    .option .label .info .sub {
      font-family: 'Roboto', sans-serif;
      font-size: 0.95rem;
      font-weight: 400;
      opacity: 0.85;
      margin-top: 4px;
      text-shadow: 0 2px 10px rgba(0,0,0,0.5);
      transition-delay: 0.05s;
    }

    /* Game Section */
    .game-section {
      position: relative;
      width: 100%;
      min-height: 100vh;
      background: #000;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
    }

    .game-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      max-width: 1400px;
      width: 100%;
      align-items: center;
    }

    .game-left {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .game-svg {
      width: 100%;
      max-width: 320px;
      font-family: "Rubik Mono One", monospace;
      font-size: 32px;
      cursor: pointer;
      transition: transform 0.3s ease;
    }

    .game-svg:hover {
      transform: scale(1.02);
    }

    .game-svg.clicked {
      pointer-events: none;
    }

    .game-right {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .animation-stage {
      position: relative;
      width: 100%;
      max-width: 400px;
      height: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      margin-bottom: 40px;
    }

    .animation-bg {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .animation-word, .animation-clone {
      position: relative;
      background: #000;
      font-family: "Comfortaa", sans-serif;
      font-size: 36px;
      line-height: 40px;
      padding-top: 5px;
      box-shadow: 0px 0px 15px #000;
      color: #B8FF5C;
      font-weight: 500;
    }

    .game-cta-text {
      font-size: 24px;
      font-weight: 300;
      margin-bottom: 20px;
      color: rgba(255,255,255,0.9);
      letter-spacing: 0.02em;
    }

    .game-cta-subtext {
      font-size: 14px;
      color: rgba(255,255,255,0.5);
      margin-bottom: 30px;
      letter-spacing: 0.05em;
    }

    .game-win-message {
      display: none;
      flex-direction: column;
      align-items: center;
      animation: fadeInUp 0.5s ease;
    }

    .game-win-message.show {
      display: flex;
    }

    .game-win-title {
      font-size: 32px;
      font-weight: 700;
      color: #B8FF5C;
      margin-bottom: 15px;
    }

    .game-win-subtitle {
      font-size: 16px;
      color: rgba(255,255,255,0.7);
      margin-bottom: 30px;
    }

    .claim-btn {
      display: inline-block;
      padding: 16px 40px;
      background: #B8FF5C;
      color: #000;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      transition: all 0.3s ease;
    }

    .claim-btn:hover {
      background: #c9ff7d;
      transform: translateY(-2px);
      box-shadow: 0 10px 40px rgba(184, 255, 92, 0.3);
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* About Section */
    .about-transition-section {
      position: relative;
      width: 100%;
      min-height: auto;
      background: #fff;
      z-index: 10;
      overflow: visible;
      margin-top: 180px;
    }

    .curve-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 300px;
      transform: translateY(-100%);
      pointer-events: none;
      z-index: 11;
    }

    .curve-container svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    .about-content {
      position: relative;
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 48px 0;
      z-index: 10;
    }

    .about-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 80px;
      align-items: start;
    }

    .about-heading {
      font-size: 72px;
      font-weight: 700;
      color: #000;
      line-height: 1.1;
      margin-bottom: 30px;
    }

    .about-heading span {
      display: block;
      color: #B8FF5C;
      -webkit-text-stroke: 1px #000;
    }

    .about-text {
      color: #333;
      font-size: 18px;
      line-height: 1.8;
      font-weight: 400;
    }

    .about-text p {
      margin-bottom: 24px;
    }

    .about-text p:last-child {
      margin-bottom: 0;
    }

    .about-stats {
      display: flex;
      gap: 60px;
      margin-top: 50px;
    }

    .stat-item {
      text-align: left;
    }

    .stat-number {
      font-size: 48px;
      font-weight: 700;
      color: #000;
      line-height: 1;
      margin-bottom: 8px;
    }

    .stat-label {
      font-size: 14px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    /* Social Section */
    .social-section {
      position: relative;
      width: 100%;
      background: #fff;
      z-index: 10;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 40px 20px 60px;
    }

    .social-wrapper {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      max-width: 1200px;
      width: 100%;
    }

    .social-item {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 40px;
    }

    .social-item.reverse {
      flex-direction: row-reverse;
    }

    .social-text-content {
      text-align: right;
      min-width: 200px;
    }

    .social-item.reverse .social-text-content {
      text-align: left;
    }

    .social-label {
      color: #1d1d1f;
      font-size: 1rem;
      margin: 0 0 10px 0;
      font-weight: 400;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .social-title {
      font-size: 3rem;
      margin: 0 0 15px 0;
      font-weight: 700;
    }

    .social-title.instagram {
      background: linear-gradient(
        45deg,
        #f09433 0%,
        #e6683c 25%,
        #dc2743 50%,
        #cc2366 75%,
        #bc1888 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .social-title.twitter {
      color: #1DA1F2;
    }

    .social-handle {
      color: #1d1d1f;
      font-size: 1.2rem;
      margin: 0;
      font-weight: 300;
    }

    .social-handle a {
      color: #1d1d1f;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .social-handle a:hover {
      opacity: 0.7;
    }

    /* Phone Slide Styles */
    .social-slide {
      position: relative;
      width: 180px;
      height: 380px;
      padding: 0;
      border-radius: 35px;
      overflow: hidden;
      border: 4px solid #2a2a2a;
      outline: 1px solid #444;
      background-color: #000;
      box-shadow: 25px 25px 50px rgba(0, 0, 0, 0.15);
      display: grid;
      flex-shrink: 0;
    }

    .social-slide:after {
      content: "";
      position: absolute;
      bottom: 12px;
      left: 30%;
      background-color: #f7f7f7;
      width: 40%;
      height: 4px;
      border-radius: 10px;
    }

    .social-slide-items {
      position: relative;
      grid-area: 1/1;
      overflow: hidden;
      border: 6px solid #000;
      border-radius: 30px;
    }

    .social-slide-items img {
      object-fit: cover;
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }

    .social-slide-items img.active {
      position: relative;
      opacity: 1;
      pointer-events: initial;
    }

    .social-slide-nav {
      grid-area: 1/1;
      z-index: 2;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto 1fr;
    }

    .social-slide-nav button {
      -webkit-appearance: none;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      opacity: 0;
      cursor: pointer;
      border: none;
      background: transparent;
    }

    .social-slide-thumb {
      display: flex;
      grid-column: 1/3;
      padding: 0 15px;
    }

    .social-slide-thumb > span {
      flex: 1;
      display: block;
      height: 3px;
      background: rgba(175, 175, 175, 0.5);
      margin: 3px;
      margin-top: 20px;
      border-radius: 3px;
      overflow: hidden;
    }

    .social-slide-thumb > span.done:after {
      content: "";
      display: block;
      height: inherit;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 3px;
    }

    .social-slide-thumb > span.active:after {
      content: "";
      display: block;
      height: inherit;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 3px;
      transform: translateX(-100%);
      animation: socialThumb 5s forwards linear;
    }

    @keyframes socialThumb {
      to {
        transform: initial;
      }
    }

    /* FAQ Section */
    .faq-section {
      position: relative;
      width: 100%;
      background: #0a0a0a;
      z-index: 10;
      padding: 100px 48px;
    }

    .faq-container {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 350px 1fr;
      gap: 80px;
    }

    .faq-label {
      font-size: 12px;
      font-weight: 400;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.5);
      margin-bottom: 30px;
    }

    .faq-title {
      font-size: 56px;
      font-weight: 700;
      color: #fff;
      line-height: 1.1;
      text-transform: uppercase;
      letter-spacing: -0.02em;
    }

    .faq-list {
      display: flex;
      flex-direction: column;
    }

    .faq-item {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding: 30px 0;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .faq-item:last-child {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .faq-item-header {
      display: grid;
      grid-template-columns: 60px 1fr 40px;
      align-items: start;
      gap: 20px;
    }

    .faq-number {
      font-size: 14px;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.4);
      padding-top: 5px;
    }

    .faq-question {
      font-size: 22px;
      font-weight: 500;
      color: #fff;
      line-height: 1.4;
      transition: color 0.3s ease;
    }

    .faq-item:hover .faq-question {
      color: rgba(255, 255, 255, 0.8);
    }

    .faq-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
    }

    .faq-icon svg {
      width: 20px;
      height: 20px;
      stroke: #fff;
      stroke-width: 2;
      fill: none;
      transition: transform 0.3s ease;
    }

    .faq-item.active .faq-icon svg {
      transform: rotate(180deg);
    }

    .faq-answer {
      display: grid;
      grid-template-columns: 60px 1fr 40px;
      gap: 20px;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.4s ease, padding 0.4s ease;
    }

    .faq-item.active .faq-answer {
      max-height: 300px;
      padding-top: 20px;
    }

    .faq-answer-text {
      grid-column: 2;
      font-size: 16px;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.6);
      line-height: 1.7;
    }

    /* Footer */
    .footer {
      position: relative;
      width: 100%;
      background: #000;
      z-index: 10;
      padding: 80px 48px 40px;
      border-top: 1px solid rgba(255,255,255,0.1);
    }

    .footer-content {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 60px;
    }

    .footer-brand {
      display: flex;
      flex-direction: column;
    }

    .footer-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }

    .footer-logo img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
    }

    .footer-logo span {
      font-size: 18px;
      font-weight: 500;
      letter-spacing: 0.05em;
    }

    .footer-description {
      color: rgba(255,255,255,0.5);
      font-size: 14px;
      line-height: 1.6;
      max-width: 300px;
    }

    .footer-column h4 {
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.5);
      margin-bottom: 24px;
    }

    .footer-links {
      list-style: none;
    }

    .footer-links li {
      margin-bottom: 12px;
    }

    .footer-links a {
      color: white;
      text-decoration: none;
      font-size: 14px;
      transition: color 0.3s ease;
    }

    .footer-links a:hover {
      color: #B8FF5C;
    }

    .footer-bottom {
      max-width: 1400px;
      margin: 60px auto 0;
      padding-top: 30px;
      border-top: 1px solid rgba(255,255,255,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .footer-copyright {
      color: rgba(255,255,255,0.4);
      font-size: 13px;
    }

    .footer-social {
      display: flex;
      gap: 24px;
    }

    .footer-social a {
      color: rgba(255,255,255,0.5);
      text-decoration: none;
      font-size: 13px;
      transition: color 0.3s ease;
    }

    .footer-social a:hover {
      color: #B8FF5C;
    }

    /* Top Navigation */
    .top-nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      display: grid;
      grid-template-columns: auto 1fr auto 1fr auto;
      align-items: center;
      padding: 32px 48px;
      z-index: 999;
      pointer-events: none;
      font-family: 'Helvetica Neue', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .top-nav > * {
      pointer-events: auto;
    }

    .nav-left {
      grid-column: 1;
      justify-self: start;
    }

    .nav-logo {
      font-size: 14px;
      font-weight: 400;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: white;
      line-height: 1;
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
    }

    .nav-logo-img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }

    .nav-center-left {
      grid-column: 2;
      justify-self: start;
      padding-left: 60px;
    }

    .nav-menu-item {
      font-size: 16px;
      font-weight: 400;
      letter-spacing: 0.02em;
      color: white;
      text-decoration: none;
      transition: opacity 0.2s ease;
      line-height: 1;
    }

    .nav-menu-item:hover {
      opacity: 0.6;
    }

    .nav-center {
      grid-column: 3;
      justify-self: center;
      display: flex;
      align-items: center;
      height: 100%;
    }

    .nav-stripe-cluster {
      display: flex;
      gap: 1px;
      align-items: center;
      height: 32px;
      justify-content: center;
    }

    .stripe {
      width: 0.5px;
      height: 100%;
      background: white;
      opacity: 0.2;
    }

    .stripe:nth-child(1) { opacity: 0.15; height: 30%; }
    .stripe:nth-child(2) { opacity: 0.18; height: 40%; }
    .stripe:nth-child(3) { opacity: 0.22; height: 50%; }
    .stripe:nth-child(4) { opacity: 0.28; height: 60%; }
    .stripe:nth-child(5) { opacity: 0.35; height: 70%; }
    .stripe:nth-child(6) { opacity: 0.42; height: 80%; }
    .stripe:nth-child(7) { opacity: 0.5; height: 90%; }
    .stripe:nth-child(8) { opacity: 0.6; height: 100%; }
    .stripe:nth-child(9) { opacity: 0.65; height: 100%; }
    .stripe:nth-child(10) { opacity: 0.7; height: 100%; }
    .stripe:nth-child(11) { opacity: 0.75; height: 100%; }
    .stripe:nth-child(12) { opacity: 0.8; height: 100%; }
    .stripe:nth-child(13) { opacity: 0.85; height: 100%; }
    .stripe:nth-child(14) { opacity: 0.8; height: 100%; }
    .stripe:nth-child(15) { opacity: 0.75; height: 100%; }
    .stripe:nth-child(16) { opacity: 0.7; height: 100%; }
    .stripe:nth-child(17) { opacity: 0.65; height: 100%; }
    .stripe:nth-child(18) { opacity: 0.6; height: 100%; }
    .stripe:nth-child(19) { opacity: 0.5; height: 90%; }
    .stripe:nth-child(20) { opacity: 0.42; height: 80%; }
    .stripe:nth-child(21) { opacity: 0.35; height: 70%; }
    .stripe:nth-child(22) { opacity: 0.28; height: 60%; }
    .stripe:nth-child(23) { opacity: 0.22; height: 50%; }
    .stripe:nth-child(24) { opacity: 0.18; height: 40%; }
    .stripe:nth-child(25) { opacity: 0.15; height: 30%; }
    .stripe:nth-child(26) { opacity: 0.12; height: 25%; }
    .stripe:nth-child(27) { opacity: 0.1; height: 20%; }
    .stripe:nth-child(28) { opacity: 0.08; height: 15%; }
    .stripe:nth-child(29) { opacity: 0.06; height: 12%; }
    .stripe:nth-child(30) { opacity: 0.05; height: 10%; }

    .nav-center-right {
      grid-column: 4;
      justify-self: end;
      padding-right: 60px;
    }

    .nav-lang-toggle {
      font-size: 14px;
      font-weight: 400;
      letter-spacing: 0.05em;
      color: white;
      line-height: 1;
      display: flex;
      gap: 6px;
      align-items: center;
    }

    .lang-active {
      opacity: 1;
    }

    .lang-separator {
      opacity: 0.4;
    }

    .lang-inactive {
      opacity: 0.4;
      cursor: pointer;
      transition: opacity 0.2s ease;
    }

    .lang-inactive:hover {
      opacity: 0.7;
    }

    .nav-right {
      grid-column: 5;
      justify-self: end;
    }

    .nav-menu-btn {
      background: none;
      border: none;
      padding: 0;
      display: flex;
      align-items: center;
      gap: 16px;
      cursor: pointer;
      font-family: inherit;
    }

    .menu-text {
      font-size: 14px;
      font-weight: 400;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: white;
      line-height: 1;
    }

    .menu-icon {
      position: relative;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .menu-line {
      position: absolute;
      background: white;
      transition: transform 0.3s ease, opacity 0.3s ease;
    }

    .menu-line-h {
      width: 16px;
      height: 1px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .menu-line-v {
      width: 1px;
      height: 16px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .nav-menu-btn:hover .menu-line {
      opacity: 0.7;
    }

    .top-nav.scrolled .nav-logo span,
    .top-nav.scrolled .nav-menu-item,
    .top-nav.scrolled .nav-lang-toggle,
    .top-nav.scrolled .menu-text {
      color: white;
    }

    .top-nav.scrolled .menu-line,
    .top-nav.scrolled .stripe {
      background: white;
    }

    /* Responsive styles */
    @media screen and (max-width: 1200px) {
      .options { height: 450px; }
      .option:nth-child(6) { display: none; }
      .footer-content { grid-template-columns: 1fr 1fr; gap: 40px; }
    }

    @media screen and (max-width: 1024px) {
      .top-nav { padding: 28px 32px; grid-template-columns: auto 1fr auto; }
      .nav-center-left { display: none; }
      .nav-center { display: none; }
      .nav-center-right { grid-column: 2; justify-self: end; padding-right: 0; }
      .about-grid { grid-template-columns: 1fr; gap: 50px; }
      .about-heading { font-size: 56px; }
      .faq-container { grid-template-columns: 1fr; gap: 50px; }
      .social-wrapper { gap: 40px; }
    }

    @media screen and (max-width: 900px) {
      .options { height: 400px; }
      .option:nth-child(5) { display: none; }
      .game-container { grid-template-columns: 1fr; gap: 40px; }
      .game-right { order: -1; }
      .footer-content { grid-template-columns: 1fr; gap: 40px; }
      .footer-bottom { flex-direction: column; gap: 20px; text-align: center; }
    }

    @media screen and (max-width: 768px) {
      .about-content { padding: 80px 24px 60px; }
      .about-heading { font-size: 42px; }
      .about-stats { flex-direction: column; gap: 30px; }
      .social-wrapper { grid-template-columns: 1fr; gap: 50px; }
      .social-item, .social-item.reverse { flex-direction: column; text-align: center; }
      .social-text-content, .social-item.reverse .social-text-content { text-align: center; min-width: auto; }
      .faq-item-header { grid-template-columns: 50px 1fr 35px; gap: 15px; }
      .faq-answer { grid-template-columns: 50px 1fr 35px; gap: 15px; }
      .faq-question { font-size: 18px; }
      .faq-section { padding: 60px 20px; }
    }

    @media screen and (max-width: 720px) {
      .top-nav { padding: 24px 28px; }
      .nav-logo { font-size: 12px; }
      .nav-logo-img { width: 28px; height: 28px; }
      .side-menu-link { font-size: 24px; padding: 16px 0; }
      .footer { padding: 60px 20px 30px; }
    }

    @media screen and (max-width: 700px) {
      .options { height: 350px; }
      .option:nth-child(4) { display: none; }
    }

    @media screen and (max-width: 500px) {
      .options { height: 300px; min-width: 300px; }
      .option:nth-child(3) { display: none; }
      .about-heading { font-size: 32px; }
      .faq-item-header { grid-template-columns: 40px 1fr 30px; gap: 10px; }
      .faq-answer { grid-template-columns: 40px 1fr 30px; gap: 10px; }
      .faq-question { font-size: 16px; }
      .faq-title { font-size: 28px; }
    }
  </style>
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
      <a href="/" class="side-menu-link">Home</a>
      <a href="#services" class="side-menu-link">Services</a>
      <a href="#discount" class="side-menu-link">Get 20% Off</a>
      <a href="/contact" class="side-menu-link">Contact</a>
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

  <!-- Hero 3D Canvas -->
  <canvas class="webgl"></canvas>
  
  <!-- Black Fade Overlay -->
  <div id="blackFadeOverlay"></div>

  <!-- Top Navigation -->
  <nav class="top-nav" id="topNav">
    <div class="nav-left">
      <a href="/" class="nav-logo">
        <img src="https://i.ibb.co/VWs7tk3q/605997942-17850007239614033-1994629091166485047-n.jpg" alt="fitup" class="nav-logo-img">
        <span>© fitup</span>
      </a>
    </div>
    
    <div class="nav-center-left">
      <a href="/contact" class="nav-menu-item">Contact Us</a>
    </div>
    
    <div class="nav-center">
      <div class="nav-stripe-cluster">
        ${Array(30).fill(0).map(() => '<div class="stripe"></div>').join('')}
      </div>
    </div>
    
    <div class="nav-center-right">
      <div class="nav-lang-toggle">
        <span class="lang-active">Eng</span>
        <span class="lang-separator">/</span>
        <span class="lang-inactive">Fr</span>
      </div>
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

  <!-- Hero Section -->
  <section id="s1" class="hero-section">
    <div class="hero"></div>
  </section>

  <!-- Logo Scroll Section -->
  <section class="logo-scroll-section">
    <p class="logo-scroll-title">${getContent('logo_scroll', 'title', 'Brands We\'ve Worked With')}</p>
    <div class="logo-scroll-container">
      <div class="logo-scroll-track">
        ${Array(12).fill(0).map((_, i) => i % 2 === 0 ? 
          '<div class="logo-item"><img src="https://fedaura.ma/cdn/shop/files/Untitled_design_10_5944d3f3-9115-4fd0-b1ed-58c69bbc602f.png?height=72&v=1756045971" alt="Fedaura"></div>' :
          '<div class="logo-item round"><img src="https://instagram.fcmn3-1.fna.fbcdn.net/v/t51.2885-19/573221119_17946853287053011_813047376054832019_n.jpg?efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=instagram.fcmn3-1.fna.fbcdn.net&_nc_cat=107&_nc_oc=Q6cZ2QESVqXFyo87kHmwd0B7kG7Ny3n_HRS9pPjdL5veNuKv9cJu7rOLDxmO32cZ_s3VeBI&_nc_ohc=Dsq4i4-ChGMQ7kNvwFZD3c_&_nc_gid=T1liHn0OEoTpExNI7IDiQw&edm=AP4sbd4BAAAA&ccb=7-5&oh=00_AfrH-TvJMkR2G96HO4xdw7mh9eyuqSJUqf0dPVh-7tooNg&oe=697154ED&_nc_sid=7a9f4b" alt="Brand"></div>'
        ).join('')}
      </div>
    </div>
  </section>

  <!-- Services Section -->
  <section class="services-section" id="services">
    <p class="services-title">${getContent('services', 'title', 'Our Services')}</p>
    <div class="options">
      <div class="option active">
        <img class="option-image" src="https://i.ibb.co/3YdDVd9P/33aca89d-c4fe-43ff-a4ac-00e921a9213c.jpg" alt="Strategic Consulting">
        <div class="shadow"></div>
        <div class="label">
          <div class="icon">
            <img src="https://i.ibb.co/VWs7tk3q/605997942-17850007239614033-1994629091166485047-n.jpg" alt="fitup">
          </div>
          <div class="info">
            <div class="main">${getContent('services', 'service1_title', 'Strategic Consulting')}</div>
            <div class="sub">${getContent('services', 'service1_subtitle', 'Personalized marketing analysis & strategy')}</div>
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
            <div class="main">${getContent('services', 'service2_title', 'Media Buying')}</div>
            <div class="sub">${getContent('services', 'service2_subtitle', 'Optimized advertising campaigns')}</div>
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
            <div class="main">${getContent('services', 'service3_title', 'Video Production')}</div>
            <div class="sub">${getContent('services', 'service3_subtitle', 'Professional shooting & editing')}</div>
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
            <div class="main">${getContent('services', 'service4_title', 'Social Media Management')}</div>
            <div class="sub">${getContent('services', 'service4_subtitle', 'Expert community management')}</div>
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
            <div class="main">${getContent('services', 'service5_title', 'Graphic Design')}</div>
            <div class="sub">${getContent('services', 'service5_subtitle', 'Visual identity & creations')}</div>
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
            <div class="main">${getContent('services', 'service6_title', 'Data Analytics')}</div>
            <div class="sub">${getContent('services', 'service6_subtitle', 'Insights & detailed reports')}</div>
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

  <!-- About Section -->
  <section class="about-transition-section" id="about">
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

    <div class="about-content">
      <div class="about-grid">
        <div class="about-left">
          <h2 class="about-heading">
            ${getContent('about', 'heading_line1', 'About')}
            <span>${getContent('about', 'heading_line2', 'Us')}</span>
          </h2>
          <div class="about-stats">
            <div class="stat-item">
              <div class="stat-number">${getContent('about', 'stat1_number', '50+')}</div>
              <div class="stat-label">${getContent('about', 'stat1_label', 'Projects Delivered')}</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">${getContent('about', 'stat2_number', '98%')}</div>
              <div class="stat-label">${getContent('about', 'stat2_label', 'Client Satisfaction')}</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">${getContent('about', 'stat3_number', '5+')}</div>
              <div class="stat-label">${getContent('about', 'stat3_label', 'Years Experience')}</div>
            </div>
          </div>
        </div>

        <div class="about-text">
          <p>${getContent('about', 'paragraph1', 'At fitup, we believe that every brand has a unique story waiting to be told. We\'re not just a marketing agency—we\'re your strategic partners in growth, dedicated to transforming your vision into measurable success.')}</p>
          <p>${getContent('about', 'paragraph2', 'Our team combines creative excellence with data-driven insights to craft campaigns that resonate with your audience and drive real results. From strategic consulting to full-scale media production, we handle every aspect of your brand\'s digital presence.')}</p>
          <p>${getContent('about', 'paragraph3', 'Based in Casablanca, Morocco, we\'ve helped businesses across industries elevate their brand, connect with their audience, and achieve sustainable growth. Whether you\'re a startup looking to make your mark or an established brand seeking fresh perspectives, we\'re here to help you win.')}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Social Section -->
  <section class="social-section" id="social">
    <div class="social-wrapper">
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
      <div class="faq-header">
        <p class="faq-label">/FAQ</p>
        <h2 class="faq-title">Questions<br>que vous<br>pourriez<br>poser</h2>
      </div>

      <div class="faq-list">
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
        <p class="footer-description">
          ${getContent('footer', 'description', 'Where brands win. We help businesses grow through strategic marketing, creative content, and data-driven decisions.')}
        </p>
      </div>
      
      <div class="footer-column">
        <h4>Navigation</h4>
        <ul class="footer-links">
          <li><a href="/">Home</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#discount">Get 20% Off</a></li>
          <li><a href="/contact">Contact</a></li>
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
          <li><a href="mailto:${getContent('footer', 'email', 'hello@fitup.ma')}">${getContent('footer', 'email', 'hello@fitup.ma')}</a></li>
          <li><a href="tel:${getContent('footer', 'phone', '+212 6 00 00 00 00')}">${getContent('footer', 'phone', '+212 6 00 00 00 00')}</a></li>
          <li><a href="#">${getContent('footer', 'location', 'Casablanca, Morocco')}</a></li>
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

  <!-- GSAP -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
  
  <!-- Three.js Hero Animation -->
  <script type="module">
    import * as THREE from "three";
    import { FontLoader } from "jsm/loaders/FontLoader.js";
    import { TextGeometry } from "jsm/geometries/TextGeometry.js";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector(".webgl"),
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1);

    const fontLoader = new FontLoader();
    fontLoader.load(
      "https://raw.githubusercontent.com/danielyl123/person/refs/heads/main/fonts/helvetiker_regular.typeface.json",
      (font) => {
        const textGeometry = new TextGeometry("${getContent('hero', 'tagline', 'Where Brands Win.')}", {
          font,
          size: 1,
          depth: 0,
          curveSegments: 5,
          bevelEnabled: true,
          bevelThickness: 0,
          bevelSize: 0,
          bevelOffset: 0,
          bevelSegments: 4,
        });
        textGeometry.computeBoundingBox();
        textGeometry.center();

        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        textMaterial.wireframe = false;
        const text = new THREE.Mesh(textGeometry, textMaterial);
        scene.add(text);
      }
    );

    const torusGeometry = new THREE.TorusGeometry(0.7, 0.4, 100, 60);
    const torusMaterial = new THREE.MeshPhysicalMaterial();
    torusMaterial.metalness = 0;
    torusMaterial.roughness = 0;
    torusMaterial.iridescence = 1;
    torusMaterial.iridescenceIOR = 1.5;
    torusMaterial.iridescenceThicknessRange = [100, 324];
    torusMaterial.transmission = 1;
    torusMaterial.ior = 1.2;
    torusMaterial.thickness = 0.8;
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.z = 1;
    scene.add(torus);

    const ambientLight = new THREE.AmbientLight(0xffffff, 10);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 10);
    pointLight.position.set(-1, 2, 0);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xffffff, 10);
    pointLight2.position.set(-1, -2, 0);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xffffff, 10);
    pointLight3.position.set(1, -2, 0);
    scene.add(pointLight3);

    const pointLight4 = new THREE.PointLight(0xffffff, 10);
    pointLight4.position.set(1, 2, 0);
    scene.add(pointLight4);

    const clock = new THREE.Clock();
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      renderer.render(scene, camera);
      torus.rotation.x = elapsedTime * 0.5;
      torus.rotation.y = elapsedTime * 0.1;
      requestAnimationFrame(tick);
    };
    tick();

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    gsap.registerPlugin(ScrollTrigger);
    
    const fadeTL = gsap.timeline({
      scrollTrigger: {
        trigger: '#s1',
        start: 'top top',
        endTrigger: '#s2',
        end: 'top bottom',
        scrub: true
      }
    });
    
    fadeTL.to('.webgl', { opacity: 0, ease: 'none' }, 0);
    fadeTL.to('#blackFadeOverlay', { opacity: 1, ease: 'none' }, 0);
  </script>

  <!-- UI Scripts -->
  <script src="/static/home.js"></script>
</body>
</html>`;
}
