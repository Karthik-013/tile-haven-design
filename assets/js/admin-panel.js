
// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.currentSection = 'dashboard';
        this.tiles = [];
        this.customers = [];
        this.init();
    }

    async init() {
        console.log('Admin Panel initialized');
        await this.loadDashboardData();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Add tile form
        const addTileForm = document.getElementById('addTileForm');
        if (addTileForm) {
            addTileForm.addEventListener('submit', (e) => this.handleAddTile(e));
        }
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from all nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected section
        const section = document.getElementById(sectionName);
        if (section) {
            section.classList.add('active');
        }

        // Add active class to corresponding nav button
        const navBtn = document.getElementById(sectionName + 'Btn');
        if (navBtn) {
            navBtn.classList.add('active');
        }

        this.currentSection = sectionName;

        // Load section-specific data
        switch (sectionName) {
            case 'view-tiles':
                this.loadTiles();
                break;
            case 'customers':
                this.loadCustomers();
                break;
            case 'dashboard':
                this.loadDashboardData();
                break;
        }
    }

    async loadDashboardData() {
        try {
            // Load tiles count
            const { data: tiles, error: tilesError } = await supabase
                .from('tiles')
                .select('*');

            if (!tilesError) {
                document.getElementById('totalTiles').textContent = tiles.length;
            }

            // Load customers count
            const { data: customers, error: customersError } = await supabase
                .from('customers')
                .select('*');

            if (!customersError) {
                document.getElementById('totalCustomers').textContent = customers.length;
                const pending = customers.filter(c => c.status === 'Pending').length;
                document.getElementById('pendingQuotations').textContent = pending;
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    async handleAddTile(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const tileData = {
            code: document.getElementById('tileCode').value,
            name: document.getElementById('tileName').value,
            length_feet: parseFloat(document.getElementById('tileLength').value),
            width_feet: parseFloat(document.getElementById('tileWidth').value),
            price_per_tile: parseFloat(document.getElementById('tilePrice').value),
            coverage_per_box: parseInt(document.getElementById('tileCoverage').value),
            discount_percent: parseFloat(document.getElementById('tileDiscount').value) || 0
        };

        // Calculate price per square feet
        const areaPerTile = tileData.length_feet * tileData.width_feet;
        tileData.price_per_square_feet = tileData.price_per_tile / areaPerTile;

        try {
            const { data, error } = await supabase
                .from('tiles')
                .insert([tileData])
                .select();

            if (error) {
                throw error;
            }

            showToast('Tile added successfully!', 'success');
            e.target.reset();
            this.loadDashboardData();
        } catch (error) {
            console.error('Error adding tile:', error);
            showToast('Error adding tile: ' + error.message, 'error');
        }
    }

    async loadTiles() {
        try {
            const { data: tiles, error } = await supabase
                .from('tiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            this.tiles = tiles;
            this.renderTiles();
        } catch (error) {
            console.error('Error loading tiles:', error);
            showToast('Error loading tiles', 'error');
        }
    }

    renderTiles() {
        const tilesGrid = document.getElementById('tilesGrid');
        if (!tilesGrid) return;

        tilesGrid.innerHTML = this.tiles.map(tile => `
            <div class="tile-item" data-tile-id="${tile.id}">
                <div class="tile-image-placeholder" style="width: 100%; height: 150px; background: #f3f4f6; border-radius: 0.25rem; margin-bottom: 1rem; display: flex; align-items: center; justify-content: center; color: #6b7280;">
                    No Image
                </div>
                <div class="tile-info">
                    <h4>${tile.name}</h4>
                    <div class="tile-code">Code: ${tile.code}</div>
                    <div class="tile-details">
                        Size: ${tile.length_feet}' × ${tile.width_feet}'<br>
                        Price: $${tile.price_per_tile}/tile<br>
                        Coverage: ${tile.coverage_per_box} tiles/box<br>
                        ${tile.discount_percent > 0 ? `Discount: ${tile.discount_percent}%` : ''}
                    </div>
                    <div class="tile-actions">
                        <button class="btn btn-small btn-blue" onclick="adminPanel.editTile('${tile.id}')">Edit</button>
                        <button class="btn btn-small btn-red" onclick="adminPanel.deleteTile('${tile.id}')">Delete</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async loadCustomers() {
        try {
            const { data: customers, error } = await supabase
                .from('customers')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            this.customers = customers;
            this.renderCustomers();
        } catch (error) {
            console.error('Error loading customers:', error);
            showToast('Error loading customers', 'error');
        }
    }

    renderCustomers() {
        const customersBody = document.getElementById('customersBody');
        if (!customersBody) return;

        customersBody.innerHTML = this.customers.map(customer => `
            <tr>
                <td>${customer.name}</td>
                <td>${customer.mobile}</td>
                <td>${customer.address}</td>
                <td>${customer.attended_by}</td>
                <td>
                    <span class="status-badge status-${customer.status.toLowerCase()}">
                        ${customer.status}
                    </span>
                </td>
                <td>
                    ${customer.quotation_pdf_url ? 
                        `<button class="btn btn-small btn-blue" onclick="window.open('${customer.quotation_pdf_url}', '_blank')">View PDF</button>` 
                        : 'No PDF'
                    }
                </td>
            </tr>
        `).join('');
    }

    async editTile(tileId) {
        // Implementation for editing tiles
        showToast('Edit functionality will be implemented', 'info');
    }

    async deleteTile(tileId) {
        if (!confirm('Are you sure you want to delete this tile?')) {
            return;
        }

        try {
            const { error } = await supabase
                .from('tiles')
                .delete()
                .eq('id', tileId);

            if (error) {
                throw error;
            }

            showToast('Tile deleted successfully!', 'success');
            this.loadTiles();
            this.loadDashboardData();
        } catch (error) {
            console.error('Error deleting tile:', error);
            showToast('Error deleting tile', 'error');
        }
    }
}

// Global functions
function showSection(sectionName) {
    adminPanel.showSection(sectionName);
}

function logout() {
    localStorage.removeItem('currentAdmin');
    window.location.href = 'index.html';
}

// Initialize admin panel
let adminPanel;
document.addEventListener('DOMContentLoaded', function() {
    // Check if admin is logged in
    const currentAdmin = localStorage.getItem('currentAdmin');
    if (!currentAdmin) {
        window.location.href = 'index.html';
        return;
    }

    adminPanel = new AdminPanel();
});
