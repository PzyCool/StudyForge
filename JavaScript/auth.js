// Authentication Pages JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeAuthPages();
});

function initializeAuthPages() {
    // Check if we're on signup page
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        initializeSignupForm();
    }

    // Check if we're on login page
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        initializeLoginForm();
    }

    // Initialize Google buttons
    initializeSocialButtons();
}

// ===== SIGNUP FORM FUNCTIONALITY =====
function initializeSignupForm() {
    const signupForm = document.getElementById('signup-form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const strengthFill = document.getElementById('strength-fill');
    const strengthText = document.getElementById('strength-text');
    const passwordMatch = document.getElementById('password-match');
    const submitBtn = document.getElementById('submit-btn');

    // Password Strength Checker
    function checkPasswordStrength(password) {
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength += 1;
        if (password.length >= 12) strength += 1;
        
        // Character variety checks
        if (/[a-z]/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
        
        // Determine strength level
        if (strength <= 2) {
            return { level: 'weak', width: '33%' };
        } else if (strength <= 4) {
            return { level: 'medium', width: '66%' };
        } else {
            return { level: 'strong', width: '100%' };
        }
    }

    // Update password strength indicator
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        
        if (password.length === 0) {
            strengthFill.className = 'strength-fill';
            strengthFill.style.width = '0%';
            strengthText.className = 'strength-text';
            strengthText.textContent = '';
            return;
        }
        
        const strength = checkPasswordStrength(password);
        strengthFill.className = `strength-fill ${strength.level}`;
        strengthFill.style.width = strength.width;
        strengthText.className = `strength-text ${strength.level}`;
        strengthText.textContent = strength.level.charAt(0).toUpperCase() + strength.level.slice(1);
        
        checkPasswordMatch();
    });

    // Check password match
    function checkPasswordMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (confirmPassword.length === 0) {
            passwordMatch.textContent = '';
            passwordMatch.className = 'password-match';
            return;
        }
        
        if (password === confirmPassword) {
            passwordMatch.textContent = '✓ Passwords match';
            passwordMatch.className = 'password-match match';
        } else {
            passwordMatch.textContent = '✗ Passwords do not match';
            passwordMatch.className = 'password-match mismatch';
        }
    }

    confirmPasswordInput.addEventListener('input', checkPasswordMatch);

    // Form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const termsAccepted = document.getElementById('terms').checked;
        
        // Validation
        if (!termsAccepted) {
            showMessage('Please accept the Terms of Service and Privacy Policy', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showMessage('Passwords do not match', 'error');
            return;
        }
        
        if (password.length < 8) {
            showMessage('Password must be at least 8 characters long', 'error');
            return;
        }
        
        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating Account...';
        submitBtn.classList.add('loading');
        
        // Simulate API call
        setTimeout(() => {
            // For demo purposes, just redirect to dashboard
            // In real app, handle actual signup logic
            console.log('Signup attempt:', { email, password });
            window.location.href = '../dashboard.html';
        }, 1500);
    });
}

// ===== LOGIN FORM FUNCTIONALITY =====
function initializeLoginForm() {
    const loginForm = document.getElementById('login-form');
    const loginBtn = document.getElementById('login-btn');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');

    // Form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value;
        const password = passwordInput.value;
        const rememberMe = document.getElementById('remember-me').checked;
        
        // Basic validation
        if (!email || !password) {
            showMessage('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }
        
        // Disable button and show loading
        loginBtn.disabled = true;
        loginBtn.textContent = 'Signing In...';
        loginBtn.classList.add('loading');
        
        // Simulate API call
        setTimeout(() => {
            // For demo purposes, just redirect to dashboard
            // In real app, handle actual login logic
            console.log('Login attempt:', { email, password, rememberMe });
            
            // Save to localStorage if remember me is checked
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            }
            
            window.location.href = '../dashboard.html';
        }, 1500);
    });

    // Check for remembered email
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        emailInput.value = rememberedEmail;
        document.getElementById('remember-me').checked = true;
    }
}

// ===== SOCIAL BUTTONS =====
function initializeSocialButtons() {
    // Google buttons
    document.querySelectorAll('.google-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // For demo purposes
            showMessage('Google authentication would be implemented here', 'info');
            
            // In real app, you would:
            // 1. Redirect to Google OAuth
            // 2. Handle callback
            // 3. Create account or login user
        });
    });
}

// ===== UTILITY FUNCTIONS =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showMessage(message, type = 'info') {
    // Remove any existing messages
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `auth-message auth-message-${type}`;
    messageEl.textContent = message;
    
    // Add styles
    messageEl.style.cssText = `
        padding: 1rem 1.25rem;
        border-radius: 0.75rem;
        margin-bottom: 1.5rem;
        font-weight: 500;
        text-align: center;
        border: 2px solid;
    `;
    
    // Set colors based on type
    if (type === 'error') {
        messageEl.style.backgroundColor = '#FEF2F2';
        messageEl.style.borderColor = '#FECACA';
        messageEl.style.color = '#DC2626';
    } else if (type === 'success') {
        messageEl.style.backgroundColor = '#F0FDF4';
        messageEl.style.borderColor = '#BBF7D0';
        messageEl.style.color = '#16A34A';
    } else {
        messageEl.style.backgroundColor = '#EFF6FF';
        messageEl.style.borderColor = '#BFDBFE';
        messageEl.style.color = '#2563EB';
    }
    
    // Insert message
    const form = document.querySelector('.auth-form');
    if (form) {
        form.parentNode.insertBefore(messageEl, form);
    }
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.parentNode.removeChild(messageEl);
        }
    }, 5000);
}

console.log('StudyForge Auth Pages Loaded!');