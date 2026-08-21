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
renderer.toneMappingExposure = 1.1;
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
  color: new THREE.Color("#f2f3f5"),
  roughness: 0.08,
  metalness: 0,
  transmission: 0.82,
  transparent: true,
  opacity: 0.68,
  thickness: 1.75,
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
  new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.08, depthWrite: false }),
);
innerShell.scale.set(0.94, 0.93, 0.92);
innerShell.position.copy(body.position);
slimeRoot.add(innerShell);

// --- More visible arms --------------------------------------------------------
const armGeometry = new THREE.SphereGeometry(0.38, 32, 24);
const armMaterial = bodyMaterial;
const makeArm = (side) => {
  const pivot = new THREE.Group();
  pivot.position.set(side * 0.89, -0.02, 0.0);
  const arm = new THREE.Mesh(armGeometry, armMaterial);
  arm.position.set(side * 0.24, -0.08, 0.02);
  arm.scale.set(0.72, 1.18, 0.72);
  arm.rotation.z = side * -0.34;
  pivot.add(arm);
  slimeRoot.add(pivot);
  return { pivot, arm };
};
const leftArm = makeArm(-1);
const rightArm = makeArm(1);

// --- AI neural core -----------------------------------------------------------
const coreGroup = new THREE.Group();
coreGroup.position.set(0, -0.12, 0.18);
slimeRoot.add(coreGroup);

const coreHalo = new THREE.Mesh(
  new THREE.SphereGeometry(0.46, 36, 28),
  new THREE.MeshBasicMaterial({ color: 0x7fe6ff, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false }),
);
coreGroup.add(coreHalo);
const coreSphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.17, 28, 22),
  new THREE.MeshBasicMaterial({ color: 0xf2feff, transparent: true, opacity: 0.98, blending: THREE.AdditiveBlending, depthWrite: false }),
);
coreGroup.add(coreSphere);
const coreGlow = new THREE.Mesh(
  new THREE.SphereGeometry(0.28, 28, 22),
  new THREE.MeshBasicMaterial({ color: 0x74dcff, transparent: true, opacity: 0.34, blending: THREE.AdditiveBlending, depthWrite: false }),
);
coreGroup.add(coreGlow);

const coreRingMaterial = new THREE.MeshBasicMaterial({ color: 0x9deaff, transparent: true, opacity: 0.56, blending: THREE.AdditiveBlending, depthWrite: false });
const coreRings = [];
for (let i = 0; i < 5; i += 1) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.31 + i * 0.073, 0.008, 8, 88), coreRingMaterial.clone());
  ring.rotation.x = Math.PI / 2 + i * 0.36;
  ring.rotation.y = i * 0.68;
  ring.rotation.z = i * 0.22;
  coreRings.push(ring);
  coreGroup.add(ring);
}

const neuralPositions = [
  [-0.36, 0.18, 0.03],[0.34,0.21,0.05],[-0.31,-0.18,0.06],[0.33,-0.17,0.08],
  [0,0.38,-0.02],[0,-0.38,0.03],[-0.45,0,-0.03],[0.45,0.03,0.02],
  [-0.18,0.08,0.25],[0.20,-0.03,0.23],[0.12,0.18,-0.22],[-0.12,-0.19,-0.20],
];
const neuralGroup = new THREE.Group();
coreGroup.add(neuralGroup);
const nodeMat = new THREE.MeshBasicMaterial({ color: 0xf4feff, transparent: true, opacity: 0.96, blending: THREE.AdditiveBlending, depthWrite: false });
const neuralNodes = neuralPositions.map(([x,y,z], idx) => {
  const n = new THREE.Mesh(new THREE.SphereGeometry(idx < 4 ? 0.032 : 0.024, 14, 12), nodeMat);
  n.position.set(x,y,z);
  neuralGroup.add(n);
  return n;
});
const links = [];
[[0,4],[0,6],[0,8],[1,4],[1,7],[1,10],[2,5],[2,6],[2,11],[3,5],[3,7],[3,9],[4,8],[4,10],[5,9],[5,11],[8,9],[10,11],[8,10],[9,11]].forEach(([a,b]) => links.push(...neuralPositions[a], ...neuralPositions[b]));
const edgeGeometry = new THREE.BufferGeometry();
edgeGeometry.setAttribute("position", new THREE.Float32BufferAttribute(links, 3));
const edgeLines = new THREE.LineSegments(edgeGeometry, new THREE.LineBasicMaterial({ color: 0xbff6ff, transparent: true, opacity: 0.52, blending: THREE.AdditiveBlending, depthWrite: false }));
neuralGroup.add(edgeLines);

