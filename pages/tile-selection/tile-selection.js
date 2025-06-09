
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
        addTileToCart();
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
    }, 300);
}

function addTileToCart() {
    const roomId = app.getUrlParameter('room');
    const room = app.getRoom(parseInt(roomId));
    const tileCode = document.getElementById('tileCode').value.trim();
    
    if (!tileCode) {
        showError('Please enter a tile code');
        return;
    }
    
    const tileData = {
        code: tileCode,
        name: `Tile ${tileCode}`, // Auto-generate name from code
        roomId: roomId,
        roomName: room ? room.name : 'Unknown Room',
        area: room ? room.area : 0,
        unit: room ? room.unit : 'sq units',
        addedAt: new Date().toISOString()
    };
    
    app.addToCart(tileData);
    
    showSuccessMessage(`Tile ${tileCode} added to cart successfully!`);
    
    setTimeout(() => {
        app.navigateTo('../cart/cart.html');
    }, 2000);
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
