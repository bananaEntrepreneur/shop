window.App = window.App || {};

App.escapeHtml = function (str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
};

(() => {
    class Raw {
        constructor(markup) { this.markup = markup; }
        toString() { return this.markup; }
    }

    const part = (value) => {
        if (value instanceof Raw) return value.markup;
        if (Array.isArray(value)) return value.map(part).join('');
        return App.escapeHtml(value ?? '');
    };

    App.raw = (markup) => new Raw(markup);
    App.html = (strings, ...values) => new Raw(strings.reduce((out, s, i) => out + part(values[i - 1]) + s));
})();
