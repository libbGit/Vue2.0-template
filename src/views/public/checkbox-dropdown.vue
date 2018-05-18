<template>
  <div @click.stop class="checkbox_dropdown_wrap" >
    <el-button  size="mini" @click="is_show_dropdown = !is_show_dropdown" icon="iconfont list" :title="name">
      <!--{{name}}-->
      <!--<i :class="{ 'el-icon-arrow-down': !is_show_dropdown, 'el-icon-arrow-up': is_show_dropdown}"></i>-->
    </el-button>

    <el-checkbox-group class="checkbox_dropdown" :class="'checkbox_dropdown_' + placement"
      v-show="is_show_dropdown"
      :value="value"
      @input="handle_input"
      >
      <el-checkbox v-for="item in items" :key="item.prop" :label="item.prop">
        {{item.label}}
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>
<script>
  export default {
    name: 'checkbox-dropdown',
    data () {
      return {
        is_show_dropdown: false,
      }
    },
    props: {
      name: {
        type: String,
        default: '请选择'
      },
      placement: {
        type: String,
        default: 'top'
      },
      value: {
        type: Array,
        required: true
      },
      items: {
        type: Array,
        required: true
      }
    },
    created (){
      document.addEventListener('click', (event) => {
       this.is_show_dropdown = false;
      })
    },
    methods: {
      handle_input (value) {
        this.$emit('input', value);
      }
    }
  }
</script>
<style scoped>
  .checkbox_dropdown_wrap {
    position: relative;
    display: inline-block;
    z-index: 10;
  }
  .checkbox_dropdown {
    position: absolute;
    right: 0;
    width: 140px;
    background: #fff;
    margin: 2px 0;
    border: 1px solid #dfe4ed;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  }
  .checkbox_dropdown_top {
    bottom: 100%;
  }
  .checkbox_dropdown_bottom {
    top: 100%;
  }
  .checkbox_dropdown .el-checkbox {
    display: block;
    padding: 5px 8px;
    margin-left: 0;
  }
  .checkbox_dropdown .el-checkbox:hover {
    background-color: #f5f7fa;
  }
</style>
