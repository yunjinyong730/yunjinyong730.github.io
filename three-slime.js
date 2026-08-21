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
renderer.toneMappingExposure = 1.08;
renderer.domElement.className = "three-slime-canvas";
renderer.domElement.setAttribute("aria-hidden", "true");
stage.prepend(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
camera.position.set(0, 0.08, 5.65);
camera.lookAt(0, 0.03, 0);

scene.add(new THREE.HemisphereLight(0xffffff, 0xc9ced6, 3.0));
const keyLight = new THREE.DirectionalLight(0xffffff, 5.2);
keyLight.position.set(-3.5, 4.8, 5.8);
scene.add(keyLight);
const softLight = new THREE.PointLight(0xeaf1ff, 15, 7, 2);
softLight.position.set(2.8, 1.0, 2.8);
scene.add(softLight);
const coreLight = new THREE.PointLight(0x82d9ff, 12, 6, 2);
coreLight.position.set(0, -0.35, 1.1);
scene.add(coreLight);

const slimeRoot = new THREE.Group();
slimeRoot.position.y = -0.04;
scene.add(slimeRoot);

// Neutral ghost/slime silhouette.
const bodyGeometry = new THREE.SphereGeometry(1.08, 72, 58);
const bodyPos = bodyGeometry.attributes.position;
for (let i = 0; i < bodyPos.count; i += 1) {
  const x = bodyPos.getX(i);
  const y = bodyPos.getY(i);
  const z = bodyPos.getZ(i);
  let nx = x;
  let ny = y;
  let nz = z;

  if (y > 0.18) {
    nx *= 0.93;
    nz *= 0.93;
    ny *= 1.04;
  } else if (y > -0.22) {
    nx *= 1.015;
    nz *= 1.0;
    ny *= 0.98;
  } else {
    const spread = 1.06 + Math.abs(y + 0.22) * 0.30;
    nx *= spread;
    nz *= spread;
    ny *= 0.84;
  }

  const angle = Math.atan2(z, x);
  if (y < -0.40) {
    const skirt = Math.sin(angle * 3) * 0.035 + Math.cos(angle * 5) * 0.018;
    nx *= 1 + skirt;
    nz *= 1 + skirt;
    ny -= 0.035;
  }

  // Tiny integrated side puffs — no detached arms.
  const sideL = Math.exp(-((x + 0.90) ** 2) * 9 - ((y + 0.02) ** 2) * 12) * 0.10;
  const sideR = Math.exp(-((x - 0.90) ** 2) * 9 - ((y + 0.02) ** 2) * 12) * 0.10;
  nx += x < 0 ? -sideL : sideR;

  bodyPos.setXYZ(i, nx, ny, nz);
}
bodyPos.needsUpdate = true;
bodyGeometry.computeVertexNormals();
const basePositions = new Float32Array(bodyPos.array);

const bodyMaterial = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color("#f2f3f5"),
  roughness: 0.11,
  metalness: 0,
  transmission: 0.72,
  transparent: true,
  opacity: 0.70,
  thickness: 1.65,
  ior: 1.16,
  clearcoat: 1,
  clearcoatRoughness: 0.07,
  emissive: new THREE.Color("#d9dde3"),
  emissiveIntensity: 0.035,
});
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.position.y = -0.02;
slimeRoot.add(body);

// A soft inner mass keeps the transparent body from disappearing on white backgrounds.
const innerShell = new THREE.Mesh(
  bodyGeometry.clone(),
  new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#cfd3d9"),
    roughness: 0.18,
    transmission: 0.45,
    transparent: true,
    opacity: 0.10,
    thickness: 0.8,
    ior: 1.10,
    depthWrite: false,
  }),
);
innerShell.position.copy(body.position);
innerShell.scale.set(0.925, 0.92, 0.91);
slimeRoot.add(innerShell);

// AI neural core — the only strong color accent.
const coreGroup = new THREE.Group();
coreGroup.position.set(0, -0.10, 0.13);
slimeRoot.add(coreGroup);

const coreHalo = new THREE.Mesh(
  new THREE.SphereGeometry(0.38, 30, 24),
  new THREE.MeshBasicMaterial({ color: 0x7bdcff, transparent: true, opacity: 0.10, blending: THREE.AdditiveBlending, depthWrite: false }),
);
coreGroup.add(coreHalo);
const coreSphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.145, 26, 20),
  new THREE.MeshBasicMaterial({ color: 0xeaffff, transparent: true, opacity: 0.96, blending: THREE.AdditiveBlending, depthWrite: false }),
);
coreGroup.add(coreSphere);
const coreGlow = new THREE.Mesh(
  new THREE.SphereGeometry(0.23, 24, 20),
  new THREE.MeshBasicMaterial({ color: 0x5ecbff, transparent: true, opacity: 0.24, blending: THREE.AdditiveBlending, depthWrite: false }),
);
coreGroup.add(coreGlow);

