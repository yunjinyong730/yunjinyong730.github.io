import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const stage = document.getElementById("mascotStage");
if (!stage) throw new Error("AI slime stage not found");

const speech = document.getElementById("mascotSpeech");
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
camera.lookAt(0, 0.02, 0);

scene.add(new THREE.HemisphereLight(0xffffff, 0xc8d0da, 3.0));
const keyLight = new THREE.DirectionalLight(0xffffff, 4.8);
keyLight.position.set(-3.4, 4.8, 5.8);
scene.add(keyLight);
const coreLight = new THREE.PointLight(0x76dfff, 18, 7, 2);
coreLight.position.set(0, -0.1, 2.4);
scene.add(coreLight);
const rimLight = new THREE.PointLight(0x8b9dff, 10, 7, 2);
rimLight.position.set(2.8, 0.5, 2.2);
scene.add(rimLight);

const slimeRoot = new THREE.Group();
slimeRoot.position.y = -0.04;
scene.add(slimeRoot);

const bodyGeometry = new THREE.SphereGeometry(1.06, 64, 48);
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
  color: new THREE.Color("#f2f3f5"),
  roughness: 0.08,
  metalness: 0,
  transmission: 0.84,
  transparent: true,
  opacity: 0.66,
  thickness: 1.78,
  ior: 1.17,
  clearcoat: 1,
  clearcoatRoughness: 0.05,
  emissive: new THREE.Color("#cfd4db"),
  emissiveIntensity: 0.035,
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

const coreGroup = new THREE.Group();
coreGroup.position.set(0, -0.12, 0.18);
slimeRoot.add(coreGroup);

const coreHalo = new THREE.Mesh(
  new THREE.SphereGeometry(0.46, 32, 24),
  new THREE.MeshBasicMaterial({ color: 0x7fe6ff, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false }),
);
coreGroup.add(coreHalo);
const coreSphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.17, 24, 18),
  new THREE.MeshBasicMaterial({ color: 0xf2feff, transparent: true, opacity: 0.98, blending: THREE.AdditiveBlending, depthWrite: false }),
);
coreGroup.add(coreSphere);
const coreGlow = new THREE.Mesh(
  new THREE.SphereGeometry(0.28, 24, 18),
  new THREE.MeshBasicMaterial({ color: 0x74dcff, transparent: true, opacity: 0.34, blending: THREE.AdditiveBlending, depthWrite: false }),
);
coreGroup.add(coreGlow);

const coreRingMaterial = new THREE.MeshBasicMaterial({ color: 0x9deaff, transparent: true, opacity: 0.56, blending: THREE.AdditiveBlending, depthWrite: false });
const coreRings = [];
for (let i = 0; i < 5; i += 1) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.31 + i * 0.073, 0.008, 8, 80), coreRingMaterial.clone());
  ring.rotation.x = Math.PI / 2 + i * 0.36;
  ring.rotation.y = i * 0.68;
  ring.rotation.z = i * 0.22;
  coreRings.push(ring);
  coreGroup.add(ring);
}

