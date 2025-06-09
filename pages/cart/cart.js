
// Cart Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    renderCart();
    
    const startMeasuringFromCart = document.getElementById('startMeasuringFromCart');
    if (startMeasuringFromCart) {
        startMeasuringFromCart.addEventListener('click', function() {
            app.navigateTo('../measuring/measuring.html');
        });
    }
});

function renderCart() {
    const cartContent = document.getElementById('cartContent');
    const emptyCart = document.getElementById('emptyCart');
    
    if (app.cart.length === 0) {
        cartContent.style.display = 'none';
        emptyCart.style.display = 'block';
    } else {
        cartContent.style.display = 'grid';
        emptyCart.style.display = 'none';
        
        cartContent.innerHTML = app.cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>${item.description || 'Premium tile selection'}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="btn-remove" onclick="removeCartItem(${index})">Remove</button>
                </div>
            </div>
        `).join('');
    }
}

function removeCartItem(index) {
    app.removeFromCart(index);
    renderCart();
}
