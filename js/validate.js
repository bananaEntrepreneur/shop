window.App = window.App || {};

App.Validate = (() => {
    const { LIMITS } = App.Store;

    function requiredText(value, label, max) {
        if (!value) return `${label} is required`;
        if (value.length > max) return `${label} must be ${max} characters or fewer`;
        return '';
    }

    function optionalText(value, label, max) {
        if (value.length > max) return `${label} must be ${max} characters or fewer`;
        return '';
    }

    function price(value) {
        if (!value) return 'Price is required';
        const amount = Number(value);
        if (!Number.isFinite(amount)) return 'Price must be a number';
        if (amount < 0) return 'Price cannot be negative';
        return '';
    }

    function imageUrl(value) {
        if (!value) return '';
        let parsed;
        try {
            parsed = new URL(value);
        } catch {
            return 'Image URL must be a valid http:// or https:// address';
        }
        return parsed.protocol === 'https:'
            ? ''
            : 'Image URL must start with https://';
    }

    const product = {
        name: (value) => requiredText(value, 'Name', LIMITS.productName),
        price,
        image: (value) => optionalText(value, 'Image URL', LIMITS.imageUrl) || imageUrl(value),
        description: (value) => optionalText(value, 'Description', LIMITS.description),
    };

    const category = {
        name: (value) => requiredText(value, 'Category name', LIMITS.categoryName),
    };

    return { product, category };
})();
