
// Global JavaScript Functions
class TileHavenApp {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('tileHavenCart')) || [];
        this.rooms = JSON.parse(localStorage.getItem('tileHavenRooms')) || [];
        this.updateCartCount();
        console.log('TileHavenApp initialized with', this.cart.length, 'cart items and', this.rooms.length, 'rooms');
    }

    // Cart Management
    updateCartCount() {
        const cartCountElement = document.getElementById('cartCount');
        if (cartCountElement) {
            cartCountElement.textContent = this.cart.length;
        }
    }

    addToCart(item) {
        console.log('Adding item to cart:', item);
        this.cart.push(item);
        this.saveCart();
        this.updateCartCount();
    }

    removeFromCart(index) {
        console.log('Removing item from cart at index:', index);
        this.cart.splice(index, 1);
        this.saveCart();
        this.updateCartCount();
    }

    saveCart() {
        localStorage.setItem('tileHavenCart', JSON.stringify(this.cart));
        console.log('Cart saved to localStorage');
    }

    // Room Management
    addRoom(room) {
        room.id = Date.now();
        console.log('Adding room:', room);
        this.rooms.push(room);
        this.saveRooms();
    }

    updateRoom(roomId, updatedRoom) {
        const index = this.rooms.findIndex(room => room.id === roomId);
        if (index !== -1) {
            console.log('Updating room:', roomId, updatedRoom);
            this.rooms[index] = { ...this.rooms[index], ...updatedRoom };
            this.saveRooms();
        }
    }

    removeRoom(roomId) {
        console.log('Removing room:', roomId);
        this.rooms = this.rooms.filter(room => room.id !== roomId);
        this.saveRooms();
    }

    getRoom(roomId) {
        const room = this.rooms.find(room => room.id === roomId);
        console.log('Getting room:', roomId, room);
        return room;
    }

    saveRooms() {
        localStorage.setItem('tileHavenRooms', JSON.stringify(this.rooms));
        console.log('Rooms saved to localStorage');
    }

    // Navigation
    navigateTo(page) {
        console.log('Navigating to:', page);
        window.location.href = page;
    }

    // URL Parameters
    getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        const value = urlParams.get(name);
        console.log('Getting URL parameter:', name, '=', value);
        return value;
    }

    setUrlParameter(name, value) {
        const url = new URL(window.location);
        url.searchParams.set(name, value);
        window.history.replaceState({}, '', url);
        console.log('Set URL parameter:', name, '=', value);
    }
}

// Initialize global app instance
const app = new TileHavenApp();

// Common event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('Global DOM loaded, setting up cart button');
    
    // Cart button functionality
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function() {
            console.log('Cart button clicked');
            app.navigateTo('pages/cart/cart.html');
        });
    }

    // Logo click functionality for all pages
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function() {
            console.log('Logo clicked');
            const currentPath = window.location.pathname;
            if (currentPath.includes('/pages/')) {
                app.navigateTo('../../index.html');
            } else {
                app.navigateTo('index.html');
            }
        });
        logo.style.cursor = 'pointer';
    }
});
