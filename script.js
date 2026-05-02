/* ===== DATA MODEL ===== */
const DEFAULT_DATA = {
  personal: {
    brandName: "Substrate",
    tagline: 'Precision <span class="accent">PCB Design</span> &amp; Hardware Prototyping',
    description: "Production-ready hardware engineering. From schematic capture to manufacturing-ready Gerber files. Built for performance, designed for production.",
    email: "hello@substrate.dev",
    phone: "",
    social: { linkedin: "", github: "", twitter: "" },
    emailjs: { serviceId: "", templateId: "", publicKey: "" }
  },
  services: [
    { id: "svc-1", title: "Schematic Capture & Simulation", tools: "LTspice / Altium", description: "Clean, production-ready schematics with full SPICE simulation. Power supply design to signal integrity analysis.", icon: "⊞" },
    { id: "svc-2", title: "Multi-layer PCB Routing", tools: "KiCad / Altium", description: "High-density, multi-layer PCB layouts optimized for manufacturability. Impedance-controlled routing and DFM checks.", icon: "◧" },
    { id: "svc-3", title: "Hardware Prototyping", tools: "ESP32 / Arduino", description: "Rapid prototyping and firmware development. From breadboard concept to custom PCB, fully tested and validated.", icon: "△" }
  ],
  projects: [
    { id: "proj-1", title: "30V/5A Lab Power Supply", category: "Power", description: "Linear regulated PSU with digital readout. 4-layer PCB with thermal management.", image: "assets/psu_board.png", tags: ["Altium", "4-Layer", "Power"] },
    { id: "proj-2", title: "IoT Environmental Monitor", category: "IoT", description: "ESP32-based sensor node with temperature, humidity, and air quality monitoring.", image: "assets/iot_board.png", tags: ["KiCad", "ESP32", "IoT"] },
    { id: "proj-3", title: "Custom ESP32 Dev Board", category: "Development", description: "Compact development board with USB-C, battery management, and expanded GPIO.", image: "assets/esp32_board.png", tags: ["KiCad", "ESP32", "USB-C"] },
    { id: "proj-4", title: "Dual H-Bridge Motor Driver", category: "Motor Control", description: "High-current motor driver with current sensing and thermal protection.", image: "assets/motor_driver.png", tags: ["Altium", "Power", "Motor"] }
  ]
};

let siteData = {};
/* ===== INIT ===== */
function init() {
  loadData();
  renderAll();
  setupScrollEffects();
  setupNavToggle();
  document.getElementById("year").textContent = new Date().getFullYear();
}

function loadData() {
  const saved = localStorage.getItem("substrate_data");
  if (saved) {
    try { siteData = JSON.parse(saved); } catch (e) { siteData = JSON.parse(JSON.stringify(DEFAULT_DATA)); }
  } else {
    siteData = JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

function saveData() {
  localStorage.setItem("substrate_data", JSON.stringify(siteData));
  showToast("Changes saved!");
}



/* ===== RENDER ===== */
function renderAll() {
  renderPersonal();
  renderServices();
  renderPortfolio();
  renderSocial();
  setupRevealAnimations();
}

function renderPersonal() {
  const p = siteData.personal;
  document.getElementById("brandName").innerHTML = p.brandName;
  document.getElementById("heroTitle").innerHTML = p.tagline;
  document.getElementById("heroSub").textContent = p.description;
  document.getElementById("footerBrand").textContent = p.brandName;
  document.getElementById("footerCopy").textContent = p.brandName;
  document.getElementById("footerTagline").textContent = p.description.substring(0, 80) + "...";
  document.title = p.brandName + " — Precision PCB Design & Hardware Prototyping";
}

function renderServices() {
  const grid = document.getElementById("servicesGrid");
  grid.innerHTML = siteData.services.map((s, i) => `
    <div class="card reveal" style="transition-delay:${i * 0.1}s" data-svc-id="${s.id}">
      <div class="service-icon">${s.icon}</div>
      <h3 class="service-title">${s.title}</h3>
      <p class="service-tools">${s.tools}</p>
      <p class="service-desc">${s.description}</p>
    </div>
  `).join("");
}

function renderPortfolio() {
  const categories = ["All", ...new Set(siteData.projects.map(p => p.category))];
  const filtersDiv = document.getElementById("portfolioFilters");
  filtersDiv.innerHTML = categories.map(c =>
    `<button class="filter-btn ${c === 'All' ? 'active' : ''}" onclick="filterProjects('${c}')">${c}</button>`
  ).join("");

  const grid = document.getElementById("portfolioGrid");
  grid.innerHTML = siteData.projects.map((p, i) => `
    <div class="project-card reveal" data-category="${p.category}" data-proj-id="${p.id}" style="transition-delay:${i * 0.1}s">
      <img class="project-img" src="${p.image}" alt="${p.title}" onerror="this.style.background='var(--bg-card)';this.style.height='200px'">
      <div class="project-body">
        <h3 class="project-title">${p.title}</h3>
        <p class="project-desc">${p.description}</p>
        <div class="project-tags">${(p.tags || []).map(t => `<span class="tag">${t}</span>`).join("")}</div>
      </div>
    </div>
  `).join("");
}

/* ===== PORTFOLIO FILTER ===== */
function filterProjects(category) {
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.toggle("active", b.textContent === category));
  document.querySelectorAll(".project-card").forEach(card => {
    if (category === "All" || card.dataset.category === category) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

function renderSocial() {
  const s = siteData.personal.social || {};
  const list = document.getElementById("socialList");
  const items = [];
  if (s.linkedin) items.push(`<li><a href="${s.linkedin}" target="_blank">LinkedIn</a></li>`);
  if (s.github) items.push(`<li><a href="${s.github}" target="_blank">GitHub</a></li>`);
  if (s.twitter) items.push(`<li><a href="${s.twitter}" target="_blank">Twitter / X</a></li>`);
  if (siteData.personal.email) items.push(`<li><a href="mailto:${siteData.personal.email}">Email</a></li>`);
  list.innerHTML = items.length ? items.join("") : '<li style="color:var(--text-muted)">No links set</li>';
}









/* ===== SCROLL EFFECTS ===== */
function setupScrollEffects() {
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 50);
  }, { passive: true });
}

function setupRevealAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("visible"); }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

