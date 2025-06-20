
// Final Actions JavaScript
class FinalActions {
    constructor() {
        this.customerDetails = null;
        this.rooms = [];
        this.tileSelection = null;
        this.isSaved = false;
        this.init();
    }

    init() {
        console.log('Final Actions initialized');
        this.loadData();
        this.renderSummary();
    }

    loadData() {
        // Load customer details
        const customerData = localStorage.getItem('customerDetails');
        if (!customerData) {
            window.location.href = 'customer-form.html';
            return;
        }
        this.customerDetails = JSON.parse(customerData);

        // Load tile selection
        const tileData = localStorage.getItem('tileHavenTileSelection');
        if (!tileData) {
            window.location.href = 'tile-selection.html';
            return;
        }
        this.tileSelection = JSON.parse(tileData);
        this.rooms = this.tileSelection.rooms;

        // Display customer info in header
        const customerInfo = document.getElementById('customerInfo');
        if (customerInfo) {
            customerInfo.innerHTML = `
                <strong>${this.customerDetails.name}</strong> | ${this.customerDetails.phone}
            `;
        }
    }

    renderSummary() {
        this.renderCustomerSummary();
        this.renderRoomsSummary();
        this.renderTileSummary();
        this.renderCostSummary();
    }

    renderCustomerSummary() {
        const customerSummary = document.getElementById('customerSummary');
        if (!customerSummary) return;

        customerSummary.innerHTML = `
            <div class="customer-detail">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${this.customerDetails.name}</span>
            </div>
            <div class="customer-detail">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${this.customerDetails.phone}</span>
            </div>
            <div class="customer-detail">
                <span class="detail-label">Address:</span>
                <span class="detail-value">${this.customerDetails.address}</span>
            </div>
        `;
    }

