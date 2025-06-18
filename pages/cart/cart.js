
// Cart Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cart page loaded, rendering cart');
    renderCart();
    
    const startMeasuringFromCart = document.getElementById('startMeasuringFromCart');
    if (startMeasuringFromCart) {
        startMeasuringFromCart.addEventListener('click', function() {
            console.log('Start measuring from cart clicked');
            app.navigateTo('../measuring/measuring.html');
        });
    }
});

function renderCart() {
    const cartContent = document.getElementById('cartContent');
    const emptyCart = document.getElementById('emptyCart');
    
    console.log('Rendering cart with', app.cart.length, 'items');
    
    if (app.cart.length === 0) {
        cartContent.style.display = 'none';
        emptyCart.style.display = 'block';
    } else {
        cartContent.style.display = 'grid';
        emptyCart.style.display = 'none';
        
        cartContent.innerHTML = app.cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h3>${item.name || 'Tile Item'}</h3>
                    <p><strong>Room:</strong> ${item.roomName || 'Unknown Room'}</p>
                    <p><strong>Boxes:</strong> ${item.boxesNeeded || 1}</p>
                    <p><strong>Total Cost:</strong> $${item.totalCost || item.price || '0.00'}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="btn-remove" onclick="removeCartItem(${index})">Remove</button>
                </div>
            </div>
        `).join('');
    }
}

function removeCartItem(index) {
    console.log('Removing cart item at index', index);
    app.removeFromCart(index);
    renderCart();
}