const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x9ddfff, transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending, depthWrite: false });
const coreRings = [];
for (let i = 0; i < 4; i += 1) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.29 + i * 0.075, 0.006, 8, 72), ringMaterial.clone());
  ring.rotation.x = Math.PI / 2 + i * 0.40;
  ring.rotation.y = i * 0.78;
  ring.rotation.z = i * 0.23;
  coreRings.push(ring);
  coreGroup.add(ring);
}

const neuralGroup = new THREE.Group();
coreGroup.add(neuralGroup);
const neuralPositions = [
  [-0.28,0.15,0.02],[0.26,0.18,0.04],[-0.24,-0.12,0.08],[0.25,-0.13,0.08],
  [0,0.29,-0.04],[0,-0.29,0.03],[-0.35,0,-0.03],[0.35,0.02,-0.02],[-0.12,0.08,0.20],[0.14,-0.02,0.21],
];
const neuralNodes = [];
const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0xeaffff, transparent: true, opacity: 0.90, blending: THREE.AdditiveBlending, depthWrite: false });
neuralPositions.forEach(([x,y,z], index) => {
  const node = new THREE.Mesh(new THREE.SphereGeometry(index < 4 ? 0.028 : 0.021, 14, 12), nodeMaterial);
  node.position.set(x,y,z);
  neuralNodes.push(node);
  neuralGroup.add(node);
});
const edgePairs = [[0,4],[1,4],[0,6],[1,7],[2,5],[3,5],[2,6],[3,7],[4,8],[5,9],[8,9],[0,8],[1,9]];
const edgeArray = [];
edgePairs.forEach(([a,b]) => edgeArray.push(...neuralPositions[a], ...neuralPositions[b]));
const edgeGeometry = new THREE.BufferGeometry();
edgeGeometry.setAttribute("position", new THREE.Float32BufferAttribute(edgeArray, 3));
const edgeLines = new THREE.LineSegments(edgeGeometry, new THREE.LineBasicMaterial({ color: 0xaee8ff, transparent: true, opacity: 0.36, blending: THREE.AdditiveBlending, depthWrite: false }));
neuralGroup.add(edgeLines);

// Data motes inside the translucent body.
const moteCount = 44;
const moteArray = new Float32Array(moteCount * 3);
for (let i = 0; i < moteCount; i += 1) {
  const theta = Math.random() * Math.PI * 2;
  const radius = Math.sqrt(Math.random()) * 0.75;
  moteArray[i * 3] = Math.cos(theta) * radius;
  moteArray[i * 3 + 1] = (Math.random() - 0.52) * 1.20;
  moteArray[i * 3 + 2] = (Math.random() - 0.5) * 0.68;
}
const innerMotes = new THREE.Points(
  new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(moteArray, 3)),
  new THREE.PointsMaterial({ color: 0xa9dbef, size: 0.020, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true }),
);
slimeRoot.add(innerMotes);

// Face: single-color black eyes, no pupil/highlight layers.
const faceGroup = new THREE.Group();
faceGroup.position.z = 0.01;
slimeRoot.add(faceGroup);
const faceMaterial = new THREE.MeshBasicMaterial({ color: 0x111214 });
function createEye(x) {
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.105, 24, 18), faceMaterial);
  eye.position.set(x, 0.25, 0.965);
  eye.scale.set(0.72, 1.26, 0.30);
  faceGroup.add(eye);
  return eye;
}
const leftEye = createEye(-0.235);
const rightEye = createEye(0.235);
const smile = new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.015, 10, 36, Math.PI), faceMaterial);
smile.position.set(0, -0.015, 1.006);
smile.rotation.z = Math.PI;
faceGroup.add(smile);
const surpriseMouth = new THREE.Mesh(new THREE.SphereGeometry(0.050, 16, 12), new THREE.MeshBasicMaterial({ color: 0x111214, transparent: true, opacity: 0 }));
surpriseMouth.position.set(0, -0.035, 1.010);
surpriseMouth.scale.set(0.72, 1.05, 0.24);
faceGroup.add(surpriseMouth);

