import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const stage = document.getElementById("mascotStage");
if (!stage) throw new Error("AI slime stage not found");

const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
} catch (error) {
  console.warn("WebGL slime unavailable; using CSS mascot fallback.", error);
  throw error;
}

renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.18;
renderer.domElement.className = "three-slime-canvas";
renderer.domElement.setAttribute("aria-hidden", "true");
stage.prepend(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
camera.position.set(0, 0.05, 5.35);
camera.lookAt(0, 0, 0);

scene.add(new THREE.HemisphereLight(0xf7fbff, 0xbcc8e8, 2.45));
const keyLight = new THREE.DirectionalLight(0xffffff, 4.4);
keyLight.position.set(-3.5, 4.2, 5.5);
scene.add(keyLight);
const rimLight = new THREE.PointLight(0x6ec6ff, 21, 7, 2);
rimLight.position.set(2.5, 0.5, 2.8);
scene.add(rimLight);
const violetLight = new THREE.PointLight(0xb38dff, 12, 6, 2);
violetLight.position.set(-2.4, -0.8, 1.8);
scene.add(violetLight);

const slimeRoot = new THREE.Group();
slimeRoot.position.y = -0.02;
scene.add(slimeRoot);

const bodyMaterial = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color("#6689ff"),
  roughness: 0.13,
  metalness: 0,
  transmission: 0.58,
  transparent: true,
  opacity: 0.86,
  thickness: 1.25,
  ior: 1.24,
  clearcoat: 1,
  clearcoatRoughness: 0.07,
  emissive: new THREE.Color("#173c9e"),
  emissiveIntensity: 0.16,
});

const bodyGeometry = new THREE.SphereGeometry(1.08, 48, 38);
bodyGeometry.scale(1.08, 1.02, 0.9);
const bodyPosition = bodyGeometry.attributes.position;
const basePositions = new Float32Array(bodyPosition.array);
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.position.y = -0.03;
slimeRoot.add(body);

const lobeGeometry = new THREE.SphereGeometry(0.38, 28, 22);
const leftLobe = new THREE.Mesh(lobeGeometry, bodyMaterial);
leftLobe.position.set(-0.94, -0.22, 0.02);
leftLobe.scale.set(0.86, 0.7, 0.78);
slimeRoot.add(leftLobe);
const rightLobe = new THREE.Mesh(lobeGeometry, bodyMaterial);
rightLobe.position.set(0.94, -0.18, 0.04);
rightLobe.scale.set(0.82, 0.67, 0.76);
slimeRoot.add(rightLobe);

const core = new THREE.Group();
core.position.set(0, -0.18, 0.02);
slimeRoot.add(core);
const coreHalo = new THREE.Mesh(
  new THREE.SphereGeometry(0.33, 28, 22),
  new THREE.MeshBasicMaterial({ color: 0x72ddff, transparent: true, opacity: 0.14, blending: THREE.AdditiveBlending, depthWrite: false }),
);
core.add(coreHalo);
const coreSphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.16, 24, 18),
  new THREE.MeshBasicMaterial({ color: 0xc7f8ff, transparent: true, opacity: 0.92, blending: THREE.AdditiveBlending, depthWrite: false }),
);
core.add(coreSphere);

const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x8edfff, transparent: true, opacity: 0.48, blending: THREE.AdditiveBlending, depthWrite: false });
for (let i = 0; i < 3; i += 1) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.34 + i * 0.09, 0.007, 8, 72), ringMaterial);
  ring.rotation.x = Math.PI / 2 + i * 0.48;
  ring.rotation.y = 0.45 + i * 0.82;
  core.add(ring);
}

