## prop说明
#### *data*
  **必填**

  原始数据,要求是一个数组
  ```javascript
    [{
      key1: value1,
      key2: value2
    },
    {
      key1: value1
    }]
  ```

#### columns
  列属性,要求是一个数组

  1. text: 显示在表头的文字
  2. field: 对应data的key
  3. width: 每列的宽度，为一个数字(可选)
  4. render
   
  如果你有几个字段是需要自定义的，几个不需要，那么可以将不需要自定义的字段放入columns，将需要自定义的内容放入到slot中，详情见后文
  ```javascript
  [{
    value:string,
    text:string,
    width:number,
    render:()=>{
        
    }
  },{
    value:string,
    text:string,
    width:number
  }]
  ```
  
 ## 其他
  如果有其他的需求，请参考[el-table](http://element-cn.eleme.io/#/en-US/component/table)的api自行修改index.vue
