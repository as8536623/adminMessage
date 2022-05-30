## prop说明
#### *fields*
  **必填**

  每列数据的字段名称,要求是一个数组
  ```javascript
    [{
        code: '***',
        name: '***'
    }, {
        code: '***',
        name: '***'
    }, {
        code: '***',
        name: '***'
    }]
  ```
  
#### *getDataUrl*
  **必填**

  获取数据的URL，String
  ```javascript
    "https://easy-mock.com/mock/5b7a17f11c63c01b27b30a46/example/"
  ```
  
#### *optUrl*
  **必填**

  操作数据的URL，String
  ```javascript
    "https://easy-mock.com/mock/5b7a17f11c63c01b27b30a46/example/"
  ```

#### *param*
  **选填**

  获取数据所带的参数
  ```javascript
    {
        id: "***",
        ph_code: "***"
    }
  ```
