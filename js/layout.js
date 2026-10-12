window.App = window.App || {};

App.Layout = (() => {
    const { html, icons } = App;

    const NAV_LINKS = [
        { path: '/catalog', label: 'Catalog' },
        { path: '/faq', label: 'FAQ' },
        { path: '/about', label: 'About' },
    ];

    function navItems() {
        return NAV_LINKS.map((link) => html`<li><a href="#${link.path}">${link.label}</a></li>`);
    }

    function setupTheme(root) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);

        root.querySelector('#theme-toggle').addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const newTheme = isDark ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    function setupMenu(root) {
        const nav = root.querySelector('header nav');
        const button = root.querySelector('#menu-toggle');

        function setOpen(isOpen) {
            nav.classList.toggle('nav-open', isOpen);
            button.setAttribute('aria-expanded', isOpen);
        }

        button.addEventListener('click', () => setOpen(!nav.classList.contains('nav-open')));
        nav.addEventListener('click', (event) => {
            if (event.target.closest('a')) setOpen(false);
        });
    }

    function mount(root) {
        root.innerHTML = html`
            <header>
                <nav aria-label="Main">
                    <ul>${navItems()}</ul>
                </nav>

                <a href="#/" class="logo">Shop</a>

                <div class="header-actions">
                    <button id="theme-toggle" class="icon-btn" aria-label="Toggle dark theme">
                        ${icons.sun}${icons.moon}
                    </button>
                    <button id="menu-toggle" class="menu-icon" aria-label="Menu" aria-expanded="false">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </header>

            <main id="view"></main>

            <footer>
                <div class="footer-content">
                    <div class="footer-brand">
                        <p class="footer-logo">Shop</p>
                        <p>Quality products, delivered fast.</p>
                    </div>

                    <nav class="footer-nav" aria-label="Footer">
                        <ul>${navItems()}</ul>
                    </nav>

                    <div class="footer-social">
                        <a href="https://instagram.com" target="_blank" rel="noopener">Instagram</a>
                        <a href="https://t.me" target="_blank" rel="noopener">Telegram</a>
                    </div>
                </div>

                <p class="footer-copyright">&copy; ${new Date().getFullYear()} Shop. All rights reserved.</p>
            </footer>
        `;

        setupTheme(root);
        setupMenu(root);
        return root.querySelector('#view');
    }

    return { mount };
})();
