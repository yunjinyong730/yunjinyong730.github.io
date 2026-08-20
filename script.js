const typingTarget = document.querySelector("#typingText");
const typingText = typingTarget?.dataset.text ?? "";
let typingIndex = 0;

function typePrompt() {
  if (!typingTarget) return;

  if (typingIndex <= typingText.length) {
    typingTarget.textContent = typingText.slice(0, typingIndex);
    typingIndex += 1;
    window.setTimeout(typePrompt, typingIndex < 5 ? 180 : 70);
  } else {
    window.setTimeout(() => {
      typingIndex = 0;
      typingTarget.textContent = "";
      typePrompt();
    }, 3200);
  }
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

const dockLinks = [...document.querySelectorAll(".dock a[data-section]")];
const sections = dockLinks
  .map((link) => document.getElementById(link.dataset.section))
  .filter(Boolean);

const navObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    dockLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.section === visible.target.id);
    });
  },
  {
    rootMargin: "-30% 0px -50% 0px",
    threshold: [0.05, 0.2, 0.5],
  }
);

sections.forEach((section) => navObserver.observe(section));

document.querySelector("#year").textContent = new Date().getFullYear();

typePrompt();