// Quiet external orbit elements keep the AI motif without recoloring the body.
const orbitGroup = new THREE.Group();
slimeRoot.add(orbitGroup);
const orbitLineMaterial = new THREE.MeshBasicMaterial({ color: 0x9fb4c8, transparent: true, opacity: 0.20, depthWrite: false });
const orbitRingA = new THREE.Mesh(new THREE.TorusGeometry(1.42, 0.007, 6, 96), orbitLineMaterial);
orbitRingA.scale.y = 0.56;
orbitRingA.rotation.x = Math.PI / 2.5;
orbitRingA.rotation.z = 0.24;
orbitGroup.add(orbitRingA);
const orbitRingB = new THREE.Mesh(new THREE.TorusGeometry(1.22, 0.006, 6, 90), orbitLineMaterial.clone());
orbitRingB.scale.y = 0.74;
orbitRingB.rotation.x = Math.PI / 2.1;
orbitRingB.rotation.y = 0.8;
orbitGroup.add(orbitRingB);
const orbitNodeMaterial = new THREE.MeshPhysicalMaterial({ color: 0xd7e3eb, emissive: 0x78cfff, emissiveIntensity: 0.30, transparent: true, opacity: 0.72, roughness: 0.12, transmission: 0.25 });
const orbitNodes = [];
[[1.24,0.52,0.06,0.065],[-1.26,0.26,0.10,0.050],[0.82,-1.00,0.16,0.045],[-0.72,1.02,0,0.042]].forEach(([x,y,z,r]) => {
  const node = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), orbitNodeMaterial);
  node.position.set(x,y,z);
  orbitNodes.push(node);
  orbitGroup.add(node);
});

const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.82, 48), new THREE.MeshBasicMaterial({ color: 0x626a73, transparent: true, opacity: 0.065, depthWrite: false }));
shadow.rotation.x = -Math.PI / 2;
shadow.scale.y = 0.34;
shadow.position.set(0, -1.19, -0.12);
scene.add(shadow);

let targetRotX = 0;
let targetRotY = 0;
let currentRotX = 0;
let currentRotY = 0;
let pointerX = 0;
let pointerY = 0;
let hoverAmount = 0;
let targetHover = 0;
let bounceStartedAt = -10000;
let surpriseStartedAt = -10000;
let blinkStartedAt = -10000;
let nextBlinkAt = performance.now() + 1800 + Math.random() * 1500;
let lastTime = performance.now();
let frame = 0;

