const app = document.querySelector("#app");
const landingComposer = document.querySelector("#landingComposer");
const landingInput = document.querySelector("#landingInput");
const chatComposer = document.querySelector("#chatComposer");
const chatInput = document.querySelector("#chatInput");
const messageList = document.querySelector("#messageList");
const mascotStage = document.querySelector("#mascotStage");
const aiBot = document.querySelector("#aiBot");
const pupils = [...document.querySelectorAll(".pupil")];

const commandQueries = {
  me: "윤진용은 어떤 AI/ML Engineer야?",
  research: "핵심 연구와 논문을 보여줘",
  projects: "대표 프로젝트를 보여줘",
  skills: "기술 스택과 학력을 알려줘",
  contact: "윤진용에게 연락하고 싶어",
};

const repo = (name) => `https://github.com/yunjinyong730/${name}`;

const answers = {
  me: () => `
    <article class="answer-document">
      <p class="answer-kicker">ABOUT · RESEARCH TO REAL-WORLD AI</p>
      <h2>모델 연구에 그치지 않고,<br><span>실제로 동작하는 시스템까지.</span></h2>
      <p class="answer-lead">윤진용은 실세계 문제를 정의하고 데이터를 구축한 뒤, AI 모델을 설계하고 Edge device와 Application까지 연결하는 AI/ML Engineer입니다. 정확도만 보는 연구보다 latency, memory, resource efficiency와 실제 배포 조건을 함께 다루는 것을 중요하게 생각합니다.</p>
      <div class="answer-rule"></div>
      <div class="answer-grid three">
        <section class="answer-panel">
          <span class="section-no">01 · RESEARCH</span>
          <h3>AI Research</h3>
          <p>Sensor Calibration, Model Compression, On-Device AI를 중심으로 <strong>배포 요구사항을 모델 설계 단계부터</strong> 포함합니다.</p>
        </section>
        <section class="answer-panel">
          <span class="section-no">02 · ENGINEERING</span>
          <h3>Edge Deployment</h3>
          <p>데이터 수집·정제부터 TensorFlow/TFLite, Raspberry Pi, Arduino 기반 <strong>실제 장치 검증</strong>까지 수행합니다.</p>
        </section>
        <section class="answer-panel">
          <span class="section-no">03 · APPLICATION</span>
          <h3>Product Connection</h3>
          <p>Swift, Kotlin, Android/iOS와 실시간 파이프라인 경험을 바탕으로 모델을 <strong>사용자가 쓰는 형태</strong>까지 연결합니다.</p>
        </section>
      </div>
      <div class="process-flow" aria-label="문제에서 제품까지의 작업 흐름">
        <span><b>01</b>Problem</span>
        <span><b>02</b>Research</span>
        <span><b>03</b>Build</span>
        <span><b>04</b>Deploy</span>
        <span><b>05</b>Product</span>
      </div>
      <div class="metric-grid">
        <div class="metric"><strong>3+</strong><span>CORE AI RESEARCH PAPERS</span></div>
        <div class="metric"><strong>6 mo.</strong><span>LONG-TERM SENSOR DATASET</span></div>
        <div class="metric"><strong>4</strong><span>FOCUSED AI/EDGE PROJECTS</span></div>
        <div class="metric"><strong>4.21</strong><span>M.S. GPA / 4.5</span></div>
      </div>
    </article>`,

  research: () => `
    <article class="answer-document">
      <p class="answer-kicker">RESEARCH · SENSOR CALIBRATION · ON-DEVICE AI</p>
      <h2>배포 조건을 문제 정의에 넣는<br><span>deployment-oriented research.</span></h2>
      <p class="answer-lead">핵심 연구 축은 Sensor Calibration, On-Device AI, Autonomous Perception입니다. 평균 정확도뿐 아니라 순간 오차, worst-case latency, jitter, memory, runtime headroom처럼 실제 장치에서 실패를 만드는 조건을 함께 평가합니다.</p>
      <div class="answer-rule"></div>
      <div class="paper-list">
        <section class="paper-card">
          <div class="card-topline"><span>PAPER 01 · JOK 2026</span><span>1ST AUTHOR</span></div>
          <h3>SCALE</h3>
          <p class="card-subtitle">Balanced Sensor Calibration for On-Device AI</p>
          <p class="card-copy">CSP로 긴 시계열의 핵심 문맥을 압축하고 BHA(Binary Hash Attention)로 attention 계산 부담을 줄여, 정확도·지연 시간·자원 효율성의 균형을 실제 MCU 환경에서 검증한 연구입니다.</p>
          <div class="metric-grid">
            <div class="metric"><strong>14.03</strong><span>PM10 RMSE · LOWEST</span></div>
            <div class="metric"><strong>5.67</strong><span>PM2.5 RMSE · LOWEST</span></div>
            <div class="metric"><strong>1.72ms</strong><span>MAX LATENCY</span></div>
            <div class="metric"><strong>7.1%</strong><span>MAX CPU UTIL.</span></div>
          </div>
          <div class="card-bottom"><div class="tag-row"><span>TensorFlow</span><span>TFLite</span><span>Sensor Calibration</span><span>MCU</span></div><button class="card-link" type="button" data-query="SCALE 설명해줘">자세히 보기 →</button></div>
        </section>

        <section class="paper-card">
          <div class="card-topline"><span>PAPER 02 · IoT JOURNAL 2026</span><span>1ST AUTHOR</span></div>
          <h3>S-CALIBER</h3>
          <p class="card-subtitle">Microscopic Requirement-Aware Sensor Calibration</p>
          <p class="card-copy">기존의 accuracy·real-time·resource 3개 거시 지표를 R1–R7의 7가지 배포 요구사항으로 세분화하고, SLP와 EBA를 사용해 요구사항 → 모델 설계 → 데이터셋 → MCU 검증을 하나의 연구 흐름으로 연결했습니다.</p>
          <div class="metric-grid">
            <div class="metric"><strong>7/7</strong><span>DEPLOYMENT REQUIREMENTS</span></div>
            <div class="metric"><strong>15 wk.</strong><span>SELF-COLLECTED INDOOR DATA</span></div>
            <div class="metric"><strong>1.72ms</strong><span>MAX LATENCY</span></div>
            <div class="metric"><strong>7.1%</strong><span>MAX CPU UTIL.</span></div>
          </div>
          <div class="card-bottom"><div class="tag-row"><span>SLP</span><span>EBA</span><span>TFLite</span><span>On-Device AI</span></div><button class="card-link" type="button" data-query="S-CALIBER 설명해줘">자세히 보기 →</button></div>
        </section>

        <section class="paper-card">
          <div class="card-topline"><span>RESEARCH · 2026</span><span>1ST AUTHOR</span></div>
          <h3>Indoor Sensor Calibration</h3>
          <p class="card-subtitle">Dataset, Scenarios & Edge Model</p>
          <p class="card-copy">reference sensor가 항상 존재한다는 가정을 완화하기 위해 limited reference, unseen location, long-term drift, event shift의 4개 실제 배치 시나리오를 정의했습니다. 6개월·5개 위치에서 수집한 실내 센서 데이터로 spatial/temporal robustness와 edge inference를 함께 평가합니다.</p>
          <div class="metric-grid">
            <div class="metric"><strong>6 mo.</strong><span>DATASET PERIOD</span></div>
            <div class="metric"><strong>5</strong><span>INDOOR LOCATIONS</span></div>
            <div class="metric"><strong>6.1M</strong><span>PAIRED OBSERVATIONS</span></div>
            <div class="metric"><strong>42.6KB</strong><span>MODEL MEMORY</span></div>
          </div>
          <div class="card-bottom"><div class="tag-row"><span>Scenario Benchmark</span><span>Drift</span><span>Arduino-ready</span></div><span></span></div>
        </section>

        <section class="paper-card">
          <div class="card-topline"><span>PAPER · SAC 2026</span><span>3RD AUTHOR</span></div>
          <h3>FEAK</h3>
          <p class="card-subtitle">Feature-Based Evaluation & LLM-Constrained Feedback</p>
          <p class="card-copy">한국어 작문 평가를 점수 예측에 머물지 않고 사용자가 이해하고 행동할 수 있는 피드백으로 확장했습니다. 29가지 자질과 8개 루브릭의 정량 근거를 선택해 evidence-constrained LLM feedback을 생성합니다.</p>
          <div class="metric-grid">
            <div class="metric"><strong>+4.43</strong><span>WRITING GAIN</span></div>
            <div class="metric"><strong>16.42s</strong><span>FEEDBACK TIME</span></div>
            <div class="metric"><strong>3.76</strong><span>USER RATING</span></div>
            <div class="metric"><strong>0.521</strong><span>ANALYZER QWK</span></div>
          </div>
          <div class="card-bottom"><div class="tag-row"><span>Korean NLP</span><span>AWE</span><span>LLM Feedback</span><span>Evidence-grounded</span></div><a class="card-link" href="${repo("UKTA_v2")}" target="_blank" rel="noreferrer">Related repo ↗</a></div>
        </section>
      </div>
    </article>`,

  projects: () => `
    <article class="answer-document">
      <p class="answer-kicker">PROJECTS · BUILD · DEPLOY</p>
      <h2>연구 아이디어를<br><span>실제로 실행되는 시스템으로.</span></h2>
      <p class="answer-lead">대표 프로젝트는 데이터 수집과 시계열 보정, autonomous perception의 calibration failure recovery, model compression과 Raspberry Pi 배포까지 이어집니다. 아래 카드는 모두 실제 GitHub repository로 연결됩니다.</p>
      <div class="answer-rule"></div>
      <div class="project-list">
        <section class="project-card">
          <div class="card-topline"><span>PROJECT 01 · REAL-TIME SENSOR AI</span><span>5 CHANNELS · 30s</span></div>
          <h3>Multi-sensor Real-time Calibration & Anomaly Detection</h3>
          <p class="card-subtitle">센서 보정 → online anomaly detection → monitoring</p>
          <p class="card-copy">PM1·Humidity·Temperature·CO·CO₂ 데이터를 30초 단위로 resampling하고 180-step window 기반 calibration을 수행한 뒤 Robust Z-Score로 Level/Jump 이상을 감지합니다. cooldown 로직으로 false alarm을 줄이는 실시간 운영 구조까지 구현했습니다.</p>
          <div class="card-bottom"><div class="tag-row"><span>TensorFlow</span><span>Time Series</span><span>Sensor Calibration</span><span>Anomaly Detection</span></div><a class="card-link" href="${repo("Real_time_Sensor_Calibration_Anomaly_Detection")}" target="_blank" rel="noreferrer">GitHub ↗</a></div>
        </section>

        <section class="project-card">
          <div class="card-topline"><span>PROJECT 02 · AUTONOMOUS PERCEPTION</span><span>6DoF + CONF.</span></div>
          <h3>Camera–LiDAR Calibration Drift Recovery</h3>
          <p class="card-subtitle">RGB · Depth · Edge · Residual fusion</p>
          <p class="card-copy">Extrinsic drift가 perception failure로 이어지는 문제를 다루기 위해 RGB, sparse depth, edge, residual feature를 융합한 MSF-CalibNet을 구성했습니다. 6DoF correction과 confidence를 함께 출력하고 TFLite export까지 연결합니다.</p>
          <div class="metric-grid">
            <div class="metric"><strong>62.5%</strong><span>COMPLETE RECOVERY · TOY KITTI</span></div>
            <div class="metric"><strong>83.3%</strong><span>REPROJECTION ERROR IMPROVED</span></div>
            <div class="metric"><strong>6DoF</strong><span>SE(3) CORRECTION</span></div>
            <div class="metric"><strong>TFLite</strong><span>EDGE EXPORT PATH</span></div>
          </div>
          <div class="card-bottom"><div class="tag-row"><span>TensorFlow</span><span>KITTI</span><span>SE(3)</span><span>OpenCV</span></div><div><button class="card-link" type="button" data-query="LiDAR 프로젝트 보여줘">설명 →</button>&nbsp;&nbsp;<a class="card-link" href="${repo("LiDAR_Sensor_Calibration_Aware_Failure_Monitoring")}" target="_blank" rel="noreferrer">GitHub ↗</a></div></div>
        </section>

        <section class="project-card">
          <div class="card-topline"><span>PROJECT 03 · CAMERA CALIBRATION</span><span>HOMOGRAPHY · INT8</span></div>
          <h3>Deep Learning-based Camera Calibration Drift Recovery</h3>
          <p class="card-subtitle">Drift detection → 8D Homography → ECC refinement</p>
          <p class="card-copy">카메라 calibration drift를 자동 탐지하고 8D homography를 추정한 뒤 ECC refinement로 영상 정합을 복구합니다. Edge deployment를 위해 TFLite INT8 경로까지 구성했습니다.</p>
          <div class="metric-grid">
            <div class="metric"><strong>24.3→2.1</strong><span>PIXEL MAE · TOY VALIDATION</span></div>
            <div class="metric"><strong>.78→.96</strong><span>SSIM · TOY VALIDATION</span></div>
            <div class="metric"><strong>8D</strong><span>HOMOGRAPHY</span></div>
            <div class="metric"><strong>INT8</strong><span>TFLITE DEPLOYMENT</span></div>
          </div>
          <div class="card-bottom"><div class="tag-row"><span>TensorFlow</span><span>OpenCV</span><span>HomoMamba</span><span>ECC</span></div><div><button class="card-link" type="button" data-query="카메라 보정 프로젝트 설명해줘">설명 →</button>&nbsp;&nbsp;<a class="card-link" href="${repo("Autonomous-driving-camera-calibration-drift-detection-recovery")}" target="_blank" rel="noreferrer">GitHub ↗</a></div></div>
        </section>

        <section class="project-card">
          <div class="card-topline"><span>PROJECT 04 · MODEL COMPRESSION</span><span>RASPBERRY PI</span></div>
          <h3>Knowledge Distillation Vision Model</h3>
          <p class="card-subtitle">Teacher–Student CNN with real device benchmark</p>
          <p class="card-copy">Custom CNN teacher에서 더 작은 student로 Knowledge Distillation을 수행하고 Raspberry Pi 추론 benchmark pipeline을 구성했습니다. 단순 정확도보다 모델 크기, 배포 가능성, 실제 장치 추론을 함께 제시합니다.</p>
          <div class="metric-grid">
            <div class="metric"><strong>3.31M</strong><span>TEACHER PARAMETERS</span></div>
            <div class="metric"><strong>1.85M</strong><span>STUDENT PARAMETERS</span></div>
            <div class="metric"><strong>44.1%</strong><span>LIGHTWEIGHTING</span></div>
            <div class="metric"><strong>RPi</strong><span>REAL EDGE TARGET</span></div>
          </div>
          <div class="card-bottom"><div class="tag-row"><span>TensorFlow</span><span>CNN</span><span>Knowledge Distillation</span><span>Raspberry Pi</span></div><a class="card-link" href="${repo("Custom_CNN_Waste_Classification_Knowledge_Distillation_Raspberry")}" target="_blank" rel="noreferrer">GitHub ↗</a></div>
        </section>
      </div>
    </article>`,

  skills: () => `
    <article class="answer-document">
      <p class="answer-kicker">SKILLS · EDUCATION</p>
      <h2>연구부터 디바이스와 앱까지<br><span>하나의 흐름으로 연결합니다.</span></h2>
      <p class="answer-lead">기술 선택은 모델 성능만이 아니라 실제 장치 배포와 서비스 연결을 기준으로 합니다. Python/TensorFlow 기반 연구에서 TFLite·ONNX·Linux를 거쳐 iOS/Android Application까지 확장합니다.</p>
      <div class="answer-rule"></div>
      <div class="stack-grid">
        <section class="stack-card"><small>01 · PROGRAMMING</small><h3>Python · C · C++ · SQL</h3><p>모델 연구, 데이터 파이프라인, embedded/algorithm implementation.</p></section>
        <section class="stack-card"><small>02 · AI / DEEP LEARNING</small><h3>PyTorch · TensorFlow · CUDA</h3><p>Time Series, Vision, NLP, model design, training and evaluation.</p></section>
        <section class="stack-card"><small>03 · EDGE / DEPLOYMENT</small><h3>TFLite · ONNX · Linux</h3><p>Raspberry Pi, Arduino/MCU, quantization, latency and resource evaluation.</p></section>
        <section class="stack-card"><small>04 · APPLICATION</small><h3>Swift · UIKit · Kotlin · Android</h3><p>Mobile application development and real-time AI system integration.</p></section>
      </div>
      <div class="answer-rule"></div>
      <span class="section-no">EDUCATION</span>
      <div class="education-list">
        <div class="education-row"><time>2025.03 — 2027.02</time><div><h3>M.S. Artificial Intelligence</h3><p>Electrical & Computer Engineering · Inha University</p></div><strong>GPA 4.21 / 4.5</strong></div>
        <div class="education-row"><time>2019.03 — 2025.02</time><div><h3>B.S. Computer Science</h3><p>Inha University</p></div><strong>GPA 4.35 / 4.5</strong></div>
      </div>
      <div class="metric-grid">
        <div class="metric"><strong>Gold</strong><span>KIIT BEST PAPER</span></div>
        <div class="metric"><strong>SQLD</strong><span>DATA QUALIFICATION</span></div>
        <div class="metric"><strong>IH</strong><span>OPIc</span></div>
        <div class="metric"><strong>Edge</strong><span>CORE ENGINEERING FOCUS</span></div>
      </div>
    </article>`,

  contact: () => `
    <article class="answer-document">
      <p class="answer-kicker">CONTACT · LET'S BUILD</p>
      <h2>연구를 실제 시스템으로 연결하는<br><span>문제를 함께 이야기해요.</span></h2>
      <p class="answer-lead">Sensor Calibration, Edge AI, On-Device AI, Autonomous Perception, AI Application과 관련된 연구·프로젝트 이야기를 환영합니다.</p>
      <div class="contact-card">
        <div><h3>Yun Jinyong · 윤진용</h3><p>AI/ML Engineer · Edge AI · Inha University</p></div>
        <div class="contact-links">
          <a href="mailto:yunjinyong7302000@gmail.com">Email ↗</a>
          <a href="https://github.com/yunjinyong730" target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href="https://www.linkedin.com/in/%EC%A7%84%EC%9A%A9-%EC%9C%A4" target="_blank" rel="noreferrer">LinkedIn ↗</a>
        </div>
      </div>
    </article>`,

  scale: () => `
    <article class="answer-document">
      <p class="answer-kicker">RESEARCH DETAIL · SCALE</p>
      <h2>정확도만이 아니라<br><span>latency와 resource까지 함께 최적화.</span></h2>
      <p class="answer-lead">SCALE은 저가형 IoT 센서의 비선형 왜곡·잡음·샘플링 지연을 보정하면서, 제한된 MCU에서 실시간으로 동작해야 한다는 조건을 문제 정의부터 포함한 센서 보정 연구입니다.</p>
      <div class="answer-rule"></div>
      <div class="answer-grid">
        <section class="answer-panel"><span class="section-no">01 · CSP</span><h3>Context-based Sequence Compression</h3><p>긴 시계열을 압축하면서 중요한 변화 패턴과 문맥을 유지합니다.</p></section>
        <section class="answer-panel"><span class="section-no">02 · BHA</span><h3>Binary Hash Attention</h3><p>attention 연산의 메모리와 계산 부담을 줄여 MCU 친화적인 구조를 만듭니다.</p></section>
      </div>
      <div class="metric-grid">
        <div class="metric"><strong>14.03</strong><span>PM10 RMSE · LOWEST</span></div>
        <div class="metric"><strong>5.67</strong><span>PM2.5 RMSE · LOWEST</span></div>
        <div class="metric"><strong>1.72ms</strong><span>MAX LATENCY</span></div>
        <div class="metric"><strong>7.1%</strong><span>MAX CPU UTILIZATION</span></div>
      </div>
      <div class="process-flow"><span><b>01</b>Sensor</span><span><b>02</b>CSP</span><span><b>03</b>BHA</span><span><b>04</b>TFLite</span><span><b>05</b>MCU</span></div>
    </article>`,

  scaliber: () => `
    <article class="answer-document">
      <p class="answer-kicker">RESEARCH DETAIL · S-CALIBER</p>
      <h2>배포 가능성을 검증 항목이 아니라<br><span>연구의 출발점으로.</span></h2>
      <p class="answer-lead">S-CALIBER는 평균 정확도·평균 latency 같은 거시 지표만으로는 실제 배포 병목을 설명하기 어렵다는 문제에서 시작했습니다. 순간 오차, max latency, timing jitter, memory, runtime headroom까지 R1–R7 요구사항으로 나눕니다.</p>
      <div class="answer-rule"></div>
      <div class="answer-grid">
        <section class="answer-panel"><span class="section-no">SLP</span><h3>Scale-aware Lens Pooling</h3><p>긴 시계열을 log-scale lens로 압축하면서 bin 경계의 급격한 변화 패턴을 보존합니다.</p></section>
        <section class="answer-panel"><span class="section-no">EBA</span><h3>Efficient Binary Attention</h3><p>고비용 곱셈을 binary hash 기반 signed addition으로 바꿔 MCU 친화적인 attention을 구성합니다.</p></section>
      </div>
      <div class="metric-grid"><div class="metric"><strong>7/7</strong><span>R1–R7 SATISFIED</span></div><div class="metric"><strong>15 wk.</strong><span>INDOOR DATASET</span></div><div class="metric"><strong>1.72ms</strong><span>MAX LATENCY</span></div><div class="metric"><strong>7.1%</strong><span>MAX CPU UTIL.</span></div></div>
    </article>`,

  lidar: () => `
    <article class="answer-document">
      <p class="answer-kicker">PROJECT DETAIL · CAMERA–LIDAR</p>
      <h2>Calibration drift를 감지하고<br><span>6DoF correction까지 복구합니다.</span></h2>
      <p class="answer-lead">차량 진동·온도 변화·센서 장착 오차로 camera–LiDAR extrinsic calibration이 틀어지면 sensor fusion 성능이 떨어집니다. 이 프로젝트는 drift 상태에서 6DoF 보정값과 confidence를 함께 추정하고 recovery를 시각화합니다.</p>
      <div class="process-flow"><span><b>01</b>RGB</span><span><b>02</b>Depth</span><span><b>03</b>Edge</span><span><b>04</b>Residual</span><span><b>05</b>SE(3)+Conf.</span></div>
      <div class="metric-grid"><div class="metric"><strong>62.5%</strong><span>COMPLETE RECOVERY · 24 TOY KITTI FRAMES</span></div><div class="metric"><strong>83.3%</strong><span>REPROJECTION ERROR IMPROVED</span></div><div class="metric"><strong>6DoF</strong><span>CALIBRATION CORRECTION</span></div><div class="metric"><strong>TFLite</strong><span>EXPORT SUPPORT</span></div></div>
      <div class="contact-card"><div><h3>CalibGuard-TF-Pro</h3><p>TensorFlow · KITTI · SE(3) · OpenCV · TFLite</p></div><div class="contact-links"><a href="${repo("LiDAR_Sensor_Calibration_Aware_Failure_Monitoring")}" target="_blank" rel="noreferrer">Open repository ↗</a></div></div>
    </article>`,

  camera: () => `
    <article class="answer-document">
      <p class="answer-kicker">PROJECT DETAIL · CAMERA DRIFT RECOVERY</p>
      <h2>카메라의 기하학적 drift를<br><span>Homography + ECC로 복구.</span></h2>
      <p class="answer-lead">LiDAR 없이 camera image만으로 calibration drift를 감지하고 8D Homography correction을 추정한 뒤 ECC refinement를 적용합니다. TFLite INT8 경로를 통해 embedded deployment까지 고려했습니다.</p>
      <div class="process-flow"><span><b>01</b>Drifted Image</span><span><b>02</b>Detect</span><span><b>03</b>8D Homography</span><span><b>04</b>ECC</span><span><b>05</b>Aligned Output</span></div>
      <div class="metric-grid"><div class="metric"><strong>24.3→2.1</strong><span>PIXEL MAE · TOY VALIDATION</span></div><div class="metric"><strong>.78→.96</strong><span>SSIM · TOY VALIDATION</span></div><div class="metric"><strong>8D</strong><span>HOMOGRAPHY</span></div><div class="metric"><strong>INT8</strong><span>TFLITE PATH</span></div></div>
      <div class="contact-card"><div><h3>CalibGuard Camera</h3><p>TensorFlow · OpenCV · Homography · HomoMamba · ECC</p></div><div class="contact-links"><a href="${repo("Autonomous-driving-camera-calibration-drift-detection-recovery")}" target="_blank" rel="noreferrer">Open repository ↗</a></div></div>
    </article>`,

  edge: () => `
    <article class="answer-document">
      <p class="answer-kicker">PROJECT DETAIL · MODEL COMPRESSION</p>
      <h2>작은 모델이 실제 장치에서<br><span>동작하는 것까지 확인합니다.</span></h2>
      <p class="answer-lead">Custom CNN teacher의 지식을 더 작은 student CNN으로 전달해 parameter를 줄이고, Raspberry Pi에서 inference benchmark를 수행하는 Edge AI 프로젝트입니다.</p>
      <div class="metric-grid"><div class="metric"><strong>3.31M</strong><span>TEACHER PARAMETERS</span></div><div class="metric"><strong>1.85M</strong><span>STUDENT PARAMETERS</span></div><div class="metric"><strong>44.1%</strong><span>PARAMETER REDUCTION</span></div><div class="metric"><strong>RPi</strong><span>REAL DEVICE TARGET</span></div></div>
      <div class="contact-card"><div><h3>Knowledge Distillation on Raspberry Pi</h3><p>TensorFlow · CNN · Distillation · Edge AI</p></div><div class="contact-links"><a href="${repo("Custom_CNN_Waste_Classification_Knowledge_Distillation_Raspberry")}" target="_blank" rel="noreferrer">Open repository ↗</a></div></div>
    </article>`,

  unknown: () => `
    <article class="answer-document">
      <p class="answer-kicker">PORTFOLIO GUIDE</p>
      <h2>그 질문은 아직 준비하지 못했어요.<br><span>대신 이런 내용을 볼 수 있어요.</span></h2>
      <div class="unknown-card">
        <p>이 사이트는 실제 LLM API를 호출하지 않는 정적 GitHub Pages 포트폴리오입니다. 아래 질문들은 윤진용의 포트폴리오 데이터와 연결되어 있어 바로 탐색할 수 있습니다.</p>
        <div class="unknown-actions">
          <button type="button" data-command="me">윤진용 소개</button>
          <button type="button" data-command="research">핵심 연구</button>
          <button type="button" data-command="projects">대표 프로젝트</button>
          <button type="button" data-command="skills">기술 스택</button>
          <button type="button" data-command="contact">연락처</button>
        </div>
      </div>
    </article>`,
};

