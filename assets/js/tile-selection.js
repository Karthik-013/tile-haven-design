
// Tile Selection JavaScript
class TileSelection {
    constructor() {
        this.selectedTile = null;
        this.rooms = [];
        this.calculations = {};
        this.init();
    }

    init() {
        console.log('Tile Selection initialized');
        this.loadCustomerInfo();
        this.loadRooms();
        this.renderAreaSummary();
        this.setupEventListeners();
    }

    loadCustomerInfo() {
        const customerDetails = localStorage.getItem('customerDetails');
        if (!customerDetails) {
            window.location.href = 'customer-form.html';
            return;
        }

        const customer = JSON.parse(customerDetails);
        const customerInfo = document.getElementById('customerInfo');
        if (customerInfo) {
            customerInfo.innerHTML = `
                <strong>${customer.name}</strong> | ${customer.phone}
            `;
        }
    }

    loadRooms() {
        const savedRooms = localStorage.getItem('tileHavenRooms');
        if (!savedRooms) {
            window.location.href = 'room-measuring.html';
            return;
        }

        this.rooms = JSON.parse(savedRooms).filter(room => room.selected);
        if (this.rooms.length === 0) {
            window.location.href = 'room-measuring.html';
            return;
        }
    }

    setupEventListeners() {
        // Enter key on tile code input
        const tileCodeInput = document.getElementById('tileCodeInput');
        if (tileCodeInput) {
            tileCodeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.fetchTileDetails();
                }
            });
        }
    }

    renderAreaSummary() {
        const areaSummary = document.getElementById('areaSummary');
        if (!areaSummary) return;

        const totalArea = this.rooms.reduce((sum, room) => sum + room.totalArea, 0);

        areaSummary.innerHTML = `
            <h3>Area Summary</h3>
            <div class="rooms-summary">
                ${this.rooms.map(room => `
                    <div class="room-summary-item">
                        <span class="room-summary-name">${room.name}</span>
                        <span class="room-summary-area">${room.totalArea.toFixed(2)} sq ft</span>
                    </div>
                `).join('')}
            </div>
            <div class="total-area-display">
                Total Area: ${totalArea.toFixed(2)} sq ft
            </div>
        `;
    }

    async fetchTileDetails() {
        const tileCode = document.getElementById('tileCodeInput').value.trim();
        if (!tileCode) {
            showToast('Please enter a tile code', 'error');
            return;
        }

        try {
            const { data: tile, error } = await supabase
                .from('tiles')
                .select('*')
                .eq('code', tileCode)
                .single();

            if (error || !tile) {
                showToast('Tile not found', 'error');
                return;
            }

            this.selectedTile = tile;
            this.renderTileDetails();
            this.calculateRequirements();
        } catch (error) {
            console.error('Error fetching tile:', error);
            showToast('Error fetching tile details', 'error');
        }
    }

    renderTileDetails() {
        const tileDetailsSection = document.getElementById('tileDetailsSection');
        const tileCard = document.getElementById('tileCard');
        
        if (!tileDetailsSection || !tileCard) return;

        const tile = this.selectedTile;

        tileCard.innerHTML = `
            <div class="tile-image-placeholder" style="width: 200px; height: 150px; background: #f3f4f6; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; color: #6b7280;">
                No Image
            </div>
            <div class="tile-info">
                <h3>${tile.name}</h3>
                <div class="tile-code">Code: ${tile.code}</div>
                <div class="tile-specs">
                    <div class="spec-item">
                        <div class="spec-label">Size</div>
                        <div class="spec-value">${tile.length_feet}' × ${tile.width_feet}'</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Price per Tile</div>
                        <div class="spec-value">$${tile.price_per_tile}</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Coverage per Box</div>
                        <div class="spec-value">${tile.coverage_per_box} tiles</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Price per Sq Ft</div>
                        <div class="spec-value">$${tile.price_per_square_feet.toFixed(2)}</div>
                    </div>
                    ${tile.discount_percent > 0 ? `
                        <div class="spec-item">
                            <div class="spec-label">Discount</div>
                            <div class="spec-value">${tile.discount_percent}%</div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        tileDetailsSection.style.display = 'block';
    }

    calculateRequirements() {
        const tile = this.selectedTile;
        const totalArea = this.rooms.reduce((sum, room) => sum + room.totalArea, 0);

        // Calculate tile area
        const tileArea = tile.length_feet * tile.width_feet;
        
        // Calculate required tiles (add 10% wastage)
        const baseTiles = Math.ceil(totalArea / tileArea);
        const tilesWithWastage = Math.ceil(baseTiles * 1.1);
        
        // Calculate boxes needed
        const boxesNeeded = Math.ceil(tilesWithWastage / tile.coverage_per_box);
        
        // Calculate costs
        const baseCost = tilesWithWastage * tile.price_per_tile;
        const discountAmount = baseCost * (tile.discount_percent / 100);
        const finalCost = baseCost - discountAmount;

        this.calculations = {
            totalArea,
            tilesNeeded: tilesWithWastage,
            boxesNeeded,
            baseCost,
            discountAmount,
            finalCost
        };

        this.renderCalculations();
    }

    renderCalculations() {
        const calculationsSection = document.getElementById('calculationsSection');
        const calculationsGrid = document.getElementById('calculationsGrid');

        if (!calculationsSection || !calculationsGrid) return;

        const calc = this.calculations;

        calculationsGrid.innerHTML = `
            <div class="calculation-item">
                <div class="calculation-label">Total Area</div>
                <div class="calculation-value">${calc.totalArea.toFixed(2)} sq ft</div>
            </div>
            <div class="calculation-item">
                <div class="calculation-label">Tiles Needed</div>
                <div class="calculation-value">${calc.tilesNeeded}</div>
            </div>
            <div class="calculation-item">
                <div class="calculation-label">Boxes Needed</div>
                <div class="calculation-value">${calc.boxesNeeded}</div>
            </div>
            <div class="calculation-item">
                <div class="calculation-label">Base Cost</div>
                <div class="calculation-value">$${calc.baseCost.toFixed(2)}</div>
            </div>
            ${calc.discountAmount > 0 ? `
                <div class="calculation-item">
                    <div class="calculation-label">Discount</div>
                    <div class="calculation-value">-$${calc.discountAmount.toFixed(2)}</div>
                </div>
            ` : ''}
            <div class="calculation-item">
                <div class="calculation-label">Final Cost</div>
                <div class="calculation-value cost">$${calc.finalCost.toFixed(2)}</div>
            </div>
        `;

        calculationsSection.style.display = 'block';
        
        // Enable confirm button
        const confirmBtn = document.getElementById('confirmBtn');
        if (confirmBtn) {
            confirmBtn.disabled = false;
        }
    }

    confirmTileSelection() {
        if (!this.selectedTile || !this.calculations) {
            showToast('Please select a tile first', 'error');
            return;
        }

        // Save tile selection to localStorage
        const tileSelection = {
            tile: this.selectedTile,
            calculations: this.calculations,
            rooms: this.rooms
        };

        localStorage.setItem('tileHavenTileSelection', JSON.stringify(tileSelection));
        
        showToast('Tile selection confirmed!', 'success');
        
        // Proceed to final actions
        setTimeout(() => {
            window.location.href = 'final-actions.html';
        }, 1000);
    }
}

// Global functions
function goBack() {
    window.location.href = 'room-measuring.html';
}

function fetchTileDetails() {
    tileSelection.fetchTileDetails();
}

function confirmTileSelection() {
    tileSelection.confirmTileSelection();
}

// Initialize tile selection
let tileSelection;
document.addEventListener('DOMContentLoaded', function() {
    tileSelection = new TileSelection();
});
