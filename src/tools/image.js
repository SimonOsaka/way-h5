import {
    getStorageValue,
    setStorageValue,
    getStorageVal,
    setStorageVal
} from './utils.js';

import {
    http
} from './http.js';

const modal = weex.requireModule("modal");

export function loadCateImageUrl(cateKey) {
    return new Promise(function (resolve, reject) {
        getStorageVal(cateKey).then(cateValue => {
            resolve(cateValue);
        }, function (e) {
            reject(e);
        });
    });
}

export function initAllCateImg() {
    return new Promise(function (resolve, reject) {
        let _this = this;
        http({
            method: "GET",
            url: "/discount/cate/all",
            headers: {},
            params: {}
        }).then(
            function (data) {
                console.log("success", data);
                if (data.code != 200) {
                    return;
                }
                let cateVersion = data.data.cateVersion;
                getStorageVal("way:discount:cateVersion").then(data => {
                    if (cateVersion != data) {
                        setStorageVal("way:discount:cateVersion", cateVersion);
                        let imgMap = data.data.commodityCateMap;
                        for (const key in imgMap) {
                            if (imgMap.hasOwnProperty(key)) {
                                const imgUrl = imgMap[key];
                                setStorageVal("way:discount:" + key, imgUrl);
                            }
                        }
                    }
                    resolve('success');
                }, error => {
                    setStorageVal("way:discount:cateVersion", cateVersion);
                    let imgMap = data.data.commodityCateMap;
                    for (const key in imgMap) {
                        if (imgMap.hasOwnProperty(key)) {
                            const imgUrl = imgMap[key];
                            setStorageVal("way:discount:" + key, imgUrl);
                        }
                    }
                });



                // getStorageVal(cateKey).then(dataImgUrl => {
                //     resolve(dataImgUrl);
                // }, error => {
                //     reject(error);
                // });
            },
            function (error) {
                console.error("failure", error);
                reject(error);
            }
        );
    });
}