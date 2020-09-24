import appConst from "../service/appConst"
import BigNumber from "bignumber"
import React from "react";
/**
     * 亿
     */
const million = 100000000;

/**
 * 十万亿
 */
const hundredbillionmillion = 10000000000000;
/**
 * 万亿
 */
const tenbillionmillion = 1000000000000;
/**
 * 千亿
 */
const billionmillion = 100000000000;
/**
 * 百亿
 */
const thousandmillion = 10000000000;
/**
 * 十亿
 */
const hundredmillion = 1000000000;

/**
 * 万
 */
const billion = 10000;
/**
 * 十万
 */
const hundredthousand = 100000;

/**
 * 百万
 */
const onemillion = 1000000;

/**
 * 千万
 */
const tenmillion = 10000000;

export function calculateBeginDate(value) {
    if (!Number(value)) {
        return new Date();
    }

    const currentTime = (new Date()).getTime();
    const targetTime = currentTime - Number(value) * 1000 * 60 * 60 * 24;
    return new Date(targetTime);

}

export function getQueryFromUrl() {
    const arr = window.location.href.split("?");
    let paramObj;
    if (arr.length > 1) {
        const queryStr = arr[1];
        paramObj = decodeUrlParam(queryStr);
    } else {
        paramObj = null;
    }
    return paramObj;
}

export function encodeUrlParam(a) {
    const arr = [];
    let key = "";
    for (key in a) {
        arr.push(encodeURIComponent(key) + "=" + encodeURIComponent(a[key]));
    }

    return arr.join("&").replace(/%20/g, "+");
}

export function decodeUrlParam(a) {

    const arr = a.replace(/\+/g, "%20").split("&");
    const obj = {};
    let value = "";
    let arrTemp = [];
    for (value in arr) {
        arrTemp = arr[value].split("=");
        obj[decodeURIComponent(arrTemp[0])] = decodeURIComponent(arrTemp[1]);
    }
    return obj;
}

export function isArray(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
}

export function isEmpty(src) {
    return src === null || src === undefined || src.length === 0 || src === " ";
}

export function isNumber(src) {
    return src - Number.parseFloat(src) >= 0;
}

/**
 * 获取对象子级或孙子级值
 * @export
 * @param {IObj} obj target
 * @param {string} key "a.b.c"
 * @example getKey({a:{b: "c"}}, "a.b");
 * @returns {*} key值
 */
export function getKey(obj, key) {
    const keys = key.split(".");
    const currentKey = keys.shift();
    if (!obj[currentKey]) {
        return undefined;
    }
    if (!keys.length) {
        return obj[currentKey];
    }
    return getKey(obj[currentKey], keys.join("."));
}

export function convertDate(int, split) {
    const str = int + "";
    if (str.length !== 8) {
        console.log("input is wrong, for example: 20151008");
        return ["00", "00", "00"].join(split || "/");
    }

    const year = str.substr(0, 4);
    const month = str.substr(4, 2);
    const date = str.substr(6, 2);

    return [year, month, date].join(split || "/");
}

export function formatDate(time, split) {
    const year = time.getFullYear();
    const month = time.getMonth() + 1 < 10 ? "0" + (time.getMonth() + 1) : time.getMonth() + 1;
    const date = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();

    return [year, month, date].join(split || "");
}
export function colorNum(number) {
    let colorClass = ""; 
    let flag = ""; 
    // let formatNum = ""; 
    if(!isNumber(number)) return { colorClass,flag }
    if(number > 0) {
        colorClass = "red-num";
        flag = "+"
    }
    if(number < 0) {
        colorClass = "green-num";
        flag = ""
    }
    return {
        colorClass,
        flag
    }
}
//校验非空且不为0的数字
export function isValidNumber(number) {
    if(number === undefined || number === null || number === 0 || number === "0" || number === "" || Number(number) == 0) {
        return false
    }
    return true
}
export function getUrlParam(name) {
    const url = window.location.search;
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
    const r = url.substr(1).match(reg); // 匹配目标参数
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
    return undefined; // 返回参数值
}
export function queryDataUntilReady(opts, callback, errCallback) {
    var _opts = Object.assign({}, {
        condition: "",
        duration: 10000,
        interval: 100
    }, opts);
    if (eval(_opts.condition)) {
        callback();
        return;
    }
    var seconds = 0;
    var queryInterval = setInterval(function () {
        if (seconds > _opts.duration) {
            errCallback();
            clearInterval(queryInterval);
            return;
        }
        seconds += _opts.interval;
        if (eval(_opts.condition)) {
            callback();
            clearInterval(queryInterval);
        }
    }, _opts.interval);
}

