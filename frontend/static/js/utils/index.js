// frontend/static/js/utils/index.js
/**
 * Utils Module Index
 * Re-exports all utility modules
 */

export * from './helpers.js';
export * from './dom.js';
export * from './validators.js';

import helpers from './helpers.js';
import dom from './dom.js';
import validators from './validators.js';

export { helpers, dom, validators };

export default {
    ...helpers,
    ...dom,
    ...validators
};
