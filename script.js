const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
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
    rootMargin: "-28% 0px -52% 0px",
    threshold: [0.05, 0.2, 0.5],
  }
);

sections.forEach((section) => navObserver.observe(section));

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

const splineRobot = document.querySelector("#splineRobot");
const heroVisual = document.querySelector(".hero-visual");

if (splineRobot && heroVisual) {
  splineRobot.setAttribute("background", "transparent");

  customElements.whenDefined("spline-viewer").then(() => {
    heroVisual.classList.add("spline-mounted");
  });

  splineRobot.addEventListener("load", () => {
    heroVisual.classList.add("spline-loaded");
  });
}

const finePointer = window.matchMedia("(pointer: fine)").matches;

if (finePointer) {
  document.querySelectorAll(".project-card, .research-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      card.style.setProperty("--pointer-x", `${50 + x * 18}%`);
      card.style.setProperty("--pointer-y", `${50 + y * 18}%`);
    });
  });
}
