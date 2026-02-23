// --- HERO SLIDER LOGIC ---
const heroSlides = [
    { image: 'assets/images/hero-banner-1.jpg' },
    { image: 'assets/images/hero-banner-2.jpg' },
    { image: 'assets/images/hero-banner-3.jpg' },
    { image: 'assets/images/hero-banner-4.jpg' }
];

const heroContainer = document.querySelector('.hero');
if(heroContainer) {
    heroSlides.forEach((slide, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = index === 0 ? 'slide active' : 'slide';
        slideDiv.style.backgroundImage = `url('${slide.image}')`;
        heroContainer.prepend(slideDiv); 
    });

    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    setInterval(nextSlide, 5000);
}

// --- MOBILE MENU ---
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if(hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.innerHTML = navLinks.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
}
function initScrollAnimations() {
  const els = document.querySelectorAll(".animate-on-scroll");
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("animated");
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  els.forEach(el => observer.observe(el));
}

// ============================================================
// ANIMATED COUNTERS (Scroll Triggered)
// ============================================================
document.addEventListener("DOMContentLoaded", function() {
    function initCounters() {
        const counters = document.querySelectorAll(".stat-number[data-count]");
        if (!counters.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (!e.isIntersecting) return;
                
                const el = e.target;
                const target = +el.getAttribute("data-count");
                const suffix = el.getAttribute("data-suffix") || "";
                let count = 0;
                
                // Determine speed/steps based on target number
                const step = Math.ceil(target / 60);

                const tick = setInterval(() => {
                    count = Math.min(count + step, target);
                    el.textContent = count + suffix;
                    if (count >= target) clearInterval(tick);
                }, 30);

                // Stop observing once animated
                observer.unobserve(el);
            });
        }, { threshold: 0.5 }); // Trigger when 50% of the element is visible

        counters.forEach(c => observer.observe(c));
    }

    // Initialize the counters
    initCounters();
});

// ============================================================
// TESTIMONIALS SLIDER LOGIC
// ============================================================
document.addEventListener("DOMContentLoaded", function() {
    const track = document.getElementById('testi-track');
    const prevBtn = document.querySelector('.testi-prev');
    const nextBtn = document.querySelector('.testi-next');
    
    if(track && prevBtn && nextBtn) {
        let currentIndex = 0;
        
        function updateSlider() {
            const cards = document.querySelectorAll('.testimonial-card');
            if(cards.length === 0) return;
            
            // Calculate width of one card + gap
            const cardWidth = cards[0].offsetWidth;
            const gap = 24; // matches CSS gap
            const moveAmount = cardWidth + gap;
            
            // Calculate max index based on screen size
            let visibleCards = 3;
            if(window.innerWidth <= 992) visibleCards = 2;
            if(window.innerWidth <= 600) visibleCards = 1;
            
            const maxIndex = cards.length - visibleCards;
            
            // Clamp index
            if(currentIndex > maxIndex) currentIndex = maxIndex;
            if(currentIndex < 0) currentIndex = 0;
            
            track.style.transform = `translateX(-${currentIndex * moveAmount}px)`;
        }

        nextBtn.addEventListener('click', () => {
            currentIndex++;
            updateSlider();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex--;
            updateSlider();
        });

        // Recalculate on window resize
        window.addEventListener('resize', updateSlider);
    }
});

// ============================================================
// GALLERY SCROLL LOGIC
// ============================================================
document.addEventListener("DOMContentLoaded", function() {
    const galleryTrack = document.getElementById('gallery-track');
    const galleryPrev = document.querySelector('.gallery-prev');
    const galleryNext = document.querySelector('.gallery-next');

    if (galleryTrack && galleryPrev && galleryNext) {
        galleryNext.addEventListener('click', () => {
            // Calculate width of one image card + the 20px CSS gap
            const scrollAmount = galleryTrack.querySelector('.gallery-item').offsetWidth + 20;
            galleryTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        galleryPrev.addEventListener('click', () => {
            const scrollAmount = galleryTrack.querySelector('.gallery-item').offsetWidth + 20;
            galleryTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }
});

// --- BOOKING FORM TO GOOGLE SHEETS HANDLER ---
// Your existing exact URL
const scriptURL = 'https://script.google.com/macros/s/AKfycbzQmWg2mLYEvlBp6XnZ2_RlAn_bCdi5l6nnarlwGuY1gf2L8QD1pijr4EBIIM8DfYBI/exec'; 
const bookingForm = document.forms['bookingForm']; 

if (bookingForm) {
    bookingForm.addEventListener('submit', e => {
        e.preventDefault(); 
        
        const submitButton = bookingForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerText;
        submitButton.innerText = "Sending Request...";
        submitButton.disabled = true;

        fetch(scriptURL, { method: 'POST', body: new FormData(bookingForm)})
            .then(response => {
                alert("Success! Your booking request has been received. We will contact you shortly.");
                bookingForm.reset(); 
                submitButton.innerText = originalButtonText; 
                submitButton.disabled = false;
            })
            .catch(error => {
                console.error('Error!', error.message);
                alert("Oops! Something went wrong. Please try calling us instead.");
                submitButton.innerText = originalButtonText;
                submitButton.disabled = false;
            });
    });
}