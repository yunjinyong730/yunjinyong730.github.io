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
camera.position.set(0, 0.08, 5.75);
camera.lookAt(0, 0.02, 0);

scene.add(new THREE.HemisphereLight(0xffffff, 0xc8d0da, 3.05));
const keyLight = new THREE.DirectionalLight(0xffffff, 4.9);
keyLight.position.set(-3.4, 4.8, 5.8);
scene.add(keyLight);
const coreLight = new THREE.PointLight(0x76dfff, 22, 7, 2);
coreLight.position.set(0, -0.1, 2.4);
scene.add(coreLight);
const rimLight = new THREE.PointLight(0x809cff, 11, 7, 2);
rimLight.position.set(2.8, 0.5, 2.2);
scene.add(rimLight);

const slimeRoot = new THREE.Group();
slimeRoot.position.y = -0.04;
scene.add(slimeRoot);

// --- Neutral ghost body -------------------------------------------------------
const bodyGeometry = new THREE.SphereGeometry(1.06, 72, 58);
const bodyPos = bodyGeometry.attributes.position;
for (let i = 0; i < bodyPos.count; i += 1) {
  const x = bodyPos.getX(i);
  const y = bodyPos.getY(i);
  const z = bodyPos.getZ(i);
  let nx = x;
  let ny = y;
  let nz = z;

  if (y > 0.12) {
    nx *= 0.93;
    nz *= 0.93;
    ny *= 1.04;
  } else if (y > -0.24) {
    nx *= 1.02;
    nz *= 1.01;
  } else {
    const spread = 1.08 + Math.abs(y + 0.24) * 0.30;
    nx *= spread;
    nz *= spread;
    ny *= 0.83;
  }

  if (y < -0.38) {
    const angle = Math.atan2(z, x);
    const skirt = Math.sin(angle * 3) * 0.045 + Math.cos(angle * 5) * 0.025;
    nx *= 1 + skirt;
    nz *= 1 + skirt;
    ny -= 0.04;
  }

  bodyPos.setXYZ(i, nx, ny, nz);
}
bodyPos.needsUpdate = true;
bodyGeometry.computeVertexNormals();
const basePositions = new Float32Array(bodyPos.array);

const bodyMaterial = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color("#f4f5f6"),
  roughness: 0.07,
  metalness: 0,
  transmission: 0.84,
  transparent: true,
  opacity: 0.66,
  thickness: 1.8,
  ior: 1.16,
  clearcoat: 1,
  clearcoatRoughness: 0.045,
  emissive: new THREE.Color("#d6d9de"),
  emissiveIntensity: 0.03,
});
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.position.y = -0.02;
slimeRoot.add(body);

const innerShell = new THREE.Mesh(
  bodyGeometry.clone(),
  new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.075, depthWrite: false }),
);
innerShell.scale.set(0.94, 0.93, 0.92);
innerShell.position.copy(body.position);
slimeRoot.add(innerShell);

// --- AI neural core -----------------------------------------------------------
const coreGroup = new THREE.Group();
coreGroup.position.set(0, -0.12, 0.20);
slimeRoot.add(coreGroup);

const coreHalo = new THREE.Mesh(
  new THREE.SphereGeometry(0.50, 40, 32),
  new THREE.MeshBasicMaterial({ color: 0x7ce4ff, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false }),
);
coreGroup.add(coreHalo);
const coreSphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.18, 30, 24),
  new THREE.MeshBasicMaterial({ color: 0xf5feff, transparent: true, opacity: 0.99, blending: THREE.AdditiveBlending, depthWrite: false }),
);
coreGroup.add(coreSphere);
const coreGlow = new THREE.Mesh(
  new THREE.SphereGeometry(0.31, 30, 24),
  new THREE.MeshBasicMaterial({ color: 0x6bdcff, transparent: true, opacity: 0.37, blending: THREE.AdditiveBlending, depthWrite: false }),
);
coreGroup.add(coreGlow);

const coreRingMaterial = new THREE.MeshBasicMaterial({ color: 0xa7efff, transparent: true, opacity: 0.60, blending: THREE.AdditiveBlending, depthWrite: false });
const coreRings = [];
for (let i = 0; i < 6; i += 1) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.31 + i * 0.066, 0.008, 8, 92), coreRingMaterial.clone());
  ring.rotation.x = Math.PI / 2 + i * 0.31;
  ring.rotation.y = i * 0.62;
  ring.rotation.z = i * 0.19;
  coreRings.push(ring);
  coreGroup.add(ring);
}

