<template>
  <div>
    <scroller class="scroller">
      <div>
        <image class="image" :src="discountObj.cPicUrl"></image>
      </div>
      <div>
        <wxc-cell :has-arrow="false" :has-bottom-border="true" :cell-style="cellStyle">
          <div slot="label">
            <div style="flex-direction: row;">
              <text>{{discountObj.cName}}</text>
            </div>
            <div style="flex-direction:row;">
              <text class="c_money" style="font-size:20px; padding-top:10px;">¥</text>
              <text class="c_money">{{discountObj.cPrice}}</text>
            </div>
          </div>
          <div slot="value" style="flex-direction: row;">
            <div style="height: 75px;" @click="popupOverlayClicked">
              <text class="iconfont">&#xe6f3; 分享</text>
              <text></text>
            </div>
          </div>
        </wxc-cell>
      </div>
      <div>
        <wxc-cell :has-arrow="false" :has-bottom-border="true">
          <div slot="label" style="flex-direction:row;">
            <text class="iconfont" style="margin-top:6px;">&#xe651;</text>
            <text>{{discountObj.position}}</text>
          </div>
        </wxc-cell>
      </div>
    </scroller>

    <wxc-popup height="160" :show="isAutoShow" pos="bottom" @wxcPopupOverlayClicked="popupOverlayAutoClick">
      <div @click="weixinClicked" style="width: 128px; height: 128px; margin-left: 311px; margin-top: 24px;">
        <text class="iconfont" style="font-size: 64px;">&#xe622;</text>
        <text style="margin-left: 10px;">微信</text>
      </div>
    </wxc-popup>

    <wxc-dialog title="功能开发中" content="请使用当前App的微信分享功能" :show="show" :single="true" @wxcDialogConfirmBtnClicked="wxcDialogConfirmBtnClicked"></wxc-dialog>
  </div>
</template>

<script>
import { Utils, WxcCell, WxcPopup, WxcDialog } from "weex-ui";
import {
  getEntryUrl,
  receiveMessage,
  setStorageValue,
  getStorageValue,
  initIconfont,
  getStorageVal
} from "../../tools/utils.js";
import { loadCateImageUrl } from "../../tools/image.js";
import { http } from "../../tools/http.js";
const navigator = weex.requireModule("navigator");
const modal = weex.requireModule("modal");

export default {
  components: { WxcCell, WxcPopup, WxcDialog },
  data: () => ({
    cellStyle: { height: "150px" },
    discountObj: {
      id: 0,
      cPicUrl: "",
      cName: "",
      cPrice: "",
      position: ""
    },
    isAutoShow: false,
    show: false
  }),
  beforeCreate() {
    initIconfont();
  },
  created() {
    let _this = this;
    getStorageVal("way:discount:id").then(
      data => {
        _this.discountObj.id = data;

        http({
          method: "GET",
          url: "/discount/getDetail",
          headers: {},
          params: {
            discountId: this.discountObj.id
          }
        }).then(
          function(data) {
            console.log("success", data);
            if (data.code != 200) {
              _this.dialogContent = data.msg;
              _this.dialogShow = true;
            }
            let discountDetail = data.data;
            _this.discountObj.id = discountDetail.id;
            _this.discountObj.cName = discountDetail.commodityName;
            _this.discountObj.cPrice = discountDetail.commodityPrice;
            _this.discountObj.position = discountDetail.shopPosition;
            loadCateImageUrl(
              "way:discount:" + discountDetail.commodityCate
            ).then(imgUrl => {
              _this.discountObj.cPicUrl = imgUrl;
            });
          },
          function(error) {
            console.error("failure", error);
          }
        );
      },
      e => {
        navigator.pop();
        return;
      }
    );
  },
  methods: {
    popupOverlayAutoClick() {
      this.isAutoShow = false;
    },
    popupOverlayClicked() {
      this.isAutoShow = true;
    },
    weixinClicked() {
      console.log("weixin clicked...");
      this.show = true;
    },
    wxcDialogConfirmBtnClicked() {
      this.show = false;
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
  width: 750px;
}
.image {
  width: 750px;
  height: 500px;
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