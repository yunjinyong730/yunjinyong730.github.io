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
renderer.toneMappingExposure = 1.16;
renderer.domElement.className = "three-slime-canvas";
renderer.domElement.setAttribute("aria-hidden", "true");
stage.prepend(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 100);
camera.position.set(0, 0.08, 5.5);
camera.lookAt(0, 0, 0);

scene.add(new THREE.HemisphereLight(0xfbfdff, 0xc5d2ef, 2.65));
const keyLight = new THREE.DirectionalLight(0xffffff, 4.7);
keyLight.position.set(-3.4, 4.3, 5.8);
scene.add(keyLight);
const rimLight = new THREE.PointLight(0x74d8ff, 20, 7, 2);
rimLight.position.set(2.65, 0.8, 2.9);
scene.add(rimLight);
const violetLight = new THREE.PointLight(0xc6a6ff, 10, 6, 2);
violetLight.position.set(-2.5, -0.7, 1.9);
scene.add(violetLight);

const slimeRoot = new THREE.Group();
slimeRoot.position.y = -0.05;
scene.add(slimeRoot);

const bodyMaterial = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color("#8da8ff"),
  roughness: 0.16,
  metalness: 0,
  transmission: 0.46,
  transparent: true,
  opacity: 0.88,
  thickness: 1.3,
  ior: 1.23,
  clearcoat: 1,
  clearcoatRoughness: 0.08,
  emissive: new THREE.Color("#2748a7"),
  emissiveIntensity: 0.10,
});

const bodyGeometry = new THREE.SphereGeometry(1.08, 56, 44);
const bodyPosition = bodyGeometry.attributes.position;
for (let i = 0; i < bodyPosition.count; i += 1) {
  const x = bodyPosition.getX(i);
  const y = bodyPosition.getY(i);
  const z = bodyPosition.getZ(i);
  let px = x * 1.09;
  let py = y;
  let pz = z * 0.90;
  if (y > 0) {
    px *= 0.96;
    pz *= 0.96;
    py *= 1.01;
  } else {
    const spread = 1 + Math.abs(y) * 0.16;
    px *= spread;
    pz *= 1 + Math.abs(y) * 0.05;
    py *= 0.84;
  }
  if (Math.abs(y) < 0.22) px *= 1.035;
  if (py < -0.69) py = -0.69 + (py + 0.69) * 0.30;
  bodyPosition.setXYZ(i, px, py, pz);
}
bodyPosition.needsUpdate = true;
bodyGeometry.computeVertexNormals();

const basePositions = new Float32Array(bodyPosition.array);
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.position.y = -0.04;
slimeRoot.add(body);

const lobeGeometry = new THREE.SphereGeometry(0.31, 28, 22);
const leftLobe = new THREE.Mesh(lobeGeometry, bodyMaterial);
leftLobe.position.set(-1.01, -0.27, 0.01);
leftLobe.scale.set(0.78, 0.54, 0.72);
slimeRoot.add(leftLobe);
const rightLobe = new THREE.Mesh(lobeGeometry, bodyMaterial);
rightLobe.position.set(1.01, -0.24, 0.03);
rightLobe.scale.set(0.76, 0.52, 0.70);
slimeRoot.add(rightLobe);

const core = new THREE.Group();
core.position.set(0, -0.20, 0.00);
slimeRoot.add(core);
const coreHalo = new THREE.Mesh(
  new THREE.SphereGeometry(0.34, 30, 24),
  new THREE.MeshBasicMaterial({ color: 0x76e5ff, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending, depthWrite: false }),
);
core.add(coreHalo);
const coreSphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.17, 24, 18),
  new THREE.MeshBasicMaterial({ color: 0xd6fbff, transparent: true, opacity: 0.94, blending: THREE.AdditiveBlending, depthWrite: false }),
);
core.add(coreSphere);

const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x93e5ff, transparent: true, opacity: 0.48, blending: THREE.AdditiveBlending, depthWrite: false });
for (let i = 0; i < 3; i += 1) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.35 + i * 0.09, 0.007, 8, 72), ringMaterial);
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
const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0xf0feff, transparent: true, opacity: 0.88, blending: THREE.AdditiveBlending, depthWrite: false });
neuralPositions.forEach(([x, y, z], index) => {
  const node = new THREE.Mesh(new THREE.SphereGeometry(index < 4 ? 0.027 : 0.021, 12, 10), nodeMaterial);
  node.position.set(x, y, z);
  neuralNodes.push(node);
  neuralGroup.add(node);
});