const neuralPositions = [
  [-0.38,0.18,0.03],[0.36,0.21,0.05],[-0.33,-0.19,0.06],[0.35,-0.18,0.08],
  [0,0.40,-0.02],[0,-0.40,0.03],[-0.47,0,-0.03],[0.47,0.03,0.02],
  [-0.19,0.09,0.27],[0.21,-0.03,0.25],[0.13,0.19,-0.23],[-0.13,-0.20,-0.21],
  [0.02,0.04,0.34],[-0.02,-0.05,-0.31],
];
const neuralGroup = new THREE.Group();
coreGroup.add(neuralGroup);
const nodeMat = new THREE.MeshBasicMaterial({ color: 0xf7ffff, transparent: true, opacity: 0.98, blending: THREE.AdditiveBlending, depthWrite: false });
const neuralNodes = neuralPositions.map(([x, y, z], idx) => {
  const node = new THREE.Mesh(new THREE.SphereGeometry(idx < 4 ? 0.033 : 0.024, 14, 12), nodeMat);
  node.position.set(x, y, z);
  neuralGroup.add(node);
  return node;
});
const links = [];
[
  [0,4],[0,6],[0,8],[0,12],[1,4],[1,7],[1,10],[1,12],[2,5],[2,6],[2,11],[2,13],
  [3,5],[3,7],[3,9],[3,13],[4,8],[4,10],[5,9],[5,11],[8,9],[10,11],[8,10],[9,11],[12,13]
].forEach(([a,b]) => links.push(...neuralPositions[a], ...neuralPositions[b]));
const edgeGeometry = new THREE.BufferGeometry();
edgeGeometry.setAttribute("position", new THREE.Float32BufferAttribute(links, 3));
const edgeLines = new THREE.LineSegments(edgeGeometry, new THREE.LineBasicMaterial({ color: 0xc5f8ff, transparent: true, opacity: 0.58, blending: THREE.AdditiveBlending, depthWrite: false }));
neuralGroup.add(edgeLines);

const moteCount = 82;
const moteArray = new Float32Array(moteCount * 3);
for (let i = 0; i < moteCount; i += 1) {
  const a = Math.random() * Math.PI * 2;
  const r = Math.sqrt(Math.random()) * 0.84;
  moteArray[i * 3] = Math.cos(a) * r;
  moteArray[i * 3 + 1] = (Math.random() - 0.5) * 1.30;
  moteArray[i * 3 + 2] = (Math.random() - 0.5) * 0.74;
}
const innerMotes = new THREE.Points(
  new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(moteArray, 3)),
  new THREE.PointsMaterial({ color: 0xd6faff, size: 0.026, transparent: true, opacity: 0.58, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true }),
);
slimeRoot.add(innerMotes);

// Internal holographic scan rings.
const scanGroup = new THREE.Group();
slimeRoot.add(scanGroup);
const scanRings = [];
for (let i = 0; i < 4; i += 1) {
  const mat = new THREE.MeshBasicMaterial({ color: i % 2 ? 0x88c8ff : 0x8ff1ff, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.72 - i * 0.055, 0.006, 6, 76), mat);
  ring.rotation.x = Math.PI / 2;
  ring.scale.z = 0.82;
  ring.position.y = -0.46 + i * 0.29;
  scanRings.push(ring);
  scanGroup.add(ring);
}

// --- Cute face: single-color black eyes --------------------------------------
const faceGroup = new THREE.Group();
slimeRoot.add(faceGroup);
const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x101010 });
const makeEye = (x) => {
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.145, 28, 22), eyeMaterial);
  eye.position.set(x, 0.24, 0.93);
  eye.scale.set(0.74, 1.26, 0.34);
  faceGroup.add(eye);
  return eye;
};
const leftEye = makeEye(-0.235);
const rightEye = makeEye(0.235);