const neuralPositions = [
  [-0.36, 0.18, 0.03], [0.34, 0.21, 0.05], [-0.31, -0.18, 0.06], [0.33, -0.17, 0.08],
  [0, 0.38, -0.02], [0, -0.38, 0.03], [-0.45, 0, -0.03], [0.45, 0.03, 0.02],
  [-0.18, 0.08, 0.25], [0.20, -0.03, 0.23], [0.12, 0.18, -0.22], [-0.12, -0.19, -0.20],
];
const neuralGroup = new THREE.Group();
coreGroup.add(neuralGroup);
const nodeMat = new THREE.MeshBasicMaterial({ color: 0xf4feff, transparent: true, opacity: 0.96, blending: THREE.AdditiveBlending, depthWrite: false });
const neuralNodes = neuralPositions.map(([x, y, z], idx) => {
  const node = new THREE.Mesh(new THREE.SphereGeometry(idx < 4 ? 0.032 : 0.024, 12, 10), nodeMat);
  node.position.set(x, y, z);
  neuralGroup.add(node);
  return node;
});
const links = [];
[[0,4],[0,6],[0,8],[1,4],[1,7],[1,10],[2,5],[2,6],[2,11],[3,5],[3,7],[3,9],[4,8],[4,10],[5,9],[5,11],[8,9],[10,11],[8,10],[9,11]].forEach(([a, b]) => links.push(...neuralPositions[a], ...neuralPositions[b]));
const edgeGeometry = new THREE.BufferGeometry();
edgeGeometry.setAttribute("position", new THREE.Float32BufferAttribute(links, 3));
const edgeLines = new THREE.LineSegments(edgeGeometry, new THREE.LineBasicMaterial({ color: 0xbff6ff, transparent: true, opacity: 0.52, blending: THREE.AdditiveBlending, depthWrite: false }));
neuralGroup.add(edgeLines);

const moteCount = 70;
const moteArray = new Float32Array(moteCount * 3);
for (let i = 0; i < moteCount; i += 1) {
  const a = Math.random() * Math.PI * 2;
  const r = Math.sqrt(Math.random()) * 0.82;
  moteArray[i * 3] = Math.cos(a) * r;
  moteArray[i * 3 + 1] = (Math.random() - 0.5) * 1.26;
  moteArray[i * 3 + 2] = (Math.random() - 0.5) * 0.72;
}
const innerMotes = new THREE.Points(
  new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(moteArray, 3)),
  new THREE.PointsMaterial({ color: 0xcff8ff, size: 0.026, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true }),
);
slimeRoot.add(innerMotes);

const scanGroup = new THREE.Group();
slimeRoot.add(scanGroup);
const scanRings = [];
for (let i = 0; i < 4; i += 1) {
  const mat = new THREE.MeshBasicMaterial({ color: i % 2 ? 0x88c8ff : 0x8ff1ff, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.72 - i * 0.055, 0.006, 6, 72), mat);
  ring.rotation.x = Math.PI / 2;
  ring.scale.z = 0.82;
  ring.position.y = -0.46 + i * 0.29;
  scanRings.push(ring);
  scanGroup.add(ring);
}

const faceGroup = new THREE.Group();
slimeRoot.add(faceGroup);
const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x101010, depthTest: false, depthWrite: false });
const makeEye = (x) => {
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.145, 24, 18), eyeMaterial);
  eye.position.set(x, 0.24, 1.015);
  eye.scale.set(0.74, 1.26, 0.28);
  eye.renderOrder = 50;
  faceGroup.add(eye);
  return eye;
};
const leftEye = makeEye(-0.235);
const rightEye = makeEye(0.235);

const mouthMaterial = new THREE.MeshBasicMaterial({ color: 0x101010, transparent: true, opacity: 1, depthTest: false, depthWrite: false });
function makeTube(points, radius = 0.018) {
  const curve = new THREE.CatmullRomCurve3(points);
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 18, radius, 8, false), mouthMaterial.clone());
  mesh.renderOrder = 60;
  return mesh;
}

const smile = makeTube([
  new THREE.Vector3(-0.105, 0.015, 0),
  new THREE.Vector3(-0.052, -0.045, 0),
  new THREE.Vector3(0, -0.06, 0),
  new THREE.Vector3(0.052, -0.045, 0),
  new THREE.Vector3(0.105, 0.015, 0),
], 0.018);
smile.position.set(0, -0.02, 1.075);
faceGroup.add(smile);

const sleepyMouth = makeTube([
  new THREE.Vector3(-0.055, 0, 0),
  new THREE.Vector3(0, 0.010, 0),
  new THREE.Vector3(0.055, 0, 0),
], 0.014);
sleepyMouth.position.set(0, -0.052, 1.078);
sleepyMouth.material.opacity = 0;
faceGroup.add(sleepyMouth);