const moteCount = 70;
const moteArray = new Float32Array(moteCount * 3);
for (let i = 0; i < moteCount; i += 1) {
  const a = Math.random() * Math.PI * 2;
  const r = Math.sqrt(Math.random()) * 0.82;
  moteArray[i*3] = Math.cos(a) * r;
  moteArray[i*3+1] = (Math.random() - 0.5) * 1.26;
  moteArray[i*3+2] = (Math.random() - 0.5) * 0.72;
}
const innerMotes = new THREE.Points(
  new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(moteArray, 3)),
  new THREE.PointsMaterial({ color: 0xcff8ff, size: 0.026, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true }),
);
slimeRoot.add(innerMotes);

// --- Face: single-color black eyes -------------------------------------------
const faceGroup = new THREE.Group();
slimeRoot.add(faceGroup);
const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x111111 });
const makeEye = (x) => {
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.145, 28, 22), eyeMaterial);
  eye.position.set(x, 0.24, 0.93);
  eye.scale.set(0.74, 1.26, 0.34);
  faceGroup.add(eye);
  return eye;
};
const leftEye = makeEye(-0.235);
const rightEye = makeEye(0.235);
const smile = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.017, 10, 38, Math.PI), eyeMaterial);
smile.position.set(0, -0.025, 0.99);
smile.rotation.z = Math.PI;
faceGroup.add(smile);
const surpriseMouth = new THREE.Mesh(new THREE.SphereGeometry(0.058, 18, 14), new THREE.MeshBasicMaterial({ color: 0x111111, transparent: true, opacity: 0 }));
surpriseMouth.position.set(0, -0.045, 0.992);
surpriseMouth.scale.set(0.78, 1.12, 0.24);
faceGroup.add(surpriseMouth);

// --- Strong outer orbit system ----------------------------------------------
const orbitGroup = new THREE.Group();
slimeRoot.add(orbitGroup);
const orbitMatA = new THREE.MeshBasicMaterial({ color: 0x6fb9ff, transparent: true, opacity: 0.50, blending: THREE.AdditiveBlending, depthWrite: false });
const orbitMatB = new THREE.MeshBasicMaterial({ color: 0x8edfff, transparent: true, opacity: 0.34, blending: THREE.AdditiveBlending, depthWrite: false });
const orbitRingA = new THREE.Mesh(new THREE.TorusGeometry(1.50, 0.012, 8, 128), orbitMatA);
orbitRingA.scale.y = 0.58;
orbitRingA.rotation.x = Math.PI / 2.55;
orbitRingA.rotation.z = 0.24;
orbitGroup.add(orbitRingA);
const orbitRingB = new THREE.Mesh(new THREE.TorusGeometry(1.34, 0.010, 8, 120), orbitMatB);
orbitRingB.scale.y = 0.74;
orbitRingB.rotation.x = Math.PI / 2.12;
orbitRingB.rotation.y = 0.78;
orbitGroup.add(orbitRingB);
const orbitRingC = new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.007, 8, 112), orbitMatB.clone());
orbitRingC.scale.y = 0.82;
orbitRingC.rotation.x = Math.PI / 2.35;
orbitRingC.rotation.y = -0.65;
orbitRingC.rotation.z = 0.48;
orbitGroup.add(orbitRingC);

const orbitNodeMat = new THREE.MeshPhysicalMaterial({ color: 0xd6f5ff, emissive: 0x4c8eff, emissiveIntensity: 1.15, transparent: true, opacity: 0.98, roughness: 0.05, transmission: 0.12 });
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

