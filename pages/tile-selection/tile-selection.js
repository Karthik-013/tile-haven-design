
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
    
    qrMethod.addEventListener('click', function() {
        alert('QR Code scanning feature coming soon! Please use manual entry for now.');
    });
    
    manualMethod.addEventListener('click', function() {
        document.querySelector('.selection-methods').style.display = 'none';
        manualEntry.style.display = 'block';
    });
    
    cancelEntry.addEventListener('click', function() {
        document.querySelector('.selection-methods').style.display = 'grid';
        manualEntry.style.display = 'none';
        tileForm.reset();
    });
    
    tileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addTileToCart();
    });
});

function addTileToCart() {
    const roomId = app.getUrlParameter('room');
    const room = app.getRoom(parseInt(roomId));
    
    const tileData = {
        code: document.getElementById('tileCode').value,
        name: document.getElementById('tileName').value,
        roomId: roomId,
        roomName: room ? room.name : 'Unknown Room',
        area: room ? room.area : 0,
        unit: room ? room.unit : 'sq units'
    };
    
    app.addToCart(tileData);
    
    showSuccessMessage('Tile added to cart successfully!');
    
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
    successMessage.textContent = message;
    
    const container = document.querySelector('.manual-entry');
    container.insertBefore(successMessage, container.firstChild);
}
