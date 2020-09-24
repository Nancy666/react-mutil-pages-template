import axios from 'axios';

const service = axios.create({
    timeout: 30000 // 请求超时时间                                   
})

service.interceptors.request.use(config => {
    return config
}, error => {
    Promise.reject(error)
})

axios.interceptors.response.use((res) => {
    if (res.status !== 200) {
        return Promise.reject(res);
    }
    return res;
}, (error) => {
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