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
renderer.toneMappingExposure = 1.12;
renderer.domElement.className = "three-slime-canvas";
renderer.domElement.setAttribute("aria-hidden", "true");
stage.prepend(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
camera.position.set(0, 0.08, 5.7);
camera.lookAt(0, 0.05, 0);

scene.add(new THREE.HemisphereLight(0xf9fcff, 0xc1d2ee, 2.8));
const keyLight = new THREE.DirectionalLight(0xffffff, 4.4);
keyLight.position.set(-3.2, 4.6, 5.6);
scene.add(keyLight);
const fillLight = new THREE.PointLight(0x8fd0ff, 18, 8, 2);
fillLight.position.set(2.6, 1.2, 2.6);
scene.add(fillLight);
const violetLight = new THREE.PointLight(0xbda7ff, 11, 7, 2);
violetLight.position.set(-2.2, -0.2, 1.8);
scene.add(violetLight);
const bottomLight = new THREE.PointLight(0x7de9ff, 10, 7, 2);
bottomLight.position.set(0, -1.5, 1.5);
scene.add(bottomLight);

const slimeRoot = new THREE.Group();
slimeRoot.position.y = -0.04;
scene.add(slimeRoot);

// --- Ghost-like translucent slime body ---------------------------------------
const bodyGeometry = new THREE.SphereGeometry(1.08, 72, 58);
const bodyPos = bodyGeometry.attributes.position;

for (let i = 0; i < bodyPos.count; i += 1) {
  const x = bodyPos.getX(i);
  const y = bodyPos.getY(i);
  const z = bodyPos.getZ(i);

  let nx = x;
  let ny = y;
  let nz = z;

  // Rounded ghost crown, soft middle, wider fluid base.
  if (y > 0.12) {
    nx *= 0.93;
    nz *= 0.93;
    ny *= 1.04;
  } else if (y > -0.25) {
    nx *= 1.02;
    nz *= 1.01;
    ny *= 0.98;
  } else {
    const spread = 1.08 + Math.abs(y + 0.25) * 0.34;
    nx *= spread;
    nz *= spread;
    ny *= 0.82;
  }

  const angle = Math.atan2(z, x);
  if (y < -0.38) {
    const skirt = Math.sin(angle * 3) * 0.05 + Math.cos(angle * 5) * 0.03;
    nx *= 1 + skirt;
    nz *= 1 + skirt;
    ny -= 0.05;
  }

  // Side puffs suggest tiny arms without breaking the ghost silhouette.
  const sideL = Math.exp(-((x + 0.9) ** 2) * 8 - ((y + 0.02) ** 2) * 10) * 0.18;
  const sideR = Math.exp(-((x - 0.9) ** 2) * 8 - ((y + 0.02) ** 2) * 10) * 0.18;
  nx += x < 0 ? -sideL : sideR;

  bodyPos.setXYZ(i, nx, ny, nz);
}
bodyPos.needsUpdate = true;
bodyGeometry.computeVertexNormals();
const basePositions = new Float32Array(bodyPos.array);

const bodyMaterial = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color("#7ea6ff"),
  roughness: 0.06,
  metalness: 0,
  transmission: 0.82,
  transparent: true,
  opacity: 0.74,
  thickness: 1.8,
  ior: 1.18,
  clearcoat: 1,
  clearcoatRoughness: 0.05,
  emissive: new THREE.Color("#6e8eff"),
  emissiveIntensity: 0.08,
});
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.position.y = -0.02;
slimeRoot.add(body);

const innerShell = new THREE.Mesh(
  bodyGeometry.clone(),
  new THREE.MeshBasicMaterial({
    color: 0xc7f0ff,
    transparent: true,
    opacity: 0.055,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }),
);
innerShell.position.copy(body.position);
innerShell.scale.set(0.93, 0.92, 0.91);
slimeRoot.add(innerShell);

// --- AI neural core -----------------------------------------------------------
const coreGroup = new THREE.Group();
coreGroup.position.set(0, -0.08, 0.14);
slimeRoot.add(coreGroup);

