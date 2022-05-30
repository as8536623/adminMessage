// Inspired by https://github.com/Inndy/vue-clipboard2
const Clipboard = require('clipboard');
if (!Clipboard) {
    throw new Error('you shold npm install `clipboard` --save at first ');
}

export default {
    bind(el, binding) {
        if (binding.arg === 'success') {
            el._v_clipboard_success = binding.value; // eslint-disable-line
        } else if (binding.arg === 'error') {
            el._v_clipboard_error = binding.value; // eslint-disable-line
        } else {
            const clipboard = new Clipboard(el, {
                text() { return binding.value; },
                action() { return binding.arg === 'cut' ? 'cut' : 'copy'; }
            });
            clipboard.on('success', e => {
                const callback = el._v_clipboard_success;
        callback && callback(e) // eslint-disable-line
            });
            clipboard.on('error', e => {
                const callback = el._v_clipboard_error;
        callback && callback(e) // eslint-disable-line
            });
            el._v_clipboard = clipboard; // eslint-disable-line
        }
    },
    update(el, binding) {
        if (binding.arg === 'success') {
            el._v_clipboard_success = binding.value; // eslint-disable-line
        } else if (binding.arg === 'error') {
            el._v_clipboard_error = binding.value; // eslint-disable-line
        } else {
            el._v_clipboard.text = function() { return binding.value; };
            el._v_clipboard.action = function() { return binding.arg === 'cut' ? 'cut' : 'copy'; };
        }
    },
    unbind(el, binding) {
        if (binding.arg === 'success') {
            delete el._v_clipboard_success;
        } else if (binding.arg === 'error') {
            delete el._v_clipboard_error;
        } else {
            el._v_clipboard.destroy();
            delete el._v_clipboard;
        }
    }
};
