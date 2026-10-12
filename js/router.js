window.App = window.App || {};

App.Router = (() => {
    const routes = [];
    let outlet;
    let lastPath;

    function register(pattern, view) {
        const paramNames = [];
        const regex = new RegExp(
            '^' +
            pattern.replace(/:([^/]+)/g, (_, name) => {
                paramNames.push(name);
                return '([^/]+)';
            }) +
            '$'
        );
        routes.push({ regex, paramNames, view });
    }

    function match(path) {
        for (const route of routes) {
            const m = path.match(route.regex);
            if (m) {
                const params = {};
                try {
                    route.paramNames.forEach((name, i) => { params[name] = decodeURIComponent(m[i + 1]); });
                } catch {
                    return null;
                }
                return { view: route.view, params };
            }
        }
        return null;
    }

    function render() {
        const [rawPath, queryString] = location.hash.slice(1).split('?');
        const path = rawPath.startsWith('/') ? rawPath : '/';
        const found = match(path) || match('/');
        const result = found.view({ params: found.params, query: new URLSearchParams(queryString || '') });

        if (result.redirect) {
            location.replace('#' + result.redirect); // replace, not push: Back must not return to the dead URL
            return;
        }
        outlet.innerHTML = result.html;
        document.title = result.title ? `${result.title} · Shop` : 'Shop';
        if (path !== lastPath) scrollTo(0, 0); // a filter change only alters the query: keep the scroll
        lastPath = path;
        result.mount?.(outlet);
    }

    function navigate(path, query) {
        const queryString = query ? new URLSearchParams(query).toString() : '';
        location.hash = '#' + path + (queryString ? '?' + queryString : '');
    }

    function start(el) {
        outlet = el;
        window.addEventListener('hashchange', () => {
            const hash = location.hash;
            if (hash && !hash.startsWith('#/')) return;
            render();
        });
        render();
    }

    return { register, navigate, refresh: render, start };
})();