stage.addEventListener("pointermove", (event) => {
  const rect = stage.getBoundingClientRect();
  pointerX = THREE.MathUtils.clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1);
  pointerY = THREE.MathUtils.clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1);
  targetRotY = pointerX * 0.12;
  targetRotX = -pointerY * 0.07;
}, { passive: true });
stage.addEventListener("pointerenter", () => { targetHover = 1; }, { passive: true });
stage.addEventListener("pointerleave", () => {
  targetHover = 0;
  targetRotX = 0;
  targetRotY = 0;
  pointerX = 0;
  pointerY = 0;
}, { passive: true });
stage.addEventListener("click", () => {
  bounceStartedAt = performance.now();
  surpriseStartedAt = performance.now();
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

function deformBody(time, pulse, bounceStretch) {
  if (reducedMotion) return;
  const array = bodyPos.array;
  const wobble = 0.018 + hoverAmount * 0.007;
  const skirtWave = 0.026 + pulse * 0.009;
  const squashXZ = 1 - bounceStretch * 0.07;
  const stretchY = 1 + bounceStretch * 0.10;
  for (let i = 0; i < array.length; i += 3) {
    const x = basePositions[i];
    const y = basePositions[i + 1];
    const z = basePositions[i + 2];
    const angle = Math.atan2(z, x);
    const radiusWave = Math.sin(time * 1.45 + y * 4.0 + x * 1.8) * wobble + Math.cos(time * 1.1 + z * 4.4) * wobble * 0.55;
    let px = x * (1 + radiusWave + pulse * 0.012) * squashXZ;
    let py = y * stretchY + Math.sin(time * 1.2 + x * 4.0) * 0.012;
    let pz = z * (1 + radiusWave + pulse * 0.012) * squashXZ;
    if (y < -0.34) {
      const wave = Math.sin(angle * 3 + time * 1.15) * skirtWave + Math.cos(angle * 5 - time * 0.85) * skirtWave * 0.50;
      px *= 1 + wave;
      pz *= 1 + wave;
      py -= 0.02 + Math.abs(wave) * 0.02;
    }
    array[i] = px;
    array[i + 1] = py;
    array[i + 2] = pz;
  }
  bodyPos.needsUpdate = true;
  if (frame % 2 === 0) bodyGeometry.computeVertexNormals();
}

function animate(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;
  const t = now / 1000;
  frame += 1;

  currentRotX += (targetRotX - currentRotX) * Math.min(1, dt * 5);
  currentRotY += (targetRotY - currentRotY) * Math.min(1, dt * 5);
  hoverAmount += (targetHover - hoverAmount) * Math.min(1, dt * 4.5);

  if (now > nextBlinkAt) {
    blinkStartedAt = now;
    nextBlinkAt = now + 2200 + Math.random() * 1900;
  }
  const blinkAge = (now - blinkStartedAt) / 1000;
  const blinkAmount = blinkAge >= 0 && blinkAge < 0.18 ? Math.sin((blinkAge / 0.18) * Math.PI) : 0;

  const bounceAge = (now - bounceStartedAt) / 1000;
  const bounceActive = bounceAge >= 0 && bounceAge < 0.82;
  const bounceEnvelope = bounceActive ? Math.sin((bounceAge / 0.82) * Math.PI) : 0;
  const bounceY = bounceActive ? Math.sin((bounceAge / 0.82) * Math.PI * 2.05) * 0.13 * bounceEnvelope : 0;
  const bounceStretch = bounceActive ? Math.sin((bounceAge / 0.82) * Math.PI * 2.05 + Math.PI / 2) * 0.20 * bounceEnvelope : 0;
  const surpriseAge = (now - surpriseStartedAt) / 1000;
  const surpriseAmount = surpriseAge >= 0 && surpriseAge < 0.62 ? Math.sin((surpriseAge / 0.62) * Math.PI) : 0;

  const idleY = reducedMotion ? 0 : Math.sin(t * 1.28) * 0.055;
  const pulse = reducedMotion ? 0.35 : (Math.sin(t * 2.0) + 1) * 0.5;
  const breath = reducedMotion ? 1 : 1 + Math.sin(t * 1.5) * 0.012;

  slimeRoot.position.y = -0.04 + idleY + Math.max(0, bounceY);
  slimeRoot.rotation.x = currentRotX;
  slimeRoot.rotation.y = currentRotY;
  slimeRoot.rotation.z = reducedMotion ? 0 : Math.sin(t * 0.82) * 0.020;
  slimeRoot.scale.set(1 - bounceStretch * 0.07, breath + bounceStretch * 0.07, 1 - bounceStretch * 0.05);

  coreGroup.scale.setScalar(0.98 + pulse * 0.075 + hoverAmount * 0.04);
  coreGroup.rotation.y += reducedMotion ? 0 : dt * (0.27 + hoverAmount * 0.20);
  coreGroup.rotation.z -= reducedMotion ? 0 : dt * 0.10;
  coreHalo.material.opacity = 0.07 + pulse * 0.09 + hoverAmount * 0.04;
  coreGlow.material.opacity = 0.16 + pulse * 0.15;
  coreLight.intensity = 9 + pulse * 5 + hoverAmount * 2;
  neuralNodes.forEach((node, index) => node.scale.setScalar(0.90 + Math.sin(t * 2.2 + index * 0.75) * 0.14));
  edgeLines.material.opacity = 0.25 + pulse * 0.12;
  innerMotes.rotation.y += reducedMotion ? 0 : dt * 0.025;
  innerMotes.rotation.z -= reducedMotion ? 0 : dt * 0.018;
  orbitGroup.rotation.z += reducedMotion ? 0 : dt * (0.11 + hoverAmount * 0.10);
  orbitGroup.rotation.y += reducedMotion ? 0 : dt * 0.035;
  orbitNodes.forEach((node, index) => node.scale.setScalar(0.90 + Math.sin(t * 1.8 + index) * 0.10));

  // Single black eyes track subtly as whole shapes.
  const eyeX = THREE.MathUtils.clamp(pointerX * 0.020, -0.016, 0.016);
  const eyeY = THREE.MathUtils.clamp(pointerY * 0.012, -0.010, 0.010);
  const baseEyeY = 0.25;
  leftEye.position.x = -0.235 + eyeX;
  rightEye.position.x = 0.235 + eyeX;
  leftEye.position.y = baseEyeY - eyeY;
  rightEye.position.y = baseEyeY - eyeY;
  const blinkScale = Math.max(0.10, 1 - blinkAmount * 0.92);
  const surpriseBoost = 1 + surpriseAmount * 0.22;
  const happySquint = 1 - hoverAmount * 0.10;
  leftEye.scale.set(0.72, 1.26 * blinkScale * surpriseBoost * happySquint, 0.30);
  rightEye.scale.set(0.72, 1.26 * blinkScale * surpriseBoost * happySquint, 0.30);

  smile.scale.x = 1 + hoverAmount * 0.15;
  smile.scale.y = 1 + hoverAmount * 0.10;
  smile.material.opacity = 1 - surpriseAmount;
  surpriseMouth.material.opacity = surpriseAmount * 0.95;

  bodyMaterial.opacity = 0.68 + hoverAmount * 0.025;
  shadow.scale.x = 1 - idleY * 1.5 - Math.max(0, bounceY) * 1.1;
  shadow.material.opacity = Math.max(0.025, 0.060 - Math.max(0, bounceY) * 0.16);

  deformBody(t, pulse, bounceStretch);
  renderer.render(scene, camera);
  if (!stage.classList.contains("webgl-ready")) stage.classList.add("webgl-ready");
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
