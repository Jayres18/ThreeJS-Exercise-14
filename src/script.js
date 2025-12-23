import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
// AMBIENT LIGHT - gives a glow effect to the mesh
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // Parameters: Color of Light and Intensity of Light
scene.add(ambientLight);
// gui.add(ambientLight, "intensity").min(1).max(3).step(0.001); // AmbientLight Tweaks for the intensity of Light

// DIRECTIONAL LIGHT - gives a spotlight effect. The light will came from a sigle direction
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.9); // Parameters: Color of Light and Intensity of Light
scene.add(directionalLight);
directionalLight.position.set(1, 0.25, 0);

// HEMISPHERE LIGHT - gives a light from two direction (up and down direction)
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 1); // Parameters: SkyColor, GroundColor and Intensity of Light
scene.add(hemisphereLight);

// POINT LIGHT - gives a light at a single point like a compressed sun that shines on every direction
const pointLight = new THREE.PointLight(0xff9000, 0.05, 10, 4); // Parameters: Color of Light, Intensity of Light, Distance of Light, and how fast the Light Decay
pointLight.position.set(1, -0.5, 1);
scene.add(pointLight);

// RECT AREA LIGHT - it only works on MeshStandardMaterial.
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 6, 1, 1); // Parameters: Color of Light, Intensity of Light, Width of Light, and Height of Light
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new THREE.Vector3());
scene.add(rectAreaLight);

// SPOT LIGHT - gives a flashlight effect.
const spotLight = new THREE.SpotLight(0x78ff00, 4, 6, Math.PI * 0.1, 0.25, 1); // Parameters: Color, Intensity, Distance, Angle, Penumbra, and Decay
spotLight.position.set(0, 2, 3);
scene.add(spotLight);
// To move the spotlight, you need to use the "target" property then add it to the scene after moving because it is a seperate Object3D
spotLight.target.position.x = -1.5;
scene.add(spotLight.target);

/**
 * Helpers
 */
const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  0.2
);
scene.add(hemisphereLightHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
);
scene.add(directionalLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
