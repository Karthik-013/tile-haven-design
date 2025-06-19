
// Tile Entry Page - handles tile code entry and calculation
import { TileCalculator } from '../tile-selection/modules/tile-calculator.js';
import { TileAPI } from '../tile-selection/modules/tile-api.js';

class TileEntry {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupPage();
            this.bindEvents();
        });
    }

    setupPage() {
        const roomId = app.getUrlParameter('room');
        const room = app.getRoom(parseInt(roomId));
        
        console.log('Setting up tile entry page for room:', room);
        
        if (room) {
            document.getElementById('roomName').textContent = room.name;
        } else {
            console.error('Room not found for ID:', roomId);
            alert('Room not found. Redirecting to room list.');
            app.navigateTo('../room-list/room-list.html');
        }
    }

    bindEvents() {
        const tileForm = document.getElementById('tileForm');
        const tileCodeInput = document.getElementById('tileCode');

        tileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.fetchTileDetailsAndCalculate();
        });
        
        // Auto-format tile code as user types
        tileCodeInput.addEventListener('input', (e) => {
            let value = e.target.value.toUpperCase();
            // Remove any non-alphanumeric characters except hyphens
            value = value.replace(/[^A-Z0-9-]/g, '');
            e.target.value = value;
        });
    }

    async fetchTileDetailsAndCalculate() {
        const tileCode = document.getElementById('tileCode').value.trim();
        const roomId = app.getUrlParameter('room');
        const room = app.getRoom(parseInt(roomId));
        
        console.log('Processing tile calculation for:', { tileCode, roomId, room });
        
        if (!tileCode) {
            this.showError('Please enter a tile code');
            return;
        }
        
        if (!room) {
            this.showError('Room information not found');
            console.error('Room not found for ID:', roomId);
            return;
        }
        
        try {
            this.showLoadingState();
            
            const tileData = await TileAPI.fetchTileDetails(tileCode);
            console.log('Fetched tile data:', tileData);
            
            const calculations = TileCalculator.calculateTileRequirements(room, tileData);
            console.log('Calculated requirements:', calculations);
            
            // Store the results in session storage for the results page
            const resultsData = {
                tileData: tileData,
                roomData: room,
                calculations: calculations
            };
            
            sessionStorage.setItem('tileCalculationResults', JSON.stringify(resultsData));
            console.log('Stored results data for results page:', resultsData);
            
            this.hideLoadingState();
            
            // Redirect to results page
            app.navigateTo('../tile-results/tile-results.html');
            
        } catch (error) {
            console.error('Error in fetchTileDetailsAndCalculate:', error);
            this.showError(error.message || 'Failed to fetch tile details. Please check your connection and try again.');
            this.hideLoadingState();
        }
    }

    showLoadingState() {
        const submitBtn = document.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Calculating...</span>';
    }

    hideLoadingState() {
        const submitBtn = document.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Calculate Tiles</span><span class="btn-icon">✓</span>';
    }

    showError(message) {
        const tileCodeInput = document.getElementById('tileCode');
        tileCodeInput.style.borderColor = '#e74c3c';
        tileCodeInput.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            color: #e74c3c;
            font-size: 0.9rem;
            margin-top: 8px;
            animation: shake 0.5s ease;
        `;
        errorDiv.textContent = message;
        
        const existingError = tileCodeInput.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        tileCodeInput.parentElement.appendChild(errorDiv);
        
        setTimeout(() => {
            tileCodeInput.style.borderColor = '';
            tileCodeInput.style.boxShadow = '';
            errorDiv.remove();
        }, 3000);
        
        // Add shake animation
        if (!document.querySelector('#shake-animation')) {
            const shakeStyle = document.createElement('style');
            shakeStyle.id = 'shake-animation';
            shakeStyle.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
            `;
            document.head.appendChild(shakeStyle);
        }
    }
}

// Initialize the tile entry functionality
const tileEntry = new TileEntry();
