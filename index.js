// Santarelli Costruzioni - Interactive Website JavaScript

// DOM Content Loaded Event Listener
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initScrollEffects();
    initFormHandler();
    initAnimations();
    initScrollToTop();
    initActiveNavigation();
    initHeroEffects();
});

// Mobile Menu Functionality
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });

        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// Scroll Effects and Smooth Scrolling
function initScrollEffects() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header effects on scroll
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#fff';
            header.style.backdropFilter = 'none';
        }

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Contact Form Handler
function initFormHandler() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            if (validateForm(data)) {
                // Track form submission for analytics
                if (window.SantarelliAnalytics) {
                    window.SantarelliAnalytics.trackContactFormSubmission(data);
                }
                
                openEmailClient(data);
                contactForm.reset();
            }
        });
    }
}

// Open Email Client with pre-filled data
function openEmailClient(data) {
    const recipientEmail = 's.c.srls@legalmail.it';
    const subject = 'Richiesta di informazioni';
    
    // Create natural, conversational email body
    let emailBody = `Buongiorno,\n\n`;
    emailBody += `mi chiamo ${data.name} e ho visto il vostro sito web. `;
    emailBody += `Sono interessato ai vostri servizi e vorrei ricevere informazioni.\n\n`;
    emailBody += `${data.message}\n\n`;
    
    // Add contact details in a natural way
    emailBody += `Per contattarmi potete scrivermi a ${data.email}`;
    if (data.phone && data.phone.trim() !== '') {
        emailBody += ` oppure chiamarmi al ${data.phone}`;
    }
    emailBody += `.\n\n`;
    
    emailBody += `Vi ringrazio per l'attenzione e resto in attesa di una vostra risposta.\n\n`;
    emailBody += `Cordiali saluti,\n${data.name}`;
    
    // Create mailto link
    const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open email client
    window.location.href = mailtoLink;
}

// Form Validation
function validateForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Nome è richiesto (minimo 2 caratteri)');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Email valida è richiesta');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Messaggio è richiesto (minimo 10 caratteri)');
    }
    
    if (errors.length > 0) {
        showNotification(errors.join('<br>'), 'error');
        return false;
    }
    
    return true;
}

// Email Validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification System
function showNotification(message, type = 'info') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Scroll Animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    const animateElements = document.querySelectorAll('.service-card, .portfolio-item, .category-item, .stat-item');
    animateElements.forEach(el => {
        el.classList.add('animate-element');
        observer.observe(el);
    });
    
    // Partner logos animation
    const partnerLogos = document.querySelectorAll('.partner-logo-item');
    
    if (partnerLogos.length > 0) {
        const partnersObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in-partner');
                    partnersObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Set initial state for partner logos - FORCE VISIBLE FOR NOW
        partnerLogos.forEach((logo, index) => {
            // Force show immediately - no animation for debugging
            logo.style.opacity = '1';
            logo.style.transform = 'translateY(0)';
            logo.style.display = 'flex';
            logo.style.visibility = 'visible';
            
            console.log(`Partner logo ${index + 1} forced visible`);
            
            // Try animation if supported (disabled for debugging)
            /*
            if ('IntersectionObserver' in window) {
                logo.style.opacity = '0';
                logo.style.transform = 'translateY(30px)';
                partnersObserver.observe(logo);
            }
            */
        });
        
        // Fallback timeout - show all logos after 2 seconds if animation hasn't worked
        setTimeout(() => {
            partnerLogos.forEach(logo => {
                if (logo.style.opacity === '0') {
                    logo.style.opacity = '1';
                    logo.style.transform = 'translateY(0)';
                    logo.style.transition = 'all 0.6s ease';
                }
            });
        }, 2000);
    }
    
    // Counter animation for stats
    const statNumbers = document.querySelectorAll('.stat-item h4');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.textContent.replace('+', ''));
                animateCounter(target, finalValue);
                statsObserver.unobserve(target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Counter Animation
function animateCounter(element, target) {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(start + (target - start) * easeOutQuart);
        
        element.textContent = currentValue + (target >= 70 ? '+' : '');
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Scroll to Top Button
function initScrollToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    scrollToTopBtn.addEventListener('mouseenter', () => {
        scrollToTopBtn.style.background = '#ff6b35';
        scrollToTopBtn.style.transform = 'scale(1.1)';
    });
    
    scrollToTopBtn.addEventListener('mouseleave', () => {
        scrollToTopBtn.style.background = '#007bff';
        scrollToTopBtn.style.transform = 'scale(1)';
    });
}

// Active Navigation
function initActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    function setActiveNav() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', setActiveNav);
}

// Add animation CSS
const style = document.createElement('style');
style.textContent = `
    .animate-element {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .nav-link.active {
        color: #007bff !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        margin-left: auto;
    }
`;
document.head.appendChild(style);

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});

