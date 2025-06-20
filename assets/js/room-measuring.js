
// Room Measuring JavaScript
class RoomMeasuring {
    constructor() {
        this.rooms = [];
        this.selectedRooms = new Set();
        this.customDimensions = [];
        this.init();
    }

    init() {
        console.log('Room Measuring initialized');
        this.loadCustomerInfo();
        this.setupEventListeners();
        this.loadExistingRooms();
    }

    loadCustomerInfo() {
        const customerDetails = localStorage.getItem('customerDetails');
        if (!customerDetails) {
            window.location.href = 'customer-form.html';
            return;
        }

        const customer = JSON.parse(customerDetails);
        const customerInfo = document.getElementById('customerInfo');
        if (customerInfo) {
            customerInfo.innerHTML = `
                <strong>${customer.name}</strong> | ${customer.phone}
            `;
        }
    }

    setupEventListeners() {
        // Room type selector
        const roomTypeInputs = document.querySelectorAll('input[name="roomType"]');
        roomTypeInputs.forEach(input => {
            input.addEventListener('change', (e) => this.handleRoomTypeChange(e));
        });

        // Room form submission
        const roomForm = document.getElementById('roomForm');
        if (roomForm) {
            roomForm.addEventListener('submit', (e) => this.handleAddRoom(e));
        }
    }

    handleRoomTypeChange(e) {
        const roomType = e.target.value;
        const dimensionsContainer = document.getElementById('dimensionsContainer');
        
        if (roomType === 'custom') {
            this.showCustomDimensions();
        } else {
            this.showStandardDimensions();
        }
    }

    showStandardDimensions() {
        const dimensionsContainer = document.getElementById('dimensionsContainer');
        dimensionsContainer.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label for="roomLength">Length</label>
                    <input type="number" id="roomLength" step="0.01" required>
                </div>
                <div class="form-group">
                    <label for="roomWidth">Width</label>
                    <input type="number" id="roomWidth" step="0.01" required>
                </div>
                <div class="form-group">
                    <label for="unit">Unit</label>
                    <select id="unit">
                        <option value="feet">Feet</option>
                        <option value="meters">Meters</option>
                    </select>
                </div>
            </div>
        `;
    }

    showCustomDimensions() {
        const dimensionsContainer = document.getElementById('dimensionsContainer');
        dimensionsContainer.innerHTML = `
            <div id="customDimensionsContainer">
                <div class="form-row">
                    <div class="form-group">
                        <label for="customLength1">Length 1</label>
                        <input type="number" id="customLength1" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label for="customWidth1">Width 1</label>
                        <input type="number" id="customWidth1" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label for="unit">Unit</label>
                        <select id="unit">
                            <option value="feet">Feet</option>
                            <option value="meters">Meters</option>
                        </select>
                    </div>
                </div>
                <button type="button" class="btn btn-outline" onclick="roomMeasuring.addCustomDimension()">
                    Add More Dimensions
                </button>
            </div>
        `;
    }

    addCustomDimension() {
        const container = document.getElementById('customDimensionsContainer');
        const dimensionCount = container.querySelectorAll('.form-row').length;
        
        const newDimension = document.createElement('div');
        newDimension.className = 'form-row';
        newDimension.innerHTML = `
            <div class="form-group">
                <label for="customLength${dimensionCount + 1}">Length ${dimensionCount + 1}</label>
                <input type="number" id="customLength${dimensionCount + 1}" step="0.01" required>
            </div>
            <div class="form-group">
                <label for="customWidth${dimensionCount + 1}">Width ${dimensionCount + 1}</label>
                <input type="number" id="customWidth${dimensionCount + 1}" step="0.01" required>
            </div>
            <div class="form-group">
                <button type="button" class="btn btn-red btn-small" onclick="this.parentElement.parentElement.remove()">
                    Remove
                </button>
            </div>
        `;
        
        container.insertBefore(newDimension, container.lastElementChild);
    }

    handleAddRoom(e) {
        e.preventDefault();
        
        const roomName = document.getElementById('roomName').value;
        const roomType = document.querySelector('input[name="roomType"]:checked').value;
        const unit = document.getElementById('unit').value;
        
        let totalArea = 0;
        let dimensions = [];
        
        if (roomType === 'standard') {
            const length = parseFloat(document.getElementById('roomLength').value);
            const width = parseFloat(document.getElementById('roomWidth').value);
            
            dimensions = [{ length, width }];
            totalArea = length * width;
        } else {
            // Custom room - collect all dimensions
            const lengthInputs = document.querySelectorAll('[id^="customLength"]');
            const widthInputs = document.querySelectorAll('[id^="customWidth"]');
            
            for (let i = 0; i < lengthInputs.length; i++) {
                const length = parseFloat(lengthInputs[i].value);
                const width = parseFloat(widthInputs[i].value);
                dimensions.push({ length, width });
                totalArea += length * width;
            }
        }
        
        // Convert to square feet if needed
        if (unit === 'meters') {
            totalArea = totalArea * 10.764; // Convert square meters to square feet
        }
        
        const room = {
            id: Date.now(),
            name: roomName,
            type: roomType,
            dimensions,
            unit,
            totalArea: totalArea,
            selected: true
        };
        
        this.rooms.push(room);
        this.selectedRooms.add(room.id);
        this.saveRoomsToStorage();
        this.renderRooms();
        this.updateTotalArea();
        
        // Reset form
        document.getElementById('roomForm').reset();
        document.querySelector('input[name="roomType"][value="standard"]').checked = true;
        this.showStandardDimensions();
        
        showToast('Room added successfully!', 'success');
    }

    loadExistingRooms() {
        const savedRooms = localStorage.getItem('tileHavenRooms');
        if (savedRooms) {
            this.rooms = JSON.parse(savedRooms);
            this.selectedRooms = new Set(this.rooms.filter(room => room.selected).map(room => room.id));
            this.renderRooms();
            this.updateTotalArea();
        }
    }

    saveRoomsToStorage() {
        // Update selected status
        this.rooms.forEach(room => {
            room.selected = this.selectedRooms.has(room.id);
        });
        localStorage.setItem('tileHavenRooms', JSON.stringify(this.rooms));
    }

    renderRooms() {
        const roomsChecklist = document.getElementById('roomsChecklist');
        if (!roomsChecklist) return;

        if (this.rooms.length === 0) {
            roomsChecklist.innerHTML = '<p class="text-gray-500">No rooms added yet.</p>';
            return;
        }

        roomsChecklist.innerHTML = this.rooms.map(room => `
            <div class="room-item ${room.selected ? 'selected' : ''}" data-room-id="${room.id}">
                <div class="room-item-content">
                    <div class="room-checkbox ${room.selected ? 'checked' : ''}" 
                         onclick="roomMeasuring.toggleRoomSelection(${room.id})"></div>
                    <div class="room-info">
                        <div class="room-name">${room.name}</div>
                        <div class="room-dimensions">
                            ${this.formatDimensions(room)} | ${room.totalArea.toFixed(2)} sq ft
                        </div>
                    </div>
                </div>
                <div class="room-actions">
                    <button class="btn-icon btn-edit" onclick="roomMeasuring.editRoom(${room.id})" title="Edit">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                    </button>
                    <button class="btn-icon btn-delete" onclick="roomMeasuring.deleteRoom(${room.id})" title="Delete">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
    }

