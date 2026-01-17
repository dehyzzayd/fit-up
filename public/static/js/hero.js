// Three.js Hero Animation
import * as THREE from "three";
import { FontLoader } from "jsm/loaders/FontLoader.js";
import { TextGeometry } from "jsm/geometries/TextGeometry.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector(".webgl"),
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 1);

// Load font and create text
const fontLoader = new FontLoader();
fontLoader.load(
  "https://raw.githubusercontent.com/danielyl123/person/refs/heads/main/fonts/helvetiker_regular.typeface.json",
  (font) => {
    const textGeometry = new TextGeometry("Where Brands Win.", {
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

// Create iridescent torus
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

// Resize handler
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
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

console.log("Three.js hero loaded");
