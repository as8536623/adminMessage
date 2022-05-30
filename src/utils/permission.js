import store from '@/store';

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
    if (value && typeof value === 'string') {
        const permissions = store.getters && store.getters.permissions;

        const hasPermission = permissions.indexOf('*') > -1 || permissions.indexOf(value) > -1;

        if (!hasPermission) {
            return false;
        }
        return true;
    } else {
        console.error(`need roles! `);
        return false;
    }
}