const neuralGroup = new THREE.Group();
core.add(neuralGroup);
const neuralNodes = [];
const neuralPositions = [
  [-0.34, 0.16, 0.02], [0.28, 0.21, 0.05], [-0.3, -0.18, 0.06], [0.31, -0.15, 0.08],
  [-0.06, 0.34, -0.02], [0.07, -0.35, 0.03], [-0.43, 0.01, -0.03], [0.42, 0.03, 0.02],
  [-0.18, 0.05, 0.24], [0.19, -0.02, 0.22], [0.13, 0.17, -0.2], [-0.12, -0.18, -0.18],
];
const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0xe9fdff, transparent: true, opacity: 0.86, blending: THREE.AdditiveBlending, depthWrite: false });
neuralPositions.forEach(([x, y, z], index) => {
  const node = new THREE.Mesh(new THREE.SphereGeometry(index < 4 ? 0.027 : 0.021, 12, 10), nodeMaterial);
  node.position.set(x, y, z);
  neuralNodes.push(node);
  neuralGroup.add(node);
});

const edgePositions = [];
const connect = (a, b) => edgePositions.push(...neuralPositions[a], ...neuralPositions[b]);
[[0,4],[0,6],[0,8],[1,4],[1,7],[1,10],[2,5],[2,6],[2,11],[3,5],[3,7],[3,9],[4,8],[4,10],[5,9],[5,11],[8,9],[10,11]].forEach(([a,b]) => connect(a,b));
const edgeGeometry = new THREE.BufferGeometry();
edgeGeometry.setAttribute("position", new THREE.Float32BufferAttribute(edgePositions, 3));
const edgeLines = new THREE.LineSegments(edgeGeometry, new THREE.LineBasicMaterial({ color: 0xbef6ff, transparent: true, opacity: 0.38, blending: THREE.AdditiveBlending, depthWrite: false }));
neuralGroup.add(edgeLines);

const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xdffaff });
const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x173071 });
const makeEye = (x) => {
  const group = new THREE.Group();
  group.position.set(x, 0.26, 0.94);
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 18), eyeMaterial);
  eye.scale.set(0.72, 1.18, 0.34);
  group.add(eye);
  const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.042, 16, 12), pupilMaterial);
  pupil.position.set(0, 0, 0.085);
  pupil.scale.set(0.8, 1.1, 0.45);
  group.add(pupil);
  return { group, pupil, eye };
};
const leftEye = makeEye(-0.33);
const rightEye = makeEye(0.33);
slimeRoot.add(leftEye.group, rightEye.group);

const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.018, 8, 32, Math.PI), new THREE.MeshBasicMaterial({ color: 0x14275f }));
mouth.position.set(0, 0.035, 0.982);
mouth.rotation.z = Math.PI;
slimeRoot.add(mouth);

const orbitGroup = new THREE.Group();
slimeRoot.add(orbitGroup);
const orbitLineMaterial = new THREE.MeshBasicMaterial({ color: 0x78b8ff, transparent: true, opacity: 0.28, depthWrite: false });
const orbitRingA = new THREE.Mesh(new THREE.TorusGeometry(1.46, 0.008, 6, 100), orbitLineMaterial);
orbitRingA.scale.y = 0.56;
orbitRingA.rotation.x = Math.PI / 2.6;
orbitRingA.rotation.z = 0.24;
orbitGroup.add(orbitRingA);
const orbitRingB = new THREE.Mesh(new THREE.TorusGeometry(1.28, 0.006, 6, 90), orbitLineMaterial);
orbitRingB.scale.y = 0.72;
orbitRingB.rotation.x = Math.PI / 2.1;
orbitRingB.rotation.y = 0.75;
orbitGroup.add(orbitRingB);

const orbitNodes = [];
const orbitNodeMaterial = new THREE.MeshPhysicalMaterial({ color: 0x9edcff, emissive: 0x4387f7, emissiveIntensity: 0.75, transparent: true, opacity: 0.92, roughness: 0.08, transmission: 0.1 });
[[1.24,0.52,0.1,0.07],[-1.31,0.22,0.12,0.055],[0.82,-1.01,0.17,0.05],[-0.72,1.08,0,0.045],[1.36,-0.18,-0.13,0.04],[-1.03,-0.74,-0.08,0.04]].forEach(([x,y,z,r]) => {
  const node = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), orbitNodeMaterial);
  node.position.set(x, y, z);
  orbitNodes.push(node);
  orbitGroup.add(node);
});

