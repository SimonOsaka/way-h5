export function initIconfont() {
  let domModule = weex.requireModule('dom')
  domModule.addRule('fontFace', {
    'fontFamily': 'iconfont',
    'src': "url('//at.alicdn.com/t/font_707137_u41gc4d7dj.ttf')"
  })
}

export function setPageTitle(title) {

  document.title = title || "页面";
}

export function getEntryUrl(filename, parameters) {
  const bundleUrl = weex.config.bundleUrl;

  // const host = /\/\/([^/]+?)\//.exec(bundleUrl)[0]

  const isAndroidAssets = bundleUrl.indexOf('your_current_IP') >= 0 || bundleUrl.indexOf('file://assets/') >= 0
  const isiOSAssets = bundleUrl.indexOf('file:///') >= 0 && bundleUrl.indexOf('.app') > 0

  const isWeb = weex.config.env.platform.toLowerCase() === 'web'
  let url = ''
  if (isWeb) {
    url = `/${filename}.html`
    if (parameters) {
      url += '?';
      let ps = [];
      for (const key in parameters) {
        if (parameters.hasOwnProperty(key)) {
          const val = parameters[key];
          ps.push(key + '=' + val);
        }
      }
      url += ps.join('&');
    }
  } else {
    if (isiOSAssets || isAndroidAssets) {
      url = `${bundleUrl.split('bundlejs')[0]}/bundlejs/${filename}.js`
    } else {
      url = `${bundleUrl.split('/dist')[0]}/dist/${filename}.js`
    }
  }
  return url
}

export function getUrlSearch(url, name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = url.slice(url.indexOf('?') + 1).match(reg)
  if (r != null) {
    try {
      return decodeURIComponent(r[2])
    } catch (_e) {
      return null
    }
  }
  return null
}

export function isEmpty(obj) {
  if (obj == null || obj == '' || obj == 'undefined' || obj == 'null') {
    return true
  }
  if (obj.length > 0) return false
  if (obj.length === 0) return true
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return false
  }
  return true
}

export function whichPlatform() {
  return weex.config.env.platform.toLowerCase()
}
const modal = weex.requireModule("modal");
export function getStorageValue(key) {
  const storage = weex.requireModule('storage');
  let storageVal = '';
  storage.getItem(key, (e) => {
    console.log(e);
    if (e.result == 'success') {
      storageVal = e.data;
    }
  });
  return storageVal;
}

export function setStorageVal(key, val) {
  modalDebug(key + val);
  return new Promise(function (resolve, reject) {
    modalDebug('promise...');
    const storage = weex.requireModule('storage');
    storage.setItem(key, val, (e) => {
      modalDebug('setItem result:' + JSON.stringify(e));
      if (e.result == 'success') {
        resolve(e.result);
      } else {
        reject(e);
      }
    });
  });
}

export function getStorageVal(key) {
  return new Promise(function (resolve, reject) {
    const storage = weex.requireModule('storage');
    let storageVal = '';
    storage.getItem(key, (e) => {
      console.log(e);
      if (e.result == 'success') {
        storageVal = e.data;
        resolve(storageVal);
      } else {
        reject(e);
      }
    });
  });
}

export function setStorageValue(key, val) {
  const storage = weex.requireModule('storage');
  storage.setItem(key, val, (e) => {
    if (e.result == 'success' && e.data == 'undefined') {
      console.log('setStorageValue', e);
      return true;
    }
    return false;
  });
}

export function postMessage(key, val) {
  if (whichPlatform() === 'web') {
    const storage = weex.requireModule('storage');
    storage.setItem(key, val, (e) => {
      if (e.result == 'success' && e.data == undefined) {
        console.debug(e);
        return true;
      } else {
        return false;
      }
    });
  }
}

export function receiveMessage(key, callback) {
  var data = {
    status: 1,
    val: undefined
  };
  //web
  if (whichPlatform() === 'web') {
    const storage = weex.requireModule('storage');
    var interval = setInterval(function () {
      storage.getItem(key, (e) => {
        if (e.result == 'success') {
          data.val = e.data;
          data.status = 0;
          storage.removeItem(key);
        }
      });
      console.debug(data);
      clearInterval(interval);
      callback(data);
    }, 10);
  }
}

export function modalDebug(info = '') {
  if (false) {
    const modal = weex.requireModule("modal");
    modal.toast({
      message: info,
      duration: 3
    });
  }
}

export function getUrlKey(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
}