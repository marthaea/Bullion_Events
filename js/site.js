document.addEventListener('DOMContentLoaded', function () {

	// Sticky nav
	var nav = document.querySelector('.bul-nav');
	if (nav) {
		var onScroll = function () {
			if (window.scrollY > 40) {
				nav.classList.add('is-scrolled');
			} else {
				nav.classList.remove('is-scrolled');
			}
		};
		window.addEventListener('scroll', onScroll);
		onScroll();
	}

	// Mobile nav toggle
	var toggle = document.querySelector('.bul-nav__toggle');
	var links = document.querySelector('.bul-nav__links');
	if (toggle && links) {
		toggle.addEventListener('click', function () {
			toggle.classList.toggle('is-active');
			links.classList.toggle('is-open');
		});
		links.querySelectorAll('a').forEach(function (link) {
			link.addEventListener('click', function () {
				toggle.classList.remove('is-active');
				links.classList.remove('is-open');
			});
		});
	}

	// Scroll reveal, staggered by position among reveal siblings
	var revealEls = Array.prototype.slice.call(document.querySelectorAll('.bul-reveal'));
	revealEls.forEach(function (el) {
		var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
			return c.classList.contains('bul-reveal');
		});
		var idx = siblings.indexOf(el);
		el.style.transitionDelay = (Math.min(idx, 8) * 70) + 'ms';
	});

	var animateCount = function (el) {
		var target = parseInt(el.getAttribute('data-count'), 10);
		if (isNaN(target)) return;
		var duration = 1100;
		var start = null;
		var step = function (ts) {
			if (!start) start = ts;
			var progress = Math.min((ts - start) / duration, 1);
			el.textContent = Math.floor(progress * target);
			if (progress < 1) {
				requestAnimationFrame(step);
			} else {
				el.textContent = target;
			}
		};
		requestAnimationFrame(step);
	};

	if ('IntersectionObserver' in window && revealEls.length) {
		var observer = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
					var counter = entry.target.querySelector('[data-count]');
					if (counter) animateCount(counter);
					observer.unobserve(entry.target);
				}
			});
		}, { threshold: 0.15 });
		revealEls.forEach(function (el) { observer.observe(el); });
	} else {
		revealEls.forEach(function (el) {
			el.classList.add('is-visible');
			var counter = el.querySelector('[data-count]');
			if (counter) counter.textContent = counter.getAttribute('data-count');
		});
	}

	// Subtle parallax on full-bleed photo sections
	var parallaxEls = Array.prototype.slice.call(document.querySelectorAll('.bul-hero, .bul-cta-band, .bul-event-card'));
	if (parallaxEls.length) {
		var onParallax = function () {
			parallaxEls.forEach(function (el) {
				var rect = el.getBoundingClientRect();
				var offset = rect.top * 0.12;
				el.style.backgroundPosition = 'center calc(50% + ' + offset + 'px)';
			});
		};
		window.addEventListener('scroll', onParallax, { passive: true });
		onParallax();
	}

	// 3D rose feature: the model starts beside the hero copy, travels down the
	// page as the user scrolls, and completes its rotation once it settles into
	// the "A Signature Touch" section.
	var roseTrack = document.getElementById('roseTrack');
	var roseModel = document.getElementById('roseModel');
	var heroAnchor = document.getElementById('heroRoseAnchor');
	var sigAnchor = document.getElementById('signatureRoseAnchor');

	if (roseTrack && roseModel && heroAnchor && sigAnchor) {
		roseModel.addEventListener('load', function () {
			roseModel.classList.add('is-loaded');
		});

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			// No scroll-driven animation — just place it once at its resting spot.
			var sigRectStill = sigAnchor.getBoundingClientRect();
			roseModel.style.left = sigRectStill.left + 'px';
			roseModel.style.top = sigRectStill.top + 'px';
			roseModel.style.width = sigRectStill.width + 'px';
			roseModel.style.height = sigRectStill.height + 'px';
			roseModel.cameraOrbit = '35deg 78deg auto';
		} else {
			var applyRosePose = function () {
				// Below ~1100px the hero anchor is hidden (no room beside the stacked
				// text) — in that case skip the travel and just settle-rotate in place,
				// same as the model's original behavior.
				var canTravel = heroAnchor.offsetWidth > 0;

				var sigRect = sigAnchor.getBoundingClientRect();
				var trackRect = roseTrack.getBoundingClientRect();
				var trackTotal = Math.max(1, roseTrack.offsetHeight - window.innerHeight);

				// How far through the section's own sticky range we are (0 before it
				// engages, 1 once fully scrolled past) — drives the "final rotation".
				var settleProgress = Math.max(0, Math.min(1, -trackRect.top / trackTotal));

				// How far through the hero-to-section journey we are (0 at page top,
				// 1 once the section's sticky stage has engaged).
				var posProgress = 1;
				if (canTravel) {
					var arrivalScrollY = Math.max(1, window.scrollY + trackRect.top);
					posProgress = Math.max(0, Math.min(1, window.scrollY / arrivalScrollY));
				}

				var heroRect = canTravel ? heroAnchor.getBoundingClientRect() : sigRect;
				var left = heroRect.left + (sigRect.left - heroRect.left) * posProgress;
				var top = heroRect.top + (sigRect.top - heroRect.top) * posProgress;
				var width = heroRect.width + (sigRect.width - heroRect.width) * posProgress;
				var height = heroRect.height + (sigRect.height - heroRect.height) * posProgress;

				roseModel.style.left = left + 'px';
				roseModel.style.top = top + 'px';
				roseModel.style.width = width + 'px';
				roseModel.style.height = height + 'px';

				// Travel contributes a modest turn; the rest of the rotation completes
				// once the rose has arrived and the section is scrolling past it.
				var theta = posProgress * 220 + settleProgress * 380;
				roseModel.cameraOrbit = theta + 'deg 78deg auto';
			};

			// Batched to one update per animation frame, not per raw scroll/resize
			// event, to avoid jank.
			var roseTicking = false;
			var queueRosePose = function () {
				if (!roseTicking) {
					roseTicking = true;
					requestAnimationFrame(function () {
						applyRosePose();
						roseTicking = false;
					});
				}
			};
			window.addEventListener('scroll', queueRosePose, { passive: true });
			window.addEventListener('resize', queueRosePose);
			applyRosePose();
		}
	}

	// Mark the current page in the nav
	var here = location.pathname.split('/').pop() || 'index.html';
	document.querySelectorAll('.bul-nav__links a').forEach(function (a) {
		var href = a.getAttribute('href');
		if (href === here) a.setAttribute('aria-current', 'page');
	});

	// Lightbox for gallery images
	var triggers = Array.prototype.slice.call(document.querySelectorAll('.bul-lightbox-trigger'));
	if (triggers.length) {
		var lightbox = document.createElement('div');
		lightbox.className = 'bul-lightbox';
		lightbox.innerHTML =
			'<button class="bul-lightbox__nav bul-lightbox__nav--prev" aria-label="Previous">&#8249;</button>' +
			'<img alt="">' +
			'<button class="bul-lightbox__nav bul-lightbox__nav--next" aria-label="Next">&#8250;</button>' +
			'<button class="bul-lightbox__close" aria-label="Close">&times;</button>';
		document.body.appendChild(lightbox);

		var img = lightbox.querySelector('img');
		var current = 0;

		var show = function (i) {
			current = (i + triggers.length) % triggers.length;
			img.src = triggers[current].getAttribute('href');
			img.alt = triggers[current].getAttribute('title') || '';
		};
		var open = function (i) {
			show(i);
			lightbox.classList.add('is-open');
		};
		var close = function () {
			lightbox.classList.remove('is-open');
		};

		triggers.forEach(function (t, i) {
			t.addEventListener('click', function (e) {
				e.preventDefault();
				open(i);
			});
		});
		lightbox.querySelector('.bul-lightbox__close').addEventListener('click', close);
		lightbox.querySelector('.bul-lightbox__nav--prev').addEventListener('click', function () { show(current - 1); });
		lightbox.querySelector('.bul-lightbox__nav--next').addEventListener('click', function () { show(current + 1); });
		lightbox.addEventListener('click', function (e) {
			if (e.target === lightbox) close();
		});
		document.addEventListener('keydown', function (e) {
			if (!lightbox.classList.contains('is-open')) return;
			if (e.key === 'Escape') close();
			if (e.key === 'ArrowLeft') show(current - 1);
			if (e.key === 'ArrowRight') show(current + 1);
		});
	}

});
