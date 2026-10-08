class Slider {
  constructor(root, options = {}) {
    this.root = typeof root === "string" ? document.querySelector(root) : root;
    if (!this.root) return;

    this.options = {
      duration: 600,
      easing: "cubic-bezier(0.25, 0.8, 0.25, 1)",
      swipeThreshold: 50,
      ...options,
    };

    this.viewport = this.root.querySelector(".slider__viewport");
    this.track = this.root.querySelector(".slider__track");
    this.slides = [...this.track.children];
    this.count = this.slides.length;
    this.index = 1;
    this.isMoving = false;
    this.timer = null;

    if (this.count === 0) return;
    this.init();
  }

  init() {
    this.cloneEdges();
    this.buildArrows();
    this.buildDots();
    this.bindEvents();
    this.setPosition(false);
    this.updateDots();
  }

  get duration() {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    return reduced ? 0 : this.options.duration;
  }

  get realIndex() {
    return (this.index - 1 + this.count) % this.count;
  }

  cloneEdges() {
    const firstClone = this.slides[0].cloneNode(true);
    const lastClone = this.slides[this.count - 1].cloneNode(true);
    [firstClone, lastClone].forEach((clone) =>
      clone.setAttribute("aria-hidden", "true"),
    );
    this.track.append(firstClone);
    this.track.prepend(lastClone);
  }

  createButton(direction) {
    const button = document.createElement("button");
    const path = direction === "prev" ? "M15 18l-6-6 6-6" : "M9 6l6 6-6 6";
    button.type = "button";
    button.className = `slider__btn slider__btn--${direction}`;
    button.setAttribute(
      "aria-label",
      direction === "prev" ? "Previous slide" : "Next slide",
    );
    button.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${path}"/></svg>`;
    this.root.append(button);
    return button;
  }

  buildArrows() {
    this.prevBtn = this.createButton("prev");
    this.nextBtn = this.createButton("next");
  }

  buildDots() {
    this.dotsWrap = document.createElement("div");
    this.dotsWrap.className = "slider__dots";

    this.dots = this.slides.map((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "slider__dot";
      dot.dataset.index = i;
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      this.dotsWrap.append(dot);
      return dot;
    });

    this.root.append(this.dotsWrap);
  }

  bindEvents() {
    this.prevBtn.addEventListener("click", () => this.prev());
    this.nextBtn.addEventListener("click", () => this.next());

    this.dotsWrap.addEventListener("click", (e) => {
      const dot = e.target.closest(".slider__dot");
      if (dot) this.goTo(Number(dot.dataset.index) + 1);
    });

    this.track.addEventListener("transitionend", (e) => {
      if (e.target === this.track && e.propertyName === "transform")
        this.finish();
    });

    this.root.tabIndex = 0;
    this.root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.prev();
      if (e.key === "ArrowRight") this.next();
    });

    let startX = null;
    this.viewport.addEventListener("pointerdown", (e) => {
      startX = e.clientX;
    });
    this.viewport.addEventListener("pointerup", (e) => {
      if (startX === null) return;
      const deltaX = e.clientX - startX;
      if (Math.abs(deltaX) > this.options.swipeThreshold) {
        deltaX < 0 ? this.next() : this.prev();
      }
      startX = null;
    });
    this.viewport.addEventListener("pointercancel", () => {
      startX = null;
    });
  }

  setPosition(animate = true) {
    const { easing } = this.options;
    this.track.style.transition =
      animate && this.duration
        ? `transform ${this.duration}ms ${easing}`
        : "none";
    this.track.style.transform = `translate3d(${-this.index * 100}%, 0, 0)`;
  }

  goTo(target) {
    if (this.isMoving || target === this.index) return;

    this.isMoving = true;
    this.index = target;
    this.setPosition(true);
    this.updateDots();

    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.finish(), this.duration + 50);
  }

  next() {
    this.goTo(this.index + 1);
  }

  prev() {
    this.goTo(this.index - 1);
  }

  finish() {
    if (!this.isMoving) return;
    clearTimeout(this.timer);

    if (this.index === 0) this.index = this.count;
    if (this.index === this.count + 1) this.index = 1;

    this.setPosition(false);
    void this.track.offsetWidth;
    this.isMoving = false;
  }

  updateDots() {
    this.dots.forEach((dot, i) => {
      const active = i === this.realIndex;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-current", active ? "true" : "false");
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-slider]").forEach((el) => new Slider(el));
});
