let common = [
    'tests/e2e/features/**/*.feature',
    '--require-module ts-node/register',
    '--require tests/e2e/step-definitions/**/*',
    '--format @cucumber/pretty-formatter',
    '--format-options \'{"theme":{"feature keyword":["magenta","bold"],"scenario keyword":["magenta","bold"],"step keyword":["blue","bold"]}}\'',
    '--publish-quiet'
].join(' ');

module.exports = {
    default: common
};