(() => {
  "use strict";

  const messageList = document.querySelector("#messageList");
  const guideBar = document.querySelector("#neonGuideBar");
  const guideContext = document.querySelector("#neonGuideContext");
  const guideText = document.querySelector("#neonGuideText");

  const miniAvatar = (className = "neon-mini-avatar") => `
    <span class="${className}" aria-hidden="true">
      <span class="neon-mini-antenna"></span>
      <span class="neon-mini-face">
        <i class="neon-mini-eye left"></i>
        <i class="neon-mini-eye right"></i>
        <i class="neon-mini-mouth"></i>
      </span>
    </span>`;

  const profiles = [
    {
      test: /ABOUT|AI RESEARCH ENGINEER/i,
      context: "ABOUT",
      text: "먼저 윤진용이 어떤 엔지니어인지 큰 그림부터 보여줄게. 연구와 실제 시스템 사이의 연결을 중심으로 보면 돼.",
    },
    {
      test: /RESUME/i,
      context: "RESUME",
      text: "이력 전체를 빠르게 훑을 수 있게 핵심 수치와 경험을 먼저 묶었어. 관심 있는 항목은 바로 더 깊게 들어갈 수 있어.",
    },
    {
      test: /EXPERIENCE|CAREER/i,
      context: "CAREER",
      text: "경력을 시간순 목록으로만 보지 말고, Product 개발 경험이 AI 연구와 Edge deployment로 이어진 흐름으로 봐줘.",
    },
    {
      test: /PUBLICATION|PAPER/i,
      context: "PUBLICATIONS",
      text: "논문은 주제와 기여 포인트가 한눈에 보이도록 정리했어. Sensor Calibration부터 On-Device AI까지 연구 폭을 확인해봐.",
    },
    {
      test: /RESEARCH GRANT|FUNDED|GRANT/i,
      context: "RESEARCH GRANTS",
      text: "여기서는 연구 아이디어가 실제 과제로 어떻게 이어졌는지 보여줄게. 수행 주제와 연결된 구현도 함께 보면 좋아.",
    },
    {
      test: /SELECTED AI PROJECTS|PROJECT|CAMERA|LIDAR|DISTILL|ANOMALY/i,
      context: "PROJECTS",
      text: "이 부분은 구현 중심이야. 문제 정의에서 모델, 지표, Edge 배포까지 실제로 동작하게 만든 과정을 따라가면 돼.",
    },
    {
      test: /APPLICATION|PRODUCT|APP STORE/i,
      context: "PRODUCT",
      text: "AI 연구만이 아니라 실제 사용자가 설치하고 쓰는 제품까지 만든 경험이야. 개발 역할과 출시 결과를 같이 확인해봐.",
    },
    {
      test: /SKILL|EDUCATION|STACK/i,
      context: "SKILLS",
      text: "기술 스택은 나열보다 어디에 사용했는지가 중요해. 연구, Edge, Product 경험과 연결해서 보여줄게.",
    },
    {
      test: /AWARD|CREDENTIAL|CERTIFICATE/i,
      context: "AWARDS",
      text: "수상과 자격은 연구·개발 경험을 보완하는 신호로 정리했어. 핵심 성과만 빠르게 확인하면 돼.",
    },
    {
      test: /CONTACT/i,
      context: "CONTACT",
      text: "더 이야기하고 싶다면 여기서 바로 연결할 수 있어. 공개 연락처와 GitHub만 간결하게 모아뒀어.",
    },
    {
      test: /RESEARCH/i,
      context: "RESEARCH",
      text: "연구의 핵심은 정확도만 높이는 게 아니라 실제 배포 조건까지 문제 정의에 넣는 거야. 그 관점으로 소개할게.",
    },
  ];

  const commandPreview = {
    me: ["ABOUT", "윤진용이 어떤 AI/ML Engineer인지 핵심부터 정리해볼게."],
    resume: ["RESUME", "전체 이력을 한눈에 볼 수 있게 요약해서 안내할게."],
    experience: ["CAREER", "연구와 제품 개발 경험이 어떻게 이어지는지 흐름으로 보여줄게."],
    research: ["RESEARCH", "핵심 연구축과 실제 배포 관점을 중심으로 설명할게."],
    publications: ["PUBLICATIONS", "선정 논문과 각 연구의 핵심 기여를 보여줄게."],
    projects: ["PROJECTS", "대표 AI 프로젝트의 구현과 결과를 중심으로 안내할게."],
    applications: ["PRODUCT", "출시한 앱과 실제 제품 개발 경험을 보여줄게."],
    grants: ["RESEARCH GRANTS", "수행한 연구과제와 연결된 연구 주제를 안내할게."],
    skills: ["SKILLS", "기술 스택을 실제 사용 경험과 연결해서 보여줄게."],
    awards: ["AWARDS", "수상, 자격, 영어 역량을 핵심만 정리해볼게."],
    contact: ["CONTACT", "연락 가능한 채널을 바로 안내할게."],
  };

  function resolveProfile(message) {
    const kicker = message.querySelector(".answer-kicker")?.textContent?.trim() || "";
    const heading = message.querySelector(".answer-document h2")?.textContent?.trim() || "";
    const haystack = `${kicker} ${heading}`;
    return profiles.find((profile) => profile.test.test(haystack)) || {
      context: "PORTFOLIO",
      text: "이 내용에서 중요한 포인트부터 짚어줄게. 세부 자료는 아래 카드와 링크에서 바로 이어서 확인할 수 있어.",
    };
  }

  function updateGuide(context, text) {
    if (guideContext) guideContext.textContent = `NEON · ${context}`;
    if (guideText) guideText.textContent = text;
    if (!guideBar) return;
    guideBar.classList.remove("is-talking");
    void guideBar.offsetWidth;
    guideBar.classList.add("is-talking");
    window.setTimeout(() => guideBar.classList.remove("is-talking"), 520);
  }

  function enhanceAssistantMessage(message) {
    if (!(message instanceof HTMLElement) || !message.classList.contains("assistant-message")) return;
    if (message.dataset.neonEnhanced === "1") return;
    message.dataset.neonEnhanced = "1";
    message.classList.add("neon-single-avatar");

    const profile = resolveProfile(message);
    const mark = message.querySelector(".assistant-mark");
    if (mark) mark.remove();

    const content = message.querySelector(".assistant-content");
    if (content && !content.querySelector(":scope > .neon-inline-intro")) {
      const intro = document.createElement("div");
      intro.className = "neon-inline-intro is-entering";
      intro.innerHTML = `
        ${miniAvatar("neon-inline-avatar")}
        <div class="neon-inline-copy">
          <b>neon · ${profile.context}</b>
          <p>${profile.text}</p>
        </div>`;
      content.prepend(intro);
      window.setTimeout(() => intro.classList.remove("is-entering"), 560);
    }

    updateGuide(profile.context, profile.text);
  }

  function scanMessages(root = messageList) {
    if (!root) return;
    root.querySelectorAll(".assistant-message").forEach(enhanceAssistantMessage);
  }

  if (messageList) {
    scanMessages();
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.classList.contains("assistant-message")) enhanceAssistantMessage(node);
          else node.querySelectorAll?.(".assistant-message").forEach(enhanceAssistantMessage);
        });
      });
    });
    observer.observe(messageList, { childList: true, subtree: true });
  }

  document.addEventListener("click", (event) => {
    const command = event.target.closest("[data-command]")?.dataset.command;
    const preview = command && commandPreview[command];
    if (preview) updateGuide(preview[0], preview[1]);
  }, true);

  document.querySelectorAll("#landingComposer,#chatComposer").forEach((form) => {
    form.addEventListener("submit", () => {
      updateGuide("THINKING", "질문에서 가장 관련 있는 경험과 결과를 골라서 정리하고 있어.");
    }, true);
  });
})();
