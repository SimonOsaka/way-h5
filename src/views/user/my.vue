<template>
  <div>
    <scroller class="scroller">
      <category title="商品分类"></category>

      <div class="content">
        <wxc-grid-select :single="true" :list="cateData" @select="params => onSelect('res3', params)">
        </wxc-grid-select>
      </div>

      <category title="商品名称"></category>
      <input type="text" placeholder="请输入名称" class="input" :autofocus=true @input="commodityNameOnchange" />

      <category title="商品价格（元）"></category>
      <input type="number" placeholder="请输入价格" class="input" :autofocus=true @input="commodityPriceOnchange" />

      <category title="商家位置"></category>
      <textarea class="textarea" @input="shopPositionOnchange"></textarea>

      <div style="align-items:center;">
        <wxc-button type="white" text="发布" @wxcButtonClicked="wxcButtonClicked"></wxc-button>
      </div>
    </scroller>

  </div>
</template>

<script>
import { Utils, WxcGridSelect, WxcButton } from "weex-ui";
import {
  getEntryUrl,
  receiveMessage,
  setStorageValue,
  getStorageValue,
  initIconfont,
  isEmpty
} from "../../tools/utils.js";
import category from "../../components/category.vue";
const navigator = weex.requireModule("navigator");

export default {
  components: { WxcGridSelect, category, WxcButton },
  data: () => ({
    commodityName: "",
    commodityPrice: "",
    shopPosition: "",
    commodityCate: "",
    cateData: [
      {
        title: "果蔬"
      },
      {
        title: "服装"
      },
      {
        title: "工具"
      },
      {
        title: "零食"
      },
      {
        title: "饮料"
      },
      {
        title: "其它"
      }
    ]
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
    },
    wxcButtonClicked(e) {
      if (
        isEmpty(this.commodityName) ||
        isEmpty(this.commodityPrice) ||
        isEmpty(this.shopPosition) ||
        isEmpty(this.commodityCate)
      ) {
        return;
      }

      console.log(
        this.commodityName,
        this.commodityPrice,
        this.shopPosition,
        this.commodityCate
      );
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