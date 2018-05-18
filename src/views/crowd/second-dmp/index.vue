<template>
    <div>
        <router-view/>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import fetch from "@/services/fetch";

export default {
  name: "hy-dmp",
  data() {
    return {};
  },
};
</script>