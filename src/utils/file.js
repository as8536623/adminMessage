export function loadCss(url) {
    return new Promise((resolve, reject) => {
        // Get HTML head element
        const head = document.getElementsByTagName('HEAD')[0];

        // Create new link Element
        const link = document.createElement('link');

        // set the attributes for link element
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;

        // Append link element to HTML head
        head.appendChild(link);

        head.onload = () => {
            resolve();
        };

        head.onerror = () => {
            reject();
        };
    });
}
