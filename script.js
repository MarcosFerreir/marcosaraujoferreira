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
const networkHeroSlider = document.querySelector("#network-hero-slider");

if (networkHeroSlider) {
  const slider = bootstrap.Carousel.getOrCreateInstance(networkHeroSlider, {
    interval: prefersReducedMotion ? false : 7000,
    ride: prefersReducedMotion ? false : "carousel",
    pause: "hover",
    touch: true,
    wrap: true
  });
  const sliderToggle = networkHeroSlider.querySelector("[data-slider-toggle]");
  const sliderToggleIcon = sliderToggle.querySelector("path");
  let sliderPaused = prefersReducedMotion;

  const updateSliderToggle = () => {
    sliderToggle.setAttribute("aria-pressed", String(sliderPaused));
    sliderToggle.setAttribute(
      "aria-label",
      sliderPaused ? "Retomar troca automática de imagens" : "Pausar troca automática de imagens"
    );
    sliderToggleIcon.setAttribute("d", sliderPaused ? "M5 3.5v9l7-4.5z" : "M5 3.5v9m6-9v9");
  };

  updateSliderToggle();

  sliderToggle.addEventListener("click", () => {
    sliderPaused = !sliderPaused;
    if (sliderPaused) {
      slider.pause();
    } else {
      slider.cycle();
    }
    updateSliderToggle();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      slider.pause();
    } else if (!sliderPaused) {
      slider.cycle();
    }
  });
}

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

    if (serviceFilterStatus) {
      serviceFilterStatus.textContent = selectedCategory === "all"
        ? "Exibindo o serviço principal e as três áreas complementares."
        : `Exibindo ${visibleCount} área de serviço.`;
    }
  });
});

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