function escapeHTML(value) {
  return value.replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#039;",
    '"': "&quot;",
  }[char]));
}

function resolveRoute(rawQuery) {
  const q = rawQuery.trim().toLowerCase().replace(/\s+/g, " ");

  if (/s[- ]?caliber|스칼리버/.test(q)) return "scaliber";
  if (/\bscale\b|스케일/.test(q)) return "scale";
  if (/lidar|라이다|6dof|se\(3\)|extrinsic/.test(q)) return "lidar";
  if (/camera|카메라|homography|호모그래피|ecc/.test(q)) return "camera";
  if (/raspberry|라즈베리|distill|경량화|compression/.test(q)) return "edge";
  if (/research|paper|논문|연구|센서 보정|sensor calibration/.test(q)) return "research";
  if (/project|프로젝트|작업|대표작|깃허브 레포|repository|repo/.test(q)) return "projects";
  if (/skill|stack|기술|스택|학력|education|학교|gpa/.test(q)) return "skills";
  if (/contact|연락|메일|이메일|email|linkedin|링크드인/.test(q)) return "contact";
  if (/me|about|소개|누구|어떤 엔지니어|윤진용|jinyong|진용/.test(q)) return "me";
  return "unknown";
}

function setActiveNav(route) {
  const primary = ["scale", "scaliber"].includes(route) ? "research"
    : ["lidar", "camera", "edge"].includes(route) ? "projects"
    : route;
  document.querySelectorAll(".sidebar-nav button[data-command]").forEach((button) => {
    button.classList.toggle("active", button.dataset.command === primary);
  });
}

