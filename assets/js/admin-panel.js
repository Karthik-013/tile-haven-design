
// Admin Panel JavaScript with Supabase Integration
class AdminPanel {
    constructor() {
        this.currentSection = 'dashboard';
        this.tiles = [];
        this.customers = [];
        this.currentUser = null;
        this.init();
    }

    async init() {
        console.log('Admin Panel initialized');
        await this.checkAuth();
        await this.loadDashboardData();
        this.setupEventListeners();
    }

    async checkAuth() {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            window.location.href = '/admin-login.html';
            return;
        }
        this.currentUser = session.user;
        
        // Setup auth state listener
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT' || !session) {
                window.location.href = '/admin-login.html';
            }
        });
    }

    setupEventListeners() {
        // Add tile form
        const addTileForm = document.getElementById('addTileForm');
        if (addTileForm) {
            addTileForm.addEventListener('submit', (e) => this.handleAddTile(e));
        }

        // Customer search
        const customerSearch = document.getElementById('customerSearch');
        if (customerSearch) {
            customerSearch.addEventListener('input', (e) => this.filterCustomers(e.target.value));
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
            case 'tiles':
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

            if (!tilesError && tiles) {
                document.getElementById('totalTiles').textContent = tiles.length;
            }

            // Load customers count from ledger
            const { data: customers, error: customersError } = await supabase
                .from('ledger')
                .select('*');

            if (!customersError && customers) {
                document.getElementById('totalCustomers').textContent = customers.length;
                const pending = customers.filter(c => c.status === 'Pending').length;
                document.getElementById('pendingOrders').textContent = pending;
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            showToast('Error loading dashboard data', 'error');
        }
    }

    async handleAddTile(e) {
        e.preventDefault();
        
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
            this.loadTiles();
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

            this.tiles = tiles || [];
            this.renderTiles();
        } catch (error) {
            console.error('Error loading tiles:', error);
            showToast('Error loading tiles', 'error');
        }
    }

    renderTiles() {
        const tilesTableBody = document.getElementById('tilesTableBody');
        if (!tilesTableBody) return;

        if (this.tiles.length === 0) {
            tilesTableBody.innerHTML = '<tr><td colspan="5">No tiles found</td></tr>';
            return;
        }

        tilesTableBody.innerHTML = this.tiles.map(tile => `
            <tr>
                <td>${this.escapeHtml(tile.code)}</td>
                <td>${this.escapeHtml(tile.name)}</td>
                <td>${tile.length_feet}' × ${tile.width_feet}'</td>
                <td>$${tile.price_per_tile}</td>
                <td>
                    <button class="btn-small btn-edit" onclick="adminPanel.editTile('${tile.id}')">Edit</button>
                    <button class="btn-small btn-delete" onclick="adminPanel.deleteTile('${tile.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    async loadCustomers() {
        try {
            const { data: customers, error } = await supabase
                .from('ledger')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            this.customers = customers || [];
            this.renderCustomers();
        } catch (error) {
            console.error('Error loading customers:', error);
            showToast('Error loading customers', 'error');
        }
    }

    renderCustomers() {
        const customersTableBody = document.getElementById('customersTableBody');
        if (!customersTableBody) return;

        if (this.customers.length === 0) {
            customersTableBody.innerHTML = '<tr><td colspan="6">No customers found</td></tr>';
            return;
        }

        customersTableBody.innerHTML = this.customers.map(customer => `
            <tr>
                <td>${this.escapeHtml(customer.name)}</td>
                <td>${this.escapeHtml(customer.mobile)}</td>
                <td>${this.escapeHtml(customer.address)}</td>
                <td>${this.escapeHtml(customer.attended_by)}</td>
                <td>
                    <span class="status-badge status-${customer.status.toLowerCase()}">
                        ${customer.status}
                    </span>
                </td>
                <td>
                    <button class="btn-small btn-view" onclick="adminPanel.viewCustomer('${customer.id}')">View</button>
                    ${customer.quotation_pdf_url ? 
                        `<a href="${customer.quotation_pdf_url}" target="_blank" class="btn-small btn-download">PDF</a>` 
                        : ''
                    }
                </td>
            </tr>
        `).join('');
    }

    filterCustomers(searchTerm) {
        if (!searchTerm) {
            this.renderCustomers();
            return;
        }

        const filteredCustomers = this.customers.filter(customer =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.mobile.includes(searchTerm) ||
            customer.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.attended_by.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const customersTableBody = document.getElementById('customersTableBody');
        if (!customersTableBody) return;

        if (filteredCustomers.length === 0) {
            customersTableBody.innerHTML = '<tr><td colspan="6">No customers found matching your search</td></tr>';
            return;
        }

        customersTableBody.innerHTML = filteredCustomers.map(customer => `
            <tr>
                <td>${this.escapeHtml(customer.name)}</td>
                <td>${this.escapeHtml(customer.mobile)}</td>
                <td>${this.escapeHtml(customer.address)}</td>
                <td>${this.escapeHtml(customer.attended_by)}</td>
                <td>
                    <span class="status-badge status-${customer.status.toLowerCase()}">
                        ${customer.status}
                    </span>
                </td>
                <td>
                    <button class="btn-small btn-view" onclick="adminPanel.viewCustomer('${customer.id}')">View</button>
                    ${customer.quotation_pdf_url ? 
                        `<a href="${customer.quotation_pdf_url}" target="_blank" class="btn-small btn-download">PDF</a>` 
                        : ''
                    }
                </td>
            </tr>
        `).join('');
    }

    async editTile(tileId) {
        const tile = this.tiles.find(t => t.id === tileId);
        if (!tile) {
            showToast('Tile not found', 'error');
            return;
        }

        // Create a simple edit form
        const newName = prompt('Edit tile name:', tile.name);
        if (newName === null) return; // User cancelled

        const newPrice = prompt('Edit price per tile:', tile.price_per_tile);
        if (newPrice === null) return; // User cancelled

        try {
            const { error } = await supabase
                .from('tiles')
                .update({
                    name: newName,
                    price_per_tile: parseFloat(newPrice),
                    price_per_square_feet: parseFloat(newPrice) / (tile.length_feet * tile.width_feet),
                    updated_at: new Date().toISOString()
                })
                .eq('id', tileId);

            if (error) {
                throw error;
            }

            showToast('Tile updated successfully!', 'success');
            this.loadTiles();
            this.loadDashboardData();
        } catch (error) {
            console.error('Error updating tile:', error);
            showToast('Error updating tile', 'error');
        }
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

    async viewCustomer(customerId) {
        try {
            // Get customer basic info
            const customer = this.customers.find(c => c.id === customerId);
            if (!customer) {
                throw new Error('Customer not found');
            }

            // Get customer quotations
            const { data: quotations, error } = await supabase
                .rpc('get_customer_quotations', { customer_id: customerId });

            if (error) {
                console.error('Error loading quotations:', error);
            }

            // Show customer details in a modal or alert for now
            let details = `Customer: ${customer.name}\n`;
            details += `Mobile: ${customer.mobile}\n`;
            details += `Address: ${customer.address}\n`;
            details += `Status: ${customer.status}\n`;
            details += `Attended By: ${customer.attended_by}\n`;
            
            if (quotations && quotations.length > 0) {
                details += `\nQuotations: ${quotations.length}`;
            } else {
                details += '\nNo quotations found';
            }

            alert(details);
        } catch (error) {
            console.error('Error viewing customer:', error);
            showToast('Error loading customer details', 'error');
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
function showSection(sectionName) {
    adminPanel.showSection(sectionName);
}

async function logout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        window.location.href = '/';
    } catch (error) {
        console.error('Error logging out:', error);
        showToast('Error logging out', 'error');
    }
}

// Initialize admin panel
let adminPanel;
document.addEventListener('DOMContentLoaded', function() {
    adminPanel = new AdminPanel();
});