const edgePositions = [];
const connect = (a, b) => edgePositions.push(...neuralPositions[a], ...neuralPositions[b]);
[[0,4],[0,6],[0,8],[1,4],[1,7],[1,10],[2,5],[2,6],[2,11],[3,5],[3,7],[3,9],[4,8],[4,10],[5,9],[5,11],[8,9],[10,11]].forEach(([a, b]) => connect(a, b));
const edgeGeometry = new THREE.BufferGeometry();
edgeGeometry.setAttribute("position", new THREE.Float32BufferAttribute(edgePositions, 3));
const edgeLines = new THREE.LineSegments(edgeGeometry, new THREE.LineBasicMaterial({ color: 0xc9f7ff, transparent: true, opacity: 0.40, blending: THREE.AdditiveBlending, depthWrite: false }));
neuralGroup.add(edgeLines);

const faceGroup = new THREE.Group();
faceGroup.position.z = 0.01;
slimeRoot.add(faceGroup);

const eyeWhiteMaterial = new THREE.MeshBasicMaterial({ color: 0xf8fdff });
const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x203a8f });
const eyeHighlightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const makeEye = (x) => {
  const group = new THREE.Group();
  group.position.set(x, 0.28, 0.92);
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.155, 28, 22), eyeWhiteMaterial);
  eye.scale.set(0.92, 1.18, 0.42);
  group.add(eye);
  const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.072, 20, 16), pupilMaterial);
  pupil.position.set(0, -0.005, 0.13);
  pupil.scale.set(0.94, 1.08, 0.52);
  group.add(pupil);
  const highlight = new THREE.Mesh(new THREE.SphereGeometry(0.022, 12, 10), eyeHighlightMaterial);
  highlight.position.set(-0.024, 0.030, 0.18);
  group.add(highlight);
  return { group, eye, pupil, highlight };
};
const leftEye = makeEye(-0.245);
const rightEye = makeEye(0.245);
faceGroup.add(leftEye.group, rightEye.group);

const blushMaterial = new THREE.MeshBasicMaterial({ color: 0xffcfe0, transparent: true, opacity: 0.48, depthWrite: false });
const blushGeometry = new THREE.SphereGeometry(0.075, 18, 14);
const makeBlush = (x) => {
  const blush = new THREE.Mesh(blushGeometry, blushMaterial.clone());
  blush.position.set(x, 0.00, 0.90);
  blush.scale.set(1.45, 0.62, 0.35);
  return blush;
};
const blushLeft = makeBlush(-0.43);
const blushRight = makeBlush(0.43);
faceGroup.add(blushLeft, blushRight);

const smileMaterial = new THREE.MeshBasicMaterial({ color: 0x193477, transparent: true, opacity: 1 });
const smile = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.018, 10, 36, Math.PI), smileMaterial);
smile.position.set(0, 0.015, 0.995);
smile.rotation.z = Math.PI;
faceGroup.add(smile);

const surpriseMouthMaterial = new THREE.MeshBasicMaterial({ color: 0x193477, transparent: true, opacity: 0 });
const surpriseMouth = new THREE.Mesh(new THREE.SphereGeometry(0.065, 18, 14), surpriseMouthMaterial);
surpriseMouth.position.set(0, -0.015, 0.996);
surpriseMouth.scale.set(0.82, 1.15, 0.28);
faceGroup.add(surpriseMouth);

const orbitGroup = new THREE.Group();
slimeRoot.add(orbitGroup);
const orbitLineMaterial = new THREE.MeshBasicMaterial({ color: 0x80bfff, transparent: true, opacity: 0.24, depthWrite: false });
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
const orbitNodeMaterial = new THREE.MeshPhysicalMaterial({ color: 0xb3e8ff, emissive: 0x4387f7, emissiveIntensity: 0.65, transparent: true, opacity: 0.90, roughness: 0.08, transmission: 0.1 });
[[1.24,0.52,0.1,0.07],[-1.31,0.22,0.12,0.055],[0.82,-1.01,0.17,0.05],[-0.72,1.08,0,0.045],[1.36,-0.18,-0.13,0.04],[-1.03,-0.74,-0.08,0.04]].forEach(([x, y, z, r]) => {
  const node = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), orbitNodeMaterial);
  node.position.set(x, y, z);
  orbitNodes.push(node);
  orbitGroup.add(node);
});

const particleCount = 46;
const particleArray = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i += 1) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 1.2 + Math.random() * 0.52;
  particleArray[i * 3] = Math.cos(angle) * radius;
  particleArray[i * 3 + 1] = (Math.random() - 0.5) * 2.18;
  particleArray[i * 3 + 2] = (Math.random() - 0.5) * 0.86 - 0.15;
}
const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute("position", new THREE.BufferAttribute(particleArray, 3));
const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0xb7e7ff, size: 0.023, transparent: true, opacity: 0.36, sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false }));
slimeRoot.add(particles);

const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.84, 48), new THREE.MeshBasicMaterial({ color: 0x4169ba, transparent: true, opacity: 0.09, depthWrite: false }));
shadow.rotation.x = -Math.PI / 2;
shadow.scale.y = 0.34;
shadow.position.set(0, -1.15, -0.1);
scene.add(shadow);