const particleCount = 54;
const particleArray = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i += 1) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 1.2 + Math.random() * 0.55;
  particleArray[i * 3] = Math.cos(angle) * radius;
  particleArray[i * 3 + 1] = (Math.random() - 0.5) * 2.25;
  particleArray[i * 3 + 2] = (Math.random() - 0.5) * 0.9 - 0.15;
}
const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute("position", new THREE.BufferAttribute(particleArray, 3));
const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0xa4dcff, size: 0.025, transparent: true, opacity: 0.42, sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false }));
slimeRoot.add(particles);

const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.82, 48), new THREE.MeshBasicMaterial({ color: 0x315aa8, transparent: true, opacity: 0.10, depthWrite: false }));
shadow.rotation.x = -Math.PI / 2;
shadow.scale.y = 0.36;
shadow.position.set(0, -1.18, -0.1);
scene.add(shadow);

let targetRotX = 0;
let targetRotY = 0;
let currentRotX = 0;
let currentRotY = 0;
let hoverAmount = 0;
let targetHover = 0;
let bounceStartedAt = -10000;
let lastTime = performance.now();
let frame = 0;

stage.addEventListener("pointermove", (event) => {
  const rect = stage.getBoundingClientRect();
  const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
  const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  targetRotY = nx * 0.16;
  targetRotX = -ny * 0.1;
}, { passive: true });
stage.addEventListener("pointerenter", () => { targetHover = 1; }, { passive: true });
stage.addEventListener("pointerleave", () => { targetHover = 0; targetRotX = 0; targetRotY = 0; }, { passive: true });
stage.addEventListener("click", () => { bounceStartedAt = performance.now(); });

const resize = () => {
  const rect = stage.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
};
new ResizeObserver(resize).observe(stage);
resize();

const deformBody = (time, pulse, squish) => {
  if (reducedMotion) return;
  const array = bodyPosition.array;
  const wobble = 0.028 + hoverAmount * 0.012;
  const stretchY = 1 + squish * 0.16;
  const squashXZ = 1 - squish * 0.08;
  for (let i = 0; i < array.length; i += 3) {
    const x = basePositions[i];
    const y = basePositions[i + 1];
    const z = basePositions[i + 2];
    const waveA = Math.sin(time * 1.55 + y * 4.2 + x * 2.3) * wobble;
    const waveB = Math.sin(time * 1.1 + z * 4.8 - x * 2.0) * wobble * 0.62;
    const radial = 1 + waveA + waveB + pulse * 0.025;
    let px = x * radial * squashXZ;
    let py = y * stretchY + Math.sin(time * 1.35 + x * 4.5) * 0.018;
    let pz = z * radial * squashXZ;
    if (py < -0.66) py = -0.66 + (py + 0.66) * 0.38;
    if (y < -0.3) px *= 1.04 + (Math.abs(y) - 0.3) * 0.035;
    array[i] = px;
    array[i + 1] = py;
    array[i + 2] = pz;
  }
  bodyPosition.needsUpdate = true;
  if (frame % 2 === 0) bodyGeometry.computeVertexNormals();
};