const smileMat = new THREE.MeshBasicMaterial({ color: 0x101010, transparent: true, opacity: 1 });
const smile = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.017, 10, 38, Math.PI), smileMat);
smile.position.set(0, -0.025, 0.99);
smile.rotation.z = Math.PI;
faceGroup.add(smile);

const surpriseMat = new THREE.MeshBasicMaterial({ color: 0x101010, transparent: true, opacity: 0 });
const surpriseMouth = new THREE.Mesh(new THREE.SphereGeometry(0.058, 18, 14), surpriseMat);
surpriseMouth.position.set(0, -0.045, 0.992);
surpriseMouth.scale.set(0.78, 1.12, 0.24);
faceGroup.add(surpriseMouth);

const tinyMouthMat = new THREE.MeshBasicMaterial({ color: 0x101010, transparent: true, opacity: 0 });
const tinyMouth = new THREE.Mesh(new THREE.SphereGeometry(0.034, 16, 12), tinyMouthMat);
tinyMouth.position.set(0.025, -0.028, 0.993);
tinyMouth.scale.set(1.0, 0.62, 0.23);
faceGroup.add(tinyMouth);

// --- Strong outer holographic system -----------------------------------------
const orbitGroup = new THREE.Group();
slimeRoot.add(orbitGroup);
const orbitMatA = new THREE.MeshBasicMaterial({ color: 0x67baff, transparent: true, opacity: 0.54, blending: THREE.AdditiveBlending, depthWrite: false });
const orbitMatB = new THREE.MeshBasicMaterial({ color: 0x8ae7ff, transparent: true, opacity: 0.39, blending: THREE.AdditiveBlending, depthWrite: false });
const orbitMatC = new THREE.MeshBasicMaterial({ color: 0x98aaff, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false });
const orbitRingA = new THREE.Mesh(new THREE.TorusGeometry(1.52, 0.012, 8, 132), orbitMatA);
orbitRingA.scale.y = 0.58;
orbitRingA.rotation.x = Math.PI / 2.55;
orbitRingA.rotation.z = 0.24;
orbitGroup.add(orbitRingA);
const orbitRingB = new THREE.Mesh(new THREE.TorusGeometry(1.36, 0.010, 8, 124), orbitMatB);
orbitRingB.scale.y = 0.74;
orbitRingB.rotation.x = Math.PI / 2.12;
orbitRingB.rotation.y = 0.78;
orbitGroup.add(orbitRingB);
const orbitRingC = new THREE.Mesh(new THREE.TorusGeometry(1.19, 0.008, 8, 116), orbitMatC);
orbitRingC.scale.y = 0.84;
orbitRingC.rotation.x = Math.PI / 2.35;
orbitRingC.rotation.y = -0.65;
orbitRingC.rotation.z = 0.48;
orbitGroup.add(orbitRingC);

// Bright hologram arc segments.
const arcGroup = new THREE.Group();
slimeRoot.add(arcGroup);
const hologramArcs = [];
for (let i = 0; i < 7; i += 1) {
  const radius = 1.27 + (i % 3) * 0.11;
  const arc = Math.PI * (0.32 + (i % 4) * 0.08);
  const mat = new THREE.MeshBasicMaterial({
    color: i % 3 === 0 ? 0x73c6ff : i % 3 === 1 ? 0x8df2ff : 0xa1a8ff,
    transparent: true,
    opacity: 0.38,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.014, 8, 72, arc), mat);
  mesh.rotation.x = Math.PI / (2.15 + (i % 3) * 0.2);
  mesh.rotation.y = i * 0.73;
  mesh.rotation.z = i * 0.84;
  hologramArcs.push(mesh);
  arcGroup.add(mesh);
}

const orbitNodeMat = new THREE.MeshPhysicalMaterial({ color: 0xe3fbff, emissive: 0x4f91ff, emissiveIntensity: 1.28, transparent: true, opacity: 0.99, roughness: 0.04, transmission: 0.10 });
const orbitNodes = [];
[
  [1.30,0.58,0.10,0.082],[-1.38,0.24,0.10,0.066],[0.90,-1.04,0.17,0.060],[-0.78,1.10,0,0.056],
  [1.40,-0.16,-0.12,0.050],[-1.10,-0.76,-0.06,0.048],[0.18,1.27,-0.14,0.046],[-0.20,-1.22,0.10,0.044],
].forEach(([x,y,z,r]) => {
  const n = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 14), orbitNodeMat);
  n.position.set(x,y,z);
  orbitNodes.push(n);
  orbitGroup.add(n);
});

