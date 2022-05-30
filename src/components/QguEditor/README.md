## QguEditor 使用说明

> QguEditor 基于 [tinymce](https://www.tiny.cloud/docs-4x/) 4.9.2 版本开发

**支持v-model方式操作值**

#### 参数
| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- |
| id | 编辑器源DOM id | String | qgu-editor-时间戳 |
| value | 默认值 | String |      |
| toolbar | 工具栏 | Array | 见config.js |
| menubar | 顶部操作栏 | String | file edit insert |
| height | 高度 | Number, String | 360 |
| width | 宽度 | Number, String | auto |

#### 方法
| 方法名 | 说明 | 参数 |
| ---- | ---- | ---- |
| setContent | 塞值到编辑器中 | 接收一个String |
| getContent | 获取当前编辑器值 |  |