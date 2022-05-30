/**
 * 初始化树数据(index path | leaf)
 * @param data 树数据
 */
export function initTreeData(data, parentIndexPath, parent) {
    data.map((item, index) => {
        item.first = index === 0;
        item.last = index === data.length - 1;
        item.expand = false;
        item.parentIndexPath = `${parentIndexPath || ''}`;
        item.parentId = parent ? parent.id : '';
        item.parentName = parent ? parent.name : '';
        item.indexPath = parentIndexPath ? `${parentIndexPath}-${index}` : `${index}`;
        item.deep = item.indexPath.split('-').length;
        if (Array.isArray(item.child) && item.child.length) {
            item.child = initTreeData(item.child, item.indexPath, item);
            item.leaf = false;
        } else {
            item.leaf = true;
        }
    });

    return data;
}

/**
 * 根据层级筛选树节点
 * @param data 树数据
 * @param hierarchy 层级
 */
export function filterHierarchy(data, hierarchy) {
    hierarchy = Number.parseInt(hierarchy);
    data.map(item => {
        const deep = Number.parseInt(item.deep);
        if (deep >= hierarchy) {
            item.child = [];
        }

        if (Array.isArray(item.child) && item.child.length) {
            item.child = filterHierarchy(item.child, hierarchy);
        }
    });

    return data;
}

/**
 * 根据层级获取Ids
 * @param data
 * @param hierarchy
 */
export function getIdsByHierarchy(data, hierarchy) {
    const result = [];

    const getIds = (arr) => {
        arr.map(item => {
            const deep = Number.parseInt(item.deep || -1);
            if (hierarchy === 'ALL' || (deep >= 0 && deep < hierarchy)) {
                item.expand = true;
                result.push(item.id);

                if (Array.isArray(item.child) && item.child.length) {
                    getIds(item.child);
                }
            }
        });
    };
    getIds(data);

    return result;
}

/**
 * 节点展开时，根据节点信息，重新序列化tree data
 * @param data
 * @param node
 */
export function formatDataByNode(data, node) {
    const result = [];
    const items = [];

    const listChilds = (arr) => {
        arr.map(item => {
            if (Number(item.deep) > (Number(node.deep) + 1)) {
                return;
            }
            if (item.parentIndexPath && item.parentIndexPath === node.indexPath) {
                items.push(item.indexPath);
            } else if (Array.isArray(item.child) && item.child.length) {
                listChilds(item.child);
            }
        });
    };
    listChilds(data);

    const getDataByPath = (arr) => {
        arr.map(item => {
            if (item.parentIndexPath && items.includes(item.parentIndexPath)) {
                item.child = [];
                result.push(item);
            } else if (Array.isArray(item.child) && item.child.length) {
                getDataByPath(item.child);
            }
        });
    };
    getDataByPath(data);

    return result;
}

/**
 * 根据parentIndexPath分组
 * @param data
 */
export function groupListByParentPath(data) {
    const result = {};
    data.map(item => {
        if (!result[item.parentIndexPath]) {
            result[item.parentIndexPath] = [];
        }

        result[item.parentIndexPath].push(item);
    });

    return result;
}

/**
 * 根据parentIndexPath将数据插入到treeData
 * @param treeData
 * @param group
 */
export function appendDataToNode(treeData, group) {
    const ids = Object.keys(group);

    const checkNode = (arr) => {
        arr.map(item => {
            if (ids.includes(item.indexPath)) {
                item.child = group[item.indexPath];
            } else if (Array.isArray(item.child) && item.child.length) {
                checkNode(item.child);
            }
        });
    };
    checkNode(treeData);

    return treeData;
}

/**
 * 根据节点名称模糊搜索节点路径
 * @param data
 * @param name
 */
export function filterIndexPathByName(data, name) {
    const pathArr = [];

    const filterByName = (data) => {
        data.map(item => {
            if (item.name.includes(name)) {
                pathArr.push(item.indexPath);
            }
            if (Array.isArray(item.child) && item.child.length) {
                filterByName(item.child);
            }
        });
    };
    filterByName(data);

    return pathArr;
}

/**
 * 筛选indexPath
 * @param list
 */
export function uniqueListForLike(list) {
    for (let i = 0; i < list.length; i++) {
        let l = [];
        l = list.filter(item => {
            return item.includes(list[i]) && item !== list[i];
        });

        if (l.length) {
            list.splice(i, 1);
            i--;
        }
    }

    return list;
}

/**
 * 搜索树
 * @param treeData
 * @param path
 */
export function searchTreeData(treeData, path) {
    const filterNode = (data) => {
        for (let i = 0; i < data.length; i++) {
            const list = path.filter(item => {
                return item.startsWith(data[i].indexPath);
            });
            if (!list.length) {
                data.splice(i, 1);
                i--;
            } else if (Array.isArray(data[i].child) && data[i].child.length) {
                filterNode(data[i].child);
            }
        }
    };
    filterNode(treeData);

    return treeData;
}

/**
 * 根据idList获取path
 * @param data
 * @param list
 */
export function getPathById(data, list) {
    const result = [];
    const getPath = (arr) => {
        arr.map(item => {
            if (list.includes(item.id)) {
                result.push(item);
            }
            if (Array.isArray(item.child) && item.child.length) {
                getPath(item.child);
            }
        });
    };
    getPath(data);

    return result;
}
