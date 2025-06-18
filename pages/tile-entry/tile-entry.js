
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
            
            // Create detailed tile data for display and cart
            const detailedTileData = {
                code: tileData.code,
                name: tileData.name,
                roomId: roomId,
                roomName: room.name,
                roomArea: calculations.roomAreaInFeet,
                roomUnit: 'sq ft',
                tileLength: tileData.length_feet,
                tileWidth: tileData.width_feet,
                tileArea: calculations.tileAreaInFeet,
                tilesNeeded: calculations.tilesNeeded,
                boxesNeeded: calculations.boxesNeeded,
                tilesPerBox: tileData.coverage_per_box,
                totalTiles: calculations.totalTilesInBoxes,
                pricePerTile: tileData.price_per_tile,
                pricePerSqFt: tileData.price_per_square_feet,
                discountPercent: tileData.discount_percent,
                subtotal: calculations.subtotal,
                discountAmount: calculations.discountAmount,
                totalCost: calculations.totalCost,
                addedAt: new Date().toISOString()
            };
            
            console.log('Detailed tile data prepared:', detailedTileData);
            
            this.hideLoadingState();
            this.showTileDetails(detailedTileData);
            
        } catch (error) {
            console.error('Error in fetchTileDetailsAndCalculate:', error);
            this.showError(error.message || 'Failed to fetch tile details. Please check your connection and try again.');
            this.hideLoadingState();
        }
    }

    showLoadingState() {
        const submitBtn = document.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Loading...</span>';
    }

    hideLoadingState() {
        const submitBtn = document.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Calculate Tiles</span><span class="btn-icon">✓</span>';
    }

    showTileDetails(tileData) {
        const detailsContainer = document.getElementById('tileDetails');
        
        const detailsHTML = `
            <h3>📋 Tile Details & Calculation</h3>
            <div class="details-grid">
                <div class="detail-section">
                    <h4>🔧 Tile Specifications</h4>
                    <p><strong>Name:</strong> ${tileData.name}</p>
                    <p><strong>Code:</strong> ${tileData.code}</p>
                    <p><strong>Size:</strong> ${tileData.tileLength}' × ${tileData.tileWidth}' (${tileData.tileArea} sq ft)</p>
                    <p><strong>Price:</strong> $${tileData.pricePerTile} per tile</p>
                </div>
                
                <div class="detail-section">
                    <h4>📐 Room & Requirements</h4>
                    <p><strong>Room:</strong> ${tileData.roomName}</p>
                    <p><strong>Area:</strong> ${tileData.roomArea} sq ft</p>
                    <p><strong>Tiles Needed:</strong> ${tileData.tilesNeeded} tiles</p>
                    <p><strong>Boxes Required:</strong> ${tileData.boxesNeeded} boxes (${tileData.tilesPerBox} tiles/box)</p>
                </div>
                
                <div class="detail-section cost-section">
                    <h4>💰 Cost Breakdown</h4>
                    <p><strong>Total Tiles:</strong> ${tileData.totalTiles} tiles</p>
                    <p><strong>Subtotal:</strong> $${tileData.subtotal}</p>
                    ${tileData.discountPercent > 0 ? `<p class="discount"><strong>Discount (${tileData.discountPercent}%):</strong> -$${tileData.discountAmount}</p>` : ''}
                    <p class="total-cost"><strong>Total Cost:</strong> $${tileData.totalCost}</p>
                </div>
            </div>
            
            <div class="action-buttons">
                <button class="btn btn-primary" onclick="window.tileEntry.addCalculatedTileToCart('${btoa(JSON.stringify(tileData))}')">
                    <span>Add to Cart</span>
                    <span class="btn-icon">🛒</span>
                </button>
                <button class="btn btn-outline" onclick="window.tileEntry.resetForm()">
                    <span>Try Another Code</span>
                </button>
            </div>
        `;
        
        detailsContainer.innerHTML = detailsHTML;
        detailsContainer.style.display = 'block';
        
        // Hide the original form
        document.getElementById('tileForm').style.display = 'none';
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

    showSuccessMessage(message) {
        const existingMessage = document.querySelector('.success-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                <span style="font-size: 1.2rem;">✅</span>
                <span>${message}</span>
            </div>
        `;
        
        const container = document.querySelector('.entry-container');
        container.insertBefore(successMessage, container.firstChild);
    }

    addCalculatedTileToCart(encodedData) {
        try {
            const tileData = JSON.parse(atob(encodedData));
            console.log('Adding tile to cart:', tileData);
            app.addToCart(tileData);
            
            this.showSuccessMessage(`${tileData.name} (${tileData.boxesNeeded} boxes) added to cart successfully!`);
            
            setTimeout(() => {
                app.navigateTo('../cart/cart.html');
            }, 2000);
        } catch (error) {
            console.error('Error adding to cart:', error);
            this.showError('Failed to add tile to cart');
        }
    }

    resetForm() {
        document.getElementById('tileForm').style.display = 'block';
        document.getElementById('tileForm').reset();
        document.getElementById('tileDetails').style.display = 'none';
        document.getElementById('tileCode').focus();
    }
}

// Initialize the tile entry functionality
const tileEntry = new TileEntry();

// Make functions available globally for onclick handlers
window.tileEntry = {
    addCalculatedTileToCart: (encodedData) => tileEntry.addCalculatedTileToCart(encodedData),
    resetForm: () => tileEntry.resetForm()
};