/* ===== NAV TOGGLE ===== */
function setupNavToggle() {
  document.getElementById("navToggle").addEventListener("click", () => {
    document.getElementById("navLinks").classList.toggle("open");
  });
  document.querySelectorAll(".nav-links a").forEach(a => {
    a.addEventListener("click", () => document.getElementById("navLinks").classList.remove("open"));
  });
}



/* ===== TOAST ===== */
function showToast(msg) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.style.cssText = "position:fixed;bottom:80px;left:50%;transform:translateX(-50%) translateY(20px);background:var(--bg-card);color:var(--accent);border:1px solid var(--border-accent);padding:12px 24px;border-radius:8px;font-family:var(--font-mono);font-size:0.8rem;z-index:3000;opacity:0;transition:all 0.3s ease;pointer-events:none;";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = "1";
  toast.style.transform = "translateX(-50%) translateY(0)";
  setTimeout(() => { toast.style.opacity = "0"; toast.style.transform = "translateX(-50%) translateY(20px)"; }, 2500);
}

/* ===== MOUSE GLOW ON CARDS ===== */
function setupCardGlow() {
  document.addEventListener("mousemove", (e) => {
    document.querySelectorAll(".card, .project-card").forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mouse-x", x + "%");
      card.style.setProperty("--mouse-y", y + "%");
    });
  });
}

/* ===== PARALLAX HERO ===== */
function setupParallax() {
  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    const hero = document.querySelector(".hero-bg");
    const traces = document.querySelector(".hero-traces");
    if (hero) hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    if (traces) traces.style.transform = `translateY(${scrolled * 0.15}px)`;
  }, { passive: true });
}

/* ===== STAGGERED GRID REVEAL ===== */
function setupStaggeredReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.querySelectorAll(".card, .project-card");
        children.forEach((child, i) => {
          child.style.transitionDelay = `${i * 0.12}s`;
          child.classList.add("visible");
        });
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll(".services-grid, .portfolio-grid").forEach(grid => observer.observe(grid));
}

/* ===== SCROLL PROGRESS BAR ===== */
function setupScrollProgress() {
  const bar = document.getElementById("scrollProgress");
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    bar.style.width = progress + "%";
  }, { passive: true });
}

/* ===== CURSOR GLOW ===== */
function setupCursorGlow() {
  const glow = document.getElementById("cursorGlow");
  let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  function animate() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + "px";
    glow.style.top = glowY + "px";
    requestAnimationFrame(animate);
  }
  animate();
}

/* ===== ACTIVE NAV ON SCROLL ===== */
function setupActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
      const top = section.offsetTop - 150;
      if (window.scrollY >= top) current = section.getAttribute("id");
    });
    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) link.classList.add("active");
    });
  }, { passive: true });
}

/* ===== SMOOTH ANCHOR SCROLL ===== */
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const top = target.offsetTop - 80;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

/* ===== TILT EFFECT ON CARDS ===== */
function setupTiltEffect() {
  document.querySelectorAll(".card, .project-card, .qr-card").forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

/* ===== SMOOTH SECTION TRANSITIONS ===== */
function setupSectionTransitions() {
  const sections = document.querySelectorAll(".section");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, { threshold: 0.05, rootMargin: "0px 0px -60px 0px" });
  sections.forEach(s => observer.observe(s));
}

/* ===== START ===== */
document.addEventListener("DOMContentLoaded", () => {
  init();
  setupCardGlow();
  setupParallax();
  setupStaggeredReveal();
  setupSectionTransitions();
  setupScrollProgress();
  setupCursorGlow();
  setupActiveNav();
  setupSmoothScroll();
  setupTiltEffect();
});
