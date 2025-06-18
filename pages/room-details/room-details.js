
// Room Details Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const roomForm = document.getElementById('roomForm');
    const roomActions = document.getElementById('roomActions');
    const addAnotherRoom = document.getElementById('addAnotherRoom');
    const pageTitle = document.getElementById('pageTitle');
    
    // Check if we're editing an existing room
    const editRoomId = app.getUrlParameter('edit');
    if (editRoomId) {
        loadRoomForEdit(editRoomId);
        pageTitle.textContent = 'Edit Room Details';
    }
    
    roomForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveRoom();
    });
    
    if (addAnotherRoom) {
        addAnotherRoom.addEventListener('click', function() {
            resetForm();
            roomForm.style.display = 'block';
            roomActions.style.display = 'none';
            pageTitle.textContent = 'Add Room Details';
        });
    }
});

function loadRoomForEdit(roomId) {
    const room = app.getRoom(parseInt(roomId));
    if (room) {
        document.getElementById('roomName').value = room.name;
        document.getElementById('measurementUnit').value = room.unit;
        document.getElementById('roomLength').value = room.length;
        document.getElementById('roomBreadth').value = room.breadth;
    }
}

function saveRoom() {
    const roomData = {
        name: document.getElementById('roomName').value,
        unit: document.getElementById('measurementUnit').value,
        length: parseFloat(document.getElementById('roomLength').value),
        breadth: parseFloat(document.getElementById('roomBreadth').value)
    };
    
    // Calculate area
    roomData.area = roomData.length * roomData.breadth;
    
    const editRoomId = app.getUrlParameter('edit');
    if (editRoomId) {
        // Update existing room
        app.updateRoom(parseInt(editRoomId), roomData);
        showSuccessMessage('Room updated successfully!');
    } else {
        // Add new room
        app.addRoom(roomData);
        showSuccessMessage('Room added successfully!');
    }
    
    // Hide form and show actions
    document.getElementById('roomForm').style.display = 'none';
    document.getElementById('roomActions').style.display = 'flex';
}

function showSuccessMessage(message) {
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = message;
    
    const container = document.querySelector('.room-form-container');
    container.insertBefore(successMessage, container.firstChild);
}

function resetForm() {
    document.getElementById('roomForm').reset();
    const successMessage = document.querySelector('.success-message');
    if (successMessage) {
        successMessage.remove();
    }
    
    // Clear URL parameters
    window.history.replaceState({}, '', window.location.pathname);
}
