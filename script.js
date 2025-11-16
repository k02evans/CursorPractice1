// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for sticky navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Genre Filter Functionality
const genreTabs = document.querySelectorAll('.genre-tab');
const serviceCards = document.querySelectorAll('.service-card');

function filterByGenre(selectedGenre) {
    serviceCards.forEach(card => {
        const cardGenres = card.getAttribute('data-genre').split(' ');
        
        if (selectedGenre === 'all' || cardGenres.includes(selectedGenre)) {
            card.classList.remove('hidden');
            // Animate card appearance
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        } else {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '0';
            card.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                card.classList.add('hidden');
            }, 300);
        }
    });
}

// Event Listeners for Genre Tabs
genreTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        genreTabs.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Get the selected genre
        const selectedGenre = tab.getAttribute('data-genre');
        
        // Filter service cards
        filterByGenre(selectedGenre);
    });
});

// Service Button Click Handlers (Placeholder for future functionality)
document.querySelectorAll('.service-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        // Placeholder: Add click handlers here for future integration
        console.log('Service button clicked:', e.target.textContent);
        
        // Visual feedback
        const originalText = e.target.textContent;
        e.target.textContent = 'Coming Soon...';
        e.target.style.opacity = '0.7';
        
        setTimeout(() => {
            e.target.textContent = originalText;
            e.target.style.opacity = '1';
        }, 1000);
    });
});

// Hero CTA Button
const heroCTA = document.querySelector('.btn-primary');
if (heroCTA) {
    heroCTA.addEventListener('click', () => {
        // Scroll to services section
        const servicesSection = document.querySelector('#services');
        if (servicesSection) {
            const offsetTop = servicesSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
}

// Intersection Observer for Fade-in Animations on Scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards for scroll animations
serviceCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Add scroll-based navbar background change
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Initialize: Show all services by default
filterByGenre('all');

// Cursor Light Effect
const cursorLight = document.getElementById('cursorLight');
if (cursorLight) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let lightX = mouseX;
    let lightY = mouseY;
    let isAnimating = false;

    // Throttle function for performance
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Smooth interpolation function
    function animate() {
        if (!isAnimating) return;
        
        lightX += (mouseX - lightX) * 0.15;
        lightY += (mouseY - lightY) * 0.15;
        
        // Update CSS custom properties
        cursorLight.style.setProperty('--light-x', `${lightX}px`);
        cursorLight.style.setProperty('--light-y', `${lightY}px`);
        cursorLight.classList.add('active');
        
        requestAnimationFrame(animate);
    }

    // Update cursor light position
    function updateCursorLight(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }

    // Throttled mousemove handler
    const throttledUpdate = throttle(updateCursorLight, 16); // ~60fps

    document.addEventListener('mousemove', throttledUpdate);

    // Initialize light position at center and start animation
    function initCursorLight() {
        lightX = window.innerWidth / 2;
        lightY = window.innerHeight / 2;
        cursorLight.style.setProperty('--light-x', `${lightX}px`);
        cursorLight.style.setProperty('--light-y', `${lightY}px`);
        isAnimating = true;
        animate();
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        window.addEventListener('load', initCursorLight);
    } else {
        initCursorLight();
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        if (mouseX > window.innerWidth) mouseX = window.innerWidth / 2;
        if (mouseY > window.innerHeight) mouseY = window.innerHeight / 2;
    });
}

