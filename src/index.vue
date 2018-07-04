<template>
  <wxc-tab-bar ref="wxc-tab-bar" :tab-titles="tabTitles" :tab-styles="tabStyles" title-type="iconFont" duration="0" @wxcTabBarCurrentTabSelected="wxcTabBarCurrentTabSelected">
    <div class="item-container" :style="contentStyle">
      <wxc-searchbar class="searchbar" placeholder="输入商品名称" theme="gray" mod="hasDep" :dep-name="city" @wxcSearchbarInputReturned="wxcSearchbarInputOnInput" @wxcSearchbarDepChooseClicked="wxcSearchbarDepChooseClicked"></wxc-searchbar>
      <scroller :style="mcScrollerStyle" @loadmore="fetchMc" loadmoreoffset="10" v-if="!main.queryListNoDataShow">
        <div class="m_cell" v-for="(commodityObj, i) in main.queryList">
          <div class="m_cell_split" v-if="i != 0"></div>
          <wxc-cell :cell-style="cellStyle" :has-top-border="false" :has-bottom-border="true" :has-margin="false">
            <image slot="label" class="shop_image" resize="cover" :src="commodityObj.shopLogoUrl"></image>
            <text slot="title" style="margin-left: 10px;">{{commodityObj.mName}}</text>
            <text slot="value" style="text-align: right; font-size: 26px;">{{commodityObj.mDistance}}</text>
          </wxc-cell>
          <wxc-cell v-for="(cItem, j) in commodityObj.firstList" :key="cItem.cId" :has-arrow="false" :cell-style="cellStyle" :has-top-border="false" :has-bottom-border="true" :has-margin="false" :auto-accessible="false" @wxcCellClicked="commodityCellClick(i, j)">
            <image slot="label" class="image" resize="cover" :src="cItem.cImgUrl"></image>
            <div slot="title">
              <text class="c_name">{{cItem.cName}}</text>
              <div style="flex-direction:row;">
                <text class="c_name c_money" style="font-size:20px; padding-top: 3px;">¥</text>
                <text class="c_money">{{cItem.cPrice}}</text>
              </div>
            </div>
          </wxc-cell>
          <wxc-cell v-if="commodityObj.moreList.length > 0" :has-arrow="false" :has-top-border="false" :has-bottom-border="true" :has-margin="false" :auto-accessible="false">
            <text slot="title" class="iconfont" style="text-align: center;" v-if="commodityObj.isMore == true" @click="moreCommodityClicked(commodityObj.shopIndex)"> 查看更多{{commodityObj.moreList.length}}个 &#xe661 </text>
            <text slot="title" class="iconfont" style="text-align: center;" v-else @click="unMoreCommodityClicked(commodityObj.shopIndex)"> 收起 &#xe6de </text>
          </wxc-cell>
        </div>
      </scroller>
      <div class="m_cell" v-else>
        <text class="iconfont" style="font-size:128px; margin-top: 232px; text-align: center; color: #cccccc;">&#xe66f;</text>
        <text style="font-size:32px; margin-top: 20px; text-align: center; color: #cccccc;"> 没有查询到结果 </text>
      </div>
    </div>
    <div class="item-container" :style="contentStyle">
      <scroller v-if="!discountListNoDataShow" :style="discountScrollerStyle" @loadmore="fetchDiscount" loadmoreoffset="10" @scroll="discountScrollHandler">
        <div class="m_cell" v-for="(discountObj, i) in discountList" :key="i" :ref="'cell'+i">
          <div class="m_cell_split" v-if="i != 0"></div>
          <wxc-cell @wxcCellClicked="discountCellClicked(i)" :has-arrow="false" :cell-style="cellStyle" :has-top-border="false" :has-bottom-border="false" :has-margin="false" :auto-accessible="false">
            <image slot="label" class="image" resize="cover" :src="discountObj.commodityImageUrl"></image>
            <div slot="title">
              <div style="flex-direction: row;">
                <text class="c_name">{{discountObj.cName}}</text>
                <div style="flex: 1 1 0%; -webkit-box-flex: 1;">
                  <text style="text-align: right; font-size: 26px; padding-top: 10px;">{{discountObj.mDistance}}</text>
                </div>
              </div>
              <div style="flex-direction:row; padding-top: 10px;">
                <text class="c_name c_money" style="font-size:20px; padding-top:4px;">¥</text>
                <text class="c_money">{{discountObj.cPrice}}</text>
              </div>
              <div :key="i" :index="i" style="flex-direction:column; padding-left: 20px; padding-top: 20px;">
                <div style="flex-direction: row;">
                  <div style="flex-direction:row;flex: 1 1 0%;" @click="clickReal(i)">
                    <text class="iconfont" style="color: #ccc;">&#xe644;</text>
                    <text class="c_real" style="color: #ccc; margin-left: 10px;">{{discountObj.cReal}}</text>
                  </div>
                  <div style="text-align: right; flex-direction: row;" v-if="discountObj.cExpireMills">
                    <wxc-countdown :time="discountObj.cExpireMills" tpl="{d}天{h}时{m}分{s}秒" @wxcOnComplete="discountExpireOnCompleted(i)" :timeBoxStyle="{backgroundColor: 'transparent', width: '40px'}" :timeTextStyle="{color: 'red'}" :dotTextStyle="{color: '#CCCCCC'}">
                    </wxc-countdown>
                    <text style="color: #CCCCCC; font-size: 18px; font-weight: bold; margin-left: -11px;">后失效</text>
                  </div>
                </div>
                <div style="flex-direction:row;flex: 1 1 0%; padding-top: 10px;">
                  <text class="iconfont red">&#xe651;</text>
                  <text class="c_real" style="color: #ccc;">{{discountObj.position}}</text>
                </div>
              </div>
            </div>
          </wxc-cell>
        </div>
      </scroller>
      <div class="m_cell" v-else>
        <text class="iconfont" style="font-size:128px; margin-top: 232px; text-align: center; color: #cccccc;">&#xe66f;</text>
        <text style="font-size:32px; margin-top: 20px; text-align: center; color: #cccccc;"> 没有查询到结果 </text>
      </div>
      <div style="flex-direction: column; position: absolute; right: 16px; bottom: 16px;">
        <text class="iconfont" :style="addDiscountStyle" @click="discountCreate">&#xe649;</text>
        <text class="iconfont" :style="discountTopStyle" @click="discountScrollToTop">&#xe69e;</text>
      </div>
    </div>
    <div class="item-container" :style="contentStyle">
      <scroller :style="myScrollerStyle">
        <wxc-cell v-if="my.userLoginId != 0" :has-arrow="false" :cell-style="cellStyle" :has-top-border="false" :has-bottom-border="true" :has-margin="false" :auto-accessible="false">
          <image slot="label" class="image avatar" src="data:image/png;base64,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"></image>
          <div slot="title">
            <div style="flex-direction: row;">
              <text class="c_name">{{my.nickname}}</text>
            </div>
          </div>
        </wxc-cell>

        <wxc-cell v-else :has-arrow="false" :cell-style="cellStyle" :has-top-border="false" :has-bottom-border="true" :has-margin="false" :auto-accessible="false">
          <div slot="title">
            <wxc-button type="blue" text="登录" @wxcButtonClicked="loginClicked"></wxc-button>
          </div>
        </wxc-cell>

        <wxc-cell v-if="my.userLoginId != 0" :has-arrow="false" :cell-style="cellStyle" :has-top-border="false" :has-bottom-border="false" :has-margin="false" :auto-accessible="false">
          <div slot="title">
            <wxc-button type="red" text="退出登录" @wxcButtonClicked="logoutClicked"></wxc-button>
          </div>
        </wxc-cell>
      </scroller>
    </div>
  </wxc-tab-bar>
