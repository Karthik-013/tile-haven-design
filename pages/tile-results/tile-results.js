
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
        });
    }

    loadResultsFromStorage() {
        // Get data passed from tile entry page
        const resultsData = sessionStorage.getItem('tileCalculationResults');
        
        if (!resultsData) {
            console.error('No calculation results found');
            alert('No calculation data found. Redirecting to tile entry.');
            app.navigateTo('../tile-entry/tile-entry.html');
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
            alert('Error loading calculation data. Please try again.');
            app.navigateTo('../tile-entry/tile-entry.html');
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
                    <div class="detail-section">
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
                    
                    <div class="detail-section">
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
                    
                    <div class="detail-section">
                        <h3>📦 Requirements</h3>
                        <div class="detail-item">
                            <span class="detail-label">Tiles Needed:</span>
                            <span class="detail-value">${this.calculations.tilesNeeded} tiles</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Boxes Required:</span>
                            <span class="detail-value">${this.calculations.boxesNeeded} boxes</span>
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
                    
                    <div class="detail-section cost-section">
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
                                <span class="detail-value">$${this.calculations.totalCost}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = resultsHTML;
    }

    bindEvents() {
        const backBtn = document.getElementById('backBtn');
        const addToCartBtn = document.getElementById('addToCartBtn');
        const tryAnotherBtn = document.getElementById('tryAnotherBtn');

        backBtn.addEventListener('click', () => {
            const roomId = this.roomData.id;
            app.navigateTo(`../tile-entry/tile-entry.html?room=${roomId}`);
        });

        addToCartBtn.addEventListener('click', () => {
            this.addToCart();
        });

        tryAnotherBtn.addEventListener('click', () => {
            const roomId = this.roomData.id;
            // Clear the calculation results
            sessionStorage.removeItem('tileCalculationResults');
            app.navigateTo(`../tile-entry/tile-entry.html?room=${roomId}`);
        });
    }

    addToCart() {
        if (!this.tileData || !this.roomData || !this.calculations) {
            console.error('Missing data for cart');
            alert('Error adding to cart. Please recalculate.');
            return;
        }

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
        
        this.showSuccessMessage(`${this.tileData.name} (${this.calculations.boxesNeeded} boxes) added to cart successfully!`);
        
        setTimeout(() => {
            app.navigateTo('../cart/cart.html');
        }, 2000);
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
        
        const container = document.querySelector('.results-container');
        container.insertBefore(successMessage, container.firstChild);
    }
}

// Initialize the tile results functionality
const tileResults = new TileResults();
