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
              <!--
              <div style="flex-direction:row;">
                <text class="c_name c_money" style="font-size:20px; padding-top: 3px;">¥</text>
                <text class="c_money">{{cItem.cPrice}}</text>
              </div>
              -->
            </div>
          </wxc-cell>
          <wxc-cell v-if="commodityObj.moreList.length > 0" :has-arrow="false" :has-top-border="false" :has-bottom-border="true" :has-margin="false" :auto-accessible="false">
            <text slot="title" class="iconfont" style="text-align: center;" v-if="commodityObj.isMore == true" @click="moreCommodityClicked(commodityObj.shopIndex)"> 查看更多{{commodityObj.moreList.length}}个 &#xe661 </text>
            <text slot="title" class="iconfont" style="text-align: center;" v-else @click="unMoreCommodityClicked(commodityObj.shopIndex)"> 收起 &#xe6de </text>
          </wxc-cell>
        </div>
      </scroller>
      <div class="m_cell" v-else>
        <text v-if="main.needLocation == false" class="iconfont" style="font-size:128px; margin-top: 232px; text-align: center; color: #cccccc;">&#xe66f;</text>
        <text v-if="main.needLocation == true" class="iconfont" style="font-size:128px; margin-top: 232px; text-align: center; color: #cccccc;">&#xe651;</text>
        <text style="font-size:32px; margin-top: 20px; text-align: center; color: #cccccc;">{{main.noDataTip}}</text>
      </div>
    </div>
    <div class="item-container" :style="contentStyle">
      <scroller v-if="!discountListNoDataShow" :style="discountScrollerStyle" @loadmore="fetchDiscount" loadmoreoffset="10" @scroll="discountScrollHandler">
        <refresh @refresh="discountOnRefresh" @pullingdown="onpullingdown" :display="refreshing ? 'show' : 'hide'">
          <text>{{refreshText}}</text>
          <loading-indicator></loading-indicator>
        </refresh>
        <div class="m_cell" v-for="(discountObj, i) in discountList" :key="i" :ref="'cell'+i">
          <div class="m_cell_split" v-if="i != 0"></div>
          <wxc-cell @wxcCellClicked="discountCellClicked(i)" :has-arrow="false" :cell-style="cellStyle" :has-top-border="false" :has-bottom-border="false" :has-margin="false" :auto-accessible="false">
            <image slot="label" class="image" resize="cover" :src="discountObj.commodityImageUrl"></image>
            <div slot="title">
              <div style="flex-direction: row; height: auto;">
                <text class="c_name" style="width: 480px;">{{discountObj.cName}}</text>
                <div style="flex: 1 1 0%; -webkit-box-flex: 1;">
                  <text style="text-align: right; font-size: 26px; padding-top: 5px;">{{discountObj.mDistance}}</text>
                </div>
              </div>
              <div style="flex-direction:row;">
                <text class="c_name c_money" style="padding-top:4px;">¥{{discountObj.cPrice}}</text>
              </div>
              <div :key="i" :index="i" style="flex-direction: row; height: auto; padding-left: 20px; margin-top: 10px;">
                  <text class="iconfont red" style="font-size: 24px;">&#xe651;</text>
                  <text class="c_real" style="color: #ccc; width: 500px;">{{discountObj.position}}</text>
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
        <!-- <text class="iconfont" :style="addDiscountStyle" @click="discountCreate">&#xe649;</text> -->
        <text class="iconfont" :style="discountTopStyle" @click="discountScrollToTop">&#xe69e;</text>
      </div>
    </div>
    <div class="item-container" :style="contentStyle">
      <scroller :style="myScrollerStyle">
        <wxc-cell v-if="my.userLoginId != 0" :has-arrow="false" :cell-style="cellStyle" :has-top-border="false" :has-bottom-border="true" :has-margin="false" :auto-accessible="false">
          <image slot="label" class="image avatar" src="http://static.jicu.vip/user.png"></image>
          <div slot="title">
            <div style="flex-direction: row;">
              <text class="c_name">{{my.nickname}}</text>
            </div>
          </div>
        </wxc-cell>

        <wxc-cell v-if="my.userLoginId != 0" title="我发布的优惠信息"
                  @wxcCellClicked="userDiscountClick"
                  :has-top-border="true" :has-arrow="true"></wxc-cell>

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
import { WxcSearchbar, Utils, WxcTabBar, WxcCell, WxcButton } from 'weex-ui'
import {
  getEntryUrl,
  postMessage,
  receiveMessage,
  setStorageValue,
  getStorageValue,
  initIconfont,
  setPageTitle,
  modalDebug,
  getStorageVal,
  setStorageVal
} from './tools/utils.js'
import tabbarConfig from './entry/tabbar/config.js'
import { http } from './tools/http.js'
const navigator = weex.requireModule('navigator')
const storage = weex.requireModule('storage')
const modal = weex.requireModule('modal')
const dom = weex.requireModule('dom')

