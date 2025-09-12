import { reviews } from "../starage.js";


export class ReviewsSlider {
  constructor() {
    this.track = document.getElementById("reviewsTrack");
    this.pagination = document.getElementById("reviewsPagination");
    this.template = document.getElementById("review-template");

    if (!this.track || !this.pagination || !this.template) {
      console.error("Не найдены необходимые элементы для слайдера");
      return;
    }

    this.prevButton = document.querySelector(".reviews__button--prev");
    this.nextButton = document.querySelector(".reviews__button--next");

    this.currentIndex = 0;
    this.slidesToShow = this.getSlidesToShow();
    this.reviews = [];
    this.totalSlides = 0;
    this.resizeTimeout = null;
    this.slideWidth = 0;
    this.gap = 0;

    this.init();
  }

  async init() {
    try {
      await this.loadReviews();
      this.calculateDimensions();
      this.renderSlides();
      this.renderPagination();
      this.setupEventListeners();
      this.updateSliderState();
    } catch (error) {
      console.error("Ошибка инициализации слайдера:", error);
    }
  }

  calculateDimensions() {
    if (this.track.children.length > 0) {
      const slide = this.track.children[0];
      const trackStyle = getComputedStyle(this.track);

      this.slideWidth = slide.offsetWidth;
      this.gap = parseInt(trackStyle.gap) || 0;
    }
  }

  getSlidesToShow() {
    const width = window.innerWidth;
    if (width < 375) return 1;
    if (width < 768) return 1;
    if (width < 1920) return 2;
    return 3;
  }

  async loadReviews() {
    this.reviews = reviews;
    this.totalSlides = this.reviews.length;
  }

  renderSlides() {
    this.track.innerHTML = "";

    this.reviews.forEach((review, index) => {
      const slide = document.createElement("div");
      slide.className = "reviews__slide";
      slide.innerHTML = this.getReviewHTML(review);
      slide.dataset.index = index;

      this.track.appendChild(slide);
    });

    setTimeout(() => this.calculateDimensions(), 100);
  }

  getReviewHTML(review) {
    const clone = this.template.content.cloneNode(true);
    const card = clone.querySelector(".review-card");

    card.querySelector(".review-card__name").textContent = review.name;
    card.querySelector(".review-card__location").textContent = review.city;
    card.querySelector(".review-card__text").innerHTML = review.review;

    const avatarElement = card.querySelector(".review-card__avatar");
    const initialsElement = card.querySelector(".review-card__initials");

    if (avatarElement) {
      initialsElement.style.display = "none";

      const img = document.createElement("img");
      img.className = "review-card__photo";
      img.alt = review.name;

      // ИСПРАВЛЕННЫЙ ПУТЬ - используйте относительный путь от dist
      img.src = `images/${review.photo || "unnamed.png"}`;

      img.onerror = () => {
        console.error("Ошибка загрузки изображения:", img.src);
        img.style.display = "none";
        initialsElement.style.display = "flex";
        initialsElement.textContent = this.getInitials(review.name);
      };

      avatarElement.appendChild(img);
    }

    return card.outerHTML;
  }

  getInitials(fullName) {
    return fullName
      .split(" ")
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }

  renderPagination() {
    this.pagination.innerHTML = "";

    const totalPages = Math.max(1, this.totalSlides - this.slidesToShow + 1);

    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement("button");
      dot.className = `reviews__dot ${
        i === this.currentIndex ? "reviews__dot--active" : ""
      }`;
      dot.type = "button";
      dot.ariaLabel = `Перейти к карточке ${i + 1}`;
      dot.addEventListener("click", () => this.goToSlide(i));

      this.pagination.appendChild(dot);
    }
  }

  setupEventListeners() {
    if (this.prevButton) {
      this.prevButton.addEventListener("click", () => this.moveSlide(-1));
    }
    if (this.nextButton) {
      this.nextButton.addEventListener("click", () => this.moveSlide(1));
    }

    window.addEventListener("resize", () => this.debouncedResize());
    this.setupSwipe();

    document.addEventListener("keydown", (e) => {
      if (e.target === document.body) {
        if (e.key === "ArrowLeft") this.moveSlide(-1);
        if (e.key === "ArrowRight") this.moveSlide(1);
      }
    });
  }

  debouncedResize() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => this.handleResize(), 250);
  }

  handleResize() {
    const oldSlidesToShow = this.slidesToShow;
    this.slidesToShow = this.getSlidesToShow();

    if (oldSlidesToShow !== this.slidesToShow) {
      this.calculateDimensions();
      this.currentIndex = 0;
      this.renderPagination();
      this.updateSliderState();
    }
  }

  moveSlide(direction) {
    const maxIndex = Math.max(0, this.totalSlides - this.slidesToShow);
    const newIndex = this.currentIndex + direction;

    if (newIndex >= 0 && newIndex <= maxIndex) {
      this.currentIndex = newIndex;
      this.updateSliderState();
    }
  }

  goToSlide(index) {
    const maxIndex = Math.max(0, this.totalSlides - this.slidesToShow);
    if (index >= 0 && index <= maxIndex) {
      this.currentIndex = index;
      this.updateSliderState();
    }
  }

  updateSliderState() {
    const totalSlideWidth = this.slideWidth + this.gap;
    const translateX = -this.currentIndex * totalSlideWidth;

    this.track.style.transform = `translateX(${translateX}px)`;
    this.updatePagination();
    this.updateButtonStates();
  }

  updatePagination() {
    const dots = document.querySelectorAll(".reviews__dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("reviews__dot--active", index === this.currentIndex);
    });
  }

  updateButtonStates() {
    const maxIndex = Math.max(0, this.totalSlides - this.slidesToShow);

    if (this.prevButton) {
      this.prevButton.disabled = this.currentIndex === 0;
    }
    if (this.nextButton) {
      this.nextButton.disabled = this.currentIndex >= maxIndex;
    }
  }

  setupSwipe() {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let currentTranslate = 0;

    const handleStart = (clientX) => {
      startX = clientX;
      isDragging = true;
      this.track.style.transition = "none";

      const transform = this.track.style.transform;
      if (transform && transform !== "none") {
        currentTranslate = parseInt(
          transform.match(/translateX\(([^)]+)px\)/)[1]
        );
      } else {
        currentTranslate = 0;
      }
    };

    const handleMove = (clientX) => {
      if (!isDragging) return;
      const deltaX = clientX - startX;
      this.track.style.transform = `translateX(${currentTranslate + deltaX}px)`;
    };

    const handleEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      this.track.style.transition = "";

      const transform = this.track.style.transform;
      const currentPosition = parseInt(
        transform.match(/translateX\(([^)]+)px\)/)[1]
      );

      const swipeThreshold = 50;

      if (Math.abs(currentPosition - currentTranslate) > swipeThreshold) {
        if (currentPosition > currentTranslate) {
          this.moveSlide(-1);
        } else {
          this.moveSlide(1);
        }
      } else {
        this.updateSliderState();
      }
    };

    // Touch events
    this.track.addEventListener("touchstart", (e) => {
      handleStart(e.touches[0].clientX);
    });

    this.track.addEventListener("touchmove", (e) => {
      handleMove(e.touches[0].clientX);
    });

    this.track.addEventListener("touchend", handleEnd);
    this.track.addEventListener("touchcancel", handleEnd);
  }
}
