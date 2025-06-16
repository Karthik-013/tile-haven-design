// Tile Selection Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const roomId = app.getUrlParameter('room');
    const room = app.getRoom(parseInt(roomId));
    
    if (room) {
        document.getElementById('roomName').textContent = room.name;
    }
    
    const qrMethod = document.getElementById('qrMethod');
    const manualMethod = document.getElementById('manualMethod');
    const manualEntry = document.getElementById('manualEntry');
    const tileForm = document.getElementById('tileForm');
    const cancelEntry = document.getElementById('cancelEntry');
    
    // Add subtle animations
    setTimeout(() => {
        document.querySelector('.selection-methods').style.opacity = '1';
        document.querySelector('.selection-methods').style.transform = 'translateY(0)';
    }, 300);
    
    qrMethod.addEventListener('click', function() {
        showComingSoonAlert();
    });
    
    manualMethod.addEventListener('click', function() {
        showManualEntry();
    });
    
    cancelEntry.addEventListener('click', function() {
        hideManualEntry();
    });
    
    tileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        fetchTileDetailsAndCalculate();
    });
    
    // Auto-format tile code as user types
    const tileCodeInput = document.getElementById('tileCode');
    tileCodeInput.addEventListener('input', function(e) {
        let value = e.target.value.toUpperCase();
        // Remove any non-alphanumeric characters except hyphens
        value = value.replace(/[^A-Z0-9-]/g, '');
        e.target.value = value;
    });
});

// Convert different units to feet
function convertToFeet(value, unit) {
    const numValue = parseFloat(value);
    switch(unit.toLowerCase()) {
        case 'inches':
        case 'in':
            return numValue / 12;
        case 'metres':
        case 'meters':
        case 'm':
            return numValue * 3.28084;
        case 'feet':
        case 'ft':
        case 'foot':
        default:
            return numValue;
    }
}

// Calculate room area in square feet
function calculateRoomAreaInFeet(room) {
    const length = convertToFeet(room.length, room.unit);
    const width = convertToFeet(room.width, room.unit);
    return length * width;
}

// Fetch tile details from Supabase and calculate requirements
async function fetchTileDetailsAndCalculate() {
    const tileCode = document.getElementById('tileCode').value.trim();
    const roomId = app.getUrlParameter('room');
    const room = app.getRoom(parseInt(roomId));
    
    if (!tileCode) {
        showError('Please enter a tile code');
        return;
    }
    
    if (!room) {
        showError('Room information not found');
        return;
    }
    
    try {
        // Show loading state
        showLoadingState();
        
        // Import Supabase client
        const { supabase } = await import('../../src/integrations/supabase/client.js');
        
        // Fetch tile details from database
        const { data: tileData, error } = await supabase
            .from('tiles')
            .select('*')
            .eq('code', tileCode)
            .single();
        
        if (error) {
            if (error.code === 'PGRST116') {
                showError(`Tile code "${tileCode}" not found in our catalog`);
            } else {
                showError('Error fetching tile details. Please try again.');
                console.error('Supabase error:', error);
            }
            hideLoadingState();
            return;
        }
        
        // Calculate requirements
        const roomAreaInFeet = calculateRoomAreaInFeet(room);
        const tileAreaInFeet = tileData.length_feet * tileData.width_feet;
        const tilesNeeded = Math.ceil(roomAreaInFeet / tileAreaInFeet);
        const boxesNeeded = Math.ceil(tilesNeeded / tileData.coverage_per_box);
        
        // Calculate costs
        const totalTilesInBoxes = boxesNeeded * tileData.coverage_per_box;
        const subtotal = totalTilesInBoxes * tileData.price_per_tile;
        const discountAmount = subtotal * (tileData.discount_percent / 100);
        const totalCost = subtotal - discountAmount;
        
        // Create detailed tile data for cart
        const detailedTileData = {
            code: tileData.code,
            name: tileData.name,
            roomId: roomId,
            roomName: room.name,
            roomArea: roomAreaInFeet.toFixed(2),
            roomUnit: 'sq ft',
            tileLength: tileData.length_feet,
            tileWidth: tileData.width_feet,
            tileArea: tileAreaInFeet.toFixed(2),
            tilesNeeded: tilesNeeded,
            boxesNeeded: boxesNeeded,
            tilesPerBox: tileData.coverage_per_box,
            totalTiles: totalTilesInBoxes,
            pricePerTile: tileData.price_per_tile,
            pricePerSqFt: tileData.price_per_square_feet,
            discountPercent: tileData.discount_percent,
            subtotal: subtotal.toFixed(2),
            discountAmount: discountAmount.toFixed(2),
            totalCost: totalCost.toFixed(2),
            addedAt: new Date().toISOString()
        };
        
        // Hide loading and show results
        hideLoadingState();
        showTileDetails(detailedTileData);
        
    } catch (error) {
        console.error('Error:', error);
        showError('Failed to fetch tile details. Please check your connection and try again.');
        hideLoadingState();
    }
}