const curiousMouth = new THREE.Mesh(new THREE.SphereGeometry(0.035, 14, 10), mouthMaterial.clone());
curiousMouth.position.set(0.028, -0.05, 1.08);
curiousMouth.scale.set(1.0, 0.65, 0.20);
curiousMouth.material.opacity = 0;
curiousMouth.renderOrder = 60;
faceGroup.add(curiousMouth);

const surpriseMouth = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.016, 8, 28), mouthMaterial.clone());
surpriseMouth.position.set(0, -0.055, 1.08);
surpriseMouth.scale.set(0.85, 1.12, 0.32);
surpriseMouth.material.opacity = 0;
surpriseMouth.renderOrder = 60;
faceGroup.add(surpriseMouth);

const happyMouth = new THREE.Mesh(new THREE.SphereGeometry(0.082, 18, 14), mouthMaterial.clone());
happyMouth.position.set(0, -0.07, 1.078);
happyMouth.scale.set(1.22, 0.68, 0.22);
happyMouth.material.opacity = 0;
happyMouth.renderOrder = 60;
faceGroup.add(happyMouth);

const orbitGroup = new THREE.Group();
slimeRoot.add(orbitGroup);
const orbitMatA = new THREE.MeshBasicMaterial({ color: 0x67baff, transparent: true, opacity: 0.54, blending: THREE.AdditiveBlending, depthWrite: false });
const orbitMatB = new THREE.MeshBasicMaterial({ color: 0x8ae7ff, transparent: true, opacity: 0.39, blending: THREE.AdditiveBlending, depthWrite: false });
const orbitMatC = new THREE.MeshBasicMaterial({ color: 0x98aaff, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false });

const orbitRingA = new THREE.Mesh(new THREE.TorusGeometry(1.52, 0.012, 8, 120), orbitMatA);
orbitRingA.scale.y = 0.58;
orbitRingA.rotation.x = Math.PI / 2.55;
orbitRingA.rotation.z = 0.24;
orbitGroup.add(orbitRingA);
const orbitRingB = new THREE.Mesh(new THREE.TorusGeometry(1.36, 0.010, 8, 112), orbitMatB);
orbitRingB.scale.y = 0.74;
orbitRingB.rotation.x = Math.PI / 2.12;
orbitRingB.rotation.y = 0.78;
orbitGroup.add(orbitRingB);
const orbitRingC = new THREE.Mesh(new THREE.TorusGeometry(1.19, 0.008, 8, 104), orbitMatC);
orbitRingC.scale.y = 0.84;
orbitRingC.rotation.x = Math.PI / 2.35;
orbitRingC.rotation.y = -0.65;
orbitRingC.rotation.z = 0.48;
orbitGroup.add(orbitRingC);

const arcGroup = new THREE.Group();
slimeRoot.add(arcGroup);
const hologramArcs = [];
for (let i = 0; i < 7; i += 1) {
  const radius = 1.27 + (i % 3) * 0.11;
  const arc = Math.PI * (0.32 + (i % 4) * 0.08);
  const mat = new THREE.MeshBasicMaterial({ color: i % 3 === 0 ? 0x73c6ff : i % 3 === 1 ? 0x8df2ff : 0xa1a8ff, transparent: true, opacity: 0.38, blending: THREE.AdditiveBlending, depthWrite: false });
  const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.014, 8, 68, arc), mat);
  mesh.rotation.x = Math.PI / (2.15 + (i % 3) * 0.2);
  mesh.rotation.y = i * 0.73;
  mesh.rotation.z = i * 0.84;
  hologramArcs.push(mesh);
  arcGroup.add(mesh);
}

