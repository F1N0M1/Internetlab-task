import "./styles/main.css";
import { SmoothScroll } from "./components/smoothScroll.js";
import { ReviewsSlider } from "./components/reviewsSlider.js";
import { FormValidator } from "./components/formValidator.js";

class App {
  constructor() {
    this.init();
  }

  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.initReviewsSlider();
      this.initFormValidation();
      this.initFAQAccordion(); // Раскомментируйте если есть
      this.initSmoothScroll();
      // this.addServiceWorker(); // Опционально
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

  initFAQAccordion() {
    // Раскомментируйте если есть FAQAccordion
    // const faqItems = document.querySelectorAll('.faq__item');
    // if (faqItems.length > 0 && typeof FAQAccordion !== 'undefined') {
    //   new FAQAccordion();
    // }
  }

  initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
    if (navLinks.length > 0 && typeof SmoothScroll !== "undefined") {
      new SmoothScroll();
    }
  }

  addServiceWorker() {
    // Опционально: регистрация Service Worker
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

// Инициализация приложения
new App();

// Экспорт для тестирования
export { App };
