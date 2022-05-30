import {listFirstLevelCategory} from '@/api/courseCategory';

export const optColumnRenderFun = (h, param, that) => {
    const row = param.row;
    const optArr = [];
    const modifyShowOrderBtn = h('QgButton', {
        props: {
            toolTip: '修改排序',
            type: 'text',
            icon: 'el-icon-sort'
        },
        on: {
            click: () => {
                // 编辑
                that.handleOpt('modifyShowOrder', row);
            }
        }
    });

    const enableBtn = h('QgButton', {
        props: {
            toolTip: '启用',
            type: 'text',
            icon: 'enable'
        },
        on: {
            click: () => {
                // 编辑
                that.handleOpt('enable', row);
            }
        }
    });
    const disableBtn = h('QgButton', {
        props: {
            toolTip: '禁用',
            type: 'text',
            icon: 'disable'
        },
        on: {
            click: () => {
                that.handleOpt('disable', row);
            }
        }
    });
    const delBtn = h('QgButton', {
        props: {
            toolTip: '删除',
            type: 'text',
            icon: 'del'
        },
        on: {
            click: () => {
                that.handleOpt('delete', row);
            }
        }
    });

    optArr.push(modifyShowOrderBtn);
    if (row.status === 'ENABLED') {
        optArr.push(disableBtn);
    } else if (row.status === 'DISABLED' || row.status === 'DRAFT') {
        optArr.push(enableBtn);
    }

    optArr.push(delBtn);
    return h('div', optArr, '');
};

export function getFirstLevelCategory() {
    return new Promise((resolve, reject) => {
        const oneLevelCategoryArray = [];
        listFirstLevelCategory().then(result => {
            const response = result.data;
            if (response.success && response.success === true && response.data) {
                response.data.map(item => {
                    oneLevelCategoryArray.push({'code': item.id, 'name': item.name});
                });
            }

            resolve(oneLevelCategoryArray);
        });
    });
}
