# Image Slider Library

A modular, responsive image slider built from scratch with HTML, CSS, and vanilla JavaScript (ES6 classes). No third-party plugins.

## Features
- Next / Previous arrow controls
- Dynamically generated, clickable indicator dots
- Hardware-accelerated sliding with `transform: translate3d()` and CSS transitions
- Seamless infinite looping in both directions (cloned edge slides)
- Keyboard (arrow keys) and swipe support
- Fluid, responsive layout with `aspect-ratio` and `object-fit: cover`

## Usage
Open `index.html` in a browser. Any element with `data-slider` that contains `.slider__viewport > .slider__track > .slider__slide` is initialised automatically.

## Files
- `index.html` – markup and sample images
- `style.css` – layout, controls, and transitions
- `slider.js` – `Slider` class

Author: Aman Shah
