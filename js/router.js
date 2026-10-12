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
        if (pattern === '*') return {};

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
        const [hashPath, queryString = ''] = location.hash.slice(1).split('?');
        const path = hashPath || '/';
        const route = findRoute(path);
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
        window.addEventListener('hashchange', render);
        render();
    }

    return { register, navigate, refresh: render, start };
})();
