
// Room List Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    renderRooms();
    
    const addNewRoom = document.getElementById('addNewRoom');
    const addFirstRoom = document.getElementById('addFirstRoom');
    
    if (addNewRoom) {
        addNewRoom.addEventListener('click', function() {
            app.navigateTo('../room-details/room-details.html');
        });
    }
    
    if (addFirstRoom) {
        addFirstRoom.addEventListener('click', function() {
            app.navigateTo('../room-details/room-details.html');
        });
    }
});

function renderRooms() {
    const roomsList = document.getElementById('roomsList');
    const emptyRooms = document.getElementById('emptyRooms');
    
    if (app.rooms.length === 0) {
        roomsList.style.display = 'none';
        emptyRooms.style.display = 'block';
    } else {
        roomsList.style.display = 'grid';
        emptyRooms.style.display = 'none';
        
        roomsList.innerHTML = app.rooms.map(room => `
            <div class="room-card">
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
    }
}

function editRoom(roomId) {
    app.navigateTo(`../room-details/room-details.html?edit=${roomId}`);
}

function removeRoom(roomId) {
    if (confirm('Are you sure you want to remove this room?')) {
        app.removeRoom(roomId);
        renderRooms();
    }
}

function selectTiles(roomId) {
    app.navigateTo(`../tile-selection/tile-selection.html?room=${roomId}`);
}