export function getProtocolParams(data) {
    const productRiskConst = appConst.AppConst.riskLvl;
    const userRiskConst = appConst.AppConst.userRiskLvl;
    const tzpz = appConst.AppConst.tzpz;
    const tzqx = appConst.AppConst.tzqx;

    const userRiskTarget = userRiskConst.find((item) => item.code === data.userRiskLevel);
    const productRiskTarget = productRiskConst.find((item) => item.code === data.productRiskLevel);
    const userTzqxTarget = tzqx.find((item) => item.code === data.userInvestPeriod);
    const productTzqxTarget = tzqx.find((item) => item.code === data.productInvestPeriod);

    let custTzpz = "";
    if (data.userInvestType) {
        const userInvestType = data.userInvestType.indexOf(",") > -1 ? data.userInvestType.split(",") : data.userInvestType;
        const custTzpzArr = [];
        Array.prototype.isPrototypeOf(userInvestType)
            ? userInvestType.map((obj, idx) => {
                custTzpzArr.push(tzpz.find((item) => item.code === obj));
            })
            : custTzpzArr.push(tzpz.find((item) => item.code === userInvestType));

        custTzpzArr.map((obj, index) => {
            custTzpz += (obj ? obj.text : userInvestType[index]) + ",";
        });
    } else {
        custTzpz = data.userInvestType;
    }

    let productTzpz = "";
    if (data.productInvestType) {
        const productInvestType = data.productInvestType.indexOf(",") > -1 ? data.productInvestType.split(",") : data.productInvestType;

        const productTzpzArr = [];
        Array.prototype.isPrototypeOf(productInvestType)
            ? productInvestType.map((obj, idx) => {
                productTzpzArr.push(tzpz.find((item) => item.code === obj));
            })
            : productTzpzArr.push(tzpz.find((item) => item.code === productInvestType));

        productTzpzArr.map((obj, index) => {
            productTzpz += (obj ? obj.text : productInvestType[index]) + ",";
        });
    } else {
        productTzpz = data.productInvestType;
    }

    const params = {
        custname: data.custName ? data.custName : sessionStorage.getItem("custname"),
        fundid: data.fundId ? data.fundId : sessionStorage.getItem("fundid"),
        productname: data.fundGroupName || data.ofname,
        productRiskLevel: productRiskTarget ? productRiskTarget.text : data.productRiskLevel,
        custRiskLevel: userRiskTarget ? userRiskTarget.text : data.userRiskLevel,
        productTzqx: productTzqxTarget ? productTzqxTarget.text : data.productInvestPeriod || "",
        custTzqx: userTzqxTarget ? userTzqxTarget.text : data.userInvestPeriod || "",
        tzpz: productTzpz ? productTzpz.slice(0, -1) : productTzpz,
        custTzpz: custTzpz ? custTzpz.slice(0, -1) : custTzpz,
        investPeriodFlag: data.investPeriodFlag === "0" ? "匹配" : "不匹配",
        investTypeFlag: data.investTypeFlag === "0" ? "匹配" : "不匹配",
        custConfirmDate: data.custConfirmDate ? data.custConfirmDate : "",
        custRiskLevelFlag: data.custRiskLevelFlag === "0" ? "匹配" : "不匹配"
    };
    console.log(params);
    let paramList = "";
    for (const key in params) {
        paramList += key + "=" + params[key] + "&";
    }
    paramList = paramList.slice(0, -1);
    return {
        params: params,
        paramList: "?" + paramList
    };
}

