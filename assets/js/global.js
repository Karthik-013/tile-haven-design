
// Global JavaScript Functions
class TileHavenApp {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('tileHavenCart')) || [];
        this.rooms = JSON.parse(localStorage.getItem('tileHavenRooms')) || [];
        this.updateCartCount();
    }

    // Cart Management
    updateCartCount() {
        const cartCountElement = document.getElementById('cartCount');
        if (cartCountElement) {
            cartCountElement.textContent = this.cart.length;
        }
    }

    addToCart(item) {
        this.cart.push(item);
        this.saveCart();
        this.updateCartCount();
    }

    removeFromCart(index) {
        this.cart.splice(index, 1);
        this.saveCart();
        this.updateCartCount();
    }

    saveCart() {
        localStorage.setItem('tileHavenCart', JSON.stringify(this.cart));
    }

    // Room Management
    addRoom(room) {
        room.id = Date.now();
        this.rooms.push(room);
        this.saveRooms();
    }

    updateRoom(roomId, updatedRoom) {
        const index = this.rooms.findIndex(room => room.id === roomId);
        if (index !== -1) {
            this.rooms[index] = { ...this.rooms[index], ...updatedRoom };
            this.saveRooms();
        }
    }

    removeRoom(roomId) {
        this.rooms = this.rooms.filter(room => room.id !== roomId);
        this.saveRooms();
    }

    getRoom(roomId) {
        return this.rooms.find(room => room.id === roomId);
    }

    saveRooms() {
        localStorage.setItem('tileHavenRooms', JSON.stringify(this.rooms));
    }

    // Navigation
    navigateTo(page) {
        window.location.href = page;
    }

    // URL Parameters
    getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    setUrlParameter(name, value) {
        const url = new URL(window.location);
        url.searchParams.set(name, value);
        window.history.replaceState({}, '', url);
    }
}

// Initialize global app instance
const app = new TileHavenApp();

// Common event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Cart button functionality
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function() {
            app.navigateTo('pages/cart/cart.html');
        });
    }
});
