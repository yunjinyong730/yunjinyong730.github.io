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
camera.position.set(0, 0.06, 5.35);
camera.lookAt(0, -0.02, 0);

scene.add(new THREE.HemisphereLight(0xfcfdff, 0xbccbec, 2.8));
const keyLight = new THREE.DirectionalLight(0xffffff, 4.8);
keyLight.position.set(-3.6, 4.5, 5.7);
scene.add(keyLight);
const cyanLight = new THREE.PointLight(0x6edfff, 24, 7, 2);
cyanLight.position.set(2.6, 0.6, 2.5);
scene.add(cyanLight);
const violetLight = new THREE.PointLight(0xb49cff, 13, 6, 2);
violetLight.position.set(-2.3, -0.6, 2.0);
scene.add(violetLight);

const slimeRoot = new THREE.Group();
slimeRoot.position.y = -0.06;
scene.add(slimeRoot);

// --- Main translucent gel body ------------------------------------------------
const bodyMaterial = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color("#6486ff"),
  roughness: 0.08,
  metalness: 0,
  transmission: 0.68,
  transparent: true,
  opacity: 0.88,
  thickness: 1.55,
  ior: 1.28,
  clearcoat: 1,
  clearcoatRoughness: 0.045,
  emissive: new THREE.Color("#233fa2"),
  emissiveIntensity: 0.08,
});

const bodyGeometry = new THREE.SphereGeometry(1.05, 64, 50);
const bodyPosition = bodyGeometry.attributes.position;
for (let i = 0; i < bodyPosition.count; i += 1) {
  const x = bodyPosition.getX(i);
  const y = bodyPosition.getY(i);
  const z = bodyPosition.getZ(i);
  const yn = y / 1.05;

  // Splinee silhouette: rounded crown, soft shoulders, wide jelly base.
  let width = 1.03;
  if (yn > 0.45) width *= 0.94 + (1 - yn) * 0.04;
  if (yn < 0.20) width *= 1.03;
  if (yn < -0.18) width *= 1.05 + Math.min(0.14, Math.abs(yn + 0.18) * 0.19);

  let px = x * width;
  let py = y * (yn < 0 ? 0.90 : 1.02);
  let pz = z * 0.88 * (yn < -0.15 ? 1.03 : 1);

  // Flatten the very bottom to make it read like soft gel resting/floating.
  if (py < -0.70) py = -0.70 + (py + 0.70) * 0.23;

  // Tiny asymmetry keeps the blob from looking computer-perfect.
  px += Math.sin(y * 3.2) * 0.015;
  bodyPosition.setXYZ(i, px, py, pz);
}
bodyPosition.needsUpdate = true;
bodyGeometry.computeVertexNormals();
const basePositions = new Float32Array(bodyPosition.array);

const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.position.y = -0.03;
slimeRoot.add(body);

// A faint internal gel mass gives the transparent shell depth.
const innerBody = new THREE.Mesh(
  bodyGeometry.clone(),
  new THREE.MeshBasicMaterial({
    color: 0x6fc5ff,
    transparent: true,
    opacity: 0.055,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }),
);
innerBody.scale.setScalar(0.955);
innerBody.position.copy(body.position);
slimeRoot.add(innerBody);

// --- Soft arms ---------------------------------------------------------------
const armMaterial = bodyMaterial;
const armGeometry = new THREE.SphereGeometry(0.34, 30, 24);
const makeArm = (side) => {
  const pivot = new THREE.Group();
  pivot.position.set(side * 0.89, -0.10, 0.00);
  const mesh = new THREE.Mesh(armGeometry, armMaterial);
  mesh.position.set(side * 0.14, -0.10, 0.03);
  mesh.scale.set(0.76, 1.05, 0.72);
  mesh.rotation.z = side * -0.20;
  pivot.add(mesh);
  slimeRoot.add(pivot);
  return { pivot, mesh };
};
const leftArm = makeArm(-1);
const rightArm = makeArm(1);

// --- AI neural core ----------------------------------------------------------
const core = new THREE.Group();
core.position.set(0, -0.24, 0.02);
slimeRoot.add(core);

const coreHalo = new THREE.Mesh(
  new THREE.SphereGeometry(0.42, 36, 28),
  new THREE.MeshBasicMaterial({
    color: 0x68ddff,
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }),
);
core.add(coreHalo);

const coreSphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.18, 28, 22),
  new THREE.MeshBasicMaterial({
    color: 0xd9feff,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }),
);
core.add(coreSphere);

