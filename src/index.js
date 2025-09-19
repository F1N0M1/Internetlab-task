import "./styles/main.css";
import { SmoothScroll } from "./components/smoothScroll.js";
import { ReviewsSlider } from "./components/reviewsSlider.js";
import { FormValidator } from "./components/formValidator.js";
import { MobileMenu } from "./components/mobileMenu.js";

class App {
  constructor() {
    this.init();
  }

  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.initReviewsSlider();
      this.initFormValidation();
      this.initSmoothScroll();
      this.initMobileMenu();
    });
  }

  initReviewsSlider() {
    const reviewsTrack = document.getElementById("reviewsTrack");
    if (reviewsTrack) {
      new ReviewsSlider();
    }
  }

  initFormValidation() {
    const form = document.querySelector(".form");
    if (form) {
      new FormValidator(form);
    }
  }

  initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
    if (navLinks.length > 0 && typeof SmoothScroll !== "undefined") {
      new SmoothScroll();
    }
  }

  initMobileMenu() {
    const burger = document.querySelector(".nav__burger");
    const menu = document.querySelector(".nav__list");
    const overlay = document.querySelector(".nav__overlay");

    // Проверяем, что все элементы меню существуют
    if (burger && menu && overlay) {
      new MobileMenu();
    }
  }

  addServiceWorker() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("Service Worker registered"))
        .catch((err) =>
          console.log("Service Worker registration failed:", err)
        );
    }
  }
}

new App();

export { App };