const orbitNodeMat = new THREE.MeshPhysicalMaterial({ color: 0xe3fbff, emissive: 0x4f91ff, emissiveIntensity: 1.28, transparent: true, opacity: 0.99, roughness: 0.04, transmission: 0.10 });
const orbitNodes = [];
[[1.30,0.58,0.10,0.082],[-1.38,0.24,0.10,0.066],[0.90,-1.04,0.17,0.060],[-0.78,1.10,0,0.056],[1.40,-0.16,-0.12,0.050],[-1.10,-0.76,-0.06,0.048],[0.18,1.27,-0.14,0.046],[-0.20,-1.22,0.10,0.044]].forEach(([x, y, z, r]) => {
  const node = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), orbitNodeMat);
  node.position.set(x, y, z);
  orbitNodes.push(node);
  orbitGroup.add(node);
});

const signalMat = new THREE.MeshBasicMaterial({ color: 0xf4ffff, transparent: true, opacity: 0.98, blending: THREE.AdditiveBlending, depthWrite: false });
const signalNodes = [];
for (let i = 0; i < 4; i += 1) {
  const signal = new THREE.Mesh(new THREE.SphereGeometry(0.045 - i * 0.004, 12, 10), signalMat.clone());
  signalNodes.push(signal);
  slimeRoot.add(signal);
}

const pulseGroup = new THREE.Group();
slimeRoot.add(pulseGroup);
const pulseRings = [];
for (let i = 0; i < 3; i += 1) {
  const mat = new THREE.MeshBasicMaterial({ color: i === 1 ? 0x91eaff : 0x78b9ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.02, 0.010, 7, 88), mat);
  ring.rotation.x = Math.PI / 2;
  ring.scale.z = 0.72;
  pulseRings.push(ring);
  pulseGroup.add(ring);
}

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
const outerParticles = new THREE.Points(new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(outerArray, 3)), new THREE.PointsMaterial({ color: 0xb9edff, size: 0.031, transparent: true, opacity: 0.62, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true }));
slimeRoot.add(outerParticles);

const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.88, 48), new THREE.MeshBasicMaterial({ color: 0x566276, transparent: true, opacity: 0.075, depthWrite: false }));
shadow.rotation.x = -Math.PI / 2;
shadow.scale.y = 0.32;
shadow.position.set(0, -1.22, -0.12);
scene.add(shadow);

const idleLines = [
  "안녕! 궁금한 걸 물어봐.",
  "논문이나 프로젝트를 보여줄까?",
  "출시한 앱도 바로 찾아줄 수 있어!",
  "AI 연구부터 제품 경험까지 안내할게.",
];
const hoverLines = [
  "무엇부터 볼까? 논문, 프로젝트, 앱?",
  "나를 누르면 바로 포트폴리오를 안내할게!",
  "궁금한 주제를 아래에서 골라도 좋아.",
];
const clickLines = [
  "좋아! 윤진용의 포트폴리오를 같이 볼까?",
  "바로 안내할게. 어떤 내용이 궁금해?",
];

let speechLockUntil = 0;
let speechTimer = null;
function showSpeech(text, duration = 0) {
  if (!speech) return;
  speech.textContent = text;
  speech.classList.add("is-visible", "is-speaking");
  window.clearTimeout(speechTimer);
  if (duration > 0) {
    speechLockUntil = performance.now() + duration;
    speechTimer = window.setTimeout(() => speech.classList.remove("is-speaking"), Math.max(500, duration - 250));
  }
}
function randomLine(lines) {
  return lines[Math.floor(Math.random() * lines.length)];
}
showSpeech(idleLines[0], 4200);

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
let nextExpressionAt = performance.now() + 3400 + Math.random() * 2400;
let curiousDirection = 1;
let lastTime = performance.now();
let frame = 0;

function triggerExpression(mode, duration = 1200) {
  expressionMode = mode;
  expressionUntil = performance.now() + duration;
}

stage.addEventListener("pointermove", (event) => {
  const rect = stage.getBoundingClientRect();
  pointerX = THREE.MathUtils.clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1);
  pointerY = THREE.MathUtils.clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1);
  targetRotY = pointerX * 0.14;
  targetRotX = -pointerY * 0.08;
}, { passive: true });

stage.addEventListener("pointerenter", () => {
  targetHover = 1;
  triggerExpression("happy", 1600);
  showSpeech(randomLine(hoverLines), 2200);
}, { passive: true });

