import axios from 'axios';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Spin } from 'antd';
import "./../style/common.less";

axios.defaults.timeout = 120000;  //超时
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

let requestCount = 0;

function showLoading() {
    if (requestCount === 0) {
        var dom = document.createElement('div')
        dom.setAttribute('id', 'loading')
        document.body.appendChild(dom)
        ReactDOM.render(<Spin tip="数据正在加载中，请稍候..." size="large" />, dom)
    }
    requestCount++;
}

function hideLoading() {
    requestCount--;
    if (requestCount === 0) {
        document.body.removeChild(document.getElementById('loading'))
    }
}

axios.interceptors.request.use(config => {
    showLoading()
    return config
}, error => {
    hideLoading()
    Promise.reject(error)
})

axios.interceptors.response.use((res) => {
    hideLoading()
    if (res.status !== 200) {
        return Promise.reject(res);
    }
    return res;
}, (error) => {
    hideLoading()
    return Promise.reject(error);
});


export default function httpService(url, method, data) {
    if (method === 'get') {
        return new Promise((resolve, reject) => {
            axios.get(url)
                .then(response => {
                    resolve(response.data);
                }, err => {
                    reject(err);
                })
                .catch((error) => {
                    reject(error)
                })
        })
    } else if (method === 'post') {
        return new Promise((resolve, reject) => {
            axios.post(url, data)
                .then(response => {
                    console.log("response", response)
                    resolve(response.data);
                }, err => {
                    reject(err);
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
}