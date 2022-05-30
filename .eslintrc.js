module.exports = {
    root: true,
    parserOptions: {
        parser: '@babel/eslint-parser',
        sourceType: 'module'
    },
    env: {
        browser: true,
        node: true,
        es6: true
    },
    extends: ['plugin:vue/recommended', 'eslint:recommended'],

    // add your custom rules here
    //it is base on https://github.com/vuejs/eslint-config-vue

    // 等级分为三级： 0-不显示；1-显示警告warning; 2-显示错误error
    rules: {
        // 多个特性的元素应该分多行撰写，每个特性一行
        'vue/max-attributes-per-line': [
            2,
            {
                singleline: 10,
                multiline: {
                    max: 1,
                    allowFirstLine: false
                }
            }
        ],

        // vue template 缩进 4空格
        'vue/html-indent': [2, 4],

        // js 缩进 4空格
        'vue/script-indent': [
            'error',
            4,
            {
                baseIndent: 1,
                switchCase: 1
            }
        ],
        /**
         * 模版中开始标签的反尖括号前禁止有空格，自闭和标签前必须有空格
         * @category Improving Readability
         * @fixable
         */
        'vue/html-closing-bracket-spacing': [
            'error',
            {
                selfClosingTag: 'never'
            }
        ],
        // 在单行元素的内容前后需要换行符 (关闭)
        'vue/singleline-html-element-content-newline': 'off',

        // 在多行元素的内容之前和之后需要换行符 (关闭)
        'vue/multiline-html-element-content-newline': 'off',

        // JS/JSX中的组件名应该始终是帕斯卡命名法
        'vue/name-property-casing': ['error', 'PascalCase'],

        // 禁止使用 v-html (关闭)
        'vue/no-v-html': 'off',

        // 强制箭头函数的箭头前后使用一致的空格
        'arrow-spacing': [
            2,
            {
                before: true,
                after: true
            }
        ],

        // 强制在代码块中开括号前和闭括号后有空格
        'block-spacing': [2, 'always'],

        // 强制在代码块中使用一致的大括号风格
        'brace-style': [
            2,
            '1tbs',
            {
                allowSingleLine: true // 允许单行大括号
            }
        ],

        // 强制驼峰命名法
        camelcase: [
            2,
            {
                properties: 'always',
                allow: [
                    '^\\$_'
                    // use $_ for mixins properties
                    // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
                ]
            }
        ],

        // 禁止末尾逗号
        'comma-dangle': [2, 'never'],

        // 逗号前无需空格，逗号后要求空格
        'comma-spacing': [
            2,
            {
                before: false,
                after: true
            }
        ],

        // 逗号风格，在每行最后
        'comma-style': [2, 'last'],

        // 构造函数中必须有 super
        'constructor-super': 2,

        // 大括号不能省略
        curly: [2, 'all'],

        // 禁止文件末尾保留一行空行 https://eslint.bootcss.com/docs/4.0.0/rules/eol-last/
        'eol-last': [2, 'always'],

        // 强制使用 === | !==
        eqeqeq: [
            'error',
            'always',
            {
                null: 'ignore' // 除了与 null 字面量进行比较时，总是强制使用绝对相等
            }
        ],

        // 代码缩进
        indent: 'off',

        // 强制在对象字面量的键和值之间使用一致的空格
        'key-spacing': [
            2,
            {
                beforeColon: false,
                afterColon: true
            }
        ],

        // 强制在关键字前后使用一致的空格
        'keyword-spacing': [
            2,
            {
                before: true,
                after: true
            }
        ],

        // 要求构造函数首字母大写
        'new-cap': [
            2,
            {
                newIsCap: true,
                capIsNew: false
            }
        ],

        // 禁止使用 Array 构造函数
        'no-array-constructor': 2,

        // 禁用 console（关闭）
        'no-console': 'off',

        // 不允许修改类声明的变量
        'no-class-assign': 2,

        // 禁止条件表达式中出现赋值操作符
        'no-cond-assign': 2,

        // 禁止修改 const 声明的变量
        'no-const-assign': 2,

        // 禁止在正则表达式中使用控制字符
        'no-control-regex': 0,

        // 禁止删除变量
        'no-delete-var': 2,

        // 禁止 function 定义中出现重名参数
        'no-dupe-args': 2,

        // 禁止类成员中出现重复的名称
        'no-dupe-class-members': 2,

        // 禁止对象字面量中出现重复的 key
        'no-dupe-keys': 2,

        // 禁止出现重复的 case 标签
        'no-duplicate-case': 2,

        // 禁止在正则表达式中使用空字符集
        'no-empty-character-class': 2,

        // 禁止使用空解构模式
        'no-empty-pattern': 2,

        // 禁止对 catch 子句的参数重新赋值
        'no-ex-assign': 2,

        // 禁止扩展原生类型
        'no-extend-native': 2,

        // 禁止不必要的函数绑定
        'no-extra-bind': 2,

        // 禁止不必要的布尔转换
        'no-extra-boolean-cast': 2,

        // 禁止不必要的括号
        'no-extra-parens': [2, 'functions'],

        // 禁止 case 语句落空
        'no-fallthrough': 2,

        // 禁止数字字面量中使用前导和末尾小数点(.5 -> 0.5)
        'no-floating-decimal': 2,

        // 禁止对 function 声明重新赋值
        'no-func-assign': 2,

        // 禁止在嵌套的块中出现变量声明或 function 声明
        'no-inner-declarations': [2, 'functions'],

        // 禁止 RegExp 构造函数中存在无效的正则表达式字符串
        'no-invalid-regexp': 2,

        // 禁止不规则的空白
        'no-irregular-whitespace': 2,

        // 不允许标签与变量同名
        'no-label-var': 2,

        // 禁用标签语句
        'no-labels': [
            2,
            {
                allowLoop: false,
                allowSwitch: false
            }
        ],

        // 禁用不必要的嵌套块
        'no-lone-blocks': 2,

        // 禁止空格和 tab 的混合缩进
        'no-mixed-spaces-and-tabs': 2,

        // 禁止使用多个空格
        'no-multi-spaces': 2,

        // 禁止使用多行字符串
        'no-multi-str': 2,

        // 禁止出现多行空行
        'no-multiple-empty-lines': [
            2,
            {
                max: 1
            }
        ],

        // 禁止对原生对象或只读的全局对象进行赋值
        'no-global-assign': 2,

        // 禁止对关系运算符的左操作数使用否定操作符
        'no-unsafe-negation': 2,

        // 禁用 Object 的构造函数
        'no-new-object': 2,

        // 禁止调用 require 时使用 new 操作符
        'no-new-require': 2,

        // 	禁止 Symbolnew 操作符和 new 一起使用
        'no-new-symbol': 2,

        // 禁止对 String，Number 和 Boolean 使用 new 操作符
        'no-new-wrappers': 2,

        // 禁止把全局对象作为函数调用
        'no-obj-calls': 2,

        // 禁止多次声明同一变量
        'no-redeclare': 2,

        // 禁止正则表达式字面量中出现多个空格
        'no-regex-spaces': 2,

        // 禁止在 return 语句中使用赋值语句
        'no-return-assign': [2, 'except-parens'],

        // 禁止自我赋值
        'no-self-assign': 2,

        // 禁止自身比较
        'no-self-compare': 2,

        // 禁用逗号操作符
        'no-sequences': 2,

        // 禁止将标识符定义为受限的名字
        'no-shadow-restricted-names': 2,

        // 要求或禁止在函数标识符和其调用之间有空格
        'func-call-spacing': 2,

        // 禁用稀疏数组
        'no-sparse-arrays': 2,

        // 禁止在构造函数中，在调用 super() 之前使用 this 或 super
        'no-this-before-super': 2,

        // 禁止抛出异常字面量
        'no-throw-literal': 2,

        // 禁用行尾空格
        'no-trailing-spaces': 2,

        // 禁用未声明的变量，除非它们在 /*global */ 注释中被提到
        'no-undef': 2,

        // 禁止将变量初始化为 undefined
        'no-undef-init': 2,

        // 禁止出现令人困惑的多行表达式
        'no-unexpected-multiline': 2,

        // 禁用一成不变的循环条件
        'no-unmodified-loop-condition': 2,

        // 禁止可以在有更简单的可替代的表达式时使用三元操作符
        'no-unneeded-ternary': [
            2,
            {
                defaultAssignment: false // 禁止条件表达式作为默认的赋值模式
            }
        ],

        // 禁止在 return、throw、continue 和 break 语句之后出现不可达代码
        'no-unreachable': 2,

        // 禁止在 finally 语句块中出现控制流语句
        'no-unsafe-finally': 2,

        // 禁止出现未使用过的变量
        'no-unused-vars': [
            2,
            {
                vars: 'all',
                args: 'none'
            }
        ],

        // 禁止不必要的 .call() 和 .apply()
        'no-useless-call': 2,

        // 禁止在对象中使用不必要的计算属性
        'no-useless-computed-key': 2,

        // 禁用不必要的构造函数
        'no-useless-constructor': 2,

        // 禁用不必要的转义字符
        'no-useless-escape': 0,

        // 禁止属性前有空白
        'no-whitespace-before-property': 2,

        // 强制函数中的变量要么一起声明要么分开声明
        'one-var': [
            2,
            {
                initialized: 'never' // 要求每个作用域的初始化的变量有多个变量声明
            }
        ],

        // 强制操作符使用一致的换行符
        'operator-linebreak': [
            2,
            'after',
            {
                overrides: {
                    '?': 'before',
                    ':': 'before'
                }
            }
        ],

        // 禁止块语句和类的开始或末尾有空行
        'padded-blocks': [2, 'never'],

        // 要求尽可能地使用单引号
        quotes: [
            2,
            'single',
            {
                avoidEscape: true, // 允许字符串使用单引号或双引号
                allowTemplateLiterals: true // 允许字符串使用反勾号
            }
        ],

        // 要求在语句末尾使用分号
        semi: ['error', 'always'],

        // 强制分号之前和之后使用一致的空格
        'semi-spacing': [
            2,
            {
                before: false,
                after: true
            }
        ],

        // 强制在块之前使用一致的空格
        'space-before-blocks': [2, 'always'],

        // 禁止在参数的 ( 前面有空格
        'space-before-function-paren': [2, 'never'],

        // 强制圆括号内没有空格
        'space-in-parens': [2, 'never'],

        // 要求操作符周围有空格
        'space-infix-ops': 2,

        // 强制在一元操作符前后使用一致的空格
        'space-unary-ops': [
            2,
            {
                words: true,
                nonwords: false
            }
        ],

        // 强制在注释中 // 或 /* 使用一致的空格
        'spaced-comment': [
            2,
            'always',
            {
                markers: [
                    'global',
                    'globals',
                    'eslint',
                    'eslint-disable',
                    '*package',
                    '!',
                    ','
                ]
            }
        ],

        //  禁止花括号内出现空格 TODO 开启会导致 import(`@/views${ file }.vue`) 报错
        'template-curly-spacing': 'off',

        // 要求使用 isNaN() 检查 NaN
        'use-isnan': 2,

        // 强制 typeof 表达式与有效的字符串进行比较
        'valid-typeof': 2,

        // 需要把立即执行的函数包裹起来
        'wrap-iife': [2, 'any'],

        // 要求使用 const 声明那些声明后不再被修改的变量
        'prefer-const': 2,

        // 禁用 debugger（生产环境）
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,

        // TODO idea如果满足，需要修改js配置
        // 要求以对象元素开始或结尾的对象的花括号中有空格
        // "object-curly-spacing": [
        //     2,
        //     "always",
        //     {
        //         objectsInObjects: false
        //     }
        // ],
        'object-curly-spacing': [2, 'never'],

        // 禁止在括号内使用空格
        'array-bracket-spacing': [2, 'never']
    }
};
