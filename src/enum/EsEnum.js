class EsEnum {
    constructor(arr) {
        if (!Array.isArray(arr)) {
            throw Error('arr is not an array!');
        }

        // 初始化默认值
        arr.map(element => {
            if (typeof element.isShow === 'undefined') {
                element.isShow = true;
            }
        });

        // 保存源数组
        this.arr = arr;
        this.getTypeArr();
    }

    getIndex(code) {
        return this.typeArr.indexOf(code);
    }

    getTypeArr() {
        this.typeArr = [];
        this.arr.map(element => {
            if (!element.code || !element.name) {
                return;
            }
            // 保存code值组成的数组，方便A.getName(name)类型的调用
            this.typeArr.push(element.code);
            // 根据code生成不同属性值，以便A.B.name类型的调用
            Object.defineProperty(this, element.code, {
                value: element,
                writable: false
            });
            // this[element.code] = element;
        });
        return this;
    }

    // 根据code得到对象
    valueOf(code) {
        let prop = {code: '', name: ''};
        if (this.typeArr.indexOf(code) === -1) {
            prop = '';
            console.error(`${code}字段不存在该枚举数组中`);
        } else {
            prop = this.arr[this.typeArr.indexOf(code)];
        }
        return prop;
    }

    // 根据code获取name值
    getName(code) {
        const prop = this.valueOf(code);
        let name = '--';
        if (prop) {
            name = prop.name;
        }

        return name;
    }

    delArray(delArr) {
        const arrTypeCopy = [...this.typeArr];
        const arrCopy = [...this.arr];
        delArr.map(item => {
            const index = arrTypeCopy.indexOf(item);
            if (index !== -1) {
                arrTypeCopy.splice(index, 1);
                arrCopy.splice(index, 1);
            }
        });
        return arrCopy;
    }

    /**
     * 新增元素
     * @param arr 元素集合
     */
    addItems(arr) {
        this.arr = this.arr.concat(arr);
        this.getTypeArr();
    }

    /**
     * 改变显示状态
     * @param arr  元素集合({code: string, isShow: boolean})
     */
    changeStatus(arr) {
        arr.map(item => {
            this[item.code].isShow = item.isShow;
        });
    }

    /**
     * 改变显示状态
     * @param arr  元素集合({code: string, isShow: boolean})
     */
    changeStatusByCode(code, isShow) {
        this[code].isShow = isShow;
    }

    //
    setArr(arr) {
        this.arr = arr;
        this.getTypeArr();
        return this;
    }

    // 返回isShow=true源数组
    getValues() {
        const showArr = [];
        this.arr.map(element => {
            if (element.isShow !== 'undefined' && element.isShow) {
                showArr.push(element);
            }
        });

        return showArr;
    }

    getAllValues() {
        return this.arr;
    }
}

export default EsEnum;
