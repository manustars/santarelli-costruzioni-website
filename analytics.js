// Google Analytics 4 Configuration for Santarelli Costruzioni
// Replace 'GA_MEASUREMENT_ID' with your actual Google Analytics 4 Measurement ID

// Configuration object
const analyticsConfig = {
    // Replace with your actual GA4 Measurement ID (format: G-XXXXXXXXXX)
    measurementId: 'G-XXXXXXXXXX',
    
    // Custom events for construction company
    customEvents: {
        contact_form_submit: 'contact_form_submit',
        phone_click: 'phone_click',
        email_click: 'email_click',
        project_view: 'project_view',
        partner_click: 'partner_click',
        carousel_interaction: 'carousel_interaction'
    }
};

// Initialize Google Analytics
function initializeAnalytics() {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.measurementId}`;
    document.head.appendChild(script);
    
    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', analyticsConfig.measurementId, {
        page_title: 'Santarelli Costruzioni - Esperienza e Qualità nel Settore Edile',
        custom_map: {
            'custom_parameter_1': 'construction_company',
            'custom_parameter_2': 'fara_in_sabina'
        }
    });
    
    // Make gtag globally available
    window.gtag = gtag;
}

// Track custom events
function trackEvent(eventName, parameters = {}) {
    if (window.gtag) {
        gtag('event', eventName, parameters);
    }
}

// Track contact form submissions
function trackContactFormSubmission(formData) {
    trackEvent(analyticsConfig.customEvents.contact_form_submit, {
        event_category: 'contact',
        event_label: 'form_submission',
        has_phone: formData.phone && formData.phone.trim() !== '',
        message_length: formData.message ? formData.message.length : 0
    });
}

// Track phone number clicks
function trackPhoneClick(phoneNumber) {
    trackEvent(analyticsConfig.customEvents.phone_click, {
        event_category: 'contact',
        event_label: 'phone_click',
        phone_number: phoneNumber
    });
}

// Track email clicks
function trackEmailClick() {
    trackEvent(analyticsConfig.customEvents.email_click, {
        event_category: 'contact',
        event_label: 'email_click'
    });
}

// Track project/portfolio views
function trackProjectView(projectName) {
    trackEvent(analyticsConfig.customEvents.project_view, {
        event_category: 'engagement',
        event_label: 'project_view',
        project_name: projectName
    });
}

// Track partner logo clicks
function trackPartnerClick(partnerName) {
    trackEvent(analyticsConfig.customEvents.partner_click, {
        event_category: 'engagement',
        event_label: 'partner_click',
        partner_name: partnerName
    });
}

// Track carousel interactions
function trackCarouselInteraction(action, slideNumber) {
    trackEvent(analyticsConfig.customEvents.carousel_interaction, {
        event_category: 'engagement',
        event_label: 'carousel_interaction',
        action: action, // 'next', 'prev', 'indicator_click', 'auto_advance'
        slide_number: slideNumber
    });
}

// Enhanced page tracking
function trackPageView(pageName) {
    if (window.gtag) {
        gtag('config', analyticsConfig.measurementId, {
            page_title: pageName,
            page_location: window.location.href
        });
    }
}

// Track scroll depth
function trackScrollDepth() {
    let maxScroll = 0;
    const milestones = [25, 50, 75, 100];
    
    window.addEventListener('scroll', () => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        
        milestones.forEach(milestone => {
            if (scrollPercent >= milestone && maxScroll < milestone) {
                maxScroll = milestone;
                trackEvent('scroll_depth', {
                    event_category: 'engagement',
                    event_label: 'scroll_depth',
                    scroll_depth: milestone
                });
            }
        });
    });
}

// Track time on page
function trackTimeOnPage() {
    const startTime = Date.now();
    
    // Track when user leaves page
    window.addEventListener('beforeunload', () => {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        trackEvent('time_on_page', {
            event_category: 'engagement',
            event_label: 'time_on_page',
            time_spent: timeSpent
        });
    });
}

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAnalytics();
    trackScrollDepth();
    trackTimeOnPage();
    
    // Track phone clicks
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', () => {
            trackPhoneClick(link.textContent);
        });
    });
    
    // Track email clicks
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', () => {
            trackEmailClick();
        });
    });
    
    // Track portfolio item views
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const projectName = entry.target.querySelector('h3').textContent;
                    trackProjectView(projectName);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(item);
    });
});

// Export functions for use in other scripts
window.SantarelliAnalytics = {
    trackContactFormSubmission,
    trackPhoneClick,
    trackEmailClick,
    trackProjectView,
    trackPartnerClick,
    trackCarouselInteraction,
    trackPageView,
    trackEvent
};

console.log('Santarelli Costruzioni - Analytics initialized'); 