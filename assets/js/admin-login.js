
// Admin login functionality
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('adminLoginForm');
    form.addEventListener('submit', handleLogin);
    
    // Add friendly console message
    console.log('🛡️ Admin portal loaded - Welcome back, Administrator!');
});

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12.55 7.205m0 0L21 3m-8.45 4.205L9.878 9.878"/>
        `;
    } else {
        passwordInput.type = 'password';
        eyeIcon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
        `;
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');
    
    // Show loading state with friendly message
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<div class="loading-spinner"></div>Authenticating... 🔐';
    
    try {
        // Check admin credentials
        if (username === 'admin' && password === 'admin') {
            showToast('🎉 Welcome back, Administrator! Redirecting to your dashboard...', 'success');
            
            // Store admin info in localStorage for the React app to access
            localStorage.setItem('currentAdmin', username);
            localStorage.setItem('userRole', 'admin');
            localStorage.setItem('adminAuthenticated', 'true');
            
            setTimeout(() => {
                // Redirect to React admin dashboard
                window.location.href = '/admin-dashboard';
            }, 1500);
        } else {
            showToast('❌ Invalid credentials. Please check your username and password.', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('⚠️ Oops! Something went wrong. Please try again.', 'error');
    }
    
    // Reset button state
    loginBtn.disabled = false;
    loginBtn.innerHTML = 'Access Control Panel 🔐';
}

function goBack() {
    console.log('🏠 Returning to main page...');
    window.location.href = '/';
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.remove('hidden');
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 4000);
    }
}
