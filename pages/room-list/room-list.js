
// Room List Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    renderRooms();
    initializeAnimations();
    
    const addNewRoom = document.getElementById('addNewRoom');
    const addFirstRoom = document.getElementById('addFirstRoom');
    
    if (addNewRoom) {
        addNewRoom.addEventListener('click', function() {
            animateButtonClick(addNewRoom);
            setTimeout(() => {
                app.navigateTo('../room-details/room-details.html');
            }, 200);
        });
    }
    
    if (addFirstRoom) {
        addFirstRoom.addEventListener('click', function() {
            animateButtonClick(addFirstRoom);
            setTimeout(() => {
                app.navigateTo('../room-details/room-details.html');
            }, 200);
        });
    }
});

function initializeAnimations() {
    // Animate page elements on load
    const pageTitle = document.querySelector('.page-title');
    const roomsList = document.getElementById('roomsList');
    const emptyRooms = document.getElementById('emptyRooms');
    
    if (pageTitle) {
        pageTitle.style.opacity = '0';
        pageTitle.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            pageTitle.style.transition = 'all 0.6s ease';
            pageTitle.style.opacity = '1';
            pageTitle.style.transform = 'translateY(0)';
        }, 200);
    }
    
    const container = roomsList || emptyRooms;
    if (container) {
        container.style.opacity = '0';
        container.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            container.style.transition = 'all 0.8s ease';
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 400);
    }
}

function renderRooms() {
    const roomsList = document.getElementById('roomsList');
    const emptyRooms = document.getElementById('emptyRooms');
    
    if (app.rooms.length === 0) {
        roomsList.style.display = 'none';
        emptyRooms.style.display = 'block';
    } else {
        roomsList.style.display = 'grid';
        emptyRooms.style.display = 'none';
        
        roomsList.innerHTML = app.rooms.map((room, index) => `
            <div class="room-card" data-index="${index}" style="opacity: 0; transform: translateY(20px);">
                <div class="room-card-header">
                    <h3 class="room-name">${room.name}</h3>
                    <span class="room-area">${room.area.toFixed(2)} ${room.unit}²</span>
                </div>
                
                <div class="room-details">
                    <div class="room-detail">
                        <div class="room-detail-label">Length</div>
                        <div class="room-detail-value">${room.length} ${room.unit}</div>
                    </div>
                    <div class="room-detail">
                        <div class="room-detail-label">Breadth</div>
                        <div class="room-detail-value">${room.breadth} ${room.unit}</div>
                    </div>
                    <div class="room-detail">
                        <div class="room-detail-label">Unit</div>
                        <div class="room-detail-value">${room.unit}</div>
                    </div>
                </div>
                
                <div class="room-actions">
                    <button class="btn btn-edit" onclick="editRoom(${room.id})">Edit</button>
                    <button class="btn btn-remove" onclick="removeRoom(${room.id})">Remove</button>
                    <button class="btn btn-select-tiles" onclick="selectTiles(${room.id})">Select Tiles</button>
                </div>
            </div>
        `).join('');
        
        // Animate room cards after they're rendered
        setTimeout(() => {
            animateRoomCards();
        }, 100);
    }
}

function animateRoomCards() {
    const roomCards = document.querySelectorAll('.room-card');
    
    roomCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            
            // Add hover effects
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px) scale(1.02)';
                card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '';
            });
        }, index * 150);
    });
}

function animateButtonClick(button) {
    button.style.transform = 'scale(0.95)';
    button.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    
    setTimeout(() => {
        button.style.transform = 'scale(1)';
        button.style.boxShadow = '';
    }, 150);
}

function editRoom(roomId) {
    const roomCard = document.querySelector(`[data-index]`);
    if (roomCard) {
        roomCard.style.transform = 'scale(0.95)';
        roomCard.style.opacity = '0.7';
    }
    
    setTimeout(() => {
        app.navigateTo(`../room-details/room-details.html?edit=${roomId}`);
    }, 200);
}

function removeRoom(roomId) {
    const roomCard = event.target.closest('.room-card');
    
    if (confirm('Are you sure you want to remove this room?')) {
        // Animate removal
        roomCard.style.transform = 'scale(0.8)';
        roomCard.style.opacity = '0';
        
        setTimeout(() => {
            app.removeRoom(roomId);
            renderRooms();
        }, 300);
    }
}

function selectTiles(roomId) {
    const roomCard = event.target.closest('.room-card');
    
    // Animate selection
    roomCard.style.transform = 'scale(1.05)';
    roomCard.style.boxShadow = '0 10px 30px rgba(74, 124, 89, 0.3)';
    
    setTimeout(() => {
        app.navigateTo(`../tile-selection/tile-selection.html?room=${roomId}`);
    }, 200);
}
