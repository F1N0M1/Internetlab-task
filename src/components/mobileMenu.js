export class MobileMenu {
  constructor() {
    this.burger = document.querySelector(".nav__burger");
    this.menu = document.querySelector(".nav__list");
    this.overlay = document.querySelector(".nav__overlay");
    this.closeButton = document.querySelector(".nav__close"); // Добавляем кнопку закрытия
    this.isOpen = false;

    if (!this.burger || !this.menu) {
      console.warn("Mobile menu elements not found");
      return;
    }

    this.init();
  }

  init() {
    this.burger.addEventListener("click", () => this.toggleMenu());

    // Обработчик для кнопки закрытия
    if (this.closeButton) {
      this.closeButton.addEventListener("click", () => this.closeMenu());
    }

    if (this.overlay) {
      this.overlay.addEventListener("click", () => this.closeMenu());
    }

    const links = this.menu.querySelectorAll(".nav__link");
    links.forEach((link) => {
      link.addEventListener("click", () => this.closeMenu());
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.menu.classList.add("active");
    if (this.overlay) this.overlay.classList.add("active");
    this.isOpen = true;
    document.body.style.overflow = "hidden";
  }

  closeMenu() {
    this.menu.classList.remove("active");
    if (this.overlay) this.overlay.classList.remove("active");
    this.isOpen = false;
    document.body.style.overflow = "";
  }
}
