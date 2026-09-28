window.App = window.App || {};

App.Router = (() => {
    const routes = [];

    function register(pattern, render) {
        const paramNames = [];
        const regex = new RegExp(
            '^' +
            pattern.replace(/:([^/]+)/g, (_, name) => {
                paramNames.push(name);
                return '([^/]+)';
            }) +
            '$'
        );
        routes.push({ regex, paramNames, render });
    }

    function match(path) {
        for (const route of routes) {
            const m = path.match(route.regex);
            if (m) {
                const params = {};
                route.paramNames.forEach((name, i) => { params[name] = decodeURIComponent(m[i + 1]); });
                return { render: route.render, params };
            }
        }
        return null;
    }

    function render(hash) {
        const path = hash.startsWith('/') ? hash : '/';
        const found = match(path) || match('/');
        found.render(found.params);
    }

    function navigate(path) {
        location.hash = '#' + path;
    }

    function start() {
        render(location.hash.slice(1));

        window.addEventListener('hashchange', () => {
            const hash = location.hash.slice(1);
            if (!hash.startsWith('/')) return;
            render(hash);
        });
    }

    return { register, navigate, start };
})();
