import i18n from '@/lang';
import moment from 'moment';

export function getColumns(isEdit) {
    if (isEdit) {
        return [
            {
                type: 'checkbox'
            },
            {
                field: 'code',
                text: i18n.t('编号'),
                minWidth: 80
            },
            {
                field: 'name',
                text: i18n.t('名称'),
                minWidth: 120
            },
            {
                field: 'teacherName',
                text: i18n.t('讲师'),
                width: 130,
                render: (h, param) => {
                    const teacherName = param.row.teacherName;
                    return teacherName || '--';
                }
            },
            {
                field: 'createName',
                text: i18n.t('创建人'),
                width: 130,
                render: (h, param) => {
                const createName = param.row.createName;
                return createName || '--';
            }
            },
            {
                field: 'period',
                text: i18n.t('课时'),
                width: 60,
                align: 'center'
            },
            {
                field: 'categoryName',
                text: i18n.t('课程类别'),
                width: 110,
                align: 'center'
            },
            {
                field: 'copyrightPrice',
                text: i18n.t('版权费（元）'),
                align: 'center',
                width: 110,
                render: (h, param) => {
                    const copyrightPrice = param.row.copyrightPrice;
                    return copyrightPrice || '--';
                }
            },
            {
                field: 'flowPrice',
                text: i18n.t('流量费（元/G）'),
                align: 'center',
                width: 130,
                render: (h, param) => {
                    const flowPrice = param.row.flowPrice;
                    return flowPrice || '--';
                }
            },
            {
                field: 'countPrice',
                text: i18n.t('账号费（元/个）'),
                align: 'center',
                width: 130,
                render: (h, param) => {
                    const countPrice = param.row.countPrice;
                    return countPrice || '--';
                }
            },
            {
                field: 'useCount',
                text: i18n.t('账号使用数量'),
                align: 'center',
                width: 80,
                render: (h, param) => {
                    const countPrice = param.row.useCount;
                    return countPrice || '--';
                }
            },
            {
                field: 'publishDate',
                text: i18n.t('账号使用时间'),
                align: 'center',
                width: 80,
                render: (h, param) => {
                    const countPrice = param.row.publishDate;
                    return countPrice || '--';
                }
            }
        ];
    } else {
        return [
            {
                field: 'courseVo.code',
                text: i18n.t('编号'),
                minWidth: 120
            },
            {
                field: 'courseVo.name',
                text: i18n.t('标题'),
                minWidth: 140
            },
            {
                field: 'teacherName',
                text: i18n.t('讲师'),
                width: 130,
                render: (h, param) => {
                    if (param.row.courseVo){
                        const teacherName = param.row.courseVo.teacherNameList;
                        return teacherName || '--';
                    }

                    return '--';
                }
            },
            {
                field: 'createName',
                    text: i18n.t('创建人'),
                width: 130,
                render: (h, param) => {
                const createName = param.row.createName;
                return createName || '--';
            }
            },
            {
                field: 'courseVo.period',
                text: i18n.t('课时'),
                width: 60,
                align: 'center'
            },
            {
                field: 'courseVo.categoryName',
                text: i18n.t('课程类别'),
                width: 110,
                align: 'center'
            },
            {
                field: 'endAt',
                text: i18n.t('使用截止时间'),
                width: 120,
                align: 'center',
                render: (h, param) => {
                    const endAt = param.row.endAt;
                    return moment(endAt).format('YYYY-MM-DD');
                }
            },
            {
                field: 'courseCount',
                text: i18n.t('账号数'),
                width: 80,
                align: 'center'
            },
            {
                field: 'useCount',
                text: i18n.t('已用账号数'),
                width: 100,
                align: 'center'
            },
            {
                field: 'updateName',
                text: i18n.t('操作人'),
                width: 100,
                align: 'center'
            },
            {
                field: 'updatedAt',
                text: i18n.t('操作时间'),
                width: 150,
                align: 'center',
                render: (h, param) => {
                    const updatedAt = param.row.updatedAt;
                    return moment(updatedAt).format('YYYY-MM-DD');
                }
            }
        ];
    }
}