const outerCount = 64;
const outerArray = new Float32Array(outerCount * 3);
for (let i = 0; i < outerCount; i += 1) {
  const a = Math.random() * Math.PI * 2;
  const r = 1.22 + Math.random() * 0.65;
  outerArray[i*3] = Math.cos(a) * r;
  outerArray[i*3+1] = (Math.random() - 0.5) * 2.36;
  outerArray[i*3+2] = (Math.random() - 0.5) * 1.0 - 0.12;
}
const outerParticles = new THREE.Points(
  new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(outerArray, 3)),
  new THREE.PointsMaterial({ color: 0xa9e5ff, size: 0.03, transparent: true, opacity: 0.60, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true }),
);
slimeRoot.add(outerParticles);

const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.88, 48), new THREE.MeshBasicMaterial({ color: 0x566276, transparent: true, opacity: 0.08, depthWrite: false }));
shadow.rotation.x = -Math.PI / 2;
shadow.scale.y = 0.32;
shadow.position.set(0, -1.22, -0.12);
scene.add(shadow);

let targetRotX = 0, targetRotY = 0, currentRotX = 0, currentRotY = 0;
let hoverAmount = 0, targetHover = 0, pointerX = 0, pointerY = 0;
let bounceStartedAt = -10000, surpriseStartedAt = -10000, blinkStartedAt = -10000;
let nextBlinkAt = performance.now() + 1800 + Math.random() * 1800;
let lastTime = performance.now(), frame = 0;

stage.addEventListener("pointermove", (event) => {
  const rect = stage.getBoundingClientRect();
  pointerX = THREE.MathUtils.clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1);
  pointerY = THREE.MathUtils.clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1);
  targetRotY = pointerX * 0.14;
  targetRotX = -pointerY * 0.08;
}, { passive: true });
stage.addEventListener("pointerenter", () => { targetHover = 1; }, { passive: true });
stage.addEventListener("pointerleave", () => { targetHover = 0; targetRotX = 0; targetRotY = 0; pointerX = 0; pointerY = 0; }, { passive: true });
stage.addEventListener("click", () => { bounceStartedAt = performance.now(); surpriseStartedAt = performance.now(); });

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
    const x = basePositions[i], y = basePositions[i+1], z = basePositions[i+2];
    const wave = Math.sin(t*1.45 + y*4.0 + x*2.0) * 0.018 + Math.cos(t*1.08 + z*4.4) * 0.012;
    const skirt = y < -0.36 ? Math.sin(Math.atan2(z,x)*3 + t*1.15) * 0.028 : 0;
    arr[i] = x * (1 + wave + skirt + pulse*0.012) * (1 - stretch*0.06);
    arr[i+1] = y * (1 + stretch*0.10) + Math.sin(t*1.25 + x*4.0) * 0.012;
    arr[i+2] = z * (1 + wave + skirt + pulse*0.012) * (1 - stretch*0.06);
  }
  bodyPos.needsUpdate = true;
  if (frame % 3 === 0) bodyGeometry.computeVertexNormals();
}

