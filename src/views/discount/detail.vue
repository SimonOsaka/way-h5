<template>
  <div>
    <scroller class="scroller">
      <div>
        <wxc-noticebar type="info" notice="亲情提示：此图非实物，请以实物为准。" mode="closable"></wxc-noticebar>
      </div>
      <div>
        <image class="image" resize="cover" :src="discountObj.commodityImageUrl"></image>
      </div>
      <div>
        <wxc-cell :has-arrow="false" :has-bottom-border="true" :cell-style="priceCellStyle">
          <div slot="label">
            <div style="flex-direction:row;">
              <text style="font-size:48px; padding-top: 32px; color: #ffffff;">¥</text>
              <text style="font-size:84px; color: #ffffff;">{{discountObj.lPrice}}</text>
              <text style="font-size:48px; padding-top: 32px; color: #ffffff;">{{discountObj.rPrice}}</text>
            </div>
          </div>
          <div slot="value" v-if="discountObj.cExpireMills" style="background-color: #fdee7f; height: 106px; width: 180px;">
            <div style="flex-direction: column; align-items: center; margin-top: 18px;">
              <text style="color: #9e495b; font-size: 24px;">距结束仅剩</text>
              <wxc-countdown :time="discountObj.cExpireMills" tpl="{h}:{m}:{s}" @wxcOnComplete="expiredOnCompleted" :style="{marginLeft: '10px', marginRight: '0', marginTop: '5px'}" :timeBoxStyle="{backgroundColor: '#690b08', borderRadius: '6px', width:'auto', paddingLeft:'2px', paddingRight: '2px'}" :timeTextStyle="{fontSize: '24px', color: '#fff'}" :dotBoxStyle="{width: 'auto'}" :dotTextStyle="{fontSize: '24px', color: 'grey', paddingLeft:'2px', paddingRight: '2px'}">
              </wxc-countdown>
            </div>
          </div>
        </wxc-cell>
      </div>
      <div>
        <wxc-cell :has-arrow="false" :has-bottom-border="true" :cell-style="cellStyle">
          <div slot="label">
            <div style="flex-direction: row;">
              <text style="width: 420px; word-wrap: break-word;">{{discountObj.cName}}</text>
            </div>
          </div>
          <div slot="value" style="flex-direction: row;">
            <div style="flex-direction: column; margin-left: 10px;" v-if="discountReal.highlight == 'real'">
              <text class="iconfont" style="font-size: 42px; color: #E61414;">&#xe7f2;</text>
              <text style="font-size: 22px; color: #E61414; text-align: center;">{{discountReal.real}}</text>
            </div>
            <div style="flex-direction: column; margin-left: 10px;" v-else>
              <text class="iconfont" style="font-size: 42px;">&#xe7f2;</text>
              <text style="font-size: 22px; text-align: center;">{{discountReal.real}}</text>
            </div>
            <div style="flex-direction: column; margin-left: 50px;" v-if="discountReal.highlight == 'unreal'">
              <text class="iconfont" style="font-size: 42px; color: #E61414;">&#xe846;</text>
              <text style="font-size: 22px; color: #E61414; text-align: center;">{{discountReal.unreal}}</text>
            </div>
            <div style="flex-direction: column; margin-left: 50px;" v-else>
              <text class="iconfont" style="font-size: 42px;">&#xe846;</text>
              <text style="font-size: 22px; text-align: center;">{{discountReal.unreal}}</text>
            </div>
            <div style="flex-direction: column; margin-left: 50px;" @click="shareClicked">
              <text class="iconfont" style="font-size: 42px;">&#xe6f3;</text>
              <text style="font-size: 22px;">分享</text>
            </div>
          </div>
        </wxc-cell>
      </div>
      <div>
        <wxc-cell :has-arrow="false" :has-bottom-border="true">
          <div slot="label" style="flex-direction:row;">
            <text class="iconfont" style="margin-top:6px; color: red;">&#xe651;</text>
            <text style="width: 650px;">{{discountObj.position}}</text>
          </div>
        </wxc-cell>
      </div>
      <div>
        <wxc-cell :has-arrow="false" :has-bottom-border="true" @wxcCellClicked="clickStaticMap()">
          <div slot="label" style="flex-direction:row; text-align: center;">
            <image :src="discountObj.staticMapUrl" style="width: 700px; height: 300px;"></image>
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

    <wxc-dialog title="微信分享" content="请使用浏览器下方的微信分享功能" :show="show" :single="true" @wxcDialogConfirmBtnClicked="wxcDialogConfirmBtnClicked"></wxc-dialog>

    <wxc-mask height="80" width="240" border-radius="5" duration="200" mask-bg-color="#FFFFFF" :has-animation="false" :has-overlay="true" :show-close="false" :show="expiredShow">
      <div style="flex-direction: row; justify-content: center; align-items: center; padding-top: 5px;">
        <text class="iconfont" style="font-size: 64px;">&#xe65f;</text>
        <text style="font-size: 32px;">优惠已结束</text>
      </div>
    </wxc-mask>

    <wxc-mask height="100" :top="24" border-radius="0" duration="200" mask-bg-color="transparent" :has-animation="true" :has-overlay="true" :show-close="false" :show="weixinShow" @wxcMaskSetHidden="weixinMaskSetHidden">
      <div style="flex-direction: column; align-items: flex-end; position: absolute; top: 25px; right: 50px;">
        <text class="iconfont" style="font-size: 64px; color: #fff;">&#xe728;</text>
        <text class="iconfont" style="font-size: 48px;color: #fff;"> 请点击右上角的&#xe684;</text>
        <text style="color: #fff;font-size: 48px;">进行分享</text>
      </div>
    </wxc-mask>
  </div>
