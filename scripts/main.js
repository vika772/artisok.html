const root = document.documentElement;
const themeBtn = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const savedTheme = localStorage.getItem("coffee-theme");

if (savedTheme === "dark") {
  root.classList.add("dark");
}

const syncThemeIcon = () => {
  themeIcon.textContent = root.classList.contains("dark") ? "light_mode" : "dark_mode";
};

syncThemeIcon();

themeBtn?.addEventListener("click", () => {
  root.classList.toggle("dark");
  localStorage.setItem("coffee-theme", root.classList.contains("dark") ? "dark" : "light");
  syncThemeIcon();
});

const navToggle = document.getElementById("navToggle");
const mobileNav = document.getElementById("mobileNav");

const closeMobileNav = () => {
  document.body.classList.remove("nav-open");
  navToggle?.setAttribute("aria-expanded", "false");
};

navToggle?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

mobileNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    closeMobileNav();
  });
});

document.addEventListener("click", (event) => {
  if (!document.body.classList.contains("nav-open")) return;
  const target = event.target;
  if (navToggle?.contains(target) || mobileNav?.contains(target)) return;
  closeMobileNav();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileNav();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 920) {
    closeMobileNav();
  }
});

const slides = Array.from(document.querySelectorAll(".slide"));
const dotsWrap = document.getElementById("sliderDots");
const sliderButtons = document.querySelectorAll("[data-slide]");

let currentIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));
if (currentIndex < 0) currentIndex = 0;

const dots = slides.map((_, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.className = "slider-dot";
  dot.setAttribute("aria-label", `Diapozitiv ${index + 1}`);
  dot.addEventListener("click", () => setSlide(index));
  dotsWrap?.append(dot);
  return dot;
});

const renderSlides = () => {
  slides.forEach((slide, index) => {
    slide.classList.toggle("is-active", index === currentIndex);
  });
  dots.forEach((dot, index) => {
    dot.classList.toggle("is-active", index === currentIndex);
  });
};

const setSlide = (index) => {
  currentIndex = (index + slides.length) % slides.length;
  renderSlides();
};

sliderButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const direction = button.getAttribute("data-slide");
    setSlide(direction === "next" ? currentIndex + 1 : currentIndex - 1);
  });
});

if (slides.length > 1) {
  renderSlides();
  setInterval(() => {
    setSlide(currentIndex + 1);
  }, 5000);
}