const animate = (now) => {
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;
  const t = now / 1000;
  frame += 1;
  currentRotX += (targetRotX - currentRotX) * Math.min(1, dt * 5.5);
  currentRotY += (targetRotY - currentRotY) * Math.min(1, dt * 5.5);
  hoverAmount += (targetHover - hoverAmount) * Math.min(1, dt * 5);

  const bounceAge = (now - bounceStartedAt) / 1000;
  const bounceActive = bounceAge >= 0 && bounceAge < 0.82;
  const bounceEnvelope = bounceActive ? Math.sin((bounceAge / 0.82) * Math.PI) : 0;
  const bounceY = bounceActive ? Math.sin((bounceAge / 0.82) * Math.PI * 2.1) * 0.13 * bounceEnvelope : 0;
  const squish = bounceActive ? Math.sin((bounceAge / 0.82) * Math.PI * 2.1 + Math.PI / 2) * 0.24 * bounceEnvelope : 0;
  const idleY = reducedMotion ? 0 : Math.sin(t * 1.42) * 0.055;
  const pulse = reducedMotion ? 0.25 : (Math.sin(t * 2.25) + 1) * 0.5;
  const breath = reducedMotion ? 1 : 1 + Math.sin(t * 1.7) * 0.012;

  slimeRoot.position.y = -0.02 + idleY + Math.max(0, bounceY);
  slimeRoot.rotation.x = currentRotX;
  slimeRoot.rotation.y = currentRotY;
  slimeRoot.rotation.z = reducedMotion ? 0 : Math.sin(t * 0.8) * 0.018;
  slimeRoot.scale.set(1 - squish * 0.08, breath + squish * 0.11, 1 - squish * 0.08);

  leftLobe.position.y = -0.22 + Math.sin(t * 1.7 + 0.8) * 0.035;
  rightLobe.position.y = -0.18 + Math.sin(t * 1.55 + 2.4) * 0.04;
  leftLobe.rotation.z = Math.sin(t * 1.2) * 0.16;
  rightLobe.rotation.z = -Math.sin(t * 1.1 + 0.9) * 0.18;

  core.scale.setScalar(0.96 + pulse * 0.1 + hoverAmount * 0.06);
  core.rotation.y += reducedMotion ? 0 : dt * (0.32 + hoverAmount * 0.3);
  core.rotation.z -= reducedMotion ? 0 : dt * 0.12;
  coreHalo.material.opacity = 0.11 + pulse * 0.12 + hoverAmount * 0.05;
  coreSphere.material.opacity = 0.76 + pulse * 0.2;
  neuralNodes.forEach((node, index) => node.scale.setScalar(reducedMotion ? 1 : 0.86 + Math.sin(t * 2.4 + index * 0.72) * 0.16));
  edgeLines.material.opacity = 0.28 + pulse * 0.18;

  orbitGroup.rotation.z += reducedMotion ? 0 : dt * (0.16 + hoverAmount * 0.16);
  orbitGroup.rotation.y += reducedMotion ? 0 : dt * 0.055;
  orbitNodes.forEach((node, index) => node.scale.setScalar(0.88 + Math.sin(t * 2 + index) * 0.12));
  particles.rotation.z -= reducedMotion ? 0 : dt * 0.045;
  particles.rotation.y += reducedMotion ? 0 : dt * 0.025;

  const eyeOffsetX = currentRotY * 0.24;
  const eyeOffsetY = -currentRotX * 0.2;
  leftEye.pupil.position.x = eyeOffsetX;
  rightEye.pupil.position.x = eyeOffsetX;
  leftEye.pupil.position.y = eyeOffsetY;
  rightEye.pupil.position.y = eyeOffsetY;
  const blinkPhase = reducedMotion ? 1 : Math.sin(t * 0.68 + 0.7);
  const blinking = blinkPhase > 0.992;
  const eyeScaleY = blinking ? 0.12 : 1;
  leftEye.eye.scale.y = 1.18 * eyeScaleY;
  rightEye.eye.scale.y = 1.18 * eyeScaleY;
  leftEye.pupil.scale.y = 1.1 * eyeScaleY;
  rightEye.pupil.scale.y = 1.1 * eyeScaleY;

  mouth.scale.x = 1 + hoverAmount * 0.18 + bounceEnvelope * 0.12;
  bodyMaterial.emissiveIntensity = 0.13 + pulse * 0.08 + hoverAmount * 0.08;
  rimLight.intensity = 19 + pulse * 5 + hoverAmount * 3;
  shadow.scale.x = 1 - idleY * 1.8 - Math.max(0, bounceY) * 1.2;
  shadow.material.opacity = Math.max(0.025, 0.09 - Math.max(0, bounceY) * 0.22);

  deformBody(t, pulse, squish);
  renderer.render(scene, camera);
  if (!stage.classList.contains("webgl-ready")) stage.classList.add("webgl-ready");
  requestAnimationFrame(animate);
};

requestAnimationFrame(animate);