const coreRingMat = new THREE.MeshBasicMaterial({
  color: 0x9beaff,
  transparent: true,
  opacity: 0.50,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
const coreRings = [];
for (let i = 0; i < 4; i += 1) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.34 + i * 0.085, 0.007, 8, 80), coreRingMat.clone());
  ring.rotation.x = Math.PI / 2 + i * 0.42;
  ring.rotation.y = 0.28 + i * 0.71;
  ring.rotation.z = i * 0.22;
  coreRings.push(ring);
  core.add(ring);
}

const neuralGroup = new THREE.Group();
core.add(neuralGroup);
const neuralPositions = [
  [-0.38, 0.17, 0.02], [0.34, 0.21, 0.05], [-0.33, -0.20, 0.06], [0.35, -0.16, 0.08],
  [-0.07, 0.38, -0.01], [0.08, -0.39, 0.04], [-0.46, 0.00, -0.03], [0.46, 0.04, 0.02],
  [-0.19, 0.07, 0.27], [0.20, -0.04, 0.24], [0.14, 0.19, -0.23], [-0.13, -0.20, -0.20],
];
const nodeMaterial = new THREE.MeshBasicMaterial({
  color: 0xf2ffff,
  transparent: true,
  opacity: 0.94,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
const neuralNodes = neuralPositions.map(([x, y, z], index) => {
  const node = new THREE.Mesh(new THREE.SphereGeometry(index < 4 ? 0.030 : 0.022, 14, 12), nodeMaterial);
  node.position.set(x, y, z);
  neuralGroup.add(node);
  return node;
});
const edges = [];
const connect = (a, b) => edges.push(...neuralPositions[a], ...neuralPositions[b]);
[[0,4],[0,6],[0,8],[1,4],[1,7],[1,10],[2,5],[2,6],[2,11],[3,5],[3,7],[3,9],[4,8],[4,10],[5,9],[5,11],[8,9],[10,11],[8,10],[9,11]].forEach(([a,b]) => connect(a,b));
const edgeGeometry = new THREE.BufferGeometry();
edgeGeometry.setAttribute("position", new THREE.Float32BufferAttribute(edges, 3));
const edgeLines = new THREE.LineSegments(edgeGeometry, new THREE.LineBasicMaterial({
  color: 0xc8f8ff,
  transparent: true,
  opacity: 0.42,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
}));
neuralGroup.add(edgeLines);

// Internal data motes: visible through the gel and more AI-like than facial tech details.
const moteCount = 56;
const moteArray = new Float32Array(moteCount * 3);
for (let i = 0; i < moteCount; i += 1) {
  const theta = Math.random() * Math.PI * 2;
  const radius = Math.sqrt(Math.random()) * 0.82;
  moteArray[i * 3] = Math.cos(theta) * radius;
  moteArray[i * 3 + 1] = (Math.random() - 0.52) * 1.30;
  moteArray[i * 3 + 2] = (Math.random() - 0.5) * 0.80;
}
const innerMotes = new THREE.Points(
  new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(moteArray, 3)),
  new THREE.PointsMaterial({
    color: 0xcff8ff,
    size: 0.026,
    transparent: true,
    opacity: 0.50,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  }),
);
slimeRoot.add(innerMotes);

// --- Face --------------------------------------------------------------------
const faceGroup = new THREE.Group();
faceGroup.position.z = 0.01;
slimeRoot.add(faceGroup);

const eyeGlowMaterial = new THREE.MeshBasicMaterial({ color: 0xcdfaff });
const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x24489a });
const highlightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

const makeEye = (x) => {
  const group = new THREE.Group();
  group.position.set(x, 0.22, 0.91);

  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.165, 30, 24), eyeGlowMaterial);
  eye.scale.set(0.78, 1.30, 0.40);
  group.add(eye);

  const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.046, 20, 16), pupilMaterial);
  pupil.position.set(0, -0.006, 0.145);
  pupil.scale.set(0.86, 1.08, 0.50);
  group.add(pupil);

  const highlight = new THREE.Mesh(new THREE.SphereGeometry(0.019, 12, 10), highlightMaterial);
  highlight.position.set(-0.021, 0.038, 0.192);
  group.add(highlight);

  return { group, eye, pupil, highlight };
};
const leftEye = makeEye(-0.285);
const rightEye = makeEye(0.285);
faceGroup.add(leftEye.group, rightEye.group);

