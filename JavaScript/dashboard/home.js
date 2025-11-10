// Home Page JavaScript
function initDashboardPage(params) {
    console.log('🏠 Initializing Home Page');
    
    // Initialize all home page functionality
    initializeAIPromotion();
    initializeQuickAccessWidgets();
    initializePathsCarousel();
    initializeProgressDashboard();
    initializeActivitySection();
    
    console.log('✅ Home page initialized successfully');
}

// ===== AI PROMOTION FUNCTIONALITY =====
function initializeAIPromotion() {
    const dismissBtn = document.querySelector('.dismiss-btn');
    
    if (dismissBtn) {
        dismissBtn.addEventListener('click', function() {
            const aiCard = this.closest('.ai-promotion-card');
            if (aiCard) {
                aiCard.style.opacity = '0';
                aiCard.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    aiCard.remove();
                    // Save dismissal preference to localStorage
                    localStorage.setItem('aiPromotionDismissed', 'true');
                }, 300);
            }
        });
    }
    
    // Check if user previously dismissed the card
    if (localStorage.getItem('aiPromotionDismissed') === 'true') {
        const aiCard = document.querySelector('.ai-promotion-card');
        if (aiCard) {
            aiCard.remove();
        }
    }
}

// ===== QUICK ACCESS WIDGETS FUNCTIONALITY =====
function initializeQuickAccessWidgets() {
    const editBtn = document.querySelector('.edit-widgets-btn');
    const widgetModal = document.getElementById('widget-editor');
    const closeModal = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-edit');
    const saveBtn = document.querySelector('.save-widgets');
    
    // Widget data structure
    const availableWidgets = [
        { id: 'getting-started', name: 'Getting Started', icon: '👋', description: 'Setup your learning journey' },
        { id: 'new-path', name: 'New Learning Path', icon: '➕', description: 'Create a new study plan' },
        { id: 'practice', name: 'Practice Area', icon: '💻', description: 'Code challenges and exercises' },
        { id: 'progress', name: 'My Progress', icon: '📊', description: 'View your learning stats' },
        { id: 'annieworld', name: 'AnnieWorld AI', icon: '🤖', description: 'Get AI coding help' },
        { id: 'community', name: 'Community', icon: '👥', description: 'Join study groups' }
    ];
    
    // Get current widgets from localStorage or set defaults
    let currentWidgets = JSON.parse(localStorage.getItem('quickAccessWidgets') || '["getting-started", "new-path"]');
    
    // Initialize widgets display
    updateWidgetsDisplay(currentWidgets);
    
    // Edit button click
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            openWidgetEditor(currentWidgets);
        });
    }
    
    // Widget card clicks
    document.addEventListener('click', function(e) {
        const widgetCard = e.target.closest('.widget-card');
        if (widgetCard) {
            const widgetId = widgetCard.getAttribute('data-widget');
            handleWidgetClick(widgetId);
        }
    });
    
    // Modal event listeners
    if (closeModal) {
        closeModal.addEventListener('click', closeWidgetEditor);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeWidgetEditor);
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', saveWidgetChanges);
    }
    
    // Close modal when clicking outside
    if (widgetModal) {
        widgetModal.addEventListener('click', function(e) {
            if (e.target === widgetModal) {
                closeWidgetEditor();
            }
        });
    }
    
    function updateWidgetsDisplay(widgetIds) {
        const widgetsContainer = document.querySelector('.quick-access-widgets');
        if (!widgetsContainer) return;
        
        widgetsContainer.innerHTML = '';
        
        widgetIds.forEach(widgetId => {
            const widgetData = availableWidgets.find(w => w.id === widgetId);
            if (widgetData) {
                const widgetElement = createWidgetElement(widgetData);
                widgetsContainer.appendChild(widgetElement);
            }
        });
    }
    
    function createWidgetElement(widgetData) {
        const div = document.createElement('div');
        div.className = 'widget-card';
        div.setAttribute('data-widget', widgetData.id);
        div.innerHTML = `
            <div class="widget-icon">${widgetData.icon}</div>
            <div class="widget-content">
                <h4>${widgetData.name}</h4>
                <p>${widgetData.description}</p>
            </div>
        `;
        return div;
    }
    
    function handleWidgetClick(widgetId) {
        const widgetActions = {
            'getting-started': () => showGettingStartedWizard(),
            'new-path': () => window.studyForgeApp.navigateTo('create-path'),
            'practice': () => window.studyForgeApp.navigateTo('practice'),
            'progress': () => window.studyForgeApp.navigateTo('progress'),
            'annieworld': () => window.studyForgeApp.navigateTo('annieworld'),
            'community': () => window.studyForgeApp.navigateTo('study-groups')
        };
        
        if (widgetActions[widgetId]) {
            widgetActions[widgetId]();
        }
    }
    
    function showGettingStartedWizard() {
        // Simple alert for now - can be expanded to a full modal wizard
        alert('🎯 Welcome to StudyForge! Let\'s set up your learning journey.\n\n1. Create your first learning path\n2. Set your daily study goals\n3. Start learning with interactive lessons\n4. Track your progress and earn achievements');
    }
    
    function openWidgetEditor(currentWidgets) {
        const modal = document.getElementById('widget-editor');
        const availableWidgetsContainer = document.querySelector('.available-widgets');
        
        if (!modal || !availableWidgetsContainer) return;
        
        // Populate available widgets
        availableWidgetsContainer.innerHTML = availableWidgets.map(widget => `
            <div class="widget-editor-item ${currentWidgets.includes(widget.id) ? 'selected' : ''}" data-widget-id="${widget.id}">
                <div class="widget-editor-icon">${widget.icon}</div>
                <div class="widget-editor-content">
                    <h4>${widget.name}</h4>
                    <p>${widget.description}</p>
                </div>
                <div class="widget-checkbox">
                    <input type="checkbox" ${currentWidgets.includes(widget.id) ? 'checked' : ''}>
                </div>
            </div>
        `).join('');
        
        modal.classList.add('active');
    }
    
    function closeWidgetEditor() {
        const modal = document.getElementById('widget-editor');
        if (modal) {
            modal.classList.remove('active');
        }
    }
    
    function saveWidgetChanges() {
        const selectedWidgets = [];
        const checkboxes = document.querySelectorAll('.widget-editor-item input[type="checkbox"]:checked');
        
        checkboxes.forEach(checkbox => {
            const widgetItem = checkbox.closest('.widget-editor-item');
            const widgetId = widgetItem.getAttribute('data-widget-id');
            selectedWidgets.push(widgetId);
        });
        
        // Save to localStorage
        localStorage.setItem('quickAccessWidgets', JSON.stringify(selectedWidgets));
        currentWidgets = selectedWidgets;
        
        // Update display
        updateWidgetsDisplay(selectedWidgets);
        closeWidgetEditor();
        
        console.log('✅ Widgets updated:', selectedWidgets);
    }
}

