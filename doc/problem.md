# 问题
1. mock.js （需要替代方案）
 请求不会在浏览器的控制面板显示出来
 正则匹配有问题

2. vuex
命名空间为 false 的模块，在引用的使用有点问题

action 可以直接引入

```
...mapActions([
  'fetch_advertiser_list'
]),
```

state 则不可以（非常奇怪）

```
// 不可以
...mapState([
  'advertiserList'
])
// 可以
...mapState({
  advertiserList: state => state.customerManage.advertiserList
})
```

## 自定义事件传递参数

https://forum.vuejs.org/t/emit-and-custom-events/5425
<component ... v-on:change="onElementChange(1, 2, ...arguments)">

<template>
  <son @test="handleTest"></son>
</template>
<script>
function (name) {
  return funtion (a ,b c ) {

  }
}

</script>

