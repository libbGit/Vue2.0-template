<template>
    <div>
        <transition v-for="(item, index) in list"
            :key="index"
            enter-active-class="animated lightSpeedIn"
            leave-active-class="animated lightSpeedOut">
            <slot :name="index"></slot>
        </transition>
    </div>
</template>

<script>
export default {
  data() {
    return {
      list: []
    };
  },
  created() {
    for (let item in this.$slots) {
      this.list.push(item);
    }
  }
};
</script>
