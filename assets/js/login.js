
// Login page functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Welcome to Tile Haven! 🏠✨');
    
    // Add some friendly animations
    const cards = document.querySelectorAll('.login-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.classList.add('animate-fade-in');
    });
});

function navigateToWorkerLogin() {
    console.log('🔨 Redirecting to worker portal...');
    // Add a friendly loading message
    const workerCard = document.querySelector('.worker-card');
    if (workerCard) {
        workerCard.style.transform = 'scale(0.95)';
        workerCard.style.opacity = '0.8';
    }
    
    setTimeout(() => {
        window.location.href = 'worker-login.html';
    }, 200);
}

function navigateToAdminLogin() {
    console.log('🛡️ Redirecting to admin portal...');
    // Add a friendly loading message
    const adminCard = document.querySelector('.admin-card');
    if (adminCard) {
        adminCard.style.transform = 'scale(0.95)';
        adminCard.style.opacity = '0.8';
    }
    
    setTimeout(() => {
        window.location.href = 'admin-login.html';
    }, 200);
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.login-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});
