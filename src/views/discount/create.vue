<template>
  <div>
    <scroller class="scroller">
      <category title="商品分类"></category>
      <div class="content">
        <wxc-grid-select :single="true"
                         :list="cateData"
                         @select="params => onSelect('res3', params)">
        </wxc-grid-select>
      </div>

      <category title="商品名称"></category>
      <input type="text"
             placeholder="请输入名称"
             class="input"
             :autofocus=true
             @input="commodityNameOnchange" />

      <category title="商品价格（元）"></category>
      <input type="number"
             placeholder="请输入价格"
             class="input"
             :autofocus=true
             @input="commodityPriceOnchange" />

      <category title="商家位置"></category>
      <textarea class="textarea"
                @input="shopPositionOnchange"
                :value="shopPosition"></textarea>
      <div>
        <div @click="inputTipClicked(i)"
             v-for="(tip, i) in inputTipsList"
             :key="i"
             style="flex-direction: column; padding-left: 10px; padding-top:10px;padding-bottom:10px;">
          <text style="margin-left: 10px;">{{tip.name}}</text>
          <text style="color: #cccccc;">{{tip.district}}</text>
        </div>
      </div>

      <category title="优惠时间"></category>
      <div class="content">
        <wxc-grid-select :single="true"
                         :list="expireList"
                         @select="params => expireOnSelect('expire', params)">
        </wxc-grid-select>
      </div>

      <div style="align-items:center; padding-top: 20px;">
        <wxc-button type="white"
                    text="发布"
                    @wxcButtonClicked="createDiscountClicked"></wxc-button>
      </div>
    </scroller>

  </div>
</template>

<script>
import { Utils, WxcGridSelect, WxcButton, WxcCell } from "weex-ui";
import {
  getEntryUrl,
  postMessage,
  receiveMessage,
  setStorageValue,
  getStorageValue,
  initIconfont,
  isEmpty,
  getStorageVal,
  setStorageVal,
  getUrlKey
} from "../../tools/utils.js";
import { http } from "../../tools/http.js";
import category from "../../components/category.vue";
const navigator = weex.requireModule("navigator");
const modal = weex.requireModule("modal");

export default {
  components: { WxcGridSelect, category, WxcButton, WxcCell },
  data: () => ({
    commodityName: "",
    commodityPrice: "",
    shopPosition: "",
    commodityCate: "",
    cateData: [
      { title: "服装" },
      { title: "蔬菜" },
      { title: "饮料" },
      { title: "零食" },
      { title: "工具" },
      { title: "其它" }
    ],
    cateAll: {},
    clientLng: 0,
    clientLat: 0,
    inputTipsList: [],
    expireList: [
      { title: "一天", checked: true, day: 1 },
      { title: "三天", day: 3 },
      { title: "一星期", day: 7 }
    ],
    expireDays: 1
  }),
  beforeCreate() {
    initIconfont();
  },
  methods: {
    onSelect(res, { selectIndex, checked, checkedList }) {
      console.log(res, selectIndex, checked, checkedList.length);
      if (checked) {
        console.log(checkedList[0]);
        this.commodityCate = checkedList[0].title;
      }
    },
    expireOnSelect(res, { selectIndex, checked, checkedList }) {
      console.log(res, selectIndex, checked, checkedList.length);
      if (checked) {
        console.log(checkedList[0]);
        this.expireDays = this.expireList[selectIndex].day;
      }
    },
    commodityNameOnchange: function(event) {
      this.commodityName = event.value;
      console.log("onchange", event.value);
    },
    commodityPriceOnchange: function(event) {
      this.commodityPrice = event.value;
      console.log("oninput", event.value);
    },
    shopPositionOnchange: function(event) {
      this.shopPosition = event.value;
      console.log("oninput", event.value);

      if (this.shopPosTimeout) {
        clearTimeout(this.shopPosTimeout);
      }

      this.shopPosTimeout = setTimeout(() => {
        console.log("0.5秒执行");
        this.shopPositionFetch();
      }, 500);
    },
    shopPositionFetch() {
      let _this = this;
      http({
        method: "POST",
        url: "/amap/inputtips",
        headers: {},
        body: {
          keywords: this.shopPosition
        }
      }).then(
        function(data) {
          console.log("success", data);
          if (data.code != 200) {
            return;
          }

          _this.inputTipsList = data.data;
          console.log(_this.inputTipsList);
        },
        function(error) {
          console.error("failure", error);
        }
      );
    },
    inputTipClicked(i) {
      console.log(i);
      this.shopPosition =
        this.inputTipsList[i].district + this.inputTipsList[i].name;
      let location = this.inputTipsList[i].location.split(",");
      this.clientLng = location[0];
      this.clientLat = location[1];
    },
    createDiscountClicked(e) {
      if (
        isEmpty(this.commodityName) ||
        isEmpty(this.commodityPrice) ||
        isEmpty(this.shopPosition) ||
        isEmpty(this.commodityCate) ||
        this.expireDays < 1
      ) {
        return;
      }

      console.log(
        this.commodityName,
        this.commodityPrice,
        this.shopPosition,
        this.commodityCate,
        this.expireDays
      );

      let _this = this;
      getStorageVal("way:user").then(data => {
        let user = JSON.parse(data);
        http({
          method: "POST",
          url: "/discount/create",
          headers: {},
          body: {
            commodityName: _this.commodityName,
            commodityCate: _this.commodityCate,
            commodityPrice: _this.commodityPrice,
            shopPosition: _this.shopPosition,
            userLoginId: user.userLoginId,
            clientLat: _this.clientLat,
            clientLng: _this.clientLng,
            expireDays: _this.expireDays
          }
        }).then(
          function(data) {
            if (data.code != 200) {
              return;
            }
            modal.toast({
              message: "发布成功",
              duration: 1
            });

            postMessage("way:tab:selectedIndex", 1);
            navigator.pop();
          },
          function(error) {
            console.error("failure", error);
          }
        );
      });
    }
  }
};
</script>

<style scoped>
.iconfont {
  font-family: iconfont;
  font-size: 32px;
  font-style: normal;
}
.scroller {
  flex: 1;
}
.content {
  padding-top: 24px;
  padding-right: 24px;
  padding-left: 24px;
}
.image {
  width: 750px;
  height: 500px;
}
.input {
  font-size: 60px;
  height: 80px;
  width: 750px;
}
.textarea {
  font-size: 60px;
  width: 750px;
}
.c_name {
  padding-left: 20px;
}
.c_money {
  color: red;
}
.c_real {
  font-size: 24px;
}
</style>