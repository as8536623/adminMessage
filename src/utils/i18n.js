import {getRequest} from '@/api/convert/convert';
import i18n from '@/lang';

// translate router.meta.title, be used in breadcrumb sidebar tagsview
export function generateTitle(title) {
    const hasKey = this.$te(title);
    const translatedTitle = this.$t(title); // $t :this method from vue-i18n, inject in @/lang/index.js

    if (hasKey) {
        return translatedTitle;
    }
    return title;
}

export async function loadI18n(corpCode) {
    const url = `${process.env.CDN_URL}/i18n/${corpCode}/i18n.json`;
    // console.log('i18n url', url);
    const params = {url};
    const re = await getRequest(params);
    const {success, data} = re.data;
    if (success) {
        const msg = JSON.parse(data);
        const key = 'zh-CN';
        const locale = i18n.getLocaleMessage(key);
        for (const k in msg) {
            if (msg.hasOwnProperty(k)) {
                locale[k] = msg[k];
            }
        }
        i18n.setLocaleMessage(key, locale);
    } else if (corpCode !== 'dev') {
        loadI18n('dev');
    }
}
