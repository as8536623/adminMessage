import {loadCss} from '@/utils/file';

const themeArr = [];
// import '../assets/theme/bgk/index.css';

export function loadTheme(theme) {
    if (!themeArr.includes(theme) && theme !== 'dev') {
        const route = `${process.env.CDN_URL}/theme/saas/${theme}/index.css`;
        return new Promise((resolve, reject) => {
            loadCss(route).then(() => {
                resolve();
            }).catch(err => {
                reject();
            });
            themeArr.push(theme);
        });
    }
}