function addUserMessage(query) {
  const item = document.createElement("div");
  item.className = "user-message";
  item.innerHTML = `<span>YOU</span><p>${escapeHTML(query)}</p>`;
  messageList.appendChild(item);
}

function addAssistantMessage(route) {
  const item = document.createElement("div");
  item.className = "assistant-message";
  item.innerHTML = `<div class="assistant-mark">✦</div>${(answers[route] || answers.unknown)()}`;
  messageList.appendChild(item);
  setActiveNav(route);
  window.requestAnimationFrame(() => {
    messageList.scrollTo({ top: messageList.scrollHeight, behavior: "smooth" });
  });
}

function enterChat(query, options = {}) {
  const clean = query.trim() || commandQueries.me;
  const route = resolveRoute(clean);

  if (!app.classList.contains("is-chatting")) {
    app.classList.remove("is-landing");
    app.classList.add("is-chatting");
    messageList.innerHTML = "";
  }

  addUserMessage(clean);
  window.setTimeout(() => addAssistantMessage(route), options.immediate ? 0 : 180);

  if (route !== "unknown") {
    const hashRoute = ["scale", "scaliber"].includes(route) ? "research"
      : ["lidar", "camera", "edge"].includes(route) ? "projects"
      : route;
    history.replaceState(null, "", `#${hashRoute}`);
  }

  window.setTimeout(() => chatInput?.focus({ preventScroll: true }), 220);
}

