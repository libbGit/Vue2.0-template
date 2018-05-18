<template>
  <el-date-picker
    type="daterange"
    align="right"
    :clearable="false"
    placeholder="选择日期范围"
    :value="value"
    @input="triggerInput"
    :picker-options="dateRangePickerOptions">
  </el-date-picker>
</template>
<script>
  import moment from 'moment'
  let dateRangePickerOptions = {
    shortcuts: [{
      text: '昨天',
      onClick(picker) {
        const end = moment().subtract(1, 'days').toDate()
        const start = moment().subtract(1, 'days').toDate()
        picker.$emit('pick', [start, end]);
      }
    },{
      text: '最近一周',
      onClick(picker) {
        const end = moment().subtract(1, 'days').toDate()
        const start =  moment().subtract(7, 'days').toDate()
        picker.$emit('pick', [start, end]);
      }
    }, {
      text: '最近一个月',
      onClick(picker) {
        const end = moment().subtract(1, 'days').toDate()
        const start =  moment().subtract(30, 'days').toDate()
        picker.$emit('pick', [start, end]);
      }
    }, {
      text: '最近三个月',
      onClick(picker) {
        const end = moment().subtract(1, 'days').toDate()
        const start =  moment().subtract(90, 'days').toDate()
        picker.$emit('pick', [start, end]);
      }
    }]
  }
  let DateStringify = (dateArr) => {
    return dateArr.map( date => {
      return moment(date).format('YYYY-MM-DD')
    }).join()
  }
  export default {
    name:'HyDateRangePicker',
    props: {
      value: {
        type: Array
      }
    },
    data () {
      return {
        dateRangePickerOptions
      }
    },
    methods: {
      // 选择同一时段日期范围不会触发事件
      triggerInput (value) {
        let oldDateString = DateStringify(this.value)
        let newDateString = DateStringify(value)
        if( oldDateString !== newDateString) {
          this.$emit('input', value)
        }
      }
    },
  }
</script>
