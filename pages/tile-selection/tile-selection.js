
// Main tile selection page - coordinates all modules
import { TileCalculator } from './modules/tile-calculator.js';
import { TileAPI } from './modules/tile-api.js';
import { TileUI } from './modules/tile-ui.js';
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
        
        if (room) {
            document.getElementById('roomName').textContent = room.name;
        }
    }

    bindEvents() {
        const qrMethod = document.getElementById('qrMethod');
        const manualMethod = document.getElementById('manualMethod');
        const tileForm = document.getElementById('tileForm');
        const cancelEntry = document.getElementById('cancelEntry');
        const tileCodeInput = document.getElementById('tileCode');

        qrMethod.addEventListener('click', () => {
            TileAnimation.showComingSoonAlert();
        });
        
        manualMethod.addEventListener('click', () => {
            TileAnimation.showManualEntry();
        });
        
        cancelEntry.addEventListener('click', () => {
            TileAnimation.hideManualEntry();
        });
        
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
        
        if (!tileCode) {
            TileUI.showError('Please enter a tile code');
            return;
        }
        
        if (!room) {
            TileUI.showError('Room information not found');
            return;
        }
        
        try {
            TileUI.showLoadingState();
            
            const tileData = await TileAPI.fetchTileDetails(tileCode);
            const calculations = TileCalculator.calculateTileRequirements(room, tileData);
            
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
            
            TileUI.hideLoadingState();
            TileUI.showTileDetails(detailedTileData);
            
        } catch (error) {
            console.error('Error:', error);
            TileUI.showError(error.message || 'Failed to fetch tile details. Please check your connection and try again.');
            TileUI.hideLoadingState();
        }
    }

    addCalculatedTileToCart(encodedData) {
        try {
            const tileData = JSON.parse(atob(encodedData));
            app.addToCart(tileData);
            
            TileUI.showSuccessMessage(`${tileData.name} (${tileData.boxesNeeded} boxes) added to cart successfully!`);
            
            setTimeout(() => {
                app.navigateTo('../cart/cart.html');
            }, 2000);
        } catch (error) {
            console.error('Error adding to cart:', error);
            TileUI.showError('Failed to add tile to cart');
        }
    }

    resetForm() {
        TileUI.resetForm();
    }
}

// Initialize the tile selection functionality
const tileSelection = new TileSelection();

// Make functions available globally for onclick handlers
window.tileSelection = {
    addCalculatedTileToCart: (encodedData) => tileSelection.addCalculatedTileToCart(encodedData),
    resetForm: () => tileSelection.resetForm()
};
