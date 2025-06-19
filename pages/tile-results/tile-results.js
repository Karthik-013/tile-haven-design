
// Tile Results Page - displays calculation results
import { TileCalculator } from '../tile-selection/modules/tile-calculator.js';

class TileResults {
    constructor() {
        this.tileData = null;
        this.roomData = null;
        this.calculations = null;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.loadResultsFromStorage();
            this.bindEvents();
            this.initializeAnimations();
        });
    }

    initializeAnimations() {
        // Animate the results container on load
        const container = document.getElementById('resultsContainer');
        if (container) {
            container.style.opacity = '0';
            container.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                container.style.transition = 'all 0.8s ease';
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }, 300);
        }

        // Animate action buttons
        const actionButtons = document.querySelector('.action-buttons');
        if (actionButtons) {
            actionButtons.style.opacity = '0';
            actionButtons.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                actionButtons.style.transition = 'all 0.6s ease';
                actionButtons.style.opacity = '1';
                actionButtons.style.transform = 'translateY(0)';
            }, 800);
        }
    }

    loadResultsFromStorage() {
        // Get data passed from tile entry page
        const resultsData = sessionStorage.getItem('tileCalculationResults');
        
        if (!resultsData) {
            console.error('No calculation results found');
            this.showError('No calculation data found. Redirecting to tile entry.');
            setTimeout(() => {
                app.navigateTo('../tile-entry/tile-entry.html');
            }, 2000);
            return;
        }

        try {
            const data = JSON.parse(resultsData);
            this.tileData = data.tileData;
            this.roomData = data.roomData;
            this.calculations = data.calculations;
            
            console.log('Loaded results data:', data);
            this.displayResults();
        } catch (error) {
            console.error('Error parsing results data:', error);
            this.showError('Error loading calculation data. Please try again.');
            setTimeout(() => {
                app.navigateTo('../tile-entry/tile-entry.html');
            }, 2000);
        }
    }

    displayResults() {
        const container = document.getElementById('resultsContainer');
        
        const resultsHTML = `
            <div class="result-header">
                <h2>📋 Calculation Complete for ${this.roomData.name}</h2>
            </div>
            
            <div class="result-content">
                <div class="details-grid">
                    <div class="detail-section" data-animation="slide-left">
                        <h3>🏠 Room Information</h3>
                        <div class="detail-item">
                            <span class="detail-label">Room Name:</span>
                            <span class="detail-value">${this.roomData.name}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Dimensions:</span>
                            <span class="detail-value">${this.roomData.length} × ${this.roomData.breadth} ${this.roomData.unit}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Area:</span>
                            <span class="detail-value">${this.calculations.roomAreaInFeet} sq ft</span>
                        </div>
                    </div>
                    
                    <div class="detail-section" data-animation="slide-right">
                        <h3>🔧 Tile Specifications</h3>
                        <div class="detail-item">
                            <span class="detail-label">Tile Name:</span>
                            <span class="detail-value">${this.tileData.name}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Code:</span>
                            <span class="detail-value">${this.tileData.code}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Size:</span>
                            <span class="detail-value">${this.tileData.length_feet}' × ${this.tileData.width_feet}' (${this.calculations.tileAreaInFeet} sq ft)</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Price per Tile:</span>
                            <span class="detail-value">$${this.tileData.price_per_tile}</span>
                        </div>
                    </div>
                    
                    <div class="detail-section" data-animation="fade-up">
                        <h3>📦 Requirements</h3>
                        <div class="detail-item">
                            <span class="detail-label">Tiles Needed:</span>
                            <span class="detail-value highlight-number">${this.calculations.tilesNeeded} tiles</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Boxes Required:</span>
                            <span class="detail-value highlight-number">${this.calculations.boxesNeeded} boxes</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Tiles per Box:</span>
                            <span class="detail-value">${this.tileData.coverage_per_box} tiles</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Total Tiles:</span>
                            <span class="detail-value">${this.calculations.totalTilesInBoxes} tiles</span>
                        </div>
                    </div>
                    
                    <div class="detail-section cost-section" data-animation="scale-in">
                        <h3>💰 Cost Breakdown</h3>
                        <div class="cost-breakdown">
                            <div class="cost-item subtotal">
                                <span class="detail-label">Subtotal:</span>
                                <span class="detail-value">$${this.calculations.subtotal}</span>
                            </div>
                            ${this.tileData.discount_percent > 0 ? `
                                <div class="cost-item discount">
                                    <span class="detail-label">Discount (${this.tileData.discount_percent}%):</span>
                                    <span class="detail-value">-$${this.calculations.discountAmount}</span>
                                </div>
                            ` : ''}
                            <div class="cost-item total">
                                <span class="detail-label">Total Cost:</span>
                                <span class="detail-value total-amount">$${this.calculations.totalCost}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = resultsHTML;
        
        // Apply section animations after content is loaded
        setTimeout(() => {
            this.animateSections();
        }, 100);
    }

    animateSections() {
        const sections = document.querySelectorAll('.detail-section');
        
        sections.forEach((section, index) => {
            const animation = section.dataset.animation;
            section.style.opacity = '0';
            
            setTimeout(() => {
                section.style.transition = 'all 0.6s ease';
                section.style.opacity = '1';
                
                switch (animation) {
                    case 'slide-left':
                        section.style.transform = 'translateX(-30px)';
                        setTimeout(() => section.style.transform = 'translateX(0)', 50);
                        break;
                    case 'slide-right':
                        section.style.transform = 'translateX(30px)';
                        setTimeout(() => section.style.transform = 'translateX(0)', 50);
                        break;
                    case 'fade-up':
                        section.style.transform = 'translateY(20px)';
                        setTimeout(() => section.style.transform = 'translateY(0)', 50);
                        break;
                    case 'scale-in':
                        section.style.transform = 'scale(0.95)';
                        setTimeout(() => section.style.transform = 'scale(1)', 50);
                        break;
                }
            }, index * 200);
        });

        // Add number counting animation
        setTimeout(() => {
            this.animateNumbers();
        }, 1000);
    }

    animateNumbers() {
        const numberElements = document.querySelectorAll('.highlight-number');
        
        numberElements.forEach(element => {
            const finalText = element.textContent;
            const number = parseInt(finalText.match(/\d+/)[0]);
            let current = 0;
            const increment = Math.ceil(number / 30);
            const timer = setInterval(() => {
                current += increment;
                if (current >= number) {
                    current = number;
                    clearInterval(timer);
                }
                element.textContent = finalText.replace(/\d+/, current);
            }, 50);
        });

        // Animate total cost with special effect
        const totalAmount = document.querySelector('.total-amount');
        if (totalAmount) {
            totalAmount.style.animation = 'pulse 2s infinite';
            setTimeout(() => {
                totalAmount.style.animation = '';
            }, 4000);
        }
    }

    bindEvents() {
        const backBtn = document.getElementById('backBtn');
        const addToCartBtn = document.getElementById('addToCartBtn');
        const tryAnotherBtn = document.getElementById('tryAnotherBtn');

        // Add hover effects to buttons
        [backBtn, addToCartBtn, tryAnotherBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('mouseenter', () => {
                    btn.style.transform = 'translateY(-2px)';
                    btn.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
                });
                
                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = 'translateY(0)';
                    btn.style.boxShadow = '';
                });
            }
        });

        backBtn.addEventListener('click', () => {
            this.animateExit(() => {
                const roomId = this.roomData.id;
                app.navigateTo(`../tile-entry/tile-entry.html?room=${roomId}`);
            });
        });

        addToCartBtn.addEventListener('click', () => {
            this.addToCart();
        });

        tryAnotherBtn.addEventListener('click', () => {
            this.animateExit(() => {
                const roomId = this.roomData.id;
                sessionStorage.removeItem('tileCalculationResults');
                app.navigateTo(`../tile-entry/tile-entry.html?room=${roomId}`);
            });
        });
    }

    animateExit(callback) {
        const container = document.getElementById('resultsContainer');
        const actionButtons = document.querySelector('.action-buttons');
        
        container.style.transform = 'translateY(-20px)';
        container.style.opacity = '0.5';
        actionButtons.style.transform = 'translateY(20px)';
        actionButtons.style.opacity = '0';
        
        setTimeout(callback, 300);
    }

    addToCart() {
        if (!this.tileData || !this.roomData || !this.calculations) {
            console.error('Missing data for cart');
            this.showError('Error adding to cart. Please recalculate.');
            return;
        }

        const addToCartBtn = document.getElementById('addToCartBtn');
        
        // Animate button
        addToCartBtn.style.background = 'var(--secondary-green)';
        addToCartBtn.innerHTML = '<span>✅ Adding...</span>';
        addToCartBtn.disabled = true;

        const cartItem = {
            code: this.tileData.code,
            name: this.tileData.name,
            roomId: this.roomData.id,
            roomName: this.roomData.name,
            roomArea: this.calculations.roomAreaInFeet,
            roomUnit: 'sq ft',
            tileLength: this.tileData.length_feet,
            tileWidth: this.tileData.width_feet,
            tileArea: this.calculations.tileAreaInFeet,
            tilesNeeded: this.calculations.tilesNeeded,
            boxesNeeded: this.calculations.boxesNeeded,
            tilesPerBox: this.tileData.coverage_per_box,
            totalTiles: this.calculations.totalTilesInBoxes,
            pricePerTile: this.tileData.price_per_tile,
            pricePerSqFt: this.tileData.price_per_square_feet,
            discountPercent: this.tileData.discount_percent,
            subtotal: this.calculations.subtotal,
            discountAmount: this.calculations.discountAmount,
            totalCost: this.calculations.totalCost,
            addedAt: new Date().toISOString()
        };

        console.log('Adding to cart:', cartItem);
        app.addToCart(cartItem);
        
        setTimeout(() => {
            this.showSuccessMessage(`${this.tileData.name} (${this.calculations.boxesNeeded} boxes) added to cart successfully!`);
            
            setTimeout(() => {
                this.animateExit(() => {
                    app.navigateTo('../cart/cart.html');
                });
            }, 2000);
        }, 1000);
    }

    showSuccessMessage(message) {
        const existingMessage = document.querySelector('.success-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <span style="font-size: 1.2rem;">✅</span>
            <span>${message}</span>
        `;
        successMessage.style.animation = 'fadeIn 0.5s ease, scale-in 0.3s ease';
        
        const container = document.querySelector('.results-container');
        container.insertBefore(successMessage, container.firstChild);
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            background: rgba(231, 76, 60, 0.1);
            border: 2px solid #e74c3c;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 20px;
            text-align: center;
            color: #e74c3c;
            font-weight: 500;
            animation: shake 0.5s ease, fadeIn 0.3s ease;
        `;
        errorDiv.textContent = message;
        
        const container = document.querySelector('.results-container');
        container.insertBefore(errorDiv, container.firstChild);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 4000);
    }
}

// Initialize the tile results functionality
const tileResults = new TileResults();