    renderRoomsSummary() {
        const roomsSummary = document.getElementById('roomsSummary');
        if (!roomsSummary) return;

        roomsSummary.innerHTML = `
            <div class="rooms-list">
                ${this.rooms.map(room => `
                    <div class="room-summary">
                        <div class="room-summary-header">
                            <span class="room-name">${room.name}</span>
                            <span class="room-area">${room.totalArea.toFixed(2)} sq ft</span>
                        </div>
                        <div class="room-dimensions">
                            ${this.formatRoomDimensions(room)}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="room-detail">
                <span class="detail-label">Total Area:</span>
                <span class="detail-value">${this.tileSelection.calculations.totalArea.toFixed(2)} sq ft</span>
            </div>
        `;
    }

    formatRoomDimensions(room) {
        if (room.type === 'standard') {
            const dim = room.dimensions[0];
            return `${dim.length}' × ${dim.width}' (${room.unit})`;
        } else {
            return room.dimensions.map(dim => `${dim.length}' × ${dim.width}'`).join(' + ') + ` (${room.unit})`;
        }
    }

    renderTileSummary() {
        const tileSummary = document.getElementById('tileSummary');
        if (!tileSummary) return;

        const tile = this.tileSelection.tile;
        const calc = this.tileSelection.calculations;

        tileSummary.innerHTML = `
            <div class="tile-image-container">
                <div class="tile-image-placeholder" style="width: 100px; height: 100px; background: #f3f4f6; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; color: #6b7280; font-size: 0.75rem;">
                    No Image
                </div>
                <div class="tile-info">
                    <div class="tile-name">${tile.name}</div>
                    <div class="tile-code-display">Code: ${tile.code}</div>
                </div>
            </div>
            <div class="calculations-summary">
                <div class="calc-item">
                    <div class="calc-label">Size</div>
                    <div class="calc-value">${tile.length_feet}' × ${tile.width_feet}'</div>
                </div>
                <div class="calc-item">
                    <div class="calc-label">Tiles Needed</div>
                    <div class="calc-value">${calc.tilesNeeded}</div>
                </div>
                <div class="calc-item">
                    <div class="calc-label">Boxes Needed</div>
                    <div class="calc-value">${calc.boxesNeeded}</div>
                </div>
                <div class="calc-item">
                    <div class="calc-label">Price per Tile</div>
                    <div class="calc-value">$${tile.price_per_tile}</div>
                </div>
            </div>
        `;
    }

    renderCostSummary() {
        const costSummary = document.getElementById('costSummary');
        if (!costSummary) return;

        const calc = this.tileSelection.calculations;

        costSummary.innerHTML = `
            <div class="tile-detail">
                <span class="detail-label">Base Cost:</span>
                <span class="detail-value">$${calc.baseCost.toFixed(2)}</span>
            </div>
            ${calc.discountAmount > 0 ? `
                <div class="tile-detail">
                    <span class="detail-label">Discount:</span>
                    <span class="detail-value">-$${calc.discountAmount.toFixed(2)}</span>
                </div>
            ` : ''}
            <div class="total-cost-display">
                $${calc.finalCost.toFixed(2)}
            </div>
        `;
    }

    async saveQuotation() {
        const saveBtn = document.getElementById('saveBtn');
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';

        try {
            const currentWorker = localStorage.getItem('currentWorker') || 'Unknown Worker';
            
            const customerData = {
                name: this.customerDetails.name,
                mobile: this.customerDetails.phone,
                address: this.customerDetails.address,
                attended_by: currentWorker,
                status: 'Pending',
                room_data: this.rooms,
                tile_data: this.tileSelection.tile,
                cost_data: this.tileSelection.calculations
            };

            const { data, error } = await supabase
                .from('customers')
                .insert([customerData])
                .select();

            if (error) {
                throw error;
            }

            this.isSaved = true;
            
            // Enable PDF button
            const pdfBtn = document.getElementById('pdfBtn');
            if (pdfBtn) {
                pdfBtn.disabled = false;
            }

            saveBtn.textContent = 'Saved';
            showToast('Quotation saved successfully!', 'success');

        } catch (error) {
            console.error('Error saving quotation:', error);
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save';
            showToast('Error saving quotation: ' + error.message, 'error');
        }
    }

    async generatePDF() {
        if (!this.isSaved) {
            showToast('Please save the quotation first', 'error');
            return;
        }

        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Header
            doc.setFontSize(20);
            doc.text('Tile Haven', 105, 20, { align: 'center' });
            doc.setFontSize(16);
            doc.text('Quotation', 105, 30, { align: 'center' });

            // Customer Details
            doc.setFontSize(14);
            doc.text('Customer Details:', 20, 50);
            doc.setFontSize(12);
            doc.text(`Name: ${this.customerDetails.name}`, 20, 60);
            doc.text(`Phone: ${this.customerDetails.phone}`, 20, 70);
            doc.text(`Address: ${this.customerDetails.address}`, 20, 80);

            // Room Details
            doc.setFontSize(14);
            doc.text('Room Measurements:', 20, 100);
            doc.setFontSize(12);
            let yPos = 110;
            this.rooms.forEach(room => {
                doc.text(`${room.name}: ${room.totalArea.toFixed(2)} sq ft`, 20, yPos);
                yPos += 10;
            });

            // Tile Details
            yPos += 10;
            doc.setFontSize(14);
            doc.text('Tile Selection:', 20, yPos);
            yPos += 10;
            doc.setFontSize(12);
            const tile = this.tileSelection.tile;
            const calc = this.tileSelection.calculations;
            
            doc.text(`Tile: ${tile.name} (${tile.code})`, 20, yPos);
            yPos += 10;
            doc.text(`Size: ${tile.length_feet}' × ${tile.width_feet}'`, 20, yPos);
            yPos += 10;
            doc.text(`Tiles Needed: ${calc.tilesNeeded}`, 20, yPos);
            yPos += 10;
            doc.text(`Boxes Needed: ${calc.boxesNeeded}`, 20, yPos);
            yPos += 20;

            // Cost Summary
            doc.setFontSize(14);
            doc.text('Cost Summary:', 20, yPos);
            yPos += 10;
            doc.setFontSize(12);
            doc.text(`Base Cost: $${calc.baseCost.toFixed(2)}`, 20, yPos);
            yPos += 10;
            if (calc.discountAmount > 0) {
                doc.text(`Discount: -$${calc.discountAmount.toFixed(2)}`, 20, yPos);
                yPos += 10;
            }
            doc.setFontSize(16);
            doc.text(`Total: $${calc.finalCost.toFixed(2)}`, 20, yPos);

            // Footer
            doc.setFontSize(10);
            doc.text('Thank you for choosing Tile Haven!', 105, 280, { align: 'center' });

            // Save the PDF
            const pdfBlob = doc.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);
            
            // Download the PDF
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = `TileHaven_Quotation_${this.customerDetails.name.replace(/\s+/g, '_')}.pdf`;
            link.click();

            // Simulate SMS sending
            this.simulateSMSSending();

            showToast('Quotation PDF generated and downloaded!', 'success');

        } catch (error) {
            console.error('Error generating PDF:', error);
            showToast('Error generating PDF', 'error');
        }
    }

    simulateSMSSending() {
        setTimeout(() => {
            showToast(`SMS sent to ${this.customerDetails.phone}: "Your tile quotation from Tile Haven is ready. Total cost: $${this.tileSelection.calculations.finalCost.toFixed(2)}. Thank you!"`, 'success');
        }, 1000);
    }

    editQuotation() {
        window.location.href = 'room-measuring.html';
    }

    exitToNewEntry() {
        // Clear all localStorage data
        localStorage.removeItem('customerDetails');
        localStorage.removeItem('tileHavenRooms');
        localStorage.removeItem('tileHavenTileSelection');
        
        // Redirect to customer form
        window.location.href = 'customer-form.html';
    }
}

// Global functions
function editQuotation() {
    finalActions.editQuotation();
}

function saveQuotation() {
    finalActions.saveQuotation();
}

function generatePDF() {
    finalActions.generatePDF();
}

function exitToNewEntry() {
    finalActions.exitToNewEntry();
}

// Initialize final actions
let finalActions;
document.addEventListener('DOMContentLoaded', function() {
    finalActions = new FinalActions();
});
