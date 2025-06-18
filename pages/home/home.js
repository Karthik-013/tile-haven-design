
// Home Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const startMeasuringBtn = document.getElementById('startMeasuringBtn');
    
    if (startMeasuringBtn) {
        startMeasuringBtn.addEventListener('click', function() {
            console.log('Start measuring button clicked');
            app.navigateTo('pages/measuring/measuring.html');
        });
    }
    
    // Add subtle animations
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroContent && heroImage) {
        // Animate content on load
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
        
        setTimeout(() => {
            heroImage.style.opacity = '1';
            heroImage.style.transform = 'translateY(0)';
        }, 600);
    }
});

// Initial styling for animations
document.addEventListener('DOMContentLoaded', function() {
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        heroContent.style.transition = 'all 0.8s ease';
    }
    
    if (heroImage) {
        heroImage.style.opacity = '0';
        heroImage.style.transform = 'translateY(30px)';
        heroImage.style.transition = 'all 0.8s ease';
    }
});
