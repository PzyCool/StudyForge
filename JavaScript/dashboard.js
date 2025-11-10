// StudyForge Dashboard SPA JavaScript - RELIABLE VERSION
class StudyForgeApp {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'dashboard';
        this.learningPaths = [];
        this.init();
    }

    async init() {
        await this.loadCurrentUser();
        this.initializeSPA();
        this.initializeSidebar();
        this.initializeCommandPalette();
        this.initializeInbox();
        console.log('StudyForge SPA Loaded!');
    }

    async loadCurrentUser() {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.currentUser = {
                    id: 1,
                    email: 'user@studyforge.com',
                    name: null,
                    avatar: null,
                    joinDate: new Date().toISOString(),
                    streak: 0,
                    studyTime: null
                };
                this.updateUserInterface();
                resolve();
            }, 100);
        });
    }

    updateUserInterface() {
        const userEmailElement = document.getElementById('user-email');
        if (userEmailElement && this.currentUser) {
            userEmailElement.textContent = this.currentUser.email;
        }
    }

    initializeSPA() {
        this.contentArea = document.getElementById('content-area');
        this.breadcrumb = document.getElementById('breadcrumb');
        this.loadPage('dashboard');
    }

    initializeSidebar() {
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const sidebarItems = document.querySelectorAll('.sidebar-item[data-page]');
        
        sidebarToggle.addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('collapsed');
        });

        sidebarItems.forEach(item => {
            item.addEventListener('click', () => {
                const page = item.getAttribute('data-page');
                this.navigateTo(page);
            });
        });

        document.querySelector('.search-item').addEventListener('click', () => {
            this.openCommandPalette();
        });
    }

    initializeCommandPalette() {
        this.commandPalette = document.getElementById('command-palette');
        this.commandTrigger = document.getElementById('command-trigger');
        this.commandInput = document.getElementById('command-input');
        this.commandResults = document.getElementById('command-results');

        this.commands = [
            { icon: '🏠', text: 'Navigate to Dashboard', action: () => this.navigateTo('dashboard') },
            { icon: '📧', text: 'Open Inbox', action: () => this.navigateTo('inbox') },
            { icon: '🤖', text: 'Open AnnieWorld AI', action: () => this.navigateTo('annieworld') },
            { icon: '💻', text: 'Go to Practice Area', action: () => this.navigateTo('practice') },
            { icon: '🎯', text: 'View My Progress', action: () => this.navigateTo('progress') }
        ];

        this.setupCommandPalette();
    }

    setupCommandPalette() {
        this.commandTrigger.addEventListener('click', () => this.openCommandPalette());
        
        this.commandInput.addEventListener('input', (e) => {
            this.updateCommandResults(e.target.value);
        });

        this.commandInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeCommandPalette();
        });

        this.commandPalette.addEventListener('click', (e) => {
            if (e.target === this.commandPalette) this.closeCommandPalette();
        });

        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                this.openCommandPalette();
            }
        });
    }

    initializeInbox() {
        this.inboxSidebar = document.getElementById('inbox-sidebar');
        document.getElementById('close-inbox').addEventListener('click', () => this.closeInbox());
        this.inboxSidebar.addEventListener('click', (e) => {
            if (e.target === this.inboxSidebar) this.closeInbox();
        });
    }

    navigateTo(page, params = {}) {
        this.currentPage = page;
        this.currentParams = params;
        this.updateActiveSidebarItem(page);
        this.loadPage(page, params);
        this.updateBreadcrumb(page);
        this.closeInbox();
    }

    updateActiveSidebarItem(activePage) {
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeItem = document.querySelector(`[data-page="${activePage}"]`);
        if (activeItem) activeItem.classList.add('active');
    }

    updateBreadcrumb(page) {
        const pageTitles = {
            'dashboard': 'Dashboard',
            'inbox': 'Inbox', 
            'annieworld': 'AnnieWorld AI',
            'practice': 'Practice Area',
            'progress': 'My Progress',
            'create-path': 'Create Learning Path',
            'study-groups': 'Study Groups',
            'settings': 'Settings'
        };
        this.breadcrumb.textContent = pageTitles[page] || 'StudyForge';
    }

    async loadPage(page, params = {}) {
        console.log(`🚀 Loading page: ${page}`);
        
        try {
            const content = await this.fetchPageContent(page, params);
            this.contentArea.innerHTML = content;
            
            // Initialize page-specific functionality
            this.initializePageFunctionality(page);
            
        } catch (error) {
            console.error('Error loading page:', error);
            this.contentArea.innerHTML = '<div>Error loading page</div>';
        }
    }

    async fetchPageContent(page, params = {}) {
        const pageMap = {
            'dashboard': './Pages/dashboard/home.html',
            'inbox': './Pages/dashboard/inbox.html', 
            'annieworld': './Pages/dashboard/annieworld.html',
            'practice': './Pages/dashboard/practice-area.html',
            'progress': './Pages/dashboard/my-progress.html',
            'create-path': './Pages/dashboard/create-path.html',
            'learning-path': './Pages/dashboard/learning-path.html',
            'study-groups': './Pages/dashboard/study-groups.html',
            'discussions': './Pages/dashboard/community-discussions.html',
            'leaderboard': './Pages/dashboard/global-leaderboard.html',
            'join-group': './Pages/dashboard/join-group.html',
            'settings': './Pages/dashboard/settings.html',
            'trash': './Pages/dashboard/trash.html'
        };

        const filePath = pageMap[page];
        
        if (!filePath) {
            return '<div>Page not found</div>';
        }

        try {
            console.log(`📄 Fetching: ${filePath}`);
            const response = await fetch(filePath);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const content = await response.text();
            console.log(`✅ Loaded: ${filePath}`);
            return content;
            
        } catch (error) {
            console.error(`❌ Failed: ${filePath}`, error);
            return '<div>Failed to load page</div>';
        }
    }

    initializePageFunctionality(page) {
        console.log(`🎯 Initializing: ${page}`);
        
        // Wait for DOM to be ready
        setTimeout(() => {
            switch(page) {
                case 'dashboard':
                    this.initializeHomePage();
                    break;
                case 'inbox':
                    this.initializeInboxPage();
                    break;
                // Add other pages as we build them
                default:
                    this.initializeBasicPage();
            }
        }, 100);
    }

    initializeHomePage() {
        console.log('🏠 Initializing home page...');
        
        // 1. AI Promotion Dismiss
        const dismissBtn = document.querySelector('.dismiss-btn');
        if (dismissBtn) {
            dismissBtn.addEventListener('click', function() {
                const aiCard = this.closest('.ai-promotion-card');
                if (aiCard) {
                    aiCard.style.opacity = '0';
                    setTimeout(() => aiCard.remove(), 300);
                }
            });
        }

        // 2. Quick Access Widgets
        this.initializeQuickAccessWidgets();

        // 3. Paths Carousel
        this.initializePathsCarousel();

        // 4. Progress Dashboard
        this.initializeProgressDashboard();

        // 5. Activity Section
        this.initializeActivitySection();

        console.log('✅ Home page fully initialized!');
    }

    initializeQuickAccessWidgets() {
        const editBtn = document.querySelector('.edit-widgets-btn');
        if (!editBtn) return;

        // Widget data
        const availableWidgets = [
            { id: 'getting-started', name: 'Getting Started', icon: '👋', description: 'Setup your learning journey' },
            { id: 'new-path', name: 'New Learning Path', icon: '➕', description: 'Create a new study plan' },
            { id: 'practice', name: 'Practice Area', icon: '💻', description: 'Code challenges and exercises' },
            { id: 'progress', name: 'My Progress', icon: '📊', description: 'View your learning stats' },
            { id: 'annieworld', name: 'AnnieWorld AI', icon: '🤖', description: 'Get AI coding help' }
        ];

        // Get current widgets from localStorage or set defaults
        let currentWidgets = JSON.parse(localStorage.getItem('quickAccessWidgets') || '["getting-started", "new-path"]');
        
        // Initialize widgets display
        this.updateWidgetsDisplay(currentWidgets, availableWidgets);

        // Edit button click
        editBtn.addEventListener('click', () => {
            this.openWidgetEditor(currentWidgets, availableWidgets);
        });

        // Widget card clicks
        document.addEventListener('click', (e) => {
            const widgetCard = e.target.closest('.widget-card');
            if (widgetCard) {
                const widgetId = widgetCard.getAttribute('data-widget');
                this.handleWidgetClick(widgetId);
            }
        });
    }

    updateWidgetsDisplay(widgetIds, availableWidgets) {
        const widgetsContainer = document.querySelector('.quick-access-widgets');
        if (!widgetsContainer) return;
        
        widgetsContainer.innerHTML = '';
        
        widgetIds.forEach(widgetId => {
            const widgetData = availableWidgets.find(w => w.id === widgetId);
            if (widgetData) {
                const widgetElement = this.createWidgetElement(widgetData);
                widgetsContainer.appendChild(widgetElement);
            }
        });
    }

    createWidgetElement(widgetData) {
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

    handleWidgetClick(widgetId) {
        const widgetActions = {
            'getting-started': () => this.showGettingStartedWizard(),
            'new-path': () => this.navigateTo('create-path'),
            'practice': () => this.navigateTo('practice'),
            'progress': () => this.navigateTo('progress'),
            'annieworld': () => this.navigateTo('annieworld')
        };
        
        if (widgetActions[widgetId]) {
            widgetActions[widgetId]();
        }
    }

    showGettingStartedWizard() {
        alert('🎯 Welcome to StudyForge! Let\'s set up your learning journey.\n\n1. Create your first learning path\n2. Set your daily study goals\n3. Start learning with interactive lessons');
    }

    openWidgetEditor(currentWidgets, availableWidgets) {
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

        // Modal event listeners
        const closeModal = () => modal.classList.remove('active');
        
        document.querySelector('.close-modal').addEventListener('click', closeModal);
        document.querySelector('.cancel-edit').addEventListener('click', closeModal);
        
        document.querySelector('.save-widgets').addEventListener('click', () => {
            const selectedWidgets = [];
            document.querySelectorAll('.widget-editor-item input[type="checkbox"]:checked').forEach(checkbox => {
                const widgetId = checkbox.closest('.widget-editor-item').getAttribute('data-widget-id');
                selectedWidgets.push(widgetId);
            });
            
            localStorage.setItem('quickAccessWidgets', JSON.stringify(selectedWidgets));
            this.updateWidgetsDisplay(selectedWidgets, availableWidgets);
            closeModal();
        });
    }

    initializePathsCarousel() {
        const carousel = document.querySelector('.paths-carousel');
        const prevBtn = document.querySelector('.carousel-nav.prev');
        const nextBtn = document.querySelector('.carousel-nav.next');
        
        if (!carousel || !prevBtn || !nextBtn) return;
        
        const scrollAmount = 300;
        
        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
        
        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        // Path card clicks
        document.addEventListener('click', (e) => {
            const pathCard = e.target.closest('.path-card');
            if (pathCard) {
                const pathTitle = pathCard.querySelector('h4').textContent;
                this.handlePathCardClick(pathTitle);
            }
        });
    }

    handlePathCardClick(pathTitle) {
        if (pathTitle.includes('StudyForge')) {
            alert('📚 Opening StudyForge platform guide...');
        } else if (pathTitle.includes('JavaScript')) {
            this.navigateTo('create-path', { language: 'javascript' });
        } else if (pathTitle.includes('Python')) {
            this.navigateTo('create-path', { language: 'python' });
        } else if (pathTitle.includes('React')) {
            this.navigateTo('create-path', { language: 'react' });
        } else {
            this.navigateTo('create-path');
        }
    }

    initializeProgressDashboard() {
        // Load user progress data
        this.loadUserProgress();
    }

    loadUserProgress() {
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
        this.updateStat('current-streak', userData.streak);
        this.updateStat('total-time', userData.totalTime);
        this.updateStat('paths-completed', userData.pathsCompleted);
        this.updateStat('achievements-earned', userData.achievements);
        
        // Update active paths
        this.updateActivePaths(userData.activePaths);
    }

    updateStat(statId, value) {
        const element = document.getElementById(statId);
        if (element) {
            element.textContent = value;
        }
    }

    updateActivePaths(activePaths) {
        const pathsList = document.getElementById('active-paths-list');
        if (!pathsList) return;
        
        if (activePaths.length === 0) {
            pathsList.innerHTML = `
                <div class="empty-paths">
                    <p>No active learning paths yet</p>
                    <button class="btn btn-outline">Create Your First Path</button>
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

    initializeActivitySection() {
        // Event card interactions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-small')) {
                const eventCard = e.target.closest('.event-card');
                if (eventCard) {
                    const eventTitle = eventCard.querySelector('h4').textContent;
                    this.handleEventAction(eventTitle, e.target.textContent);
                }
            }
        });
    }

    handleEventAction(eventTitle, action) {
        if (action === 'RSVP') {
            alert(`✅ You've RSVP'd for: ${eventTitle}`);
        } else if (action === 'Join Group') {
            alert(`👥 Joining study group: ${eventTitle}`);
        }
    }

    initializeInboxPage() {
        // Basic inbox functionality
        console.log('📧 Initializing inbox page...');
    }

    initializeBasicPage() {
        // Add basic click handlers to all buttons on any page
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                console.log('Button clicked:', this.textContent);
            });
        });
    }

    openCommandPalette() {
        this.commandPalette.classList.add('active');
        this.commandInput.focus();
        this.updateCommandResults('');
    }

    closeCommandPalette() {
        this.commandPalette.classList.remove('active');
        this.commandInput.value = '';
    }

    updateCommandResults(query) {
        this.commandResults.innerHTML = '';
        
        const filteredCommands = this.commands.filter(cmd => 
            cmd.text.toLowerCase().includes(query.toLowerCase())
        );

        filteredCommands.forEach((cmd, index) => {
            const item = document.createElement('div');
            item.className = `command-result-item ${index === 0 ? 'selected' : ''}`;
            item.innerHTML = `
                <span class="command-result-icon">${cmd.icon}</span>
                <span class="command-result-text">${cmd.text}</span>
            `;
            item.addEventListener('click', () => {
                cmd.action();
                this.closeCommandPalette();
            });
            this.commandResults.appendChild(item);
        });
    }

    openInbox() {
        this.inboxSidebar.classList.add('active');
    }

    closeInbox() {
        this.inboxSidebar.classList.remove('active');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.studyForgeApp = new StudyForgeApp();
});