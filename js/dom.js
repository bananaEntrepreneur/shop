window.App = window.App || {};

App.escapeHtml = function (str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
};

App.raw = function (markup) {
    return { isRaw: true, markup, toString: () => markup };
};

App.toHtml = function (value) {
    if (value?.isRaw) return value.markup;
    if (Array.isArray(value)) return value.map(App.toHtml).join('');
    return App.escapeHtml(value ?? '');
};

App.html = function (strings, ...values) {
    let markup = strings[0];
    values.forEach((value, i) => {
        markup += App.toHtml(value) + strings[i + 1];
    });
    return App.raw(markup);
};
