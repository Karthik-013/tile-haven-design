
// Ledger Dashboard JavaScript
class LedgerDashboard {
    constructor() {
        this.currentUser = null;
        this.customers = [];
        this.filteredCustomers = [];
        this.init();
    }

    async init() {
        console.log('Ledger Dashboard initialized');
        await this.checkAuth();
        await this.loadCustomers();
        this.setupEventListeners();
        this.updateStats();
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
        const searchInput = document.getElementById('searchInput');
        const statusFilter = document.getElementById('statusFilter');

        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterCustomers());
        }

        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.filterCustomers());
        }

        // Setup auth state listener
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT' || !session) {
                window.location.href = 'admin-login.html';
            }
        });
    }

    async loadCustomers() {
        try {
            this.showLoading(true);
            
            const { data: customers, error } = await supabase
                .from('ledger')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            this.customers = customers || [];
            this.filteredCustomers = [...this.customers];
            this.renderCustomers();
            this.updateStats();
        } catch (error) {
            console.error('Error loading customers:', error);
            showToast('Error loading customers', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    filterCustomers() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const statusFilter = document.getElementById('statusFilter').value;

        this.filteredCustomers = this.customers.filter(customer => {
            const matchesSearch = !searchTerm || 
                customer.name.toLowerCase().includes(searchTerm) ||
                customer.mobile.includes(searchTerm) ||
                customer.address.toLowerCase().includes(searchTerm) ||
                customer.attended_by.toLowerCase().includes(searchTerm);

            const matchesStatus = !statusFilter || customer.status === statusFilter;

            return matchesSearch && matchesStatus;
        });

        this.renderCustomers();
    }

    renderCustomers() {
        const tbody = document.getElementById('ledgerTableBody');
        const emptyState = document.getElementById('emptyState');
        const table = document.getElementById('ledgerTable');

        if (!tbody) return;

        if (this.filteredCustomers.length === 0) {
            tbody.innerHTML = '';
            if (table) table.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (table) table.style.display = 'table';
        if (emptyState) emptyState.style.display = 'none';

        tbody.innerHTML = this.filteredCustomers.map(customer => `
            <tr>
                <td>
                    <div class="customer-name">${this.escapeHtml(customer.name)}</div>
                </td>
                <td>${this.escapeHtml(customer.mobile)}</td>
                <td>
                    <div class="customer-address">${this.escapeHtml(customer.address)}</div>
                </td>
                <td>${this.escapeHtml(customer.attended_by)}</td>
                <td>
                    <span class="status-badge ${customer.status.toLowerCase()}">${customer.status}</span>
                </td>
                <td>${this.formatDate(customer.updated_at)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view" onclick="ledgerDashboard.viewCustomerDetails('${customer.id}')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            View
                        </button>
                        ${customer.quotation_pdf_url ? `
                            <a href="${customer.quotation_pdf_url}" target="_blank" class="action-btn download">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7,10 12,15 17,10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                PDF
                            </a>
                        ` : ''}
                        <button class="action-btn status" onclick="ledgerDashboard.toggleCustomerStatus('${customer.id}', '${customer.status}')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polyline points="9,11 12,14 22,4"></polyline>
                                <path d="M21,21L7,7l5,5"></path>
                            </svg>
                            ${customer.status === 'Pending' ? 'Complete' : 'Reopen'}
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    async viewCustomerDetails(customerId) {
        try {
            this.showLoading(true);
            
            // Get customer basic info
            const customer = this.customers.find(c => c.id === customerId);
            if (!customer) {
                throw new Error('Customer not found');
            }

            // Get customer quotations
            const { data: quotations, error } = await supabase
                .rpc('get_customer_quotations', { customer_id: customerId });

            if (error) {
                throw error;
            }

            this.showCustomerModal(customer, quotations || []);
        } catch (error) {
            console.error('Error loading customer details:', error);
            showToast('Error loading customer details', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    showCustomerModal(customer, quotations) {
        const modal = document.getElementById('customerModal');
        const modalCustomerName = document.getElementById('modalCustomerName');
        const modalBody = document.getElementById('modalBody');

        if (!modal || !modalCustomerName || !modalBody) return;

        modalCustomerName.textContent = `${customer.name} - Quotation History`;

        if (quotations.length === 0) {
            modalBody.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                    </div>
                    <h3>No quotations found</h3>
                    <p>This customer doesn't have any quotations yet.</p>
                </div>
            `;
        } else {
            modalBody.innerHTML = `
                <div class="customer-info">
                    <h3>Customer Information</h3>
                    <div class="customer-details">
                        <p><strong>Name:</strong> ${this.escapeHtml(customer.name)}</p>
                        <p><strong>Mobile:</strong> ${this.escapeHtml(customer.mobile)}</p>
                        <p><strong>Address:</strong> ${this.escapeHtml(customer.address)}</p>
                        <p><strong>Status:</strong> <span class="status-badge ${customer.status.toLowerCase()}">${customer.status}</span></p>
                    </div>
                </div>
                <div class="quotations-list">
                    <h3>Quotation History (${quotations.length})</h3>
                    ${quotations.map(quotation => this.renderQuotationCard(quotation)).join('')}
                </div>
            `;
        }

        modal.style.display = 'block';
    }

    renderQuotationCard(quotation) {
        const roomData = quotation.room_data || {};
        const tileData = quotation.tile_data || {};
        const costData = quotation.cost_data || {};

        return `
            <div class="quotation-card">
                <div class="quotation-header">
                    <div class="quotation-date">${this.formatDate(quotation.created_at)}</div>
                    <div class="quotation-attendee">By: ${this.escapeHtml(quotation.attended_by)}</div>
                </div>
                <div class="quotation-details">
                    ${Object.keys(roomData).length > 0 ? `
                        <div class="detail-section">
                            <h4>Room Details</h4>
                            <p>Total Area: ${roomData.totalArea || 'N/A'} sq ft</p>
                            <p>Rooms: ${Array.isArray(roomData.rooms) ? roomData.rooms.length : 'N/A'}</p>
                        </div>
                    ` : ''}
                    ${Object.keys(tileData).length > 0 ? `
                        <div class="detail-section">
                            <h4>Tile Details</h4>
                            <p>Name: ${this.escapeHtml(tileData.name || 'N/A')}</p>
                            <p>Code: ${this.escapeHtml(tileData.code || 'N/A')}</p>
                        </div>
                    ` : ''}
                    ${Object.keys(costData).length > 0 ? `
                        <div class="detail-section">
                            <h4>Cost Details</h4>
                            <p>Total Cost: $${costData.finalCost || 'N/A'}</p>
                            <p>Tiles Needed: ${costData.tilesNeeded || 'N/A'}</p>
                        </div>
                    ` : ''}
                    ${quotation.quotation_pdf_url ? `
                        <div class="detail-section">
                            <h4>Download</h4>
                            <a href="${quotation.quotation_pdf_url}" target="_blank" class="action-btn download">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7,10 12,15 17,10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                Download PDF
                            </a>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    async toggleCustomerStatus(customerId, currentStatus) {
        try {
            const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
            
            const { error } = await supabase
                .from('ledger')
                .update({ 
                    status: newStatus,
                    updated_at: new Date().toISOString()
                })
                .eq('id', customerId);

            if (error) {
                throw error;
            }

            showToast(`Customer status updated to ${newStatus}`, 'success');
            await this.loadCustomers();
        } catch (error) {
            console.error('Error updating customer status:', error);
            showToast('Error updating customer status', 'error');
        }
    }

    updateStats() {
        const pendingCount = this.customers.filter(c => c.status === 'Pending').length;
        const completedCount = this.customers.filter(c => c.status === 'Completed').length;
        const totalCount = this.customers.length;

        const pendingElement = document.getElementById('pendingCount');
        const completedElement = document.getElementById('completedCount');
        const totalElement = document.getElementById('totalCount');

        if (pendingElement) pendingElement.textContent = pendingCount;
        if (completedElement) completedElement.textContent = completedCount;
        if (totalElement) totalElement.textContent = totalCount;
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = show ? 'flex' : 'none';
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
function goToWorkerForm() {
    window.location.href = 'worker-form.html';
}

function refreshLedger() {
    ledgerDashboard.loadCustomers();
}

function closeCustomerModal() {
    const modal = document.getElementById('customerModal');
    if (modal) {
        modal.style.display = 'none';
    }
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

// Initialize dashboard
let ledgerDashboard;
document.addEventListener('DOMContentLoaded', function() {
    ledgerDashboard = new LedgerDashboard();
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('customerModal');
    if (event.target === modal) {
        closeCustomerModal();
    }
});