function animate(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;
  const t = now / 1000;
  frame += 1;
  currentRotX += (targetRotX - currentRotX) * Math.min(1, dt*5);
  currentRotY += (targetRotY - currentRotY) * Math.min(1, dt*5);
  hoverAmount += (targetHover - hoverAmount) * Math.min(1, dt*4.5);

  if (now > nextBlinkAt) { blinkStartedAt = now; nextBlinkAt = now + 2300 + Math.random()*1900; }
  const blinkAge = (now - blinkStartedAt) / 1000;
  const blink = blinkAge >= 0 && blinkAge < 0.18 ? Math.sin((blinkAge/0.18)*Math.PI) : 0;
  const bounceAge = (now - bounceStartedAt) / 1000;
  const bounceEnv = bounceAge >= 0 && bounceAge < 0.82 ? Math.sin((bounceAge/0.82)*Math.PI) : 0;
  const bounceY = bounceEnv ? Math.sin((bounceAge/0.82)*Math.PI*2.05) * 0.14 * bounceEnv : 0;
  const stretch = bounceEnv ? Math.sin((bounceAge/0.82)*Math.PI*2.05 + Math.PI/2) * 0.20 * bounceEnv : 0;
  const surpriseAge = (now - surpriseStartedAt) / 1000;
  const surprise = surpriseAge >= 0 && surpriseAge < 0.65 ? Math.sin((surpriseAge/0.65)*Math.PI) : 0;
  const idleY = reducedMotion ? 0 : Math.sin(t*1.34) * 0.055;
  const pulse = reducedMotion ? 0.4 : (Math.sin(t*2.05)+1)*0.5;

  slimeRoot.position.y = -0.04 + idleY + Math.max(0, bounceY);
  slimeRoot.rotation.x = currentRotX;
  slimeRoot.rotation.y = currentRotY;
  slimeRoot.rotation.z = reducedMotion ? 0 : Math.sin(t*0.82) * 0.02;

  leftArm.pivot.rotation.z = 0.08 + Math.sin(t*1.25)*0.16 - hoverAmount*0.12;
  rightArm.pivot.rotation.z = -0.08 - Math.sin(t*1.18+0.8)*0.16 + hoverAmount*0.12;
  leftArm.pivot.position.x = -0.89 - hoverAmount*0.04;
  rightArm.pivot.position.x = 0.89 + hoverAmount*0.04;

  coreGroup.scale.setScalar(0.98 + pulse*0.12 + hoverAmount*0.08);
  coreGroup.rotation.y += reducedMotion ? 0 : dt * (0.38 + hoverAmount*0.28);
  coreGroup.rotation.z -= reducedMotion ? 0 : dt * 0.14;
  coreHalo.material.opacity = 0.14 + pulse*0.18 + hoverAmount*0.06;
  coreGlow.material.opacity = 0.28 + pulse*0.22;
  coreLight.intensity = 15 + pulse*8 + hoverAmount*5;
  coreRings.forEach((ring, i) => { ring.rotation.z += reducedMotion ? 0 : dt*(0.10 + i*0.015); ring.material.opacity = 0.40 + pulse*0.18; });
  neuralNodes.forEach((node, i) => node.scale.setScalar(0.88 + Math.sin(t*2.4 + i*0.65)*0.16 + hoverAmount*0.08));
  edgeLines.material.opacity = 0.42 + pulse*0.16 + hoverAmount*0.08;
  innerMotes.rotation.y += reducedMotion ? 0 : dt*0.05;
  innerMotes.rotation.z -= reducedMotion ? 0 : dt*0.03;

  orbitGroup.rotation.z += reducedMotion ? 0 : dt*(0.18 + hoverAmount*0.14);
  orbitGroup.rotation.y += reducedMotion ? 0 : dt*0.07;
  orbitRingA.material.opacity = 0.42 + pulse*0.14 + hoverAmount*0.10;
  orbitRingB.material.opacity = 0.28 + pulse*0.12 + hoverAmount*0.08;
  orbitRingC.material.opacity = 0.22 + pulse*0.10 + hoverAmount*0.06;
  orbitNodes.forEach((node, i) => node.scale.setScalar(0.92 + Math.sin(t*2.1+i)*0.13 + hoverAmount*0.08));
  outerParticles.rotation.z -= reducedMotion ? 0 : dt*0.055;
  outerParticles.rotation.y += reducedMotion ? 0 : dt*0.035;

  const eyeOffsetX = pointerX * 0.012;
  const eyeOffsetY = -pointerY * 0.010;
  const eyeScaleY = Math.max(0.08, 1 - blink*0.92) * (1 + surprise*0.16);
  leftEye.position.x = -0.235 + eyeOffsetX; rightEye.position.x = 0.235 + eyeOffsetX;
  leftEye.position.y = 0.24 + eyeOffsetY; rightEye.position.y = 0.24 + eyeOffsetY;
  leftEye.scale.y = 1.26 * eyeScaleY; rightEye.scale.y = 1.26 * eyeScaleY;
  smile.material.opacity = 1 - surprise;
  surpriseMouth.material.opacity = surprise * 0.96;

  bodyMaterial.emissiveIntensity = 0.025 + pulse*0.025;
  shadow.scale.x = 1 - idleY*1.6 - Math.max(0,bounceY)*1.0;
  shadow.material.opacity = Math.max(0.025, 0.08 - Math.max(0,bounceY)*0.18);

  deformBody(t, pulse, stretch);
  renderer.render(scene, camera);
  if (!stage.classList.contains("webgl-ready")) stage.classList.add("webgl-ready");
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