// ===== PATHS CAROUSEL FUNCTIONALITY =====
function initializePathsCarousel() {
    const carousel = document.querySelector('.paths-carousel');
    const prevBtn = document.querySelector('.carousel-nav.prev');
    const nextBtn = document.querySelector('.carousel-nav.next');
    
    if (!carousel || !prevBtn || !nextBtn) return;
    
    const scrollAmount = 300;
    
    prevBtn.addEventListener('click', function() {
        carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        updateCarouselButtons();
    });
    
    nextBtn.addEventListener('click', function() {
        carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        updateCarouselButtons();
    });
    
    function updateCarouselButtons() {
        // Simple implementation - can be enhanced with more precise calculations
        const isAtStart = carousel.scrollLeft <= 10;
        const isAtEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 10;
        
        prevBtn.disabled = isAtStart;
        nextBtn.disabled = isAtEnd;
    }
    
    // Path card clicks
    document.addEventListener('click', function(e) {
        const pathCard = e.target.closest('.path-card');
        if (pathCard) {
            const pathTitle = pathCard.querySelector('h4').textContent;
            handlePathCardClick(pathTitle);
        }
    });
    
    function handlePathCardClick(pathTitle) {
        // For demo purposes - in real app, this would navigate to the specific path
        if (pathTitle.includes('StudyForge')) {
            // Platform tutorial
            alert('📚 Opening StudyForge platform guide...');
        } else if (pathTitle.includes('JavaScript')) {
            window.studyForgeApp.navigateTo('create-path', { language: 'javascript' });
        } else if (pathTitle.includes('Python')) {
            window.studyForgeApp.navigateTo('create-path', { language: 'python' });
        } else if (pathTitle.includes('React')) {
            window.studyForgeApp.navigateTo('create-path', { language: 'react' });
        } else {
            // Generic path creation
            window.studyForgeApp.navigateTo('create-path');
        }
    }
    
    // Initialize button states
    updateCarouselButtons();
}

// ===== PROGRESS DASHBOARD FUNCTIONALITY =====
function initializeProgressDashboard() {
    // Load user progress data
    loadUserProgress();
    
    // Set up periodic updates
    setInterval(loadUserProgress, 30000); // Update every 30 seconds
}

function loadUserProgress() {
    // Simulate loading user data
    const userData = {
        streak: 7,
        totalTime: '45h',
        pathsCompleted: 2,
        achievements: 5,
        activePaths: [
            { name: 'JavaScript Mastery', progress: 65 },
            { name: 'Python Fundamentals', progress: 30 }
        ]
    };
    
    // Update stats
    updateStat('current-streak', userData.streak);
    updateStat('total-time', userData.totalTime);
    updateStat('paths-completed', userData.pathsCompleted);
    updateStat('achievements-earned', userData.achievements);
    
    // Update active paths
    updateActivePaths(userData.activePaths);
}

function updateStat(statId, value) {
    const element = document.getElementById(statId);
    if (element) {
        element.textContent = value;
    }
}

function updateActivePaths(activePaths) {
    const pathsList = document.getElementById('active-paths-list');
    if (!pathsList) return;
    
    if (activePaths.length === 0) {
        pathsList.innerHTML = `
            <div class="empty-paths">
                <p>No active learning paths yet</p>
                <button class="btn btn-outline" onclick="window.studyForgeApp.navigateTo('create-path')">
                    Create Your First Path
                </button>
            </div>
        `;
    } else {
        pathsList.innerHTML = activePaths.map(path => `
            <div class="active-path-item">
                <div class="path-progress-bar">
                    <div class="progress-fill" style="width: ${path.progress}%"></div>
                </div>
                <div class="path-details">
                    <span class="path-name">${path.name}</span>
                    <span class="path-percentage">${path.progress}%</span>
                </div>
            </div>
        `).join('');
    }
}

// ===== ACTIVITY SECTION FUNCTIONALITY =====
function initializeActivitySection() {
    // Event card interactions
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-small')) {
            const eventCard = e.target.closest('.event-card');
            if (eventCard) {
                const eventTitle = eventCard.querySelector('h4').textContent;
                handleEventAction(eventTitle, e.target.textContent);
            }
        }
    });
}

function handleEventAction(eventTitle, action) {
    if (action === 'RSVP') {
        alert(`✅ You've RSVP'd for: ${eventTitle}`);
    } else if (action === 'Join Group') {
        alert(`👥 Joining study group: ${eventTitle}`);
    }
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export for global access
window.initDashboardPage = initDashboardPage;