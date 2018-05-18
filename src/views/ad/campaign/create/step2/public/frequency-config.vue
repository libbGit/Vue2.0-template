<template>
  <el-form-item>
    <div slot="label"><el-checkbox :value="frequency_check" @input="update_frequency_check"></el-checkbox> 跨媒体曝光类型</div>
    <div v-if="frequency_check">
      <el-select :value="frequency_type" @input="handle_frequency_type_change" placeholder="请选择" size="mini">
        <el-option label="每天" value="1"></el-option>
        <el-option label="每周" value="2"></el-option>
        <el-option label="自定义周期" value="3"></el-option>
      </el-select>
      <el-input v-show="frequency_type == '3'" :value="frequency_day" @input="handle_frequency_day_change" style="width:150px;" size="mini">
        <template slot="append">天</template>
      </el-input>
      <el-input :value="frequency" @input="handle_frequency_change" style="width:150px;" size="mini">
        <template slot="append" style="padding:0">次/人</template>
      </el-input>
    </div>

  </el-form-item>
</template>
<script>
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'speed-config',
    computed : {
      ...mapState('ad/campaign',[
        'frequency_check',
        'frequency_type',
        'frequency',
        'frequency_day',
      ])
    },
    watch: {
      // 不勾选怎默认选择全时段投放，即值都为空
      frequency_check (value) {
        if ( !value ) {
          this.update_frequency_type('');
          this.update_frequency('');
          this.update_frequency_day('');
        }
      }
    },
    methods: {
      ...mapActions('ad/campaign',[
        'update_frequency_check',
        'update_frequency_type',
        'update_frequency',
        'update_frequency_day'
      ]),
      handle_frequency_type_change(value){
        this.update_frequency_type(value)
      },
      handle_frequency_change(value){
        this.update_frequency(value);
      },
      handle_frequency_day_change(value){
        this.update_frequency_day(value);
      }
    }
  }
</script>