const coreHalo = new THREE.Mesh(
  new THREE.SphereGeometry(0.36, 28, 24),
  new THREE.MeshBasicMaterial({
    color: 0x86ecff,
    transparent: true,
    opacity: 0.14,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }),
);
coreGroup.add(coreHalo);

const coreSphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.15, 24, 20),
  new THREE.MeshBasicMaterial({
    color: 0xeafcff,
    transparent: true,
    opacity: 0.96,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }),
);
coreGroup.add(coreSphere);

const coreGlow = new THREE.Mesh(
  new THREE.SphereGeometry(0.22, 24, 18),
  new THREE.MeshBasicMaterial({
    color: 0x7be9ff,
    transparent: true,
    opacity: 0.32,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }),
);
coreGroup.add(coreGlow);

const ringMaterial = new THREE.MeshBasicMaterial({
  color: 0xc5f6ff,
  transparent: true,
  opacity: 0.38,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
const coreRings = [];
for (let i = 0; i < 4; i += 1) {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.29 + i * 0.075, 0.006, 8, 72),
    ringMaterial.clone(),
  );
  ring.rotation.x = Math.PI / 2 + i * 0.40;
  ring.rotation.y = i * 0.76;
  ring.rotation.z = i * 0.22;
  coreRings.push(ring);
  coreGroup.add(ring);
}

const neuralGroup = new THREE.Group();
coreGroup.add(neuralGroup);
const nodeMaterial = new THREE.MeshBasicMaterial({
  color: 0xf5feff,
  transparent: true,
  opacity: 0.92,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
const neuralPositions = [
  [-0.28, 0.15, 0.02], [0.26, 0.18, 0.04], [-0.24, -0.12, 0.08], [0.25, -0.13, 0.08],
  [0, 0.29, -0.04], [0, -0.29, 0.03], [-0.35, 0.0, -0.03], [0.35, 0.02, -0.02],
  [-0.12, 0.08, 0.20], [0.14, -0.02, 0.21],
];
const neuralNodes = [];
neuralPositions.forEach(([x, y, z], index) => {
  const node = new THREE.Mesh(
    new THREE.SphereGeometry(index < 4 ? 0.028 : 0.021, 14, 12),
    nodeMaterial,
  );
  node.position.set(x, y, z);
  neuralNodes.push(node);
  neuralGroup.add(node);
});
const edgePairs = [
  [0,4],[1,4],[0,6],[1,7],[2,5],[3,5],[2,6],[3,7],[4,8],[5,9],[8,9],[0,8],[1,9],
];
const edgeArray = [];
edgePairs.forEach(([a, b]) => edgeArray.push(...neuralPositions[a], ...neuralPositions[b]));
const edgeGeometry = new THREE.BufferGeometry();
edgeGeometry.setAttribute("position", new THREE.Float32BufferAttribute(edgeArray, 3));
const edgeLines = new THREE.LineSegments(
  edgeGeometry,
  new THREE.LineBasicMaterial({
    color: 0xc9f7ff,
    transparent: true,
    opacity: 0.42,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }),
);
neuralGroup.add(edgeLines);

// Data motes floating inside the gel.
const moteCount = 48;
const moteArray = new Float32Array(moteCount * 3);
for (let i = 0; i < moteCount; i += 1) {
  const theta = Math.random() * Math.PI * 2;
  const radius = Math.sqrt(Math.random()) * 0.78;
  moteArray[i * 3] = Math.cos(theta) * radius;
  moteArray[i * 3 + 1] = (Math.random() - 0.52) * 1.22;
  moteArray[i * 3 + 2] = (Math.random() - 0.5) * 0.70;
}
const innerMotes = new THREE.Points(
  new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(moteArray, 3)),
  new THREE.PointsMaterial({
    color: 0xd8f9ff,
    size: 0.022,
    transparent: true,
    opacity: 0.42,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  }),
);
slimeRoot.add(innerMotes);

// --- Cute face ---------------------------------------------------------------
const faceGroup = new THREE.Group();
faceGroup.position.z = 0.01;
slimeRoot.add(faceGroup);

const eyeWhiteMaterial = new THREE.MeshBasicMaterial({ color: 0xf6fdff });
const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x2948a4 });
const highlightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

