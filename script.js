const siteNav = document.querySelector(".site-nav");
const menuButton = document.querySelector(".menu-toggle");
let closeMenuWhenShown = false;

siteNav.addEventListener("show.bs.collapse", () => {
  menuButton.setAttribute("aria-label", "Fechar menu");
});

siteNav.addEventListener("hide.bs.collapse", () => {
  menuButton.setAttribute("aria-label", "Abrir menu");
});

siteNav.addEventListener("shown.bs.collapse", () => {
  if (closeMenuWhenShown) {
    closeMenuWhenShown = false;
    bootstrap.Collapse.getOrCreateInstance(siteNav).hide();
  }
});

siteNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    if (siteNav.classList.contains("collapsing") && !siteNav.classList.contains("show")) {
      closeMenuWhenShown = true;
      return;
    }

    closeMenuWhenShown = false;
    bootstrap.Collapse.getOrCreateInstance(siteNav).hide();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && siteNav.classList.contains("show")) {
    bootstrap.Collapse.getOrCreateInstance(siteNav).hide();
  }
});

document.querySelector("#current-year").textContent = new Date().getFullYear();

const mobileAppNav = document.querySelector(".mobile-app-nav");

if (mobileAppNav) {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const activeTab = currentPage === "curriculo.html"
    ? "resume"
    : currentPage === "index.html"
      ? "home"
      : "services";
  mobileAppNav.querySelector(`[data-mobile-tab="${activeTab}"]`).setAttribute("aria-current", "page");
}

const revealElements = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const serviceFilters = document.querySelectorAll("[data-service-filter]");
const serviceCards = document.querySelectorAll(".service-grid [data-service-category]");
const marketingFeature = document.querySelector(".service-grid [data-service-feature='marketing']");
const serviceFilterStatus = document.querySelector("#service-filter-status");

serviceFilters.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedCategory = button.dataset.serviceFilter;
    let visibleCount = 0;

    serviceFilters.forEach((filter) => {
      const isActive = filter === button;
      filter.classList.toggle("is-active", isActive);
      filter.setAttribute("aria-pressed", String(isActive));
    });

    serviceCards.forEach((card) => {
      card.hidden = selectedCategory !== "all" && card.dataset.serviceCategory !== selectedCategory;
      if (!card.hidden) visibleCount += 1;
    });

    if (marketingFeature) {
      marketingFeature.hidden = selectedCategory !== "all" && selectedCategory !== "marketing";
    }

    if (serviceFilterStatus) {
      serviceFilterStatus.textContent = selectedCategory === "all"
        ? "Exibindo todas as quatro áreas de serviço."
        : `Exibindo ${visibleCount} área de serviço.`;
    }
  });
});

const marketingWelcomeModal = document.querySelector("#marketing-welcome-modal");

if (marketingWelcomeModal && window.bootstrap) {
  window.setTimeout(() => {
    bootstrap.Modal.getOrCreateInstance(marketingWelcomeModal).show();
  }, 450);
}

const marketingMethodToggle = document.querySelector(".marketing-method-toggle");
const marketingMethodDetails = document.querySelector("#marketing-method-details");

if (marketingMethodToggle && marketingMethodDetails) {
  marketingMethodToggle.addEventListener("click", () => {
    const isExpanded = marketingMethodToggle.getAttribute("aria-expanded") === "true";
    marketingMethodToggle.setAttribute("aria-expanded", String(!isExpanded));
    marketingMethodDetails.classList.toggle("is-open", !isExpanded);
    marketingMethodDetails.setAttribute("aria-hidden", String(isExpanded));
    marketingMethodDetails.inert = isExpanded;
  });
}