// 根据OTC码表做适当性匹配
export function getProtocolParamsOTC(data) {
    const productRiskConst = appConst.AppConst.bankRiskLv1;
    const userRiskConst = appConst.AppConst.userRiskLvl;
    const tzpz = appConst.AppConst.bankTzpz;
    const tzqx = appConst.AppConst.tzqx;

    const userRiskTarget = userRiskConst.find((item) => item.code === data.userRiskLevel);
    const productRiskTarget = productRiskConst.find((item) => item.code === data.productRiskLevel);
    const userTzqxTarget = tzqx.find((item) => item.code === data.userInvestPeriod);
    const productTzqxTarget = tzqx.find((item) => item.code === data.productInvestPeriod);

    let custTzpz = "";
    if (data.userInvestType) {
        const userInvestType = data.userInvestType.indexOf(",") > -1 ? data.userInvestType.split(",") : data.userInvestType;
        const custTzpzArr = [];
        Array.prototype.isPrototypeOf(userInvestType) ?
            userInvestType.map((obj, idx) => {
                custTzpzArr.push(tzpz.find((item) => item.code === obj));
            }) :
            custTzpzArr.push(tzpz.find((item) => item.code === userInvestType));

        custTzpzArr.map((obj, index) => {
            custTzpz += (obj ? obj.text : userInvestType[index]) + ",";
        });
    } else {
        custTzpz = data.userInvestType;
    }

    let productTzpz = "";
    if (data.productInvestType) {
        const productInvestType = data.productInvestType.indexOf(",") > -1 ? data.productInvestType.split(",") : data.productInvestType;

        const productTzpzArr = [];
        Array.prototype.isPrototypeOf(productInvestType) ?
            productInvestType.map((obj, idx) => {
                productTzpzArr.push(tzpz.find((item) => item.code === obj));
            }) :
            productTzpzArr.push(tzpz.find((item) => item.code === productInvestType));

        productTzpzArr.map((obj, index) => {
            productTzpz += (obj ? obj.text : productInvestType[index]) + ",";
        });
    } else {
        productTzpz = data.productInvestType;
    }

    const params = {
        custname: data.custName ? data.custName : sessionStorage.getItem("custname"),
        fundid: data.fundId ? data.fundId : sessionStorage.getItem("fundid"),
        productname: data.ofname || "--",
        productRiskLevel: productRiskTarget ? productRiskTarget.text : data.productRiskLevel,
        custRiskLevel: userRiskTarget ? userRiskTarget.text : data.userRiskLevel,
        productTzqx: productTzqxTarget ? productTzqxTarget.text : data.productInvestPeriod || "",
        custTzqx: userTzqxTarget ? userTzqxTarget.text : data.userInvestPeriod || "",
        tzpz: productTzpz ? productTzpz.slice(0, -1) : productTzpz,
        custTzpz: custTzpz ? custTzpz.slice(0, -1) : custTzpz,
        investPeriodFlag: data.investPeriodFlag === "0" ? "匹配" : "不匹配",
        investTypeFlag: data.investTypeFlag === "0" ? "匹配" : "不匹配",
        custConfirmDate: data.custConfirmDate ? data.custConfirmDate : "",
        custRiskLevelFlag: data.custRiskLevelFlag === "0" ? "匹配" : "不匹配"
    };

    let paramList = "";
    for (const key in params) {
        paramList += key + "=" + params[key] + "&";
    }
    paramList = paramList.slice(0, -1);
    return {
        params: params,
        paramList: "?" + paramList
    };
}

