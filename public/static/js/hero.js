// Three.js Hero Animation - Mobile Responsive Version
import * as THREE from "three";
import { FontLoader } from "jsm/loaders/FontLoader.js";
import { TextGeometry } from "jsm/geometries/TextGeometry.js";

const scene = new THREE.Scene();

// Calculate responsive camera position based on screen size
function getResponsiveCameraZ() {
  const width = window.innerWidth;
  if (width <= 375) return 8;    // Very small phones (iPhone SE)
  if (width <= 480) return 7;    // Small phones
  if (width <= 768) return 6;    // Large phones / small tablets
  if (width <= 1024) return 5.5; // Tablets
  return 5;                       // Desktop
}

// Calculate responsive text size based on screen width
function getResponsiveTextSize() {
  const width = window.innerWidth;
  if (width <= 375) return 0.35;   // Very small phones
  if (width <= 480) return 0.45;   // Small phones
  if (width <= 600) return 0.55;   // Medium phones
  if (width <= 768) return 0.7;    // Large phones / small tablets
  if (width <= 1024) return 0.85;  // Tablets
  return 1;                         // Desktop
}

// Calculate responsive torus size
function getResponsiveTorusSize() {
  const width = window.innerWidth;
  if (width <= 480) return { radius: 0.4, tube: 0.25 };
  if (width <= 768) return { radius: 0.55, tube: 0.32 };
  return { radius: 0.7, tube: 0.4 };
}

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = getResponsiveCameraZ();

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector(".webgl"),
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 1);

// Store text mesh reference for resizing
let textMesh = null;
let currentFont = null;

// Create text with current font
function createText(font, size) {
  // Remove existing text
  if (textMesh) {
    scene.remove(textMesh);
    textMesh.geometry.dispose();
  }
  
  const textGeometry = new TextGeometry("Where Brands Win.", {
    font,
    size: size,
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
  textMesh = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(textMesh);
}

// Load font and create text
const fontLoader = new FontLoader();
fontLoader.load(
  "https://raw.githubusercontent.com/danielyl123/person/refs/heads/main/fonts/helvetiker_regular.typeface.json",
  (font) => {
    currentFont = font;
    createText(font, getResponsiveTextSize());
  }
);

// Create iridescent torus with responsive size
const torusSizes = getResponsiveTorusSize();
let torusGeometry = new THREE.TorusGeometry(torusSizes.radius, torusSizes.tube, 100, 60);
const torusMaterial = new THREE.MeshPhysicalMaterial();
torusMaterial.metalness = 0;
torusMaterial.roughness = 0;
torusMaterial.iridescence = 1;
torusMaterial.iridescenceIOR = 1.5;
torusMaterial.iridescenceThicknessRange = [100, 324];
torusMaterial.transmission = 1;
torusMaterial.ior = 1.2;
torusMaterial.thickness = 0.8;
let torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.z = 1;
scene.add(torus);

// Function to update torus size
function updateTorusSize() {
  const sizes = getResponsiveTorusSize();
  scene.remove(torus);
  torusGeometry.dispose();
  torusGeometry = new THREE.TorusGeometry(sizes.radius, sizes.tube, 100, 60);
  torus = new THREE.Mesh(torusGeometry, torusMaterial);
  torus.position.z = 1;
  scene.add(torus);
}

// Lights
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

// Animation loop
const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  renderer.render(scene, camera);
  torus.rotation.x = elapsedTime * 0.5;
  torus.rotation.y = elapsedTime * 0.1;
  requestAnimationFrame(tick);
};
tick();

// Debounce function for resize
let resizeTimeout;
function debounce(func, wait) {
  return function executedFunction(...args) {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Resize handler with debounce
const handleResize = debounce(() => {
  // Update camera
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.position.z = getResponsiveCameraZ();
  camera.updateProjectionMatrix();
  
  // Update renderer
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // Update text size if font is loaded
  if (currentFont) {
    createText(currentFont, getResponsiveTextSize());
  }
  
  // Update torus size
  updateTorusSize();
}, 250);

window.addEventListener("resize", handleResize);

// Also handle orientation change
window.addEventListener("orientationchange", () => {
  setTimeout(handleResize, 100);
});

// Scroll fade effect
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

fadeTL.to('.webgl', {
  opacity: 0,
  ease: 'none'
}, 0);

fadeTL.to('#blackFadeOverlay', {
  opacity: 1,
  ease: 'none'
}, 0);

console.log("Three.js hero loaded (mobile responsive)");
