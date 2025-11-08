// StudyForge Landing Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== MOBILE MENU FUNCTIONALITY =====
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }
    
    // ===== SMOOTH SCROLLING FOR NAVIGATION =====
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== PRICING CURRENCY CONVERTER + BILLING TOGGLE =====
    const currencySelect = document.getElementById('currency-select');
    const billingToggle = document.getElementById('billing-toggle');
    
    if (currencySelect && billingToggle) {
        // Currency symbols and formatting
        const currencyConfig = {
            USD: { symbol: '$', decimal: 2 },
            NGN: { symbol: '₦', decimal: 0 },
            GBP: { symbol: '£', decimal: 2 },
            EUR: { symbol: '€', decimal: 2 }
        };
        
        // Format price based on currency
        function formatPrice(amount, currency) {
            const config = currencyConfig[currency];
            const numAmount = parseFloat(amount);
            
            if (currency === 'NGN') {
                return config.symbol + Math.round(numAmount).toLocaleString('en-NG');
            } else {
                return config.symbol + numAmount.toFixed(config.decimal);
            }
        }
        
        // Update billing option styles
        function updateBillingStyles(isYearly) {
            const billingOptions = document.querySelectorAll('.billing-option');
            billingOptions.forEach(option => {
                option.classList.remove('active');
            });
            
            if (isYearly) {
                billingOptions[1].classList.add('active'); // Yearly option
            } else {
                billingOptions[0].classList.add('active'); // Monthly option
            }
        }
        
        // Update all prices
        function updatePrices() {
            const selectedCurrency = currencySelect.value;
            const isYearly = billingToggle.checked;
            
            console.log('Updating prices - Currency:', selectedCurrency, 'Yearly:', isYearly);
            
            // Update billing option styles
            updateBillingStyles(isYearly);
            
            document.querySelectorAll('.plan-price').forEach(planPrice => {
                const monthlyPrice = planPrice.querySelector('.price-amount.monthly');
                const yearlyPrice = planPrice.querySelector('.price-amount.yearly');
                const singlePrice = planPrice.querySelector('.price-amount:not(.monthly):not(.yearly)');
                
                // Handle free plan (single price)
                if (singlePrice && !monthlyPrice && !yearlyPrice) {
                    const price = singlePrice.dataset[selectedCurrency.toLowerCase()];
                    if (price !== undefined) {
                        singlePrice.textContent = formatPrice(price, selectedCurrency);
                    }
                    return;
                }
                
                // Handle pro plan (monthly/yearly)
                if (monthlyPrice && yearlyPrice) {
                    if (isYearly) {
                        monthlyPrice.style.display = 'none';
                        yearlyPrice.style.display = 'inline';
                        const price = yearlyPrice.dataset[selectedCurrency.toLowerCase()];
                        if (price !== undefined) {
                            yearlyPrice.textContent = formatPrice(price, selectedCurrency);
                        }
                    } else {
                        monthlyPrice.style.display = 'inline';
                        yearlyPrice.style.display = 'none';
                        const price = monthlyPrice.dataset[selectedCurrency.toLowerCase()];
                        if (price !== undefined) {
                            monthlyPrice.textContent = formatPrice(price, selectedCurrency);
                        }
                    }
                }
            });
        }
        
        // Event listeners for pricing
        currencySelect.addEventListener('change', updatePrices);
        billingToggle.addEventListener('change', updatePrices);
        
        // Also update when clicking on billing options
        document.querySelectorAll('.billing-option').forEach((option, index) => {
            option.addEventListener('click', function() {
                billingToggle.checked = index === 1; // 0=Monthly, 1=Yearly
                updatePrices();
            });
        });
        
        // Initialize prices
        updatePrices();
        
        // Save currency preference
        currencySelect.addEventListener('change', function() {
            localStorage.setItem('preferredCurrency', this.value);
        });
        
        // Load saved currency preference
        const savedCurrency = localStorage.getItem('preferredCurrency');
        if (savedCurrency) {
            currencySelect.value = savedCurrency;
            updatePrices();
        }
    }
    
    // ===== PRICING BUTTONS FUNCTIONALITY =====
    document.addEventListener('click', function(e) {
        // Get Started Free button
        if (e.target.classList.contains('free-btn') || 
            e.target.closest('.free-btn')) {
            e.preventDefault();
            window.location.href = 'Pages/signup.html';
        }
        
        // Start 7-Day Free Trial button
        if ((e.target.classList.contains('primary-btn') && 
            !e.target.classList.contains('start-learning-btn')) ||
            e.target.closest('.primary-btn:not(.start-learning-btn)')) {
            e.preventDefault();
            window.location.href = 'Pages/signup.html';
        }
        
        // Contact Sales button
        if ((e.target.classList.contains('secondary-btn') && 
            e.target.textContent.includes('Contact Sales')) ||
            (e.target.closest('.secondary-btn') && 
             e.target.closest('.secondary-btn').textContent.includes('Contact Sales'))) {
            e.preventDefault();
            window.location.href = 'mailto:sales@studyforge.com';
        }
    });
    
    // ===== LANGUAGE QUIZ MODAL =====
    // Find the specific quiz button in courses CTA
    const quizButton = document.querySelector('.courses-cta .btn-primary');
    
    if (quizButton) {
        quizButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Prevent other event listeners
            openQuizModal();
        });
    }
    
    function openQuizModal() {
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = `
            <div class="quiz-modal">
                <div class="modal-header">
                    <h3>Find Your Perfect First Language</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-content">
                    <div class="quiz-step active" id="step1">
                        <h4>What's your main goal?</h4>
                        <div class="quiz-options">
                            <button class="quiz-option" data-value="web">🌐 Build websites & web apps</button>
                            <button class="quiz-option" data-value="data">📊 Data science & AI</button>
                            <button class="quiz-option" data-value="mobile">📱 Mobile app development</button>
                            <button class="quiz-option" data-value="games">🎮 Game development</button>
                            <button class="quiz-option" data-value="career">💼 Career change into tech</button>
                        </div>
                    </div>
                    
                    <div class="quiz-step" id="step2">
                        <h4>How much coding experience do you have?</h4>
                        <div class="quiz-options">
                            <button class="quiz-option" data-value="none">🚀 Complete beginner</button>
                            <button class="quiz-option" data-value="some">📚 Some basic knowledge</button>
                            <button class="quiz-option" data-value="intermediate">💪 Intermediate in another language</button>
                        </div>
                    </div>
                    
                    <div class="quiz-step" id="step3">
                        <h4>How much time can you study per day?</h4>
                        <div class="quiz-options">
                            <button class="quiz-option" data-value="1h">⏰ 1 hour or less</button>
                            <button class="quiz-option" data-value="2h">📅 2-3 hours</button>
                            <button class="quiz-option" data-value="4h">🚀 4+ hours</button>
                        </div>
                    </div>
                    
                    <div class="quiz-result" id="result">
                        <h4>Your Perfect First Language is: <span id="language-result">JavaScript</span>!</h4>
                        <p id="language-description">Based on your goals and experience, we recommend starting with JavaScript.</p>
                        <button class="btn btn-primary start-learning-btn">Start Learning Now</button>
                    </div>
                    
                    <div class="quiz-progress">
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                        <div class="progress-text">Step <span id="current-step">1</span> of 3</div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalOverlay);
        
        // Quiz logic
        let currentStep = 1;
        const userAnswers = {};
        
        function updateProgress() {
            const progressFill = modalOverlay.querySelector('.progress-fill');
            const currentStepElement = modalOverlay.querySelector('#current-step');
            const progress = (currentStep / 3) * 100;
            
            progressFill.style.width = progress + '%';
            currentStepElement.textContent = currentStep;
        }
        
        function showStep(stepNumber) {
            modalOverlay.querySelectorAll('.quiz-step').forEach(step => {
                step.classList.remove('active');
            });
            const nextStep = modalOverlay.querySelector(`#step${stepNumber}`);
            if (nextStep) {
                nextStep.classList.add('active');
            }
            currentStep = stepNumber;
            updateProgress();
        }
        
        function showResult() {
            modalOverlay.querySelectorAll('.quiz-step').forEach(step => {
                step.classList.remove('active');
            });
            modalOverlay.querySelector('#result').classList.add('active');
            
            // Simple recommendation logic
            let recommendedLanguage = 'JavaScript';
            let description = 'Perfect for web development and beginners!';
            
            if (userAnswers.goal === 'data') {
                recommendedLanguage = 'Python';
                description = 'Ideal for data science, AI, and machine learning!';
            } else if (userAnswers.goal === 'mobile') {
                recommendedLanguage = 'JavaScript';
                description = 'Great for cross-platform mobile apps with React Native!';
            } else if (userAnswers.goal === 'games') {
                recommendedLanguage = 'C++';
                description = 'The industry standard for game development!';
            } else if (userAnswers.goal === 'career') {
                recommendedLanguage = 'JavaScript';
                description = 'High demand in the job market with great opportunities!';
            }
            
            document.getElementById('language-result').textContent = recommendedLanguage;
            document.getElementById('language-description').textContent = description;
        }
        
        // Event listeners for quiz
        modalOverlay.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', function() {
                const step = this.closest('.quiz-step');
                const stepId = step.id;
                
                if (stepId === 'step1') userAnswers.goal = this.dataset.value;
                if (stepId === 'step2') userAnswers.experience = this.dataset.value;
                if (stepId === 'step3') userAnswers.time = this.dataset.value;
                
                if (currentStep < 3) {
                    showStep(currentStep + 1);
                } else {
                    showResult();
                }
            });
        });
        
        // Close modal
        modalOverlay.querySelector('.close-modal').addEventListener('click', function() {
            document.body.removeChild(modalOverlay);
        });
        
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                document.body.removeChild(modalOverlay);
            }
        });
        
        // Start learning button
        modalOverlay.querySelector('.start-learning-btn')?.addEventListener('click', function() {
            window.location.href = 'Pages/signup.html';
        });
        
        updateProgress();
    }
    
    // ===== BUTTON REDIRECTS =====
    // Sign up buttons (excluding quiz and pricing buttons)
    document.querySelectorAll('.hero-buttons .btn-primary, .cta-buttons .btn-primary').forEach(button => {
        // Skip the quiz button
        if (!button.closest('.courses-cta')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'Pages/signup.html';
            });
        }
    });
    
    // Login buttons
    document.querySelectorAll('.nav-link[href*="login"]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'Pages/login.html';
        });
    });
    
    // Demo buttons
    document.querySelectorAll('.btn-secondary').forEach(button => {
        if (button.textContent.includes('Demo') || button.textContent.includes('Watch Demo')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                window.open('https://youtube.com', '_blank');
            });
        }
    });
    
    console.log('StudyForge Landing Page Loaded Successfully! 🚀');
});