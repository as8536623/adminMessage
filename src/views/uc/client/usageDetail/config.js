import {
    DEAL_REFUND_STATUS_ENUM,
    ORDER_STATUS_ENUM,
    PAY_TYPE_ENUM
} from '@/enum';
import {VIP_CARD_TYPE_ENUM} from '@/enum/common.js';
// 表格展示配置
export const tableColumns = function() {
    return [
        {
            text: '订单编号',
            field: 'dealCode',
            align: 'center',
            minWidth: 140
        },
        {
            text: '商品名称',
            field: 'goodsNameKey',
            align: 'center',
            minWidth: 120,
            render: (h, param) => {
                const goodsNameKey = param.row.goodsNameKey;
                const {name = ''} = VIP_CARD_TYPE_ENUM.getName(goodsNameKey);
                return name === '' ? goodsNameKey : name;
            }
        },
        {
            text: '用户账号',
            field: 'memberKey',
            align: 'center',
            minWidth: 120
        },
        {
            text: '商品价格',
            field: 'totalPrice',
            align: 'center',
            minWidth: 120
        },
        {
            text: '实际支付价格',
            field: 'realPrice',
            align: 'center',
            minWidth: 120
        },
        {
            text: '支付状态',
            field: 'status',
            align: 'center',
            minWidth: 120,
            render: (h, param) => ORDER_STATUS_ENUM.getName(param.row.status)
        },
        {
            text: '退款状态',
            field: 'refundStatusEnum',
            align: 'center',
            minWidth: 120,
            render: (h, param) => DEAL_REFUND_STATUS_ENUM.getName(param.row.refundStatusEnum)
        },
        {
            text: '支付方式',
            field: 'payType',
            align: 'center',
            minWidth: 120,
            render: (h, param) => PAY_TYPE_ENUM.getName(param.row.payType)
        },
        /* {
            text: '开票状态',
            field: 'tryDemoCount',
            align: 'center',
            minWidth: 120,
            render: (h, param) => {
                return '--';
            }
        },*/
        {
            text: '创建时间',
            field: 'createdAt',
            align: 'center',
            minWidth: 160,
            render: (h, param) => {
                return param.row.createdAt.substring(0, 10);
            }
        }
    ];
};

export const saleTableColumns = function() {
    return [
        {
            text: '订单编号',
            field: 'dealCode',
            align: 'center',
            minWidth: 120
        },
        {
            text: '商品名称',
            field: 'goodsNameKey',
            align: 'center',
            minWidth: 120,
            render: (h, param) => {
                const goodsNameKey = param.row.goodsNameKey;
                const {name = ''} = VIP_CARD_TYPE_ENUM.getName(goodsNameKey);
                return name === '' ? goodsNameKey : name;
            }
        },
        {
            text: '商品价格',
            field: 'totalPrice',
            align: 'center',
            minWidth: 120
        },
        {
            text: '实际支付价格',
            field: 'realPrice',
            align: 'center',
            minWidth: 120,
            render: (h, param) => {
                return param.row.realPrice.toFixed(2);
            }
        },
        {
            text: '支付状态',
            field: 'status',
            align: 'center',
            minWidth: 120,
            render: (h, param) => ORDER_STATUS_ENUM.getName(param.row.status)
        },
        {
            text: '退款状态',
            field: 'refundStatusEnum',
            align: 'center',
            minWidth: 120,
            render: (h, param) => DEAL_REFUND_STATUS_ENUM.getName(param.row.refundStatusEnum)
        },
        {
            text: '实际退款金额',
            field: 'refundPrice',
            align: 'center',
            minWidth: 120,
            render: (h, param) => {
                return param.row.refundPrice.toFixed(2);
            }
        },
        {
            text: '创建时间',
            field: 'createdAt',
            align: 'center',
            minWidth: 160,
            render: (h, param) => {
                return param.row.createdAt.substring(0, 10);
            }
        }
    ];
};

