window.App = window.App || {};

App.Router = (() => {
    const routes = [];
    let outlet;
    let currentPath;

    function register(pattern, view) {
        routes.push({ pattern, view });
    }

    function decode(value) {
        try {
            return decodeURIComponent(value);
        } catch {
            return value;
        }
    }

    function matchPath(pattern, path) {
        const patternParts = pattern.split('/');
        const pathParts = path.split('/');
        if (patternParts.length !== pathParts.length) return null;

        const params = {};
        for (let i = 0; i < patternParts.length; i++) {
            if (patternParts[i].startsWith(':')) {
                params[patternParts[i].slice(1)] = decode(pathParts[i]);
            } else if (patternParts[i] !== pathParts[i]) {
                return null;
            }
        }
        return params;
    }

    function findRoute(path) {
        for (const route of routes) {
            const params = matchPath(route.pattern, path);
            if (params) return { view: route.view, params };
        }
        return null;
    }

    function render() {
        const [path, queryString = ''] = location.hash.slice(1).split('?');
        const route = findRoute(path) || findRoute('/');
        const result = route.view({ params: route.params, query: new URLSearchParams(queryString) });

        if (result.redirect) {
            location.replace('#' + result.redirect);
            return;
        }

        outlet.innerHTML = result.html;
        document.title = result.title ? `${result.title} · Shop` : 'Shop';
        if (path !== currentPath) window.scrollTo(0, 0);
        currentPath = path;
        if (result.mount) result.mount(outlet);
    }

    function navigate(path, query) {
        const queryString = query ? new URLSearchParams(query).toString() : '';
        location.hash = '#' + path + (queryString ? '?' + queryString : '');
    }

    function start(element) {
        outlet = element;
        window.addEventListener('hashchange', () => {
            const isPlainAnchor = location.hash !== '' && !location.hash.startsWith('#/');
            if (!isPlainAnchor) render();
        });
        render();
    }

    return { register, navigate, refresh: render, start };
})();
