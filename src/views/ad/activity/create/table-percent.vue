<template>
    <td @click='onClick($event)' :class="isDisableTbody">
        <span v-show='!inputState'>{{percentage}}%</span>
        <input :style='getInputWidth' 
            v-show='inputState' 
            :value='percentage' 
            vinput="onInputBudget(item,$event)"
            @blur='onBlur($event)' />
    </td>
</template>
<script>
import moment from "moment";
import math from "mathjs";
import _ from "lodash";

math.config({
  number: "BigNumber", // Default type of number:
  precision: 14 // Number of significant digits for BigNumbers
});

export default {
  name: "CostTablePercent",
  props: {
    percent: {
      type: [String],
      required: true
    },
    time: {
      type: [String],
      required: true
    },
    budget: {
      type: [String],
      required: true
    },
    totalBudget: {
      type: [Number],
      required: true
    },
    locked: {
      type: [Number],
      required: true
    }
  },
  data() {
    return {
      inputState: false,
      inputWidth: 60
    };
  },
  created() {
    let percent = math.round(
      math.eval(this.budget + "/" + this.totalBudget),
      4
    );
    this.$emit("update:percent", percent + "");
  },
  watch: {},
  computed: {
    //是否禁用表body  渲染使用
    isDisableTbody() {
      // if (this.locked) {return ""}
      // if (!moment(moment()-24 * 60 * 60 * 1000).isBefore(this.time)) {
      //   //只有当前单元格是在今天之后才能被编辑
      //   return "";
      // } else {
      return "white";
      // }
    },
    //不带百分比
    percentage: {
      get: function() {
        return math.eval(this.percent + "*100") + "";
      },
      // setter
      set: function(newValue) {
        let percent = math.round(math.eval(newValue + "/100"), 4);
        let budget = math.round(math.eval(this.totalBudget + "*" + percent), 2);
        this.$emit("update:budget", budget + "");
        this.$emit("update:percent", percent + "");
      }
    },
    getInputWidth() {
      return { width: this.inputWidth + "px" };
    }
  },
  methods: {
    //onClick 单击单元格事件
    onClick(event) {
      // if (this.isDisableTbody) {   
      //取消禁用
      let td = event.currentTarget;
      // this.inputWidth = td.offsetWidth - 12 - 2;
      this.inputState = true;
      this.$nextTick(function() {
        td.children[1].focus();
      });
      // }
    },
    // 单元格失去焦点事件
    onBlur(event) {
      //percentage
      let val = _.trim(event.target.value);
      let reg = /^(0|([1-9][0-9]*))(\.[0-9]{1,2})?$/;
      if (val - 0 > 100) {
        this.$message.error("占比值只允许输入0-100之间的数字！");
      } else if (!reg.test(val)) {
        this.$message.error(
          "占比值只允许是正整数或者最多保留2位小数的正实数！"
        );
      } else {
        this.percentage = val;
        var a = math.round(math.eval(val + "/100"), 4) + "";
        this.$emit(
          "update:percent",
          math.round(math.eval(val + "/100"), 4) + ""
        );
        this.inputState = false;
      }
    },
    //暂时用不到。
    onInputBudget(item, event) {
      let val = event.target.value.replace(/[^\d]/g, "");
      item.budget = val + " ";
      item.budget = val - 0;
    }
  },

  components: {}
};
</script>
<style scoped>

</style>