let targetRotX = 0;
let targetRotY = 0;
let currentRotX = 0;
let currentRotY = 0;
let hoverAmount = 0;
let targetHover = 0;
let pointerX = 0;
let pointerY = 0;
let bounceStartedAt = -10000;
let surpriseStartedAt = -10000;
let blinkStartedAt = -10000;
let nextBlinkAt = performance.now() + 1800 + Math.random() * 1800;
let lastTime = performance.now();
let frame = 0;

stage.addEventListener("pointermove", (event) => {
  const rect = stage.getBoundingClientRect();
  const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
  const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  pointerX = THREE.MathUtils.clamp(nx, -1, 1);
  pointerY = THREE.MathUtils.clamp(ny, -1, 1);
  targetRotY = pointerX * 0.13;
  targetRotX = -pointerY * 0.075;
}, { passive: true });
stage.addEventListener("pointerenter", () => { targetHover = 1; }, { passive: true });
stage.addEventListener("pointerleave", () => {
  targetHover = 0;
  pointerX = 0;
  pointerY = 0;
  targetRotX = 0;
  targetRotY = 0;
}, { passive: true });
stage.addEventListener("click", () => {
  const now = performance.now();
  bounceStartedAt = now;
  surpriseStartedAt = now;
});

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
  const wobble = 0.020 + hoverAmount * 0.010;
  const stretchY = 1 + squish * 0.12;
  const squashXZ = 1 - squish * 0.055;
  for (let i = 0; i < array.length; i += 3) {
    const x = basePositions[i];
    const y = basePositions[i + 1];
    const z = basePositions[i + 2];
    const waveA = Math.sin(time * 1.35 + y * 4.0 + x * 2.0) * wobble;
    const waveB = Math.sin(time * 1.0 + z * 4.2 - x * 1.8) * wobble * 0.56;
    const lowerJiggle = y < -0.18 ? Math.sin(time * 1.8 + x * 3.4) * 0.010 * (Math.abs(y) + 0.3) : 0;
    const radial = 1 + waveA + waveB + pulse * 0.018;
    let px = x * radial * squashXZ;
    let py = y * stretchY + Math.sin(time * 1.18 + x * 4.2) * 0.012 + lowerJiggle;
    let pz = z * radial * squashXZ;
    if (py < -0.69) py = -0.69 + (py + 0.69) * 0.30;
    if (y < -0.30) px *= 1.018 + (Math.abs(y) - 0.30) * 0.018;
    array[i] = px;
    array[i + 1] = py;
    array[i + 2] = pz;
  }
  bodyPosition.needsUpdate = true;
  if (frame % 3 === 0) bodyGeometry.computeVertexNormals();
};

