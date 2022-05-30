import i18n from '@/lang';

const SINGLE = {
    id: '',
    type: 'SINGLE',
    title: i18n.t('单选题'),
    itemGroup: false,
    setting: [{type: 'required', value: false}],
    imgList: [],
    optionList: [
        {
            itemId: '',
            content: i18n.t('选项'),
            imgList: []
        },
        {
            itemId: '',
            content: i18n.t('选项'),
            imgList: []
        }
    ]
};

const MULTIPLE = {
    id: '',
    type: 'MULTIPLE',
    title: i18n.t('多选题'),
    itemGroup: true,
    setting: [{type: 'required', value: false}],
    imgList: [],
    itemList: [
        {
            id: '',
            content: i18n.t('选项'),
            imgList: []
        },
        {
            id: '',
            content: i18n.t('选项'),
            imgList: []
        }
    ]
};

// 填空题
const blank = {
    id: '',
    type: 'blank',
    title: i18n.t('填空题'),
    itemGroup: false,
    setting: [{type: 'required', value: false}],
    imgList: []
};

// 多项填空
const multiBlank = {
    id: '',
    type: 'multiBlank',
    title: i18n.t('填空题'),
    itemGroup: true,
    setting: [{type: 'required', value: false}],
    imgList: [],
    itemList: [
        {
            id: '',
            content: i18n.t('选项'),
            imgList: []
        },
        {
            id: '',
            content: i18n.t('选项'),
            imgList: []
        }
    ]
};

// 多项填空
const rate = {
    id: '',
    type: 'rate',
    title: i18n.t('打分题'),
    itemGroup: true,
    setting: [{type: 'required', value: false}],
    imgList: [],
    itemList: [
        {
            id: '',
            content: i18n.t('选项'),
            imgList: []
        },
        {
            id: '',
            content: i18n.t('选项'),
            imgList: []
        }
    ]
};

export default {SINGLE, MULTIPLE, blank, multiBlank, rate};