    formatDimensions(room) {
        if (room.type === 'standard') {
            const dim = room.dimensions[0];
            return `${dim.length}' × ${dim.width}'`;
        } else {
            return room.dimensions.map(dim => `${dim.length}' × ${dim.width}'`).join(' + ');
        }
    }

    toggleRoomSelection(roomId) {
        if (this.selectedRooms.has(roomId)) {
            this.selectedRooms.delete(roomId);
        } else {
            this.selectedRooms.add(roomId);
        }
        
        this.saveRoomsToStorage();
        this.renderRooms();
        this.updateTotalArea();
        this.updateProceedButton();
    }

    updateTotalArea() {
        const selectedRooms = this.rooms.filter(room => this.selectedRooms.has(room.id));
        const totalArea = selectedRooms.reduce((sum, room) => sum + room.totalArea, 0);
        
        const totalAreaElement = document.getElementById('totalArea');
        if (totalAreaElement) {
            totalAreaElement.textContent = `Total Area: ${totalArea.toFixed(2)} sq ft`;
        }
        
        this.updateProceedButton();
    }

    updateProceedButton() {
        const proceedBtn = document.getElementById('proceedBtn');
        if (proceedBtn) {
            proceedBtn.disabled = this.selectedRooms.size === 0;
        }
    }

    editRoom(roomId) {
        // Implementation for editing rooms
        showToast('Edit functionality will be implemented', 'info');
    }

    deleteRoom(roomId) {
        if (!confirm('Are you sure you want to delete this room?')) {
            return;
        }
        
        this.rooms = this.rooms.filter(room => room.id !== roomId);
        this.selectedRooms.delete(roomId);
        this.saveRoomsToStorage();
        this.renderRooms();
        this.updateTotalArea();
        
        showToast('Room deleted successfully!', 'success');
    }
}

// Global functions
function goBack() {
    window.location.href = 'customer-form.html';
}

function proceedToTileSelection() {
    if (roomMeasuring.selectedRooms.size === 0) {
        showToast('Please select at least one room', 'error');
        return;
    }
    
    window.location.href = 'tile-selection.html';
}

// Initialize room measuring
let roomMeasuring;
document.addEventListener('DOMContentLoaded', function() {
    roomMeasuring = new RoomMeasuring();
});