export function hideInfo(str, start, end, reverse) {
    if (!str) { return str; }
    var reStart = 0;
    var reEnd = 0;
    if (end === null) {
        if (!reverse) {
            reStart = start;
            reEnd = str.length - 1;
        } else {
            reStart = 0;
            reEnd = str.length - start;
        }
    } else {
        if (!reverse) {
            reStart = start;
            reEnd = end;
        } else {
            reStart = str.length - end;
            reEnd = str.length - start;
        }
    }
    if (reEnd - reStart >= 0 && reEnd < str.length) {
        for (let i = reStart; i <= reEnd; i++) {
            let temp = str.split("");
            temp.splice(i, 1, "*");
            str = temp.join("");
        }
        return str
    }
    if (reEnd >= str.length) {
        for (var i = reStart; i < str.length; i++) {
            var temp = str.split("");
            temp.splice(i, 1, "*");
            str = temp.join("");
        }
    }

    return str;
}
export function addEventTrack(pageName, label, ofcode) {
    if (isEmpty(window.TDAPP)) {
        console.log("td-h5-website-sdk.js没有加载，请查看原因");
        return false;
    }
    const newPageName = "理财_公募基金_" + pageName + "_" + label;
    const fundid = sessionStorage.getItem("fundid") || ""; // 资金账号
    const phoneNum = sessionStorage.getItem("mobileNo") || ""; // APP手机号码 app进来取PHONE_NUM，微信进来取wechatPhoneNum
    const deviceID = sessionStorage.getItem("DEVICE_ID") || ""; // APP-IMEI码
    const kv = { "资金账号": fundid, "APP手机号码": phoneNum, "APP-IMEI码": deviceID };
    const newOfcode = ofcode || "";
    (window.TDAPP).onEvent(newPageName, newOfcode, kv);
    console.log(newPageName, newOfcode, kv);
    return null;
}
export function addPageViewTrack(pageTitle) {
    if (isEmpty(window.TDAPP)) {
        console.log("td-h5-website-sdk.js没有加载，请查看原因");
        return false;
    }
    const pageName = window.location.href;
    pageTitle = "公募基金_" + pageTitle + "页";

    window.TDAPP.onCustomPage(pageName, pageTitle);
    console.log("addPageViewTrack", pageName + pageTitle);
    return null;
}

/**
     * 数字加,分隔 
     * @example
     *   111111111 => "111,111,111"
     *
     * @method separateThousands
     * @param srcNumber
     * @return {string}
     */

export function separateThousands(srcNumber) {
    if (srcNumber === undefined || srcNumber === null) {
        return "";
    }

    return srcNumber.toString().replace(/^(-?[0-9]+)(?=\.|$)/, function (matchStr) {
        return matchStr.replace(/([0-9]+?)(?=(?:[0-9]{3})+$)/g, "$1,");
    });
}

/**
     * 是否是整数
     *
     * @static
     * @method isInteger
     * @return {boolean}
     * @param src
     */

export function isInteger(src) {
    if (isNumeric(src)) {
        // only String or Number
        if (src.toString().match(/^-?[0-9]+$/)) {
            return true;
        }
    }
    return false;
}

/**
     * 判断是不是数字
     *
     * @static
     * @method isNumeric
     * @param  src
     * @return {boolean}
     */

export function isNumeric(src) {
    return src - parseFloat(src) >= 0;
}

export function isTestUrl() {
    var returnFlag = false;
    var url = window.location.href;
    if (url.indexOf("test") > -1 || url.indexOf("local") > -1) {
        returnFlag = true;
    }
    return returnFlag;
}
/**
 * 限制输入框只能输入数字和小数点
 */

