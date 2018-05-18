<template>
    <td @click='onClick($event)' :class='isDisableTbody' class='cost'>
        <span v-show='!inputState'>{{$formatMoney(budget)}}</span>
        <input :style='getInputWidth' 
            v-show='inputState' 
            :value='budget' 
            vinput="onInputBudget(item,$event)" 
            @blur='onBlur($event)'/>
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
  name: "CostTableBudget",
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
    this.setPercent(this.budget);
  },
  watch: {
    budget(nVal, oVal) {
      this.setPercent(nVal);
    },
    totalBudget(nVal, oVal) {
      this.setPercent(this.budget, nVal);
    }
  },
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
    getInputWidth() {
      return { width: this.inputWidth + "px" };
    }
  },
  methods: {
    setPercent(budget, totalBudget = this.totalBudget) {
      let percent = math.round(math.eval(budget + "/" + totalBudget), 4);
      this.$emit("update:percent", percent + "");
    },
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
      let val = _.trim(event.target.value);
      let reg = /^(0|([1-9][0-9]*))(\.[0-9]{1,2})?$/;
      if (reg.test(val)) {
        this.$emit("update:budget", val);
        this.setPercent(val);
        this.inputState = false;
      } else {
        this.$message.error(
          "占比值只允许是正整数或者最多保留2位小数的正实数！"
        );
      }
    },
    //暂时用不到。
    onInputBudget(item, event) {
      let val = event.target.value.replace(/[^\d]/g, "");
      item.budget = val + " ";
      item.budget = val - 0;
      // item.percent = (item.budget / this.totalBudget * 100).toFixed(2);
    }
  },

  components: {}
};
</script>
<style scoped>

</style>
