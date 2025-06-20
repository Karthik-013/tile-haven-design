
// Login page functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Welcome to Tile Haven! 🏠✨');
    
    // Add some friendly animations
    const cards = document.querySelectorAll('.login-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.classList.add('animate-fade-in');
    });

    // Add interactive effects
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
        });
    });
});

function navigateToWorkerLogin() {
    console.log('🔨 Redirecting to worker portal...');
    
    // Add a friendly loading animation
    const workerCard = document.querySelector('.worker-card');
    if (workerCard) {
        workerCard.style.transform = 'scale(0.95)';
        workerCard.style.opacity = '0.8';
        
        // Add loading text
        const cardContent = workerCard.querySelector('.card-content h3');
        if (cardContent) {
            cardContent.textContent = 'Loading Worker Portal... 🚀';
        }
    }
    
    setTimeout(() => {
        window.location.href = 'worker-login.html';
    }, 500);
}

function navigateToAdminLogin() {
    console.log('🛡️ Redirecting to admin portal...');
    
    // Add a friendly loading animation
    const adminCard = document.querySelector('.admin-card');
    if (adminCard) {
        adminCard.style.transform = 'scale(0.95)';
        adminCard.style.opacity = '0.8';
        
        // Add loading text
        const cardContent = adminCard.querySelector('.card-content h3');
        if (cardContent) {
            cardContent.textContent = 'Loading Admin Portal... 🔐';
        }
    }
    
    setTimeout(() => {
        window.location.href = 'admin-login.html';
    }, 500);
}

// Add pulse animation to cards on load
window.addEventListener('load', function() {
    const cards = document.querySelectorAll('.login-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = 'fadeInUp 0.6s ease-out forwards';
        }, index * 200);
    });
});