export function onlyNumber(str) {
    //得到第一个字符是否为负号
    var t = str.charAt(0);
    //先把非数字的都替换掉，除了数字和. 
    str = str.replace(/[^\d\.]/g, "");
    //必须保证第一个为数字而不是. 
    str = str.replace(/^\./g, "");
    //保证只有出现一个.而没有多个. 
    str = str.replace(/\.{2,}/g, ".");
    //保证.只出现一次，而不能出现两次以上 
    str = str.replace(".", "$#$").replace(/\./g, "").replace(
        "$#$", ".");
    //如果第一位是负号，则允许添加
    if (t == "-") {
        str = "-" + str;
    }
    if (str.length > 14) {
        str = str.slice(0, 14)
    }
    return str;
}

//金额输入添加单位
export function convertUnit(val) {
    var returnVal = "";
    if (isEmpty(val)) {
        return returnVal;
    }
    var str = String(val);
    if (isNumeric(str)) {
        var bigNumberVal = new BigNumber(val);
        if (bigNumberVal.comparedTo(new BigNumber(hundredbillionmillion)) >= 0) {
            returnVal = "十万亿";
        } else if (bigNumberVal.comparedTo(new BigNumber(tenbillionmillion)) >= 0) {
            returnVal = "万亿";
        } else if (bigNumberVal.comparedTo(new BigNumber(billionmillion)) >= 0) {
            returnVal = "千亿";
        } else if (bigNumberVal.comparedTo(new BigNumber(thousandmillion)) >= 0) {
            returnVal = "百亿";
        } else if (bigNumberVal.comparedTo(new BigNumber(hundredmillion)) >= 0) {
            returnVal = "十亿";
        } else if (bigNumberVal.comparedTo(new BigNumber(million)) >= 0) {
            returnVal = "亿";
        } else if (bigNumberVal.comparedTo(new BigNumber(tenmillion)) >= 0) {
            returnVal = "千万";
        } else if (bigNumberVal.comparedTo(new BigNumber(onemillion)) >= 0) {
            returnVal = "百万";
        } else if (bigNumberVal.comparedTo(new BigNumber(hundredthousand)) >= 0) {
            returnVal = "十万";
        } else if (bigNumberVal.comparedTo(new BigNumber(billion)) >= 0) {
            returnVal = "万";
        }
    }
    return returnVal;
};

export function rateFormat(val) {
    let _val = new BigNumber(val);
    _val = _val.multipliedBy(100);
    return _val.toFixed(2) + "%";
}

export function getRelativeDays(milliseconds, refMilliseconds) {
    let dayRatio = 3600 * 24 * 1000;
    let relDays = (milliseconds - (refMilliseconds || 0)) / dayRatio;
    return relDays > 0 ? Math.floor(relDays) : Math.ceil(relDays);
}
export function toFixFloor(text, roundTyp, pricePrecision) {
    var decimalPlace = 2;
    if (roundTyp === 0) {
        roundTyp = BigNumber.ROUND_DOWN;
    } else {
        roundTyp = BigNumber.ROUND_HALF_UP;
    }
    if (typeof pricePrecision === "undefined" || pricePrecision === null || pricePrecision === "") {
        decimalPlace = 2;
    } else {
        decimalPlace = pricePrecision;
    }

    if (isNumeric(text) && (new BigNumber(text).comparedTo(new BigNumber("0")) != 0)) {
        return new BigNumber(text).integerValue(roundTyp).toFixed(decimalPlace);
    }
    if (isNumeric(text) && Number(text) == 0) {
        return parseFloat("0").toFixed(decimalPlace);
    }
    return "-";
}
export function toFixedValue(text, roundTyp) {
    if (isNumeric(text)) {
        return parseFloat(text).toFixed(roundTyp)
    }
    return "--"
}
export function detailDateFormat(date, ignore) {
    var time = "";
    if (!isEmpty(date)) {
        var year = date.substr(0, 4);
        var month = date.substr(4, 2);
        var day = date.substr(6, 2);
        if(ignore === "year") {
            time = month + "-" + day;
        }else {
            time = year + "-" + month + "-" + day;
        }
    }
    return time;
};
export function FundDateFormat(date, ignore) {
    var time = "";
    if (!isEmpty(date)) {
        var year = date.substr(0, 4);
        var month = date.substr(4, 2);
        var day = date.substr(6, 2);
        if(ignore === "date") {
            time = year + "." + month;
        }else {
            time = year + "." + month + "." + day;
        }
    }
    return time;
};
export function formatDateStr(value) {
    var newvalue = value.length < 2 ? "0" + value : value;
    return newvalue;
};

