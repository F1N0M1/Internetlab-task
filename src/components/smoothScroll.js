export class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
    
    if (navLinks.length > 0) {
      navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();

          const targetId = link.getAttribute("href");
          const targetElement = document.querySelector(targetId);

          if (targetElement) {
            const headerOffset = document.querySelector(".header")?.offsetHeight || 0;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }
        });
      });
    }
  }
}