# 说明文档

## 环境搭建

项目是使用 vue-cli 搭建框架，然后有添加了如下的依赖：

```
"axios": "^0.16.2",
"echarts": "^3.7.2",
"element-ui": "^2.0.1",
"js-cookie": "^2.2.0",
"lodash": "^4.17.4",
"vue": "^2.5.2",
"vue-router": "^3.0.1",
"vuex": "^2.4.0",
"vuex-router-sync": "^4.3.1"
```

为了支持 jsx 语法 ([参考](https://github.com/vuejs/babel-plugin-transform-vue-jsx)) ,又加入了如下的开发依赖：

```
babel-plugin-syntax-jsx
babel-plugin-transform-vue-jsx
babel-helper-vue-jsx-merge-props
```

.babelrc 添加

```
{
  "plugins": ["transform-vue-jsx"]
}
```

## 使用 element-ui

使用引用 element-ui 的 src 文件，而不是编译后的文件，需要调整的步骤如下

1. `main.js` 文件

```
import ElementUI from 'element-ui/src/index.js'
```

2. `build/webpack.base.conf.js` babel-loader 部分修改如下：

```
{
  test: /\.js$/,
  loader: 'babel-loader',
  include: [resolve('src'), resolve('test'), resolve('node_modules/element-ui')]
}
```

3. `node_modules/element-ui` 中有些使用了 exports ，可能会导致错误，可以作如下修改：

文件 `node_modules\element-ui\packages\loading\src\directive.js`

```
var install = Vue => ...

export default {
  install
}
```

文件 `node_modules\element-ui\src\index.js`

```
export default {
  version: '2.0.1',
  locale: locale.use,
  i18n: locale.i18n,
  install,
  ...
}
```
