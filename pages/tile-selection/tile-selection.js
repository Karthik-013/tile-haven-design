
// Main tile selection page - coordinates all modules
class TileSelection {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupPage();
            this.bindEvents();
            this.initializePageAnimations();
        });
    }

    setupPage() {
        const roomId = app.getUrlParameter('room');
        const room = app.getRoom(parseInt(roomId));
        
        console.log('Setting up tile selection page for room:', room);
        
        if (room) {
            document.getElementById('roomName').textContent = room.name;
        } else {
            console.error('Room not found for ID:', roomId);
        }
    }

    bindEvents() {
        const qrMethod = document.getElementById('qrMethod');
        const manualMethod = document.getElementById('manualMethod');

        if (qrMethod) {
            qrMethod.addEventListener('click', () => {
                this.showComingSoonAlert();
            });
        }
        
        if (manualMethod) {
            manualMethod.addEventListener('click', () => {
                const roomId = app.getUrlParameter('room');
                if (roomId) {
                    console.log('Navigating to tile-entry with room ID:', roomId);
                    app.navigateTo(`../tile-entry/tile-entry.html?room=${roomId}`);
                } else {
                    console.error('Room ID not found');
                    alert('Room information not found. Please select a room first.');
                }
            });
        }
    }

    initializePageAnimations() {
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

    showComingSoonAlert() {
        console.log('Showing coming soon alert');
        alert('🚀 QR Code scanning feature is coming soon! Please use Manual Entry for now.');
    }
}

// Initialize the tile selection functionality
const tileSelection = new TileSelection();