// Moving signal packets make the orbit feel computational rather than decorative.
const signalMat = new THREE.MeshBasicMaterial({ color: 0xf4ffff, transparent: true, opacity: 0.98, blending: THREE.AdditiveBlending, depthWrite: false });
const signalNodes = [];
for (let i = 0; i < 4; i += 1) {
  const signal = new THREE.Mesh(new THREE.SphereGeometry(0.045 - i * 0.004, 14, 12), signalMat.clone());
  signalNodes.push(signal);
  slimeRoot.add(signal);
}

// Expanding pulse rings around the model.
const pulseGroup = new THREE.Group();
slimeRoot.add(pulseGroup);
const pulseRings = [];
for (let i = 0; i < 3; i += 1) {
  const mat = new THREE.MeshBasicMaterial({ color: i === 1 ? 0x91eaff : 0x78b9ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.02, 0.010, 7, 96), mat);
  ring.rotation.x = Math.PI / 2;
  ring.scale.z = 0.72;
  pulseRings.push(ring);
  pulseGroup.add(ring);
}

// Sparkle meshes give short, crisp highlights that points cannot.
const sparkleGroup = new THREE.Group();
slimeRoot.add(sparkleGroup);
const sparkles = [];
for (let i = 0; i < 11; i += 1) {
  const mat = new THREE.MeshBasicMaterial({ color: i % 2 ? 0xbceeff : 0xd7dcff, transparent: true, opacity: 0.66, blending: THREE.AdditiveBlending, depthWrite: false });
  const sparkle = new THREE.Mesh(new THREE.OctahedronGeometry(0.032 + (i % 3) * 0.007, 0), mat);
  const a = (i / 11) * Math.PI * 2 + 0.35;
  const r = 1.30 + (i % 4) * 0.12;
  sparkle.position.set(Math.cos(a) * r, Math.sin(a) * (0.78 + (i % 3) * 0.08), ((i % 5) - 2) * 0.10);
  sparkle.userData.phase = i * 0.72;
  sparkles.push(sparkle);
  sparkleGroup.add(sparkle);
}

const outerCount = 76;
const outerArray = new Float32Array(outerCount * 3);
for (let i = 0; i < outerCount; i += 1) {
  const a = Math.random() * Math.PI * 2;
  const r = 1.20 + Math.random() * 0.72;
  outerArray[i * 3] = Math.cos(a) * r;
  outerArray[i * 3 + 1] = (Math.random() - 0.5) * 2.42;
  outerArray[i * 3 + 2] = (Math.random() - 0.5) * 1.05 - 0.12;
}
const outerParticles = new THREE.Points(
  new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(outerArray, 3)),
  new THREE.PointsMaterial({ color: 0xb9edff, size: 0.031, transparent: true, opacity: 0.62, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true }),
);
slimeRoot.add(outerParticles);

const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.88, 48), new THREE.MeshBasicMaterial({ color: 0x566276, transparent: true, opacity: 0.075, depthWrite: false }));
shadow.rotation.x = -Math.PI / 2;
shadow.scale.y = 0.32;
shadow.position.set(0, -1.22, -0.12);
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
let nextBlinkAt = performance.now() + 1700 + Math.random() * 1700;
let expressionMode = "idle";
let expressionUntil = 0;
let nextExpressionAt = performance.now() + 3600 + Math.random() * 2400;
let curiousDirection = 1;
let lastTime = performance.now();
let frame = 0;

const expressionChoices = ["wink", "sleepy", "curious", "happy"];
const chooseExpression = (now) => {
  expressionMode = expressionChoices[Math.floor(Math.random() * expressionChoices.length)];
  curiousDirection = Math.random() > 0.5 ? 1 : -1;
  expressionUntil = now + 850 + Math.random() * 850;
  nextExpressionAt = expressionUntil + 2600 + Math.random() * 3000;
};

