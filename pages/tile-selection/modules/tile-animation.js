
// Animation utilities for tile selection
export class TileAnimation {
    static initializePageAnimations() {
        console.log('Initializing tile selection page animations');
        
        // Animate method cards on load
        const methodCards = document.querySelectorAll('.method-card');
        methodCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 200 * (index + 1));
        });

        // Add hover effects
        methodCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '';
            });
        });
    }

    static showComingSoonAlert() {
        console.log('Showing coming soon alert');
        alert('🚀 QR Code scanning feature is coming soon! Please use Manual Entry for now.');
    }
}