const animate = (now) => {
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;
  const t = now / 1000;
  frame += 1;

  currentRotX += (targetRotX - currentRotX) * Math.min(1, dt * 5.2);
  currentRotY += (targetRotY - currentRotY) * Math.min(1, dt * 5.2);
  hoverAmount += (targetHover - hoverAmount) * Math.min(1, dt * 6);

  if (!reducedMotion && now >= nextBlinkAt) {
    blinkStartedAt = now;
    nextBlinkAt = now + 2600 + Math.random() * 2600;
  }
  const blinkAge = (now - blinkStartedAt) / 1000;
  const blinkAmount = (!reducedMotion && blinkAge >= 0 && blinkAge < 0.18) ? Math.sin((blinkAge / 0.18) * Math.PI) : 0;

  const bounceAge = (now - bounceStartedAt) / 1000;
  const bounceActive = bounceAge >= 0 && bounceAge < 0.78;
  const bounceEnvelope = bounceActive ? Math.sin((bounceAge / 0.78) * Math.PI) : 0;
  const bounceY = bounceActive ? Math.sin((bounceAge / 0.78) * Math.PI * 2.05) * 0.12 * bounceEnvelope : 0;
  const squish = bounceActive ? Math.sin((bounceAge / 0.78) * Math.PI * 2.05 + Math.PI / 2) * 0.20 * bounceEnvelope : 0;

  const surpriseAge = (now - surpriseStartedAt) / 1000;
  const surpriseAmount = surpriseAge >= 0 && surpriseAge < 0.62 ? Math.max(0, 1 - surpriseAge / 0.62) : 0;
  const happyAmount = Math.min(1, hoverAmount + bounceEnvelope * 0.45);
  const idleY = reducedMotion ? 0 : Math.sin(t * 1.34) * 0.050;
  const pulse = reducedMotion ? 0.25 : (Math.sin(t * 2.05) + 1) * 0.5;
  const breath = reducedMotion ? 1 : 1 + Math.sin(t * 1.55) * 0.009;

  slimeRoot.position.y = -0.05 + idleY + Math.max(0, bounceY);
  slimeRoot.rotation.x = currentRotX;
  slimeRoot.rotation.y = currentRotY;
  slimeRoot.rotation.z = reducedMotion ? 0 : Math.sin(t * 0.72) * 0.014;
  slimeRoot.scale.set(1 - squish * 0.055, breath + squish * 0.08, 1 - squish * 0.055);

  leftLobe.position.y = -0.27 + Math.sin(t * 1.45 + 0.8) * 0.022;
  rightLobe.position.y = -0.24 + Math.sin(t * 1.35 + 2.2) * 0.026;
  leftLobe.scale.x = 0.78 + Math.sin(t * 1.5) * 0.018;
  rightLobe.scale.x = 0.76 + Math.sin(t * 1.4 + 1.2) * 0.020;

  core.scale.setScalar(0.97 + pulse * 0.085 + hoverAmount * 0.035);
  core.rotation.y += reducedMotion ? 0 : dt * (0.28 + hoverAmount * 0.22);
  core.rotation.z -= reducedMotion ? 0 : dt * 0.10;
  coreHalo.material.opacity = 0.10 + pulse * 0.12 + hoverAmount * 0.04;
  coreSphere.material.opacity = 0.76 + pulse * 0.20;
  neuralNodes.forEach((node, index) => node.scale.setScalar(reducedMotion ? 1 : 0.88 + Math.sin(t * 2.2 + index * 0.68) * 0.14));
  edgeLines.material.opacity = 0.26 + pulse * 0.18;

  orbitGroup.rotation.z += reducedMotion ? 0 : dt * (0.13 + hoverAmount * 0.12);
  orbitGroup.rotation.y += reducedMotion ? 0 : dt * 0.045;
  orbitNodes.forEach((node, index) => node.scale.setScalar(0.90 + Math.sin(t * 1.8 + index) * 0.10));
  particles.rotation.z -= reducedMotion ? 0 : dt * 0.034;
  particles.rotation.y += reducedMotion ? 0 : dt * 0.020;

  const pupilX = pointerX * 0.040;
  const pupilY = -pointerY * 0.027;
  [leftEye, rightEye].forEach((eye) => {
    eye.pupil.position.x += (pupilX - eye.pupil.position.x) * Math.min(1, dt * 10);
    eye.pupil.position.y += ((-0.005 + pupilY) - eye.pupil.position.y) * Math.min(1, dt * 10);
  });

  const eyeOpen = Math.max(0.08, 1 - blinkAmount * 0.93);
  const happySquint = 1 - happyAmount * 0.055;
  const surpriseGrow = 1 + surpriseAmount * 0.16;
  leftEye.eye.scale.set(0.92 * surpriseGrow, 1.18 * eyeOpen * happySquint * surpriseGrow, 0.42);
  rightEye.eye.scale.set(0.92 * surpriseGrow, 1.18 * eyeOpen * happySquint * surpriseGrow, 0.42);
  leftEye.pupil.scale.set(0.94, 1.08 * eyeOpen, 0.52);
  rightEye.pupil.scale.set(0.94, 1.08 * eyeOpen, 0.52);
  leftEye.highlight.scale.y = eyeOpen;
  rightEye.highlight.scale.y = eyeOpen;

  const cheekGlow = 0.42 + happyAmount * 0.34 + surpriseAmount * 0.12;
  blushLeft.material.opacity = cheekGlow;
  blushRight.material.opacity = cheekGlow;
  blushLeft.scale.x = 1.45 + happyAmount * 0.12;
  blushRight.scale.x = 1.45 + happyAmount * 0.12;

  smile.material.opacity = 1 - surpriseAmount * 0.96;
  smile.scale.x = 1 + happyAmount * 0.25 + bounceEnvelope * 0.08;
  smile.scale.y = 1 + happyAmount * 0.14;
  smile.position.y = 0.015 - happyAmount * 0.008;
  surpriseMouth.material.opacity = surpriseAmount * 0.94;
  surpriseMouth.scale.set(0.82 + surpriseAmount * 0.10, 1.15 + surpriseAmount * 0.26, 0.28);

  bodyMaterial.emissiveIntensity = 0.08 + pulse * 0.07 + hoverAmount * 0.05;
  rimLight.intensity = 18 + pulse * 4 + hoverAmount * 2.5;
  shadow.scale.x = 1 - idleY * 1.6 - Math.max(0, bounceY) * 1.0;
  shadow.material.opacity = Math.max(0.025, 0.085 - Math.max(0, bounceY) * 0.18);

  deformBody(t, pulse, squish);
  renderer.render(scene, camera);
  if (!stage.classList.contains("webgl-ready")) stage.classList.add("webgl-ready");
  requestAnimationFrame(animate);
};

requestAnimationFrame(animate);
