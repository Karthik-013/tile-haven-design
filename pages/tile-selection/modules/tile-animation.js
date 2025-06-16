
// Animation utilities
export class TileAnimation {
    static showComingSoonAlert() {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'coming-soon-alert';
        alertDiv.innerHTML = `
            <div class="alert-content">
                <h3>🚀 Coming Soon!</h3>
                <p>QR Code scanning feature is under development. Please use manual entry for now.</p>
                <button onclick="this.parentElement.parentElement.remove()" class="btn btn-primary">Got it!</button>
            </div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .coming-soon-alert {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                animation: fadeIn 0.3s ease;
            }
            .alert-content {
                background: white;
                padding: 2rem;
                border-radius: 16px;
                text-align: center;
                max-width: 400px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: slideUp 0.3s ease;
            }
            .alert-content h3 {
                color: var(--deep-forest);
                margin-bottom: 1rem;
                font-size: 1.5rem;
            }
            .alert-content p {
                color: var(--earth-brown);
                margin-bottom: 1.5rem;
                line-height: 1.6;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(alertDiv);
    }

    static showManualEntry() {
        const selectionMethods = document.querySelector('.selection-methods');
        const manualEntry = document.getElementById('manualEntry');
        
        selectionMethods.style.transform = 'translateY(-20px)';
        selectionMethods.style.opacity = '0';
        
        setTimeout(() => {
            selectionMethods.style.display = 'none';
            manualEntry.style.display = 'block';
            manualEntry.style.opacity = '0';
            manualEntry.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                manualEntry.style.opacity = '1';
                manualEntry.style.transform = 'translateY(0)';
                document.getElementById('tileCode').focus();
            }, 50);
        }, 300);
    }

    static hideManualEntry() {
        const selectionMethods = document.querySelector('.selection-methods');
        const manualEntry = document.getElementById('manualEntry');
        const tileForm = document.getElementById('tileForm');
        
        manualEntry.style.transform = 'translateY(20px)';
        manualEntry.style.opacity = '0';
        
        setTimeout(() => {
            manualEntry.style.display = 'none';
            selectionMethods.style.display = 'grid';
            selectionMethods.style.opacity = '0';
            selectionMethods.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                selectionMethods.style.opacity = '1';
                selectionMethods.style.transform = 'translateY(0)';
            }, 50);
            
            tileForm.reset();
            tileForm.style.display = 'block';
            const existingDetails = document.querySelector('.tile-details');
            if (existingDetails) {
                existingDetails.remove();
            }
        }, 300);
    }

    static initializePageAnimations() {
        setTimeout(() => {
            document.querySelector('.selection-methods').style.opacity = '1';
            document.querySelector('.selection-methods').style.transform = 'translateY(0)';
        }, 300);
    }
}
