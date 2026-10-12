window.App = window.App || {};

App.bindForm = function (form, rules, onValid) {
    form.addEventListener('input', (event) => {
        event.target.setCustomValidity('');
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const values = {};
        let firstInvalidField = null;
        for (const name of Object.keys(rules)) {
            const field = form.elements[name];
            values[name] = field.value.trim();

            const message = rules[name](values[name]);
            field.setCustomValidity(message);
            if (message && !firstInvalidField) firstInvalidField = field;
        }

        if (firstInvalidField) {
            firstInvalidField.reportValidity();
        } else {
            onValid(values);
        }
    });
};