const cheekMaterial = new THREE.MeshBasicMaterial({ color: 0xffcde3, transparent: true, opacity: 0.28, depthWrite: false });
const cheekGeo = new THREE.SphereGeometry(0.073, 18, 14);
const makeCheek = (x) => {
  const cheek = new THREE.Mesh(cheekGeo, cheekMaterial.clone());
  cheek.position.set(x, -0.01, 0.89);
  cheek.scale.set(1.45, 0.58, 0.32);
  return cheek;
};
const cheekL = makeCheek(-0.44);
const cheekR = makeCheek(0.44);
faceGroup.add(cheekL, cheekR);

const mouthMaterial = new THREE.MeshBasicMaterial({ color: 0x183676, transparent: true, opacity: 1 });
const smile = new THREE.Mesh(new THREE.TorusGeometry(0.118, 0.017, 10, 40, Math.PI), mouthMaterial);
smile.position.set(0, -0.035, 0.987);
smile.rotation.z = Math.PI;
faceGroup.add(smile);

const happyMouth = new THREE.Mesh(
  new THREE.SphereGeometry(0.072, 20, 16),
  new THREE.MeshBasicMaterial({ color: 0x173674, transparent: true, opacity: 0, depthWrite: false }),
);
happyMouth.position.set(0, -0.075, 0.990);
happyMouth.scale.set(1.20, 0.70, 0.28);
faceGroup.add(happyMouth);

// --- Outer orbit / AI data nodes --------------------------------------------
const orbitGroup = new THREE.Group();
slimeRoot.add(orbitGroup);
const orbitLineMaterial = new THREE.MeshBasicMaterial({ color: 0x77b8ff, transparent: true, opacity: 0.27, depthWrite: false });
const orbitRingA = new THREE.Mesh(new THREE.TorusGeometry(1.43, 0.007, 6, 110), orbitLineMaterial);
orbitRingA.scale.y = 0.58;
orbitRingA.rotation.x = Math.PI / 2.55;
orbitRingA.rotation.z = 0.28;
orbitGroup.add(orbitRingA);
const orbitRingB = new THREE.Mesh(new THREE.TorusGeometry(1.31, 0.006, 6, 100), orbitLineMaterial.clone());
orbitRingB.scale.y = 0.76;
orbitRingB.rotation.x = Math.PI / 2.08;
orbitRingB.rotation.y = 0.78;
orbitGroup.add(orbitRingB);

const orbitNodeMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xb0eaff,
  emissive: 0x4387f7,
  emissiveIntensity: 0.72,
  transparent: true,
  opacity: 0.92,
  roughness: 0.07,
  transmission: 0.12,
});
const orbitNodes = [];
[[1.20,0.56,0.10,0.075],[-1.30,0.25,0.12,0.056],[0.83,-0.99,0.18,0.050],[-0.72,1.06,0,0.047],[1.33,-0.18,-0.13,0.042],[-1.02,-0.71,-0.08,0.041]].forEach(([x,y,z,r]) => {
  const node = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 14), orbitNodeMaterial);
  node.position.set(x, y, z);
  orbitNodes.push(node);
  orbitGroup.add(node);
});

const outerParticleCount = 36;
const outerArray = new Float32Array(outerParticleCount * 3);
for (let i = 0; i < outerParticleCount; i += 1) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 1.22 + Math.random() * 0.48;
  outerArray[i * 3] = Math.cos(angle) * radius;
  outerArray[i * 3 + 1] = (Math.random() - 0.5) * 2.08;
  outerArray[i * 3 + 2] = (Math.random() - 0.5) * 0.82 - 0.14;
}
const outerParticles = new THREE.Points(
  new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(outerArray, 3)),
  new THREE.PointsMaterial({ color: 0xa8ddff, size: 0.022, transparent: true, opacity: 0.30, sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false }),
);
slimeRoot.add(outerParticles);