export default {
  components: { WxcSearchbar, WxcTabBar, WxcCell, WxcButton },
  data: () => ({
    city: '',
    cellStyle: { backgroundColor: '#ffffff' },
    tabTitles: tabbarConfig.tabIconFontTitles,
    tabStyles: tabbarConfig.tabIconFontStyles,
    scrollerStyle: {},
    discountList: [],
    discountListNoDataShow: false,
    discountPageNum: 1,
    discountPageSize: 20,
    my: {
      nickname: '我是昵称',
      userLoginId: 0,
      userToken: ''
    },
    discountTopStyle: { visibility: 'hidden' },
    discountClientLng: 0,
    discountClientLat: 0,
    discountCityCode: '',
    discountRealUserLoginId: 0,
    refreshing: false,
    refreshText: '下拉刷新',
    userToken: '',
    main: {
      init: false,
      keywords: '',
      queryList: [],
      queryListNoDataShow: false,
      noDataTip: '',
      needLocation: false,
      clientLng: 0,
      clientLat: 0,
      cityCode: '',
      pageNum: 1,
      pageSize: 20
    }
  }),
  beforeCreate() {
    setPageTitle('首页')
  },
  created() {
    initIconfont()
    // getStorageVal("way:tab:selectedIndex").then(
    //   index => {
    //     this.switchTabContent(index);
    //     this.$refs["wxc-tab-bar"].setPage(index);
    //   },
    //   error => {}
    // );
    // alert("外面");
    receiveMessage('way:tab:selectedIndex').then(data => {
      console.log('接收消息selectedIndex', data)
      // alert("里面");
      if (data.val) {
        // alert("tab1");
        let index = data.val
        this.switchTabContent(index)
        this.$refs['wxc-tab-bar'].setPage(index)
      } else {
        // alert("tab0");
        this.initMainTab()
      }
    })

    const tabPageHeight = Utils.env.getPageHeight()
    // 如果页面没有导航栏，可以用下面这个计算高度的方法
    // const tabPageHeight = env.deviceHeight / env.deviceWidth * 750;
    const { tabStyles } = this
    //
    this.contentStyle = { height: tabPageHeight - tabStyles.height + 'px' }
    this.mcScrollerStyle = {
      height: tabPageHeight - tabStyles.height - 84 + 'px',
      width: '750px'
    }
    this.discountScrollerStyle = {
      height: tabPageHeight - tabStyles.height + 'px',
      width: '750px'
    }
    this.myScrollerStyle = {
      height: tabPageHeight - tabStyles.height + 'px',
      width: '750px'
    }
    this.addDiscountStyle = {
      fontSize: '48px',
      color: '#999999',
      borderColor: '#cccccc',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderRadius: '50px',
      width: '64px',
      height: '64px',
      backgroundColor: '#ffffff',
      paddingTop: '7px',
      paddingLeft: '7px',
      opacity: 0.9,
      marginTop: '15px'
    }
    this.discountTopStyle = Object.assign(
      this.discountTopStyle,
      this.addDiscountStyle
    )
    console.log(
      this.contentStyle,
      this.scrollerStyle,
      this.myScrollerStyle,
      this.addDiscountStyle,
      this.discountTopStyle
    )
  },
  methods: {
    initMainTab() {
      getStorageVal('way:city').then(
        data => {
          let cityObj = JSON.parse(data)
          modalDebug('返回城市对象', data)
          this.main.queryListNoDataShow = false
          this.main.noDataTip = '没有查询到结果'
          this.main.needLocation = false

          this.city = cityObj.name
          this.main.clientLng = cityObj.lng
          this.main.clientLat = cityObj.lat
          this.main.cityCode = cityObj.cityCode
          this.searchbarHttp()
        },
        err => {
          this.main.queryListNoDataShow = true
          this.main.noDataTip = '我需要你的位置信息'
          this.main.needLocation = true
          this.city = '定位中...'
        }
      )
    },
    wxcTabBarCurrentTabSelected(e) {
      const index = e.page
      console.log(index)
      this.switchTabContent(index)
    },
    switchTabContent(index) {
      console.log('switch to index ', index)
      if (index == 1) {
        setPageTitle('优惠信息')
        this.loadDiscountTabContent()
      } else if (index == 2) {
        console.log('into my tab')
        setPageTitle('个人信息')
        this.loadMyTabContent()
      } else {
        setPageTitle('首页')
        console.log('init first tab', this.main.init)
        if (this.main.init == false) {
          this.main.init = true
          this.initMainTab()
        }
      }
    },
    loadDiscountTabContent() {
      if (
        !this.discountTabContentInitTime ||
        this.discountTabContentInitTime < new Date().getTime()
      ) {
        this.discountTabContentInitTime = new Date(
          new Date().getTime() + 3600 * 1000
        ).getTime()

        this.discountList.splice(0, this.discountList.length)
        this.discountPageNum = 1
        getStorageVal('way:user').then(
          data => {
            let user = JSON.parse(data)
            console.log('加载discount tab后', user)
            // this.discountRealUserLoginId = user.userLoginId;
            // this.userToken = user.userToken;
            this.fetchDiscount()
          },
          error => {
            this.discountRealUserLoginId = 0
            this.fetchDiscount()
          }
        )
      }
    },
    loadMyTabContent() {
      console.log('加载my tab')
      getStorageVal('way:user').then(
        data => {
          let user = JSON.parse(data)
          console.log('加载my tab后', user)
          this.my.nickname = user.userNickName
          this.my.userLoginId = user.userLoginId
          this.my.userToken = user.userToken
        },
        error => {
          this.my.userLoginId = 0
        }
      )
    },
    wxcSearchbarDepChooseClicked() {
      navigator.push({
        url: getEntryUrl('views/city/index'),
        animated: 'true'
      })
    },
    fetchMc(event) {
      this.searchbarHttp()
    },
    fetchDiscount(event) {
      let _this = this
      getStorageVal('way:city').then(
        data => {
          let city = JSON.parse(data)
          _this.discountClientLng = city.lng
          _this.discountClientLat = city.lat
          _this.discountCityCode = city.cityCode
          _this.fetchDiscountHttp()
        },
        e => {
          navigator.push({
            url: getEntryUrl('views/city/index'),
            animated: 'true'
          })
        }
      )
    },
    fetchDiscountHttp() {
      let _this = this
      http({
        method: 'POST',
        url: '/discount/query',
        headers: {},
        body: {
          //获取已经选择的地域信息
          clientLng: this.discountClientLng,
          clientLat: this.discountClientLat,
          pageNum: this.discountPageNum,
          pageSize: this.discountPageSize,
          cityCode: this.discountCityCode
          // realUserLoginId: this.discountRealUserLoginId
        }
      }).then(
        data => {
          // console.log("success", data);
          if (data.code != 200) {
            return
          }

          this.discountPageNum++

          let discountDataList = data.data

          for (let index = 0; index < discountDataList.length; index++) {
            const discountData = discountDataList[index]
            let discountObj = {
              discountId: discountData.id,
              position: discountData.shopPosition,
              cName: discountData.commodityName,
              cPrice: discountData.commodityPrice,
              mDistance: discountData.shopDistance,
              cReal: discountData.commodityReal,
              cCate: discountData.commodityCate,
              cExpireMills: discountData.limitTimeExpireMills,
              commodityImageUrl: discountData.commodityImageUrl,
              realUserLoginId: discountData.realUserLoginId
            }
            _this.discountList.push(discountObj)
          }

          _this.discountListNoDataShow = _this.discountList.length == 0
        },
        error => {
          console.error('failure', error)
        }
      )
    },
    logoutClicked(e) {
      console.log('退出登录')

      let _this = this
      http({
        method: 'POST',
        url: '/user/logout',
        headers: {
          token: this.my.userToken
        },
        body: {
          userLoginId: this.my.userLoginId
        }
      }).then(
        function(data) {
          console.log('success', data)
          if (data.code != 200) {
            modal.toast({
              message: data.msg,
              duration: 2
            })
            return
          }
          storage.removeItem('way:user', event => {})

          postMessage('way:tab:selectedIndex', 2)
          _this.my.userLoginId = 0
          location.reload()
          // navigator.pop({ animated: "true" });
          // navigator.push({
          //   url: getEntryUrl("views/user/login"),
          //   animated: "true"
          // });
        },
        function(error) {
          console.error('failure', error)
        }
      )
    },
    loginClicked(e) {
      navigator.push({
        url: getEntryUrl('views/user/login', { tabIndex: 2 }),
        animated: 'true'
      })
    },
    discountCellClicked(i) {
      let discount = this.discountList[i]
      postMessage('way:discount:id', discount.discountId)
      navigator.push({
        url: getEntryUrl('views/discount/detail', {
          discountId: discount.discountId
        }),
        animated: 'true'
      })
    },
    discountScrollToTop() {
      const el = this.$refs.cell0[0]
      dom.scrollToElement(el, {})
    },
    discountCreate() {
      getStorageVal('way:user').then(
        data => {
          navigator.push({
            url: getEntryUrl('views/discount/create'),
            animated: 'true'
          })
        },
        error => {
          navigator.push({
            url: getEntryUrl('views/user/login', { tabIndex: 1 }),
            animated: 'true'
          })
        }
      )
    },
    discountScrollHandler(e) {
      console.log(e.contentOffset.y)
      if (e.contentOffset.y < -500) {
        this.discountTopStyle.visibility = 'visible'
      } else {
        this.discountTopStyle.visibility = 'hidden'
      }
    },
    wxcSearchbarInputOnInput(e) {
      this.main.keywords = e.value
      let _this = this
      getStorageVal('way:city').then(
        data => {
          let city = JSON.parse(data)
          _this.main.clientLng = city.lng
          _this.main.clientLat = city.lat
          _this.main.cityCode = city.cityCode
          _this.main.queryList.splice(0, _this.main.queryList.length)
          _this.main.pageNum = 1
          _this.searchbarHttp()
        },
        e => {
          navigator.push({
            url: getEntryUrl('views/city/index'),
            animated: 'true'
          })
        }
      )
    },
    searchbarHttp() {
      let _this = this
      http({
        method: 'POST',
        url: '/shop/query',
        headers: {},
        body: {
          keywords: this.main.keywords,
          clientLng: this.main.clientLng,
          clientLat: this.main.clientLat,
          cityCode: this.main.cityCode,
          pageNum: this.main.pageNum,
          pageSize: this.main.pageSize
        }
      }).then(
        function(data) {
          if (data.code != 200) {
            return
          }

          let shopQueryDataList = data.data

          let shopIndex = 0
          shopQueryDataList.forEach(shopQueryData => {
            //       {
            //   mName: "商家名称",
            //   cName: "商品名称",
            //   cPrice: "1.8",
            //   mDistance: "652m"
            // }
            let commodityData = shopQueryData.commodityList
            let cList = []
            commodityData.forEach(commodity => {
              cList.push({
                cId: commodity.id,
                cName: commodity.name,
                // cPrice: commodity.price,
                cImgUrl: commodity.imgUrl
              })
            })

            _this.main.queryList.push({
              shopIndex: shopIndex++,
              mName: shopQueryData.shopName,
              shopLogoUrl: shopQueryData.shopLogoUrl,
              firstList: cList.slice(0, 1),
              moreList: cList.length > 1 ? cList.slice(1) : [],
              isMore: cList.length > 1 ? true : false,
              moreNum: cList.length > 1 ? cList.length - 1 : 0,
              mDistance: shopQueryData.shopDistance
            })
          })

          _this.main.queryListNoDataShow = _this.main.queryList.length == 0

          _this.main.pageNum++
        },
        function(error) {
          console.error('failure', error)
        }
      )
    },
    moreCommodityClicked(shopIndex) {
      let shopItem = this.main.queryList[shopIndex]
      console.log(shopIndex, shopItem)
      shopItem.firstList = shopItem.firstList.concat(shopItem.moreList)
      shopItem.isMore = !shopItem.isMore
      this.main.queryList[shopIndex] = shopItem
    },
    unMoreCommodityClicked(shopIndex) {
      let shopItem = this.main.queryList[shopIndex]
      console.log(shopIndex, shopItem)
      shopItem.moreList = shopItem.firstList.slice(1)
      shopItem.firstList = shopItem.firstList.slice(0, 1)
      shopItem.isMore = !shopItem.isMore
      this.main.queryList[shopIndex] = shopItem
    },
    commodityCellClick(i, j) {
      let shopItem = this.main.queryList[i]
      console.log(i, j, shopItem)
      let commodityItem = null
      if (j === 0) {
        commodityItem = shopItem.firstList[0]
      } else {
        commodityItem = shopItem.moreList[j - 1]
      }
      console.log(commodityItem)
      if (commodityItem) {
        console.log('跳转到商品详情页面')
        // postMessage("way:commodity:id", commodityItem.cId);
        navigator.push({
          url: getEntryUrl('views/commodity/detail', {
            cid: commodityItem.cId
          }),
          animated: 'true'
        })
      }
    },
    // discountExpireOnCompleted(i) {
    //   console.log("优惠过期", i);
    //   this.discountList.splice(i, 1);
    // },
    discountOnRefresh() {
      // this.refreshing = true;
      console.log('refresh')
      this.refreshText = '加载中'

      this.discountPageNum = 1
      this.discountList.splice(0, this.discountList.length)
      this.fetchDiscount()
    },
    onpullingdown(event) {
      this.refreshing = true
      this.refreshText = '下拉加载'
      console.log(
        'pulling down',
        event.pullingDistance,
        event.dy,
        event.viewHeight
      )
    },
    userDiscountClick() {
      navigator.push({
        url: getEntryUrl('views/user/myDiscount'),
        animated: 'true'
      })
    }
  }
}
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