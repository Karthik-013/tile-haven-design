
// Main tile selection page - coordinates all modules
import { TileAnimation } from './modules/tile-animation.js';

class TileSelection {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupPage();
            this.bindEvents();
            TileAnimation.initializePageAnimations();
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
                TileAnimation.showComingSoonAlert();
            });
        }
        
        if (manualMethod) {
            manualMethod.addEventListener('click', () => {
                const roomId = app.getUrlParameter('room');
                if (roomId) {
                    app.navigateTo(`../tile-entry/tile-entry.html?room=${roomId}`);
                } else {
                    console.error('Room ID not found');
                    alert('Room information not found. Please select a room first.');
                }
            });
        }
    }
}

// Initialize the tile selection functionality
const tileSelection = new TileSelection();