</template>

<script>
import {
  WxcSearchbar,
  Utils,
  WxcTabBar,
  WxcCell,
  WxcButton,
  WxcCountdown
} from "weex-ui";
import {
  getEntryUrl,
  postMessage,
  receiveMessage,
  setStorageValue,
  getStorageValue,
  initIconfont,
  modalDebug,
  getStorageVal,
  setStorageVal
} from "./tools/utils.js";
import tabbarConfig from "./entry/tabbar/config.js";
import { http } from "./tools/http.js";
const navigator = weex.requireModule("navigator");
const storage = weex.requireModule("storage");
const modal = weex.requireModule("modal");
const dom = weex.requireModule("dom");

export default {
  components: { WxcSearchbar, WxcTabBar, WxcCell, WxcButton, WxcCountdown },
  data: () => ({
    city: "",
    cellStyle: { backgroundColor: "#ffffff" },
    tabTitles: tabbarConfig.tabIconFontTitles,
    tabStyles: tabbarConfig.tabIconFontStyles,
    scrollerStyle: {},
    discountList: [],
    discountListNoDataShow: false,
    discountPageNum: 1,
    discountPageSize: 20,
    my: {
      nickname: "我是昵称",
      userLoginId: 0
    },
    discountTopStyle: { visibility: "hidden" },
    discountClientLng: 0,
    discountClientLat: 0,
    main: {
      keywords: "",
      queryList: [],
      queryListNoDataShow: false,
      clientLng: 0,
      clientLat: 0,
      pageNum: 1,
      pageSize: 20
    }
  }),
  created() {
    initIconfont();
    // getStorageVal("way:tab:selectedIndex").then(
    //   index => {
    //     this.switchTabContent(index);
    //     this.$refs["wxc-tab-bar"].setPage(index);
    //   },
    //   error => {}
    // );
    receiveMessage("way:tab:selectedIndex", data => {
      console.log("接收消息selectedIndex", data);
      if (data.val) {
        let index = data.val;
        this.switchTabContent(index);
        this.$refs["wxc-tab-bar"].setPage(index);
      }
    });
    getStorageVal("way:city").then(
      data => {
        let cityObj = JSON.parse(data);
        modalDebug("返回城市对象", data);
        this.city = cityObj.name;
        this.main.clientLng = cityObj.lng;
        this.main.clientLat = cityObj.lat;
        this.searchbarHttp();
      },
      err => {
        this.city = "定位中...";
      }
    );

    const tabPageHeight = Utils.env.getPageHeight();
    // 如果页面没有导航栏，可以用下面这个计算高度的方法
    // const tabPageHeight = env.deviceHeight / env.deviceWidth * 750;
    const { tabStyles } = this;
    //
    this.contentStyle = { height: tabPageHeight - tabStyles.height + "px" };
    this.mcScrollerStyle = {
      height: tabPageHeight - tabStyles.height - 84 + "px",
      width: "750px"
    };
    this.discountScrollerStyle = {
      height: tabPageHeight - tabStyles.height + "px",
      width: "750px"
    };
    this.myScrollerStyle = {
      height: tabPageHeight - tabStyles.height + "px",
      width: "750px"
    };
    this.addDiscountStyle = {
      fontSize: "48px",
      color: "#999999",
      borderColor: "#cccccc",
      borderWidth: "1px",
      borderStyle: "solid",
      borderRadius: "50px",
      width: "64px",
      height: "64px",
      backgroundColor: "#ffffff",
      paddingTop: "7px",
      paddingLeft: "7px",
      opacity: 0.9,
      marginTop: "15px"
    };
    this.discountTopStyle = Object.assign(
      this.discountTopStyle,
      this.addDiscountStyle
    );
    console.log(
      this.contentStyle,
      this.scrollerStyle,
      this.myScrollerStyle,
      this.addDiscountStyle,
      this.discountTopStyle
    );
  },
  methods: {
    wxcTabBarCurrentTabSelected(e) {
      const index = e.page;
      console.log(index);
      this.switchTabContent(index);
    },
    switchTabContent(index) {
      console.log("switch to index ", index);
      if (index == 1) {
        this.loadDiscountTabContent();
      } else if (index == 2) {
        console.log("into my tab");
        this.loadMyTabContent();
      }
    },
    loadDiscountTabContent() {
      if (
        !this.discountTabContentInitTime ||
        this.discountTabContentInitTime < new Date().getTime()
      ) {
        this.discountTabContentInitTime = new Date(
          new Date().getTime() + 3600 * 1000
        ).getTime();

        this.discountList.splice(0, this.discountList.length);
        this.discountPageNum = 1;
        this.fetchDiscount();
      }
    },
    loadMyTabContent() {
      console.log("加载my tab");
      getStorageVal("way:user").then(
        data => {
          let user = JSON.parse(data);
          console.log("加载my tab后", user);
          this.my.nickname = user.userNickName;
          this.my.userLoginId = user.userLoginId;
        },
        error => {
          this.my.userLoginId = 0;
        }
      );
    },
    wxcSearchbarDepChooseClicked() {
      navigator.push({
        url: getEntryUrl("views/city/index"),
        animated: "true"
      });
    },
    fetchMc(event) {
      this.searchbarHttp();
    },
    fetchDiscount(event) {
      let _this = this;
      getStorageVal("way:city").then(
        data => {
          let city = JSON.parse(data);
          _this.discountClientLng = city.lng;
          _this.discountClientLat = city.lat;
          _this.fetchDiscountHttp();
        },
        e => {
          navigator.push({
            url: getEntryUrl("views/city/index"),
            animated: "true"
          });
        }
      );
    },
    fetchDiscountHttp() {
      let _this = this;
      http({
        method: "POST",
        url: "/discount/query",
        headers: {},
        body: {
          //获取已经选择的地域信息
          clientLng: this.discountClientLng,
          clientLat: this.discountClientLat,
          pageNum: this.discountPageNum,
          pageSize: this.discountPageSize
        }
      }).then(
        data => {
          // console.log("success", data);
          if (data.code != 200) {
            return;
          }

          this.discountPageNum++;

          let discountDataList = data.data;
          _this.discountListNoDataShow = discountDataList.length == 0;

          for (let index = 0; index < discountDataList.length; index++) {
            const discountData = discountDataList[index];
            let discountObj = {
              discountId: discountData.id,
              position: discountData.shopPosition,
              cName: discountData.commodityName,
              cPrice: discountData.commodityPrice,
              mDistance: discountData.shopDistance,
              cReal: discountData.commodityReal,
              cCate: discountData.commodityCate,
              cExpireMills: discountData.limitTimeExpireMills,
              commodityImageUrl: discountData.commodityImageUrl
            };
            _this.discountList.push(discountObj);
          }
        },
        error => {
          console.error("failure", error);
        }
      );
    },
    clickReal(i) {
      console.log(i);
      let _this = this;
      http({
        method: "POST",
        url: "/discount/real/increate",
        headers: {},
        body: {
          discountId: this.discountList[i].discountId
        }
      }).then(function(data) {
        if (data.code != 200) {
          return;
        }

        _this.discountList[i].cReal = parseInt(_this.discountList[i].cReal) + 1;
      });
    },
    logoutClicked(e) {
      console.log("退出登录");

      let _this = this;
      http({
        method: "POST",
        url: "/user/logout",
        headers: {},
        body: {
          userLoginId: this.my.userLoginId
        }
      }).then(
        function(data) {
          console.log("success", data);
          if (data.code != 200) {
            return;
          }
          storage.removeItem("way:user", event => {});

          postMessage("way:tab:selectedIndex", 2);
          _this.my.userLoginId = 0;
          location.reload();
          // navigator.pop({ animated: "true" });
          // navigator.push({
          //   url: getEntryUrl("views/user/login"),
          //   animated: "true"
          // });
        },
        function(error) {
          console.error("failure", error);
        }
      );
    },
    loginClicked(e) {
      navigator.push({
        url: getEntryUrl("views/user/login", { tabIndex: 2 }),
        animated: "true"
      });
    },
    discountCellClicked(i) {
      let discount = this.discountList[i];
      postMessage("way:discount:id", discount.discountId);
      navigator.push({
        url: getEntryUrl("views/discount/detail"),
        animated: "true"
      });
    },
    discountScrollToTop() {
      const el = this.$refs.cell0[0];
      dom.scrollToElement(el, {});
    },
    discountCreate() {
      getStorageVal("way:user").then(
        data => {
          navigator.push({
            url: getEntryUrl("views/discount/create"),
            animated: "true"
          });
        },
        error => {
          navigator.push({
            url: getEntryUrl("views/user/login", { tabIndex: 1 }),
            animated: "true"
          });
        }
      );
    },
    discountScrollHandler(e) {
      console.log(e.contentOffset.y);
      if (e.contentOffset.y < -500) {
        this.discountTopStyle.visibility = "visible";
      } else {
        this.discountTopStyle.visibility = "hidden";
      }
    },
    wxcSearchbarInputOnInput(e) {
      this.main.keywords = e.value;
      let _this = this;
      getStorageVal("way:city").then(
        data => {
          let city = JSON.parse(data);
          _this.main.clientLng = city.lng;
          _this.main.clientLat = city.lat;
          _this.main.queryList.splice(0, _this.main.queryList.length);
          _this.main.pageNum = 1;
          _this.searchbarHttp();
        },
        e => {
          navigator.push({
            url: getEntryUrl("views/city/index"),
            animated: "true"
          });
        }
      );
    },
    searchbarHttp() {
      let _this = this;
      http({
        method: "POST",
        url: "/shop/query",
        headers: {},
        body: {
          keywords: this.main.keywords,
          clientLng: this.main.clientLng,
          clientLat: this.main.clientLat,
          pageNum: this.main.pageNum,
          pageSize: this.main.pageSize
        }
      }).then(
        function(data) {
          if (data.code != 200) {
            return;
          }

          let shopQueryDataList = data.data;
          _this.main.queryListNoDataShow = shopQueryDataList.length == 0;

          let shopIndex = 0;
          shopQueryDataList.forEach(shopQueryData => {
            //       {
            //   mName: "商家名称",
            //   cName: "商品名称",
            //   cPrice: "1.8",
            //   mDistance: "652m"
            // }
            let commodityData = shopQueryData.commodityList;
            let cList = [];
            commodityData.forEach(commodity => {
              cList.push({
                cId: commodity.id,
                cName: commodity.name,
                cPrice: commodity.price,
                cImgUrl: commodity.imgUrl
              });
            });

            _this.main.queryList.push({
              shopIndex: shopIndex++,
              mName: shopQueryData.shopName,
              shopLogoUrl: shopQueryData.shopLogoUrl,
              firstList: cList.slice(0, 1),
              moreList: cList.length > 1 ? cList.slice(1) : [],
              isMore: cList.length > 1 ? true : false,
              moreNum: cList.length > 1 ? cList.length - 1 : 0,
              mDistance: shopQueryData.shopDistance
            });
          });

          _this.main.pageNum++;
        },
        function(error) {
          console.error("failure", error);
        }
      );
    },
    moreCommodityClicked(shopIndex) {
      let shopItem = this.main.queryList[shopIndex];
      console.log(shopIndex, shopItem);
      shopItem.firstList = shopItem.firstList.concat(shopItem.moreList);
      shopItem.isMore = !shopItem.isMore;
      this.main.queryList[shopIndex] = shopItem;
    },
    unMoreCommodityClicked(shopIndex) {
      let shopItem = this.main.queryList[shopIndex];
      console.log(shopIndex, shopItem);
      shopItem.moreList = shopItem.firstList.slice(1);
      shopItem.firstList = shopItem.firstList.slice(0, 1);
      shopItem.isMore = !shopItem.isMore;
      this.main.queryList[shopIndex] = shopItem;
    },
    commodityCellClick(i, j) {
      let shopItem = this.main.queryList[i];
      console.log(i, j, shopItem);
      let commodityItem = null;
      if (j === 0) {
        commodityItem = shopItem.firstList[0];
      } else {
        commodityItem = shopItem.moreList[j - 1];
      }
      console.log(commodityItem);
      if (commodityItem) {
        console.log("跳转到商品详情页面");
        postMessage("way:commodity:id", commodityItem.cId);
        navigator.push({
          url: getEntryUrl("views/commodity/detail"),
          animated: "true"
        });
      }
    },
    discountExpireOnCompleted(i) {
      this.discountList.splice(i, 1);
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
.item-container {
  width: 750px;
  background-color: #ffffff;
  align-items: center;
}
.image {
  width: 140px;
  height: 140px;
  margin-right: 10px;
  border-radius: 10px;
}
.shop_image {
  width: 64px;
  height: 64px;
  border-radius: 5px;
}
.avatar {
  border-radius: 50px;
  border-width: 1px;
  border-style: solid;
  border-color: #cccccc;
}
.m_cell {
  padding-bottom: 2px;
  margin-bottom: 6px;
}
.m_cell_split {
  height: 10px;
  background-color: #f2f3f4;
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
.red {
  color: red;
}
.refresh {
  width: 750;
  display: -ms-flex;
  display: -webkit-flex;
  display: flex;
  -ms-flex-align: center;
  -webkit-align-items: center;
  -webkit-box-align: center;
  align-items: center;
}
.loading {
  width: 750;
  display: -ms-flex;
  display: -webkit-flex;
  display: flex;
  -ms-flex-align: center;
  -webkit-align-items: center;
  -webkit-box-align: center;
  align-items: center;
}
.indicator-text {
  color: #888888;
  font-size: 30px;
  text-align: center;
}
.indicator {
  margin-top: 16px;
  height: 40px;
  width: 40px;
  color: blue;
}
.panel {
  width: 600px;
  height: 250px;
  margin-left: 75px;
  margin-top: 35px;
  margin-bottom: 35px;
  flex-direction: column;
  justify-content: center;
  border-width: 2px;
  border-style: solid;
  border-color: #dddddd;
  background-color: #f5f5f5;
}
.text {
  font-size: 50px;
  text-align: center;
  color: #41b883;
}
</style>