stage.addEventListener("pointermove", (event) => {
  const rect = stage.getBoundingClientRect();
  pointerX = THREE.MathUtils.clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1);
  pointerY = THREE.MathUtils.clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1);
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
  const now = performance.now();
  bounceStartedAt = now;
  surpriseStartedAt = now;
  expressionMode = "idle";
  expressionUntil = now + 700;
  nextExpressionAt = now + 2600;
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

function deformBody(t, pulse, stretch, delight) {
  if (reducedMotion) return;
  const arr = bodyPos.array;
  for (let i = 0; i < arr.length; i += 3) {
    const x = basePositions[i];
    const y = basePositions[i + 1];
    const z = basePositions[i + 2];
    const wave = Math.sin(t * 1.45 + y * 4.0 + x * 2.0) * 0.018 + Math.cos(t * 1.08 + z * 4.4) * 0.012;
    const skirt = y < -0.36 ? Math.sin(Math.atan2(z, x) * 3 + t * 1.15) * 0.028 : 0;
    const happyPuff = delight * Math.exp(-(y * y) * 2.2) * 0.012;
    arr[i] = x * (1 + wave + skirt + pulse * 0.012 + happyPuff) * (1 - stretch * 0.06);
    arr[i + 1] = y * (1 + stretch * 0.10) + Math.sin(t * 1.25 + x * 4.0) * 0.012;
    arr[i + 2] = z * (1 + wave + skirt + pulse * 0.012 + happyPuff) * (1 - stretch * 0.06);
  }
  bodyPos.needsUpdate = true;
  if (frame % 3 === 0) bodyGeometry.computeVertexNormals();
}

