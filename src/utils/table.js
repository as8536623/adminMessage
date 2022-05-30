/**
 * Created by xqq on 2018/08/19.
 */

export function getSplitListData(list, props) {
    const resultList = [];
    let key = props;
    const mergeCells = [];
    let rowsCount = 0;
    key = key.substring(0, props.length - 'List'.length);

    list.map((item, i) => {
        if (!item[props] || item[props].length === 0) {
            item[key] = {};
            resultList.push(item);
            rowsCount = rowsCount + 1;
        } else {
            item[props].map((obj, j) => {
                const tmpItem = Object.assign({}, item);
                tmpItem[key] = obj;
                resultList.push(tmpItem);
            });
            mergeCells.push({
                initRow: rowsCount,
                rowspan: item[props].length
            });
            rowsCount = rowsCount + item[props].length;
        }
    });
    return {
        mergeCells,
        list: resultList
    };
}

/**
 * 根据list
 * @param columns
 * @param list
 * @returns
 */
export function formatColumnsByList(columns, list) {
    if (!columns) {
        console.error('columns is empty!');
        return;
    }
    if (!(Array.isArray(list) && list.length)) {
        console.error('list must be not empty!');
        return;
    }
    const fields = [];
    const result = new Array(list.length);
    list.map(item => {
        fields.push(item.fieldName);
    });
    columns.map(column => {
        const index = fields.indexOf(column.field);
        result[index] = column;
    });

    return result.filter(field => !!field);
}

/**
 * 序列化出数组的字段
 * @param list
 * @param field
 * @returns {Array}
 */
export function listFieldsInList(list, field) {
    const result = [];
    list.map((item, index) => {
        const value = item[field];
        if (value) {
            result.push({
                showOrder: index,
                fieldName: value
            });
        }
    });
    return result;
}
