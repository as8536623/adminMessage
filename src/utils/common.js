import store from '@/store';
import {getCategory} from '@/api/courseCategory';
import {listByType, listByTag} from '@/api/dictionary';

// 获取/缓存 行业基础数据
export async function getIndustry() {
    const industry = store.getters.industry;
    if (industry) {
        return industry;
    }
    const result = await listByType({type: 'TRADE'});
    const {success, data} = result.data;
    if (success) {
        await store.dispatch('setIndustry', data);
        return data;
    }
    return [];
}

// 获取/缓存 职业基础数据
export async function getJob() {
    const job = store.getters.job;
    if (job) {
        return job;
    }
    const result = await listByType({type: 'PROFESSION'});
    const {success, data} = result.data;
    if (success) {
        await store.dispatch('setJob', data);
        return data;
    }
    return [];
}

// 获取/缓存 学科基础数据
export async function getSubject() {
    const subject = store.getters.subject;
    if (subject) {
        return subject;
    }
    const result = await listByType({type: 'SUBJECT'});
    const {success, data} = result.data;
    if (success) {
        await store.dispatch('setSubject', data);
        return data;
    }
    return [];
}

// 获取课程根节点ID
export async function getRootCourseCategoryId() {
    const rootCourseCategoryId = store.getters.rootCourseCategoryId;
    if (rootCourseCategoryId) {
        return rootCourseCategoryId;
    }
    const result = await getCategory();
    const {success, data} = result.data;
    const {id} = data;
    if (success) {
        await store.dispatch('setRootCourseCategoryId', id);
        return id;
    }
    return '';
}

// 学科数据、行业数据、职业数据 转换成逗号分割字符串
export function transformCommonToCode(list) {
    if (!(Array.isArray(list) && list.length)) {
        return;
    }
    const arr = [];
    list.map(item => {
        if (!(Array.isArray(item) && item.length)) {
            return;
        }
        arr.push(item.pop());
    });

    return arr.join(',');
}

// 学科数据 逗号分割字符串改为数组
export function transformCodesToSubject(str) {
    let arr = [];
    if(!str.length) {
        return [];
    }
    arr = str.split(',');
    if (!(Array.isArray(arr) && arr.length)) {
        return [];
    }
    const result = [];
    arr.map(item => {
        const list = item.split('.');
        list.pop();
        list.push(item);
        result.push(list);
    });
    return result;
}

// 行业数据 逗号分割字符串改为数组
export function transformCodesToTrade(str) {
    const arr = str.split(',');
    if (!(Array.isArray(arr) && arr.length)) {
        return [];
    }
    const result = [];
    arr.map(item => {
        const list = [];
        list.push(item.slice(0, 1));
        list.push(item);
        result.push(list);
    });
    return result;
}

// 行业数据 逗号分割字符串改为数组
export function transformCodeToTrade(str) {
    return [str.slice(0, 1), str];
}

// 职业数据 逗号分割字符串改为数组
export function transformCodesToProfession(str) {
    const arr = str.split(',');
    if (!(Array.isArray(arr) && arr.length)) {
        return [];
    }
    const result = [];
    arr.map(item => {
        const list = [];
        list.push(item.slice(0, 1));
        list.push(item.slice(0, 3));
        list.push(item);
        result.push(list);
    });
    return result;
}

// 地址编号转为地址数组
export function transformsCodeToAddress(code) {
    const first = `${code.slice(0, 2)}0000`;
    const second = `${code.slice(0, 4)}00`;

    return [first, second, code];
}

const unshiftSelfClassic = function (list, limit = false) {
    return list.map(v => {
        v.children && !limit && unshiftSelfClassic(v.children, !v.children.length);
        const buffer = {...v};
        if (v.children && Array.isArray(v.children)) {
            delete buffer.children;
            buffer.name = `全部(${buffer.name})`;
            !limit && v.children.unshift(buffer);
        }
        return v;
    });
};

// 标签筛选数据
export async function getTag() {
    const result = await listByTag();
    const {success, data} = result.data;
    if (success) {
        return unshiftSelfClassic(data);
    }
    return [];
}
