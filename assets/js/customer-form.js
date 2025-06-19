
// Customer form functionality
let customerDetails = null;

document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.getElementById('customerName');
    const phoneInput = document.getElementById('customerPhone');
    const addressInput = document.getElementById('customerAddress');
    const confirmBtn = document.getElementById('confirmDetailsBtn');
    const startMeasuringBtn = document.getElementById('startMeasuringBtn');

    // Add input event listeners to validate form
    [nameInput, phoneInput, addressInput].forEach(input => {
        input.addEventListener('input', validateForm);
    });

    confirmBtn.addEventListener('click', handleConfirmDetails);
    startMeasuringBtn.addEventListener('click', handleStartMeasuring);

    function validateForm() {
        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        const address = addressInput.value.trim();
        
        const isValid = name && phone && address;
        
        confirmBtn.disabled = !isValid;
        confirmBtn.className = isValid ? 'btn btn-green w-full py-3 text-lg' : 'btn btn-green w-full py-3 text-lg';
        
        if (!isValid) {
            confirmBtn.style.opacity = '0.5';
            confirmBtn.style.cursor = 'not-allowed';
        } else {
            confirmBtn.style.opacity = '1';
            confirmBtn.style.cursor = 'pointer';
        }
    }

    function handleConfirmDetails() {
        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        const address = addressInput.value.trim();
        
        if (name && phone && address) {
            customerDetails = { name, phone, address };
            
            // Store in localStorage
            localStorage.setItem('customerDetails', JSON.stringify(customerDetails));
            
            // Hide form and show welcome section
            document.getElementById('customerFormSection').classList.add('hidden');
            document.getElementById('welcomeSection').classList.remove('hidden');
            
            // Update welcome message
            document.getElementById('welcomeMessage').textContent = `Welcome, ${name}!`;
            
            // Enable start measuring button
            startMeasuringBtn.disabled = false;
            startMeasuringBtn.className = 'btn-enabled text-lg px-8 py-6 rounded-lg';
            startMeasuringBtn.textContent = 'Start Measuring Your Space';
            
            showToast('Details confirmed successfully!', 'success');
        }
    }

    function handleStartMeasuring() {
        if (customerDetails) {
            console.log('Starting measurement with customer details:', customerDetails);
            window.location.href = 'pages/measuring/measuring.html';
        }
    }
});

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}
