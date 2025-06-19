
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
            this.initializeAnimations();
        });
    }

    initializeAnimations() {
        // Add entrance animations
        const container = document.querySelector('.tile-entry-container');
        const form = document.querySelector('.entry-form');
        
        if (container) {
            container.style.opacity = '0';
            container.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                container.style.transition = 'all 0.6s ease';
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }, 200);
        }

        // Add interactive hover effects
        if (form) {
            form.addEventListener('mouseenter', () => {
                form.style.transform = 'translateY(-3px)';
            });
            
            form.addEventListener('mouseleave', () => {
                form.style.transform = 'translateY(0)';
            });
        }
    }

    setupPage() {
        const roomId = app.getUrlParameter('room');
        const room = app.getRoom(parseInt(roomId));
        
        console.log('Setting up tile entry page for room:', room);
        
        if (room) {
            document.getElementById('roomName').textContent = room.name;
            this.animateRoomName();
        } else {
            console.error('Room not found for ID:', roomId);
            this.showError('Room not found. Redirecting to room list.');
            setTimeout(() => {
                app.navigateTo('../room-list/room-list.html');
            }, 2000);
        }
    }

    animateRoomName() {
        const roomNameElement = document.getElementById('roomName');
        if (roomNameElement) {
            roomNameElement.style.animation = 'fadeInUp 0.8s ease-out 0.4s both';
        }
    }

    bindEvents() {
        const tileForm = document.getElementById('tileForm');
        const tileCodeInput = document.getElementById('tileCode');
        const submitBtn = tileForm.querySelector('button[type="submit"]');

        tileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.fetchTileDetailsAndCalculate();
        });
        
        // Auto-format tile code as user types with visual feedback
        tileCodeInput.addEventListener('input', (e) => {
            let value = e.target.value.toUpperCase();
            value = value.replace(/[^A-Z0-9-]/g, '');
            e.target.value = value;
            
            // Add visual feedback for valid input
            if (value.length > 0) {
                e.target.style.borderColor = value.length >= 3 ? 'var(--primary-green)' : 'var(--sage-green)';
            } else {
                e.target.style.borderColor = '#e0e0e0';
            }
        });

        // Add focus animations
        tileCodeInput.addEventListener('focus', () => {
            tileCodeInput.parentElement.style.transform = 'scale(1.02)';
            tileCodeInput.style.boxShadow = '0 0 0 3px rgba(74, 124, 89, 0.1)';
        });

        tileCodeInput.addEventListener('blur', () => {
            tileCodeInput.parentElement.style.transform = 'scale(1)';
            tileCodeInput.style.boxShadow = 'none';
        });

        // Add button hover effects
        submitBtn.addEventListener('mouseenter', () => {
            if (!submitBtn.disabled) {
                submitBtn.style.transform = 'translateY(-2px)';
                submitBtn.style.boxShadow = '0 6px 20px rgba(74, 124, 89, 0.3)';
            }
        });

        submitBtn.addEventListener('mouseleave', () => {
            if (!submitBtn.disabled) {
                submitBtn.style.transform = 'translateY(0)';
                submitBtn.style.boxShadow = 'none';
            }
        });
    }

    async fetchTileDetailsAndCalculate() {
        const tileCode = document.getElementById('tileCode').value.trim();
        const roomId = app.getUrlParameter('room');
        const room = app.getRoom(parseInt(roomId));
        
        console.log('Processing tile calculation for:', { tileCode, roomId, room });
        
        if (!tileCode) {
            this.showError('Please enter a tile code');
            this.shakeInput();
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
            this.showSuccessAnimation();
            
            // Redirect to results page with animation
            setTimeout(() => {
                app.navigateTo('../tile-results/tile-results.html');
            }, 1000);
            
        } catch (error) {
            console.error('Error in fetchTileDetailsAndCalculate:', error);
            this.showError(error.message || 'Failed to fetch tile details. Please check your connection and try again.');
            this.hideLoadingState();
            this.shakeInput();
        }
    }

    showLoadingState() {
        const submitBtn = document.querySelector('button[type="submit"]');
        const tileCodeInput = document.getElementById('tileCode');
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading-spinner"></span><span>Calculating...</span>';
        submitBtn.style.background = 'var(--sage-green)';
        
        tileCodeInput.disabled = true;
        tileCodeInput.style.opacity = '0.7';
        
        // Add pulsing animation to the form
        const form = document.querySelector('.entry-form');
        form.classList.add('pulse-animation');
    }

    hideLoadingState() {
        const submitBtn = document.querySelector('button[type="submit"]');
        const tileCodeInput = document.getElementById('tileCode');
        const form = document.querySelector('.entry-form');
        
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Calculate Tiles</span><span class="btn-icon">✓</span>';
        submitBtn.style.background = 'var(--primary-green)';
        
        tileCodeInput.disabled = false;
        tileCodeInput.style.opacity = '1';
        
        form.classList.remove('pulse-animation');
    }

    showSuccessAnimation() {
        const submitBtn = document.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<span>✅ Success! Redirecting...</span>';
        submitBtn.style.background = 'var(--secondary-green)';
        
        const form = document.querySelector('.entry-form');
        form.style.transform = 'scale(1.02)';
        form.style.boxShadow = '0 10px 30px rgba(74, 124, 89, 0.2)';
        
        setTimeout(() => {
            form.style.transform = 'scale(1)';
        }, 500);
    }

    shakeInput() {
        const tileCodeInput = document.getElementById('tileCode');
        tileCodeInput.style.animation = 'shake 0.5s ease';
        
        setTimeout(() => {
            tileCodeInput.style.animation = '';
        }, 500);
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
            padding: 8px 12px;
            background: rgba(231, 76, 60, 0.1);
            border-radius: 6px;
            border-left: 4px solid #e74c3c;
            animation: shake 0.5s ease, fadeIn 0.3s ease;
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
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 4000);
    }
}

// Initialize the tile entry functionality
const tileEntry = new TileEntry();
