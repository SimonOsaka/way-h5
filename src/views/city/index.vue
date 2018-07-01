<template>
  <div class="container">
    <scroller class="scroller">
      <wxc-searchbar ref="wxc-searchbar"
                     placeholder="请输入地址"
                     :always-show-cancel="alwaysShowCancel"
                     :return-key-type="returnKeyType"
                     @wxcSearchbarInputReturned="wxcSearchbarInputOnInput"></wxc-searchbar>
      <div v-if="currentAddress != ''">
        <category title="当前地址"></category>
        <wxc-cell :title="currentAddress"
                  :has-arrow="false"
                  :has-top-border="true">
        </wxc-cell>
      </div>
      <div v-if="searchList.length > 0">
        <category title="搜索地址"></category>
        <wxc-cell v-for="(result, i) in searchList"
                  :key="i"
                  :title="result.addressTitle"
                  :desc="result.addressDesc"
                  @wxcCellClicked="wxcIndexlistItemClicked(i)"
                  :has-arrow="false"
                  :has-top-border="true">
        </wxc-cell>
      </div>
    </scroller>
  </div>
</template>

<script>
import { WxcSearchbar, WxcCell } from "weex-ui";
import { postMessage, getStorageVal } from "../../tools/utils.js";
import { http } from "../../tools/http.js";
import category from "../../components/category.vue";
const navigator = weex.requireModule("navigator");

export default {
  components: { WxcSearchbar, WxcCell, category },
  data: () => ({
    searchList: [],
    keywords: "",
    alwaysShowCancel: false,
    returnKeyType: "done",
    inputTimeout: null,
    currentAddress: ""
  }),
  methods: {
    wxcIndexlistItemClicked(i) {
      console.log(i);
      let rs = this.searchList[i];
      let loc = rs.addressLocation.split(",");

      let city = { lng: loc[0], lat: loc[1], name: rs.addressTitle };
      postMessage("way:city", JSON.stringify(city));
      navigator.pop({
        animated: "true"
      });
    },
    wxcSearchbarInputOnInput(e) {
      this.keywords = e.value;
      if (this.inputTimeout) {
        clearTimeout(this.inputTimeout);
      }
      let _this = this;
      this.inputTimeout = setTimeout(() => {
        this.inputTipsFetch();
      }, 500);
    },
    inputTipsFetch() {
      let _this = this;
      http({
        method: "POST",
        url: "/amap/inputtips",
        headers: {},
        body: {
          keywords: this.keywords
        }
      }).then(
        function(data) {
          if (data.code != 200) {
            return;
          }
          _this.searchList.splice(0, _this.searchList.length);
          let inputTipsList = data.data;
          inputTipsList.forEach(tip => {
            _this.searchList.push({
              addressTitle: tip.name,
              addressDesc: tip.district + tip.address,
              addressLocation: tip.location
            });
          });
        },
        function(error) {
          console.error("failure", error);
        }
      );
    }
  },
  created() {
    let _this = this;
    getStorageVal("way:city").then(
      data => {
        let city = JSON.parse(data);
        _this.currentAddress = city.name;
      },
      error => {}
    );
  }
};
</script>