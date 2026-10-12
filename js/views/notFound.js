window.App = window.App || {};
App.Views = App.Views || {};

App.Views.notFound = function () {
    return {
        title: 'Page not found',
        html: App.html`
            <div class="app-page-inner narrow-page">
                <h2>Page not found</h2>
                <p>There is nothing at this address.</p>
                <a class="btn" href="#/">Go to the home page</a>
            </div>
        `,
    };
};