stage.addEventListener("pointerleave", () => {
  targetHover = 0;
  targetRotX = 0;
  targetRotY = 0;
  pointerX = 0;
  pointerY = 0;
  window.setTimeout(() => {
    if (performance.now() >= speechLockUntil) showSpeech(randomLine(idleLines), 2600);
  }, 500);
}, { passive: true });

stage.addEventListener("click", () => {
  bounceStartedAt = performance.now();
  surpriseStartedAt = performance.now();
  triggerExpression("surprised", 850);
  showSpeech(randomLine(clickLines), 2800);
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

function deformBody(t, pulse, stretch) {
  if (reducedMotion) return;
  const arr = bodyPos.array;
  for (let i = 0; i < arr.length; i += 3) {
    const x = basePositions[i];
    const y = basePositions[i + 1];
    const z = basePositions[i + 2];
    const wave = Math.sin(t * 1.45 + y * 4.0 + x * 2.0) * 0.018 + Math.cos(t * 1.08 + z * 4.4) * 0.012;
    const skirt = y < -0.36 ? Math.sin(Math.atan2(z, x) * 3 + t * 1.15) * 0.028 : 0;
    arr[i] = x * (1 + wave + skirt + pulse * 0.012) * (1 - stretch * 0.06);
    arr[i + 1] = y * (1 + stretch * 0.10) + Math.sin(t * 1.25 + x * 4.0) * 0.012;
    arr[i + 2] = z * (1 + wave + skirt + pulse * 0.012) * (1 - stretch * 0.06);
  }
  bodyPos.needsUpdate = true;
  if (frame % 3 === 0) bodyGeometry.computeVertexNormals();
}

function setMouth(mode) {
  smile.material.opacity = mode === "smile" ? 1 : 0;
  sleepyMouth.material.opacity = mode === "sleepy" ? 1 : 0;
  curiousMouth.material.opacity = mode === "curious" ? 1 : 0;
  surpriseMouth.material.opacity = mode === "surprised" ? 1 : 0;
  happyMouth.material.opacity = mode === "happy" ? 1 : 0;
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
    nextBlinkAt = now + 2300 + Math.random() * 1900;
  }
  const blinkAge = (now - blinkStartedAt) / 1000;
  const blink = blinkAge >= 0 && blinkAge < 0.18 ? Math.sin((blinkAge / 0.18) * Math.PI) : 0;

  if (now > expressionUntil && now > nextExpressionAt && targetHover < 0.2) {
    const modes = ["winkLeft", "winkRight", "sleepy", "curious", "happy"];
    expressionMode = modes[Math.floor(Math.random() * modes.length)];
    expressionUntil = now + 900 + Math.random() * 700;
    nextExpressionAt = expressionUntil + 3000 + Math.random() * 2600;
    curiousDirection = Math.random() > 0.5 ? 1 : -1;
  }
  if (now > expressionUntil && expressionMode !== "idle" && targetHover < 0.2) expressionMode = "idle";

  if (speech && now > speechLockUntil + 2600 && !stage.matches(":hover")) showSpeech(randomLine(idleLines), 2700);

  const bounceAge = (now - bounceStartedAt) / 1000;
  const bounceEnv = bounceAge >= 0 && bounceAge < 0.82 ? Math.sin((bounceAge / 0.82) * Math.PI) : 0;
  const bounceY = bounceEnv ? Math.sin((bounceAge / 0.82) * Math.PI * 2.05) * 0.14 * bounceEnv : 0;
  const stretch = bounceEnv ? Math.sin((bounceAge / 0.82) * Math.PI * 2.05 + Math.PI / 2) * 0.20 * bounceEnv : 0;
  const surpriseAge = (now - surpriseStartedAt) / 1000;
  const surprise = surpriseAge >= 0 && surpriseAge < 0.65 ? Math.sin((surpriseAge / 0.65) * Math.PI) : 0;
  const idleY = reducedMotion ? 0 : Math.sin(t * 1.34) * 0.055;
  const pulse = reducedMotion ? 0.4 : (Math.sin(t * 2.05) + 1) * 0.5;

  slimeRoot.position.y = -0.04 + idleY + Math.max(0, bounceY);
  slimeRoot.rotation.x = currentRotX;
  slimeRoot.rotation.y = currentRotY;
  slimeRoot.rotation.z = reducedMotion ? 0 : Math.sin(t * 0.82) * 0.02;
  slimeRoot.scale.set(1 - stretch * 0.06, 1 + stretch * 0.09, 1 - stretch * 0.05);

  coreGroup.scale.setScalar(0.98 + pulse * 0.12 + hoverAmount * 0.08);
  coreGroup.rotation.y += reducedMotion ? 0 : dt * (0.38 + hoverAmount * 0.28);
  coreGroup.rotation.z -= reducedMotion ? 0 : dt * 0.14;
  coreHalo.material.opacity = 0.14 + pulse * 0.18 + hoverAmount * 0.06;
  coreGlow.material.opacity = 0.28 + pulse * 0.22;
  coreLight.intensity = 15 + pulse * 8 + hoverAmount * 5;
  coreRings.forEach((ring, i) => {
    ring.rotation.z += reducedMotion ? 0 : dt * (0.10 + i * 0.015);
    ring.material.opacity = 0.40 + pulse * 0.18;
  });
  neuralNodes.forEach((node, i) => node.scale.setScalar(0.88 + Math.sin(t * 2.4 + i * 0.65) * 0.16 + hoverAmount * 0.08));
  edgeLines.material.opacity = 0.42 + pulse * 0.16 + hoverAmount * 0.08;
  innerMotes.rotation.y += reducedMotion ? 0 : dt * 0.05;
  innerMotes.rotation.z -= reducedMotion ? 0 : dt * 0.03;

  scanRings.forEach((ring, i) => {
    ring.rotation.z += reducedMotion ? 0 : dt * (i % 2 ? 0.10 : -0.08);
    ring.material.opacity = 0.08 + pulse * 0.08 + hoverAmount * 0.04;
  });

  orbitGroup.rotation.z += reducedMotion ? 0 : dt * (0.18 + hoverAmount * 0.14);
  orbitGroup.rotation.y += reducedMotion ? 0 : dt * 0.07;
  arcGroup.rotation.z -= reducedMotion ? 0 : dt * (0.09 + hoverAmount * 0.08);
  arcGroup.rotation.y += reducedMotion ? 0 : dt * 0.035;
  hologramArcs.forEach((arc, i) => {
    arc.material.opacity = 0.24 + pulse * 0.20 + hoverAmount * 0.10;
    arc.rotation.z += reducedMotion ? 0 : dt * (i % 2 ? 0.035 : -0.028);
  });

  orbitRingA.material.opacity = 0.42 + pulse * 0.14 + hoverAmount * 0.10;
  orbitRingB.material.opacity = 0.28 + pulse * 0.12 + hoverAmount * 0.08;
  orbitRingC.material.opacity = 0.22 + pulse * 0.10 + hoverAmount * 0.06;
  orbitNodes.forEach((node, i) => node.scale.setScalar(0.92 + Math.sin(t * 2.1 + i) * 0.13 + hoverAmount * 0.08));

  signalNodes.forEach((signal, i) => {
    const angle = t * (0.72 + i * 0.08) + i * Math.PI * 0.5;
    const radius = 1.28 + (i % 2) * 0.18;
    signal.position.set(Math.cos(angle) * radius, Math.sin(angle * 1.1) * (0.72 + i * 0.05), Math.sin(angle * 0.8 + i) * 0.26);
    signal.scale.setScalar(0.85 + pulse * 0.25);
  });

  pulseRings.forEach((ring, i) => {
    const phase = (t * 0.34 + i / pulseRings.length) % 1;
    const s = 0.74 + phase * 0.86;
    ring.scale.set(s, s, s * 0.72);
    ring.material.opacity = Math.sin(phase * Math.PI) * (0.10 + hoverAmount * 0.08);
  });

  sparkles.forEach((sparkle) => {
    const s = 0.72 + Math.max(0, Math.sin(t * 2.3 + sparkle.userData.phase)) * 0.75;
    sparkle.scale.setScalar(s);
    sparkle.rotation.x += reducedMotion ? 0 : dt * 0.7;
    sparkle.rotation.y += reducedMotion ? 0 : dt * 0.55;
    sparkle.material.opacity = 0.26 + Math.max(0, Math.sin(t * 2.3 + sparkle.userData.phase)) * 0.64;
  });
  outerParticles.rotation.z -= reducedMotion ? 0 : dt * 0.055;
  outerParticles.rotation.y += reducedMotion ? 0 : dt * 0.035;

  let leftScaleY = 1.26;
  let rightScaleY = 1.26;
  let leftScaleX = 0.74;
  let rightScaleX = 0.74;
  let leftY = 0.24;
  let rightY = 0.24;
  let leftRot = 0;
  let rightRot = 0;
  let mouthMode = "smile";
  const activeExpression = surprise > 0.02 ? "surprised" : (targetHover > 0.5 ? "happy" : expressionMode);

  if (activeExpression === "winkLeft") {
    leftScaleY = 0.10;
    rightScaleY = 1.32;
    leftRot = -0.12;
    mouthMode = "curious";
  } else if (activeExpression === "winkRight") {
    rightScaleY = 0.10;
    leftScaleY = 1.32;
    rightRot = 0.12;
    mouthMode = "curious";
  } else if (activeExpression === "sleepy") {
    leftScaleY = 0.24;
    rightScaleY = 0.24;
    leftY -= 0.015;
    rightY -= 0.015;
    mouthMode = "sleepy";
  } else if (activeExpression === "curious") {
    if (curiousDirection > 0) {
      leftScaleY = 1.08;
      rightScaleY = 1.42;
      rightScaleX = 0.80;
    } else {
      rightScaleY = 1.08;
      leftScaleY = 1.42;
      leftScaleX = 0.80;
    }
    mouthMode = "curious";
  } else if (activeExpression === "happy") {
    leftScaleY = 0.34;
    rightScaleY = 0.34;
    leftRot = -0.08;
    rightRot = 0.08;
    mouthMode = "happy";
  } else if (activeExpression === "surprised") {
    leftScaleY = 1.48;
    rightScaleY = 1.48;
    leftScaleX = 0.82;
    rightScaleX = 0.82;
    mouthMode = "surprised";
  }

  const blinkScale = Math.max(0.06, 1 - blink * 0.94);
  leftScaleY *= blinkScale;
  rightScaleY *= blinkScale;
  const eyeOffsetX = pointerX * 0.012;
  const eyeOffsetY = -pointerY * 0.010;
  leftEye.position.x = -0.235 + eyeOffsetX;
  rightEye.position.x = 0.235 + eyeOffsetX;
  leftEye.position.y = leftY + eyeOffsetY;
  rightEye.position.y = rightY + eyeOffsetY;
  leftEye.scale.set(leftScaleX, leftScaleY, 0.28);
  rightEye.scale.set(rightScaleX, rightScaleY, 0.28);
  leftEye.rotation.z = leftRot;
  rightEye.rotation.z = rightRot;
  setMouth(mouthMode);

  bodyMaterial.emissiveIntensity = 0.025 + pulse * 0.025;
  shadow.scale.x = 1 - idleY * 1.6 - Math.max(0, bounceY) * 1.0;
  shadow.material.opacity = Math.max(0.025, 0.075 - Math.max(0, bounceY) * 0.18);

  deformBody(t, pulse, stretch);
  renderer.render(scene, camera);
  if (!stage.classList.contains("webgl-ready")) stage.classList.add("webgl-ready");
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
