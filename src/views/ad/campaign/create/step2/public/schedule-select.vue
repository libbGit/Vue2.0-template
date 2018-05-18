<template>
<el-form-item>
  <div slot="label"><el-checkbox :value="timeset_check" @input="update_timeset_check"></el-checkbox> 时段设置</div>
  <div class="schedule_select_wrap" v-show="timeset_check">
    <div v-for="(item, index) in list" :key="index" class="square-wrap">
      <el-checkbox style="width:65px;"
        v-model="item.allChecked"
        @change="handleCheckbox(index, ...arguments)">{{item.name}}
      </el-checkbox>
      <span v-for="i in squares" class="square"
        :class="{'active': item.checked.indexOf(i) > -1}"
        @click="toggleSquare(index, i)"
        >
        {{i}}
      </span>
    </div>
    <div class="legend">
      <div class="item">
        <span class="square active"></span>
        <span class="text">投放时段</span>
      </div>
      <div class="item">
        <span class="square"></span>
        <span class="text">暂停时段</span>
      </div>
    </div>
  </div>
</el-form-item>
</template>
<script>
  import { mapState, mapActions } from 'vuex'
  const daystr = () => ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
  const squares = () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10, 11, 12,13, 14,15,16,17,18,19,20,21,22,23]
  const list = () =>   [
    {
      index: 0,
      name:'星期一',
      allChecked: false,
      checked:[]
    },{
      index: 1,
      name:'星期二',
      allChecked: false,
      checked:[]
    },{
      index: 2,
      name:'星期三',
      allChecked: false,
      checked:[]
    },{
      index: 3,
      name:'星期四',
      allChecked: false,
      checked:[]
    },{
      index: 4,
      name:'星期五',
      allChecked: false,
      checked:[]
    },{
      index: 5,
      name:'星期六',
      allChecked: false,
      checked:[]
    },{
      index: 6,
      name:'星期日',
      allChecked: false,
      checked:[]
    },{
      index:7,
      name:'每天',
      allChecked: false,
      checked:[]
    }
  ]
  export default {
    name:'ScheduleSelect',
    data () {
      return {
        squares: squares(),
        list: list(),
        adset_schedule:[]
      }
    },
    computed: {
      ...mapState({
        timeset: state => state.ad.campaign.timeset,
        timeset_check: state => state.ad.campaign.timeset_check,
      })
    },
    watch : {
      // 如果时段未勾选，则表示选择全时段
      timeset_check (value) {
        if (!value) {
          this.update_timeset("111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111");
          this.init();
        }
      }
    },
    mounted (){
      this.init();
    },
    methods: {
      ...mapActions('ad/campaign',[
        'update_timeset',
        'update_timeset_check',
      ]),
      // 初始化
      init () {
        if(this.timeset) {
          this.server_to_client(this.timeset);
        }
        this.ifChecked();
      },
      client_to_server(data) {
        let tmp = []
        tmp = data.map( item => {
         var str = daystr();
         item.checked.forEach( day => {
          str[day] = '1';
         })
         return str.join('');
        });
        return tmp.join('');
      },
      server_to_client(str) {
        this.list = list()
        var arr = str.split('');
        arr.forEach((item, index) => {
          var row_index = parseInt(index / 24);
          var col_index = index % 24;
          if(item == '1') {
            this.list[row_index].checked.push(col_index)
          }
        });
      },
      toggleSquare (index, i){
        let flag = this.list[index].checked.indexOf(i) > -1
        if(index === 7) {
          this.selectSingleDay([0, 1, 2, 3, 4, 5, 6, 7], i, flag)
        }
        else {
          this.selectSingleDay([index], i, flag)
        }
        this.ifChecked()
        this.getData()
      },
      selectSingleDay(arrIndex, day, flag){
        arrIndex.forEach( index => {
          let checked = this.list[index].checked
          this.list[index].checked = this.toggleArrayValue(checked, day, flag)
        })
      },
      handleCheckbox(index, flag, event){
        if(index === 7) {
          this.selectAllDay([0, 1, 2, 3, 4, 5, 6, 7], flag)
        }
        else {
          this.selectAllDay([index], flag)
        }
        this.ifChecked()
        this.getData()
      },
      selectAllDay(arrIndex, flag){
        arrIndex.forEach( index => {
          if(flag) {
            this.list[index].checked = squares()
          }
          else {
            this.list[index].checked = []
          }
        })
      },
      toggleArrayValue(arr, value, flag){
        let searchIndex = arr.indexOf(value)
        if( !flag && searchIndex === -1) {
          arr.push(value)
        }
        if( flag ) {
          arr.splice(searchIndex, 1)
        }
        return arr
      },
      ifChecked () {
        // 判断竖向是否全选
        let res = squares().map(i => {
          let result = {
            index: i,
            num: 0
          }
          this.list
            .filter(item => {
              return item.index !==7
            })
            .forEach(item =>{
              if(item.checked.indexOf(i) > -1){
                result.num ++
              }
            })
          return result
        }).filter(item => {
          return item.num === 7
        }).map( item=>{
          return item.index
        })
        this.list[7].checked = res

        // 判断横向是否全选
        this.list.forEach( item => {
          if(item.checked.length === 24){
            item.allChecked = true
          }
          else {
            item.allChecked = false
          }
        })
      },
      getData (){
        let res = []
        res = this.list.filter(item=>{
          return item.index !== 7
        });
        var data = this.client_to_server(res);
        this.update_timeset(data);
      }
    }
  }
</script>
<style>
  .schedule_select_wrap{
    width: 695px;
    background: #fbfafa;
    padding: 10px;
  }
  .schedule_select_wrap .legend {
    text-align: right;
    margin-top: 10px;
    line-height: 10px;
  }
  .schedule_select_wrap .legend .item{
    display: inline-block;
  }
  .schedule_select_wrap .legend .item .text ,
  .schedule_select_wrap .legend .item .square{
    float: left;
  }
  .schedule_select_wrap .legend .item .text {
    display: inline-block;
    height: 16px;
    line-height: 16px;
    font-size: 12px;
    vertical-align: unset;
    margin: 2px;
  }
  .schedule_select_wrap .square-wrap {
    line-height: 1;
  }
  .schedule_select_wrap .square {
     display: inline-block;
     width: 20px;
     height: 20px;
     line-height: 20px;
     text-align: center;
     margin: 2px;
     cursor: pointer;
     font-size: 12px;
     user-select: none;
     border: 1px solid #ddd;
     background: #fff;
     color: #999;
   }
  .item .square{
    width: 14px;
    height: 14px;
  }
  .schedule_select_wrap .square.active {
     background-color: #409EFF;
    border: 1px solid #409EFF;
     color: #eee;
   }
</style>
