// Gallerie Page - fitup Gallery
export function galleriePage(content: Record<string, Record<string, string>> = {}): string {
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
      { label: 'Services', url: '/#services', type: 'anchor' },
      { label: 'Gallerie', url: '/gallerie', type: 'internal' },
      { label: 'Contact', url: '/contact', type: 'internal' }
    ];
  };
  
  // Generate side menu HTML
  const menuItems = getMenuItems();
  const sideMenuLinksHTML = menuItems.map(item => {
    const isActive = item.url === '/gallerie' ? ' active' : '';
    return `<a href="${item.url}" class="side-menu-link${isActive}">${item.label}</a>`;
  }).join('\n      ');

  // Helper to get gallery items
  interface GalleryItem {
    id: number;
    number: string;
    image: string;
    tag: string;
    title: string;
    description: string;
    link: string;
  }
  
  const getGalleryItems = (collection: string): GalleryItem[] => {
    const itemsStr = content['gallery']?.[collection];
    if (itemsStr) {
      try {
        const parsed = typeof itemsStr === 'string' ? JSON.parse(itemsStr) : itemsStr;
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        // Fall through to defaults
      }
    }
    
    // Default gallery items
    if (collection === 'featured') {
      return [
        { id: 1, number: '01', image: 'https://fitup.ma/Mediafitup/uploads/services/20260121_181607_L7erfa.21-04-2024.jpg', tag: 'Culture', title: "L7erfa Day", description: 'April 21st, 2024. A day when culture met creativity in perfect harmony.', link: '#' },
        { id: 2, number: '02', image: 'https://fitup.ma/Mediafitup/uploads/services/20260121_181634_L7erfa_3.0...._morocco.jpg', tag: 'Style', title: 'Morocco 3.0', description: 'The next chapter of Moroccan style. Bold, authentic, and unapologetically unique.', link: '#' },
        { id: 3, number: '03', image: 'https://fitup.ma/Mediafitup/uploads/services/20260121_181607_L7erfa.21-04-2024.jpg', tag: 'Heritage', title: 'Tribal Roots', description: 'Ancient traditions meet modern expression. Where heritage becomes innovation.', link: '#' }
      ];
    } else {
      return [
        { id: 4, number: '04', image: 'https://fitup.ma/Mediafitup/uploads/services/20260121_181634_L7erfa_3.0...._morocco.jpg', tag: 'Music', title: 'Desert Blues', description: 'From the oasis towns, rhythm flows through the dunes into every soul.', link: '#' },
        { id: 5, number: '05', image: 'https://fitup.ma/Mediafitup/uploads/services/20260121_181607_L7erfa.21-04-2024.jpg', tag: 'Movement', title: 'Never Stop', description: 'Running towards greatness. The journey never ends, it only evolves.', link: '#' },
        { id: 6, number: '06', image: 'https://fitup.ma/Mediafitup/uploads/services/20260121_181634_L7erfa_3.0...._morocco.jpg', tag: 'Fashion', title: 'Statement', description: 'The ultimate piece that speaks without words. Bold presence, lasting impression.', link: '#' }
      ];
    }
  };
  
  // Generate gallery card HTML
  const generateGalleryCardHTML = (item: GalleryItem): string => {
    return `
                <article class="gallery-card">
                    <span class="gallery-card-number">${item.number}</span>
                    <img src="${item.image}" alt="${item.title}" />
                    <div class="gallery-card-content">
                        <span class="gallery-card-tag">${item.tag}</span>
                        <h3 class="gallery-card-title">${item.title}</h3>
                        <p class="gallery-card-desc">${item.description}</p>
                        <a href="${item.link}" class="gallery-card-cta">
                            Explore
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </a>
                    </div>
                </article>`;
  };
  
  const featuredItems = getGalleryItems('featured');
  const l7erfaItems = getGalleryItems('l7erfa');
  
  const featuredCardsHTML = featuredItems.map(item => generateGalleryCardHTML(item)).join('\n');
  const l7erfaCardsHTML = l7erfaItems.map(item => generateGalleryCardHTML(item)).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gallerie | fitup</title>
    <link href="https://fonts.googleapis.com/css2?family=Teko:wght@300;400;500&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/static/styles/main.css">
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body, html {
            font-family: 'Helvetica Neue', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: #000;
            overflow-x: hidden;
            color: white;
            margin: 0;
            padding: 0;
            min-height: 100vh;
            position: relative;
        }

/* Let's Talk Widget & WhatsApp - INLINE */
.lets-talk-widget {
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 998;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
}

.whatsapp-floating-btn {
    width: 56px;
    height: 56px;
    background: #25D366;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
    transition: all 0.3s ease;
    text-decoration: none;
}

.whatsapp-floating-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(37, 211, 102, 0.5);
}