</template>

<script>
import {
  Utils,
  WxcCell,
  WxcPopup,
  WxcDialog,
  WxcCountdown,
  WxcMask,
  WxcNoticebar
} from 'weex-ui'
import {
  getEntryUrl,
  receiveMessage,
  setStorageValue,
  getStorageValue,
  initIconfont,
  getStorageVal,
  getUrlKey,
  setPageTitle,
  setOgImage,
  setStorageVal
} from '../../tools/utils.js'
import { loadCateImageUrl } from '../../tools/image.js'
import { http } from '../../tools/http.js'
const navigator = weex.requireModule('navigator')
const modal = weex.requireModule('modal')

export default {
  components: {
    WxcCell,
    WxcPopup,
    WxcDialog,
    WxcCountdown,
    WxcMask,
    WxcNoticebar
  },
  data: () => ({
    priceCellStyle: {
      height: '106px',
      backgroundColor: '#E61414',
      paddingTop: '10px',
      paddingBottom: '10px',
      paddingRight: 0
    },
    cellStyle: { height: 'auto' },
    secondCellStyle: { paddingTop: '0' },
    discountObj: {
      id: 0,
      cPicUrl: '',
      cName: '',
      cPrice: '',
      position: '',
      staticMapUrl: ''
    },
    discountReal: {
      real: '',
      unreal: '',
      highlight: ''
    },
    isAutoShow: false,
    show: false,
    realUserLoginId: 0,
    realUserToken: '',
    expiredShow: false,
    weixinShow: false
  }),
  beforeCreate() {
    initIconfont()
  },
  created() {
    console.log('created in...')
    this.discountObj.id = getUrlKey('discountId')
    console.log('获取地址栏参数', this.discountObj.id)
    if (!this.discountObj.id) {
      navigator.pop()
      return
    }

    setStorageVal('way:discount:id', this.discountObj.id)

    getStorageVal('way:user').then(
      data => {
        let user = JSON.parse(data)
        this.realUserLoginId = user.userLoginId
        this.realUserToken = user.userToken
        console.log('realUserLoginId=', this.realUserLoginId)
        this.discountDetailHttp()
      },
      error => {
        this.discountDetailHttp()
      }
    )
    console.log('created out...')
  },
  methods: {
    popupOverlayAutoClick() {
      this.isAutoShow = false
    },
    shareClicked() {
      this.isAutoShow = true
    },
    weixinClicked() {
      console.log('weixin clicked...')
      let userAgent = window.navigator.userAgent
      if (userAgent.indexOf('MicroMessenger') != -1) {
        this.weixinShow = true
      } else {
        this.show = true
      }
    },
    wxcDialogConfirmBtnClicked() {
      this.show = false
    },
    discountDetailHttp() {
      let _this = this
      console.log('realUserLoginId', this.realUserLoginId)
      http({
        method: 'GET',
        url: '/discount/getDetail',
        headers: {
          token: this.realUserToken || ''
        },
        params: {
          discountId: this.discountObj.id,
          realUserLoginId: this.realUserLoginId
        }
      }).then(
        function(data) {
          console.log('success', data)
          if (data.code != 200) {
            navigator.push({
              url: getEntryUrl('404'),
              animated: true
            })
            return
          }
          let discountDetail = data.data
          _this.discountObj.id = discountDetail.id
          _this.discountObj.cName = discountDetail.commodityName

          if (discountDetail.commodityPrice >= 0) {
            let strPrice = discountDetail.commodityPrice.toString()
            let dotPos = strPrice.indexOf('.')
            if (dotPos != -1) {
              _this.discountObj.lPrice = strPrice.slice(0, dotPos)
              _this.discountObj.rPrice = strPrice.slice(dotPos)
            } else {
              _this.discountObj.lPrice = strPrice
              console.log('商品价格', _this.discountObj.lPrice)
            }
            // _this.discountObj.cPrice = discountDetail.commodityPrice;
          }
          _this.discountObj.position = discountDetail.shopPosition
          _this.discountObj.cCate = discountDetail.commodityCate
          _this.discountObj.staticMapUrl = discountDetail.staticMapUrl
          _this.discountObj.shopLng = discountDetail.shopLng
          _this.discountObj.shopLat = discountDetail.shopLat
          _this.discountObj.commodityImageUrl = discountDetail.commodityImageUrl
          _this.discountObj.cExpireMills = discountDetail.limitTimeExpireMills
          _this.discountObj.commodityReal = discountDetail.commodityReal
          _this.discountObj.commodityUnreal = discountDetail.commodityUnreal
          _this.discountObj.realType = discountDetail.realType
          _this.discountReal = {
            real:
              discountDetail.commodityReal > 0
                ? discountDetail.commodityReal
                : '好评',
            unreal:
              discountDetail.commodityUnreal > 0
                ? discountDetail.commodityUnreal
                : '差评',
            highlight:
              discountDetail.realType == 0
                ? 'real'
                : discountDetail.realType == 1 ? 'unreal' : ''
          }

          setPageTitle(_this.discountObj.cName)
          setOgImage(_this.discountObj.commodityImageUrl)
        },
        function(error) {
          console.error('failure', error)
        }
      )
    },
    increaseReal(operate, realType) {
      let _this = this
      getStorageVal('way:user').then(
        data => {
          let user = JSON.parse(data)
          let realUserLoginId = user.userLoginId
          let userToken = user.userToken
          let discountId = _this.discountObj.id
          let url
          if (operate == 'increase') {
            url = '/discount/real/increase'
          } else if (operate == 'decrease') {
            url = '/discount/real/decrease'
          } else {
            return
          }
          http({
            method: 'POST',
            url: url,
            headers: {
              token: userToken
            },
            body: {
              realType: realType,
              discountId: discountId,
              realUserLoginId: realUserLoginId
            }
          }).then(function(data) {
            if (data.code != 200) {
              modal.toast({
                message: data.msg,
                duration: 2
              })
              return
            }

            let discountRealItem = data.data
            let realCount =
              discountRealItem.discountReal == 0
                ? '好评'
                : discountRealItem.discountReal

            let unrealCount =
              discountRealItem.discountUnReal == 0
                ? '差评'
                : discountRealItem.discountUnReal

            _this.discountReal = {
              real: realCount,
              unreal: unrealCount,
              highlight: operate == 'increase' ? realType : ''
            }
          })
        },
        error => {
          navigator.push({
            url: getEntryUrl('views/user/login'),
            animated: true
          })
        }
      )
    },
    clickIncreaseReal() {
      this.increaseReal('increase', 'real')
    },
    clickDecreaseReal() {
      this.increaseReal('decrease', 'real')
    },
    clickIncreaseUnreal() {
      this.increaseReal('increase', 'unreal')
    },
    clickDecreaseUnreal() {
      this.increaseReal('decrease', 'unreal')
    },
    clickStaticMap() {
      let dest = this.discountObj.shopLng + ',' + this.discountObj.shopLat
      let destName = encodeURIComponent(this.discountObj.position)
      getStorageVal('way:city').then(
        data => {
          let city = JSON.parse(data)
          let start = city.lng + ',' + city.lat

          window.location.href =
            '//m.amap.com/navi/?start=' +
            start +
            '&dest=' +
            dest +
            '&destName=' +
            destName +
            '&naviBy=walk&key=e318d250a2b4d53d864f7d712cc069da'
        },
        err => {
          window.location.href =
            '//m.amap.com/navi/?dest=' +
            dest +
            '&destName=' +
            destName +
            '&key=e318d250a2b4d53d864f7d712cc069da'
        }
      )
    },
    expiredOnCompleted() {
      console.log('优惠已结束')
      this.expiredShow = true
    },
    weixinMaskSetHidden() {
      this.weixinShow = false
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