<template>
    <div class="wrapper">
        <web :style="agreementsStyle" :src="userAgreementsUrl"></web>
    </div>
</template>

<style scoped>
.wrapper {
  flex-direction: column;
  padding: 10px;
}
</style>

<script>
import { setPageTitle } from "../../tools/utils.js";
import { Utils } from "weex-ui";
import { http } from "../../tools/http.js";

export default {
  data: () => ({
    userAgreementsUrl: ""
  }),
  beforeCreate() {
    setPageTitle("用户服务协议");
  },
  methods: {
    queryUserAgreementsUrl() {
      let _this = this;
      http({
        method: "POST",
        url: "/user/agreements",
        headers: {},
        body: {}
      }).then(
        function(data) {
          console.log("success", data);
          if (data.code != 200) {
            return;
          }

          let result = data.data;
          _this.userAgreementsUrl = result.userAgreementsUrl;
        },
        function(error) {
          console.error("failure", error);
        }
      );
    }
  },
  created() {
    const pageHeight = Utils.env.getPageHeight();
    this.agreementsStyle = { width: "750px", height: pageHeight + "px" };
    this.queryUserAgreementsUrl();
  }
};
</script>