function goHome() {
  app.classList.remove("is-chatting");
  app.classList.add("is-landing");
  messageList.innerHTML = "";
  history.replaceState(null, "", `${location.pathname}${location.search}`);
  landingInput.value = "";
  window.setTimeout(() => landingInput.focus({ preventScroll: true }), 80);
}

landingComposer.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = landingInput.value.trim() || "윤진용 개발자에 대해 알려줘";
  landingInput.value = "";
  enterChat(query);
});

chatComposer.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = chatInput.value.trim();
  if (!query) return;
  chatInput.value = "";
  enterChat(query);
});

document.addEventListener("click", (event) => {
  const homeTrigger = event.target.closest('[data-action="home"]');
  if (homeTrigger) {
    goHome();
    return;
  }

  const commandTrigger = event.target.closest("[data-command]");
  if (commandTrigger) {
    const command = commandTrigger.dataset.command;
    enterChat(commandQueries[command] || commandQueries.me);
    return;
  }

  const queryTrigger = event.target.closest("[data-query]");
  if (queryTrigger) {
    enterChat(queryTrigger.dataset.query);
  }
});

mascotStage.addEventListener("click", () => {
  enterChat("윤진용 개발자에 대해 알려줘");
});

function updateInteractiveScene(event) {
  const x = (event.clientX / window.innerWidth - 0.5) * 2;
  const y = (event.clientY / window.innerHeight - 0.5) * 2;

  app.style.setProperty("--aurora-x-1", `${x * 24}px`);
  app.style.setProperty("--aurora-y-1", `${y * 18}px`);
  app.style.setProperty("--aurora-x-2", `${x * -18}px`);
  app.style.setProperty("--aurora-y-2", `${y * -14}px`);
  app.style.setProperty("--aurora-x-3", `${x * 14}px`);
  app.style.setProperty("--aurora-y-3", `${y * 11}px`);

  if (!app.classList.contains("is-chatting") && aiBot) {
    mascotStage.style.setProperty("--rx", `${y * -6}deg`);
    mascotStage.style.setProperty("--ry", `${x * 9}deg`);
    pupils.forEach((pupil) => {
      pupil.style.transform = `translate(${x * 3.4}px, ${y * 2.6}px)`;
    });
  }
}

window.addEventListener("pointermove", updateInteractiveScene, { passive: true });
window.addEventListener("blur", () => {
  mascotStage.style.setProperty("--rx", "0deg");
  mascotStage.style.setProperty("--ry", "0deg");
  pupils.forEach((pupil) => { pupil.style.transform = "translate(0,0)"; });
});

const hashCommand = location.hash.replace("#", "");
if (commandQueries[hashCommand]) {
  enterChat(commandQueries[hashCommand], { immediate: true });
}