.whatsapp-floating-btn svg {
    width: 28px;
    height: 28px;
}

.lets-talk-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px 24px;
    background: #B6FF5C;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    color: #000;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 4px 20px rgba(182, 255, 92, 0.3);
    transition: all 0.3s ease;
}

.lets-talk-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(182, 255, 92, 0.5);
}

.lets-talk-btn svg {
    width: 20px;
    height: 20px;
}

@media (max-width: 480px) {
    .lets-talk-widget {
        bottom: 20px;
        right: 20px;
        gap: 10px;
    }
    
    .whatsapp-floating-btn {
        width: 50px;
        height: 50px;
    }
    
    .lets-talk-btn {
        padding: 14px 20px;
        font-size: 12px;
    }
    
    .lets-talk-btn span {
        display: none;
    }
    
    .lets-talk-btn {
        width: 50px;
        height: 50px;
        padding: 0;
        border-radius: 50%;
        justify-content: center;
    }
}
        /* Grid lines on whole page */
        body::before {
            --size: 45px;
            --line: rgba(255,255,255,0.06);
            content: '';
            height: 100%;
            width: 100%;
            position: fixed;
            background: linear-gradient(90deg, var(--line) 1px, transparent 1px var(--size)) calc(var(--size) * 0.36) 50% / var(--size) var(--size),
                        linear-gradient(var(--line) 1px, transparent 1px var(--size)) 0% calc(var(--size) * 0.32) / var(--size) var(--size);
            mask: linear-gradient(-20deg, transparent 50%, white);
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 0;
        }

        

        /* ========== LED BOARD SECTION - GREEN #B6FF5C ========== */
        .board-section {
            position: relative;
            top: 0;
            left: 0;
            right: 0;
            display: flex;
            justify-content: center;
            z-index: 100;
            padding: 0 48px;
            margin-top: 120px;
            margin-bottom: 20px;
        }

        .board-container {
            position: relative;
            border: 2px solid hsl(0 0% 16%);
            border-radius: 4px;
        }

        .board-container::after {
            content: '';
            position: absolute;
            inset: 2px;
            background: linear-gradient(-68deg, #0000 63% 69.5%, #fff 70% 80%, #0000 80.5% 82.5%, #fff 82% 86.5%, #0000 87% 100%);
            z-index: 3;
            opacity: 0.12;
            mix-blend-mode: plus-lighter;
            pointer-events: none;
        }

        .rivets {
            position: absolute;
            inset: 0;
            z-index: 4;
            pointer-events: none;
        }

        .rivet {
            background: hsl(0 0% 10%);
            position: absolute;
            width: 10px;
            aspect-ratio: 1;
            border-radius: 50%;
            box-shadow: 0.5px 0.5px 0px hsl(0 0% 100% / 0.2) inset;
        }

        .rivet::after {
            content: '';
            height: 2px;
            width: 80%;
            border-radius: 10px;
            background: hsl(0 0% 0%);
            position: absolute;
            top: 50%;
            left: 50%;
            translate: -50% -50%;
            box-shadow: 0 -1px hsl(0 0% 100% / 0.2) inset;
            rotate: -30deg;
        }

        .rivet:nth-of-type(1) { left: calc(100% + 4px); bottom: calc(100% + 4px); }
        .rivet:nth-of-type(2) { right: calc(100% + 4px); bottom: calc(100% + 4px); }
        .rivet:nth-of-type(3) { right: calc(100% + 4px); top: calc(100% + 4px); }
        .rivet:nth-of-type(4) { left: calc(100% + 4px); top: calc(100% + 4px); }

        .board {
            --size: 4px;
            font-family: 'Teko', sans-serif;
            font-size: 100px;
            font-weight: 400;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            white-space: nowrap;
            width: min(700px, 90vw);
            padding: 1.2rem 0;
            line-height: 1;
            background: rgba(182, 255, 92, 0.08);
            position: relative;
            overflow: hidden;
        }

        .board::before {
            content: '';
            position: absolute;
            inset: 0;
            z-index: 2;
            background: radial-gradient(circle at center, rgba(182, 255, 92, 0.3) 1px, transparent 1px) 50% 50% / var(--size) var(--size);
            pointer-events: none;
        }

        .board__content {
            display: flex;
            align-items: center;
            width: max-content;
            animation: marquee 15s linear infinite;
        }

        .board__content .text {
            color: #B6FF5C;
            text-shadow: 
                0 0 5px #B6FF5C,
                0 0 10px #B6FF5C,
                0 0 20px rgba(182, 255, 92, 0.8),
                0 0 40px rgba(182, 255, 92, 0.6),
                0 0 60px rgba(182, 255, 92, 0.4);
            padding: 0 2rem;
            display: inline-block;
        }

        @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
        }

        /* ========== PAGE CONTENT ========== */
        .page-content {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 120px;
            padding-bottom: 4rem;
            position: relative;
            z-index: 1;
        }

        /* ========== GALLERY SECTION ========== */
        .gallery-section {
            width: 100%;
            max-width: 1400px;
            padding: 0 2rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2rem;
        }

        .gallery-header {
            text-align: center;
            margin-bottom: 1rem;
        }

        .gallery-title {
            font-size: clamp(2.5rem, 8vw, 5rem);
            font-weight: 300;
            letter-spacing: -2px;
            text-transform: lowercase;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .gallery-subtitle {
            max-width: 60ch;
            font-family: monospace;
            font-size: 14px;
            line-height: 1.6;
            opacity: 0.6;
            text-wrap: balance;
        }

        .row-label {
            width: 100%;
            max-width: 1000px;
            font-family: monospace;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 2px;
            opacity: 0.4;
            margin-top: 3rem;
            padding-left: 4px;
        }

        /* ========== MOBILE-FIRST GALLERY CARDS ========== */
        .gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
            width: 100%;
            max-width: 1000px;
            margin: 1rem 0;
        }

        .gallery-card {
            position: relative;
            border-radius: 20px;
            overflow: hidden;
            aspect-ratio: 3/4;
            cursor: pointer;
            transform-style: preserve-3d;
            transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.6s ease;
        }

        .gallery-card::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, 
                transparent 0%, 
                transparent 40%,
                rgba(0,0,0,0.4) 70%,
                rgba(0,0,0,0.95) 100%
            );
            z-index: 2;
            transition: opacity 0.4s ease;
        }

        .gallery-card::after {
            content: '';
            position: absolute;
            inset: 0;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 20px;
            z-index: 5;
            pointer-events: none;
            transition: border-color 0.4s ease;
        }

        .gallery-card:hover::after {
            border-color: rgba(182, 255, 92, 0.3);
        }

        .gallery-card:hover {
            transform: translateY(-10px) scale(1.02);
            box-shadow: 0 30px 60px rgba(182, 255, 92, 0.15), 0 10px 20px rgba(0,0,0,0.5);
        }

        .gallery-card img {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.8s cubic-bezier(0.23, 1, 0.32, 1), filter 0.6s ease;
            filter: saturate(0.9) brightness(0.95);
        }

        .gallery-card:hover img {
            transform: scale(1.1);
            filter: saturate(1.1) brightness(1);
        }

        .gallery-card-content {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 2rem;
            z-index: 3;
            transform: translateY(20px);
            opacity: 0;
            transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .gallery-card:hover .gallery-card-content {
            transform: translateY(0);
            opacity: 1;
        }

        .gallery-card-number {
            position: absolute;
            top: 1.5rem;
            left: 1.5rem;
            font-family: 'Teko', sans-serif;
            font-size: 4rem;
            font-weight: 300;
            color: rgba(255,255,255,0.1);
            line-height: 1;
            z-index: 3;
            transition: color 0.4s ease;
        }

        .gallery-card:hover .gallery-card-number {
            color: rgba(182, 255, 92, 0.3);
        }

        .gallery-card-tag {
            display: inline-block;
            padding: 0.4rem 1rem;
            background: rgba(182, 255, 92, 0.2);
            border: 1px solid rgba(182, 255, 92, 0.3);
            border-radius: 100px;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #B6FF5C;
            margin-bottom: 1rem;
            backdrop-filter: blur(10px);
        }

        .gallery-card-title {
            font-family: 'Teko', sans-serif;
            font-size: 2rem;
            font-weight: 400;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 0.5rem;
            color: white;
        }

        .gallery-card-desc {
            font-size: 13px;
            line-height: 1.5;
            opacity: 0.7;
            color: white;
        }

        .gallery-card-cta {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            margin-top: 1rem;
            color: #B6FF5C;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            text-decoration: none;
            transition: gap 0.3s ease;
        }

        .gallery-card-cta:hover {
            gap: 1rem;
        }

        .gallery-card-cta svg {
            width: 16px;
            height: 16px;
            transition: transform 0.3s ease;
        }

        .gallery-card-cta:hover svg {
            transform: translateX(5px);
        }

        /* Staggered animation on load */
        .gallery-card {
            opacity: 0;
            transform: translateY(40px);
            animation: cardReveal 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }

        .gallery-card:nth-child(1) { animation-delay: 0.1s; }
        .gallery-card:nth-child(2) { animation-delay: 0.2s; }
        .gallery-card:nth-child(3) { animation-delay: 0.3s; }
        .gallery-card:nth-child(4) { animation-delay: 0.4s; }
        .gallery-card:nth-child(5) { animation-delay: 0.5s; }
        .gallery-card:nth-child(6) { animation-delay: 0.6s; }

        @keyframes cardReveal {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* ========== CONTACT SECTION ========== */
        .contact-section {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            gap: 4rem;
            align-items: center;
            justify-content: center;
            padding: 6rem 2rem;
            margin-top: 4rem;
            position: relative;
            z-index: 1;
        }

        .contact-content {
            width: 50ch;
            max-width: calc(100vw - 2rem);
            position: relative;
            z-index: 1;
        }

        .contact-content h2 {
            font-size: clamp(2rem, 5vw, 3.5rem);
            font-weight: 600;
            letter-spacing: -0.05rem;
            line-height: 1.1;
            margin-bottom: 1.5rem;
            color: white;
        }

        .contact-content p {
            opacity: 0.7;
            font-weight: 300;
            font-size: 1rem;
            line-height: 1.6;
            margin-bottom: 2rem;
            color: white;
        }

        .contact-form {
            display: flex;
            gap: 0.5rem;
        }

        .contact-form input {
            flex: 1;
            padding: 0.75rem 1rem;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 8px;
            outline: none;
            color: white;
            font-size: 0.95rem;
            transition: border-color 0.3s ease, background 0.3s ease;
        }

        .contact-form input::placeholder {
            color: rgba(255,255,255,0.4);
        }

        .contact-form input:focus {
            border-color: #B6FF5C;
            background: rgba(182, 255, 92, 0.05);
        }

        .contact-form button {
            padding: 0.75rem 2rem;
            border-radius: 8px;
            background: #B6FF5C;
            border: none;
            cursor: pointer;
            color: black;
            font-size: 0.9rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            transition: background 0.3s ease, transform 0.2s ease;
        }

        .contact-form button:hover {
            background: #a3e852;
            transform: translateY(-2px);
        }

        /* ========== KEYPAD ========== */
        .keypad {
            --travel: 20;
            position: relative;
            aspect-ratio: 400 / 310;
            display: flex;
            place-items: center;
            width: clamp(280px, 35vw, 400px);
            -webkit-tap-highlight-color: transparent;
            z-index: 1;
        }

        .keypad .key {
            border: 0;
            background: transparent;
            padding: 0;
            cursor: pointer;
            outline: none;
        }

        .keypad .key:active .key__content,
        .keypad .key[data-pressed='true'] .key__content {
            translate: 0 calc(var(--travel) * 1%);
        }

        .key__content {
            width: 100%;
            display: inline-block;
            height: 100%;
            transition: translate 0.12s ease-out;
            container-type: inline-size;
        }

        .key__mask {
            width: 100%;
            height: 100%;
            display: inline-block;
        }

        .key__text {
            height: 46%;
            width: 86%;
            position: absolute;
            font-size: 18cqi;
            font-family: 'Teko', 'Helvetica Neue', sans-serif;
            font-weight: 500;
            z-index: 21;
            top: 5%;
            left: 0;
            color: hsl(0 0% 94%);
            translate: 8% 10%;
            transform: rotateX(36deg) rotateY(45deg) rotateX(-90deg) rotate(0deg);
            text-align: left;
            padding: 1ch;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .keypad__single .key__text {
            width: 52%;
            height: 62%;
            translate: 45% -16%;
            font-size: 30cqi;
            color: #000;
            text-shadow: none;
        }

        .keypad__base {
            position: absolute;
            bottom: 0;
            width: 100%;
        }

        .keypad__base img {
            width: 100%;
            filter: brightness(0.8);
        }

        .keypad__single {
            position: absolute;
            width: 40.5%;
            left: 54%;
            bottom: 36%;
            height: 46%;
            clip-path: polygon(0 0, 54% 0, 89% 24%, 100% 70%, 54% 100%, 46% 100%, 0 69%, 12% 23%, 47% 0%);
            mask: url(https://assets.codepen.io/605876/keypad-single.png?format=auto&quality=86) 50% 50% / 100% 100%;
        }

        .keypad__single.keypad__single--left {
            left: 29.3%;
            bottom: 54.2%;
            mask: none;
            clip-path: none;
        }

        .keypad__single.keypad__single--left img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            filter: none !important;
        }

        .keypad__single img {
            top: 0;
            opacity: 1;
            width: 96%;
            position: absolute;
            left: 50%;
            translate: -50% 1%;
        }

        .keypad__double {
            position: absolute;
            width: 64%;
            height: 65%;
            left: 6%;
            bottom: 17.85%;
            clip-path: polygon(34% 0, 93% 44%, 101% 78%, 71% 100%, 66% 100%, 0 52%, 0 44%, 7% 17%, 30% 0);
            mask: url(https://assets.codepen.io/605876/keypad-double.png?format=auto&quality=86) 50% 50% / 100% 100%;
        }

        .keypad__double img {
            top: 0;
            opacity: 1;
            width: 99%;
            position: absolute;
            left: 50%;
            translate: -50% 1%;
        }

        .keypad img {
            transition: translate 0.12s ease-out;
            width: 100%;
        }

        .key img {
            filter: hue-rotate(calc(var(--hue, 0) * 1deg)) saturate(var(--saturate, 1)) brightness(var(--brightness, 1));
        }

        #one {
            --travel: 26;
        }

        #one img {
            filter: none !important;
        }

        #two {
            --hue: 0;
            --saturate: 0;
            --brightness: 1.5;
            --travel: 26;
        }

        #three {
            --hue: 0;
            --saturate: 0;
            --brightness: 1.3;
            --travel: 18;
        }

        /* ========== FOOTER ========== */
        .footer {
            position: relative;
            width: 100%;
            padding: 6rem 2rem 2rem;
            background: linear-gradient(to bottom, transparent 0%, rgba(182, 255, 92, 0.03) 100%);
            border-top: 1px solid rgba(255,255,255,0.05);
            overflow: hidden;
            z-index: 1;
        }

        .footer::before {
            content: 'FITUP';
            position: absolute;
            bottom: -20%;
            left: 50%;
            transform: translateX(-50%);
            font-family: 'Teko', sans-serif;
            font-size: clamp(150px, 30vw, 400px);
            font-weight: 700;
            letter-spacing: -10px;
            color: transparent;
            -webkit-text-stroke: 1px rgba(182, 255, 92, 0.15);
            pointer-events: none;
            white-space: nowrap;
            z-index: 0;
        }

        .footer-content {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1fr;
            gap: 4rem;
            position: relative;
            z-index: 1;
        }

        .footer-brand {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .footer-logo {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
            color: white;
            font-size: 18px;
            font-weight: 600;
            letter-spacing: 1px;
        }

        .footer-logo img {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid rgba(182, 255, 92, 0.3);
        }

        .footer-tagline {
            font-family: monospace;
            font-size: 14px;
            line-height: 1.6;
            opacity: 0.6;
            max-width: 300px;
        }

        .footer-social {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
        }

        .footer-social a {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-decoration: none;
            transition: all 0.3s ease;
        }

        .footer-social a:hover {
            background: #B6FF5C;
            border-color: #B6FF5C;
            color: black;
            transform: translateY(-3px);
        }

        .footer-social svg {
            width: 20px;
            height: 20px;
        }

        .footer-column h4 {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #B6FF5C;
            margin-bottom: 1.5rem;
            font-weight: 500;
        }

        .footer-column ul {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }

        .footer-column a {
            color: rgba(255,255,255,0.6);
            text-decoration: none;
            font-size: 14px;
            transition: all 0.3s ease;
            display: inline-block;
        }

        .footer-column a:hover {
            color: white;
            transform: translateX(5px);
        }

        .footer-bottom {
            max-width: 1200px;
            margin: 4rem auto 0;
            padding-top: 2rem;
            border-top: 1px solid rgba(255,255,255,0.05);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
            position: relative;
            z-index: 1;
        }

        .footer-copyright {
            font-family: monospace;
            font-size: 12px;
            opacity: 0.4;
        }

        .footer-legal {
            display: flex;
            gap: 2rem;
        }

        .footer-legal a {
            font-family: monospace;
            font-size: 12px;
            color: rgba(255,255,255,0.4);
            text-decoration: none;
            transition: color 0.3s ease;
        }

        .footer-legal a:hover {
            color: #B6FF5C;
        }

        .footer-line {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 1px;
            background: linear-gradient(90deg, transparent, #B6FF5C, transparent);
            background-size: 200% 100%;
            animation: shimmer 3s infinite linear;
        }

        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }

        .footer-float {
            position: absolute;
            width: 6px;
            height: 6px;
            background: #B6FF5C;
            border-radius: 50%;
            opacity: 0.3;
            animation: float 6s infinite ease-in-out;
        }

        .footer-float:nth-child(1) { left: 10%; top: 30%; animation-delay: 0s; }
        .footer-float:nth-child(2) { left: 25%; top: 60%; animation-delay: 1s; }
        .footer-float:nth-child(3) { left: 75%; top: 40%; animation-delay: 2s; }
        .footer-float:nth-child(4) { left: 90%; top: 70%; animation-delay: 3s; }
        .footer-float:nth-child(5) { left: 50%; top: 20%; animation-delay: 4s; }

        @keyframes float {
            0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
            50% { transform: translateY(-20px) scale(1.5); opacity: 0.6; }
        }

        /* ========== EPIC MOBILE RESPONSIVE ========== */
        @media (max-width: 1024px) {
            .gallery-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 1.25rem;
            }
        }

        @media (max-width: 900px) {
            .footer-content {
                grid-template-columns: 1fr 1fr;
                gap: 3rem;
            }
            
            .footer-brand {
                grid-column: span 2;
            }
        }

        @media (max-width: 768px) {
            .top-nav {
                padding: 16px 20px;
                grid-template-columns: auto 1fr auto;
                background: rgba(0,0,0,0.95);
            }

            .nav-center-left,
            .nav-center,
            .nav-center-right {
                display: none;
            }

            .nav-logo span {
                display: none;
            }

            .board-section {
                padding: 0 16px;
                margin-top: 90px;
                margin-bottom: 15px;
            }

            .board {
                font-size: 48px;
                width: 100%;
                padding: 1rem 0;
            }

            .board__content {
                animation: marquee 10s linear infinite;
            }

            .board__content .text {
                padding: 0 1.5rem;
            }

            .page-content {
                padding-top: 80px;
            }

            .gallery-section {
                padding: 0 1rem;
            }

            .gallery-title {
                font-size: clamp(2rem, 10vw, 3rem);
            }

            .gallery-subtitle {
                font-size: 13px;
                padding: 0 0.5rem;
                text-align: center;
            }

            .row-label {
                margin-top: 2rem;
                font-size: 10px;
            }

            .gallery-grid {
                grid-template-columns: 1fr;
                gap: 1.5rem;
                max-width: 400px;
            }

            .gallery-card {
                aspect-ratio: 4/5;
                border-radius: 24px;
            }

            .gallery-card-content {
                padding: 1.5rem;
                transform: translateY(0);
                opacity: 1;
            }

            .gallery-card-number {
                font-size: 3rem;
                top: 1rem;
                left: 1rem;
            }

            .gallery-card-title {
                font-size: 1.75rem;
            }

            .gallery-card-desc {
                font-size: 12px;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .contact-section {
                flex-direction: column;
                gap: 3rem;
                padding: 4rem 1.5rem;
            }

            .keypad {
                order: 1;
                width: 280px;
            }

            .contact-content {
                order: 2;
                text-align: center;
            }

            .contact-content h2 {
                font-size: 1.75rem;
            }

            .contact-form {
                flex-direction: column;
            }

            .contact-form button {
                width: 100%;
            }
        }

        @media (max-width: 600px) {
            .footer-content {
                grid-template-columns: 1fr;
                gap: 2.5rem;
                text-align: center;
            }
            
            .footer-brand {
                grid-column: span 1;
                align-items: center;
            }
            
            .footer-tagline {
                text-align: center;
            }
            
            .footer-social {
                justify-content: center;
            }
            
            .footer-column h4 {
                text-align: center;
            }
            
            .footer-column ul {
                align-items: center;
            }
            
            .footer-column a:hover {
                transform: translateX(0);
            }
            
            .footer-bottom {
                flex-direction: column;
                text-align: center;
            }
            
            .footer-legal {
                justify-content: center;
                flex-wrap: wrap;
                gap: 1rem;
            }
            
            .footer::before {
                font-size: 80px;
                bottom: -5%;
            }
        }

        @media (max-width: 480px) {
            body::before {
                --size: 30px;
            }

            .top-nav {
                padding: 12px 16px;
            }

            .nav-logo-img {
                width: 32px;
                height: 32px;
            }

            .board-section {
                margin-top: 70px;
            }

            .board {
                font-size: 36px;
                border-radius: 2px;
            }

            .board__content {
                animation: marquee 8s linear infinite;
            }

            .board__content .text {
                padding: 0 1rem;
            }

            .rivet {
                width: 6px;
            }

            .page-content {
                padding-top: 60px;
            }

            .gallery-header {
                margin-bottom: 0.5rem;
            }

            .gallery-card {
                aspect-ratio: 3/4;
                border-radius: 20px;
            }

            .gallery-card-tag {
                font-size: 9px;
                padding: 0.3rem 0.75rem;
            }

            .gallery-card-title {
                font-size: 1.5rem;
            }

            .contact-section {
                padding: 3rem 1rem;
            }

            .contact-content h2 {
                font-size: 1.5rem;
            }

            .contact-content p {
                font-size: 14px;
            }

            .keypad {
                width: 240px;
            }
        }

        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
            .gallery-card-content {
                transform: translateY(0);
                opacity: 1;
            }

            .gallery-card:hover {
                transform: none;
            }

            .gallery-card:active {
                transform: scale(0.98);
            }

            .gallery-card:hover img {
                transform: none;
            }
        }

        /* Landscape mobile */
        @media (max-height: 500px) and (orientation: landscape) {
            .board-section {
                margin-top: 80px;
                margin-bottom: 10px;
            }

            .board {
                font-size: 40px;
                padding: 0.8rem 0;
            }

            .page-content {
                padding-top: 60px;
            }

            .gallery-grid {
                grid-template-columns: repeat(3, 1fr);
            }

            .gallery-card {
                aspect-ratio: 1;
            }
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

   <nav class="top-nav" id="topNav">
    <div class="nav-left">
        <a href="/" class="nav-logo">
            <img src="https://i.ibb.co/VWs7tk3q/605997942-17850007239614033-1994629091166485047-n.jpg" alt="fitup" class="nav-logo-img">
            <span>© fitup</span>
        </a>
    </div>
    
    <div class="nav-center-left">
        <a href="/contact" class="nav-menu-item">Contact Us</a>
        <a href="/gallerie" class="nav-menu-item active">Gallerie</a>
    </div>
    
    <div class="nav-center">
        <div class="nav-stripe-cluster">
            <div class="stripe"></div><div class="stripe"></div><div class="stripe"></div><div class="stripe"></div><div class="stripe"></div><div class="stripe"></div><div class="stripe"></div><div class="stripe"></div><div class="stripe"></div><div class="stripe"></div><div class="stripe"></div><div class="stripe"></div><div class="stripe"></div><div class="stripe"></div><div class="stripe"></div><div class="stripe"></div><div class="stripe"></div><div class="stripe"></div><div class="stripe"></div><div class="stripe"></div><div class="stripe"></div><div class="stripe"></div><div class="stripe"></div><div class="stripe"></div><div class="stripe"></div><div class="stripe"></div><div class="stripe"></div><div class="stripe"></div><div class="stripe"></div><div class="stripe"></div>
        </div>
    </div>
    
    <div class="nav-center-right"></div>
    
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


    <!-- LED Board Section - GREEN -->
    <section class="board-section">
        <div class="board-container">
            <div class="rivets">
                <div class="rivet"></div>
                <div class="rivet"></div>
                <div class="rivet"></div>
                <div class="rivet"></div>
            </div>
            <div class="board">
                <div class="board__content">
                    <span class="text">FITUP's Gallery</span>
                    <span class="text">•</span>
                    <span class="text">FITUP's Gallery</span>
                    <span class="text">•</span>
                </div>
            </div>
        </div>
    </section>

    <main class="page-content">
        <section class="gallery-section">
            
            <div class="gallery-header">
                <h1 class="gallery-title" data-content="gallery.title">${getContent('gallery', 'title', 'moments captured')}</h1>
                <p class="gallery-subtitle" data-content="gallery.subtitle">${getContent('gallery', 'subtitle', 'A visual journey through style, culture, and timeless elegance. Each frame tells a story of authenticity and creative expression.')}</p>
            </div>

            <!-- Row 1 - Featured Collection -->
            <p class="row-label" data-content="gallery.row1_label">${getContent('gallery', 'row1_label', 'Featured Collection')}</p>
            <div class="gallery-grid">
${featuredCardsHTML}
            </div>

            <!-- Row 2 - L7erfa Collection -->
            <p class="row-label" data-content="gallery.row2_label">${getContent('gallery', 'row2_label', "L7erfa Collection")}</p>
            <div class="gallery-grid">
${l7erfaCardsHTML}
            </div>

        </section>

        <!-- Contact Section with Keypad -->
        <section class="contact-section">
            <div class="contact-content">
                <h2>Créons ensemble.<br />Partageons votre vision.</h2>
                <p>
                    Inscrivez-vous à notre newsletter pour découvrir les coulisses de nos créations, 
                    nos conseils marketing exclusifs, et les dernières tendances qui font la différence.
                </p>
                <form class="contact-form" onsubmit="event.preventDefault()">
                    <input type="email" required placeholder="votre@email.com" />
                    <button type="submit">S'inscrire</button>
                </form>
            </div>
            
            <div class="keypad">
                <div class="keypad__base">
                    <img src="https://assets.codepen.io/605876/keypad-base.png?format=auto&quality=86" alt="" />
                </div>
                <button id="one" class="key keypad__single keypad__single--left">
                    <span class="key__mask">
                        <span class="key__content">
                            <span class="key__text">FIT</span>
                            <img src="https://fitup.ma/Mediafitup/uploads/logos/20260121_183245_dda1a2deb4f3aece944225134a055a48_96fa7d3d-0e7f-43a2-b11d-01bb1fc54083-removebg-preview.png" alt="" />
                        </span>
                    </span>
                </button>
                <button id="two" class="key keypad__single">
                    <span class="key__mask">
                        <span class="key__content">
                            <span class="key__text">UP</span>
                            <img src="https://assets.codepen.io/605876/keypad-single.png?format=auto&quality=86" alt="" />
                        </span>
                    </span>
                </button>
                <button id="three" class="key keypad__double">
                    <span class="key__mask">
                        <span class="key__content">
                            <span class="key__text">Connect</span>
                            <img src="https://assets.codepen.io/605876/keypad-double.png?format=auto&quality=86" alt="" />
                        </span>
                    </span>
                </button>
            </div>
        </section>

    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer-line"></div>
        
        <div class="footer-float"></div>
        <div class="footer-float"></div>
        <div class="footer-float"></div>
        <div class="footer-float"></div>
        <div class="footer-float"></div>
        
        <div class="footer-content">
            <div class="footer-brand">
                <a href="/" class="footer-logo">
                    <img src="https://i.ibb.co/VWs7tk3q/605997942-17850007239614033-1994629091166485047-n.jpg" alt="fitup">
                    <span>FITUP</span>
                </a>
                <p class="footer-tagline">
                    Agence créative basée au Maroc. Nous transformons vos idées en expériences visuelles mémorables.
                </p>
                <div class="footer-social">
                    <a href="#" aria-label="Instagram">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                        </svg>
                    </a>
                    <a href="#" aria-label="TikTok">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
                        </svg>
                    </a>
                    <a href="#" aria-label="LinkedIn">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                            <rect width="4" height="12" x="2" y="9"/>
                            <circle cx="4" cy="4" r="2"/>
                        </svg>
                    </a>
                    <a href="https://wa.me/212770259572" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                        </svg>
                    </a>
                </div>
            </div>
            
            <div class="footer-column">
                <h4>Navigation</h4>
                <ul>
                    <li><a href="/">Accueil</a></li>
                    <li><a href="/gallerie">Galerie</a></li>
                    <li><a href="/#services">Services</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
            </div>
            
            <div class="footer-column">
                <h4>Services</h4>
                <ul>
                    <li><a href="#">Branding</a></li>
                    <li><a href="#">Social Media</a></li>
                    <li><a href="#">Photographie</a></li>
                    <li><a href="#">Vidéo</a></li>
                    <li><a href="#">Design Web</a></li>
                </ul>
            </div>
            
            <div class="footer-column">
                <h4>Contact</h4>
                <ul>
                    <li><a href="mailto:${getContent('footer', 'email', 'hello@fitup.ma')}">${getContent('footer', 'email', 'hello@fitup.ma')}</a></li>
                    <li><a href="tel:+212770259572">+212 7 70 25 95 72</a></li>
                    <li><a href="#">Casablanca, Maroc</a></li>
                </ul>
            </div>
        </div>
        
        <div class="footer-bottom">
            <p class="footer-copyright">© 2026 FITUP. Tous droits réservés.</p>
            <div class="footer-legal">
                <a href="#">Politique de confidentialité</a>
                <a href="#">Mentions légales</a>
                <a href="#">CGV</a>
            </div>
        </div>
    </footer>

    <script>
        // Side menu functionality
        const menuBtn = document.getElementById('menuBtn');
        const sideMenu = document.getElementById('sideMenu');
        const sideMenuOverlay = document.getElementById('sideMenuOverlay');
        const sideMenuClose = document.getElementById('sideMenuClose');

        function openMenu() {
            sideMenu.classList.add('active');
            sideMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            sideMenu.classList.remove('active');
            sideMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        menuBtn.addEventListener('click', openMenu);
        sideMenuClose.addEventListener('click', closeMenu);
        sideMenuOverlay.addEventListener('click', closeMenu);

        // Keypad interaction
        const keypadButtons = document.querySelectorAll('.keypad .key');

        keypadButtons.forEach(button => {
            button.addEventListener('pointerdown', () => {
                button.dataset.pressed = 'true';
            });
            
            button.addEventListener('pointerup', () => {
                button.dataset.pressed = 'false';
            });
            
            button.addEventListener('pointerleave', () => {
                button.dataset.pressed = 'false';
            });
        });

        // Keyboard shortcuts
        window.addEventListener('keydown', (event) => {
            if (event.key === 'f' || event.key === 'F') {
                document.querySelector('#one').dataset.pressed = 'true';
            }
            if (event.key === 'u' || event.key === 'U') {
                document.querySelector('#two').dataset.pressed = 'true';
            }
            if (event.key === 'Enter') {
                document.querySelector('#three').dataset.pressed = 'true';
            }
        });

        window.addEventListener('keyup', (event) => {
            if (event.key === 'f' || event.key === 'F') {
                document.querySelector('#one').dataset.pressed = 'false';
            }
            if (event.key === 'u' || event.key === 'U') {
                document.querySelector('#two').dataset.pressed = 'false';
            }
            if (event.key === 'Enter') {
                document.querySelector('#three').dataset.pressed = 'false';
            }
        });

        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.gallery-card').forEach(card => {
            card.style.animationPlayState = 'paused';
            observer.observe(card);
        });
    </script>
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
</div>
</body>
</html>`;
}