function showLoadingState() {
    const submitBtn = document.querySelector('.btn-primary');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Loading...</span>';
}

function hideLoadingState() {
    const submitBtn = document.querySelector('.btn-primary');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Add to Cart</span><span class="btn-icon">✓</span>';
}

function showTileDetails(tileData) {
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
                <button class="btn btn-primary" onclick="addCalculatedTileToCart('${btoa(JSON.stringify(tileData))}')">
                    <span>Add to Cart</span>
                    <span class="btn-icon">🛒</span>
                </button>
                <button class="btn btn-outline" onclick="resetForm()">
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

function addCalculatedTileToCart(encodedData) {
    try {
        const tileData = JSON.parse(atob(encodedData));
        app.addToCart(tileData);
        
        showSuccessMessage(`${tileData.name} (${tileData.boxesNeeded} boxes) added to cart successfully!`);
        
        setTimeout(() => {
            app.navigateTo('../cart/cart.html');
        }, 2000);
    } catch (error) {
        console.error('Error adding to cart:', error);
        showError('Failed to add tile to cart');
    }
}

function resetForm() {
    document.getElementById('tileForm').style.display = 'block';
    document.getElementById('tileForm').reset();
    const existingDetails = document.querySelector('.tile-details');
    if (existingDetails) {
        existingDetails.remove();
    }
    document.getElementById('tileCode').focus();
}

function showComingSoonAlert() {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'coming-soon-alert';
    alertDiv.innerHTML = `
        <div class="alert-content">
            <h3>🚀 Coming Soon!</h3>
            <p>QR Code scanning feature is under development. Please use manual entry for now.</p>
            <button onclick="this.parentElement.parentElement.remove()" class="btn btn-primary">Got it!</button>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .coming-soon-alert {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }
        .alert-content {
            background: white;
            padding: 2rem;
            border-radius: 16px;
            text-align: center;
            max-width: 400px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.3s ease;
        }
        .alert-content h3 {
            color: var(--deep-forest);
            margin-bottom: 1rem;
            font-size: 1.5rem;
        }
        .alert-content p {
            color: var(--earth-brown);
            margin-bottom: 1.5rem;
            line-height: 1.6;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(alertDiv);
}

function showManualEntry() {
    const selectionMethods = document.querySelector('.selection-methods');
    const manualEntry = document.getElementById('manualEntry');
    
    selectionMethods.style.transform = 'translateY(-20px)';
    selectionMethods.style.opacity = '0';
    
    setTimeout(() => {
        selectionMethods.style.display = 'none';
        manualEntry.style.display = 'block';
        manualEntry.style.opacity = '0';
        manualEntry.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            manualEntry.style.opacity = '1';
            manualEntry.style.transform = 'translateY(0)';
            document.getElementById('tileCode').focus();
        }, 50);
    }, 300);
}

function hideManualEntry() {
    const selectionMethods = document.querySelector('.selection-methods');
    const manualEntry = document.getElementById('manualEntry');
    const tileForm = document.getElementById('tileForm');
    
    manualEntry.style.transform = 'translateY(20px)';
    manualEntry.style.opacity = '0';
    
    setTimeout(() => {
        manualEntry.style.display = 'none';
        selectionMethods.style.display = 'grid';
        selectionMethods.style.opacity = '0';
        selectionMethods.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            selectionMethods.style.opacity = '1';
            selectionMethods.style.transform = 'translateY(0)';
        }, 50);
        
        tileForm.reset();
        tileForm.style.display = 'block';
        const existingDetails = document.querySelector('.tile-details');
        if (existingDetails) {
            existingDetails.remove();
        }
    }, 300);
}

function showSuccessMessage(message) {
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

function showError(message) {
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
