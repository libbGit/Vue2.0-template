import Vue from 'vue'
import { mount, shallow, createLocalVue } from '@vue/test-utils'
import { expect } from 'chai'  //chai的断言 assert TDD(不支持链式调用),  expect,should BDD
import VueRouter from 'vue-router'
// import Vuex from 'vuex'


// import {state} from "@/store/report"
import TestVue from "@/views/test/Test"


const localVue = createLocalVue()
localVue.use(VueRouter)    //安装 Vue Router 之后 Vue 的原型上会增加 $route 和 $router 这两个只读属性。


const $route = {
  path: '/some/path'
}


describe('Test.vue', () => {   //套件， 首先将it外面的语句执行完，再去挨个执行it 用例
  const mountWrapper = shallow(TestVue, {
    data: { count: 12 },
    propsData: {
      age: 25
    },
    mocks: {
      $route
    },
  });
  //挂载组件后，返回包裹器，暴露很多封装、遍历和查询其内部的 Vue 组件实例的方法


  // it('是一个按钮', () => {
  //   expect(mountWrapper.contains('button')).to.be.true;   //contains是mountWrapper的方法，而to.be是chai的断言
  // })

  //获取data
  // it('data count的值为12', () => {
  //   expect(mountWrapper.vm.count).to.be.eql(12)
  // })

  it('setData 更新count的值为13', () => {
    mountWrapper.setData({ count: 13 });
    expect(mountWrapper.vm.count).to.be.eql(13)
  })

  it('setProps 更新name的值为libingbing', () => {
    mountWrapper.setProps({ name: 'libingbing' });
    expect(mountWrapper.props().name).to.be.eql('libingbing')
  })

  it('value点击前为0', () => {
    expect(mountWrapper.vm.value).to.be.eql(0);
  })

  /**测试异步调用**/
  it('value点击后变为1', () => {
    mountWrapper.find('button.aync').trigger('click');  //click触发了一个异步时间
    mountWrapper.vm.$nextTick(() => {  //必须等到这个异步事件执行完，才执行expect
      expect(mountWrapper.vm.value).to.be.eql(1);
      done()
    })
  })


  it('action', () => {
    mountWrapper.find('button.action').trigger('click');  //click触发了一个异步时间
  })
})


describe('Test.vue', () => {
  const wrapper = shallow(TestVue, {
    localVue    //一单安装了localvue之后，则伪造 $route 或 $router 都会失效。
  });

  /**
   * 此方式可以伪造$route
   * const wrapper = shallow(TestVue, {
      mocks: {
        $route
      }
    });
   */




})


/**
 * 
  const wrapper = mount(Component,{
    data:{},          通过 Wrapper.vm.count 访问        通过Wrapper.setData({})更新
    propsData:{},     通过 Wrapper.props().name 访问    通过Wrapper.setProps({})
    attr:{},
    slots: {
    default: [Foo, Bar],
      fooBar: Foo, // 将会匹配 `<slot name="FooBar" />`。
      foo: '<div />',
      bar: 'bar'
    },
    stubs:{},  //components
    mocks:{    为示例添加额外的属性。在伪造全局注入的时候有用。
      $route
    },
  })

  wrapper的方法：   setComputed()  setData()   setProps()  setMethods()  trigger()
  const vm = wrapper.vm;  //组件实例
 
 * 
 */

/**
 * 
 * mocha是测试用例运行库，既可以在浏览器，也可以在nodejs
 * karma
 * vue-test-utils 是vue单元测试工具库
 * chai是断言库。分为TDD和BDD
 * 
 * 
 * 
 * chai中的expect的修饰符没有任何意思，只是逻辑上的描述。必须搭配其他有意义的api函数
 * to  be  been  is  that  which  and  has  have  with  at  of  same
 * 
 * api: 
 * not()   deep any  all  a/an    include/contains   equal()  eql()   above  least   below  most  within                   
 * ok   true  false   null    undefined  NaN  exist  empty
 * 
 * 
 */

 /**
  * 安装 Vue Router 会在 Vue 的原型上添加 $route 和 $router 只读属性。
    这意味着在未来的任何测试中，伪造 $route 或 $router 都会失效。
    要想回避这个问题，就用上述的 localVue 用法。

    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const $route = {
      path: '/some/path'
    }
  */



  /**
   * 
   * Statements: 语句覆盖率，执行到每个语句；

Branches: 分支覆盖率，执行到每个if代码块；

Functions: 函数覆盖率，调用到程式中的每一个函数；

Lines: 行覆盖率, 执行到程序中的每一行。
   */