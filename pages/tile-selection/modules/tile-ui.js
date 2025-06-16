
// UI management utilities
export class TileUI {
    static showLoadingState() {
        const submitBtn = document.querySelector('.btn-primary');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Loading...</span>';
    }

    static hideLoadingState() {
        const submitBtn = document.querySelector('.btn-primary');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Add to Cart</span><span class="btn-icon">✓</span>';
    }

    static showTileDetails(tileData) {
        // Remove existing details if any
        const existingDetails = document.querySelector('.tile-details');
        if (existingDetails) {
            existingDetails.remove();
        }
        
        const detailsHTML = `
            <div class="tile-details">
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
                    <button class="btn btn-primary" onclick="window.tileSelection.addCalculatedTileToCart('${btoa(JSON.stringify(tileData))}')">
                        <span>Add to Cart</span>
                        <span class="btn-icon">🛒</span>
                    </button>
                    <button class="btn btn-outline" onclick="window.tileSelection.resetForm()">
                        <span>Try Another Code</span>
                    </button>
                </div>
            </div>
        `;
        
        const manualEntry = document.getElementById('manualEntry');
        manualEntry.insertAdjacentHTML('beforeend', detailsHTML);
        
        // Hide the original form
        document.getElementById('tileForm').style.display = 'none';
    }

    static showSuccessMessage(message) {
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
        
        const container = document.querySelector('.manual-entry');
        container.insertBefore(successMessage, container.firstChild);
    }

    static showError(message) {
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

    static resetForm() {
        document.getElementById('tileForm').style.display = 'block';
        document.getElementById('tileForm').reset();
        const existingDetails = document.querySelector('.tile-details');
        if (existingDetails) {
            existingDetails.remove();
        }
        document.getElementById('tileCode').focus();
    }
}