// Carousel functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = slides.length;

function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Show current slide
    if (slides[index]) {
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
    }
}

function changeSlide(direction) {
    currentSlide += direction;
    
    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    }
    
    showSlide(currentSlide);
}

function goToSlide(index) {
    currentSlide = index;
    showSlide(currentSlide);
}

// Auto-advance carousel
function autoAdvanceCarousel() {
    if (slides.length > 0) {
        changeSlide(1);
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Start auto-advance after 5 seconds, then every 4 seconds
    if (slides.length > 0) {
        setInterval(autoAdvanceCarousel, 4000);
    }
});

// Pause auto-advance on hover
const carouselContainer = document.querySelector('.carousel-container');
let autoAdvanceInterval;

if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', function() {
        clearInterval(autoAdvanceInterval);
    });
    
    carouselContainer.addEventListener('mouseleave', function() {
        autoAdvanceInterval = setInterval(autoAdvanceCarousel, 4000);
    });
}

// Touch support for mobile devices
let touchStartX = 0;
let touchEndX = 0;

if (carouselContainer) {
    carouselContainer.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(autoAdvanceInterval);
    });
    
    carouselContainer.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
        autoAdvanceInterval = setInterval(autoAdvanceCarousel, 4000);
    });
}

function handleSwipeGesture() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            // Swipe right - go to previous slide
            changeSlide(-1);
        } else {
            // Swipe left - go to next slide
            changeSlide(1);
        }
    }
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (slides.length > 0) {
        if (e.key === 'ArrowLeft') {
            changeSlide(-1);
        } else if (e.key === 'ArrowRight') {
            changeSlide(1);
        }
    }
});

// Debug function for partners section
function debugPartners() {
    const partnerLogos = document.querySelectorAll('.partner-logo-item');
    console.log('Partner logos found:', partnerLogos.length);
    
    partnerLogos.forEach((logo, index) => {
        const img = logo.querySelector('img');
        console.log(`Logo ${index + 1}:`, {
            opacity: logo.style.opacity || getComputedStyle(logo).opacity,
            transform: logo.style.transform || getComputedStyle(logo).transform,
            display: logo.style.display || getComputedStyle(logo).display,
            imageSrc: img ? img.src : 'No image',
            imageLoaded: img ? img.complete : false
        });
    });
}

// Call debug after page load
window.addEventListener('load', function() {
    setTimeout(debugPartners, 1000);
});

// Hero Section Effects
function initHeroEffects() {
    initScrollIndicator();
    initHeroStats();
    initHeroImageEffects();
}

// Scroll Indicator Functionality
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const aboutSection = document.querySelector('#chi-siamo');
            if (aboutSection) {
                aboutSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
        
        // Hide scroll indicator after scrolling
        window.addEventListener('scroll', function() {
            const scrollY = window.pageYOffset;
            if (scrollY > 200) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        });
    }
}

// Hero Statistics Animation
function initHeroStats() {
    const statCards = document.querySelectorAll('.stat-card');
    
    if (statCards.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const numberElement = card.querySelector('.stat-content h3');
                    const target = parseInt(numberElement.textContent);
                    
                    // Animate number counting
                    animateStatsNumber(numberElement, target);
                    
                    // Add animation class
                    card.style.animationPlayState = 'running';
                    
                    observer.unobserve(card);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        });
        
        statCards.forEach(card => {
            observer.observe(card);
        });
    }
}

// Animate Statistics Numbers
function animateStatsNumber(element, target) {
    const isPercent = element.textContent.includes('%');
    const duration = 2000;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(easeOutQuart * target);
        
        element.textContent = current + (isPercent ? '%' : (target > 50 ? '+' : ''));
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Hero Image Effects
function initHeroImageEffects() {
    const heroImage = document.querySelector('.hero-main-img');
    
    if (heroImage) {
        // Parallax effect for hero image
        window.addEventListener('scroll', function() {
            const scrollY = window.pageYOffset;
            const rate = scrollY * -0.5;
            
            if (scrollY < window.innerHeight) {
                heroImage.style.transform = `translateY(${rate}px)`;
            }
        });
    }
}

// Add hero styles
const heroStyle = document.createElement('style');
heroStyle.textContent = `
    .stat-card {
        animation-play-state: paused;
    }
    
    .scroll-indicator {
        transition: opacity 0.3s ease;
    }
    
    .scroll-indicator:hover {
        color: #ffc107;
    }
    
    .scroll-indicator:hover .scroll-arrow {
        border-color: #ffc107;
        transform: scale(1.1);
    }
    
    .hero-main-img {
        transition: transform 0.1s ease-out;
    }
`;
document.head.appendChild(heroStyle);

console.log('Santarelli Costruzioni website loaded successfully!'); 