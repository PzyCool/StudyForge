// StudyForge Dashboard SPA JavaScript
class StudyForgeApp {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'dashboard';
        this.learningPaths = [];
        this.studyGroups = [];
        this.init();
    }

    async init() {
        await this.loadCurrentUser();
        await this.loadUserData();
        this.initializeSPA();
        this.initializeSidebar();
        this.initializeCommandPalette();
        this.initializeInbox();
        console.log('StudyForge SPA Loaded!');
    }

    // Load current user data
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

    // Load user-specific data
    async loadUserData() {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.learningPaths = [];
                this.studyGroups = [];
                this.updateSidebarContent();
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

    updateSidebarContent() {
        this.updateLearningPathsList();
    }

    updateLearningPathsList() {
        const learningPathsList = document.getElementById('learning-paths-list');
        
        if (this.learningPaths.length === 0) {
            learningPathsList.innerHTML = `
                <div class="empty-learning-paths">
                    <p>No learning paths yet</p>
                </div>
            `;
        } else {
            learningPathsList.innerHTML = this.learningPaths.map(path => `
                <div class="learning-path-item" data-path-id="${path.id}" data-page="learning-path">
                    <div class="language-icon ${path.language}">${this.getLanguageAbbr(path.language)}</div>
                    <span class="sidebar-text">${path.name}</span>
                    <span class="path-progress">${path.progress}%</span>
                </div>
            `).join('');
        }
    }

    getLanguageAbbr(language) {
        const abbrMap = {
            'javascript': 'JS', 'python': 'PY', 'java': 'JA', 'html': 'HT',
            'css': 'CS', 'react': 'RX', 'cpp': 'C+', 'ruby': 'RB',
            'php': 'PP', 'swift': 'SW', 'go': 'GO', 'rust': 'RS'
        };
        return abbrMap[language] || 'LP';
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

        document.addEventListener('click', (e) => {
            if (e.target.closest('.learning-path-item')) {
                const pathItem = e.target.closest('.learning-path-item');
                const pathId = pathItem.getAttribute('data-path-id');
                this.navigateTo('learning-path', { pathId });
            }
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
            { icon: '🎯', text: 'View My Progress', action: () => this.navigateTo('progress') },
            { icon: '➕', text: 'Create New Learning Path', action: () => this.navigateTo('create-path') },
            { icon: '👥', text: 'Join Study Group', action: () => this.navigateTo('join-group') },
            { icon: '⚙️', text: 'Open Settings', action: () => this.navigateTo('settings') }
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
            if (e.key === 'Enter') this.executeSelectedCommand();
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
        this.updateActiveSidebarItem(page, params);
        this.loadPage(page, params);
        this.updateBreadcrumb(page, params);
        this.closeInbox();
    }

    updateActiveSidebarItem(activePage, params = {}) {
        document.querySelectorAll('.sidebar-item, .learning-path-item').forEach(item => {
            item.classList.remove('active');
        });
        
        if (activePage === 'learning-path') {
            const activePath = document.querySelector(`[data-path-id="${params.pathId}"]`);
            if (activePath) activePath.classList.add('active');
        } else {
            const activeItem = document.querySelector(`[data-page="${activePage}"]`);
            if (activeItem) activeItem.classList.add('active');
        }
    }

    updateBreadcrumb(page, params = {}) {
        const pageTitles = {
            'dashboard': 'Dashboard', 'inbox': 'Inbox', 'annieworld': 'AnnieWorld AI',
            'practice': 'Practice Area', 'progress': 'My Progress', 'create-path': 'Create Learning Path',
            'learning-path': 'Learning Path', 'study-groups': 'Study Groups', 'discussions': 'Community Discussions',
            'leaderboard': 'Leaderboard', 'join-group': 'Join Study Group', 'settings': 'Settings', 'trash': 'Trash'
        };

        let title = pageTitles[page] || 'StudyForge';
        
        if (page === 'learning-path' && params.pathId) {
            const path = this.learningPaths.find(p => p.id == params.pathId);
            if (path) title = path.name;
        }

        this.breadcrumb.textContent = title;
    }

    async loadPage(page, params = {}) {
        console.log(`Loading page: ${page}`);
        const content = await this.fetchPageContent(page, params);
        this.contentArea.innerHTML = content;
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
            return '<div></div>'; // Return empty div if no page mapped
        }

        try {
            console.log(`Fetching: ${filePath}`);
            const response = await fetch(filePath);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const content = await response.text();
            console.log(`✅ Successfully loaded: ${filePath}`);
            return content;
            
        } catch (error) {
            console.error(`❌ Failed to load ${filePath}:`, error);
            // Return COMPLETELY EMPTY content - no fallback, no placeholder
            return '<div></div>';
        }
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

    executeSelectedCommand() {
        const selected = this.commandResults.querySelector('.selected');
        if (selected) selected.click();
    }

    openInbox() {
        this.inboxSidebar.classList.add('active');
    }

    closeInbox() {
        this.inboxSidebar.classList.remove('active');
    }

    async createLearningPath(pathData) {
        const newPath = {
            id: Date.now(),
            ...pathData,
            progress: 0,
            created: new Date().toISOString()
        };
        
        this.learningPaths.push(newPath);
        this.updateSidebarContent();
        this.navigateTo('learning-path', { pathId: newPath.id });
    }

    async joinStudyGroup(groupData) {
        const newGroup = {
            id: Date.now(),
            ...groupData,
            joined: new Date().toISOString()
        };
        
        this.studyGroups.push(newGroup);
        this.updateSidebarContent();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.studyForgeApp = new StudyForgeApp();
});