function animate(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;
  const t = now / 1000;
  frame += 1;

  currentRotX += (targetRotX - currentRotX) * Math.min(1, dt * 5);
  currentRotY += (targetRotY - currentRotY) * Math.min(1, dt * 5);
  hoverAmount += (targetHover - hoverAmount) * Math.min(1, dt * 4.5);

  if (now > nextBlinkAt && expressionMode !== "wink") {
    blinkStartedAt = now;
    nextBlinkAt = now + 2200 + Math.random() * 1900;
  }
  if (now > expressionUntil && expressionMode !== "idle") expressionMode = "idle";
  if (now > nextExpressionAt && hoverAmount < 0.15) chooseExpression(now);

  const blinkAge = (now - blinkStartedAt) / 1000;
  const blink = blinkAge >= 0 && blinkAge < 0.18 ? Math.sin((blinkAge / 0.18) * Math.PI) : 0;
  const bounceAge = (now - bounceStartedAt) / 1000;
  const bounceEnv = bounceAge >= 0 && bounceAge < 0.82 ? Math.sin((bounceAge / 0.82) * Math.PI) : 0;
  const bounceY = bounceEnv ? Math.sin((bounceAge / 0.82) * Math.PI * 2.05) * 0.14 * bounceEnv : 0;
  const stretch = bounceEnv ? Math.sin((bounceAge / 0.82) * Math.PI * 2.05 + Math.PI / 2) * 0.20 * bounceEnv : 0;
  const surpriseAge = (now - surpriseStartedAt) / 1000;
  const surprise = surpriseAge >= 0 && surpriseAge < 0.66 ? Math.sin((surpriseAge / 0.66) * Math.PI) : 0;
  const idleY = reducedMotion ? 0 : Math.sin(t * 1.34) * 0.055;
  const pulse = reducedMotion ? 0.4 : (Math.sin(t * 2.05) + 1) * 0.5;

  const isHappy = expressionMode === "happy" ? 1 : 0;
  const isSleepy = expressionMode === "sleepy" ? 1 : 0;
  const isWink = expressionMode === "wink" ? 1 : 0;
  const isCurious = expressionMode === "curious" ? 1 : 0;
  const delight = Math.min(1, hoverAmount * 0.92 + isHappy * 0.82);

  slimeRoot.position.y = -0.04 + idleY + Math.max(0, bounceY);
  slimeRoot.rotation.x = currentRotX;
  slimeRoot.rotation.y = currentRotY;
  slimeRoot.rotation.z = reducedMotion ? 0 : Math.sin(t * 0.82) * 0.02 + isCurious * curiousDirection * 0.055;
  slimeRoot.scale.set(1 - stretch * 0.05, 1 + stretch * 0.08 + delight * 0.008, 1 - stretch * 0.04);

  coreGroup.scale.setScalar(0.98 + pulse * 0.14 + hoverAmount * 0.09);
  coreGroup.rotation.y += reducedMotion ? 0 : dt * (0.42 + hoverAmount * 0.32);
  coreGroup.rotation.z -= reducedMotion ? 0 : dt * 0.15;
  coreHalo.material.opacity = 0.16 + pulse * 0.20 + hoverAmount * 0.08;
  coreGlow.material.opacity = 0.30 + pulse * 0.25 + hoverAmount * 0.06;
  coreLight.intensity = 18 + pulse * 10 + hoverAmount * 7;
  coreRings.forEach((ring, i) => {
    ring.rotation.z += reducedMotion ? 0 : dt * (0.11 + i * 0.018);
    ring.material.opacity = 0.44 + pulse * 0.19 + hoverAmount * 0.06;
  });
  neuralNodes.forEach((node, i) => node.scale.setScalar(0.88 + Math.sin(t * 2.55 + i * 0.62) * 0.17 + hoverAmount * 0.09));
  edgeLines.material.opacity = 0.46 + pulse * 0.19 + hoverAmount * 0.10;
  innerMotes.rotation.y += reducedMotion ? 0 : dt * 0.058;
  innerMotes.rotation.z -= reducedMotion ? 0 : dt * 0.034;

  scanRings.forEach((ring, i) => {
    const wave = (Math.sin(t * 1.75 + i * 1.25) + 1) * 0.5;
    ring.position.y = -0.46 + i * 0.29 + Math.sin(t * 0.72 + i) * 0.045;
    ring.material.opacity = 0.07 + wave * 0.14 + hoverAmount * 0.05;
    ring.rotation.z += reducedMotion ? 0 : dt * (i % 2 ? -0.05 : 0.05);
  });

  orbitGroup.rotation.z += reducedMotion ? 0 : dt * (0.19 + hoverAmount * 0.16);
  orbitGroup.rotation.y += reducedMotion ? 0 : dt * 0.075;
  orbitRingA.material.opacity = 0.45 + pulse * 0.16 + hoverAmount * 0.12;
  orbitRingB.material.opacity = 0.30 + pulse * 0.14 + hoverAmount * 0.10;
  orbitRingC.material.opacity = 0.22 + pulse * 0.12 + hoverAmount * 0.08;
  orbitNodes.forEach((node, i) => node.scale.setScalar(0.92 + Math.sin(t * 2.2 + i) * 0.14 + hoverAmount * 0.09));

  arcGroup.rotation.y -= reducedMotion ? 0 : dt * (0.10 + hoverAmount * 0.07);
  arcGroup.rotation.z += reducedMotion ? 0 : dt * 0.055;
  hologramArcs.forEach((arc, i) => {
    arc.rotation.z += reducedMotion ? 0 : dt * (i % 2 ? -0.09 : 0.09);
    arc.material.opacity = 0.22 + ((Math.sin(t * 2.1 + i * 0.8) + 1) * 0.5) * 0.28 + hoverAmount * 0.10;
  });

  signalNodes.forEach((signal, i) => {
    const a = t * (0.90 + i * 0.12) + i * (Math.PI * 2 / signalNodes.length);
    const radius = 1.48 - i * 0.075;
    signal.position.set(
      Math.cos(a) * radius,
      Math.sin(a) * (0.64 + i * 0.035),
      Math.sin(a * 1.7 + i) * 0.22,
    );
    const signalPulse = 0.86 + Math.sin(t * 4.2 + i) * 0.20 + hoverAmount * 0.16;
    signal.scale.setScalar(signalPulse);
    signal.material.opacity = 0.72 + pulse * 0.24;
  });

  pulseRings.forEach((ring, i) => {
    const phase = ((t * 0.34 + i / pulseRings.length) % 1 + 1) % 1;
    const s = 0.78 + phase * 0.72;
    ring.scale.set(s, s, s * 0.72);
    ring.material.opacity = (1 - phase) * (0.10 + hoverAmount * 0.12 + pulse * 0.035);
  });

  sparkles.forEach((sparkle) => {
    const sparklePulse = (Math.sin(t * 3.4 + sparkle.userData.phase) + 1) * 0.5;
    sparkle.scale.setScalar(0.55 + sparklePulse * 0.75 + hoverAmount * 0.18);
    sparkle.rotation.x += reducedMotion ? 0 : dt * 0.7;
    sparkle.rotation.y -= reducedMotion ? 0 : dt * 0.55;
    sparkle.material.opacity = 0.22 + sparklePulse * 0.58 + hoverAmount * 0.10;
  });
  sparkleGroup.rotation.z -= reducedMotion ? 0 : dt * 0.025;

  outerParticles.rotation.z -= reducedMotion ? 0 : dt * 0.06;
  outerParticles.rotation.y += reducedMotion ? 0 : dt * 0.038;
  outerParticles.material.opacity = 0.48 + pulse * 0.15 + hoverAmount * 0.09;

  const eyeOffsetX = pointerX * 0.012;
  const eyeOffsetY = -pointerY * 0.010;
  const blinkScale = Math.max(0.08, 1 - blink * 0.92);
  let leftScaleY = 1.26 * blinkScale;
  let rightScaleY = 1.26 * blinkScale;
  let leftScaleX = 0.74;
  let rightScaleX = 0.74;
  let leftRot = 0;
  let rightRot = 0;
  let faceTilt = 0;

  if (delight > 0) {
    leftScaleY *= 1 - delight * 0.28;
    rightScaleY *= 1 - delight * 0.28;
    leftRot = -0.07 * delight;
    rightRot = 0.07 * delight;
  }
  if (isSleepy) {
    leftScaleY *= 0.28;
    rightScaleY *= 0.28;
  }
  if (isWink) {
    leftScaleY *= 0.10;
    rightScaleY *= 0.92;
    faceTilt = -0.025;
  }
  if (isCurious) {
    if (curiousDirection > 0) {
      leftScaleX *= 0.90;
      leftScaleY *= 0.90;
      rightScaleX *= 1.12;
      rightScaleY *= 1.10;
    } else {
      leftScaleX *= 1.12;
      leftScaleY *= 1.10;
      rightScaleX *= 0.90;
      rightScaleY *= 0.90;
    }
    faceTilt = curiousDirection * 0.045;
  }
  if (surprise > 0) {
    leftScaleX *= 1 + surprise * 0.12;
    rightScaleX *= 1 + surprise * 0.12;
    leftScaleY *= 1 + surprise * 0.22;
    rightScaleY *= 1 + surprise * 0.22;
  }

  faceGroup.rotation.z += (faceTilt - faceGroup.rotation.z) * Math.min(1, dt * 8);
  leftEye.position.x = -0.235 + eyeOffsetX;
  rightEye.position.x = 0.235 + eyeOffsetX;
  leftEye.position.y = 0.24 + eyeOffsetY;
  rightEye.position.y = 0.24 + eyeOffsetY;
  leftEye.scale.set(leftScaleX, leftScaleY, 0.34);
  rightEye.scale.set(rightScaleX, rightScaleY, 0.34);
  leftEye.rotation.z = leftRot;
  rightEye.rotation.z = rightRot;

  const curiousOpacity = isCurious * (1 - surprise);
  smile.material.opacity = Math.max(0, 1 - surprise - curiousOpacity * 0.88);
  smile.scale.x = 1 + delight * 0.34 - isSleepy * 0.14;
  smile.scale.y = 1 + delight * 0.22;
  smile.position.y = -0.025 - delight * 0.01;
  surpriseMouth.material.opacity = surprise * 0.98;
  surpriseMouth.scale.set(0.78 + surprise * 0.14, 1.12 + surprise * 0.18, 0.24);
  tinyMouth.material.opacity = curiousOpacity * 0.92;
  tinyMouth.position.x = curiousDirection * 0.028;

  bodyMaterial.emissiveIntensity = 0.025 + pulse * 0.025 + hoverAmount * 0.01;
  shadow.scale.x = 1 - idleY * 1.6 - Math.max(0, bounceY) * 1.0;
  shadow.material.opacity = Math.max(0.025, 0.075 - Math.max(0, bounceY) * 0.18);

  deformBody(t, pulse, stretch, delight);
  renderer.render(scene, camera);
  if (!stage.classList.contains("webgl-ready")) stage.classList.add("webgl-ready");
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
