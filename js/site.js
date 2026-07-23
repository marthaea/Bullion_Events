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
