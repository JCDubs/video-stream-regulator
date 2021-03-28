module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'eslint:recommended',
    ],
    globals: {
        '__dirname': true,
        process: true,
        require: true
    },
    rules: {
        quotes: ["error", "single", {
            "allowTemplateLiterals": true
        }],
    }
};