const shadow = new THREE.Mesh(
  new THREE.CircleGeometry(0.86, 52),
  new THREE.MeshBasicMaterial({ color: 0x466bc4, transparent: true, opacity: 0.085, depthWrite: false }),
);
shadow.rotation.x = -Math.PI / 2;
shadow.scale.y = 0.33;
shadow.position.set(0, -1.15, -0.10);
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
let blinkStartedAt = -10000;
let nextBlinkAt = performance.now() + 1800 + Math.random() * 1900;
let waveStartedAt = -10000;
let nextWaveAt = performance.now() + 3800 + Math.random() * 2600;
let gestureStartedAt = -10000;
let gestureMode = 1;
let nextGestureAt = performance.now() + 5200 + Math.random() * 2600;
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
  pointerX = 0;
  pointerY = 0;
  targetRotX = 0;
  targetRotY = 0;
}, { passive: true });
stage.addEventListener("click", () => {
  bounceStartedAt = performance.now();
  waveStartedAt = performance.now();
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

const deformBody = (time, pulse, squash, stretch) => {
  if (reducedMotion) return;
  const array = bodyPosition.array;
  const wobble = 0.016 + hoverAmount * 0.007;
  const xScale = 1 + squash * 0.10 - stretch * 0.045;
  const yScale = 1 - squash * 0.13 + stretch * 0.11;
  const zScale = 1 + squash * 0.055 - stretch * 0.025;

  for (let i = 0; i < array.length; i += 3) {
    const x = basePositions[i];
    const y = basePositions[i + 1];
    const z = basePositions[i + 2];
    const waveA = Math.sin(time * 1.22 + y * 4.0 + x * 1.9) * wobble;
    const waveB = Math.sin(time * 0.93 + z * 4.4 - x * 1.7) * wobble * 0.50;
    const lowerSoftness = y < -0.16 ? Math.sin(time * 1.62 + x * 3.1) * 0.008 * (Math.abs(y) + 0.2) : 0;
    const radial = 1 + waveA + waveB + pulse * 0.012;
    let px = x * radial * xScale;
    let py = y * yScale + lowerSoftness;
    let pz = z * radial * zScale;
    if (py < -0.70) py = -0.70 + (py + 0.70) * 0.23;
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
  hoverAmount += (targetHover - hoverAmount) * Math.min(1, dt * 5.5);

  if (!reducedMotion && now >= nextBlinkAt) {
    blinkStartedAt = now;
    nextBlinkAt = now + 2600 + Math.random() * 3000;
  }
  if (!reducedMotion && now >= nextWaveAt) {
    waveStartedAt = now;
    nextWaveAt = now + 6500 + Math.random() * 3500;
  }
  if (!reducedMotion && now >= nextGestureAt) {
    gestureStartedAt = now;
    gestureMode *= -1;
    nextGestureAt = now + 6200 + Math.random() * 3600;
  }

  const blinkAge = (now - blinkStartedAt) / 1000;
  const blink = !reducedMotion && blinkAge >= 0 && blinkAge < 0.17 ? Math.sin((blinkAge / 0.17) * Math.PI) : 0;

  const bounceAge = (now - bounceStartedAt) / 1000;
  const bounceActive = bounceAge >= 0 && bounceAge < 0.82;
  const bounceEnvelope = bounceActive ? Math.sin((bounceAge / 0.82) * Math.PI) : 0;
  const bounceY = bounceActive ? Math.sin((bounceAge / 0.82) * Math.PI * 2.0) * 0.13 * bounceEnvelope : 0;
  const clickSquash = bounceActive ? Math.sin((bounceAge / 0.82) * Math.PI * 2.0 + Math.PI / 2) * 0.20 * bounceEnvelope : 0;

  const gestureAge = (now - gestureStartedAt) / 1000;
  const gestureEnvelope = !reducedMotion && gestureAge >= 0 && gestureAge < 0.86 ? Math.sin((gestureAge / 0.86) * Math.PI) : 0;
  const autoSquash = gestureMode < 0 ? gestureEnvelope * 0.16 : 0;
  const autoStretch = gestureMode > 0 ? gestureEnvelope * 0.15 : 0;

  const waveAge = (now - waveStartedAt) / 1000;
  const waveEnvelope = !reducedMotion && waveAge >= 0 && waveAge < 1.15 ? Math.sin((waveAge / 1.15) * Math.PI) : 0;
  const waveOsc = waveEnvelope * Math.sin(waveAge * Math.PI * 5.0);

  const idleY = reducedMotion ? 0 : Math.sin(t * 1.28) * 0.052;
  const pulse = reducedMotion ? 0.25 : (Math.sin(t * 2.0) + 1) * 0.5;
  const breath = reducedMotion ? 1 : 1 + Math.sin(t * 1.48) * 0.008;
  const squash = clickSquash + autoSquash;
  const stretch = autoStretch;

  slimeRoot.position.y = -0.06 + idleY + Math.max(0, bounceY);
  slimeRoot.rotation.x = currentRotX;
  slimeRoot.rotation.y = currentRotY;
  slimeRoot.rotation.z = reducedMotion ? 0 : Math.sin(t * 0.68) * 0.012;
  slimeRoot.scale.set(1, breath, 1);

  // Arms stay cute and soft; right arm waves automatically and on click.
  leftArm.pivot.rotation.z = 0.08 + Math.sin(t * 1.15) * 0.06;
  rightArm.pivot.rotation.z = -0.08 - Math.sin(t * 1.05 + 0.8) * 0.06 - waveEnvelope * 0.52 + waveOsc * 0.22;
  leftArm.mesh.scale.y = 1.05 + Math.sin(t * 1.3) * 0.025;
  rightArm.mesh.scale.y = 1.05 + Math.sin(t * 1.2 + 1.1) * 0.025;

  core.scale.setScalar(0.96 + pulse * 0.10 + hoverAmount * 0.035);
  core.rotation.y += reducedMotion ? 0 : dt * (0.30 + hoverAmount * 0.16);
  core.rotation.z -= reducedMotion ? 0 : dt * 0.105;
  coreHalo.material.opacity = 0.10 + pulse * 0.13 + hoverAmount * 0.035;
  coreSphere.material.opacity = 0.78 + pulse * 0.18;
  coreRings.forEach((ring, index) => {
    ring.rotation.z += reducedMotion ? 0 : dt * (0.06 + index * 0.018);
    ring.material.opacity = 0.34 + pulse * 0.20;
  });
  neuralNodes.forEach((node, index) => node.scale.setScalar(reducedMotion ? 1 : 0.90 + Math.sin(t * 2.15 + index * 0.67) * 0.14));
  edgeLines.material.opacity = 0.28 + pulse * 0.18;
  innerMotes.rotation.y += reducedMotion ? 0 : dt * 0.045;
  innerMotes.rotation.z -= reducedMotion ? 0 : dt * 0.022;

  orbitGroup.rotation.z += reducedMotion ? 0 : dt * (0.12 + hoverAmount * 0.08);
  orbitGroup.rotation.y += reducedMotion ? 0 : dt * 0.043;
  orbitNodes.forEach((node, index) => node.scale.setScalar(0.90 + Math.sin(t * 1.75 + index) * 0.10));
  outerParticles.rotation.z -= reducedMotion ? 0 : dt * 0.030;
  outerParticles.rotation.y += reducedMotion ? 0 : dt * 0.018;

  // Friendly face: large vertical eyes, gentle tracking, soft blinks.
  const pupilTargetX = pointerX * 0.030;
  const pupilTargetY = -pointerY * 0.022;
  [leftEye, rightEye].forEach((eye) => {
    eye.pupil.position.x += (pupilTargetX - eye.pupil.position.x) * Math.min(1, dt * 9.5);
    eye.pupil.position.y += ((-0.006 + pupilTargetY) - eye.pupil.position.y) * Math.min(1, dt * 9.5);
  });
  const eyeOpen = Math.max(0.08, 1 - blink * 0.94);
  const happy = Math.min(1, hoverAmount * 0.75 + bounceEnvelope * 0.65 + waveEnvelope * 0.25);
  leftEye.eye.scale.set(0.78, 1.30 * eyeOpen * (1 - happy * 0.035), 0.40);
  rightEye.eye.scale.set(0.78, 1.30 * eyeOpen * (1 - happy * 0.035), 0.40);
  leftEye.pupil.scale.y = 1.08 * eyeOpen;
  rightEye.pupil.scale.y = 1.08 * eyeOpen;
  leftEye.highlight.scale.y = eyeOpen;
  rightEye.highlight.scale.y = eyeOpen;

  cheekL.material.opacity = 0.24 + happy * 0.22;
  cheekR.material.opacity = 0.24 + happy * 0.22;
  smile.material.opacity = 1 - bounceEnvelope * 0.72;
  smile.scale.x = 1 + happy * 0.22;
  happyMouth.material.opacity = bounceEnvelope * 0.78;
  happyMouth.scale.set(1.20 + bounceEnvelope * 0.12, 0.70 + bounceEnvelope * 0.16, 0.28);

  bodyMaterial.emissiveIntensity = 0.06 + pulse * 0.06 + hoverAmount * 0.04;
  cyanLight.intensity = 21 + pulse * 5 + hoverAmount * 2;
  shadow.scale.x = 1 - idleY * 1.6 - Math.max(0, bounceY) * 1.05;
  shadow.material.opacity = Math.max(0.022, 0.08 - Math.max(0, bounceY) * 0.18);

  deformBody(t, pulse, squash, stretch);
  innerBody.geometry.attributes.position.array.set(bodyPosition.array);
  innerBody.geometry.attributes.position.needsUpdate = true;
  if (frame % 6 === 0) innerBody.geometry.computeVertexNormals();

  renderer.render(scene, camera);
  if (!stage.classList.contains("webgl-ready")) stage.classList.add("webgl-ready");
  requestAnimationFrame(animate);
};

requestAnimationFrame(animate);
