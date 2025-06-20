// Worker Form JavaScript
class WorkerForm {
    constructor() {
        this.currentUser = null;
        this.existingCustomer = null;
        this.rooms = [];
        this.selectedTile = null;
        this.calculations = null;
        this.roomCounter = 0;
        this.init();
    }

    async init() {
        console.log('Worker Form initialized');
        await this.checkAuth();
        this.setupEventListeners();
        this.addRoom(); // Add initial room
    }

    async checkAuth() {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            window.location.href = 'admin-login.html';
            return;
        }
        this.currentUser = session.user;
    }

    setupEventListeners() {
        const mobileInput = document.getElementById('customerMobile');
        const tileCodeInput = document.getElementById('tileCode');
        const form = document.getElementById('workerForm');

        // Mobile number checking with debounce
        if (mobileInput) {
            let timeout;
            mobileInput.addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    this.checkExistingCustomer(mobileInput.value);
                }, 500);
            });
        }

        // Tile code search
        if (tileCodeInput) {
            tileCodeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.searchTile();
                }
            });
        }

        // Form submission
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitForm();
            });
        }

        // Setup auth state listener
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT' || !session) {
                window.location.href = 'admin-login.html';
            }
        });

        // Form validation
        this.setupFormValidation();
    }

    setupFormValidation() {
        const requiredInputs = document.querySelectorAll('input[required], textarea[required]');
        
        requiredInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validateForm();
            });
        });
    }

    validateForm() {
        const customerName = document.getElementById('customerName').value.trim();
        const customerMobile = document.getElementById('customerMobile').value.trim();
        const customerAddress = document.getElementById('customerAddress').value.trim();
        const attendedBy = document.getElementById('attendedBy').value.trim();
        
        const hasRooms = this.rooms.length > 0;
        const hasTile = this.selectedTile !== null;
        
        const isValid = customerName && customerMobile && customerAddress && 
                       attendedBy && hasRooms && hasTile;
        
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.disabled = !isValid;
        }
    }

    async checkExistingCustomer(mobile) {
        const statusDiv = document.getElementById('mobileStatus');
        const alert = document.getElementById('customerAlert');
        
        if (!mobile || mobile.length < 10) {
            if (statusDiv) statusDiv.innerHTML = '';
            if (alert) alert.style.display = 'none';
            this.existingCustomer = null;
            return;
        }

        try {
            if (statusDiv) {
                statusDiv.innerHTML = '<span class="checking">Checking...</span>';
            }

            const { data: customer, error } = await supabase
                .from('ledger')
                .select('*')
                .eq('mobile', mobile)
                .maybeSingle();

            if (error && error.code !== 'PGRST116') {
                throw error;
            }

            if (customer) {
                this.existingCustomer = customer;
                if (statusDiv) {
                    statusDiv.innerHTML = '<span class="exists">Customer exists in system</span>';
                }
                if (alert) {
                    alert.style.display = 'block';
                    this.populateExistingCustomerData(customer);
                }
            } else {
                this.existingCustomer = null;
                if (statusDiv) {
                    statusDiv.innerHTML = '<span class="new">New customer</span>';
                }
                if (alert) {
                    alert.style.display = 'none';
                }
            }
        } catch (error) {
            console.error('Error checking customer:', error);
            if (statusDiv) {
                statusDiv.innerHTML = '<span class="error">Error checking customer</span>';
            }
        }
    }

    populateExistingCustomerData(customer) {
        document.getElementById('customerName').value = customer.name;
        document.getElementById('customerAddress').value = customer.address;
        // Keep the mobile field as is since user is typing it
        // Don't populate attended_by as it might be a different worker
    }

    addRoom() {
        this.roomCounter++;
        const roomId = `room_${this.roomCounter}`;
        
        const roomHtml = `
            <div class="room-card" id="${roomId}">
                <div class="room-header">
                    <h3 class="room-title">Room ${this.roomCounter}</h3>
                    <button type="button" class="remove-room-btn" onclick="workerForm.removeRoom('${roomId}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="room-measurements">
                    <div class="form-group">
                        <label class="form-label">Room Name *</label>
                        <input type="text" class="form-input room-name" placeholder="e.g., Living Room" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Length (ft) *</label>
                        <input type="number" class="form-input room-length" placeholder="0" step="0.1" min="0" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Width (ft) *</label>
                        <input type="number" class="form-input room-width" placeholder="0" step="0.1" min="0" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Height (ft)</label>
                        <input type="number" class="form-input room-height" placeholder="0" step="0.1" min="0">
                    </div>
                </div>
                <div class="measurement-summary">
                    <div class="area-display">Area: <span class="room-area">0</span> sq ft</div>
                </div>
            </div>
        `;

        const roomsContainer = document.getElementById('roomsContainer');
        if (roomsContainer) {
            roomsContainer.insertAdjacentHTML('beforeend', roomHtml);
            this.setupRoomListeners(roomId);
            this.validateForm();
        }
    }

    setupRoomListeners(roomId) {
        const roomCard = document.getElementById(roomId);
        if (!roomCard) return;

        const lengthInput = roomCard.querySelector('.room-length');
        const widthInput = roomCard.querySelector('.room-width');
        const areaSpan = roomCard.querySelector('.room-area');

        const updateArea = () => {
            const length = parseFloat(lengthInput.value) || 0;
            const width = parseFloat(widthInput.value) || 0;
            const area = length * width;
            areaSpan.textContent = area.toFixed(2);
            this.updateRoomsData();
        };

        lengthInput.addEventListener('input', updateArea);
        widthInput.addEventListener('input', updateArea);

        // Add to validation
        const nameInput = roomCard.querySelector('.room-name');
        [nameInput, lengthInput, widthInput].forEach(input => {
            input.addEventListener('input', () => {
                this.updateRoomsData();
                this.validateForm();
            });
        });
    }

    removeRoom(roomId) {
        const roomCard = document.getElementById(roomId);
        if (roomCard) {
            roomCard.remove();
            this.updateRoomsData();
            this.validateForm();
        }
    }

    updateRoomsData() {
        const roomCards = document.querySelectorAll('.room-card');
        this.rooms = Array.from(roomCards).map(card => {
            const name = card.querySelector('.room-name').value;
            const length = parseFloat(card.querySelector('.room-length').value) || 0;
            const width = parseFloat(card.querySelector('.room-width').value) || 0;
            const height = parseFloat(card.querySelector('.room-height').value) || 0;
            const area = length * width;

            return {
                name,
                length,
                width,
                height,
                area
            };
        }).filter(room => room.name && room.length > 0 && room.width > 0);

        // Recalculate if tile is selected
        if (this.selectedTile) {
            this.calculateCosts();
        }
    }

    async searchTile() {
        const tileCode = document.getElementById('tileCode').value.trim();
        if (!tileCode) {
            showToast('Please enter a tile code', 'error');
            return;
        }

        try {
            this.showLoading(true);

            const { data: tile, error } = await supabase
                .from('tiles')
                .select('*')
                .eq('code', tileCode)
                .maybeSingle();

            if (error) {
                throw error;
            }

            if (!tile) {
                showToast('Tile not found', 'error');
                return;
            }

            this.selectedTile = tile;
            this.displayTileDetails();
            this.calculateCosts();
            this.validateForm();
        } catch (error) {
            console.error('Error searching tile:', error);
            showToast('Error searching tile', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    displayTileDetails() {
        const tileDetailsDiv = document.getElementById('tileDetails');
        if (!tileDetailsDiv || !this.selectedTile) return;

        const tile = this.selectedTile;
        
        tileDetailsDiv.innerHTML = `
            <h3>Selected Tile Details</h3>
            <div class="tile-info-grid">
                <div class="tile-info-item">
                    <div class="tile-info-label">Name</div>
                    <div class="tile-info-value">${this.escapeHtml(tile.name)}</div>
                </div>
                <div class="tile-info-item">
                    <div class="tile-info-label">Code</div>
                    <div class="tile-info-value">${this.escapeHtml(tile.code)}</div>
                </div>
                <div class="tile-info-item">
                    <div class="tile-info-label">Size</div>
                    <div class="tile-info-value">${tile.length_feet}' × ${tile.width_feet}'</div>
                </div>
                <div class="tile-info-item">
                    <div class="tile-info-label">Price per Tile</div>
                    <div class="tile-info-value">$${tile.price_per_tile}</div>
                </div>
                <div class="tile-info-item">
                    <div class="tile-info-label">Coverage per Box</div>
                    <div class="tile-info-value">${tile.coverage_per_box} tiles</div>
                </div>
                <div class="tile-info-item">
                    <div class="tile-info-label">Price per Sq Ft</div>
                    <div class="tile-info-value">$${tile.price_per_square_feet.toFixed(2)}</div>
                </div>
                ${tile.discount_percent > 0 ? `
                    <div class="tile-info-item">
                        <div class="tile-info-label">Discount</div>
                        <div class="tile-info-value">${tile.discount_percent}%</div>
                    </div>
                ` : ''}
            </div>
        `;

        tileDetailsDiv.style.display = 'block';
    }

    calculateCosts() {
        if (!this.selectedTile || this.rooms.length === 0) {
            return;
        }

        const tile = this.selectedTile;
        const totalArea = this.rooms.reduce((sum, room) => sum + room.area, 0);
        
        if (totalArea === 0) {
            return;
        }

        // Calculate tile area
        const tileArea = tile.length_feet * tile.width_feet;
        
        // Calculate required tiles (add 10% wastage)
        const baseTiles = Math.ceil(totalArea / tileArea);
        const tilesWithWastage = Math.ceil(baseTiles * 1.1);
        
        // Calculate boxes needed
        const boxesNeeded = Math.ceil(tilesWithWastage / tile.coverage_per_box);
        
        // Calculate costs
        const baseCost = tilesWithWastage * tile.price_per_tile;
        const discountAmount = baseCost * (tile.discount_percent / 100);
        const finalCost = baseCost - discountAmount;

        this.calculations = {
            totalArea,
            tilesNeeded: tilesWithWastage,
            boxesNeeded,
            baseCost,
            discountAmount,
            finalCost
        };

        this.displayCostCalculation();
    }

    displayCostCalculation() {
        const costDiv = document.getElementById('costCalculation');
        if (!costDiv || !this.calculations) return;

        const calc = this.calculations;

        costDiv.innerHTML = `
            <h3>Cost Calculation</h3>
            <div class="cost-grid">
                <div class="cost-item">
                    <div class="cost-label">Total Area</div>
                    <div class="cost-value">${calc.totalArea.toFixed(2)} sq ft</div>
                </div>
                <div class="cost-item">
                    <div class="cost-label">Tiles Needed</div>
                    <div class="cost-value">${calc.tilesNeeded}</div>
                </div>
                <div class="cost-item">
                    <div class="cost-label">Boxes Needed</div>
                    <div class="cost-value">${calc.boxesNeeded}</div>
                </div>
                <div class="cost-item">
                    <div class="cost-label">Base Cost</div>
                    <div class="cost-value">$${calc.baseCost.toFixed(2)}</div>
                </div>
                ${calc.discountAmount > 0 ? `
                    <div class="cost-item">
                        <div class="cost-label">Discount</div>
                        <div class="cost-value">-$${calc.discountAmount.toFixed(2)}</div>
                    </div>
                ` : ''}
                <div class="cost-item final-cost">
                    <div class="cost-label">Final Cost</div>
                    <div class="cost-value">$${calc.finalCost.toFixed(2)}</div>
                </div>
            </div>
        `;

        costDiv.style.display = 'block';
    }

    async submitForm() {
        try {
            this.showLoading(true);

            const formData = this.getFormData();
            if (!formData) {
                return;
            }

            // Generate PDF
            const pdfUrl = await this.generatePDF(formData);

            // Save to database
            await this.saveToDatabase(formData, pdfUrl);

            showToast('Quotation saved successfully!', 'success');
            
            // Redirect to ledger after a short delay
            setTimeout(() => {
                window.location.href = 'ledger-dashboard.html';
            }, 2000);

        } catch (error) {
            console.error('Error submitting form:', error);
            showToast('Error saving quotation', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    getFormData() {
        const customerName = document.getElementById('customerName').value.trim();
        const customerMobile = document.getElementById('customerMobile').value.trim();
        const customerAddress = document.getElementById('customerAddress').value.trim();
        const attendedBy = document.getElementById('attendedBy').value.trim();

        if (!customerName || !customerMobile || !customerAddress || !attendedBy) {
            showToast('Please fill all required fields', 'error');
            return null;
        }

        if (this.rooms.length === 0) {
            showToast('Please add at least one room', 'error');
            return null;
        }

        if (!this.selectedTile || !this.calculations) {
            showToast('Please select a tile', 'error');
            return null;
        }

        return {
            customer: {
                name: customerName,
                mobile: customerMobile,
                address: customerAddress,
                attendedBy: attendedBy
            },
            rooms: this.rooms,
            tile: this.selectedTile,
            calculations: this.calculations
        };
    }

    async generatePDF(formData) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Title
        doc.setFontSize(20);
        doc.text('Tile Haven - Quotation', 20, 20);

        // Customer Details
        doc.setFontSize(14);
        doc.text('Customer Details:', 20, 40);
        doc.setFontSize(12);
        doc.text(`Name: ${formData.customer.name}`, 20, 50);
        doc.text(`Mobile: ${formData.customer.mobile}`, 20, 60);
        doc.text(`Address: ${formData.customer.address}`, 20, 70);
        doc.text(`Attended By: ${formData.customer.attendedBy}`, 20, 80);

        // Room Details
        let yPosition = 100;
        doc.setFontSize(14);
        doc.text('Room Details:', 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(12);
        formData.rooms.forEach((room, index) => {
            doc.text(`${index + 1}. ${room.name}: ${room.length}' × ${room.width}' = ${room.area.toFixed(2)} sq ft`, 20, yPosition);
            yPosition += 10;
        });

        // Tile Details
        yPosition += 10;
        doc.setFontSize(14);
        doc.text('Tile Details:', 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(12);
        doc.text(`Name: ${formData.tile.name}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Code: ${formData.tile.code}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Size: ${formData.tile.length_feet}' × ${formData.tile.width_feet}'`, 20, yPosition);
        yPosition += 10;
        doc.text(`Price per Tile: $${formData.tile.price_per_tile}`, 20, yPosition);

        // Cost Calculation
        yPosition += 20;
        doc.setFontSize(14);
        doc.text('Cost Calculation:', 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(12);
        doc.text(`Total Area: ${formData.calculations.totalArea.toFixed(2)} sq ft`, 20, yPosition);
        yPosition += 10;
        doc.text(`Tiles Needed: ${formData.calculations.tilesNeeded}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Boxes Needed: ${formData.calculations.boxesNeeded}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Base Cost: $${formData.calculations.baseCost.toFixed(2)}`, 20, yPosition);
        
        if (formData.calculations.discountAmount > 0) {
            yPosition += 10;
            doc.text(`Discount: -$${formData.calculations.discountAmount.toFixed(2)}`, 20, yPosition);
        }
        
        yPosition += 15;
        doc.setFontSize(16);
        doc.text(`Final Cost: $${formData.calculations.finalCost.toFixed(2)}`, 20, yPosition);

        // Convert to blob and upload
        const pdfBlob = doc.output('blob');
        const fileName = `quotation_${Date.now()}.pdf`;
        
        const { data, error } = await supabase.storage
            .from('quotation-pdfs')
            .upload(fileName, pdfBlob);

        if (error) {
            throw error;
        }

        const { data: urlData } = supabase.storage
            .from('quotation-pdfs')
            .getPublicUrl(fileName);

        return urlData.publicUrl;
    }

    async saveToDatabase(formData, pdfUrl) {
        if (this.existingCustomer) {
            // Update existing customer
            const { error: updateError } = await supabase
                .from('ledger')
                .update({
                    quotation_pdf_url: pdfUrl,
                    updated_at: new Date().toISOString()
                })
                .eq('id', this.existingCustomer.id);

            if (updateError) {
                throw updateError;
            }

            // Insert quotation into customer's table
            const { error: quotationError } = await supabase
                .rpc('insert_customer_quotation', {
                    customer_id: this.existingCustomer.id,
                    p_quotation_pdf_url: pdfUrl,
                    p_attended_by: formData.customer.attendedBy,
                    p_room_data: formData.rooms,
                    p_tile_data: formData.tile,
                    p_cost_data: formData.calculations
                });

            if (quotationError) {
                throw quotationError;
            }
        } else {
            // Create new customer
            const { data: newCustomer, error: insertError } = await supabase
                .from('ledger')
                .insert({
                    name: formData.customer.name,
                    mobile: formData.customer.mobile,
                    address: formData.customer.address,
                    attended_by: formData.customer.attendedBy,
                    quotation_pdf_url: pdfUrl,
                    status: 'Pending'
                })
                .select()
                .single();

            if (insertError) {
                throw insertError;
            }

            // Create customer table
            const { error: tableError } = await supabase
                .rpc('create_customer_table', { customer_id: newCustomer.id });

            if (tableError) {
                throw tableError;
            }

            // Insert quotation into customer's table
            const { error: quotationError } = await supabase
                .rpc('insert_customer_quotation', {
                    customer_id: newCustomer.id,
                    p_quotation_pdf_url: pdfUrl,
                    p_attended_by: formData.customer.attendedBy,
                    p_room_data: formData.rooms,
                    p_tile_data: formData.tile,
                    p_cost_data: formData.calculations
                });

            if (quotationError) {
                throw quotationError;
            }
        }
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = show ? 'flex' : 'none';
        }
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text ? text.replace(/[&<>"']/g, m => map[m]) : '';
    }
}

// Global functions
function proceedWithExistingCustomer() {
    const alert = document.getElementById('customerAlert');
    if (alert) {
        alert.style.display = 'none';
    }
    // Form remains populated, user can continue with new quotation
}

function clearCustomerForm() {
    document.getElementById('customerName').value = '';
    document.getElementById('customerMobile').value = '';
    document.getElementById('customerAddress').value = '';
    
    const alert = document.getElementById('customerAlert');
    const statusDiv = document.getElementById('mobileStatus');
    
    if (alert) alert.style.display = 'none';
    if (statusDiv) statusDiv.innerHTML = '';
    
    workerForm.existingCustomer = null;
}

function addRoom() {
    workerForm.addRoom();
}

function searchTile() {
    workerForm.searchTile();
}

function clearForm() {
    if (confirm('Are you sure you want to clear the entire form?')) {
        location.reload();
    }
}

function goToLedger() {
    window.location.href = 'ledger-dashboard.html';
}

async function logout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error logging out:', error);
        showToast('Error logging out', 'error');
    }
}

// Initialize worker form
let workerForm;
document.addEventListener('DOMContentLoaded', function() {
    workerForm = new WorkerForm();
});
