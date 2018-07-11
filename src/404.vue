<template>
  <div class="content">
    <wxc-result :type="type" padding-top="232" :custom-set="customSet" @wxcResultButtonClicked="resultButtonClick" :show="show"></wxc-result>
  </div>
</template>
 
<style scoped>
.content {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: #ffffff;
}
</style>

<script>
import { WxcResult } from "weex-ui";
import { setPageTitle } from "./tools/utils.js";
const modal = weex.requireModule("modal");
const navigator = weex.requireModule("navigator");

export default {
  components: { WxcResult },
  data: () => ({
    show: true,
    type: "errorPage",
    customSet: {
      errorPage: {
        button: "走错了",
        content: "亲，出错了",
        pic: "https://gw.alicdn.com/tfs/TB1lgzNfBHH8KJjy0FbXXcqlpXa-320-320.png"
      }
    }
  }),
  computed: {},
  beforeCreate() {
    setPageTitle("404未找到");
  },
  methods: {
    resultButtonClick(e) {
      navigator.pop({ animated: true });
      //   modal.toast({
      //     message: `你点击了按钮`,
      //     duration: 1
      //   });
    }
  }
};
</script>