function createEye(x) {
  const group = new THREE.Group();
  group.position.set(x, 0.24, 0.90);

  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.17, 28, 22), eyeWhiteMaterial);
  eye.scale.set(0.78, 1.24, 0.40);
  group.add(eye);

  const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.078, 20, 18), pupilMaterial);
  pupil.position.set(0, -0.004, 0.13);
  pupil.scale.set(0.85, 1.10, 0.42);
  group.add(pupil);

  const highlight = new THREE.Mesh(new THREE.SphereGeometry(0.024, 12, 10), highlightMaterial);
  highlight.position.set(-0.030, 0.035, 0.18);
  group.add(highlight);

  return { group, eye, pupil, highlight };
}

const leftEye = createEye(-0.22);
const rightEye = createEye(0.22);
faceGroup.add(leftEye.group, rightEye.group);

const cheekMaterial = new THREE.MeshBasicMaterial({
  color: 0xc8e7ff,
  transparent: true,
  opacity: 0.34,
  depthWrite: false,
});
const cheekGeo = new THREE.SphereGeometry(0.07, 18, 14);
function makeCheek(x) {
  const cheek = new THREE.Mesh(cheekGeo, cheekMaterial.clone());
  cheek.position.set(x, 0.0, 0.89);
  cheek.scale.set(1.4, 0.58, 0.28);
  return cheek;
}
faceGroup.add(makeCheek(-0.40), makeCheek(0.40));

const smile = new THREE.Mesh(
  new THREE.TorusGeometry(0.11, 0.018, 10, 36, Math.PI),
  new THREE.MeshBasicMaterial({ color: 0x1c357a, transparent: true, opacity: 1 }),
);
smile.position.set(0, 0.0, 0.98);
smile.rotation.z = Math.PI;
faceGroup.add(smile);

const surpriseMouth = new THREE.Mesh(
  new THREE.SphereGeometry(0.06, 18, 14),
  new THREE.MeshBasicMaterial({ color: 0x1c357a, transparent: true, opacity: 0 }),
);
surpriseMouth.position.set(0, -0.02, 0.985);
surpriseMouth.scale.set(0.78, 1.16, 0.24);
faceGroup.add(surpriseMouth);

// --- Outer orbit / AI data nodes --------------------------------------------
const orbitGroup = new THREE.Group();
slimeRoot.add(orbitGroup);
const orbitLineMaterial = new THREE.MeshBasicMaterial({
  color: 0xa6c8ff,
  transparent: true,
  opacity: 0.28,
  depthWrite: false,
});
const orbitRingA = new THREE.Mesh(
  new THREE.TorusGeometry(1.42, 0.008, 6, 96),
  orbitLineMaterial,
);
orbitRingA.scale.y = 0.56;
orbitRingA.rotation.x = Math.PI / 2.5;
orbitRingA.rotation.z = 0.24;
orbitGroup.add(orbitRingA);
const orbitRingB = new THREE.Mesh(
  new THREE.TorusGeometry(1.22, 0.006, 6, 90),
  orbitLineMaterial.clone(),
);
orbitRingB.scale.y = 0.74;
orbitRingB.rotation.x = Math.PI / 2.1;
orbitRingB.rotation.y = 0.8;
orbitGroup.add(orbitRingB);

const orbitNodeMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xbce8ff,
  emissive: 0x5a92ff,
  emissiveIntensity: 0.58,
  transparent: true,
  opacity: 0.92,
  roughness: 0.08,
  transmission: 0.12,
});
const orbitNodes = [];
[
  [1.24,0.52,0.06,0.072],[-1.26,0.26,0.10,0.055],[0.82,-1.00,0.16,0.050],
  [-0.72,1.02,0.0,0.046],[1.30,-0.15,-0.13,0.040],
].forEach(([x, y, z, r]) => {
  const node = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), orbitNodeMaterial);
  node.position.set(x, y, z);
  orbitNodes.push(node);
  orbitGroup.add(node);
});