export function getPhoneNum(userDataJson, key) {
    let userData = [{ PHONE_NUM: ""}]
    if(typeof userDataJson === "string") {
        userData = JSON.parse(userDataJson)
    } else {
        userData = userDataJson
    }
    if(userData) {
        let userDataAry = userData[key];
        if(userDataAry) {
            let userDataEle = userDataAry[0];
            if(userDataEle) {
                let phone_num = userDataEle.PHONE_NUM;
                if(phone_num !== undefined || phone_num !== null) {
                    sessionStorage.setItem("PHONE_NUM", phone_num); // APP手机号码
                    return phone_num;
                }
            }
        }
    }
    return "";
}
export function arrayFill() {
    if (!Array.prototype.find) {
        // eslint-disable-next-line no-extend-native
        Array.prototype.find = function(predicate) {
            "use strict";
            if (this == null) {
                throw new TypeError("Array.prototype.find called on null or undefined");
            }
            if (typeof predicate !== "function") {
                throw new TypeError("predicate must be a function");
            }
            var list = Object(this);
            var length = list.length >>> 0;
            var thisArg = arguments[1];
            var value;
            for (var i = 0; i < length; i++) {
                value = list[i];
                if (predicate.call(thisArg, value, i, list)) {
                    return value;
                }
            }
            return undefined
        }
    }
}

/**
 * 验证最大两位小数的正实数
 * @param value
 * @returns {boolean}
 */
export function up2DecimalPlaces(value){
    let newValue = (value != '' && value.substr(0,1) == '.') ? '' : value;
    newValue = newValue.replace(/^0+[0-9]+/g, "0"); //不能以0开头输入
    newValue = newValue.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
    newValue = newValue.replace(/\.{2,}/g,"."); //只保留第一个, 清除多余的
    newValue  = newValue.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    newValue = newValue.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
    return newValue;
}

/**
 * 智多鑫验证最大两位小数的正实数
 * @param value
 * @returns {boolean}
 */
export function up2DecimalPlacesZdx(value){
    let newValue = (value != '' && value.substr(0,1) == '.') ? '' : value;
    newValue = newValue.replace(/^0+[0-9]+/g, "0"); //不能以0开头输入
    newValue = newValue.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
    newValue = newValue.replace(/\.{2,}/g,"."); //只保留第一个, 清除多余的
    newValue  = newValue.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    return newValue;
}

/**
 * 格式化盈亏
 * @param attr
 * @returns {*}
 */
export function formatValue(attr){
    if (attr === undefined || attr == null || attr === "") {
        return <span  style={{color:"#666666",fontSize:"14px"}} >--</span>;
    } else if (attr > 0) {
        return <span  style={{color:"#E90007",fontSize:"14px"}} >{attr !== undefined && attr != null ? attr : '--'}</span>;
    } else if (Object.is(attr,"0.00")) {
        return <span style={{color:"#666666",fontSize:"14px"}} >0.00</span>;
    } else {
        return <span style={{color:"#0DB14B",fontSize:"14px"}} >{attr !== undefined && attr != null ? attr : '--'}</span>;
    }
}


/**
 * 格式化普通字段
 * @param attr
 * @returns {*}
 */
export function formatCommonValue (attr){
    if (attr === undefined || attr == null || attr === "") {
        return <span style={{color:"#666666",fontSize:"14px"}}>--</span>;
    }  else {
        return <span  style={{color:"#666666",fontSize:"14px"}}>{attr !== undefined && attr != null ? attr : '--'}</span>;
    }
};