// Outer sparks reinforce the model/data aesthetic without clutter.
const particleCount = 42;
const particleArray = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i += 1) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 1.1 + Math.random() * 0.55;
  particleArray[i * 3] = Math.cos(angle) * radius;
  particleArray[i * 3 + 1] = (Math.random() - 0.5) * 2.1;
  particleArray[i * 3 + 2] = (Math.random() - 0.5) * 0.9 - 0.12;
}
const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute("position", new THREE.BufferAttribute(particleArray, 3));
const particles = new THREE.Points(
  particleGeometry,
  new THREE.PointsMaterial({
    color: 0xc8eeff,
    size: 0.024,
    transparent: true,
    opacity: 0.42,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }),
);
slimeRoot.add(particles);

const shadow = new THREE.Mesh(
  new THREE.CircleGeometry(0.84, 48),
  new THREE.MeshBasicMaterial({ color: 0x4f79d1, transparent: true, opacity: 0.08, depthWrite: false }),
);
shadow.rotation.x = -Math.PI / 2;
shadow.scale.y = 0.34;
shadow.position.set(0, -1.2, -0.12);
scene.add(shadow);

// --- Interaction state -------------------------------------------------------
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
  const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
  const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  pointerX = THREE.MathUtils.clamp(nx, -1, 1);
  pointerY = THREE.MathUtils.clamp(ny, -1, 1);
  targetRotY = pointerX * 0.14;
  targetRotX = -pointerY * 0.08;
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
  const wobble = 0.022 + hoverAmount * 0.010;
  const skirtWave = 0.035 + pulse * 0.015;
  const squashXZ = 1 - bounceStretch * 0.08;
  const stretchY = 1 + bounceStretch * 0.12;

  for (let i = 0; i < array.length; i += 3) {
    const x = basePositions[i];
    const y = basePositions[i + 1];
    const z = basePositions[i + 2];
    const angle = Math.atan2(z, x);

    const radiusWave =
      Math.sin(time * 1.5 + y * 4.2 + x * 1.8) * wobble +
      Math.cos(time * 1.2 + z * 4.6 - x * 2.0) * wobble * 0.65;

    let px = x * (1 + radiusWave + pulse * 0.02) * squashXZ;
    let py = y * stretchY + Math.sin(time * 1.3 + x * 4.2) * 0.016;
    let pz = z * (1 + radiusWave + pulse * 0.02) * squashXZ;

    if (y < -0.34) {
      const wave =
        Math.sin(angle * 3 + time * 1.25) * skirtWave +
        Math.cos(angle * 5 - time * 0.95) * skirtWave * 0.65;
      px *= 1 + wave;
      pz *= 1 + wave;
      py -= 0.03 + Math.abs(wave) * 0.03;
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
    nextBlinkAt = now + 2200 + Math.random() * 1800;
  }
  const blinkAge = (now - blinkStartedAt) / 1000;
  const blinking = blinkAge >= 0 && blinkAge < 0.18;
  const blinkAmount = blinking ? Math.sin((blinkAge / 0.18) * Math.PI) : 0;

  const bounceAge = (now - bounceStartedAt) / 1000;
  const bounceActive = bounceAge >= 0 && bounceAge < 0.82;
  const bounceEnvelope = bounceActive ? Math.sin((bounceAge / 0.82) * Math.PI) : 0;
  const bounceY = bounceActive
    ? Math.sin((bounceAge / 0.82) * Math.PI * 2.05) * 0.14 * bounceEnvelope
    : 0;
  const bounceStretch = bounceActive
    ? Math.sin((bounceAge / 0.82) * Math.PI * 2.05 + Math.PI / 2) * 0.22 * bounceEnvelope
    : 0;

  const surpriseAge = (now - surpriseStartedAt) / 1000;
  const surpriseAmount = surpriseAge >= 0 && surpriseAge < 0.65
    ? Math.sin((surpriseAge / 0.65) * Math.PI)
    : 0;

  const idleY = reducedMotion ? 0 : Math.sin(t * 1.35) * 0.06;
  const idleZRot = reducedMotion ? 0 : Math.sin(t * 0.9) * 0.025;
  const pulse = reducedMotion ? 0.35 : (Math.sin(t * 2.0) + 1) * 0.5;
  const breath = reducedMotion ? 1 : 1 + Math.sin(t * 1.55) * 0.015;

  slimeRoot.position.y = -0.04 + idleY + Math.max(0, bounceY);
  slimeRoot.rotation.x = currentRotX;
  slimeRoot.rotation.y = currentRotY;
  slimeRoot.rotation.z = idleZRot;
  slimeRoot.scale.set(
    1 - bounceStretch * 0.08,
    breath + bounceStretch * 0.08,
    1 - bounceStretch * 0.06,
  );

  coreGroup.scale.setScalar(0.98 + pulse * 0.08 + hoverAmount * 0.05);
  coreGroup.rotation.y += reducedMotion ? 0 : dt * (0.28 + hoverAmount * 0.22);
  coreGroup.rotation.z -= reducedMotion ? 0 : dt * 0.11;
  coreRings.forEach((ring, index) => {
    ring.rotation.z += reducedMotion ? 0 : dt * (index % 2 ? -0.10 : 0.12);
  });
  coreHalo.material.opacity = 0.10 + pulse * 0.12 + hoverAmount * 0.04;
  coreGlow.material.opacity = 0.22 + pulse * 0.16;
  bodyMaterial.emissiveIntensity = 0.06 + pulse * 0.05 + hoverAmount * 0.03;
  fillLight.intensity = 16 + pulse * 3 + hoverAmount * 2;

  neuralNodes.forEach((node, index) => {
    node.scale.setScalar(reducedMotion ? 1 : 0.9 + Math.sin(t * 2.2 + index * 0.75) * 0.16);
  });
  edgeLines.material.opacity = 0.28 + pulse * 0.14;
  innerMotes.rotation.y += reducedMotion ? 0 : dt * 0.035;
  innerMotes.rotation.z -= reducedMotion ? 0 : dt * 0.018;

  orbitGroup.rotation.z += reducedMotion ? 0 : dt * (0.13 + hoverAmount * 0.14);
  orbitGroup.rotation.y += reducedMotion ? 0 : dt * 0.04;
  orbitNodes.forEach((node, index) => {
    node.scale.setScalar(reducedMotion ? 1 : 0.9 + Math.sin(t * 1.8 + index) * 0.1);
  });
  particles.rotation.z -= reducedMotion ? 0 : dt * 0.03;
  particles.rotation.y += reducedMotion ? 0 : dt * 0.02;

  const px = THREE.MathUtils.clamp(pointerX * 0.030, -0.022, 0.022);
  const py = THREE.MathUtils.clamp(pointerY * 0.022, -0.018, 0.018);
  leftEye.pupil.position.x = px;
  rightEye.pupil.position.x = px;
  leftEye.pupil.position.y = -0.004 - py;
  rightEye.pupil.position.y = -0.004 - py;

  const eyeBaseScaleY = Math.max(0.08, 1 - blinkAmount * 0.92);
  const surpriseBoost = 1 + surpriseAmount * 0.28;
  const happyLift = hoverAmount * 0.01;
  leftEye.group.position.y = 0.24 + happyLift;
  rightEye.group.position.y = 0.24 + happyLift;
  leftEye.eye.scale.set(0.78, 1.24 * eyeBaseScaleY * surpriseBoost, 0.40);
  rightEye.eye.scale.set(0.78, 1.24 * eyeBaseScaleY * surpriseBoost, 0.40);
  leftEye.pupil.scale.set(0.85, 1.10 * eyeBaseScaleY, 0.42);
  rightEye.pupil.scale.set(0.85, 1.10 * eyeBaseScaleY, 0.42);

  smile.scale.x = 1 + hoverAmount * 0.18;
  smile.scale.y = 1 + hoverAmount * 0.18;
  smile.material.opacity = 1 - surpriseAmount;
  surpriseMouth.material.opacity = surpriseAmount * 0.96;
  surpriseMouth.scale.set(
    0.78 + surpriseAmount * 0.14,
    1.16 + surpriseAmount * 0.18,
    0.24,
  );

  shadow.scale.x = 1 - idleY * 1.8 - Math.max(0, bounceY) * 1.2;
  shadow.material.opacity = Math.max(0.03, 0.08 - Math.max(0, bounceY) * 0.2);

  deformBody(t, pulse, bounceStretch);
  renderer.render(scene, camera);

  if (!stage.classList.contains("webgl-ready")) stage.classList.add("webgl-ready");
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
